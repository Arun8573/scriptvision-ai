import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] glow-radial opacity-10 pointer-events-none blur-[120px]" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 mb-6">
            <span className="text-[11px] font-medium tracking-wider uppercase text-accent-blue">
              Neural Engine v4.0
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight leading-[1.05] text-balance mb-8">
            Handwriting evolved into{" "}
            <span className="text-gradient">structured data</span>
          </h1>
          <p className="text-base md:text-lg text-zinc-400 max-w-[56ch] mx-auto text-pretty mb-10">
            Bridge the gap between analog thought and digital execution. Our crystallization engine
            converts messy notes, PDFs, and whiteboard photos into high-fidelity text with industry-leading accuracy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/workspace"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium ring-2 ring-accent-blue/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all"
            >
              Start converting free
            </Link>
            <a
              href="#workflow"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 pr-4 pl-3 rounded-lg bg-zinc-800/50 text-zinc-100 ring-1 ring-white/10 hover:bg-zinc-800 transition-colors"
            >
              <span className="size-1.5 rounded-full bg-zinc-400 animate-pulse" />
              <span className="text-sm font-medium">See how it works</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-accent-purple/5 blur-[100px] rounded-full" />
          <div className="relative glass-card ring-1 ring-white/10 rounded-2xl overflow-hidden p-4 md:p-8 grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Input · Analog</span>
                <div className="size-2 rounded-full bg-red-500/60 ring-2 ring-red-500/20" />
              </div>
              <div className="w-full aspect-[4/3] bg-ink-900 rounded-lg ring-1 ring-white/5 p-6 relative overflow-hidden">
                <svg viewBox="0 0 400 300" className="w-full h-full opacity-80">
                  <text x="20" y="40" fontFamily="cursive" fontSize="22" fill="#94a3b8" transform="rotate(-2 20 40)">Project Phoenix</text>
                  <text x="25" y="80" fontFamily="cursive" fontSize="16" fill="#94a3b8" transform="rotate(-1 25 80)">1. Analyze skeletal arch.</text>
                  <text x="25" y="115" fontFamily="cursive" fontSize="16" fill="#94a3b8" transform="rotate(1 25 115)">2. Bridge the neural gap</text>
                  <text x="25" y="150" fontFamily="cursive" fontSize="16" fill="#94a3b8" transform="rotate(-1 25 150)">3. Export to JSON schema</text>
                  <path d="M 20 200 Q 100 180 200 210 T 380 200" stroke="#475569" strokeWidth="2" fill="none" />
                  <text x="20" y="240" fontFamily="cursive" fontSize="14" fill="#64748b" transform="rotate(2 20 240)">"latency &lt; 50ms p99"</text>
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-accent-blue uppercase">Output · Digital</span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase">99.4% confidence</span>
              </div>
              <div className="w-full aspect-[4/3] bg-ink-800/50 rounded-lg p-6 ring-1 ring-white/5 font-mono text-sm leading-relaxed text-zinc-300">
                <p className="border-l-2 border-accent-blue/50 pl-3 mb-4 text-zinc-100">## Project Phoenix</p>
                <ol className="space-y-2 mb-4">
                  <li>1. Analyze existing skeletal architecture</li>
                  <li>2. Bridge the neural gap between pixels</li>
                  <li>3. Export to structured JSON schema</li>
                </ol>
                <p className="text-zinc-500 text-xs">// latency &lt; 50ms p99</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}