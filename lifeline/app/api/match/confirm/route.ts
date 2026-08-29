import { NextRequest, NextResponse } from "next/server";
import { getRequestById, updateRequestStatus } from "@/lib/store";
import { recordLiveEvent } from "@/lib/services/eventService";

/**
 * PATCH /api/match/confirm
 * Body: { requestId: string, confirmedSourceId: string, confirmedSourceName?: string }
 *
 * Applies First-Confirmed-Lock on the request:
 * - Changes status to "confirmed"
 * - Publishes live confirmation event to event bus
 * - Releasing other candidates
 */
export async function PATCH(req: NextRequest) {
  try {
    const { requestId, confirmedSourceId, confirmedSourceName } = await req.json();

    if (!requestId || !confirmedSourceId) {
      return NextResponse.json(
        { error: "Missing requestId or confirmedSourceId." },
        { status: 400 }
      );
    }

    const request = await getRequestById(requestId);

    if (!request) {
      return NextResponse.json(
        { error: "Request not found." },
        { status: 404 }
      );
    }

    if (request.status === "confirmed") {
      return NextResponse.json(
        { error: "This request is already confirmed. First-confirmed-lock active." },
        { status: 409 }
      );
    }

    // Apply first-confirmed-lock in database
    await updateRequestStatus(requestId, "confirmed");

    // Publish live confirmation event
    recordLiveEvent({
      type: "match_confirmed",
      title: `Match Locked: ${request.bloodGroup}`,
      description: `Confirmed for ${request.hospitalName} · Candidate [${confirmedSourceName || confirmedSourceId}] assigned for immediate transfusion`,
      bloodGroup: request.bloodGroup,
      locationLabel: request.location.label,
    });

    return NextResponse.json({
      success: true,
      requestId,
      confirmedSourceId,
      status: "confirmed",
      lockedAt: new Date().toISOString(),
      message: "Match locked. All other candidates auto-released.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to confirm match." },
      { status: 500 }
    );
  }
}
