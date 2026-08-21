"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { BankInventoryUnit, BloodGroup } from "@/lib/types";

export default function BankPage() {
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

  const [units, setUnits] = useState<BankInventoryUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState<BloodGroup | "ALL">("ALL");

  useEffect(() => {
    fetch("/api/banks")
      .then((r) => r.json())
      .then((d) => {
        setUnits(d.bankUnits);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredUnits = useMemo(() => {
    if (filterGroup === "ALL") return units;
    return units.filter((u) => u.bloodGroup === filterGroup);
  }, [units, filterGroup]);

  const BLOOD_GROUPS: BloodGroup[] = [
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
  ];

  // Compute summary stats
  const totalUnits = units.reduce((sum, u) => sum + u.unitsAvailable, 0);
  const nearExpiryCount = units.filter((u) => {
    const daysLeft = Math.round(
      (new Date(u.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysLeft <= 10 && daysLeft > 0;
  }).length;
  const uniqueBanks = new Set(units.map((u) => u.bankId)).size;

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

      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Blood Bank Stock
          </h1>
          <p className="mt-2 max-w-xl text-ink-60">
            Live reserve stock units across regional partner blood banks. Inventory is tracked and matched automatically.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-1.5">
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
      </div>

      {/* ── Inventory Health Stats Bar ── */}
      {!loading && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="card-2xl p-4 bg-white border-ink-10 text-center">
            <p className="font-display text-2xl font-semibold text-ink">{totalUnits}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-40">Total Units</p>
          </div>
          <div className={`card-2xl p-4 text-center ${nearExpiryCount > 0 ? "bg-blood-50 border-blood/20" : "bg-white border-ink-10"}`}>
            <p className={`font-display text-2xl font-semibold ${nearExpiryCount > 0 ? "text-blood" : "text-ink"}`}>
              {nearExpiryCount}
            </p>
            <p className={`mt-1 font-mono text-[10px] uppercase tracking-widest ${nearExpiryCount > 0 ? "text-blood/70" : "text-ink-40"}`}>
              Near Expiry
            </p>
          </div>
          <div className="card-2xl p-4 bg-white border-ink-10 text-center">
            <p className="font-display text-2xl font-semibold text-ink">{uniqueBanks}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-40">Partner Banks</p>
          </div>
        </div>
      )}

      {/* Near-expiry alert banner */}
      {!loading && nearExpiryCount > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-blood/20 bg-blood-50 px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-blood animate-pulse flex-shrink-0" />
          <p className="font-mono text-xs text-blood font-medium">
            <span className="font-bold">{nearExpiryCount} unit{nearExpiryCount > 1 ? "s" : ""}</span> near expiry — the matching engine is already prioritizing these for outgoing requests.
          </p>
        </div>
      )}

      {loading ? (
        <div className="mt-8 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton-block w-full h-[76px] rounded-2xl" />
          ))}
        </div>
      ) : filteredUnits.length === 0 ? (
        <div className="mt-12 text-center card-2xl p-10 border-ink-10 bg-white">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-40">Out of Stock</p>
          <p className="mt-2 font-display text-lg text-ink font-medium">No units matching this blood group are available.</p>
          <p className="mt-1 text-sm text-ink-60 max-w-sm mx-auto">
            Try checking general donor registries or scaling matching alerts.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {filteredUnits.map((u, i) => {
            const daysLeft = Math.round(
              (new Date(u.expiryDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            );
            const nearExpiry = daysLeft <= 10;

            return (
              <div
                key={u.id}
                className={`card-2xl p-5 transition-all duration-300 ${nearExpiry ? "bg-blood-50 border-blood/15" : "bg-white border border-ink-10"}`}
                style={{
                  animation: "fadeSlideUp 0.4s ease-out both",
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-lg font-semibold text-ink">
                        {u.bankName}
                      </h3>
                      <span className="font-mono text-[10px] text-ink-40 uppercase tracking-wider">
                        ID: {u.id}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-ink-60">
                      <span className="font-semibold text-blood">{u.bloodGroup}</span> ·{" "}
                      <span className="font-medium text-ink">{u.unitsAvailable} units available</span> · {u.location.label}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {nearExpiry && (
                      <span className="font-mono text-[9px] uppercase tracking-wider text-blood font-bold">
                        ↑ Engine priority
                      </span>
                    )}
                    <span
                      className={`inline-block rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                        nearExpiry
                          ? "bg-blood text-white animate-pulse"
                          : "bg-ink-5 text-ink-60 border border-ink-10"
                      }`}
                    >
                      {daysLeft <= 0 ? "Expired" : `${daysLeft} days left`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info footer box */}
      <div className="mt-12 card-2xl border-ink-10 bg-white p-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-40">System note</p>
        <p className="mt-2 text-xs text-ink-60 leading-relaxed">
          Inventory expiration tracking runs as a cron schedule. Low shelf-life units are automatically prioritized by the scoring algorithm to prevent precious resources from going to waste.
        </p>
      </div>
    </main>
  );
}
