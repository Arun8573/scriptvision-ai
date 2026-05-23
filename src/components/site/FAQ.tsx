const faqs = [
  { q: "How accurate is the OCR?", a: "Our neural engine achieves 99%+ accuracy on clean handwriting and 92–96% on messy cursive depending on lighting and contrast." },
  { q: "Is my data private?", a: "Conversions run client-side in your browser by default. Cloud sync is opt-in and encrypted at rest." },
  { q: "What file types are supported?", a: "JPG, PNG, WEBP, HEIC, and PDF — up to 20MB per file." },
  { q: "Can I cancel anytime?", a: "Yes. Plans are month-to-month with no commitment." },
  { q: "Do you support languages other than English?", a: "Yes — 100+ languages including non-Latin scripts." },
];

export function FAQ() {
  return (
    <section id="faq" className="py-32">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-12 text-center">
          Questions, answered.
        </h2>
        <div className="divide-y divide-white/5 border-y border-white/5">
          {faqs.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-base font-medium text-zinc-100">{f.q}</span>
                <span className="text-zinc-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <p className="mt-4 text-sm text-zinc-400 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}