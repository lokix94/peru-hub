"use client";

import Link from "next/link";
import { useState } from "react";
import SkillCard from "@/components/SkillCard";
import { skills, getFeaturedSkills, getNewSkills, CATEGORIES } from "@/data/skills";
import { useLanguage } from "@/context/LanguageContext";

const banners = [
  {
    id: 1,
    headline: { es: "Conecta tu agente. Sin código. 🦞", en: "Connect your agent. No code. 🦞" },
    sub: {
      es: "La tienda donde tu agente de IA adquiere nuevas habilidades y tú ganas dinero creando skills.",
      en: "The store where your AI agent gets new skills and you earn money by creating them.",
    },
    cta: { es: "Empezar ahora", en: "Start now" },
    link: "/registro",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: 2,
    headline: { es: "Moltbook Tools — ¡Ya llegaron! 🦞", en: "Moltbook Tools — They're here! 🦞" },
    sub: {
      es: "Analytics, Auto-Poster, Community Manager y Trend Scanner. Todo para dominar Moltbook.",
      en: "Analytics, Auto-Poster, Community Manager & Trend Scanner. Everything to dominate Moltbook.",
    },
    cta: { es: "Ver Moltbook Tools", en: "See Moltbook Tools" },
    link: "/marketplace/moltbook-analytics",
    gradient: "from-rose-500 to-orange-600",
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
  const free = skills.filter((s) => s.price === 0);

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
    {
      nameKey: "cat.all",
      icon: "🛒",
      categoryKey: "all",
      color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
      iconBg: "bg-gray-100",
    },
  ];

  const howSteps = [
    {
      step: "1",
      icon: "📝",
      title: { es: "Regístrate", en: "Sign up" },
      desc: {
        es: "Crea tu cuenta gratis. Luego inicia sesión cuando quieras.",
        en: "Create a free account. Then log in anytime.",
      },
    },
    {
      step: "2",
      icon: "🔗",
      title: { es: "Conecta tu agente", en: "Connect your agent" },
      desc: {
        es: "OpenClaw, Moltbook u otro. Pega la API key y listo.",
        en: "OpenClaw, Moltbook or other. Paste the API key and done.",
      },
    },
    {
      step: "3",
      icon: "🛒",
      title: { es: "Elige habilidades", en: "Choose skills" },
      desc: {
        es: "Explora la tienda. Muchas son gratis. Premium desde $2.99.",
        en: "Browse the store. Many free. Premium from $2.99.",
      },
    },
    {
      step: "4",
      icon: "🚀",
      title: { es: "Tu agente mejora", en: "Your agent levels up" },
      desc: {
        es: "Instala en un clic. También puedes publicar skills y ganar.",
        en: "Install in one click. You can also publish skills and earn.",
      },
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ===== VISION BANNER ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="bg-gradient-to-r from-slate-900 via-orange-900 to-red-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="relative max-w-2xl">
            <p className="text-orange-300 text-xs font-semibold uppercase tracking-wider mb-2">
              {lang === "es"
                ? "La tienda de habilidades para agentes IA"
                : "The skill store for AI agents"}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight">
              {lang === "es"
                ? "Tu agente puede mejorar. Tú puedes ganar. Sin escribir una sola línea de código."
                : "Your agent can improve. You can earn. Without writing a single line of code."}
            </h1>
            <p className="text-white/75 text-sm md:text-base mb-5 max-w-xl">
              {lang === "es"
                ? "Conecta uno o varios agentes, cómprales skills y míralos subir de nivel. Si creas skills, también ganas dinero."
                : "Connect one or multiple agents, buy them skills and watch them level up. If you create skills, you also earn money."}
            </p>

            {/* Dos recuadros principales */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center min-w-[160px] px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-full text-sm hover:bg-gray-100 transition-colors shadow-lg"
              >
                {lang === "es" ? "Iniciar sesión" : "Log in"} →
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center min-w-[160px] px-5 py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-full text-sm hover:bg-white/20 transition-colors"
              >
                {lang === "es" ? "Explorar skills" : "Browse skills"}
              </Link>
            </div>

            {/* REGISTRO debajo de los dos recuadros */}
            <div className="mt-4">
              <Link
                href="/registro"
                className="inline-flex items-center justify-center w-full sm:w-auto min-w-[200px] px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-full text-sm shadow-lg shadow-primary/30 transition-all"
              >
                📝 {lang === "es" ? "REGISTRO — Crear cuenta gratis" : "SIGN UP — Create free account"}
              </Link>
              <p className="mt-2 text-[11px] text-white/50">
                {lang === "es"
                  ? "¿Primera vez? Regístrate. ¿Ya tienes cuenta? Usa Iniciar sesión."
                  : "First time? Sign up. Already have an account? Use Log in."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BANNER CAROUSEL ===== */}
      <section className="max-w-7xl mx-auto px-2 md:px-4 sm:px-6 lg:px-8 pt-2 md:pt-6 pb-2 md:pb-4">
        <div className="relative">
          <Link href={banners[activeBanner].link}>
            <div
              className={`banner-slide bg-gradient-to-r ${banners[activeBanner].gradient} min-h-[32vh] md:min-h-[auto] flex items-center p-5 md:p-12 text-white relative overflow-hidden cursor-pointer group rounded-xl md:rounded-2xl`}
            >
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
          <div className="flex items-center justify-center gap-2 mt-2 md:mt-4">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
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
        <div className="flex md:grid md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
          {storeCategories.map((cat) => (
            <Link
              key={cat.nameKey}
              href={
                cat.categoryKey === "all"
                  ? "/marketplace"
                  : `/marketplace?category=${encodeURIComponent(cat.categoryKey)}`
              }
              className={`flex flex-col items-center gap-1 md:gap-2 p-2 md:p-4 rounded-xl border transition-all shrink-0 w-[72px] md:w-auto ${cat.color}`}
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl ${cat.iconBg}`}
              >
                {cat.icon}
              </div>
              <span className="text-[10px] md:text-xs font-medium text-text-secondary text-center leading-tight">
                {t(cat.nameKey)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {newSkills.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-text-primary">
                🆕 {lang === "es" ? "Recién llegados" : "Just Arrived"}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-600 uppercase">
                New
              </span>
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">🔥 {t("most.popular")}</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 uppercase">
              Top
            </span>
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-1">🎉 {t("free.skills.title")}</h3>
            <p className="text-white/80 text-sm">{t("free.skills.desc")}</p>
          </div>
          <Link
            href="/marketplace?price=free"
            className="px-6 py-2.5 bg-white text-green-700 font-semibold rounded-full text-sm hover:bg-green-50 transition-colors shadow-lg whitespace-nowrap"
          >
            {t("free.skills.cta")} →
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">🆓 {t("free.for.agent")}</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
              FREE
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {free.slice(0, 8).map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">⭐ {t("recommended")}</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
              Staff Pick
            </span>
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-border p-8 md:p-10">
          <h2 className="text-xl font-bold text-text-primary text-center mb-2">
            {lang === "es" ? "¿Cómo funciona Langosta Hub?" : "How does Langosta Hub work?"}
          </h2>
          <p className="text-center text-sm text-text-muted mb-8 max-w-lg mx-auto">
            {lang === "es"
              ? "Diseñado para que cualquiera pueda usarlo. Cero código."
              : "Designed so anyone can use it. Zero code."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {howSteps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-2xl mx-auto mb-3 relative">
                  {item.icon}
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">{item.title[lang]}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{item.desc[lang]}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/registro"
              className="inline-block px-8 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg"
            >
              📝 REGISTRO
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-header-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {lang === "es"
              ? "Tu agente merece subir de nivel"
              : "Your agent deserves to level up"}
          </h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            {lang === "es"
              ? "Regístrate, inicia sesión y empieza. Sin código."
              : "Sign up, log in and start. No code."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="inline-block px-8 py-3.5 bg-white text-gray-900 font-semibold rounded-full text-base hover:bg-gray-100 transition-all"
            >
              {lang === "es" ? "Iniciar sesión" : "Log in"}
            </Link>
            <Link
              href="/registro"
              className="inline-block px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-full text-base transition-all shadow-lg shadow-primary/30"
            >
              📝 REGISTRO
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
