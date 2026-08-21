import { NextResponse } from "next/server";
import { getBankUnits } from "@/lib/store";

export async function GET() {
  try {
    const bankUnitsList = await getBankUnits();
    return NextResponse.json({ bankUnits: bankUnitsList });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch bank stock." }, { status: 500 });
  }
}
