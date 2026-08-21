import { NextRequest, NextResponse } from "next/server";
import { getDonors, addDonor } from "@/lib/store";
import { Donor, BloodGroup } from "@/lib/types";

export async function GET() {
  try {
    const donorsList = await getDonors();
    return NextResponse.json({ donors: donorsList });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch donors." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, bloodGroup, location } = body;

    if (!name || !phone || !bloodGroup || !location) {
      return NextResponse.json(
        { error: "Missing required fields: name, phone, bloodGroup, location." },
        { status: 400 }
      );
    }

    const validBloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodGroups.includes(bloodGroup)) {
      return NextResponse.json({ error: "Invalid blood group." }, { status: 400 });
    }

    const newDonor: Donor = {
      id: `d${Date.now()}`,
      name,
      phone,
      bloodGroup,
      location,
      available: true,
      reliabilityScore: 0.75, // default starting reliability for new donors
      lastDonationDate: new Date().toISOString().split("T")[0],
    };

    await addDonor(newDonor);

    return NextResponse.json({ success: true, donor: newDonor }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to register donor." }, { status: 500 });
  }
}
