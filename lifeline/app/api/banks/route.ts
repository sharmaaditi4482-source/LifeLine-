import { NextRequest, NextResponse } from "next/server";
import { getBankUnits, addBankUnit } from "@/lib/store";
import { BankInventoryUnit } from "@/lib/types";

export async function GET() {
  try {
    const bankUnitsList = await getBankUnits();
    return NextResponse.json({ bankUnits: bankUnitsList });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch bank stock." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bankName, bloodGroup, unitsAvailable, expiryDays, location } = body;

    if (!bankName || !bloodGroup || !unitsAvailable) {
      return NextResponse.json({ error: "Missing required stock fields." }, { status: 400 });
    }

    const expDate = new Date();
    expDate.setDate(expDate.getDate() + (Number(expiryDays) || 30));

    const newUnit: BankInventoryUnit = {
      id: `unit_${Date.now()}`,
      bankId: `bank_${bankName.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
      bankName,
      location: location || { lat: 28.6139, lng: 77.2090, label: "Regional Blood Center, Delhi" },
      bloodGroup,
      unitsAvailable: Number(unitsAvailable),
      expiryDate: expDate.toISOString(),
    };

    await addBankUnit(newUnit);
    return NextResponse.json({ success: true, unit: newUnit });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add bank stock." }, { status: 500 });
  }
}
