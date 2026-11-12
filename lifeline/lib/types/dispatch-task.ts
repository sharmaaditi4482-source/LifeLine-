export interface DispatchTask {
  id: string;
  requestId: string;
  assignedVehicle: "rider" | "ambulance" | "driver";
  assignedRiderId?: string;
  etaMinutes: number;
  status: "pending" | "enroute" | "delivered";
  createdAt: string;
}
