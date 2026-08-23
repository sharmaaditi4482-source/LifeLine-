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
    <div className="bg-[#FBF9F5] min-h-screen selection:bg-blood/10 selection:text-ink relative font-body text-ink overflow-x-hidden">

      {/* ── BACKGROUND BIOLOGICAL VASCULAR FLOW & FLOATING RUBY DROPLETS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
        {/* Dynamic Vascular Curves SVG */}
        <svg className="absolute top-0 left-0 w-full h-[900px] opacity-45" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main Flow Ribbon 1 */}
          <path
            d="M-80 180 C 180 90, 320 420, 120 640 C -40 820, 220 860, 480 820"
            stroke="url(#blood-gradient-1)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Animated Laser Vein Signal */}
          <path
            d="M-80 180 C 180 90, 320 420, 120 640 C -40 820, 220 860, 480 820"
            stroke="#FF3333"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className="animate-laser-dash opacity-70"
          />
          {/* Secondary Arterial Ribbon 2 */}
          <path
            d="M-40 90 C 260 70, 420 360, 260 590 C 110 790, 480 770, 640 840"
            stroke="url(#blood-gradient-2)"
            strokeWidth="1.5"
            strokeDasharray="6 10"
            fill="none"
          />
          {/* Subtle Tertiary Wave */}
          <path
            d="M-120 320 C 120 250, 290 490, 190 730"
            stroke="url(#blood-gradient-1)"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="blood-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A8201A" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#E11D48" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#A8201A" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="blood-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E11D48" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#A8201A" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* ── Realistic Floating 3D Ruby Blood Droplets ── */}
        
        {/* Droplet 1 (Top-Left under Navbar) */}
        <div className="absolute top-[260px] left-[40px] animate-float-sway select-none">
          <svg width="36" height="48" viewBox="0 0 36 48" fill="none" className="filter drop-shadow-[0_8px_16px_rgba(168,32,26,0.35)]">
            <path
              d="M18 2 C18 2, 34 22, 34 32 C34 40.8366 26.8366 48 18 48 C9.16344 48 2 40.8366 2 32 C2 22, 18 2 18 2Z"
              fill="url(#droplet-ruby-1)"
            />
            {/* Specular Light Reflection Highlight */}
            <path
              d="M14 14 C14 14, 8 26, 8 32 C8 35 10 38 13 38 C11 36 10 33 10 30 C10 24 14 14 14 14Z"
              fill="white"
              opacity="0.55"
            />
            <defs>
              <linearGradient id="droplet-ruby-1" x1="8" y1="4" x2="28" y2="46" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF4D4D" />
                <stop offset="40%" stopColor="#C41E18" />
                <stop offset="100%" stopColor="#660A06" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Droplet 2 (Mid-Left) */}
        <div className="absolute top-[510px] left-[55px] animate-float-sway-rev select-none">
          <svg width="28" height="38" viewBox="0 0 36 48" fill="none" className="filter drop-shadow-[0_6px_14px_rgba(168,32,26,0.3)]">
            <path
              d="M18 2 C18 2, 34 22, 34 32 C34 40.8366 26.8366 48 18 48 C9.16344 48 2 40.8366 2 32 C2 22, 18 2 18 2Z"
              fill="url(#droplet-ruby-2)"
            />
            <path
              d="M14 14 C14 14, 8 26, 8 32 C8 35 10 38 13 38 C11 36 10 33 10 30 C10 24 14 14 14 14Z"
              fill="white"
              opacity="0.6"
            />
            <defs>
              <linearGradient id="droplet-ruby-2" x1="8" y1="4" x2="28" y2="46" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF6666" />
                <stop offset="50%" stopColor="#D92019" />
                <stop offset="100%" stopColor="#750C08" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Droplet 3 (Bottom-Left) */}
        <div className="absolute top-[760px] left-[25px] animate-float-sway select-none" style={{ animationDelay: "1.5s" }}>
          <svg width="42" height="56" viewBox="0 0 36 48" fill="none" className="filter drop-shadow-[0_10px_20px_rgba(168,32,26,0.35)] opacity-85">
            <path
              d="M18 2 C18 2, 34 22, 34 32 C34 40.8366 26.8366 48 18 48 C9.16344 48 2 40.8366 2 32 C2 22, 18 2 18 2Z"
              fill="url(#droplet-ruby-3)"
            />
            <path
              d="M14 14 C14 14, 8 26, 8 32 C8 35 10 38 13 38 C11 36 10 33 10 30 C10 24 14 14 14 14Z"
              fill="white"
              opacity="0.5"
            />
            <defs>
              <linearGradient id="droplet-ruby-3" x1="8" y1="4" x2="28" y2="46" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF4D4D" />
                <stop offset="45%" stopColor="#A8201A" />
                <stop offset="100%" stopColor="#550805" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Ambient Warm Radial Background Glow */}
        <div className="absolute top-20 left-10 w-[550px] h-[550px] bg-red-100/35 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── STICKY NAVBAR ── */}
      <nav className="sticky top-0 z-50 w-full border-b border-ink-10/80 bg-[#FBF9F5]/90 backdrop-blur-md transition-all">
        <div className="mx-auto max-w-7xl px-5 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blood to-red-600 flex items-center justify-center text-white shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-wider text-ink leading-tight">
                LIFELINE
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-blood font-semibold -mt-0.5">
                ENGINE
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-mono uppercase tracking-wider text-ink-60 font-medium">
            <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "how-it-works")} className="hover:text-blood transition-colors">
              How It Works
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
            <a href="#system-modules" onClick={(e) => handleSmoothScroll(e, "system-modules")} className="hover:text-blood transition-colors">
              About Us
            </a>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative p-2 rounded-xl bg-white border border-ink-10 text-ink-60 hover:text-ink cursor-pointer transition shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blood text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </div>

            {/* Dashboard Button */}
            <Link
              href="/hospital"
              className="flex items-center gap-2 rounded-xl border border-ink-10 bg-white px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink transition hover:border-ink shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>

            {/* Logout / Login button */}
            {session ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
                type="button"
                className="rounded-xl bg-blood px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-blood-light shadow-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-blood px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-blood-light shadow-sm"
              >
                Logout
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 space-y-16 sm:space-y-24 relative z-10">

        {/* ── 1. HERO SECTION ── */}
        <section className="grid gap-8 lg:grid-cols-[1fr_460px] items-center pt-2 sm:pt-6 page-enter">
          <div className="space-y-6">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100/70 border border-red-200 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blood animate-pulse" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blood">
                BIO-MATCHING NETWORK V1.2 •
              </span>
            </div>

            {/* Title with ECG waveform line */}
            <div className="space-y-1">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-[54px] leading-[1.08]">
                Compatible blood exist.
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-display text-4xl sm:text-5xl md:text-[54px] text-blood font-normal italic">
                  Right on time
                </span>
                {/* SVG ECG Line */}
                <svg className="w-24 sm:w-32 h-8 text-blood" viewBox="0 0 120 30" fill="none">
                  <path
                    d="M0 15 H30 L35 5 L42 25 L48 2 L55 22 L60 15 H120"
                    stroke="#A8201A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <p className="max-w-xl text-base text-ink-60 leading-relaxed sm:text-lg">
              LifeLine connects hospitals, donors, and blood banks through live tracking when every second matters.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/hospital"
                className="flex items-center gap-2 rounded-2xl bg-blood px-6 py-3.5 font-display text-sm font-semibold text-white transition-all hover:bg-blood-light shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                Request Blood
              </Link>
              <a
                href="#how-it-works"
                onClick={(e) => handleSmoothScroll(e, "how-it-works")}
                className="flex items-center gap-2 rounded-2xl border border-ink-10 bg-white px-6 py-3.5 font-display text-sm font-semibold text-ink transition-all hover:border-ink shadow-sm"
              >
                <span>▶</span> See How It Works
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono uppercase tracking-wider text-ink-60 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🛡️</span> Secure &amp; Verified
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-amber-500">⚡</span> Real-time Matching
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-blood">❤️</span> Save More Lives
              </div>
            </div>
          </div>

          {/* Right Hero Futuristic Card */}
          <div className="w-full flex items-center justify-center">
            <HeroNetworkVisual />
          </div>
        </section>

        {/* ── 2. LIVE UPDATES TICKER BAR ── */}
        <section className="reveal-item w-full">
          <div className="rounded-2xl bg-white border border-ink-10 p-2.5 sm:p-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-r from-blood to-red-600 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5 flex-shrink-0 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                ((•)) LIVE UPDATES
              </div>
              <p className="text-xs sm:text-sm font-medium text-ink flex items-center gap-2 truncate">
                <span className="text-blood">🩸</span>
                <span>O- donor dispatch matched in Rohini — <strong>1.8 km away</strong></span>
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs text-ink-40 justify-end flex-shrink-0">
              <span>12s ago</span>
              <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "how-it-works")} className="text-blood hover:underline font-semibold">
                View All →
              </a>
            </div>
          </div>
        </section>

        {/* ── 3. FOUR METRIC STATS CARDS (WITH SPARKLINE CHARTS) ── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 reveal-item">
          {/* Card 1 */}
          <div className="rounded-2xl bg-white border border-ink-10 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-blood flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <span className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                ↑ 12%
              </span>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-ink">1,248</h3>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-40 mt-0.5">Units Matched Today</p>
            </div>
            {/* Red Mini Sparkline */}
            <svg className="w-full h-5 text-blood/70" viewBox="0 0 100 20" fill="none">
              <path d="M0 15 Q20 5, 40 12 T70 4 T100 10" stroke="#A8201A" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-white border border-ink-10 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                ↑ 8%
              </span>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-ink">892</h3>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-40 mt-0.5">Active Donors</p>
            </div>
            {/* Coral Mini Sparkline */}
            <svg className="w-full h-5 text-rose-500" viewBox="0 0 100 20" fill="none">
              <path d="M0 16 Q25 10, 50 14 T80 6 T100 12" stroke="#E11D48" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-white border border-ink-10 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                ↑ 5%
              </span>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-ink">156</h3>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-40 mt-0.5">Hospitals Connected</p>
            </div>
            {/* Purple Mini Sparkline */}
            <svg className="w-full h-5 text-purple-600" viewBox="0 0 100 20" fill="none">
              <path d="M0 12 Q30 18, 60 8 T90 14 T100 6" stroke="#9333EA" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl bg-white border border-ink-10 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Excellent
              </span>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-ink">99.8%</h3>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-40 mt-0.5">Safety Score</p>
            </div>
            {/* Blue Mini Sparkline */}
            <svg className="w-full h-5 text-blue-500" viewBox="0 0 100 20" fill="none">
              <path d="M0 14 Q20 8, 45 15 T75 6 T100 8" stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </section>

        {/* ── 4. SYSTEM MODULES (HORIZONTALLY SLEEK) ── */}
        <section id="system-modules" className="space-y-6 reveal-item">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blood" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-ink font-semibold">
                SYSTEM MODULES
              </h3>
            </div>
            <Link href="/login" className="font-mono text-xs text-ink-40 hover:text-blood transition-colors">
              View All Modules →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Module 1: Emergency Desk */}
            <Link
              href="/hospital"
              className="group rounded-2xl bg-white border border-ink-10 p-5 shadow-sm hover:border-blood/50 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-blood flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-ink group-hover:text-blood transition-colors">
                    Emergency Desk
                  </h4>
                  <p className="text-xs text-ink-60 mt-0.5 line-clamp-1">
                    Raise urgent blood requests and get instant matches.
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-ink-5 group-hover:bg-blood group-hover:text-white flex items-center justify-center text-ink-40 transition-colors flex-shrink-0 ml-2">
                →
              </div>
            </Link>

            {/* Module 2: Volunteer Network */}
            <Link
              href="/donor"
              className="group rounded-2xl bg-white border border-ink-10 p-5 shadow-sm hover:border-blood/50 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-ink group-hover:text-blood transition-colors">
                    Volunteer Network
                  </h4>
                  <p className="text-xs text-ink-60 mt-0.5 line-clamp-1">
                    Connect with verified donors and save more lives.
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-ink-5 group-hover:bg-blood group-hover:text-white flex items-center justify-center text-ink-40 transition-colors flex-shrink-0 ml-2">
                →
              </div>
            </Link>

            {/* Module 3: Supply Chain */}
            <Link
              href="/bank"
              className="group rounded-2xl bg-white border border-ink-10 p-5 shadow-sm hover:border-blood/50 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-ink group-hover:text-blood transition-colors">
                    Supply Chain
                  </h4>
                  <p className="text-xs text-ink-60 mt-0.5 line-clamp-1">
                    Real-time tracking of blood units and deliveries.
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-ink-5 group-hover:bg-blood group-hover:text-white flex items-center justify-center text-ink-40 transition-colors flex-shrink-0 ml-2">
                →
              </div>
            </Link>
          </div>
        </section>

        {/* ── 4. HOW IT WORKS ── */}
        <HowItWorks handleSmoothScroll={handleSmoothScroll} />

        {/* ── 5. MATCHING ENGINE SECTION ── */}
        <section id="matching-engine" className="reveal-item space-y-10">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/60 border border-red-200">
                <span className="h-1.5 w-1.5 rounded-full bg-blood" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blood">
                  DECISION SYSTEM
                </span>
              </div>
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl leading-tight">
                Not a directory.
                <br />
                <span className="italic font-normal text-blood">A live matching engine.</span>
              </h2>
              <p className="text-sm text-ink-60 leading-relaxed">
                LifeLine doesn't simply show a phonebook list. It calculates which eligible source should be surfaced first, taking into account medical safety, distance, and shelf-life.
              </p>

              {/* Interactive scoring weights panel */}
              <div className="rounded-3xl border border-ink-10 bg-white p-6 space-y-4 shadow-sm">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-40">
                  Matching Equation Weights
                </p>
                <div className="space-y-2.5">
                  {[
                    { key: "urgency", name: "Urgency Level", val: "35%", desc: "Prioritizes critical emergency trauma dispatches instantly." },
                    { key: "proximity", name: "Distance Proximity", val: "30%", desc: "Calculated using high-accuracy Haversine GPS coordinates." },
                    { key: "expiry", name: "Inventory Shelf Expiry", val: "20%", desc: "Prioritizes blood banks holding stock nearing expiration." },
                    { key: "reliability", name: "Donor Turnout Reliability", val: "15%", desc: "Uses historical attendance rates to prevent emergency no-shows." },
                  ].map((f) => (
                    <div
                      key={f.key}
                      onClick={() => setSelectedScoreFactor(f.key)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        selectedScoreFactor === f.key
                          ? "border-blood bg-red-50/60 shadow-sm"
                          : "border-transparent hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="font-semibold text-ink">{f.name}</span>
                        <span className="text-blood font-bold">{f.val}</span>
                      </div>
                      {selectedScoreFactor === f.key && (
                        <p className="mt-1.5 text-xs text-ink-60 font-body animate-fade-in">{f.desc}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated ranking panel */}
            <div className="rounded-3xl border border-ink-10 bg-white p-6 space-y-4 shadow-sm flex flex-col justify-center">
              <div className="flex items-center justify-between border-b border-ink-10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blood animate-pulse" />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink">
                    Active Matching Circuit
                  </span>
                </div>
                <span className="font-mono text-[10px] text-ink-60 uppercase font-semibold bg-stone-100 px-2 py-0.5 rounded-full">
                  Group: B+
                </span>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] shadow-sm">
                  <div className="absolute top-0 right-0 bg-blood text-white font-mono text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-bl-xl">
                    #01 BEST MATCH
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-semibold text-sm text-ink">Rahul Verma</h4>
                      <p className="mt-1 font-mono text-[10px] text-ink-60">O- Donor · 1.2 km away</p>
                      <p className="mt-0.5 font-mono text-[9px] text-emerald-600 font-semibold">Reliability Rate: 96%</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-2xl font-bold text-blood">94</span>
                      <p className="font-mono text-[8px] text-blood uppercase tracking-wider font-semibold">Match Score</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-ink-10 bg-white p-4 transition-all duration-300 hover:scale-[1.01] shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-semibold text-sm text-ink">Red Cross Blood Bank</h4>
                      <p className="mt-1 font-mono text-[10px] text-ink-60">Blood Bank · 2.4 km away</p>
                      <p className="mt-0.5 font-mono text-[9px] text-amber-600 font-semibold">2 units · Expires in 5 days</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-2xl font-bold text-ink">87</span>
                      <p className="font-mono text-[8px] text-ink-40 uppercase tracking-wider font-semibold">Match Score</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-ink-10 bg-white p-4 transition-all duration-300 hover:scale-[1.01] shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-semibold text-sm text-ink">Aman Gupta</h4>
                      <p className="mt-1 font-mono text-[10px] text-ink-60">B+ Donor · 5.1 km away</p>
                      <p className="mt-0.5 font-mono text-[9px] text-ink-40">Reliability Rate: 82%</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-2xl font-bold text-ink-60">76</span>
                      <p className="font-mono text-[8px] text-ink-40 uppercase tracking-wider font-semibold">Match Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. SAFETY SECTION ── */}
        <section id="safety" className="reveal-item grid gap-10 lg:grid-cols-[340px_1fr] items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/60 border border-red-200">
              <span className="h-1.5 w-1.5 rounded-full bg-blood" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blood">
                SAFETY PROTOCOL
              </span>
            </div>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl leading-tight">
              Safety comes
              <br />
              <span className="italic font-normal text-blood">before speed.</span>
            </h2>
            <p className="text-sm text-ink-60 leading-relaxed">
              Every demand runs a hard biological circuit check before scoring matches. Incompatible blood is dropped with zero tolerance.
            </p>
            <div className="space-y-3 pt-1">
              {["ABO/Rh genetic compatibility verified", "Zero-risk algorithmic circuit breaker", "Continuous expiry monitoring"].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-red-100 text-blood flex items-center justify-center font-mono text-[10px] font-bold">✓</span>
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
          <div className="rounded-3xl border border-red-950/40 bg-gradient-to-br from-[#1F0707] via-[#140404] to-[#0A0202] text-white p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
              <svg width="100%" height="100%">
                <pattern id="dark-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#dark-grid)" />
              </svg>
            </div>
            <div className="relative z-10 max-w-xl space-y-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-950/80 border border-red-800/40 px-3 py-1 rounded-full">
                SECURE DEPLOYMENT
              </span>
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl leading-tight">
                A live network for a system that cannot afford delays.
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Connects supply registries across public, private, and district health networks to automate resource matching in real-time.
              </p>
            </div>
            <div className="relative z-10 mt-10 grid gap-4 grid-cols-2 md:grid-cols-4 pt-8 border-t border-white/10">
              {[
                { label: "CONNECTED SUPPLY LAYERS", value: "3 Layers" },
                { label: "GPS SHIELD RADAR", value: "Real-time alerts" },
                { label: "EXPIRATION PRIORITY", value: "Expiry-aware" },
                { label: "AUTO ROUTING STATUS", value: "Automated lock" },
              ].map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="font-mono text-xs text-red-400 uppercase font-bold tracking-wider">{m.value}</p>
                  <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest leading-normal">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. FEATURE GRID ── */}
        <FeatureGrid />

        {/* ── 9. FINAL CTA ── */}
        <section className="reveal-item text-center py-6">
          <div className="rounded-3xl border border-red-200 bg-gradient-to-b from-red-50 to-[#FAF7F2] p-8 md:p-14 relative overflow-hidden max-w-3xl mx-auto shadow-sm">
            <span className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-red-200/50 animate-ping opacity-30 pointer-events-none" />
            <div className="relative z-10 max-w-xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/80 border border-red-200">
                <span className="h-1.5 w-1.5 rounded-full bg-blood" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blood">
                  CONNECT WITH LIFELINE
                </span>
              </div>
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl leading-tight">
                Don't search when you can match.
              </h2>
              <p className="text-xs sm:text-sm text-ink-60 leading-relaxed max-w-md mx-auto">
                Connect hospitals, donors, and blood banks through one live coordinate-matching system.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href="/hospital"
                  className="rounded-2xl bg-blood border border-blood px-7 py-3.5 font-display text-sm font-semibold text-white transition-all hover:bg-blood-light shadow-md hover:shadow-lg"
                >
                  Request Blood
                </Link>
                <Link
                  href="/login"
                  className="rounded-2xl border border-ink-10 bg-white px-7 py-3.5 font-display text-sm font-semibold text-ink transition-all hover:border-ink shadow-sm"
                >
                  Register / Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── STICKY EMERGENCY SOS WIDGET (BOTTOM RIGHT VERTICAL PILL) ── */}
      <aside aria-label="Emergency SOS" className="fixed bottom-6 right-6 z-50">
        <Link
          href="/hospital"
          className="flex flex-col items-center justify-between w-[92px] h-[135px] rounded-[26px] bg-gradient-to-b from-[#8E1410] via-[#A8201A] to-[#600C08] p-3 text-white border border-red-400/35 shadow-[0_12px_30px_rgba(168,32,26,0.45)] hover:scale-105 transition-all group select-none text-center"
        >
          <div className="flex flex-col items-center">
            <span className="font-mono text-[8px] uppercase tracking-widest text-red-200 font-extrabold">
              EMERGENCY
            </span>
            <span className="font-display font-extrabold text-xl tracking-tight leading-none mt-0.5 text-white">
              SOS
            </span>
            <span className="text-[8px] text-red-200/90 font-medium mt-1 leading-tight">
              Need Help<br />Now?
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white text-blood flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mt-1">
            <svg className="w-5 h-5 text-blood" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.21 2.2z"/>
            </svg>
          </div>
        </Link>
      </aside>

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
