"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import RechargeModal from "./RechargeModal";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rechargeOpen, setRechargeOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar — promo */}
      <div className="bg-primary text-white text-center py-1.5 text-xs font-medium tracking-wide">
        🚀 ¡Skills nuevos cada semana! — Explora las últimas herramientas para tu agente
      </div>

      {/* Main header — dark */}
      <div className="bg-header-bg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <Image
                src="/lobster-black.png"
                alt="Peru Hub"
                width={34}
                height={34}
                className="invert opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-white leading-none">Peru Hub</span>
                <span className="block text-[10px] text-header-muted leading-tight">Upgrade Store</span>
              </div>
            </Link>

            {/* Search bar — the big centerpiece */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="¿Qué herramienta buscas para tu agente?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 rounded-full bg-white text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary hover:bg-primary-hover flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right side — account & cart */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/account"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === "/account"
                    ? "bg-white/10 text-white"
                    : "text-header-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="block text-[10px] text-header-muted">Mi cuenta</span>
                  <span className="block text-xs font-medium text-white">Juan Carlos</span>
                </div>
              </Link>

              <Link
                href="/admin"
                className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm transition-colors ${
                  pathname === "/admin"
                    ? "bg-white/10 text-white"
                    : "text-header-muted hover:text-white hover:bg-white/5"
                }`}
                title="Panel de Administrador"
              >
                ⚙️
              </Link>

              <Link
                href="/my-skills"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === "/my-skills"
                    ? "bg-white/10 text-white"
                    : "text-header-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="block text-[10px] text-header-muted">Mis pedidos</span>
                  <span className="block text-xs font-medium text-white">Mi agente</span>
                </div>
              </Link>

              {/* Cart / Balance — opens recharge modal */}
              <button
                onClick={() => setRechargeOpen(true)}
                className="flex items-center gap-2 px-3 py-2 ml-1 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors group cursor-pointer"
              >
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span className="text-sm font-bold text-accent">$0.00</span>
                <span className="text-[10px] text-accent/60 group-hover:text-accent font-medium transition-colors">+ Recargar</span>
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-header-muted hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation bar — secondary */}
      <nav className="bg-white border-b border-border hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-11">
            {[
              { href: "/", label: "Inicio" },
              { href: "/marketplace", label: "🛒 Todas las skills" },
              { href: "/marketplace#research", label: "🔍 Investigación" },
              { href: "/marketplace#voice", label: "🎤 Voz y Audio" },
              { href: "/marketplace#dev", label: "💻 Código" },
              { href: "/marketplace#productivity", label: "📧 Productividad" },
              { href: "/community", label: "👥 Comunidad" },
            ].map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("#")[0]) && item.href !== "/";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-light text-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-header-bg border-b border-white/10 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {[
              { href: "/", label: "🏠 Inicio" },
              { href: "/marketplace", label: "🛒 Todas las skills" },
              { href: "/my-skills", label: "📋 Mi agente" },
              { href: "/account", label: "👤 Mi cuenta" },
              { href: "/community", label: "👥 Comunidad" },
              { href: "/admin", label: "⚙️ Admin" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm text-header-muted hover:text-white hover:bg-white/5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => { setMobileOpen(false); setRechargeOpen(true); }}
              className="w-full pt-2 mt-2 border-t border-white/10 flex items-center gap-2 px-3 hover:bg-white/5 rounded-lg py-2.5 transition-colors"
            >
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <span className="text-sm font-bold text-accent">Saldo: $0.00</span>
              <span className="text-[10px] text-accent/60 ml-1">+ Recargar</span>
            </button>
          </div>
        </div>
      )}
      {/* Recharge Modal */}
      <RechargeModal isOpen={rechargeOpen} onClose={() => setRechargeOpen(false)} />
    </header>
  );
}
