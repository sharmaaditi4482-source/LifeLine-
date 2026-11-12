export interface Hospital {
  id: string;
  name: string;
  city: string;
  state: string;
  location: {
    lat: number;
    lng: number;
  };
  inventory: Record<string, number>;
  priority: "low" | "medium" | "high" | "critical";
  contactPhone: string;
}
