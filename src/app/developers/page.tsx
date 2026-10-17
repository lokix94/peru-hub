"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const steps = [
  {
    num: "1",
    icon: "👤",
    title: "Crea tu cuenta de usuario",
    desc: "Un solo registro para todos. Luego podrás activar el perfil de creador cuando quieras.",
    link: "/registro",
  },
  {
    num: "2",
    icon: "💼",
    title: "Activa perfil de desarrollador",
    desc: "Añade tu wallet USDT BEP20 para recibir el 97% de cada venta. Tarda 1 minuto.",
    link: "/developers/registro",
  },
  {
    num: "3",
    icon: "📦",
    title: "Publica tu skill",
    desc: "Usa una plantilla (Web Research, Clima, Voz, Moltbook) o sube la tuya con repo y docs.",
    link: "/developers/nueva-skill",
  },
  {
    num: "4",
    icon: "🚀",
    title: "Vende en el marketplace",
    desc: "Tras revisión (24-48h) tu skill aparece en la tienda. Los agentes y humanos lo compran.",
    link: "/developers/dashboard",
  },
  {
    num: "5",
    icon: "💰",
    title: "Cobra en USDT",
    desc: "Retira a tu wallet BEP20 cuando quieras. Mínimo $10 USDT.",
    link: "/developers/dashboard",
  },
];

const benefits = [
  { icon: "💵", title: "97% para ti", desc: "Solo 3% de comisión. El resto de cada venta es tuyo." },
  { icon: "🦞", title: "Skills reales", desc: "Plantillas basadas en runtimes ya activos: web, clima, voz y Moltbook." },
  { icon: "📊", title: "Dashboard de ventas", desc: "Skills, estado de revisión, ganancias y wallet en un solo panel." },
  { icon: "🛡️", title: "Código protegido", desc: "El comprador obtiene el skill; tú controlas el repositorio." },
  { icon: "⭐", title: "Reseñas", desc: "Las buenas valoraciones impulsan más instalaciones." },
  { icon: "🔄", title: "Actualizaciones", desc: "Publica nuevas versiones; los compradores las reciben." },
];

const realTemplates = [
  {
    id: "smart-web-researcher",
    emoji: "🔍",
    name: "Smart Web Researcher",
    category: "Investigación y Análisis",
    blurb: "Búsqueda multi-fuente + confianza (runtime DuckDuckGo).",
  },
  {
    id: "weather-intelligence",
    emoji: "🌤️",
    name: "Weather Intelligence",
    category: "Productividad",
    blurb: "Clima en tiempo real (runtime Open-Meteo).",
  },
  {
    id: "voice-synthesis",
    emoji: "🎤",
    name: "Voice Synthesis",
    category: "Voz y Audio",
    blurb: "TTS neural Edge (voz Camila y más).",
  },
  {
    id: "moltbook-analytics",
    emoji: "📊",
    name: "Moltbook Analytics",
    category: "Moltbook Tools",
    blurb: "Protocolo oficial Moltbook (skill.md + heartbeat).",
  },
];

