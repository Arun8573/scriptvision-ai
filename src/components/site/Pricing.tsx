const tiers = [
  {
    name: "Individual",
    price: "$0",
    suffix: "/mo",
    features: ["5 conversions per day", "Standard processing", "TXT export"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Professional",
    price: "$19",
    suffix: "/mo",
    features: ["Unlimited conversions", "Priority neural queue", "AI synthesis engine", "All export formats", "API access"],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "Custom",
    suffix: "",
    features: ["SSO & SAML support", "Private cloud hosting", "Dedicated account lead", "SLA + audit logs"],
    cta: "Contact sales",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-gradient-to-b from-transparent to-ink-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-4">
            Crystal-clear pricing
          </h2>
          <p className="text-zinc-500">Pick the plan that matches your cognitive load.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`p-8 rounded-2xl flex flex-col relative ${
                t.highlight
                  ? "ring-2 ring-accent-blue bg-accent-blue/5"
                  : "border border-white/5"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent-blue text-[10px] font-semibold text-white uppercase rounded-full tracking-wider">
                  Most Popular
                </div>
              )}
              <h3 className={`text-sm font-medium mb-2 ${t.highlight ? "text-accent-blue" : "text-zinc-400"}`}>
                {t.name}
              </h3>
              <div className="text-3xl font-medium text-white mb-6">
                {t.price}
                {t.suffix && <span className="text-lg text-zinc-600 font-normal">{t.suffix}</span>}
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-center gap-3 text-sm ${
                      t.highlight ? "text-zinc-200" : "text-zinc-400"
                    }`}
                  >
                    <div className="size-1 rounded-full bg-accent-blue" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                  t.highlight
                    ? "bg-accent-blue text-white hover:bg-accent-blue/90 ring-2 ring-accent-blue/20"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}