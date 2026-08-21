"use client";

interface HandleSmoothScroll {
  (e: React.MouseEvent<HTMLAnchorElement>, id: string): void;
}

interface HowItWorksProps {
  handleSmoothScroll: HandleSmoothScroll;
}

export default function HowItWorks({ handleSmoothScroll }: HowItWorksProps) {
  void handleSmoothScroll; // used in parent nav links
  return (
    <section id="how-it-works" className="reveal-item space-y-12">
      <div className="max-w-xl">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-blood">OPERATIONS MANUAL</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
          From emergency request to confirmed match.
        </h2>
      </div>

      {/* 3-Step horizontal flow */}
      <div className="grid gap-8 md:grid-cols-3 relative">
        {[
          {
            step: "01",
            label: "REQUEST",
            title: "Submit Demand",
            desc: "Hospital submits required blood group, urgency level, precise GPS location, and targeted units.",
          },
          {
            step: "02",
            label: "MATCH",
            title: "Scored Sorting",
            desc: "LifeLine filters incompatibility out, then calculates proximity, urgency, stock expiry, and donor reliability.",
          },
          {
            step: "03",
            label: "CONFIRM",
            title: "Lock Match",
            desc: "The top-ranked candidate is dispatched immediately. When confirmed, first-confirmed-lock activates and all others are released.",
          },
        ].map((item) => (
          <div key={item.step} className="relative space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-blood-light bg-blood-10 border border-blood-10/20 px-2 py-0.5 rounded-md">
                {item.step}
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-40">{item.label}</span>
            </div>
            <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
            <p className="text-xs text-ink-60 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