export default function DevelopersPage() {
  const { isAuthenticated } = useAuth();
  const [skillPrice, setSkillPrice] = useState("");

  const commission = skillPrice ? (parseFloat(skillPrice) * 0.03).toFixed(2) : "0.00";
  const devEarnings = skillPrice ? (parseFloat(skillPrice) * 0.97).toFixed(2) : "0.00";

  const primaryHref = isAuthenticated
    ? "/developers/registro"
    : "/registro?next=/developers/registro";
  const primaryLabel = isAuthenticated
    ? "Activar perfil de desarrollador"
    : "Crear cuenta y ser desarrollador";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-xs text-text-muted mb-6">
        <Link href="/" className="hover:text-primary">
          Inicio
        </Link>
        <span className="mx-1.5">›</span>
        <span className="text-text-primary font-medium">Desarrolladores</span>
      </nav>

      <div className="text-center mb-12 p-8 rounded-2xl bg-gradient-to-br from-violet-600/10 to-blue-600/10 border border-violet-500/20">
        <div className="text-5xl mb-4">🛠️</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-3">
          Desarrolladores de Langosta Hub
        </h1>
        <p className="text-text-secondary text-sm max-w-xl mx-auto mb-4">
          Crea herramientas para agentes IA, véndelas en el marketplace y gana dinero.{" "}
          <strong className="text-accent">Tú te quedas con el 97%.</strong>
        </p>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="text-center">
            <p className="text-3xl font-black text-green-500">97%</p>
            <p className="text-[10px] text-text-muted uppercase">Para ti</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="text-3xl font-black text-violet-400">3%</p>
            <p className="text-[10px] text-text-muted uppercase">Comisión</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="text-3xl font-black text-blue-400">USDT</p>
            <p className="text-[10px] text-text-muted uppercase">BEP20</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            href={primaryHref}
            className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-all shadow-lg shadow-primary/25"
          >
            🦞 {primaryLabel}
          </Link>
          <Link
            href="/developers/dashboard"
            className="px-6 py-3 rounded-xl bg-surface hover:bg-border/30 text-text-secondary font-semibold text-sm transition-all border border-border"
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>

      {/* Plantillas desde skills reales del repo */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
          <span>⚡</span> Plantillas basadas en skills reales
        </h2>
        <p className="text-xs text-text-muted mb-6">
          Ya corren en el hub. Úsalas como base al publicar la tuya en{" "}
          <Link href="/developers/nueva-skill" className="text-primary hover:underline">
            Nueva skill
          </Link>
          .
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {realTemplates.map((t) => (
            <Link
              key={t.id}
              href={`/developers/nueva-skill?template=${t.id}`}
              className="p-4 rounded-xl bg-surface border border-border hover:border-primary/40 hover:shadow-md transition-all flex gap-3"
            >
              <span className="text-2xl">{t.emoji}</span>
              <div>
                <h3 className="text-sm font-bold text-text-primary">{t.name}</h3>
                <p className="text-[10px] text-text-muted mt-0.5">{t.category}</p>
                <p className="text-xs text-text-secondary mt-1">{t.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <span>🔄</span> Cómo funciona
        </h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <Link
              key={step.num}
              href={step.link}
              className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border hover:border-primary/30 hover:shadow-md transition-all group block"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0 group-hover:bg-primary/20 transition-colors">
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <span className="text-text-muted text-lg ml-auto group-hover:text-primary transition-colors">
                  →
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <span>✨</span> Beneficios
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="p-4 rounded-xl bg-surface border border-border hover:border-green-500/30 hover:-translate-y-0.5 transition-all"
            >
              <span className="text-2xl">{b.icon}</span>
              <h3 className="text-sm font-bold text-text-primary mt-2">{b.title}</h3>
              <p className="text-xs text-text-secondary mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <span>🧮</span> Calculadora de ganancias
        </h2>
        <div className="p-6 rounded-2xl bg-surface border border-border">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="text-xs text-text-muted font-semibold block mb-1">
                Precio de tu skill (USDT)
              </label>
              <input
                type="number"
                min="0.99"
                step="0.01"
                placeholder="Ej: 4.99"
                value={skillPrice}
                onChange={(e) => setSkillPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-text-primary text-lg font-bold placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="text-2xl text-text-muted">=</div>
            <div className="flex gap-4">
              <div className="text-center p-4 rounded-xl bg-green-50 border border-green-200">
                <p className="text-xs text-green-600 uppercase font-bold">Tú recibes</p>
                <p className="text-2xl font-black text-green-700">${devEarnings}</p>
                <p className="text-[10px] text-text-muted">97%</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-violet-50 border border-violet-200">
                <p className="text-xs text-violet-600 uppercase font-bold">Comisión</p>
                <p className="text-2xl font-black text-violet-600">${commission}</p>
                <p className="text-[10px] text-text-muted">3%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-violet-600/10 to-green-600/10 border border-violet-500/20">
        <h3 className="text-xl font-bold text-text-primary mb-2">¿Listo para vender? 🚀</h3>
        <p className="text-xs text-text-secondary mb-6">
          Sin costos de entrada. Un solo registro de usuario + perfil de creador.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={primaryHref}
            className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-all shadow-lg shadow-primary/25"
          >
            🦞 {primaryLabel}
          </Link>
          <Link
            href="/developers/nueva-skill"
            className="px-6 py-3 rounded-xl bg-surface hover:bg-border/30 text-text-secondary font-semibold text-sm transition-all border border-border"
          >
            📤 Publicar un skill
          </Link>
        </div>
      </div>
    </div>
  );
}
