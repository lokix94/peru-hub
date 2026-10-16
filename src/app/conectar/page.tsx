"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Flujo simple: el agente entra con su API key.
 * No hace falta registro de humano.
 * El humano solo aparece al pagar skills en USDT.
 */
export default function ConectarPage() {
  const router = useRouter();
  const { autoRegister, addAgent, isAuthenticated, user } = useAuth();

  const [platform, setPlatform] = useState<"moltbook" | "openclaw">("moltbook");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOk("");

    if (!apiKey.trim()) {
      setError("Pega la API key del agente");
      return;
    }

    setLoading(true);

    try {
      // 1) Detectar identidad del agente
      const detectRes = await fetch("/api/agents/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: platform === "moltbook" ? "Moltbook" : "OpenClaw", apiKey: apiKey.trim() }),
      });
      const detect = await detectRes.json();

      if (!detectRes.ok || !detect.success) {
        setError(detect.error || "No se pudo validar la API key");
        setLoading(false);
        return;
      }

      const agentName = detect.agent?.displayName || detect.agent?.name || "Agente";

      // 2) Si no hay sesión humana: auto-registro ligero desde el agente
      if (!isAuthenticated) {
        const reg = await autoRegister(platform, apiKey.trim());
        if (!reg.success) {
          // Fallback: sesión local mínima solo con el agente
          const add = await addAgent(
            agentName,
            platform === "moltbook" ? "Moltbook" : "OpenClaw",
            apiKey.trim(),
            detect.agent?.metadata,
            true
          );
          if (!add.success) {
            setError(reg.error || add.error || "No se pudo conectar");
            setLoading(false);
            return;
          }
        }
        setOk(reg.message || `Agente ${agentName} conectado. Ya puede usar la tienda.`);
      } else {
        // Ya hay sesión: solo añadir el agente
        const add = await addAgent(
          agentName,
          platform === "moltbook" ? "Moltbook" : "OpenClaw",
          apiKey.trim(),
          detect.agent?.metadata,
          true
        );
        if (!add.success) {
          setError(add.error || "No se pudo añadir el agente");
          setLoading(false);
          return;
        }
        setOk(`Agente ${agentName} conectado a la cuenta${user?.username ? ` de ${user.username}` : ""}.`);
      }

      setTimeout(() => router.push("/marketplace"), 1200);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#16161d] rounded-2xl border border-white/10 p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🦞</div>
          <h1 className="text-xl font-bold text-white">Conectar agente</h1>
          <p className="text-sm text-gray-400 mt-2">
            Sin registro de email. El agente entra con su <strong className="text-white">API key</strong>.
            <br />
            El humano solo paga en <strong className="text-green-400">USDT</strong> si compra skills.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {error}
          </div>
        )}
        {ok && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs text-center">
            {ok}
          </div>
        )}

        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Plataforma</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPlatform("moltbook")}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  platform === "moltbook"
                    ? "bg-primary/20 border-primary text-white"
                    : "bg-white/5 border-white/10 text-gray-400"
                }`}
              >
                🦞 Moltbook
              </button>
              <button
                type="button"
                onClick={() => setPlatform("openclaw")}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  platform === "openclaw"
                    ? "bg-primary/20 border-primary text-white"
                    : "bg-white/5 border-white/10 text-gray-400"
                }`}
              >
                ⚙️ OpenClaw
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">API key del agente</label>
            <input
              type="password"
              autoComplete="off"
              placeholder={platform === "moltbook" ? "API key de Moltbook" : "API key / token OpenClaw"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
            />
            <p className="mt-1.5 text-[10px] text-gray-500">
              No guardamos la key en texto plano en pantalla. Solo se usa para validar y conectar.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors disabled:opacity-50"
          >
            {loading ? "Conectando..." : "Conectar y entrar a la tienda"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-2">
          <p className="text-[11px] text-gray-500">
            Skills de pago → el <span className="text-gray-300">humano</span> envía USDT (BEP20) en el carrito.
          </p>
          <Link href="/marketplace" className="block text-sm text-primary hover:underline">
            Ver tienda sin conectar →
          </Link>
        </div>
      </div>
    </div>
  );
}
