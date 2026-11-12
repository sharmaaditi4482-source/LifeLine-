import { NextRequest, NextResponse } from "next/server";
import { matchRequest } from "@/lib/services/matchingService";
import { getDonors, getBankUnits, addRequest, resolveLocation, ensureLocalFacilitiesForLocation } from "@/lib/store";
import { BloodRequest } from "@/lib/types";
import { recordLiveEvent } from "@/lib/services/eventService";

/**
 * POST /api/match
 * Runs the deterministic ABO/Rh-safe matching engine and returns a transparent
 * workflow trace. This is decision support only; it is not clinical approval.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hospitalName, bloodGroup, unitsNeeded, urgency, location } = body;

    const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const validUrgencies = ["critical", "high", "medium"];
    const lat = Number(location?.lat);
    const lng = Number(location?.lng);
    const units = Number(unitsNeeded);

    if (
      !validBloodGroups.includes(bloodGroup) ||
      !validUrgencies.includes(urgency) ||
      !Number.isInteger(units) || units < 1 || units > 100 ||
      !Number.isFinite(lat) || lat < -90 || lat > 90 ||
      !Number.isFinite(lng) || lng < -180 || lng > 180
    ) {
      return NextResponse.json(
        { error: "Provide a valid blood group, urgency, positive unit count (maximum 100), and location coordinates." },
        { status: 400 }
      );
    }

    const resolvedLocation = await resolveLocation(location.label || hospitalName, { ...location, lat, lng });
    await ensureLocalFacilitiesForLocation(resolvedLocation);

    const newRequest: BloodRequest = {
      id: `req_${Date.now()}`,
      hospitalName: typeof hospitalName === "string" && hospitalName.trim() ? hospitalName.trim().slice(0, 120) : "Emergency Trauma Desk",
      bloodGroup,
      unitsNeeded: units,
      urgency,
      location: resolvedLocation,
      status: "open",
      createdAt: new Date().toISOString(),
    };

    const [dbDonors, dbBankUnits] = await Promise.all([getDonors(), getBankUnits()]);
    await addRequest(newRequest);

    const allMatches = matchRequest(newRequest, { donors: dbDonors, bankUnits: dbBankUnits });
    let matches = allMatches.filter((match) => match.distanceKm <= 60);
    let searchRadiusKm = 60;
    if (matches.length < 2) {
      matches = allMatches.filter((match) => match.distanceKm <= 150);
      searchRadiusKm = 150;
    }
    if (matches.length === 0) {
      matches = allMatches;
      searchRadiusKm = null;
    }

    recordLiveEvent({
      type: "request_created",
      title: `${newRequest.urgency.toUpperCase()} ${bloodGroup} Request Raised`,
      description: `${newRequest.hospitalName} requested ${newRequest.unitsNeeded} unit(s) · ${matches.length} candidate(s) scored`,
      bloodGroup,
      locationLabel: location.label || "Emergency Location",
    });

    if (matches.length > 0) {
      const top = matches[0];
      recordLiveEvent({
        type: "match_found",
        title: `Top Match: ${top.sourceName}`,
        description: `${top.bloodGroup} (${top.sourceType === "donor" ? "Volunteer Donor" : "Bank Stock"}) · ${top.distanceKm} km away · Score: ${Math.round(top.score * 100)}/100`,
        bloodGroup: top.bloodGroup,
        locationLabel: top.location?.label || location.label,
      });
    }

    return NextResponse.json({
      request: newRequest,
      matches,
      escalated: matches.length === 0,
      workflow: [
        { step: "intake", status: "complete", detail: "Request fields and coordinates validated." },
        { step: "eligibility_and_compatibility", status: "complete", detail: "Deterministic matching engine applied donor eligibility, availability, ABO/Rh, stock, and expiry filters." },
        { step: "candidate_ranking", status: "complete", detail: `Ranked ${matches.length} candidate(s) within the ${searchRadiusKm === null ? "available national" : `${searchRadiusKm} km`} search scope.` },
        { step: "human_review", status: "required", detail: "A qualified hospital operator must verify the recommendation before any clinical or dispatch action." },
      ],
      decisionSupportOnly: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong processing the matching request." },
      { status: 500 }
    );
  }
}
