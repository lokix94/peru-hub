"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  "Legal y Compliance",
];

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
  } catch { /* ignore */ }
}

export default function NuevaSkillPage() {
  const router = useRouter();
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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/developers/registro");
    }
  }, [isLoading, isAuthenticated, router]);

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

    if (!price) {
      errors.price = "El precio es obligatorio";
    } else if (parseFloat(price) < 0.99) {
      errors.price = "El precio mínimo es $0.99";
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);

    // Get dev profile info
    let devName = user?.username || "Desarrollador";
    let devEmail = user?.email || "";
    try {
      const profilesRaw = localStorage.getItem(LS_DEV_PROFILES_KEY);
      const profiles = profilesRaw ? JSON.parse(profilesRaw) : [];
      const myProfile = profiles.find((p: { userId: string }) => p.userId === user?.id);
      if (myProfile) {
        devName = myProfile.fullName;
        devEmail = myProfile.email;
      }
    } catch { /* ignore */ }

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
          <h1 className="text-xl font-bold text-white mb-2">¡Skill enviado para revisión!</h1>
          <p className="text-sm text-gray-400 mb-6">
            Te notificaremos cuando sea aprobado. El proceso tarda entre 24-48 horas.
          </p>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 text-left">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500">Skill:</span>
              <span className="text-white font-semibold">{emoji} {skillName}</span>
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
              <span className="text-yellow-400 font-semibold">🟡 Pendiente de revisión</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/developers/dashboard"
              className="flex-1 inline-block px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors text-center"
            >
              Ir al Dashboard
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
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
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-colors border border-white/10"
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
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Inicio</Link>
        <span className="mx-1.5">›</span>
        <Link href="/developers" className="hover:text-primary">Desarrolladores</Link>
        <span className="mx-1.5">›</span>
        <span className="text-text-primary font-medium">Nueva Skill</span>
      </nav>

      <div className="bg-[#16161d] rounded-2xl border border-white/10 p-6 sm:p-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">📦</div>
          <h1 className="text-xl font-bold text-white">Publicar nueva skill</h1>
          <p className="text-xs text-gray-400 mt-1">Completa todos los campos y tu skill será revisado en 24-48h</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🔧</span> Información del skill
            </h3>

            <div className="flex gap-3">
              <div className="w-20">
                <label className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">Ícono</label>
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  maxLength={4}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xl text-center focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">Nombre del skill</label>
                <input
                  type="text"
                  placeholder="Ej: Web Scraper Pro"
                  value={skillName}
                  onChange={(e) => {
                    setSkillName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, skillName: "" }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                    fieldErrors.skillName ? "border-red-500/50" : "border-white/10"
                  }`}
                />
                {fieldErrors.skillName && (
                  <p className="mt-1 text-[11px] text-red-400">{fieldErrors.skillName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                Descripción <span className="text-gray-600">(mín. 100 caracteres)</span>
              </label>
              <textarea
                placeholder="Describe qué hace tu skill, qué problema resuelve y cómo se usa..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, description: "" }));
                }}
                rows={5}
                className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none ${
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
                <label className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#16161d]">{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">Precio (USD)</label>
                <input
                  type="number"
                  min="0.99"
                  step="0.01"
                  placeholder="Mín. $0.99"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, price: "" }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
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
                <span className="text-sm font-bold text-green-500">${devEarnings} USDT (97%)</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">Tags <span className="text-gray-600">(separados por coma)</span></label>
              <input
                type="text"
                placeholder="scraping, web, automation, data"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Code Section */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>💻</span> Código y repositorio
            </h3>

            <div>
              <label className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                Enlace al repositorio <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                placeholder="https://github.com/tu-usuario/tu-skill"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, repoUrl: "" }));
                }}
                className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                  fieldErrors.repoUrl ? "border-red-500/50" : "border-white/10"
                }`}
              />
              {fieldErrors.repoUrl && (
                <p className="mt-1 text-[11px] text-red-400">{fieldErrors.repoUrl}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                Código fuente <span className="text-gray-600">(opcional si proporcionaste repo)</span>
              </label>
              <textarea
                placeholder="Pega aquí el código fuente principal de tu skill..."
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                rows={6}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">Documentación / README</label>
              <textarea
                placeholder="Instrucciones de instalación, uso, ejemplos, requisitos..."
                value={documentation}
                onChange={(e) => setDocumentation(e.target.value)}
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Declaración Jurada Section */}
          <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              ⚖️ Declaración Jurada del Desarrollador
            </h3>

            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-gray-300 leading-relaxed">
              <p className="mb-2">Declaro bajo juramento que:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-gray-400">
                <li>Soy el autor o tengo derechos legítimos sobre este código.</li>
                <li>El código no contiene malware, backdoors ni funciones ocultas.</li>
                <li>No infringe propiedad intelectual de terceros.</li>
                <li>No recopila ni exfiltra datos sin consentimiento.</li>
                <li>Asumo responsabilidad por los daños que cause mi herramienta.</li>
              </ol>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptDeclaracion}
                onChange={(e) => {
                  setAcceptDeclaracion(e.target.checked);
                  setFieldErrors((prev) => ({ ...prev, acceptDeclaracion: "" }));
                }}
                className="mt-0.5 w-4 h-4 rounded bg-white/5 border-white/20 text-amber-500 focus:ring-amber-500/50"
              />
              <span className="text-xs text-gray-400">
                Acepto la declaración jurada y entiendo las consecuencias legales de falsear esta información.
              </span>
            </label>
            {fieldErrors.acceptDeclaracion && (
              <p className="text-[11px] text-red-400 ml-7">{fieldErrors.acceptDeclaracion}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">
                  Nombre completo (firma) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={declaracionNombre}
                  onChange={(e) => {
                    setDeclaracionNombre(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, declaracionNombre: "" }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors ${
                    fieldErrors.declaracionNombre ? "border-red-500/50" : "border-white/10"
                  }`}
                />
                {fieldErrors.declaracionNombre && (
                  <p className="mt-1 text-[11px] text-red-400">{fieldErrors.declaracionNombre}</p>
                )}
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1 font-semibold uppercase">Fecha</label>
                <input
                  type="text"
                  value={new Date().toISOString().split("T")[0]}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "📤 Enviar para revisión"}
          </button>

          <p className="text-[10px] text-gray-500 text-center">
            Revisamos cada skill en 24-48h para calidad y seguridad. Te notificaremos por email.
          </p>
        </form>
      </div>
    </div>
  );
}
