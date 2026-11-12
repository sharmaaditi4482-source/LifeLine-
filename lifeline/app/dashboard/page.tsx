export default function DashboardPage() {
  const stats = [
    { title: "Open cases", value: "12", trend: "+3" },
    { title: "Matched donors", value: "48", trend: "+12" },
    { title: "Dispatch ready", value: "9", trend: "+2" },
    { title: "Critical alerts", value: "3", trend: "-1" },
  ];

  const queue = [
    { title: "AIIMS Trauma", urgency: "Critical", status: "Awaiting dispatch" },
    { title: "Safdarjung ICU", urgency: "High", status: "Matched" },
    { title: "Fortis Delhi", urgency: "Medium", status: "Triage complete" },
  ];

  return (
    <main className="mx-auto max-w-7xl p-6 text-slate-900">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-600">LifeLine AI</p>
          <h1 className="mt-2 text-3xl font-bold">Emergency Operations Dashboard</h1>
        </div>

        <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700">
          New emergency case
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{stat.title}</p>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1.6fr_0.9fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Live queue</h2>
          <div className="mt-4 space-y-3">
            {queue.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{item.title}</h3>
                  <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-red-700">
                    {item.urgency}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{item.status}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Selected emergency</h2>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-amber-700">
              critical
            </span>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <p><span className="font-medium text-slate-900">Hospital:</span> AIIMS Trauma Centre</p>
            <p><span className="font-medium text-slate-900">Patient blood group:</span> O-</p>
            <p><span className="font-medium text-slate-900">Recommended donor:</span> Rahul V. | 2.3 km away</p>
            <p><span className="font-medium text-slate-900">ETA:</span> 18 minutes</p>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold">AI reasoning</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
              <li>Compatible blood type match</li>
              <li>Donor is nearby and currently available</li>
              <li>Reliability score is high</li>
              <li>Safety review showed no blockers</li>
            </ul>
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Action panel</h2>
          <div className="mt-4 space-y-3">
            <button className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700">
              Approve match
            </button>
            <button className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Dispatch rider
            </button>
            <button className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Send donor SMS
            </button>
          </div>
        </aside>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Agent trace</h2>
        <div className="mt-4 space-y-3">
          {[
            "Triage Agent — request parsed and urgency assigned",
            "Eligibility Agent — 12 donors filtered out",
            "Match Agent — top 5 candidates ranked",
            "Safety Agent — no critical blockers found",
            "Dispatch Agent — ETA estimated at 18 minutes",
          ].map((step, idx) => (
            <div key={step} className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-sm text-slate-600">{step}</span>
              {idx < 4 && <span className="ml-auto text-xs uppercase tracking-wider text-slate-400">done</span>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
