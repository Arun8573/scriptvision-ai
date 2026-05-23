const features = [
  { title: "Multi-language OCR", body: "Recognition for 100+ languages including cursive and complex scripts.", accent: true },
  { title: "AI summarization", body: "Condense pages of notes into a single executive summary." },
  { title: "Batch processing", body: "Upload entire notebooks as PDFs and convert them in seconds." },
  { title: "Smart export", body: "Native Markdown, DOCX, and searchable PDF formats." },
  { title: "Spell correction", body: "AI cleanup fixes shorthand and reconstructs intent." },
  { title: "Confidence score", body: "Per-line confidence so you know what to double-check." },
  { title: "Translation", body: "Translate the extracted text into 50+ target languages." },
  { title: "Voice read-aloud", body: "Listen to your notes with natural narration." },
];

export function Features() {
  return (
    <section id="features" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-[48ch]">
            <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight text-balance mb-4">
              Engineered for precision
            </h2>
            <p className="text-zinc-400 text-pretty">
              From doctor's notes to architectural blueprints, we decode every stroke.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-card p-6 rounded-2xl ring-1 ring-white/5 hover:ring-accent-blue/30 transition-all"
            >
              <div
                className={`size-8 rounded-lg flex items-center justify-center mb-6 ring-1 ${
                  f.accent
                    ? "bg-accent-blue/10 ring-accent-blue/20"
                    : "bg-zinc-800 ring-white/10"
                }`}
              >
                <div
                  className={`size-4 rounded-sm ${
                    f.accent ? "bg-accent-blue/50" : "bg-zinc-600"
                  }`}
                />
              </div>
              <h4 className="text-base font-medium text-zinc-100 mb-2">{f.title}</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}