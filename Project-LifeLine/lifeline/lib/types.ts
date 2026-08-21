export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type UrgencyLevel = "critical" | "high" | "medium";

export interface Location {
  lat: number;
  lng: number;
  label: string;
}

export interface Donor {
  id: string;
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  location: Location;
  available: boolean;
  reliabilityScore: number; // 0 to 1, based on past show-up rate
  lastDonationDate: string;
}

export interface BankInventoryUnit {
  id: string;
  bankId: string;
  bankName: string;
  location: Location;
  bloodGroup: BloodGroup;
  unitsAvailable: number;
  expiryDate: string; // ISO date
}

export interface BloodRequest {
  id: string;
  hospitalName: string;
  location: Location;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  urgency: UrgencyLevel;
  status: "open" | "matched" | "confirmed" | "escalated";
  createdAt: string;
}

export type MatchSourceType = "donor" | "bank";

export interface MatchResult {
  sourceType: MatchSourceType;
  sourceId: string;
  sourceName: string;
  bloodGroup: BloodGroup;
  distanceKm: number;
  score: number;
  breakdown: {
    urgency: number;
    proximity: number;
    expiry: number;
    reliability: number;
  };
}
