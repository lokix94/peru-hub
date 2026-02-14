"use client";

import Link from "next/link";
import { useState } from "react";
import SkillCard from "@/components/SkillCard";
import { skills, getFeaturedSkills, getSkillsByCategory } from "@/data/skills";

const banners = [
  {
    id: 1,
    headline: "Dale voz a tu agente 🎙️",
    sub: "Voz neural peruana — Camila suena tan real que nadie nota la diferencia",
    cta: "Instalar gratis",
    link: "/marketplace/voice-camila-tts",
    gradient: "from-violet-600 to-indigo-700",
  },
  {
    id: 2,
    headline: "¿Tu agente olvida todo? 🧠",
    sub: "Instala Memory Curator y tu agente recordará cada detalle importante",
    cta: "Ver skill",
    link: "/marketplace/memory-curator",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: 3,
    headline: "Nuevo: Research Pro 🌐",
    sub: "Tu agente verifica información en múltiples fuentes — adiós alucinaciones",
    cta: "Desde $4.99",
    link: "/marketplace/web-research-pro",
    gradient: "from-emerald-500 to-teal-600",
  },
];

const storeCategories = [
  { name: "Investigación y Análisis", icon: "🔍", slug: "Research", color: "bg-blue-50 border-blue-200 hover:bg-blue-100", iconBg: "bg-blue-100" },
  { name: "Voz y Audio", icon: "🎤", slug: "Voice", color: "bg-purple-50 border-purple-200 hover:bg-purple-100", iconBg: "bg-purple-100" },
  { name: "Legal y Compliance", icon: "⚖️", slug: "Research", color: "bg-red-50 border-red-200 hover:bg-red-100", iconBg: "bg-red-100" },
  { name: "Código y Automatización", icon: "💻", slug: "Development", color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100", iconBg: "bg-emerald-100" },
  { name: "Productividad", icon: "📧", slug: "Productivity", color: "bg-amber-50 border-amber-200 hover:bg-amber-100", iconBg: "bg-amber-100" },
  { name: "Core del Agente", icon: "🧠", slug: "Agent Core", color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100", iconBg: "bg-indigo-100" },
  { name: "Utilidades", icon: "🌤️", slug: "Utilities", color: "bg-teal-50 border-teal-200 hover:bg-teal-100", iconBg: "bg-teal-100" },
  { name: "Ver todo", icon: "🛒", slug: "all", color: "bg-gray-50 border-gray-200 hover:bg-gray-100", iconBg: "bg-gray-100" },
];

export default function HomePage() {
  const [activeBanner, setActiveBanner] = useState(0);
  const featured = getFeaturedSkills();
  const popular = [...skills].sort((a, b) => b.installs - a.installs);
  const free = skills.filter(s => s.price === 0);

  return (
    <div className="min-h-screen">
      {/* ===== BANNER CAROUSEL ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="relative">
          {/* Active banner */}
          <Link href={banners[activeBanner].link}>
            <div className={`banner-slide bg-gradient-to-r ${banners[activeBanner].gradient} p-8 md:p-12 text-white relative overflow-hidden cursor-pointer group`}>
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />

              <div className="relative max-w-lg">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
                  {banners[activeBanner].headline}
                </h2>
                <p className="text-white/80 text-sm md:text-base mb-5 leading-relaxed">
                  {banners[activeBanner].sub}
                </p>
                <span className="inline-block px-6 py-2.5 bg-white text-gray-900 font-semibold rounded-full text-sm group-hover:bg-gray-100 transition-colors shadow-lg">
                  {banners[activeBanner].cta} →
                </span>
              </div>
            </div>
          </Link>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === activeBanner ? "bg-primary w-8" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORY GRID ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Categorías</h2>
          <Link href="/marketplace" className="text-sm text-primary hover:text-primary-hover font-medium">
            Ver todo →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {storeCategories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.slug === "all" ? "/marketplace" : `/marketplace?cat=${cat.slug}`}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${cat.color}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${cat.iconBg}`}>
                {cat.icon}
              </div>
              <span className="text-xs font-medium text-text-secondary text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== POPULAR — MOST INSTALLED ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">🔥 Más populares</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 uppercase">Top</span>
          </div>
          <Link href="/marketplace" className="text-sm text-primary hover:text-primary-hover font-medium">
            ¡Ver todo! →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.slice(0, 4).map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>

      {/* ===== FREE SKILLS BANNER ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-1">🎉 Skills gratuitos — ¡$0.00!</h3>
            <p className="text-white/80 text-sm">Empieza a mejorar tu agente hoy. Sin tarjeta de crédito.</p>
          </div>
          <Link href="/marketplace?price=free" className="px-6 py-2.5 bg-white text-green-700 font-semibold rounded-full text-sm hover:bg-green-50 transition-colors shadow-lg whitespace-nowrap">
            Ver skills gratis →
          </Link>
        </div>
      </section>

      {/* ===== FREE SKILLS GRID ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">🆓 Gratis para tu agente</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">FREE</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {free.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>

      {/* ===== FEATURED / STAFF PICKS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">⭐ Recomendados</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Staff Pick</span>
          </div>
          <Link href="/marketplace" className="text-sm text-primary hover:text-primary-hover font-medium">
            ¡Ver todo! →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-border p-8 md:p-10">
          <h2 className="text-xl font-bold text-text-primary text-center mb-8">
            ¿Cómo funciona Peru Hub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", icon: "🛒", title: "Explora la tienda", desc: "Navega por categorías o busca la skill que necesitas" },
              { step: "2", icon: "💳", title: "Elige y compra", desc: "Muchos son gratis. Los premium cuestan desde $2.99" },
              { step: "3", icon: "⚡", title: "Instala en tu agente", desc: "Un clic y listo. Sin configuración complicada" },
              { step: "4", icon: "🚀", title: "¡Tu agente sube de nivel!", desc: "Nuevas habilidades activas inmediatamente" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-2xl mx-auto mb-3 relative">
                  {item.icon}
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">{item.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-10">
        <h2 className="text-lg font-bold text-text-primary mb-4">💬 Lo que dicen los usuarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { quote: "Mi agente pasó de no saber nada de leyes a citar artículos constitucionales específicos. Increíble.", author: "LegalEagle_Lima", skill: "⚖️ Legal Research" },
            { quote: "¡Mi agente ahora HABLA! El acento peruano suena tan natural que mi familia pensó que estaba en una llamada real.", author: "PodcasterPE", skill: "🎙️ Voz Camila" },
            { quote: "De día y noche. Mi agente antes inventaba cosas — ahora verifica en múltiples fuentes.", author: "DataAnalyst42", skill: "🌐 Research Pro" },
          ].map((item) => (
            <div key={item.author} className="bg-white border border-border rounded-xl p-5">
              <div className="flex mb-2">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">&ldquo;{item.quote}&rdquo;</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">{item.author}</span>
                <span className="text-xs text-text-muted">{item.skill}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="bg-header-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Tu agente puede ser mejor.
          </h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Empieza gratis. Sin tarjeta de crédito. Elige un skill y mira cómo tu agente sube de nivel.
          </p>
          <Link
            href="/marketplace"
            className="inline-block px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-full text-base transition-all shadow-lg shadow-primary/30 hover:-translate-y-0.5"
          >
            Explorar la tienda →
          </Link>
        </div>
      </section>
    </div>
  );
}
