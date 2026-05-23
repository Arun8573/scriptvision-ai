const steps = [
  { n: "01", title: "Upload capture", body: "Drop any image, PDF, or whiteboard snap. Camera support on mobile.", color: "text-accent-purple" },
  { n: "02", title: "Neural synthesis", body: "Our models trace ink density to reconstruct your intent into text.", color: "text-accent-blue" },
  { n: "03", title: "Pure extraction", body: "Copy, edit, summarize, or export to Notion, Word, and PDF.", color: "text-accent-purple" },
];

export function Workflow() {
  return (
    <section id="workflow" className="py-24 border-y border-white/5 bg-ink-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className={`text-xs font-mono ${s.color} mb-4`}>Step {s.n}</div>
              <h3 className="text-xl font-medium text-white mb-3">{s.title}</h3>
              <p className="text-sm text-zinc-400 max-w-[35ch] leading-relaxed">{s.body}</p>
              {i < steps.length - 1 && (
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 hidden md:block">
                  <div className="w-12 h-px bg-gradient-to-r from-white/10 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}