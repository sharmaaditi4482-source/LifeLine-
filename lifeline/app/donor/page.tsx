"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Donor, BloodGroup } from "@/lib/types";

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const LOCATIONS = [
  { label: "Connaught Place, Delhi", lat: 28.6139, lng: 77.209 },
  { label: "Noida Sector 62", lat: 28.5355, lng: 77.391 },
  { label: "Gurugram Sector 29", lat: 28.4595, lng: 77.0266 },
  { label: "Rohini, Delhi", lat: 28.7041, lng: 77.1025 },
  { label: "Lajpat Nagar, Delhi", lat: 28.6304, lng: 77.2177 },
];

export default function DonorPage() {
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

  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState<BloodGroup | "ALL">("ALL");

  // Registration modal state
  const [showModal, setShowModal] = useState(false);
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regBloodGroup, setRegBloodGroup] = useState<BloodGroup>("O+");
  const [regAreaInput, setRegAreaInput] = useState("Saket, Delhi");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState("");

  const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
    "delhi": { lat: 28.6139, lng: 77.2090 },
    "saket": { lat: 28.5244, lng: 77.2173 },
    "lajpat": { lat: 28.5677, lng: 77.2433 },
    "noida": { lat: 28.5355, lng: 77.3910 },
    "gurugram": { lat: 28.4595, lng: 77.0266 },
    "gurgaon": { lat: 28.4595, lng: 77.0266 },
    "mumbai": { lat: 19.0760, lng: 72.8777 },
    "bengaluru": { lat: 12.9716, lng: 77.5946 },
    "bangalore": { lat: 12.9716, lng: 77.5946 },
    "hyderabad": { lat: 17.3850, lng: 78.4867 },
    "chennai": { lat: 13.0827, lng: 80.2707 },
    "kolkata": { lat: 22.5726, lng: 88.3639 },
    "pune": { lat: 18.5204, lng: 73.8567 },
    "jaipur": { lat: 26.9124, lng: 75.7873 },
    "lucknow": { lat: 26.8467, lng: 80.9462 },
    "chandigarh": { lat: 30.7333, lng: 76.7794 },
    "ahmedabad": { lat: 23.0225, lng: 72.5714 },
    "indore": { lat: 22.7196, lng: 75.8577 },
    "bhopal": { lat: 23.2599, lng: 77.4126 },
    "patna": { lat: 25.5941, lng: 85.1376 },
  };

  async function resolveDonorLocation(areaText: string) {
    const lower = areaText.toLowerCase().trim();
    for (const key of Object.keys(CITY_COORDINATES)) {
      if (lower.includes(key)) {
        return {
          label: areaText,
          lat: CITY_COORDINATES[key].lat,
          lng: CITY_COORDINATES[key].lng,
        };
      }
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(areaText + ", India")}&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        return {
          label: areaText,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    } catch {
      // Fallback coordinates
    }
    return {
      label: areaText,
      lat: 28.6139,
      lng: 77.2090,
    };
  }

  const fetchDonors = () => {
    setLoading(true);
    fetch("/api/donors")
      .then((r) => r.json())
      .then((d) => {
        setDonors(d?.donors || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const filteredDonors = useMemo(() => {
    if (filterGroup === "ALL") return donors;
    return donors.filter((d) => d.bloodGroup === filterGroup);
  }, [donors, filterGroup]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");
    setRegLoading(true);
    try {
      const donorLoc = await resolveDonorLocation(regAreaInput || "Delhi");
      const res = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          phone: regPhone,
          bloodGroup: regBloodGroup,
          location: donorLoc,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registration failed.");
      }
      setRegSuccess(true);
      fetchDonors();
      setTimeout(() => {
        setShowModal(false);
        setRegSuccess(false);
        setRegName("");
        setRegPhone("");
        setRegBloodGroup("O+");
        setRegAreaInput("Saket, Delhi");
      }, 1800);
    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setRegLoading(false);
    }
  }

  const availableCount = donors.filter((d) => d.available).length;

  if (authChecking) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-40">Authenticating Access...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14 page-enter">
      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md card-2xl bg-clay p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-blood">
                  Volunteer Registry
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink">
                  Register as a Donor
                </h2>
              </div>
              <button
                onClick={() => { setShowModal(false); setRegSuccess(false); setRegError(""); }}
                className="font-mono text-sm text-ink-40 hover:text-ink transition-colors"
              >
                ✕
              </button>
            </div>

            {regSuccess ? (
              <div className="text-center py-6 space-y-3 animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mx-auto font-bold text-green-700 text-lg">
                  ✓
                </div>
                <p className="font-display text-lg font-semibold text-ink">
                  Registered successfully!
                </p>
                <p className="text-sm text-ink-60">
                  You're now in the live donor registry. The matching engine will contact you when there's a compatible request nearby.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                {regError && (
                  <div className="rounded-xl border border-blood/20 bg-blood-50 px-4 py-3 font-mono text-xs text-blood">
                    {regError}
                  </div>
                )}

                <div>
                  <label className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-40">
                    Full Name
                  </label>
                  <input
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Riya Sharma"
                    className="mt-1.5 w-full rounded-xl border border-ink-10 bg-white px-4 py-2.5 text-sm text-ink transition placeholder:text-ink-40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-40">
                      Blood Group
                    </label>
                    <select
                      value={regBloodGroup}
                      onChange={(e) => setRegBloodGroup(e.target.value as BloodGroup)}
                      className="mt-1.5 w-full rounded-xl border border-ink-10 bg-white px-4 py-2.5 text-sm text-ink transition"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-40">
                      Phone
                    </label>
                    <input
                      required
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="mt-1.5 w-full rounded-xl border border-ink-10 bg-white px-4 py-2.5 text-sm text-ink transition placeholder:text-ink-40"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-40">
                    Your Area / City / Locality
                  </label>
                  <input
                    required
                    type="text"
                    list="donor-area-suggestions"
                    value={regAreaInput}
                    onChange={(e) => setRegAreaInput(e.target.value)}
                    placeholder="e.g. Saket Delhi, Andheri Mumbai, Sector 62 Noida..."
                    className="mt-1.5 w-full rounded-xl border border-ink-10 bg-white px-4 py-2.5 text-sm text-ink transition placeholder:text-ink-40"
                  />
                  <datalist id="donor-area-suggestions">
                    <option value="Saket, Delhi" />
                    <option value="Connaught Place, Delhi" />
                    <option value="Lajpat Nagar, Delhi" />
                    <option value="Noida Sector 62" />
                    <option value="Gurugram Sector 29" />
                    <option value="Bandra, Mumbai" />
                    <option value="Indiranagar, Bengaluru" />
                    <option value="Kothrud, Pune" />
                    <option value="Gomti Nagar, Lucknow" />
                    <option value="C-Scheme, Jaipur" />
                  </datalist>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full rounded-xl bg-blood px-6 py-3 font-display text-sm font-semibold text-white transition hover:bg-blood-light disabled:opacity-50"
                >
                  {regLoading ? "Registering…" : "Join the Network →"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

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

      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Donors
          </h1>
          <p className="mt-2 max-w-xl text-ink-60">
            Registered volunteer donors and their real-time availability status.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex-shrink-0 rounded-xl bg-blood border border-blood px-5 py-2.5 font-display text-sm font-semibold text-white transition hover:bg-blood-light"
        >
          + Register as Donor
        </button>
      </div>

      {/* Stats bar */}
      {!loading && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="card-2xl p-4 bg-white border-ink-10 text-center">
            <p className="font-display text-2xl font-semibold text-ink">{donors.length}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-40">Registered</p>
          </div>
          <div className="card-2xl p-4 bg-white border-ink-10 text-center">
            <p className="font-display text-2xl font-semibold text-green-700">{availableCount}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-40">Available Now</p>
          </div>
          <div className="card-2xl p-4 bg-white border-ink-10 text-center">
            <p className="font-display text-2xl font-semibold text-ink">{donors.length - availableCount}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-40">Unavailable</p>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="mt-6 flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilterGroup("ALL")}
          className={`rounded-lg px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider transition-all border ${
            filterGroup === "ALL"
              ? "bg-ink text-white border-ink"
              : "bg-white text-ink-60 border-ink-10 hover:border-ink-40"
          }`}
        >
          All
        </button>
        {BLOOD_GROUPS.map((bg) => (
          <button
            key={bg}
            onClick={() => setFilterGroup(bg)}
            className={`rounded-lg px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider transition-all border ${
              filterGroup === bg
                ? "bg-blood text-white border-blood"
                : "bg-white text-ink-60 border-ink-10 hover:border-blood/40"
            }`}
          >
            {bg}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton-block w-full h-[76px] rounded-2xl" />
          ))}
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="mt-12 text-center card-2xl p-10 border-ink-10 bg-white">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-40">No Matches</p>
          <p className="mt-2 font-display text-lg text-ink font-medium">No donors match this criteria right now.</p>
          <p className="mt-1 text-sm text-ink-60 max-w-sm mx-auto">
            Try checking another blood group or raising a request on the Hospital Dashboard to trigger automatic regional alerts.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {filteredDonors.map((d, i) => (
            <Link
              key={d.id}
              href={`/donor/${d.id}`}
              className="group block card-2xl p-5 transition-all hover:border-blood/30 hover:bg-white/80 active:scale-[0.99] duration-300"
              style={{
                animation: "fadeSlideUp 0.4s ease-out both",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <p className="font-display text-lg font-semibold text-ink group-hover:text-blood transition-colors">
                      {d.name}
                    </p>
                    <span className="font-mono text-xs text-ink-40">
                      ID: {d.id}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-ink-60">
                    <span className="font-semibold text-blood">{d.bloodGroup}</span> · {d.location.label} · reliability{" "}
                    <span className="font-medium text-ink">
                      {Math.round(d.reliabilityScore * 100)}%
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                      d.available
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-ink-5 text-ink-40 border border-ink-10"
                    }`}
                  >
                    {d.available ? "Available" : "Unavailable"}
                  </span>

                  <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-ink-40 group-hover:text-blood group-hover:translate-x-1 transition-all">
                    Preview Flow →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
