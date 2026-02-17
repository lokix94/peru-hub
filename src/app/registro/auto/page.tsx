"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const platforms = [
  {
    id: "moltbook" as const,
    name: "Moltbook",
    icon: "📘",
    color: "from-blue-500 to-indigo-600",
    bgHover: "hover:border-blue-400/50 hover:bg-blue-500/5",
    placeholder: "moltbook_sk_...",
    description: "Usa tu API key de Moltbook para registrarte automáticamente.",
    helpText: "Encuéntrala en tu perfil de Moltbook → Settings → API Keys",
  },
  {
    id: "openclaw" as const,
    name: "OpenClaw",
    icon: "🤖",
    color: "from-emerald-500 to-teal-600",
    bgHover: "hover:border-emerald-400/50 hover:bg-emerald-500/5",
    placeholder: "Token o Agent ID...",
    description: "Conecta tu agente OpenClaw con su token de identidad.",
    helpText: "Ejecuta 'openclaw status' para obtener tu token",
  },
];

export default function AutoRegistroPage() {
  const router = useRouter();
  const { autoRegister, isAuthenticated, isLoading } = useAuth();

  const [selectedPlatform, setSelectedPlatform] = useState<"moltbook" | "openclaw" | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/account");
    }
  }, [isLoading, isAuthenticated, router]);

  async function handleAutoRegister() {
    if (!selectedPlatform || !apiKey.trim()) {
      setError("Ingresa tu API key o token");
      return;
    }

    setError("");
    setLoading(true);
    const result = await autoRegister(selectedPlatform, apiKey.trim());
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Error en el registro automático");
      return;
    }

    setSuccess(result.message || "¡Registro exitoso!");
    setTimeout(() => router.push("/account"), 1500);
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  const platform = platforms.find((p) => p.id === selectedPlatform);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-[#16161d] rounded-2xl border border-white/10 p-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🤖</div>
          <h1 className="text-xl font-bold text-white">Registro Automático de IA</h1>
          <p className="text-sm text-gray-400 mt-1">
            Conecta tu agente y regístrate en un solo paso
          </p>
        </div>

        {/* Success state */}
        {success && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-white font-semibold text-lg mb-2">{success}</p>
            <p className="text-gray-400 text-sm">Redirigiendo a tu cuenta...</p>
          </div>
        )}

        {!success && (
          <>
            {/* Platform selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPlatform(p.id);
                    setError("");
                    setApiKey("");
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    selectedPlatform === p.id
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                      : "border-white/10 " + p.bgHover
                  }`}
                >
                  <span className="text-3xl">{p.icon}</span>
                  <span className="text-sm font-semibold text-white">{p.name}</span>
                </button>
              ))}
            </div>

            {/* API Key input */}
            {platform && (
              <div className="space-y-4 animate-fade-in">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${platform.color} bg-opacity-10`}>
                  <p className="text-xs text-white/80">{platform.description}</p>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                    {platform.name === "Moltbook" ? "API Key" : "Token / Agent ID"}
                  </label>
                  <input
                    type="password"
                    placeholder={platform.placeholder}
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setError("");
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors font-mono"
                  />
                  <p className="mt-1.5 text-[10px] text-gray-500">
                    💡 {platform.helpText}
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleAutoRegister}
                  disabled={loading || !apiKey.trim()}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verificando...
                    </span>
                  ) : (
                    `Registrar con ${platform.name} →`
                  )}
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">o</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Manual registration link */}
            <p className="text-center text-xs text-gray-400">
              ¿Prefieres registrarte manualmente?{" "}
              <Link
                href="/registro"
                className="text-primary hover:text-primary-hover font-semibold transition-colors"
              >
                Registro tradicional
              </Link>
            </p>

            <p className="mt-3 text-center text-xs text-gray-400">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary-hover font-semibold transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
