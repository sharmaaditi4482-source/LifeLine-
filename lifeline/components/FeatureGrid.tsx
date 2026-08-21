"use client";

export default function FeatureGrid() {
  const features = [
    { title: "Live Weighted Matching", desc: "Instantly computes candidate rank dynamically based on 4 scoring vectors." },
    { title: "Hard ABO/Rh Safety Filter", desc: "Enforces strict genetic matching circuits before scoring algorithms run." },
    { title: "Expiry-Aware Prioritization", desc: "Prioritizes units nearest to their expiration limits to reduce resource waste." },
    { title: "Donor Turnout Scoring", desc: "Tracks historical donor attendance rates to calculate reliability coefficients." },
    { title: "First-Confirmed Locking", desc: "Locks the first matching confirmation and automatically releases alternative reserves." },
    { title: "Automated Escalation", desc: "Triggers district-level alerts automatically if local resources report no matches." },
    { title: "Role-Based Dashboards", desc: "Individual secure portals customized for hospitals, donors, and bank units." },
    { title: "Real-Time Push Alerts", desc: "Dispatches SMS and portal messages with coordinate maps to confirmed matches." },
  ];

  return (
    <section className="reveal-item space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-blood">PRODUCT CAPABILITIES</p>
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          Verified clinical infrastructure.
        </h2>
        <p className="text-sm text-ink-60 max-w-sm mx-auto">
          Built for speed, safety, and coordinate alignment during critical dispatches.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {features.map((f, i) => (
          <div
            key={i}
            className="card border-ink-10 bg-white p-5 space-y-2.5 transition-all hover:border-blood/20 shadow-sm"
          >
            <h4 className="font-display font-semibold text-sm text-ink">{f.title}</h4>
            <p className="text-[11px] text-ink-60 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
