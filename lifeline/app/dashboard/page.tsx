"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Overview = {
  stats: {
    openCases: number;
    matchedCases: number;
    confirmedCases: number;
    availableDonors: number;
    criticalAlerts: number;
  };
  requests: Array<{
    id: string;
    hospitalName: string;
    bloodGroup: string;
    unitsNeeded: number;
    urgency: "critical" | "high" | "medium";
    status: string;
    createdAt: string;
    location: string;
  }>;
  lowStock: Array<{ id: string; hospital: string; bloodGroup: string; units: number }>;
  dataNote: string;
};

const statCards: Array<{ key: keyof Overview["stats"]; label: string; accent: string }> = [
  { key: "openCases", label: "Open requests", accent: "text-rose-700 bg-rose-50" },
  { key: "matchedCases", label: "Matched", accent: "text-amber-700 bg-amber-50" },
  { key: "availableDonors", label: "Eligible & available donors", accent: "text-emerald-700 bg-emerald-50" },
  { key: "criticalAlerts", label: "Critical / stock alerts", accent: "text-red-700 bg-red-50" },
];

export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/dashboard/overview", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Could not load dashboard.");
        setOverview(payload.data);
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Could not load dashboard.");
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-[#FBF9F5] px-4 py-8 text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/" className="font-mono text-xs uppercase tracking-[0.18em] text-blood hover:underline">LifeLine AI · Operations</Link>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Emergency command center</h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-60">Review requests, inventory alerts, and deterministic match workflow activity. Clinical decisions remain with qualified staff.</p>
          </div>
          <Link href="/emergency" className="rounded-xl bg-blood px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blood-light">Create emergency request <span aria-hidden="true">→</span></Link>
        </header>

        {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

        <section aria-label="Operational metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <article key={card.key} className="rounded-2xl border border-ink-10 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-60">{card.label}</p>
              <p className="mt-3 font-display text-4xl font-semibold" aria-live="polite">{overview ? overview.stats[card.key] : "—"}</p>
              <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${card.accent}`}>Store snapshot</span>
            </article>
          ))}
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-2xl border border-ink-10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="font-display text-xl font-semibold">Active request queue</h2><p className="mt-1 text-xs text-ink-60">Sorted by most recently created in the application store.</p></div>
              <Link href="/hospital" className="text-xs font-semibold text-blood hover:underline">Hospital desk →</Link>
            </div>
            <div className="mt-5 space-y-3">
              {!overview && !error && <p className="rounded-xl bg-stone-50 p-4 text-sm text-ink-60">Loading current requests…</p>}
              {overview?.requests.length === 0 && <p className="rounded-xl bg-stone-50 p-4 text-sm text-ink-60">No active requests in the store yet. Create a request to begin the workflow.</p>}
              {overview?.requests.map((request) => (
                <article key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-10 p-4">
                  <div className="min-w-0"><p className="truncate font-semibold">{request.hospitalName}</p><p className="mt-1 text-xs text-ink-60">{request.location} · {request.bloodGroup} · {request.unitsNeeded} unit{request.unitsNeeded === 1 ? "" : "s"}</p></div>
                  <div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase ${request.urgency === "critical" ? "bg-red-100 text-red-800" : request.urgency === "high" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>{request.urgency}</span><span className="rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[10px] uppercase text-ink-60">{request.status}</span></div>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-ink-10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Inventory watch</h2><span className="rounded-full bg-amber-50 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-amber-800">Below 5 units</span></div>
              <div className="mt-4 space-y-3">
                {overview?.lowStock.length === 0 && <p className="text-sm text-ink-60">No low-stock items in the current inventory snapshot.</p>}
                {overview?.lowStock.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-amber-50/70 p-3"><div><p className="text-sm font-semibold">{item.hospital}</p><p className="text-xs text-ink-60">{item.bloodGroup} inventory</p></div><strong className="font-mono text-sm text-amber-900">{item.units} units</strong></div>)}
                {!overview && !error && <p className="text-sm text-ink-60">Loading inventory…</p>}
              </div>
            </section>

            <section className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-blood">Human-in-the-loop</p>
              <h2 className="mt-2 font-display text-lg font-semibold">AI supports the team; it doesn’t approve transfusions.</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-60">Compatibility and eligibility checks are operational aids. Verify blood typing, crossmatching, inventory, and local protocols with qualified clinical staff before action.</p>
              <Link href="/copilot" className="mt-4 inline-flex text-sm font-semibold text-blood hover:underline">Open grounded copilot →</Link>
            </section>
          </aside>
        </div>

        {overview && <p className="mt-5 text-xs text-ink-40">{overview.dataNote}</p>}
      </div>
    </main>
  );
}
