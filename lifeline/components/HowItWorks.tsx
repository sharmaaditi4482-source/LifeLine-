"use client";

interface HandleSmoothScroll {
  (e: React.MouseEvent<HTMLAnchorElement>, id: string): void;
}

interface HowItWorksProps {
  handleSmoothScroll: HandleSmoothScroll;
}

export default function HowItWorks({ handleSmoothScroll }: HowItWorksProps) {
  void handleSmoothScroll;
  return (
    <section id="how-it-works" className="reveal-item space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/60 border border-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blood" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blood">
              OPERATIONS PROTOCOL
            </span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            From emergency alert to verified transfusion.
          </h2>
        </div>
        <p className="max-w-md text-xs sm:text-sm text-ink-60 leading-relaxed">
          How LifeLine coordinates hospitals, donors, and blood banks autonomously in three continuous steps.
        </p>
      </div>

      {/* 3-Step horizontal card workflow */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            step: "01",
            badge: "DEMAND INGESTION",
            title: "Hospital Raises Request",
            desc: "Hospital desks input recipient blood group, units needed, and urgency. Live GPS coordinates are automatically locked.",
            icon: "🏥",
          },
          {
            step: "02",
            badge: "AUTONOMOUS SORTING",
            title: "Engine Runs Scoring",
            desc: "LifeLine applies hard ABO/Rh biological filters first, then ranks candidates by Proximity (30%), Urgency (35%), Expiry (20%), and Reliability (15%).",
            icon: "⚡",
          },
          {
            step: "03",
            badge: "ATOMIC RESERVATION",
            title: "First-Confirmed Lock",
            desc: "The top-ranked donor or bank is dispatched immediately. Once confirmed, the unit is locked and all secondary candidates are released.",
            icon: "🔒",
          },
        ].map((item) => (
          <div
            key={item.step}
            className="rounded-3xl bg-white border border-ink-10 p-6 shadow-sm hover:shadow-md hover:border-blood/30 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blood bg-red-50 border border-red-200/60 px-3 py-1 rounded-full">
                  STEP {item.step}
                </span>
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink group-hover:text-blood transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-xs text-ink-60 leading-relaxed">
                {item.desc}
              </p>
            </div>
            <div className="pt-3 border-t border-ink-10 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-ink-40 font-semibold">
                {item.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
