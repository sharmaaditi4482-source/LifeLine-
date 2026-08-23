import { supabase } from "./supabaseClient";
import { Donor, BankInventoryUnit, BloodRequest } from "./types";

// Seed fallback data for robust offline & resilient operation
const SEED_DONORS: Donor[] = [
  {
    id: "d1",
    name: "Dr. Ananya Verma",
    phone: "+91 98112 34567",
    bloodGroup: "O-",
    location: { lat: 28.5672, lng: 77.2100, label: "Safdarjung Enclave, Delhi" },
    available: true,
    reliabilityScore: 0.96,
    lastDonationDate: "2026-06-10",
  },
  {
    id: "d2",
    name: "Rohit Malhotra",
    phone: "+91 98710 98765",
    bloodGroup: "O+",
    location: { lat: 28.5800, lng: 77.2300, label: "Lajpat Nagar, Delhi" },
    available: true,
    reliabilityScore: 0.88,
    lastDonationDate: "2026-05-20",
  },
  {
    id: "d3",
    name: "Kavita Rao",
    phone: "+91 99100 12345",
    bloodGroup: "A+",
    location: { lat: 28.5355, lng: 77.2090, label: "Saket, Delhi" },
    available: true,
    reliabilityScore: 0.92,
    lastDonationDate: "2026-07-01",
  },
  {
    id: "d4",
    name: "Arjun Mehta",
    phone: "+91 98101 23456",
    bloodGroup: "B+",
    location: { lat: 28.6304, lng: 77.2177, label: "Connaught Place, Delhi" },
    available: true,
    reliabilityScore: 0.85,
    lastDonationDate: "2026-04-18",
  },
  {
    id: "d5",
    name: "Neha Sharma",
    phone: "+91 97110 54321",
    bloodGroup: "AB+",
    location: { lat: 28.6139, lng: 77.2090, label: "Janpath, Delhi" },
    available: true,
    reliabilityScore: 0.79,
    lastDonationDate: "2026-05-11",
  },
  {
    id: "d6",
    name: "Suresh Iyer",
    phone: "+91 98200 45678",
    bloodGroup: "O+",
    location: { lat: 19.0760, lng: 72.8777, label: "Bandra, Mumbai" },
    available: true,
    reliabilityScore: 0.94,
    lastDonationDate: "2026-06-25",
  },
  {
    id: "d7",
    name: "Pooja Hegde",
    phone: "+91 98450 78901",
    bloodGroup: "B+",
    location: { lat: 12.9716, lng: 77.5946, label: "Indiranagar, Bengaluru" },
    available: true,
    reliabilityScore: 0.91,
    lastDonationDate: "2026-07-10",
  }
];

