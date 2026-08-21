"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Donor, BloodGroup } from "@/lib/types";

interface SimulatedRequest {
  bloodGroup: BloodGroup;
  urgency: "critical" | "high" | "medium";
  hospital: string;
  distanceKm: number;
  units: number;
}

export default function DonorPortal() {
  const params = useParams();
  const router = useRouter();
  const donorId = params.id as string;

  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const [flowState, setFlowState] = useState<"pending" | "accepted" | "declining" | "declined">("pending");
  const [nextRouteInfo, setNextRouteInfo] = useState<string>("");

  // Simulated request tailored to the donor's blood type (so safety is realistic!)
  const [simulatedRequest, setSimulatedRequest] = useState<SimulatedRequest | null>(null);

  useEffect(() => {
    fetch("/api/donors")
      .then((r) => r.json())
      .then((data) => {
        const found = data.donors.find((d: Donor) => d.id === donorId);
        if (found) {
          setDonor(found);
          
          // Generate a compatible request for this donor
          // Recipient must be able to receive donor's blood type.
          // e.g. O- is universal donor, can go to anyone. Let's make the recipient O- or O+ or A+ etc.
          let recipientGroup: BloodGroup = "O-";
          let hospital = "City Hospital, Trauma Centre";
          let distance = 2.4;
          let units = 2;

          if (found.bloodGroup === "A+") {
            recipientGroup = "A+";
            hospital = "Fortis Hospital, Noida";
            distance = 3.8;
          } else if (found.bloodGroup === "B+") {
            recipientGroup = "B+";
            hospital = "Max Super Speciality, Patparganj";
            distance = 5.1;
          } else if (found.bloodGroup === "O+") {
            recipientGroup = "O+";
            hospital = "Apollo Hospital, Sarita Vihar";
            distance = 1.9;
          } else if (found.bloodGroup === "O-") {
            recipientGroup = "O-";
            hospital = "AIIMS, New Delhi";
            distance = 1.2;
          } else {
            // fallback
            recipientGroup = found.bloodGroup;
            hospital = "Red Cross Emergency Center";
            distance = 4.0;
          }

          setSimulatedRequest({
            bloodGroup: recipientGroup,
            urgency: "critical",
            hospital,
            distanceKm: distance,
            units,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [donorId]);

  const handleAccept = () => {
    setFlowState("accepted");
  };

  const handleDecline = () => {
    setFlowState("declining");
    // Simulate routing to next best match
    setTimeout(() => {
      // Find another donor as next match representation
      let nextDonorName = "Priya Nair";
      let nextDonorGroup = "A+";
      let nextDonorDist = 3.6;

      if (donor?.bloodGroup === "O-") {
        nextDonorName = "Sneha Kapoor (O+)";
        nextDonorGroup = "O+";
        nextDonorDist = 2.8;
      } else if (donor?.bloodGroup === "A+") {
        nextDonorName = "Rahul Verma (O-)";
        nextDonorGroup = "O-";
        nextDonorDist = 4.2;
      } else {
        nextDonorName = "Aman Gupta (B+)";
        nextDonorGroup = "B+";
        nextDonorDist = 5.5;
      }

      setNextRouteInfo(`Routed to next best match: ${nextDonorName} (${nextDonorGroup}) — ${nextDonorDist}km away.`);
      setFlowState("declined");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="skeleton-block w-full h-[350px] rounded-2xl" />
      </div>
    );
  }

  if (!donor || !simulatedRequest) {
    return (
      <main className="mx-auto max-w-md px-6 py-16 page-enter">
        <Link href="/donor" className="font-mono text-xs uppercase tracking-widest text-ink-40 hover:text-ink transition-colors">
          ← Back
        </Link>
        <div className="mt-8 text-center card-2xl p-8">
          <p className="font-display text-xl font-medium text-ink">Donor Profile Not Found</p>
          <p className="mt-2 text-sm text-ink-60">This donor ID does not exist or has been removed.</p>
          <Link href="/donor" className="mt-6 inline-block rounded-xl border border-ink-10 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-ink transition-all hover:bg-white">
            Return to Listing
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-5 py-12 sm:px-6 sm:py-16 page-enter">
      <Link href="/donor" className="font-mono text-xs uppercase tracking-widest text-ink-40 hover:text-ink transition-colors">
        ← Back to Donors
      </Link>

      <div className="mt-8">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-blood" />
          <span className="font-mono text-xs uppercase tracking-widest text-ink-60">Live Request Dispatch</span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
          Hello, <span className="italic">{donor.name}</span>
        </h1>
        <p className="mt-1 text-sm text-ink-60">
          Your blood group is <span className="font-mono font-medium">{donor.bloodGroup}</span> · Active Status: <span className="text-green-700 font-medium">Available</span>
        </p>
      </div>

      <div className="mt-8 relative overflow-hidden">
        {flowState === "pending" && (
          <div className="card-2xl p-6 border-blood/20 bg-white">
            <div className="flex items-center justify-between">
              <span className="inline-block rounded-lg bg-blood px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white animate-pulse">
                {simulatedRequest.urgency} Request
              </span>
              <span className="font-mono text-xs text-ink-40">
                1m ago
              </span>
            </div>

            <h2 className="mt-5 font-display text-2xl font-semibold text-ink leading-tight">
              Emergency blood donation request matching your profile.
            </h2>

            <div className="mt-6 border-t border-ink-10 pt-5 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-40">Required Group</span>
                <span className="font-display font-semibold text-blood text-lg">{simulatedRequest.bloodGroup}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-40">Location</span>
                <span className="font-medium text-ink text-right">{simulatedRequest.hospital}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-40">Distance</span>
                <span className="font-mono font-medium text-ink">{simulatedRequest.distanceKm} km away</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-40">Demand</span>
                <span className="font-medium text-ink">{simulatedRequest.units} Units</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                onClick={handleDecline}
                className="w-full rounded-xl border border-ink-10 bg-white py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-ink-60 transition-all hover:bg-clay hover:text-ink"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="w-full rounded-xl bg-blood py-3.5 font-display text-sm font-semibold text-white transition-all hover:bg-blood-light hover:shadow-sm"
              >
                Accept Request
              </button>
            </div>
          </div>
        )}

        {flowState === "accepted" && (
          <div className="card-2xl p-6 border-green-200 bg-white animate-fade-in">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <span className="font-mono text-green-700 text-lg font-bold">✓</span>
              </div>
            </div>
            
            <h2 className="mt-5 text-center font-display text-2xl font-semibold text-ink leading-tight">
              Request Accepted
            </h2>
            <p className="mt-3 text-center text-sm text-ink-60">
              Thank you, <span className="font-semibold">{donor.name}</span>. The hospital has been notified and is expecting you.
            </p>

            <div className="mt-6 rounded-xl bg-clay/60 border border-ink-10/40 p-4 space-y-3">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-40">Next Steps</p>
              <p className="text-sm text-ink">
                Head to <span className="font-semibold text-ink">{simulatedRequest.hospital}</span>, Room 4B.
              </p>
              <p className="text-xs text-ink-60">
                Please carry a valid government ID. Check-in with the coordinator at the reception upon arrival.
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/donor"
                className="inline-block rounded-xl border border-ink-10 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-ink transition-all hover:bg-clay"
              >
                Done
              </Link>
            </div>
          </div>
        )}

        {flowState === "declining" && (
          <div className="card-2xl p-8 bg-white border-ink-10 flex flex-col items-center justify-center min-h-[250px] animate-fade-in">
            <div className="flex space-x-1.5 justify-center items-center">
              <div className="h-2 w-2 bg-blood rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="h-2 w-2 bg-blood rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="h-2 w-2 bg-blood rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="mt-5 font-mono text-xs uppercase tracking-widest text-ink-60 animate-pulse text-center">
              No problem. Routing to the next match...
            </p>
          </div>
        )}

        {flowState === "declined" && (
          <div className="card-2xl p-6 border-ink-10 bg-white animate-fade-in">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-ink-5 border border-ink-10 flex items-center justify-center">
                <span className="font-mono text-ink-40 text-lg font-bold">↳</span>
              </div>
            </div>

            <h2 className="mt-5 text-center font-display text-xl font-semibold text-ink">
              Request Released
            </h2>
            <p className="mt-2 text-center text-sm text-ink-60">
              The request has been safely rerouted to keep response time minimal.
            </p>

            <div className="mt-5 rounded-xl bg-ink-5 p-4 border border-ink-10/40">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-40">System Log</p>
              <p className="mt-1.5 font-mono text-xs text-ink-60 leading-relaxed">
                {nextRouteInfo}
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/donor"
                className="inline-block rounded-xl border border-ink-10 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-ink transition-all hover:bg-clay"
              >
                Back to Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
