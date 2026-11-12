import type { EmergencyRequest } from "@/lib/types/emergency-request";

export async function submitEmergencyRequest(data: Partial<EmergencyRequest>) {
  const request: EmergencyRequest = {
    id: crypto.randomUUID(),
    hospitalId: data.hospitalId ?? "hospital-default",
    patientBloodGroup: data.patientBloodGroup ?? "O-",
    urgency: data.urgency ?? "critical",
    location: {
      lat: data.location?.lat ?? 28.6139,
      lng: data.location?.lng ?? 77.209,
      hospitalName: data.location?.hospitalName ?? "Default Hospital",
      city: data.location?.city ?? "Delhi",
    },
    createdAt: new Date().toISOString(),
    status: "open",
    notes: data.notes ?? "",
  };

  return request;
}
