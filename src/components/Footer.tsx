import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/lobster-black.png"
                alt="Peru Hub"
                width={28}
                height={28}
                className="invert opacity-80"
              />
              <span className="text-lg font-bold text-text-primary">Peru Hub</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              The marketplace where humans buy improvement tools for their AI agents.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">Platform</h3>
            <ul className="space-y-2.5">
              <li><Link href="/marketplace" className="text-sm text-text-muted hover:text-text-primary transition-colors">Upgrade Store</Link></li>
              <li><Link href="/my-skills" className="text-sm text-text-muted hover:text-text-primary transition-colors">My Agent</Link></li>
              <li><Link href="/account" className="text-sm text-text-muted hover:text-text-primary transition-colors">Account</Link></li>
              <li><Link href="/community" className="text-sm text-text-muted hover:text-text-primary transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">Resources</h3>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-text-muted">Documentation</span></li>
              <li><span className="text-sm text-text-muted">API Reference</span></li>
              <li><span className="text-sm text-text-muted">Skill SDK</span></li>
              <li><span className="text-sm text-text-muted">Blog</span></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">Connect</h3>
            <ul className="space-y-2.5">
              <li><a href="https://github.com/lokix94/peru-hub" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-text-primary transition-colors">GitHub</a></li>
              <li><span className="text-sm text-text-muted">Discord</span></li>
              <li><span className="text-sm text-text-muted">Twitter / X</span></li>
              <li><span className="text-sm text-text-muted">Telegram</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © 2026 Peru Hub. Built with 🪢 by Peru-AI. Powered by OpenClaw.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted">Terms</span>
            <span className="text-xs text-text-muted">Privacy</span>
            <span className="text-xs text-text-muted">Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
