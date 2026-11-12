export interface BloodBank {
  id: string;
  name: string;
  city: string;
  state: string;
  location: {
    lat: number;
    lng: number;
  };
  stock: Record<string, number>;
  lastUpdatedAt: string;
}
