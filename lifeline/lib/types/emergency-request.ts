import type { BloodGroup } from "@/lib/types/donor";

export type RequestUrgency = "critical" | "high" | "medium" | "low";

export interface EmergencyRequest {
  id: string;
  hospitalId: string;
  patientBloodGroup: BloodGroup;
  urgency: RequestUrgency;
  location: {
    lat: number;
    lng: number;
    hospitalName: string;
    city: string;
  };
  createdAt: string;
  status: "open" | "triaged" | "matched" | "dispatched" | "resolved";
  notes?: string;
  assignedDonorId?: string;
  assignedBankId?: string;
}
