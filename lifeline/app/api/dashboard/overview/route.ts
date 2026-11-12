import { NextResponse } from "next/server";
import { getDonors, getHospitals, getRequests } from "@/lib/store";

export const runtime = "nodejs";

/** Dashboard metrics from the same application store used by operational APIs. */
export async function GET() {
  try {
    const [requests, donors, hospitals] = await Promise.all([
      getRequests(),
      getDonors(),
      getHospitals(),
    ]);

    const lowStock = hospitals.flatMap((hospital) =>
      Object.entries(hospital.inventory)
        .filter(([, units]) => units < 5)
        .map(([bloodGroup, units]) => ({
          id: `${hospital.id}-${bloodGroup}`,
          hospital: hospital.name,
          bloodGroup,
          units,
        }))
    );

    const activeRequests = requests.filter(
      (request) => request.status !== "confirmed"
    );

    return NextResponse.json({
      data: {
        stats: {
          openCases: requests.filter((request) => request.status === "open").length,
          matchedCases: requests.filter((request) => request.status === "matched").length,
          confirmedCases: requests.filter((request) => request.status === "confirmed").length,
          availableDonors: donors.filter((donor) => donor.available && donor.eligibility?.isEligible).length,
          criticalAlerts:
            requests.filter((request) => request.urgency === "critical" && request.status !== "confirmed").length +
            lowStock.length,
        },
        requests: activeRequests.slice(0, 8).map((request) => ({
          id: request.id,
          hospitalName: request.hospitalName,
          bloodGroup: request.bloodGroup,
          unitsNeeded: request.unitsNeeded,
          urgency: request.urgency,
          status: request.status,
          createdAt: request.createdAt,
          location: request.location.label,
        })),
        lowStock: lowStock.slice(0, 8),
        dataNote: "Dashboard figures reflect records currently available to the LifeLine application store.",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Dashboard data is temporarily unavailable." },
      { status: 500 }
    );
  }
}
