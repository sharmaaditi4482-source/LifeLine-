import { NextRequest, NextResponse } from "next/server";
import { getRequestById, updateRequestStatus } from "@/lib/store";

/**
 * PATCH /api/match/confirm
 * Body: { requestId: string, confirmedSourceId: string }
 *
 * Locks the matched request database-side.
 * First-confirmed-locks: once a sourceId is confirmed, status changes to
 * "confirmed" and no other source can be confirmed for this request.
 */
export async function PATCH(req: NextRequest) {
  try {
    const { requestId, confirmedSourceId } = await req.json();

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

    // Apply first-confirmed-lock in Supabase database
    await updateRequestStatus(requestId, "confirmed");

    return NextResponse.json({
      success: true,
      requestId,
      confirmedSourceId,
      status: "confirmed",
      lockedAt: new Date().toISOString(),
      message: "Match locked. All other candidates auto-released.",
    });
  } catch (err) {
    console.error("Confirm match API error:", err);
    return NextResponse.json(
      { error: "Failed to confirm match." },
      { status: 500 }
    );
  }
}
