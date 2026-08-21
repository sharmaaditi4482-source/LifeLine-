"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import LiveFeed from "@/components/LiveFeed";
import HeroNetworkVisual from "@/components/HeroNetworkVisual";
import SafetyMatrix from "@/components/SafetyMatrix";
import RoleCards from "@/components/RoleCards";
import HowItWorks from "@/components/HowItWorks";
import FeatureGrid from "@/components/FeatureGrid";

export default function Home() {
  const [selectedScoreFactor, setSelectedScoreFactor] = useState<string>("urgency");
  const [session, setSession] = useState<any>(null);
  const [sessionChecking, setSessionChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Client-side IntersectionObserver reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const items = document.querySelectorAll(".reveal-item");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-clay min-h-screen selection:bg-blood/10 selection:text-ink">

      {/* ── STICKY NAVBAR ── */}
      <nav className="sticky top-0 z-50 w-full border-b border-ink-10 bg-clay/80 backdrop-blur-md transition-all">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-ink font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-blood animate-heartbeat-ecg flex-shrink-0" />
            LIFELINE ENGINE
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-mono uppercase tracking-wider text-ink-60">
            <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "how-it-works")} className="hover:text-blood transition-colors">
              How it works
            </a>
            <a href="#matching-engine" onClick={(e) => handleSmoothScroll(e, "matching-engine")} className="hover:text-blood transition-colors">
              Matching Engine
            </a>
            <a href="#safety" onClick={(e) => handleSmoothScroll(e, "safety")} className="hover:text-blood transition-colors">
              Safety Check
            </a>
            <Link href="/donor" className="hover:text-blood transition-colors">
              For Donors
            </Link>
          </div>

          {!sessionChecking ? (
            <div className="flex items-center gap-3">
              {session ? (
                <>
                  <Link
                    href={`/${session.user?.user_metadata?.role || "hospital"}`}
                    className="rounded-xl border border-ink bg-white px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink transition-all hover:border-blood hover:text-blood"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.reload();
                    }}
                    type="button"
                    className="rounded-xl border border-ink bg-ink px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-clay transition-all hover:bg-blood hover:border-blood hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-xl border border-ink bg-ink px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-clay transition-all hover:bg-blood hover:border-blood hover:text-white"
                >
                  Register / Sign In →
                </Link>
              )}
            </div>
          ) : (
            <div className="h-8 w-24 bg-ink-5 rounded-xl animate-pulse" />
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-12 space-y-24 sm:space-y-32">

        {/* ── 1. HERO ── */}
        <section className="grid gap-10 md:grid-cols-[1fr_360px] items-center pt-4 sm:pt-8 page-enter">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blood-10 border border-blood/10">
              <span className="h-1.5 w-1.5 rounded-full bg-blood animate-pulse" />
              <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-blood">Bio-Matching Network v1.2</span>
            </div>

            <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-[56px] leading-[1.08] max-w-2xl">
              Compatible blood exists.
              <br />
              <span className="text-blood font-normal italic">The problem is finding it in time.</span>
            </h1>

            <p className="max-w-xl text-base text-ink-60 leading-relaxed sm:text-lg">
              LifeLine connects hospitals, donors, and blood banks through a live matching engine that finds the right blood source when every minute matters.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/hospital" className="rounded-xl bg-blood border border-blood px-6 py-3.5 font-display text-sm font-semibold text-white transition-all hover:bg-blood-light hover:shadow-sm">
                Request Blood
              </Link>
              <Link href="/donor" className="rounded-xl border border-ink-10 bg-white px-6 py-3.5 font-display text-sm font-semibold text-ink transition-all hover:border-ink">
                Find a Donor
              </Link>
              <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "how-it-works")} className="ml-2 font-mono text-[10px] uppercase tracking-wider text-ink-40 hover:text-blood transition-colors">
                Explore how LifeLine works →
              </a>
            </div>
          </div>

          <div className="w-full flex items-center justify-center">
            <HeroNetworkVisual />
          </div>
        </section>

        {/* ── 2. LIVE FEED ── */}
        <section className="reveal-item">
          <div className="max-w-3xl">
            <LiveFeed />
          </div>
        </section>

        {/* ── 3. ROLE CARDS ── */}
        <RoleCards />

        {/* ── 4. HOW IT WORKS ── */}
        <HowItWorks handleSmoothScroll={handleSmoothScroll} />

        {/* ── 5. MATCHING ENGINE SECTION ── */}
        <section id="matching-engine" className="reveal-item space-y-10">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-blood">DECISION SYSTEM</p>
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl leading-tight">
                Not a directory.
                <br />
                <span className="italic font-normal text-blood">A matching engine.</span>
              </h2>
              <p className="text-sm text-ink-60 leading-relaxed">
                LifeLine doesn't simply show a list of donors. It calculates which eligible source should be surfaced first, taking into account medical safety and logistics.
              </p>

              {/* Interactive scoring weights panel */}
              <div className="card border-ink-10 bg-white p-5 space-y-3.5 shadow-sm">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-ink-40">Matching Equation Weights</p>
                <div className="space-y-2.5">
                  {[
                    { key: "urgency", name: "Urgency Level", val: "35%", desc: "Prioritizes critical emergency units instantly." },
                    { key: "proximity", name: "Distance Proximity", val: "30%", desc: "Calculated using high-accuracy GPS coordinates." },
                    { key: "expiry", name: "Inventory Shelf Expiry", val: "20%", desc: "Prioritizes banks holding stock nearing expiration." },
                    { key: "reliability", name: "Donor Turnout Reliability", val: "15%", desc: "Uses historic attendance rates to prevent no-shows." },
                  ].map((f) => (
                    <div
                      key={f.key}
                      onClick={() => setSelectedScoreFactor(f.key)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedScoreFactor === f.key
                          ? "border-blood bg-blood-50/50"
                          : "border-transparent hover:bg-ink-5"
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="font-semibold text-ink">{f.name}</span>
                        <span className="text-blood font-bold">{f.val}</span>
                      </div>
                      {selectedScoreFactor === f.key && (
                        <p className="mt-1 text-[11px] text-ink-60 font-body animate-fade-in">{f.desc}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated ranking panel */}
            <div className="card border-ink-10 bg-white p-6 space-y-4 shadow-sm flex flex-col justify-center">
              <div className="flex items-center justify-between border-b border-ink-10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blood animate-pulse" />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink">Active Matching Circuit</span>
                </div>
                <span className="font-mono text-[9px] text-ink-40 uppercase">Group: B+</span>
              </div>

              <div className="space-y-3">
                <div className="card border-blood/20 bg-blood-50 p-4 relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
                  <div className="absolute top-0 right-0 bg-blood text-white font-mono text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-bl-lg">
                    #01 BEST MATCH
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-semibold text-sm text-ink">Rahul Verma</h4>
                      <p className="mt-1 font-mono text-[10px] text-ink-60">O- Donor · 1.2 km away</p>
                      <p className="mt-0.5 font-mono text-[9px] text-ink-40">Reliability Rate: 96%</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-xl font-bold text-blood">94</span>
                      <p className="font-mono text-[8px] text-blood-light uppercase tracking-wider font-semibold">Match Score</p>
                    </div>
                  </div>
                </div>

                <div className="card border-ink-10 bg-white p-4 transition-all duration-300 hover:scale-[1.01]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-semibold text-sm text-ink">Red Cross Delhi</h4>
                      <p className="mt-1 font-mono text-[10px] text-ink-60">Blood Bank · 2.4 km away</p>
                      <p className="mt-0.5 font-mono text-[9px] text-ink-40">2 units · Expires soon</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-xl font-bold text-ink">87</span>
                      <p className="font-mono text-[8px] text-ink-40 uppercase tracking-wider font-semibold">Match Score</p>
                    </div>
                  </div>
                </div>

                <div className="card border-ink-10 bg-white p-4 transition-all duration-300 hover:scale-[1.01]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-semibold text-sm text-ink">Aman Gupta</h4>
                      <p className="mt-1 font-mono text-[10px] text-ink-60">B+ Donor · 5.1 km away</p>
                      <p className="mt-0.5 font-mono text-[9px] text-ink-40">Reliability Rate: 82%</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-xl font-bold text-ink-60">76</span>
                      <p className="font-mono text-[8px] text-ink-40 uppercase tracking-wider font-semibold">Match Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. SAFETY SECTION ── */}
        <section id="safety" className="reveal-item grid gap-10 md:grid-cols-[320px_1fr] items-center">
          <div className="space-y-6">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-blood">SAFETY PROTOCOL</p>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl leading-tight">
              Safety comes
              <br />
              <span className="italic font-normal text-blood">before speed.</span>
            </h2>
            <p className="text-sm text-ink-60 leading-relaxed">
              Every demand checks blood type combinations before running scoring matches. We implement a strict circuit breaker to ensure that incompatible blood is never surfaced under any circumstance.
            </p>
            <div className="space-y-3 pt-2">
              {["ABO/Rh compatibility verified", "Zero-risk filter pipeline"].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-blood-10 text-blood flex items-center justify-center font-mono text-[10px] font-bold">✓</span>
                  <span className="text-xs text-ink-60 font-mono font-medium uppercase tracking-wider">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex justify-center">
            <SafetyMatrix />
          </div>
        </section>

        {/* ── 7. DARK NETWORK CARD ── */}
        <section className="reveal-item">
          <div className="card border-ink/90 bg-ink text-clay p-8 md:p-12 relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg width="100%" height="100%">
                <pattern id="dark-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#dark-grid)" />
              </svg>
            </div>
            <div className="relative z-10 max-w-xl space-y-6">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-blood">SECURE DEPLOYMENT</p>
              <h2 className="font-display text-3xl font-semibold text-clay sm:text-4xl leading-tight">
                A live network for a system that can't afford delays.
              </h2>
              <p className="text-sm text-clay/60 leading-relaxed">
                Connects supply registries across public, private, and district health networks to automate resource matching in real-time.
              </p>
            </div>
            <div className="relative z-10 mt-10 grid gap-4 grid-cols-2 md:grid-cols-4 pt-8 border-t border-clay/10">
              {[
                { label: "CONNECTED SUPPLY LAYERS", value: "3 Layers" },
                { label: "GPS SHIELD RADAR", value: "Real-time alerts" },
                { label: "EXPIRATION PRIORITY", value: "Expiry-aware" },
                { label: "AUTO ROUTING STATUS", value: "Automated escalation" },
              ].map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="font-mono text-[10px] text-blood uppercase font-bold tracking-wider">{m.value}</p>
                  <p className="font-mono text-[9px] text-clay/40 uppercase tracking-widest leading-normal">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. FEATURE GRID ── */}
        <FeatureGrid />

        {/* ── 9. FINAL CTA ── */}
        <section className="reveal-item text-center py-10">
          <div className="card border-blood/20 bg-blood-50 p-8 md:p-12 relative overflow-hidden rounded-3xl max-w-3xl mx-auto">
            <span className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-blood-10 animate-ping opacity-30" />
            <div className="relative z-10 max-w-xl mx-auto space-y-6">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-blood">GET CONNECTED</p>
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl leading-tight">
                Don't search when you can match.
              </h2>
              <p className="text-sm text-ink-60 leading-relaxed">
                Connect hospitals, donors, and blood banks through one live coordinate-matching system.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link href="/hospital" className="rounded-xl bg-blood border border-blood px-6 py-3 font-display text-sm font-semibold text-white transition-all hover:bg-blood-light hover:shadow-sm">
                  Request Blood
                </Link>
                <Link href="/login" className="rounded-xl border border-ink-10 bg-white px-6 py-3 font-display text-sm font-semibold text-ink transition-all hover:border-ink">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-ink-10 bg-white py-12 mt-20">
        <div className="mx-auto max-w-5xl px-5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-40">
            <span className="h-1.5 w-1.5 rounded-full bg-blood" />
            LIFELINE COOPERATIVE SYSTEM
          </div>
          <p className="font-mono text-[9px] text-ink-40 tracking-wider">
            © 2026 LIFELINE. FOR DEMONSTRATION &amp; HACKATHON DEMO USE ONLY.
          </p>
        </div>
      </footer>
    </div>
  );
}
