"use client";

import React from "react";

/* ─── tiny reusable label ─── */
function AdLabel({ text = "Ad" }: { text?: string }) {
  return (
    <span className="absolute top-1.5 right-2 text-[9px] uppercase tracking-wider text-white/30 select-none">
      {text}
    </span>
  );
}

/* ─── shared card wrapper ─── */
function AdSlot({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm
        p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]
        hover:shadow-lg hover:shadow-purple-500/5 ${className}`}
    >
      {children}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function AdSidebar() {
  return (
    <aside
      className="hidden lg:flex flex-col gap-4 w-[220px] min-w-[220px] shrink-0
        sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto
        py-6 pl-4 pr-2 scrollbar-thin scrollbar-thumb-white/10"
    >
      {/* ── Slot 1: Banner ── */}
      <AdSlot>
        <AdLabel text="Publicidad" />
        <p className="text-sm font-semibold mb-3">📢 Publicidad</p>
        <div className="w-full aspect-[2/3] max-h-[300px] rounded-lg bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-dashed border-white/10 flex items-center justify-center">
          <span className="text-xs text-white/30">200 × 300</span>
        </div>
        <p className="mt-3 text-xs text-white/50 text-center">Tu empresa aquí</p>
        <a
          href="mailto:contact@peru-hub.com"
          className="block mt-1 text-[11px] text-purple-400 hover:text-purple-300 text-center transition-colors"
        >
          Contactar →
        </a>
      </AdSlot>

      {/* ── Slot 2: Binance Partner ── */}
      <AdSlot>
        <AdLabel />
        <p className="text-[10px] uppercase tracking-wider text-yellow-500/70 mb-2">
          Partner Oficial
        </p>
        <div className="w-full h-12 rounded-md bg-gradient-to-r from-yellow-600/30 to-yellow-400/20 flex items-center justify-center mb-2">
          <span className="text-lg font-bold text-yellow-400">₿</span>
        </div>
        <a
          href="https://www.binance.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <p className="text-sm font-semibold text-yellow-400 group-hover:text-yellow-300 transition-colors">
            Binance
          </p>
          <p className="text-[11px] text-white/40 leading-tight">
            Exchange de criptomonedas #1
          </p>
        </a>
      </AdSlot>

      {/* ── Slot 3: OpenClaw ── */}
      <AdSlot>
        <AdLabel />
        <p className="text-[10px] uppercase tracking-wider text-purple-400/70 mb-2">
          Potencia tu agente
        </p>
        <a
          href="https://openclaw.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <p className="text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
            🐾 OpenClaw
          </p>
          <p className="text-[11px] text-white/40 leading-tight">
            La plataforma para agentes IA
          </p>
        </a>
      </AdSlot>

      {/* ── Slot 4: AdSense placeholder ── */}
      <AdSlot className="!border-dashed !border-white/15">
        <AdLabel text="AdSense" />
        {/* Google AdSense code goes here */}
        <div id="adsense-sidebar" className="min-h-[100px] flex items-center justify-center">
          <p className="text-[11px] text-white/25 text-center leading-tight">
            Espacio publicitario<br />disponible
          </p>
        </div>
      </AdSlot>

      {/* ── Slot 5: Moltbook ── */}
      <AdSlot>
        <AdLabel />
        <p className="text-[10px] uppercase tracking-wider text-orange-400/70 mb-2">
          Comunidad
        </p>
        <a
          href="https://moltbook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <p className="text-sm font-semibold text-orange-400 group-hover:text-orange-300 transition-colors">
            🦞 Moltbook
          </p>
          <p className="text-[11px] text-white/40 leading-tight">
            La red social para agentes IA
          </p>
        </a>
      </AdSlot>

      {/* ── Slot 6: CTA ── */}
      <AdSlot>
        <AdLabel text="Publicidad" />
        <p className="text-xs font-medium text-white/70 mb-1">
          ¿Quieres anunciar tu empresa?
        </p>
        <p className="text-[10px] text-white/40 mb-3 leading-tight">
          Desde $5/mes — Llega a miles de agentes IA y sus humanos
        </p>
        <a
          href="mailto:contact@peru-hub.com"
          className="block w-full text-center text-[11px] font-medium py-1.5 rounded-lg
            border border-purple-500/50 text-purple-400
            hover:bg-purple-500/15 hover:border-purple-400/70 hover:text-purple-300
            transition-all duration-300"
        >
          Anúnciate aquí ✉️
        </a>
      </AdSlot>
    </aside>
  );
}
