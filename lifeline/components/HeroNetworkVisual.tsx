"use client";

import { useEffect, useState } from "react";

export default function HeroNetworkVisual() {
  const [activeNode, setActiveNode] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[320px] md:h-[380px] rounded-2xl border border-ink-10 bg-white shadow-sm overflow-hidden flex items-center justify-center p-6 select-none">
      {/* Editorial backdrop diagnostics grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="hero-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--ink)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Network lines and nodes container */}
      <div className="relative w-full h-full max-w-[340px] flex items-center justify-center">
        {/* Animated Connecting Pathways (Veins/Signals) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
          {/* Path 1: Donor A to Hospital */}
          <path
            d="M 30 50 Q 80 80, 100 110"
            stroke="var(--ink-10)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 30 50 Q 80 80, 100 110"
            stroke="var(--blood)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 12"
            strokeLinecap="round"
            className={`opacity-60 ${activeNode === 0 ? "animate-path-signal" : ""}`}
          />

          {/* Path 2: Blood Bank to Hospital */}
          <path
            d="M 100 35 L 100 110"
            stroke="var(--ink-10)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 100 35 L 100 110"
            stroke="var(--blood)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 12"
            strokeLinecap="round"
            className={`opacity-60 ${activeNode === 1 ? "animate-path-signal" : ""}`}
            style={{ animationDelay: "0.5s" }}
          />

          {/* Path 3: Donor C to Hospital */}
          <path
            d="M 170 50 Q 120 80, 100 110"
            stroke="var(--ink-10)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 170 50 Q 120 80, 100 110"
            stroke="var(--blood)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 12"
            strokeLinecap="round"
            className={`opacity-60 ${activeNode === 2 ? "animate-path-signal" : ""}`}
            style={{ animationDelay: "1s" }}
          />
        </svg>

        {/* ── TOP NODES (Sources) ── */}
        
        {/* Node 1: Donor A (O-) */}
        <div className="absolute left-[15px] top-[25px] flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full border bg-white flex items-center justify-center transition-all duration-500 ${
            activeNode === 0 ? "border-blood scale-105 shadow-sm" : "border-ink-10"
          }`}>
            <span className="font-mono text-xs font-semibold text-ink">O-</span>
          </div>
          <span className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-ink-40">Donor #21</span>
        </div>

        {/* Node 2: Blood Bank B (B+) */}
        <div className="absolute left-[50%] -translate-x-1/2 top-[10px] flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full border bg-white flex items-center justify-center transition-all duration-500 ${
            activeNode === 1 ? "border-blood scale-105 shadow-sm" : "border-ink-10"
          }`}>
            <span className="font-mono text-xs font-semibold text-ink">B+</span>
          </div>
          <span className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-ink-40">Bank B1</span>
        </div>

        {/* Node 3: Donor C (A+) */}
        <div className="absolute right-[15px] top-[25px] flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full border bg-white flex items-center justify-center transition-all duration-500 ${
            activeNode === 2 ? "border-blood scale-105 shadow-sm" : "border-ink-10"
          }`}>
            <span className="font-mono text-xs font-semibold text-ink">A+</span>
          </div>
          <span className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-ink-40">Donor #48</span>
        </div>

        {/* ── CENTRAL REQUEST NODE (Hospital) ── */}
        <div className="absolute bottom-[25px] flex flex-col items-center">
          <div className="relative w-14 h-14 rounded-full border border-blood bg-blood-50 flex items-center justify-center animate-droplet-breathe">
            {/* Pulsing signal ring */}
            <span className="absolute inset-0 rounded-full border border-blood opacity-20 scale-125 animate-ping" />
            <div className="w-9 h-9 rounded-full bg-blood flex items-center justify-center text-white">
              <svg className="w-4.5 h-4.5" viewBox="0 0 12 16" fill="currentColor">
                <path d="M6 0C2.4 4.8 0 8 0 11.2C0 14 2.2 16 6 16C9.8 16 12 14 12 11.2C12 8 9.6 4.8 6 0Z" />
              </svg>
            </div>
          </div>
          <span className="mt-2 font-display text-[10px] font-bold uppercase tracking-widest text-ink">Trauma Unit</span>
          <span className="font-mono text-[8px] tracking-wide text-blood uppercase font-medium">B+ Demanded</span>
        </div>

        {/* ── FLOATING LIVE MATCH CARD ── */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 w-44 card border-blood-10 bg-white/95 p-3 shadow-md backdrop-blur-sm animate-fade-in">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blood animate-heartbeat-ecg" />
            <span className="font-mono text-[8px] font-semibold uppercase tracking-widest text-blood">Live Match Found</span>
          </div>
          <p className="mt-1.5 font-display text-xs font-semibold text-ink leading-tight">
            {activeNode === 0 ? "O- Universal Donor" : activeNode === 1 ? "B+ Bank Reserve" : "A+ Volunteer Match"}
          </p>
          <div className="mt-1 flex justify-between text-[9px] font-mono text-ink-40">
            <span>{activeNode === 0 ? "1.2 km" : activeNode === 1 ? "3.8 km" : "2.4 km"}</span>
            <span>Compatibility ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
