"use client";

import { useLanguage } from "@/lib/languageContext";

interface HandleSmoothScroll {
  (e: React.MouseEvent<HTMLAnchorElement>, id: string): void;
}

interface HowItWorksProps {
  handleSmoothScroll: HandleSmoothScroll;
}

export default function HowItWorks({ handleSmoothScroll }: HowItWorksProps) {
  void handleSmoothScroll;
  const { language, t } = useLanguage();
  const isHindi = language === "hi";

  const steps = [
    {
      step: "01",
      badge: isHindi ? "मांग प्रविष्टि" : "DEMAND INGESTION",
      title: isHindi ? "अस्पताल का तत्काल अनुरोध" : "Hospital Raises Request",
      desc: isHindi
        ? "अस्पताल आवश्यक रक्त समूह, यूनिट्स और गंभीरता दर्ज करते हैं। लाइव GPS स्थान तुरंत लॉक हो जाता है।"
        : "Hospital desks input recipient blood group, units needed, and urgency. Live GPS coordinates are automatically locked.",
      icon: "🏥",
    },
    {
      step: "02",
      badge: isHindi ? "स्मार्ट सॉर्टिंग" : "AUTONOMOUS SORTING",
      title: isHindi ? "एल्गोरिदम स्कोरिंग" : "Engine Runs Scoring",
      desc: isHindi
        ? "ABO/Rh जैविक सुरक्षा के बाद निकटता (30%), गंभीरता (35%), समाप्ति (20%) और विश्वसनीयता (15%) से सर्वश्रेष्ठ विकल्प रैंक होते हैं।"
        : "LifeLine applies hard ABO/Rh biological filters first, then ranks candidates by Proximity (30%), Urgency (35%), Expiry (20%), and Reliability (15%).",
      icon: "⚡",
    },
    {
      step: "03",
      badge: isHindi ? "सुरक्षित आरक्षण" : "ATOMIC RESERVATION",
      title: isHindi ? "प्रथम-पुष्टि लॉक" : "First-Confirmed Lock",
      desc: isHindi
        ? "शीर्ष रैंक वाले रक्तदाता को तुरंत अलर्ट भेजा जाता है। पुष्टि होते ही यूनिट लॉक हो जाती है और शेष उम्मीदवार पुनः उपलब्ध हो जाते हैं।"
        : "The top-ranked donor or bank is dispatched immediately. Once confirmed, the unit is locked and all secondary candidates are released.",
      icon: "🔒",
    },
  ];

  return (
    <section id="how-it-works" className="reveal-item space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/60 border border-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blood" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blood">
              {isHindi ? "कार्यप्रणाली प्रोटोकॉल" : "OPERATIONS PROTOCOL"}
            </span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            {t("hiw_title")}
          </h2>
        </div>
        <p className="max-w-md text-xs sm:text-sm text-ink-60 leading-relaxed">
          {t("hiw_sub")}
        </p>
      </div>

      {/* 3-Step horizontal card workflow */}
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((item) => (
          <div
            key={item.step}
            className="rounded-3xl bg-white border border-ink-10 p-6 shadow-sm hover:shadow-md hover:border-blood/30 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blood bg-red-50 border border-red-200/60 px-3 py-1 rounded-full">
                  {isHindi ? `चरण ${item.step}` : `STEP ${item.step}`}
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
