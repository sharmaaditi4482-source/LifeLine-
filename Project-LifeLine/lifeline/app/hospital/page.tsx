"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { BloodGroup, MatchResult, UrgencyLevel, Location } from "@/lib/types";

/* Dynamically import the map to avoid SSR issues with Leaflet */
const MatchMap = dynamic(() => import("@/components/MatchMap"), {
  ssr: false,
  loading: () => (
    <div className="skeleton-block w-full" style={{ height: "300px" }} />
  ),
});

interface MatchWithLocation extends MatchResult {
  location?: { lat: number; lng: number; label: string };
}

const BLOOD_GROUPS: BloodGroup[] = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
];

const PRESET_LOCATIONS: Location[] = [
  { label: "AIIMS Trauma Center, Delhi", lat: 28.5672, lng: 77.2100 },
  { label: "Connaught Place, Delhi", lat: 28.6139, lng: 77.2090 },
  { label: "Noida Sector 62", lat: 28.5355, lng: 77.3910 },
  { label: "Gurugram Sector 29", lat: 28.4595, lng: 77.0266 },
  { label: "Rohini, Delhi", lat: 28.7041, lng: 77.1025 },
  { label: "Lilavati Hospital, Mumbai", lat: 19.0519, lng: 72.8291 },
  { label: "Apollo Hospital, Bengaluru", lat: 12.8942, lng: 77.5982 },
];

