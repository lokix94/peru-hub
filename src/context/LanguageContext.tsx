"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Language = "es" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // ── Header ──
  "search.placeholder": {
    es: "¿Qué herramienta buscas para tu agente?",
    en: "What tool are you looking for your agent?",
  },
  "account.label": { es: "Mi cuenta", en: "My account" },
  "orders.label": { es: "Mis pedidos", en: "My orders" },
  "agent.label": { es: "Mi agente", en: "My agent" },
  "recharge": { es: "Recargar", en: "Top up" },
  "recharge.balance": { es: "Recargar saldo", en: "Top up balance" },
  "nav.home": { es: "Inicio", en: "Home" },
  "nav.all": { es: "Todas las skills", en: "All skills" },
  "nav.research": { es: "Investigación", en: "Research" },
  "nav.voice": { es: "Voz y Audio", en: "Voice & Audio" },
  "nav.code": { es: "Código", en: "Code" },
  "nav.productivity": { es: "Productividad", en: "Productivity" },
  "nav.community": { es: "Comunidad", en: "Community" },
  "nav.suggestions": { es: "Sugerencias", en: "Suggestions" },
  "nav.admin": { es: "Admin", en: "Admin" },

  // ── Promo bar ──
  "promo.new": { es: "¡Skills nuevos cada semana!", en: "New skills every week!" },
  "promo.explore": {
    es: "Explora las últimas herramientas para tu agente",
    en: "Explore the latest tools for your agent",
  },

  // ── Landing page ──
  "categories": { es: "Categorías", en: "Categories" },
  "see.all": { es: "Ver todo", en: "See all" },
  "see.all.excited": { es: "¡Ver todo!", en: "See all!" },
  "most.popular": { es: "Más populares", en: "Most popular" },
  "free.for.agent": { es: "Gratis para tu agente", en: "Free for your agent" },
  "recommended": { es: "Recomendados", en: "Recommended" },
  "free.skills.title": { es: "Skills gratuitos — ¡$0.00!", en: "Free skills — $0.00!" },
  "free.skills.desc": {
    es: "Empieza a mejorar tu agente hoy. Sin tarjeta de crédito.",
    en: "Start improving your agent today. No credit card needed.",
  },
  "free.skills.cta": { es: "Ver skills gratis", en: "See free skills" },
  "how.title": { es: "¿Cómo funciona Peru Hub?", en: "How does Peru Hub work?" },
  "how.step1.title": { es: "Explora la tienda", en: "Browse the store" },
  "how.step1.desc": {
    es: "Navega por categorías o busca la skill que necesitas",
    en: "Navigate categories or search for the skill you need",
  },
  "how.step2.title": { es: "Elige y compra", en: "Choose and buy" },
  "how.step2.desc": {
    es: "Muchos son gratis. Los premium cuestan desde $2.99",
    en: "Many are free. Premium skills start at $2.99",
  },
  "how.step3.title": { es: "Instala en tu agente", en: "Install on your agent" },
  "how.step3.desc": {
    es: "Un clic y listo. Sin configuración complicada",
    en: "One click and done. No complicated setup",
  },
  "how.step4.title": { es: "¡Tu agente sube de nivel!", en: "Your agent levels up!" },
  "how.step4.desc": {
    es: "Nuevas habilidades activas inmediatamente",
    en: "New abilities active immediately",
  },
  "testimonials.title": { es: "Lo que dicen los usuarios", en: "What users say" },
  "bottom.cta.title": { es: "Tu agente puede ser mejor.", en: "Your agent can be better." },
  "bottom.cta.desc": {
    es: "Empieza gratis. Sin tarjeta de crédito. Elige un skill y mira cómo tu agente sube de nivel.",
    en: "Start for free. No credit card. Pick a skill and watch your agent level up.",
  },
  "bottom.cta.button": { es: "Explorar la tienda", en: "Explore the store" },

  // ── Category names ──
  "cat.research": { es: "Investigación y Análisis", en: "Research & Analysis" },
  "cat.voice": { es: "Voz y Audio", en: "Voice & Audio" },
  "cat.legal": { es: "Legal y Compliance", en: "Legal & Compliance" },
  "cat.code": { es: "Código y Automatización", en: "Code & Automation" },
  "cat.productivity": { es: "Productividad", en: "Productivity" },
  "cat.agent.core": { es: "Core del Agente", en: "Agent Core" },
  "cat.utilities": { es: "Utilidades", en: "Utilities" },
  "cat.all": { es: "Ver todo", en: "See all" },

  // ── Marketplace / Cards ──
  "add.to.cart": { es: "Agregar al carrito", en: "Add to cart" },
  "added.to.cart": { es: "Agregado al carrito", en: "Added to cart" },
  "add.and.upgrade": { es: "Agregar y mejorar agente", en: "Add and upgrade agent" },
  "add.short": { es: "Agregar", en: "Add" },
  "added.short": { es: "Agregado", en: "Added" },
  "install": { es: "Instalar", en: "Install" },
  "free": { es: "Gratis", en: "Free" },

  // ── Cart ──
  "cart.title": { es: "Mi Carrito", en: "My Cart" },
  "cart.continue": { es: "Seguir comprando", en: "Continue shopping" },
  "cart.pay.humans": { es: "Pago para Humanos", en: "Payment for Humans" },
  "cart.pay.ai": { es: "Pago para Agentes IA", en: "Payment for AI Agents" },
  "cart.confirm": { es: "Confirmar Pago", en: "Confirm Payment" },
  "cart.empty": { es: "Tu carrito está vacío", en: "Your cart is empty" },
  "cart.label": { es: "Carrito", en: "Cart" },

  // ── Recharge Modal ──
  "recharge.title": { es: "Recargar Saldo", en: "Top Up Balance" },
  "recharge.subtitle": { es: "Añade fondos a tu cuenta Peru Hub", en: "Add funds to your Peru Hub account" },
  "recharge.confirm": { es: "Confirmar Recarga", en: "Confirm Top Up" },
  "recharge.scan": { es: "Escanea el QR para recargar tu saldo", en: "Scan the QR to top up your balance" },
  "recharge.deposit": { es: "Dirección de depósito", en: "Deposit address" },
  "recharge.how.much": { es: "¿Cuánto deseas recargar? (USDT)", en: "How much do you want to top up? (USDT)" },
  "recharge.other": { es: "Otro monto...", en: "Other amount..." },
  "recharge.txhash.label": { es: "Ingresa el ID de transacción (TxHash)", en: "Enter transaction ID (TxHash)" },
  "recharge.processing": { es: "Recarga en proceso", en: "Top up processing" },
  "recharge.verifying": { es: "Verificando transacción...", en: "Verifying transaction..." },
  "recharge.amount": { es: "Monto", en: "Amount" },
  "copied": { es: "Copiado", en: "Copied" },
  "copy": { es: "Copiar", en: "Copy" },
  "close": { es: "Cerrar", en: "Close" },

  // ── Suggestions ──
  "suggestions.title": { es: "Buzón de Sugerencias", en: "Suggestion Box" },
  "suggestions.suggestion": { es: "Sugerencia", en: "Suggestion" },
  "suggestions.bug": { es: "Reporte de problema", en: "Bug report" },
  "suggestions.feedback": { es: "Opinión general", en: "General feedback" },
  "suggestions.complaint": { es: "Queja", en: "Complaint" },
  "suggestions.submit": { es: "Enviar sugerencia", en: "Submit suggestion" },

  // ── General ──
  "install.free": { es: "Instalar gratis", en: "Install free" },
  "reviews": { es: "reseñas", en: "reviews" },
  "agents.upgraded": { es: "agentes mejorados", en: "agents upgraded" },
  "one.time": { es: "Pago único", en: "One-time payment" },
  "yours.forever": { es: "Tuyo para siempre", en: "Yours forever" },
  "agents": { es: "agentes", en: "agents" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("es");
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("peru-hub-lang") as Language | null;
      if (saved === "es" || saved === "en") {
        setLangState(saved);
      }
    } catch {
      // localStorage not available (SSR)
    }
    setMounted(true);
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("peru-hub-lang", newLang);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) return key; // fallback: return the key itself
      return entry[lang] ?? entry["es"] ?? key;
    },
    [lang],
  );

  // Prevent hydration mismatch: render children with default "es" until mounted
  // After mount, re-render with the real language
  const value: LanguageContextType = {
    lang: mounted ? lang : "es",
    setLang,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