const SEED_BANK_UNITS: BankInventoryUnit[] = [
  {
    id: "b1",
    bankId: "bank_redcross",
    bankName: "Red Cross Blood Bank Delhi",
    location: { lat: 28.6219, lng: 77.2144, label: "Red Cross Rd, Delhi" },
    bloodGroup: "O+",
    unitsAvailable: 8,
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "b2",
    bankId: "bank_rotary",
    bankName: "Rotary Central Blood Bank",
    location: { lat: 28.5600, lng: 77.2200, label: "South Extension, Delhi" },
    bloodGroup: "O-",
    unitsAvailable: 3,
    expiryDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "b3",
    bankId: "bank_apollo",
    bankName: "Indraprastha Apollo Blood Center",
    location: { lat: 28.5390, lng: 77.2840, label: "Sarita Vihar, Delhi" },
    bloodGroup: "A+",
    unitsAvailable: 6,
    expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "b4",
    bankId: "bank_max",
    bankName: "Max Smart Blood Bank",
    location: { lat: 28.5280, lng: 77.2140, label: "Saket, Delhi" },
    bloodGroup: "B+",
    unitsAvailable: 4,
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

let inMemoryRequests: BloodRequest[] = [];
let inMemoryDonors: Donor[] = [...SEED_DONORS];
let inMemoryBankUnits: BankInventoryUnit[] = [...SEED_BANK_UNITS];

// Helper mapper functions

export function mapDonorFromDb(row: any): Donor {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    bloodGroup: row.blood_group as any,
    location: {
      lat: Number(row.lat),
      lng: Number(row.lng),
      label: row.location_label || row.city || "Verified Location",
    },
    available: row.available ?? true,
    reliabilityScore: Number(row.reliability_score || 0.9),
    lastDonationDate: row.last_donation_date || "2026-06-01",
  };
}

export function mapDonorToDb(donor: Donor) {
  return {
    id: donor.id,
    name: donor.name,
    phone: donor.phone,
    blood_group: donor.bloodGroup,
    lat: donor.location.lat,
    lng: donor.location.lng,
    location_label: donor.location.label,
    available: donor.available,
    reliability_score: donor.reliabilityScore,
    last_donation_date: donor.lastDonationDate,
  };
}

export function mapBankUnitFromDb(row: any): BankInventoryUnit {
  return {
    id: row.id,
    bankId: row.bank_id || row.id,
    bankName: row.bank_name || "Regional Blood Center",
    location: {
      lat: Number(row.lat),
      lng: Number(row.lng),
      label: row.location_label || "City Blood Bank",
    },
    bloodGroup: row.blood_group as any,
    unitsAvailable: Number(row.units_available || 1),
    expiryDate: row.expiry_date || new Date(Date.now() + 15 * 86400000).toISOString(),
  };
}

export function mapBankUnitToDb(unit: BankInventoryUnit) {
  return {
    id: unit.id,
    bank_id: unit.bankId,
    bank_name: unit.bankName,
    blood_group: unit.bloodGroup,
    lat: unit.location.lat,
    lng: unit.location.lng,
    location_label: unit.location.label,
    units_available: unit.unitsAvailable,
    expiry_date: unit.expiryDate,
  };
}

export function mapRequestFromDb(row: any): BloodRequest {
  return {
    id: row.id,
    hospitalName: row.hospital_name,
    location: {
      lat: Number(row.lat),
      lng: Number(row.lng),
      label: row.location_label || "Hospital",
    },
    bloodGroup: row.blood_group as any,
    unitsNeeded: Number(row.units_needed || 1),
    urgency: row.urgency as any,
    status: row.status as any,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapRequestToDb(req: BloodRequest) {
  return {
    id: req.id,
    hospital_name: req.hospitalName,
    blood_group: req.bloodGroup,
    units_needed: req.unitsNeeded,
    urgency: req.urgency,
    lat: req.location.lat,
    lng: req.location.lng,
    location_label: req.location.label,
    status: req.status,
    created_at: req.createdAt,
  };
}

// Resilient DB query wrappers

export async function getDonors(): Promise<Donor[]> {
  try {
    const { data, error } = await supabase.from("donors").select("*");
    if (!error && data && data.length > 0) {
      return data.map(mapDonorFromDb);
    }
  } catch (err) {
    console.warn("Using in-memory donors cache:", err);
  }
  return inMemoryDonors;
}

export async function addDonor(donor: Donor): Promise<Donor> {
  inMemoryDonors.unshift(donor);
  try {
    await supabase.from("donors").insert(mapDonorToDb(donor));
  } catch (err) {
    console.warn("Could not sync donor to Supabase, saved to local cache:", err);
  }
  return donor;
}

export async function getBankUnits(): Promise<BankInventoryUnit[]> {
  try {
    const { data, error } = await supabase.from("bank_inventory").select("*");
    if (!error && data && data.length > 0) {
      return data.map(mapBankUnitFromDb);
    }
  } catch (err) {
    console.warn("Using in-memory bank units cache:", err);
  }
  return inMemoryBankUnits;
}

export async function addBankUnit(unit: BankInventoryUnit): Promise<BankInventoryUnit> {
  inMemoryBankUnits.unshift(unit);
  try {
    await supabase.from("bank_inventory").insert(mapBankUnitToDb(unit));
  } catch (err) {
    console.warn("Could not sync bank unit to Supabase, saved to local cache:", err);
  }
  return unit;
}

export async function addRequest(req: BloodRequest): Promise<BloodRequest> {
  inMemoryRequests.unshift(req);
  try {
    await supabase.from("requests").insert(mapRequestToDb(req));
  } catch (err) {
    console.warn("Could not sync request to Supabase, saved to local cache:", err);
  }
  return req;
}

export async function getRequestById(id: string): Promise<BloodRequest | null> {
  const local = inMemoryRequests.find((r) => r.id === id);
  if (local) return local;

  try {
    const { data, error } = await supabase.from("requests").select("*").eq("id", id).single();
    if (!error && data) {
      return mapRequestFromDb(data);
    }
  } catch (err) {
    console.warn("Error fetching request by id:", err);
  }
  return null;
}

export async function updateRequestStatus(id: string, status: string): Promise<void> {
  const local = inMemoryRequests.find((r) => r.id === id);
  if (local) local.status = status as any;

  try {
    await supabase.from("requests").update({ status }).eq("id", id);
  } catch (err) {
    console.warn("Could not update request status in Supabase:", err);
  }
}
