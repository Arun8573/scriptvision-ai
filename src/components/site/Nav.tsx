import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-ink-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-6 rounded-sm bg-gradient-to-br from-accent-blue to-accent-purple ring-1 ring-white/20" />
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Ink2Text</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="/#features" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Engine</a>
          <a href="/#workflow" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Workflow</a>
          <a href="/#pricing" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Pricing</a>
          <a href="/#faq" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">FAQ</a>
        </div>
        <Link
          to="/workspace"
          className="text-sm px-3 py-1.5 rounded-md bg-zinc-100 text-ink-950 font-medium hover:bg-white transition-colors"
        >
          Open workspace
        </Link>
      </div>
    </nav>
  );
}