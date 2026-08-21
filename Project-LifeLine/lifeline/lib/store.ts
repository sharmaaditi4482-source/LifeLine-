import { supabase } from "./supabaseClient";
import { Donor, BankInventoryUnit, BloodRequest } from "./types";

// Helper mapper functions to convert database flat structures to matching engine shapes

export function mapDonorFromDb(row: any): Donor {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    bloodGroup: row.blood_group as any,
    location: {
      lat: Number(row.lat),
      lng: Number(row.lng),
      label: row.location_label,
    },
    available: row.available,
    reliabilityScore: Number(row.reliability_score),
    lastDonationDate: row.last_donation_date,
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
    bankId: row.bank_id,
    bankName: row.bank_name,
    location: {
      lat: Number(row.lat),
      lng: Number(row.lng),
      label: row.location_label,
    },
    bloodGroup: row.blood_group as any,
    unitsAvailable: row.units_available,
    expiryDate: row.expiry_date,
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
      label: row.location_label,
    },
    bloodGroup: row.blood_group as any,
    unitsNeeded: row.units_needed,
    urgency: row.urgency as any,
    status: row.status as any,
    createdAt: row.created_at,
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

// Supabase DB query wrappers

export async function getDonors(): Promise<Donor[]> {
  const { data, error } = await supabase
    .from("donors")
    .select("*");

  if (error) {
    console.error("Error fetching donors:", error);
    return [];
  }
  return (data || []).map(mapDonorFromDb);
}

export async function addDonor(donor: Donor): Promise<Donor> {
  const { error } = await supabase
    .from("donors")
    .insert(mapDonorToDb(donor));

  if (error) {
    console.error("Error inserting donor:", error);
    throw new Error(error.message);
  }
  return donor;
}

export async function getBankUnits(): Promise<BankInventoryUnit[]> {
  const { data, error } = await supabase
    .from("bank_inventory")
    .select("*");

  if (error) {
    console.error("Error fetching bank units:", error);
    return [];
  }
  return (data || []).map(mapBankUnitFromDb);
}

export async function addRequest(req: BloodRequest): Promise<BloodRequest> {
  const { error } = await supabase
    .from("requests")
    .insert(mapRequestToDb(req));

  if (error) {
    console.error("Error inserting request:", error);
    throw new Error(error.message);
  }
  return req;
}

export async function getRequestById(id: string): Promise<BloodRequest | null> {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching request:", error);
    return null;
  }
  return data ? mapRequestFromDb(data) : null;
}

export async function updateRequestStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from("requests")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating request status:", error);
    throw new Error(error.message);
  }
}
