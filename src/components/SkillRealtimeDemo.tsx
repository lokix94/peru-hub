"use client";

import { useState } from "react";
import { getRuntimeForSkill } from "@/lib/skill-runtime";

type Props = { skillId: string; skillName: string };

export default function SkillRealtimeDemo({ skillId, skillName }: Props) {
  const runtime = getRuntimeForSkill(skillId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Inputs
  const [query, setQuery] = useState("IA en Perú");
  const [ttsText, setTtsText] = useState("Hola, soy tu agente con voz real desde Langosta Hub.");
  const [voice, setVoice] = useState("camila");
  const [city, setCity] = useState("Lima");
  const [githubRepo, setGithubRepo] = useState("microsoft/SkillOpt");

  if (!runtime) return null;

  async function run() {
    setLoading(true);
    setError("");
    setResult(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      if (skillId === "smart-web-researcher") {
        const res = await fetch("/api/skills/run/web-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, maxResults: 5 }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Error en búsqueda");
        setResult(data);
      } else if (skillId === "voice-synthesis") {
        const res = await fetch("/api/skills/run/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: ttsText, voice }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Error TTS");
        }
        const blob = await res.blob();
        setAudioUrl(URL.createObjectURL(blob));
        setResult({ success: true, bytes: blob.size, voice });
      } else if (skillId === "weather-intelligence") {
        const res = await fetch("/api/skills/run/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Error clima");
        setResult(data);
      } else if (skillId === "github-skill-scout") {
        const res = await fetch("/api/skills/run/github-scout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            githubRepo.includes("/") || githubRepo.includes("github.com")
              ? { repo: githubRepo }
              : { q: githubRepo }
          ),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Error GitHub");
        setResult(data);
      } else if (skillId.startsWith("moltbook")) {
        const res = await fetch("/api/skills/run/moltbook");
        const data = await res.json();
        if (!data.success) throw new Error("No se pudo cargar Moltbook");
        setResult({
          success: true,
          install: data.install,
          files: Object.keys(data.files || {}).filter(
            (k) => data.files[k] !== null
          ),
        });
      } else {
        throw new Error("Skill sin demo interactiva");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al ejecutar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <h2 className="text-base font-bold text-text-primary">⚡ Probar ahora</h2>
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
          RUNTIME REAL
        </span>
      </div>
      <p className="text-xs text-text-muted mb-4">
        {skillName} · {runtime.provider} · No es una demo simulada
      </p>

      {/* Inputs by skill type */}
      {skillId === "smart-web-researcher" && (
        <div className="mb-3">
          <label className="block text-[11px] text-text-muted mb-1 font-medium">Consulta</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-primary/50"
            placeholder="Ej: IA en Perú"
          />
        </div>
      )}

      {skillId === "voice-synthesis" && (
        <div className="space-y-3 mb-3">
          <div>
            <label className="block text-[11px] text-text-muted mb-1 font-medium">Texto</label>
            <textarea
              value={ttsText}
              onChange={(e) => setTtsText(e.target.value)}
              rows={2}
              maxLength={500}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="block text-[11px] text-text-muted mb-1 font-medium">Voz</label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm"
            >
              <option value="camila">Camila (Perú)</option>
              <option value="alex">Alex (Perú)</option>
              <option value="es-mx-dalia">Dalia (México)</option>
              <option value="es-mx-jorge">Jorge (México)</option>
              <option value="jenny">Jenny (US)</option>
            </select>
          </div>
        </div>
      )}

      {skillId === "weather-intelligence" && (
        <div className="mb-3">
          <label className="block text-[11px] text-text-muted mb-1 font-medium">Ciudad</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-primary/50"
            placeholder="Lima"
          />
        </div>
      )}

      {skillId === "github-skill-scout" && (
        <div className="mb-3">
          <label className="block text-[11px] text-text-muted mb-1 font-medium">
            Repo (owner/name) o búsqueda
          </label>
          <input
            value={githubRepo}
            onChange={(e) => setGithubRepo(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-primary/50"
            placeholder="microsoft/SkillOpt o agent skills"
          />
        </div>
      )}

      {skillId.startsWith("moltbook") && (
        <p className="text-xs text-text-secondary mb-3">
          Carga el protocolo oficial de Moltbook (skill.md, heartbeat, messaging) desde la fuente
          pública.
        </p>
      )}

      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-sm font-bold transition-colors"
      >
        {loading ? "Ejecutando..." : "▶ Ejecutar skill real"}
      </button>

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      {audioUrl && (
        <div className="mt-4">
          <p className="text-xs font-medium text-text-primary mb-2">Audio generado</p>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}

      {result !== null && skillId === "smart-web-researcher" && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-text-primary">
            Resultados ({(result as { count?: number }).count ?? 0})
          </p>
          {((result as { results?: { title: string; url: string; snippet: string }[] }).results ||
            []).map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg border border-border hover:border-primary/40 transition-colors"
            >
              <p className="text-sm font-semibold text-primary line-clamp-1">{r.title}</p>
              <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{r.snippet}</p>
            </a>
          ))}
        </div>
      )}

      {result !== null && skillId === "weather-intelligence" && (
        <div className="mt-4 p-4 rounded-lg bg-sky-50 border border-sky-100 text-sm">
          <p className="font-semibold text-text-primary">
            {(result as { location?: { label: string } }).location?.label}
          </p>
          <p className="text-2xl font-bold text-sky-700 mt-1">
            {(result as { current?: { temperature: number } }).current?.temperature}°C
          </p>
          <p className="text-xs text-text-muted mt-1">
            Sensación{" "}
            {(result as { current?: { feelsLike: number } }).current?.feelsLike}° · Humedad{" "}
            {(result as { current?: { humidity: number } }).current?.humidity}%
          </p>
          <p className="text-[10px] text-text-muted mt-2">Fuente: Open-Meteo (tiempo real)</p>
        </div>
      )}

      {result !== null && skillId.startsWith("moltbook") && (
        <div className="mt-4 p-4 rounded-lg bg-orange-50 border border-orange-100 text-xs space-y-2">
          <p className="font-semibold text-text-primary">Protocolo oficial cargado</p>
          <p className="text-text-secondary">
            Archivos:{" "}
            {((result as { files?: string[] }).files || []).join(", ") || "—"}
          </p>
          <pre className="p-2 rounded bg-white border border-border overflow-x-auto text-[10px] font-mono">
            {((result as { install?: { commands?: string[] } }).install?.commands || []).join(
              "\n"
            )}
          </pre>
        </div>
      )}

      {runtime.sourceUrl && (
        <p className="mt-3 text-[10px] text-text-muted">
          Fuente:{" "}
          <a
            href={runtime.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            {runtime.sourceUrl.replace(/^https?:\/\//, "").slice(0, 48)}
          </a>
        </p>
      )}
    </div>
  );
}
