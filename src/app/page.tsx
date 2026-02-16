"use client";

import Link from "next/link";
import { useState } from "react";
import SkillCard from "@/components/SkillCard";
import AdBanner from "@/components/AdBanner";
import { skills, getFeaturedSkills, getNewSkills, CATEGORIES } from "@/data/skills";
import { useLanguage } from "@/context/LanguageContext";

const banners = [
  {
    id: 1,
    headline: { es: "Moltbook Tools — ¡Ya llegaron! 🦞", en: "Moltbook Tools — They're here! 🦞" },
    sub: {
      es: "Analytics, Auto-Poster, Community Manager y Trend Scanner. Todo para dominar Moltbook.",
      en: "Analytics, Auto-Poster, Community Manager & Trend Scanner. Everything to dominate Moltbook.",
    },
    cta: { es: "Ver Moltbook Tools", en: "See Moltbook Tools" },
    link: "/marketplace/moltbook-analytics",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: 2,
    headline: { es: "Investigación inteligente 🔍", en: "Smart Research 🔍" },
    sub: {
      es: "Smart Web Researcher verifica en múltiples fuentes y puntúa la confiabilidad",
      en: "Smart Web Researcher verifies across multiple sources and scores reliability",
    },
    cta: { es: "Obtener gratis", en: "Get free" },
    link: "/marketplace/smart-web-researcher",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 3,
    headline: { es: "Tu agente habla 🎤", en: "Your agent speaks 🎤" },
    sub: {
      es: "Voz neural peruana — Camila suena tan real que nadie nota la diferencia",
      en: "Peruvian neural voice — Camila sounds so real nobody notices the difference",
    },
    cta: { es: "Desde $2.99", en: "From $2.99" },
    link: "/marketplace/voice-synthesis",
    gradient: "from-violet-600 to-indigo-700",
  },
];

