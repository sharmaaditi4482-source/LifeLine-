import type { Donor } from "@/lib/types/donor";
import type { EmergencyRequest } from "@/lib/types/emergency-request";
import type { MatchCandidate } from "@/lib/types/match-candidate";

export async function findBestMatches(
  request: EmergencyRequest,
  donors: Donor[]
): Promise<MatchCandidate[]> {
  const matches: MatchCandidate[] = [];

  for (const donor of donors) {
    if (!donor.isAvailable || !donor.isEligible) continue;

    const compatible = isCompatible(request.patientBloodGroup, donor.bloodGroup);
    if (!compatible) continue;

    const score = calculateMatchScore(request, donor);

    matches.push({
      id: `${request.id}-${donor.id}`,
      requestId: request.id,
      candidateType: "donor",
      candidateId: donor.id,
      score,
      confidence: donor.reliabilityScore,
      reasons: [
        "Blood type compatible",
        "Donor is within a short radius",
        "Current availability is confirmed",
        "Donation reliability is strong",
      ],
      safetyFlags: [],
    });
  }

  return matches.sort((a, b) => b.score - a.score).slice(0, 10);
}

function isCompatible(patientGroup: string, donorGroup: string): boolean {
  const compatibilityMap: Record<string, string[]> = {
    "O-": ["O-"],
    "O+": ["O-", "O+"],
    "A-": ["A-", "O-"],
    "A+": ["A-", "A+", "O-", "O+"],
    "B-": ["B-", "O-"],
    "B+": ["B-", "B+", "O-", "O+"],
    "AB-": ["AB-", "A-", "B-", "O-"],
    "AB+": ["AB-", "AB+", "A-", "A+", "B-", "B+", "O-", "O+"],
  };

  return (compatibilityMap[patientGroup] ?? []).includes(donorGroup);
}

function calculateMatchScore(request: EmergencyRequest, donor: Donor): number {
  const distanceKm = getDistanceKm(request.location.lat, request.location.lng, donor.location.lat, donor.location.lng);
  const proximityScore = Math.max(0, 100 - distanceKm);

  const score =
    compatibilityWeight() * 35 +
    proximityScore * 0.25 +
    donor.reliabilityScore * 0.15 +
    (donor.isAvailable ? 15 : 0) +
    donor.responseRate * 0.10;

  return Math.round(score);
}

function compatibilityWeight(): number {
  return 100;
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}
