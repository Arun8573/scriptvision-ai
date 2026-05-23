const items = [
  { q: "Cut my note-digitizing time from hours to under a minute. The summarization is uncanny.", a: "Maya Chen", role: "PhD candidate, MIT" },
  { q: "We process thousands of clinical intake forms a week. Accuracy on cursive is the best we've tested.", a: "Dr. Rohan Patel", role: "Clinical Director" },
  { q: "Whiteboard photos → Notion docs in one click. It just works.", a: "Jordan Kim", role: "Product Lead, Vercel" },
];

export function Testimonials() {
  return (
    <section className="py-32 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight text-balance mb-16 max-w-[24ch]">
          Trusted by note-takers who can't afford slop.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t) => (
            <figure key={t.a} className="glass-card p-8 rounded-2xl ring-1 ring-white/5">
              <blockquote className="text-base text-zinc-200 leading-relaxed mb-8">"{t.q}"</blockquote>
              <figcaption>
                <div className="text-sm font-medium text-zinc-100">{t.a}</div>
                <div className="text-xs text-zinc-500 mt-1">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}