export default function HomePage() {
  const [activeBanner, setActiveBanner] = useState(0);
  const { lang, t } = useLanguage();
  const featured = getFeaturedSkills();
  const newSkills = getNewSkills();
  const popular = [...skills].sort((a, b) => b.installCount - a.installCount);
  const free = skills.filter(s => s.price === 0);

  const nameKeyMap: Record<string, string> = {
    "Investigación y Análisis": "cat.research",
    "Moltbook Tools": "cat.moltbook",
    "Voz y Audio": "cat.voice",
    "Código y Automatización": "cat.code",
    "Productividad": "cat.productivity",
    "Core del Agente": "cat.agent.core",
  };

  const storeCategories = [
    ...CATEGORIES.map((cat) => ({
      nameKey: nameKeyMap[cat.key] || cat.key,
      icon: cat.icon,
      categoryKey: cat.key,
      color: cat.color,
      iconBg: cat.iconBg,
    })),
    { nameKey: "cat.all", icon: "🛒", categoryKey: "all", color: "bg-gray-50 border-gray-200 hover:bg-gray-100", iconBg: "bg-gray-100" },
  ];

  const howSteps = [
    { step: "1", icon: "🛒", titleKey: "how.step1.title", descKey: "how.step1.desc" },
    { step: "2", icon: "💳", titleKey: "how.step2.title", descKey: "how.step2.desc" },
    { step: "3", icon: "⚡", titleKey: "how.step3.title", descKey: "how.step3.desc" },
    { step: "4", icon: "🚀", titleKey: "how.step4.title", descKey: "how.step4.desc" },
  ];

  return (
    <div className="min-h-screen">
      {/* ===== BANNER CAROUSEL ===== */}
      <section className="max-w-7xl mx-auto px-2 md:px-4 sm:px-6 lg:px-8 pt-2 md:pt-6 pb-2 md:pb-4">
        <div className="relative">
          {/* Active banner */}
          <Link href={banners[activeBanner].link}>
            <div className={`banner-slide bg-gradient-to-r ${banners[activeBanner].gradient} min-h-[35vh] md:min-h-[auto] flex items-center p-5 md:p-12 text-white relative overflow-hidden cursor-pointer group rounded-xl md:rounded-2xl`}>
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />

              <div className="relative max-w-lg">
                <h2 className="text-2xl md:text-4xl font-extrabold mb-2 md:mb-3 leading-tight">
                  {banners[activeBanner].headline[lang]}
                </h2>
                <p className="text-white/85 text-sm md:text-base mb-4 md:mb-5 leading-relaxed">
                  {banners[activeBanner].sub[lang]}
                </p>
                <span className="inline-block px-5 py-2 md:px-6 md:py-2.5 bg-white text-gray-900 font-semibold rounded-full text-sm group-hover:bg-gray-100 transition-colors shadow-lg">
                  {banners[activeBanner].cta[lang]} →
                </span>
              </div>
            </div>
          </Link>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-2 md:mt-4">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all ${
                  i === activeBanner ? "bg-primary w-6 md:w-8" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORY GRID ===== */}
      <section className="max-w-7xl mx-auto px-2 md:px-4 sm:px-6 lg:px-8 py-3 md:py-6">
        <div className="flex items-center justify-between mb-2 md:mb-4 px-1 md:px-0">
          <h2 className="text-base md:text-lg font-bold text-text-primary">{t("categories")}</h2>
          <Link href="/marketplace" className="text-xs md:text-sm text-primary hover:text-primary-hover font-medium">
            {t("see.all")} →
          </Link>
        </div>

        {/* Mobile: horizontal scroll / Desktop: grid */}
        <div className="flex md:grid md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
          {storeCategories.map((cat) => (
            <Link
              key={cat.nameKey}
              href={cat.categoryKey === "all" ? "/marketplace" : `/marketplace?category=${encodeURIComponent(cat.categoryKey)}`}
              className={`flex flex-col items-center gap-1 md:gap-2 p-2 md:p-4 rounded-xl border transition-all shrink-0 w-[72px] md:w-auto ${cat.color}`}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl ${cat.iconBg}`}>
                {cat.icon}
              </div>
              <span className="text-[10px] md:text-xs font-medium text-text-secondary text-center leading-tight">
                {t(cat.nameKey)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== NEW SKILLS ===== */}
      {newSkills.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-text-primary">🆕 {lang === "es" ? "Recién llegados" : "Just Arrived"}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-600 uppercase">New</span>
            </div>
            <Link href="/marketplace" className="text-sm text-primary hover:text-primary-hover font-medium">
              {t("see.all.excited")} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newSkills.slice(0, 4).map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}

      {/* ===== POPULAR — MOST INSTALLED ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">🔥 {t("most.popular")}</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 uppercase">Top</span>
          </div>
          <Link href="/marketplace" className="text-sm text-primary hover:text-primary-hover font-medium">
            {t("see.all.excited")} →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.slice(0, 4).map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>

      {/* ===== AD BANNER — Landing Page ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdBanner variant="light" />
      </section>

      {/* ===== FREE SKILLS BANNER ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-1">🎉 {t("free.skills.title")}</h3>
            <p className="text-white/80 text-sm">{t("free.skills.desc")}</p>
          </div>
          <Link href="/marketplace?price=free" className="px-6 py-2.5 bg-white text-green-700 font-semibold rounded-full text-sm hover:bg-green-50 transition-colors shadow-lg whitespace-nowrap">
            {t("free.skills.cta")} →
          </Link>
        </div>
      </section>

      {/* ===== FREE SKILLS GRID ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">🆓 {t("free.for.agent")}</h2>
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
            <h2 className="text-lg font-bold text-text-primary">⭐ {t("recommended")}</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Staff Pick</span>
          </div>
          <Link href="/marketplace" className="text-sm text-primary hover:text-primary-hover font-medium">
            {t("see.all.excited")} →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.slice(0, 4).map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-border p-8 md:p-10">
          <h2 className="text-xl font-bold text-text-primary text-center mb-8">
            {t("how.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {howSteps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-2xl mx-auto mb-3 relative">
                  {item.icon}
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">{t(item.titleKey)}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-10">
        <h2 className="text-lg font-bold text-text-primary mb-4">💬 {t("testimonials.title")}</h2>
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
            {t("bottom.cta.title")}
          </h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            {t("bottom.cta.desc")}
          </p>
          <Link
            href="/marketplace"
            className="inline-block px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-full text-base transition-all shadow-lg shadow-primary/30 hover:-translate-y-0.5"
          >
            {t("bottom.cta.button")} →
          </Link>
        </div>
      </section>
    </div>
  );
}
