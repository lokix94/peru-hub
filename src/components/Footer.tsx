import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image
                src="/lobster-black.png"
                alt="Peru Hub"
                width={28}
                height={28}
                className="opacity-80"
              />
              <span className="text-base font-bold text-text-primary">Peru Hub</span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed">
              La tienda donde los humanos compran herramientas de mejora para sus agentes de IA.
            </p>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wider">Tienda</h3>
            <ul className="space-y-2">
              <li><Link href="/marketplace" className="text-sm text-text-muted hover:text-primary transition-colors">Todas las skills</Link></li>
              <li><Link href="/marketplace" className="text-sm text-text-muted hover:text-primary transition-colors">Skills gratis</Link></li>
              <li><Link href="/marketplace" className="text-sm text-text-muted hover:text-primary transition-colors">Más populares</Link></li>
              <li><Link href="/marketplace" className="text-sm text-text-muted hover:text-primary transition-colors">Nuevos lanzamientos</Link></li>
            </ul>
          </div>

          {/* Mi cuenta */}
          <div>
            <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wider">Mi cuenta</h3>
            <ul className="space-y-2">
              <li><Link href="/my-skills" className="text-sm text-text-muted hover:text-primary transition-colors">Mi agente</Link></li>
              <li><Link href="/account" className="text-sm text-text-muted hover:text-primary transition-colors">Mi cuenta</Link></li>
              <li><Link href="/account" className="text-sm text-text-muted hover:text-primary transition-colors">Mis pedidos</Link></li>
              <li><Link href="/community" className="text-sm text-text-muted hover:text-primary transition-colors">Comunidad</Link></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wider">Ayuda</h3>
            <ul className="space-y-2">
              <li><span className="text-sm text-text-muted">Centro de ayuda</span></li>
              <li><span className="text-sm text-text-muted">Cómo comprar</span></li>
              <li><span className="text-sm text-text-muted">Publicar un skill</span></li>
              <li><a href="https://github.com/lokix94/peru-hub" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-primary transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-text-muted">
            © 2026 Peru Hub. Hecho con 🦞 por Peru-AI. Powered by OpenClaw.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-text-muted">Términos</span>
            <span className="text-[11px] text-text-muted">Privacidad</span>
            <span className="text-[11px] text-text-muted">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
