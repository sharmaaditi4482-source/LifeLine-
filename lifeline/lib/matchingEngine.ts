import {
  BloodGroup,
  BloodRequest,
  Donor,
  BankInventoryUnit,
  MatchResult,
  UrgencyLevel,
} from "./types";

/**
 * ============================================================
 * LIFELINE MATCHING ENGINE
 * ============================================================
 * This is the core differentiator of the product.
 * Two-stage process:
 *   1. HARD SAFETY FILTER — ABO/Rh compatibility (never skipped)
 *   2. WEIGHTED SCORING — ranks the safe candidates
 *
 * Score = 0.35*Urgency + 0.30*Proximity + 0.20*Expiry + 0.15*Reliability
 * ============================================================
 */

// Who can SAFELY donate to whom (recipient -> list of compatible donor blood groups)
const COMPATIBILITY_MAP: Record<BloodGroup, BloodGroup[]> = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], // universal recipient
};

/** Step 1: Hard compatibility filter. NEVER bypass this. */
export function isCompatible(
  recipientBloodGroup: BloodGroup,
  donorBloodGroup: BloodGroup
): boolean {
  return COMPATIBILITY_MAP[recipientBloodGroup].includes(donorBloodGroup);
}

/** Haversine distance in km between two lat/lng points */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function urgencyScore(urgency: UrgencyLevel): number {
  switch (urgency) {
    case "critical":
      return 1;
    case "high":
      return 0.7;
    case "medium":
      return 0.4;
  }
}

/** Closer = higher score. Normalized against a 50km reference radius. */
function proximityScore(km: number): number {
  const MAX_RELEVANT_KM = 50;
  const clamped = Math.min(km, MAX_RELEVANT_KM);
  return 1 - clamped / MAX_RELEVANT_KM;
}

/** Sooner-to-expire stock scores HIGHER, so it gets used before it's wasted.
 *  Donors (no expiry) get a neutral 0.5 so they're not penalized. */
function expiryScore(expiryDate: string | null): number {
  if (!expiryDate) return 0.5;
  const daysLeft =
    (new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (daysLeft <= 0) return 0; // already expired, should be filtered out earlier
  const MAX_RELEVANT_DAYS = 30;
  const clamped = Math.min(daysLeft, MAX_RELEVANT_DAYS);
  return 1 - clamped / MAX_RELEVANT_DAYS;
}

export interface MatchOptions {
  donors: Donor[];
  bankUnits: BankInventoryUnit[];
}

/**
 * Main entry point: given a request, return a ranked list of safe matches.
 */
export function matchRequest(
  request: BloodRequest,
  { donors, bankUnits }: MatchOptions
): MatchResult[] {
  const results: MatchResult[] = [];

  // --- Candidate donors ---
  for (const donor of donors) {
    if (!donor.available) continue;
    if (!isCompatible(request.bloodGroup, donor.bloodGroup)) continue;

    const dist = distanceKm(
      request.location.lat,
      request.location.lng,
      donor.location.lat,
      donor.location.lng
    );

    const breakdown = {
      urgency: urgencyScore(request.urgency),
      proximity: proximityScore(dist),
      expiry: expiryScore(null),
      reliability: donor.reliabilityScore,
    };

    const score =
      0.35 * breakdown.urgency +
      0.3 * breakdown.proximity +
      0.2 * breakdown.expiry +
      0.15 * breakdown.reliability;

    results.push({
      sourceType: "donor",
      sourceId: donor.id,
      sourceName: donor.name,
      bloodGroup: donor.bloodGroup,
      distanceKm: Math.round(dist * 10) / 10,
      score: Math.round(score * 1000) / 1000,
      breakdown,
    });
  }

  // --- Candidate bank stock ---
  for (const unit of bankUnits) {
    if (unit.unitsAvailable <= 0) continue;
    if (!isCompatible(request.bloodGroup, unit.bloodGroup)) continue;
    if (new Date(unit.expiryDate).getTime() <= Date.now()) continue; // expired stock never surfaces

    const dist = distanceKm(
      request.location.lat,
      request.location.lng,
      unit.location.lat,
      unit.location.lng
    );

    const breakdown = {
      urgency: urgencyScore(request.urgency),
      proximity: proximityScore(dist),
      expiry: expiryScore(unit.expiryDate),
      reliability: 1, // bank stock is always "reliable" (no-show risk doesn't apply)
    };

    const score =
      0.35 * breakdown.urgency +
      0.3 * breakdown.proximity +
      0.2 * breakdown.expiry +
      0.15 * breakdown.reliability;

    results.push({
      sourceType: "bank",
      sourceId: unit.id,
      sourceName: unit.bankName,
      bloodGroup: unit.bloodGroup,
      distanceKm: Math.round(dist * 10) / 10,
      score: Math.round(score * 1000) / 1000,
      breakdown,
    });
  }

  // Rank highest score first
  return results.sort((a, b) => b.score - a.score);
}