/* ── Skeleton loader shaped like match cards ── */
function MatchSkeleton() {
  return (
    <div className="mt-6 space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="card-2xl p-5"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="skeleton-block"
                  style={{
                    width: "80px",
                    height: "20px",
                    animationDelay: `${i * 150}ms`,
                  }}
                />
                <div
                  className="skeleton-block"
                  style={{
                    width: "160px",
                    height: "18px",
                    animationDelay: `${i * 150 + 50}ms`,
                  }}
                />
              </div>
              <div className="mt-2.5 flex gap-3">
                <div
                  className="skeleton-block"
                  style={{
                    width: "40px",
                    height: "14px",
                    animationDelay: `${i * 150 + 100}ms`,
                  }}
                />
                <div
                  className="skeleton-block"
                  style={{
                    width: "70px",
                    height: "14px",
                    animationDelay: `${i * 150 + 150}ms`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HospitalDashboard() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const [hospitalName, setHospitalName] = useState("AIIMS Trauma Center");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("O+");
  const [unitsNeeded, setUnitsNeeded] = useState(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>("critical");
  
  // Dynamic Real Location State
  const [locationInput, setLocationInput] = useState("AIIMS Trauma Center, Delhi");
  const [selectedLocation, setSelectedLocation] = useState<Location>(PRESET_LOCATIONS[0]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>("✓ Verified GPS Coordinates Active");

  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchWithLocation[] | null>(null);
  const [escalated, setEscalated] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState("");

  // Real-time Geocoding via OpenStreetMap Nominatim
  async function handleGeocodeLocation(query?: string) {
    const searchText = query || locationInput || hospitalName;
    if (!searchText.trim()) return;

    setIsGeocoding(true);
    setLocationStatus("Resolving GPS coordinates...");

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=1`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const item = data[0];
        const newLoc: Location = {
          label: item.display_name.split(",").slice(0, 3).join(","),
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        };
        setSelectedLocation(newLoc);
        setLocationInput(newLoc.label);
        setLocationStatus(`✓ Geocoded: ${newLoc.lat.toFixed(4)}, ${newLoc.lng.toFixed(4)}`);
        return newLoc;
      } else {
        setLocationStatus("⚠️ Exact pin not found, using regional reference point.");
      }
    } catch {
      setLocationStatus("⚠️ Geocoding service busy, using regional coordinates.");
    } finally {
      setIsGeocoding(false);
    }
    return selectedLocation;
  }

  // Detect Current Browser GPS Location
  function handleDetectLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setIsGeocoding(true);
    setLocationStatus("Detecting live device GPS...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const label = `Current Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
        const newLoc: Location = { lat, lng, label };
        setSelectedLocation(newLoc);
        setLocationInput(label);
        setLocationStatus(`✓ Live GPS Locked: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        setIsGeocoding(false);
      },
      () => {
        setLocationStatus("⚠️ GPS permission denied, please type hospital name.");
        setIsGeocoding(false);
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMatches(null);
    setConfirmedId(null);
    setLoading(true);

    try {
      // Ensure we have geocoded if locationInput changed
      let activeLocation = selectedLocation;
      if (locationInput && locationInput !== selectedLocation.label) {
        const geocoded = await handleGeocodeLocation(locationInput);
        if (geocoded) activeLocation = geocoded;
      }

      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalName: hospitalName || "Emergency Trauma Center",
          bloodGroup,
          unitsNeeded,
          urgency,
          location: activeLocation,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setMatches(data.matches);
      setEscalated(data.escalated);
      setRequestId(data.request?.id ?? null);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(sourceId: string) {
    if (!requestId || confirmLoading) return;
    setConfirmLoading(true);
    try {
      const res = await fetch("/api/match/confirm", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, confirmedSourceId: sourceId }),
      });
      if (!res.ok) {
        const err = await res.json();
        if (res.status !== 409) throw new Error(err.error);
      }
      setConfirmedId(sourceId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Confirmation failed.");
    } finally {
      setConfirmLoading(false);
    }
  }

  if (authChecking) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-40">Authenticating Access...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14 page-enter">
      <div className="flex justify-between items-center w-full">
        <Link
          href="/"
          className="inline-block font-mono text-xs uppercase tracking-widest text-ink-40 transition-colors hover:text-ink"
        >
          ← Back
        </Link>
        <button
          onClick={handleLogout}
          type="button"
          className="font-mono text-xs uppercase tracking-widest text-blood hover:underline font-semibold"
        >
          Logout ✕
        </button>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Hospital Emergency Desk
          </h1>
          <p className="mt-2 max-w-xl text-ink-60 text-sm">
            Enter any hospital name or search any location in India. The matching engine will dynamically pin your coordinates and rank nearby compatible blood sources.
          </p>
        </div>
      </div>

      {/* ── Request Form ── */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-5 card-2xl p-5 sm:grid-cols-2 sm:p-6 bg-white border-ink-10 shadow-sm"
      >
        {/* Hospital Name Input */}
        <div>
          <label className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-40">
            Hospital / Facility Name
          </label>
          <input
            required
            value={hospitalName}
            onChange={(e) => {
              setHospitalName(e.target.value);
            }}
            placeholder="e.g. Max Super Speciality Hospital"
            className="mt-1.5 w-full rounded-xl border border-ink-10 bg-white px-4 py-2.5 text-sm text-ink transition placeholder:text-ink-40"
          />
        </div>

        {/* Dynamic Location Search Input */}
        <div>
          <div className="flex justify-between items-center">
            <label className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-40">
              Hospital Location / City
            </label>
            <button
              type="button"
              onClick={handleDetectLocation}
              className="font-mono text-[10px] text-blood hover:underline font-semibold flex items-center gap-1"
            >
              📍 Use My GPS
            </button>
          </div>
          <div className="mt-1.5 flex gap-2">
            <input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onBlur={() => handleGeocodeLocation(locationInput)}
              placeholder="e.g. Saket New Delhi, Bandra Mumbai, Indiranagar Bangalore"
              className="w-full rounded-xl border border-ink-10 bg-white px-4 py-2.5 text-sm text-ink transition placeholder:text-ink-40"
            />
            <button
              type="button"
              onClick={() => handleGeocodeLocation(locationInput)}
              disabled={isGeocoding}
              className="px-3 rounded-xl border border-ink-10 bg-ink-5 font-mono text-xs text-ink hover:bg-ink-10 transition-colors flex-shrink-0"
              title="Search real GPS coordinates"
            >
              {isGeocoding ? "..." : "🔍 Pin"}
            </button>
          </div>
        </div>

        {/* Location Status & Presets */}
        <div className="sm:col-span-2 -mt-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
            <span className="text-ink-60">{locationStatus}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-ink-40 uppercase text-[9px]">Quick:</span>
              {PRESET_LOCATIONS.slice(0, 4).map((loc) => (
                <button
                  key={loc.label}
                  type="button"
                  onClick={() => {
                    setSelectedLocation(loc);
                    setLocationInput(loc.label);
                    setHospitalName(loc.label.split(",")[0]);
                    setLocationStatus(`✓ Lat: ${loc.lat}, Lng: ${loc.lng}`);
                  }}
                  className="px-2 py-0.5 rounded-md bg-ink-5 hover:bg-blood/10 hover:text-blood text-ink-60 text-[10px] transition-colors"
                >
                  {loc.label.split(",")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-40">
            Blood group needed
          </label>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
            className="mt-1.5 w-full rounded-xl border border-ink-10 bg-white px-4 py-2.5 text-sm text-ink transition"
          >
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-40">
              Units needed
            </label>
            <input
              type="number"
              min={1}
              value={unitsNeeded}
              onChange={(e) => setUnitsNeeded(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-ink-10 bg-white px-4 py-2.5 text-sm text-ink transition"
            />
          </div>

          <div>
            <label className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-40">
              Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
              className="mt-1.5 w-full rounded-xl border border-ink-10 bg-white px-4 py-2.5 text-sm text-ink transition"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </div>
        </div>

        <div className="sm:col-span-2 pt-2">
          <button
            type="submit"
            disabled={loading || isGeocoding}
            className="w-full rounded-xl bg-blood px-6 py-3.5 font-display text-sm font-semibold text-white transition hover:bg-blood-light disabled:opacity-50 shadow-sm"
          >
            {loading ? "Calculating Live Distance & Matches…" : "Find Matches on Real Map →"}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 font-mono text-sm text-blood">{error}</p>
      )}

      {/* ── Skeleton Loader ── */}
      {loading && <MatchSkeleton />}

      {/* ── Results ── */}
      {matches && (
        <section className="mt-10 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
              {escalated
                ? "No compatible matches found"
                : `Ranked Matches near ${hospitalName || selectedLocation.label}`}
              {!escalated && (
                <span className="ml-2 font-mono text-sm font-normal text-ink-40">
                  ({matches.length} found)
                </span>
              )}
            </h2>
            <span className="font-mono text-xs text-ink-40">
              GPS: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </span>
          </div>

          {escalated ? (
            <div className="mt-4 card-2xl border-amber-200 bg-amber-50/60 p-5">
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-amber-700">
                Auto-escalated
              </p>
              <p className="mt-1 text-sm text-amber-800">
                This request has been escalated to the nearest district
                blood-bank network for broader matching.
              </p>
            </div>
          ) : (
            <>
              {/* ── Map ── */}
              <div className="mt-5">
                <MatchMap
                  hospitalLocation={selectedLocation}
                  matches={matches}
                />
              </div>

              {/* ── Match Cards ── */}
              <div className="mt-5 space-y-3">
                {matches.map((m, i) => {
                  const isConfirmed = confirmedId === m.sourceId;
                  const isReleased =
                    confirmedId !== null && confirmedId !== m.sourceId;

                  return (
                    <div
                      key={`${m.sourceType}-${m.sourceId}`}
                      className={`card-2xl p-5 transition-all duration-500 bg-white border border-ink-10 ${
                        isReleased ? "opacity-40" : ""
                      } ${i === 0 && !isReleased ? "border-blood/30 bg-blood-50/40" : ""}`}
                      style={{
                        animation: "fadeSlideUp 0.4s ease-out both",
                        animationDelay: `${i * 80}ms`,
                      }}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {i === 0 && !isReleased && (
                              <span className="inline-block rounded-lg bg-blood px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
                                Best match
                              </span>
                            )}
                            <p className="font-display text-base font-semibold text-ink sm:text-lg">
                              {m.sourceName}
                            </p>
                            <span className="font-mono text-xs text-ink-40">
                              {m.sourceType === "donor"
                                ? "Volunteer Donor"
                                : "Blood Bank Unit"}
                            </span>
                          </div>
                          <p className="mt-1 font-mono text-xs text-ink-60">
                            <span className="font-bold text-blood">{m.bloodGroup}</span> ·{" "}
                            <span className="font-medium text-ink">{m.distanceKm} km away</span> from your facility ·{" "}
                            score{" "}
                            <span className="font-semibold text-ink">{Math.round(m.score * 100)}</span>
                            <span className="text-ink-40">/100</span>
                          </p>
                        </div>

                        <div className="flex-shrink-0">
                          {isReleased ? (
                            <span className="inline-block rounded-xl bg-ink-5 px-4 py-2 font-mono text-xs font-medium text-ink-40">
                              Released
                            </span>
                          ) : isConfirmed ? (
                            <span className="inline-block rounded-xl bg-green-50 px-4 py-2 font-mono text-xs font-semibold text-green-700 border border-green-200">
                              Locked
                            </span>
                          ) : (
                            <button
                              onClick={() => handleConfirm(m.sourceId)}
                              disabled={confirmedId !== null || confirmLoading}
                              className="rounded-xl border border-ink-10 bg-white px-5 py-2 font-mono text-xs font-medium text-ink transition-all hover:border-blood hover:text-blood disabled:opacity-40"
                            >
                              {confirmLoading ? "Locking…" : "Confirm"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Score breakdown */}
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-ink-5 pt-2">
                        {[
                          { label: "Urgency", value: m.breakdown.urgency },
                          { label: "Proximity", value: m.breakdown.proximity },
                          { label: "Expiry", value: m.breakdown.expiry },
                          {
                            label: "Reliability",
                            value: m.breakdown.reliability,
                          },
                        ].map((item) => (
                          <span
                            key={item.label}
                            className="font-mono text-[11px] text-ink-40"
                          >
                            <span className="text-ink-60">
                              {item.label}
                            </span>{" "}
                            {item.value.toFixed(2)}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {confirmedId && (
            <div
              className="mt-5 card-2xl border-green-200 bg-green-50/60 p-5"
              style={{ animation: "fadeSlideUp 0.4s ease-out both" }}
            >
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-green-700">
                Match confirmed &amp; Locked
              </p>
              <p className="mt-1 text-sm text-green-800">
                First-confirmed-lock active. All other candidate reserves have been automatically released. The confirmed source has been alerted.
              </p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
