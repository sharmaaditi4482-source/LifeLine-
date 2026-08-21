"use client";

import { useEffect, useState } from "react";

interface FeedEvent {
  id: number;
  text: string;
  italicText: string;
  time: string;
  active?: boolean;
}

const EVENTS: FeedEvent[] = [
  {
    id: 1,
    text: "matched in Rohini — 1.8 km,",
    italicText: "O- donor dispatch",
    time: "12s ago",
  },
  {
    id: 2,
    text: "allocated at Noida Sector 62 — 3.8 km,",
    italicText: "A+ bank inventory",
    time: "48s ago",
  },
  {
    id: 3,
    text: "matched at Connaught Place — 1.2 km,",
    italicText: "O- universal match",
    time: "2m ago",
  },
  {
    id: 4,
    text: "dispatched to Gurugram Sector 29 — 5.1 km,",
    italicText: "B+ request confirmed",
    time: "5m ago",
  },
  {
    id: 5,
    text: "allocated at Lajpat Nagar — 0.9 km,",
    italicText: "O+ emergency supply",
    time: "8m ago",
  },
];

export default function LiveFeed() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % EVENTS.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const event = EVENTS[index];

  return (
    // key={index} guarantees a clean remount, triggering the shimmer-sweep overlay animation on rotation
    <div 
      key={index}
      className="relative overflow-hidden card border-ink-10 bg-white/40 px-5 py-3.5 backdrop-blur-sm transition-all duration-300"
    >
      {/* Light shimmer sweep scanner line */}
      <div className="ticker-shimmer-overlay pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Left Side Ticker */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Heartbeat pulse icon matching navigation logo mark dot */}
          <div className="h-2 w-2 rounded-full bg-blood animate-heartbeat-ecg flex-shrink-0" />

          <div className="flex items-center gap-1.5 text-xs text-ink-60 animate-fade-in">
            <span className="font-display italic text-blood font-semibold">
              {event.italicText}
            </span>{" "}
            <span className="truncate">{event.text}</span>
          </div>
        </div>

        {/* Timestamp */}
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-40 animate-fade-in">
          {event.time}
        </span>
      </div>
    </div>
  );
}
