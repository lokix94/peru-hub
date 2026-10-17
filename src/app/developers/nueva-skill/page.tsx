"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LS_SKILLS_KEY = "langosta-dev-skills";
const LS_DEV_PROFILES_KEY = "langosta-dev-profiles";

const CATEGORIES = [
  "Investigación y Análisis",
  "Moltbook Tools",
  "Voz y Audio",
  "Código y Automatización",
  "Productividad",
  "Core del Agente",
];

const SKILL_TEMPLATES: Record<
  string,
  {
    skillName: string;
    description: string;
    category: string;
    price: string;
    emoji: string;
    tags: string;
    repoUrl: string;
    documentation: string;
  }
> = {
  "smart-web-researcher": {
    skillName: "Smart Web Researcher",
    description:
      "Convierte a tu agente en un investigador multi-fuente. Busca en la web, cruza datos, puntúa la credibilidad de las fuentes y entrega reportes estructurados con citas. Ideal para evitar alucinaciones y obtener información verificable. Runtime real en Langosta Hub vía DuckDuckGo.",
    category: "Investigación y Análisis",
    price: "0.99",
    emoji: "🔍",
    tags: "research, web, wikipedia, analysis",
    repoUrl: "https://github.com/lokix94/peru-hub",
    documentation:
      "POST /api/skills/run/web-search con body { query, maxResults }. Ver skill-runtime.ts.",
  },
  "weather-intelligence": {
    skillName: "Weather Intelligence",
    description:
      "Clima en tiempo real y pronósticos para cualquier ciudad del mundo en lenguaje natural. Incluye alertas y condiciones actuales. Runtime real con Open-Meteo, sin API key del usuario.",
    category: "Productividad",
    price: "0.99",
    emoji: "🌤️",
    tags: "weather, forecast, climate, alerts",
    repoUrl: "https://github.com/lokix94/peru-hub",
    documentation:
      "POST /api/skills/run/weather con body { city }. Proveedor Open-Meteo.",
  },
  "voice-synthesis": {
    skillName: "Voice Synthesis",
    description:
      "Síntesis de voz neural con Edge TTS. Voces en español peruano (Camila) y otras variantes. Ajusta velocidad y genera audio para accesibilidad o contenido. Runtime real en el hub.",
    category: "Voz y Audio",
    price: "2.99",
    emoji: "🎤",
    tags: "tts, voice, audio, speech",
    repoUrl: "https://github.com/lokix94/peru-hub",
    documentation:
      "POST /api/skills/run/tts con body { text, voice }. Salida MP3.",
  },
  "moltbook-analytics": {
    skillName: "Moltbook Analytics",
    description:
      "Analítica y protocolo oficial Moltbook: engagement, mejores horarios y métricas de submolts. Basado en skill.md y heartbeat del protocolo público Moltbook Official.",
    category: "Moltbook Tools",
    price: "0.99",
    emoji: "📊",
    tags: "moltbook, analytics, social",
    repoUrl: "https://github.com/Moltbook-Official/moltbook",
    documentation:
      "GET /api/skills/run/moltbook — entrega skill.md, heartbeat.md y messaging.md.",
  },
};

interface SkillSubmission {
  id: string;
  developerId: string;
  developerName: string;
  developerEmail: string;
  skillName: string;
  description: string;
  category: string;
  price: number;
  repoUrl: string;
  sourceCode: string;
  documentation: string;
  tags: string;
  emoji: string;
  declaracionNombre: string;
  declaracionFecha: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  submittedAt: string;
}

function getSkills(): SkillSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_SKILLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSkills(skills: SkillSubmission[]) {
  try {
    localStorage.setItem(LS_SKILLS_KEY, JSON.stringify(skills));
  } catch {
    /* ignore */
  }
}

async function submitSkillToApi(payload: Record<string, unknown>) {
  try {
    const res = await fetch("/api/developers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "skill", ...payload }),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Error de conexión con la API" };
  }
}

function NuevaSkillForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [skillName, setSkillName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [tags, setTags] = useState("");
  const [emoji, setEmoji] = useState("🔧");
  const [acceptDeclaracion, setAcceptDeclaracion] = useState(false);
  const [declaracionNombre, setDeclaracionNombre] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/registro?next=/developers/nueva-skill");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const tid = searchParams.get("template");
    if (tid && SKILL_TEMPLATES[tid]) {
      applyTemplate(tid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function applyTemplate(tid: string) {
    const t = SKILL_TEMPLATES[tid];
    if (!t) return;
    setActiveTemplate(tid);
    setSkillName(t.skillName);
    setDescription(t.description);
    setCategory(t.category);
    setPrice(t.price);
    setEmoji(t.emoji);
    setTags(t.tags);
    setRepoUrl(t.repoUrl);
    setDocumentation(t.documentation);
    setFieldErrors({});
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!skillName.trim()) {
      errors.skillName = "El nombre del skill es obligatorio";
    }

    if (!description.trim()) {
      errors.description = "La descripción es obligatoria";
    } else if (description.trim().length < 100) {
      errors.description = `Mínimo 100 caracteres (tienes ${description.trim().length})`;
    }

    if (price === "" || price == null) {
      errors.price = "El precio es obligatorio";
    } else if (parseFloat(price) < 0) {
      errors.price = "El precio no puede ser negativo";
    } else if (parseFloat(price) > 0 && parseFloat(price) < 0.99) {
      errors.price = "Si no es gratis, el mínimo es $0.99";
    }

    if (!repoUrl.trim()) {
      errors.repoUrl = "El enlace al repositorio es obligatorio";
    } else if (!/^https?:\/\/(github\.com|gitlab\.com)\//.test(repoUrl.trim())) {
      errors.repoUrl = "Debe ser una URL de GitHub o GitLab";
    }

    if (!acceptDeclaracion) {
      errors.acceptDeclaracion = "Debes aceptar la declaración jurada";
    }

    if (!declaracionNombre.trim()) {
      errors.declaracionNombre = "Debes escribir tu nombre completo como firma";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);

    let devName = user?.username || "Desarrollador";
    let devEmail = user?.email || "";
    try {
      const profilesRaw = localStorage.getItem(LS_DEV_PROFILES_KEY);
      const profiles = profilesRaw ? JSON.parse(profilesRaw) : [];
      const myProfile = profiles.find(
        (p: { userId: string }) => p.userId === user?.id
      );
      if (myProfile) {
        devName = myProfile.fullName;
        devEmail = myProfile.email;
      }
    } catch {
      /* ignore */
    }

    const skillPayload = {
      skill_name: skillName.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price),
      repo_url: repoUrl.trim(),
      source_code: sourceCode.trim() || undefined,
      documentation: documentation.trim() || undefined,
      tags: tags
        .trim()
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      emoji: emoji.trim() || "🔧",
    };

    const apiResult = await submitSkillToApi(skillPayload);
    if (!apiResult.success) {
      console.warn("[NuevaSkill] API warning:", apiResult.error);
    }

    const skill: SkillSubmission = {
      id: crypto.randomUUID(),
      developerId: user?.id || "",
      developerName: devName,
      developerEmail: devEmail,
      skillName: skillName.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price),
      repoUrl: repoUrl.trim(),
      sourceCode: sourceCode.trim(),
      documentation: documentation.trim(),
      tags: tags.trim(),
      emoji: emoji.trim() || "🔧",
      declaracionNombre: declaracionNombre.trim(),
      declaracionFecha: new Date().toISOString().split("T")[0],
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    const skills = getSkills();
    skills.push(skill);
    saveSkills(skills);

    setLoading(false);
    setSubmitted(true);
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#16161d] rounded-2xl border border-green-500/20 p-8 text-center animate-fade-in">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-white mb-2">
            ¡Skill enviado para revisión!
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Te notificaremos cuando sea aprobado. El proceso tarda entre 24-48 horas.
          </p>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 text-left">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500">Skill:</span>
              <span className="text-white font-semibold">
                {emoji} {skillName}
              </span>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500">Categoría:</span>
              <span className="text-white">{category}</span>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500">Precio:</span>
              <span className="text-white">${price} USD</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Estado:</span>
              <span className="text-yellow-400 font-semibold">
                🟡 Pendiente de revisión
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/developers/dashboard"
              className="flex-1 inline-block px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold text-center"
            >
              Ir al Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setActiveTemplate(null);
                setSkillName("");
                setDescription("");
                setPrice("");
                setRepoUrl("");
                setSourceCode("");
                setDocumentation("");
                setTags("");
                setEmoji("🔧");
                setAcceptDeclaracion(false);
                setDeclaracionNombre("");
              }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold border border-white/10"
            >
              Enviar otro skill
            </button>
          </div>
        </div>
      </div>
    );
  }

  const devEarnings = price ? (parseFloat(price) * 0.97).toFixed(2) : "0.00";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Inicio
        </Link>
        <span className="mx-1.5">›</span>
        <Link href="/developers" className="hover:text-primary">
          Desarrolladores
        </Link>
        <span className="mx-1.5">›</span>
        <span className="text-text-primary font-medium">Nueva Skill</span>
      </nav>

      <div className="bg-[#16161d] rounded-2xl border border-white/10 p-6 sm:p-8 animate-fade-in">
        <header className="text-center mb-8">
          <div className="text-4xl mb-2">📦</div>
          <h1 className="text-xl font-bold text-white">Publicar nueva skill</h1>
          <p className="text-xs text-gray-400 mt-1">
            Usa una plantilla real del hub o completa el formulario. Revisión 24-48h.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center"
          >
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-[10px] text-gray-500 font-semibold uppercase mb-2">
            Plantillas (skills reales del hub)
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SKILL_TEMPLATES).map(([id, t]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyTemplate(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  activeTemplate === id
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-white/5 border-white/10 text-gray-300 hover:border-primary/40"
                }`}
              >
                {t.emoji} {t.skillName}
              </button>
            ))}
          </div>
          {activeTemplate && (
            <p className="mt-2 text-[11px] text-green-400">
              Plantilla aplicada. Puedes editar todos los campos antes de enviar.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <section className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
            <h2 className="text-sm font-bold text-white">🔧 Información del skill</h2>

            <div className="flex gap-3">
              <div className="w-20">
                <label htmlFor="emoji" className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                  Ícono
                </label>
                <input
                  id="emoji"
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  maxLength={4}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xl text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="skillName" className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                  Nombre del skill
                </label>
                <input
                  id="skillName"
                  type="text"
                  placeholder="Ej: Web Scraper Pro"
                  value={skillName}
                  onChange={(e) => {
                    setSkillName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, skillName: "" }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    fieldErrors.skillName ? "border-red-500/50" : "border-white/10"
                  }`}
                />
                {fieldErrors.skillName && (
                  <p className="mt-1 text-[11px] text-red-400">{fieldErrors.skillName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                Descripción (mín. 100 caracteres)
              </label>
              <textarea
                id="description"
                placeholder="Describe qué hace tu skill..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, description: "" }));
                }}
                rows={5}
                className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  fieldErrors.description ? "border-red-500/50" : "border-white/10"
                }`}
              />
              <div className="flex justify-between mt-1">
                {fieldErrors.description ? (
                  <p className="text-[11px] text-red-400">{fieldErrors.description}</p>
                ) : (
                  <span />
                )}
                <span className={`text-[10px] ${description.length >= 100 ? "text-green-400" : "text-gray-500"}`}>
                  {description.length}/100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                  Categoría
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#16161d]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="price" className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                  Precio (USD)
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0 = gratis, o mín. 0.99"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, price: "" }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    fieldErrors.price ? "border-red-500/50" : "border-white/10"
                  }`}
                />
                {fieldErrors.price && (
                  <p className="mt-1 text-[11px] text-red-400">{fieldErrors.price}</p>
                )}
              </div>
            </div>

            {price && parseFloat(price) >= 0.99 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <span className="text-xs text-gray-400">Por cada venta recibirás:</span>
                <span className="text-sm font-bold text-green-500">
                  ${devEarnings} USDT (97%)
                </span>
              </div>
            )}

            <div>
              <label htmlFor="tags" className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                Tags (separados por coma)
              </label>
              <input
                id="tags"
                type="text"
                placeholder="scraping, web, automation"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </section>

          <section className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
            <h2 className="text-sm font-bold text-white">💻 Código y repositorio</h2>
            <div>
              <label htmlFor="repoUrl" className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                Enlace al repositorio *
              </label>
              <input
                id="repoUrl"
                type="url"
                placeholder="https://github.com/tu-usuario/tu-skill"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, repoUrl: "" }));
                }}
                className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  fieldErrors.repoUrl ? "border-red-500/50" : "border-white/10"
                }`}
              />
              {fieldErrors.repoUrl && (
                <p className="mt-1 text-[11px] text-red-400">{fieldErrors.repoUrl}</p>
              )}
            </div>
            <div>
              <label htmlFor="documentation" className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                Documentación / cómo usar
              </label>
              <textarea
                id="documentation"
                rows={3}
                value={documentation}
                onChange={(e) => setDocumentation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label htmlFor="sourceCode" className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                Código fuente (opcional)
              </label>
              <textarea
                id="sourceCode"
                rows={4}
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </section>

          <section className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
            <h2 className="text-sm font-bold text-white">📜 Declaración</h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptDeclaracion}
                onChange={(e) => {
                  setAcceptDeclaracion(e.target.checked);
                  setFieldErrors((prev) => ({ ...prev, acceptDeclaracion: "" }));
                }}
                className="mt-0.5 w-4 h-4 rounded"
              />
              <span className="text-xs text-gray-400">
                Declaro que soy autor o tengo derechos sobre este skill y acepto la
                comisión 3% plataforma / 97% desarrollador.
              </span>
            </label>
            {fieldErrors.acceptDeclaracion && (
              <p className="text-[11px] text-red-400">{fieldErrors.acceptDeclaracion}</p>
            )}
            <div>
              <label htmlFor="firma" className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                Firma (nombre completo)
              </label>
              <input
                id="firma"
                type="text"
                value={declaracionNombre}
                onChange={(e) => {
                  setDeclaracionNombre(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, declaracionNombre: "" }));
                }}
                className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  fieldErrors.declaracionNombre ? "border-red-500/50" : "border-white/10"
                }`}
              />
              {fieldErrors.declaracionNombre && (
                <p className="mt-1 text-[11px] text-red-400">{fieldErrors.declaracionNombre}</p>
              )}
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold disabled:opacity-50"
          >
            {loading ? "Enviando..." : "📦 Enviar skill para revisión"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NuevaSkillPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-gray-400 text-sm">Cargando...</div>
        </div>
      }
    >
      <NuevaSkillForm />
    </Suspense>
  );
}
