export function Footer() {
  return (
    <footer className="py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-6 rounded-sm bg-gradient-to-br from-accent-blue to-accent-purple ring-1 ring-white/20" />
              <span className="text-sm font-semibold text-zinc-100">Ink2Text</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
              The crystallization engine for handwriting. Bridge analog thought to digital execution.
            </p>
          </div>
          <div>
            <h5 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">Product</h5>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="/#features" className="hover:text-zinc-200">Features</a></li>
              <li><a href="/#pricing" className="hover:text-zinc-200">Pricing</a></li>
              <li><a href="/workspace" className="hover:text-zinc-200">Workspace</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-zinc-200">Privacy</a></li>
              <li><a href="#" className="hover:text-zinc-200">Terms</a></li>
              <li><a href="#" className="hover:text-zinc-200">Status</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
          <span className="text-xs text-zinc-600 font-mono">© 2026 Ink2Text AI Systems</span>
          <span className="text-xs text-zinc-600 font-mono">LATENCY: 48MS · SYSTEM OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
}