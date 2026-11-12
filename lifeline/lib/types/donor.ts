export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface DonorLocation {
  lat: number;
  lng: number;
  city: string;
  state: string;
}

export interface Donor {
  id: string;
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  location: DonorLocation;
  lastDonationDate: string | null;
  isAvailable: boolean;
  isEligible: boolean;
  responseRate: number;
  reliabilityScore: number;
  lastUpdatedAt: string;
}
