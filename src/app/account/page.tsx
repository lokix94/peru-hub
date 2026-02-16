"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RechargeModal from "@/components/RechargeModal";
import AdBanner from "@/components/AdBanner";
import { useAuth, type MoltbookData } from "@/context/AuthContext";

const transactions = [
  { id: "tx-1", type: "deposit", description: "Recarga de saldo", amount: 20.00, date: "2026-02-12", status: "completed" },
  { id: "tx-2", type: "purchase", description: "Code Review Assistant", amount: -9.99, date: "2026-02-11", status: "completed" },
  { id: "tx-3", type: "purchase", description: "Web Research Pro", amount: -4.99, date: "2026-02-10", status: "completed" },
  { id: "tx-4", type: "earning", description: "Venta: Peruvian Legal Research", amount: 0.00, date: "2026-02-09", status: "completed" },
  { id: "tx-5", type: "purchase", description: "Email Composer Pro", amount: -3.99, date: "2026-02-08", status: "completed" },
  { id: "tx-6", type: "deposit", description: "Depósito inicial", amount: 10.00, date: "2026-02-01", status: "completed" },
];

const installedSkills = [
  { name: "Peruvian Legal Research", icon: "⚖️", version: "1.0.0", status: "active" },
  { name: "Voice: Camila Neural", icon: "🎙️", version: "2.1.0", status: "active" },
  { name: "Web Research Pro", icon: "🌐", version: "3.2.1", status: "active" },
  { name: "Code Review Assistant", icon: "💻", version: "1.5.0", status: "active" },
  { name: "Memory Curator", icon: "🧠", version: "1.1.1", status: "active" },
  { name: "Self Reflection", icon: "🪞", version: "1.1.1", status: "paused" },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, agents, addAgent, removeAgent, updateAgent, signOut } = useAuth();

  const balance = 9.46;
  const totalSpent = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const [rechargeOpen, setRechargeOpen] = useState(false);

  // Agent form state
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentPlatform, setAgentPlatform] = useState("");
  const [agentApiKey, setAgentApiKey] = useState("");
  const [agentError, setAgentError] = useState("");

  // Moltbook verification state
  const [moltbookVerifying, setMoltbookVerifying] = useState(false);
  const [moltbookVerified, setMoltbookVerified] = useState(false);
  const [moltbookData, setMoltbookData] = useState<MoltbookData | null>(null);
  const [moltbookError, setMoltbookError] = useState("");
  const [refreshingAgentId, setRefreshingAgentId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-3 animate-float">🦞</div>
          <p className="text-sm text-text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect
  }

  const memberSince = new Date(user.created_at).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function verifyMoltbook() {
    if (!agentName.trim()) {
      setMoltbookError("Ingresa un nombre de usuario");
      return;
    }
    setMoltbookVerifying(true);
    setMoltbookError("");
    setMoltbookVerified(false);
    setMoltbookData(null);

    try {
      const res = await fetch("/api/verify-moltbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: agentName.trim(), apiKey: agentApiKey || undefined }),
      });
      const data = await res.json();

      if (data.verified && data.agent) {
        const md: MoltbookData = {
          moltbook_id: data.agent.id,
          moltbook_name: data.agent.name,
          post_count: data.agent.postCount,
          karma: data.agent.karma,
          last_active: data.agent.lastActive,
          profile_url: `https://moltbook.com/u/${data.agent.name}`,
        };
        setMoltbookData(md);
        setMoltbookVerified(true);
      } else {
        setMoltbookError(data.error || "Agente no encontrado en Moltbook");
      }
    } catch {
      setMoltbookError("Error de conexión al verificar");
    } finally {
      setMoltbookVerifying(false);
    }
  }

  async function refreshMoltbookAgent(agentId: string, agentNameToVerify: string) {
    setRefreshingAgentId(agentId);
    try {
      const res = await fetch("/api/verify-moltbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: agentNameToVerify }),
      });
      const data = await res.json();
      if (data.verified && data.agent) {
        updateAgent(agentId, {
          verified: true,
          moltbook_data: {
            moltbook_id: data.agent.id,
            moltbook_name: data.agent.name,
            post_count: data.agent.postCount,
            karma: data.agent.karma,
            last_active: data.agent.lastActive,
            profile_url: `https://moltbook.com/u/${data.agent.name}`,
          },
        });
      }
    } catch {
      // silently fail refresh
    } finally {
      setRefreshingAgentId(null);
    }
  }

  async function handleAddAgent(e: React.FormEvent) {
    e.preventDefault();
    setAgentError("");

    // For Moltbook platform, require verification first
    if (agentPlatform === "Moltbook" && !moltbookVerified) {
      setAgentError("Primero verifica tu agente en Moltbook");
      return;
    }

    const result = await addAgent(
      agentName,
      agentPlatform,
      agentApiKey || undefined,
      agentPlatform === "Moltbook" && moltbookData ? moltbookData : undefined
    );
    if (!result.success) {
      setAgentError(result.error ?? "Error al agregar agente");
      return;
    }
    setAgentName("");
    setAgentPlatform("");
    setAgentApiKey("");
    setMoltbookVerified(false);
    setMoltbookData(null);
    setMoltbookError("");
    setShowAgentForm(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-text-muted mb-5">
        <span className="hover:text-primary cursor-pointer">Inicio</span>
        <span className="mx-1.5">›</span>
        <span className="text-text-primary font-medium">Mi cuenta</span>
      </nav>

      <h1 className="text-xl font-bold text-text-primary mb-6">Mi cuenta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-border p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-full -translate-y-1/2 translate-x-1/2" />
              <p className="text-[11px] text-text-muted mb-1 uppercase tracking-wider font-medium relative">Saldo disponible</p>
              <p className="text-3xl font-bold text-amber-600 relative">${balance.toFixed(2)}</p>
              <button
                onClick={() => setRechargeOpen(true)}
                className="mt-3 px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors relative"
              >
                + Recargar
              </button>
            </div>
            <div className="bg-white rounded-xl border border-border p-5">
              <p className="text-[11px] text-text-muted mb-1 uppercase tracking-wider font-medium">Total gastado</p>
              <p className="text-3xl font-bold text-text-primary">${totalSpent.toFixed(2)}</p>
              <p className="text-[11px] text-text-muted mt-3">
                {transactions.filter(t => t.type === "purchase").length} compras
              </p>
            </div>
            <div className="bg-white rounded-xl border border-border p-5">
              <p className="text-[11px] text-text-muted mb-1 uppercase tracking-wider font-medium">Ganancias</p>
              <p className="text-3xl font-bold text-green-600">$0.00</p>
              <p className="text-[11px] text-text-muted mt-3">Por venta de skills</p>
            </div>
          </div>

          {/* Mis Agentes IA */}
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-text-primary">🤖 Mis Agentes IA</h2>
              <button
                onClick={() => setShowAgentForm(!showAgentForm)}
                className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors"
              >
                {showAgentForm ? "Cancelar" : "+ Agregar Agente"}
              </button>
            </div>

            {/* Agent form */}
            {showAgentForm && (
              <form onSubmit={handleAddAgent} className="mb-4 p-4 rounded-xl bg-gray-50 border border-border space-y-3">
                <div>
                  <label className="block text-[11px] text-text-muted mb-1 font-medium">Plataforma</label>
                  <select
                    value={agentPlatform}
                    onChange={(e) => {
                      setAgentPlatform(e.target.value);
                      setMoltbookVerified(false);
                      setMoltbookData(null);
                      setMoltbookError("");
                      setAgentError("");
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-border text-text-primary text-xs focus:outline-none focus:border-primary/50"
                  >
                    <option value="">Seleccionar plataforma...</option>
                    <option value="OpenClaw">OpenClaw</option>
                    <option value="Moltbook">Moltbook</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-text-muted mb-1 font-medium">
                    {agentPlatform === "Moltbook" ? "Nombre de usuario en Moltbook" : "Nombre del agente"}
                  </label>
                  <input
                    type="text"
                    placeholder={agentPlatform === "Moltbook" ? "ej: Peru, eudaemon_0..." : "Mi Agente IA"}
                    value={agentName}
                    onChange={(e) => {
                      setAgentName(e.target.value);
                      if (agentPlatform === "Moltbook") {
                        setMoltbookVerified(false);
                        setMoltbookData(null);
                        setMoltbookError("");
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-border text-text-primary text-xs placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-muted mb-1 font-medium">
                    API Key (opcional)
                  </label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={agentApiKey}
                    onChange={(e) => setAgentApiKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-border text-text-primary text-xs font-mono placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                  />
                </div>

                {/* Moltbook verify button */}
                {agentPlatform === "Moltbook" && !moltbookVerified && (
                  <button
                    type="button"
                    onClick={verifyMoltbook}
                    disabled={moltbookVerifying || !agentName.trim()}
                    className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    {moltbookVerifying ? (
                      <>
                        <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verificando en Moltbook...
                      </>
                    ) : (
                      "Verificar en Moltbook 🦞"
                    )}
                  </button>
                )}

                {/* Moltbook verification error */}
                {moltbookError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-[11px] text-red-600 font-medium">❌ {moltbookError}</p>
                  </div>
                )}

                {/* Moltbook verification success */}
                {moltbookVerified && moltbookData && (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 space-y-1.5">
                    <p className="text-[11px] text-green-700 font-bold flex items-center gap-1">
                      ✅ Agente verificado en Moltbook
                    </p>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-green-800">
                      <span>🦞 Nombre: <strong>{moltbookData.moltbook_name}</strong></span>
                      <span>📝 Posts: <strong>{moltbookData.post_count}</strong></span>
                      <span>⬆️ Karma: <strong>{moltbookData.karma}</strong></span>
                      <span>🕐 Último: <strong>{new Date(moltbookData.last_active).toLocaleDateString("es-PE")}</strong></span>
                    </div>
                    <a
                      href={moltbookData.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[10px] text-green-600 hover:text-green-800 underline"
                    >
                      Ver perfil en Moltbook →
                    </a>
                  </div>
                )}

                {agentError && (
                  <p className="text-[11px] text-red-500">{agentError}</p>
                )}
                <button
                  type="submit"
                  disabled={agentPlatform === "Moltbook" && !moltbookVerified}
                  className="w-full py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
                >
                  {agentPlatform === "Moltbook" ? "Registrar Agente Moltbook 🦞" : "Registrar Agente"}
                </button>
              </form>
            )}

            {/* Agent list */}
            {agents.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                <div className="text-3xl mb-2">🤖</div>
                <p className="text-xs">Aún no has registrado ningún agente IA</p>
                <p className="text-[10px] mt-1">Haz clic en &ldquo;Agregar Agente&rdquo; para comenzar</p>
              </div>
            ) : (
              <div className="space-y-2">
                {agents.map((agent) => {
                  const isMoltbook = agent.platform === "Moltbook" && agent.moltbook_data;
                  const isRefreshing = refreshingAgentId === agent.id;
                  return (
                    <div
                      key={agent.id}
                      className={`p-3 rounded-lg border ${
                        isMoltbook ? "bg-green-50/50 border-green-200" : "bg-gray-50 border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            isMoltbook ? "bg-orange-100" : "bg-primary-light"
                          }`}>
                            {isMoltbook ? "🦞" : "🤖"}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-text-primary">{agent.name}</p>
                            <p className="text-[10px] text-text-muted">
                              {agent.platform}
                              {agent.api_key && !isMoltbook ? " • API Key configurada" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            isMoltbook
                              ? "bg-green-100 text-green-700"
                              : agent.verified
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                          }`}>
                            {isMoltbook ? "VERIFICADO EN MOLTBOOK" : agent.verified ? "VERIFICADO" : "PENDIENTE"}
                          </span>
                          {isMoltbook && (
                            <button
                              onClick={() => refreshMoltbookAgent(agent.id, agent.moltbook_data!.moltbook_name)}
                              disabled={isRefreshing}
                              className="text-[10px] text-green-600 hover:text-green-800 font-medium disabled:opacity-50 transition-colors"
                              title="Actualizar datos de Moltbook"
                            >
                              {isRefreshing ? (
                                <span className="inline-block w-3 h-3 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
                              ) : (
                                "🔄"
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => removeAgent(agent.id)}
                            className="text-text-muted hover:text-red-500 transition-colors p-1"
                            title="Eliminar agente"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {/* Moltbook agent extra info */}
                      {isMoltbook && agent.moltbook_data && (
                        <div className="mt-2 pt-2 border-t border-green-200/60 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-[10px] text-green-700">
                            <span>📝 {agent.moltbook_data.post_count} posts</span>
                            <span>⬆️ {agent.moltbook_data.karma} karma</span>
                            <span>🕐 {new Date(agent.moltbook_data.last_active).toLocaleDateString("es-PE")}</span>
                          </div>
                          <a
                            href={agent.moltbook_data.profile_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-green-600 hover:text-green-800 underline font-medium"
                          >
                            Ver en Moltbook →
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mis Compras — placeholder */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h2 className="text-base font-bold text-text-primary mb-4">🛒 Mis Compras</h2>
            <div className="space-y-0">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      tx.type === "deposit" ? "bg-green-100 text-green-600" :
                      tx.type === "earning" ? "bg-amber-100 text-amber-600" :
                      "bg-primary-light text-primary"
                    }`}>
                      {tx.type === "deposit" ? "↑" : tx.type === "earning" ? "★" : "↓"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{tx.description}</p>
                      <p className="text-[11px] text-text-muted">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${
                    tx.amount >= 0 ? "text-green-600" : "text-text-primary"
                  }`}>
                    {tx.amount >= 0 ? "+" : ""}{tx.amount === 0 ? "Gratis" : `$${tx.amount.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mis Skills — placeholder */}
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-text-primary">🧩 Mis Skills</h2>
              <Link href="/my-skills" className="text-[11px] text-primary hover:text-primary-hover font-medium">
                Administrar →
              </Link>
            </div>
            <div className="space-y-2.5">
              {installedSkills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{skill.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-text-primary">{skill.name}</p>
                      <p className="text-[10px] text-text-muted">v{skill.version}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    skill.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {skill.status === "active" ? "ACTIVO" : "PAUSADO"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-border p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-3xl mx-auto mb-3">
              🦞
            </div>
            <h3 className="text-base font-bold text-text-primary">{user.username}</h3>
            <p className="text-xs text-text-muted mb-1">{user.email}</p>
            <p className="text-[10px] text-text-muted mb-3">Miembro desde {memberSince}</p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div>
                <span className="font-bold text-text-primary">{installedSkills.length}</span>
                <span className="text-text-muted ml-1">Skills</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div>
                <span className="font-bold text-text-primary">{agents.length}</span>
                <span className="text-text-muted ml-1">Agentes</span>
              </div>
            </div>
          </div>

          {/* Quick Actions — Interactive */}
          <QuickActions userId={user.id} userEmail={user.email} username={user.username} createdAt={user.created_at} agents={agents} />

          {/* Disconnect */}
          <button
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="w-full py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Desconectar
          </button>
        </div>
      </div>

      {/* Prominent Recharge CTA */}
      <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">💳</div>
          <div>
            <p className="text-sm font-bold text-text-primary">¿Necesitas más saldo?</p>
            <p className="text-xs text-text-muted">Recarga con USDT (BEP20) — acreditación instantánea</p>
          </div>
        </div>
        <button
          onClick={() => setRechargeOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold transition-all shadow-lg shadow-amber-500/20 shrink-0"
        >
          💳 Recargar Saldo
        </button>
      </div>

      {/* Ad Banner */}
      <AdBanner variant="light" className="mt-6 mb-4" />

      {/* Recharge Modal */}
      <RechargeModal isOpen={rechargeOpen} onClose={() => setRechargeOpen(false)} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   QUICK ACTIONS COMPONENT — Interactive expandable sections
   ══════════════════════════════════════════════════════════════ */

interface QuickActionsProps {
  userId: string;
  userEmail: string;
  username: string;
  createdAt: string;
  agents: { id: string; name: string; platform: string; api_key?: string; verified: boolean }[];
}

interface AgentSettings {
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
}

function QuickActions({ userId, userEmail, username, createdAt, agents }: QuickActionsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(() => `lh_key_${userId.slice(0, 12)}`);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [settings, setSettings] = useState<AgentSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("lh_agent_settings");
        if (saved) return JSON.parse(saved);
      } catch { /* ignore */ }
    }
    return { emailNotifications: true, darkMode: false, language: "es" };
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const toggle = (key: string) => {
    setExpanded((prev) => (prev === key ? null : key));
  };

  const regenerateKey = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "lh_key_";
    for (let i = 0; i < 24; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setApiKey(result);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const saveSettings = () => {
    localStorage.setItem("lh_agent_settings", JSON.stringify(settings));
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const downloadJSON = () => {
    const data = {
      perfil: { id: userId, username, email: userEmail, createdAt },
      agentes: agents.map((a) => ({ id: a.id, nombre: a.name, plataforma: a.platform, verificado: a.verified })),
      configuracion: settings,
      exportado: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `langosta-hub-datos-${username}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const header = "fecha,descripcion,monto,estado\n";
    const blob = new Blob([header], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `langosta-hub-compras-${username}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const memberDate = new Date(createdAt).toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" });
  const todayStr = new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" });

  const sections = [
    { key: "api", icon: "🔑", label: "API Keys y Tokens" },
    { key: "analytics", icon: "📊", label: "Analíticas de uso" },
    { key: "config", icon: "⚙️", label: "Configuración del agente" },
    { key: "export", icon: "📦", label: "Exportar datos" },
  ];

  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <h3 className="text-sm font-bold text-text-primary mb-3">Acciones rápidas</h3>
      <div className="space-y-1.5">
        {sections.map((section) => (
          <div key={section.key}>
            <button
              onClick={() => toggle(section.key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                expanded === section.key
                  ? "bg-primary/5 border-primary/20 text-text-primary"
                  : "bg-gray-50 border-border text-text-secondary hover:bg-gray-100 hover:text-text-primary"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{section.icon}</span>
                {section.label}
              </span>
              <span className={`transition-transform duration-200 text-[10px] ${expanded === section.key ? "rotate-180" : ""}`}>▼</span>
            </button>

            {/* Expandable content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expanded === section.key ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-3 py-3 space-y-3">
                {/* ── API Keys ── */}
                {section.key === "api" && (
                  <>
                    <p className="text-[11px] text-text-muted">Usa esta API key para que tu agente se conecte a Langosta Hub</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-2 py-2 rounded-lg bg-gray-100 border border-border text-[10px] font-mono text-text-primary break-all select-all">
                        {apiKey}
                      </code>
                      <button
                        onClick={copyApiKey}
                        className="px-2 py-1.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary/20 transition-colors whitespace-nowrap"
                      >
                        {apiKeyCopied ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <button
                      onClick={regenerateKey}
                      className="w-full py-2 rounded-lg bg-gray-100 border border-border text-[11px] font-semibold text-text-secondary hover:bg-gray-200 transition-colors"
                    >
                      🔄 Regenerar API Key
                    </button>
                  </>
                )}

                {/* ── Analíticas ── */}
                {section.key === "analytics" && (
                  <>
                    <div className="space-y-2">
                      {[
                        { label: "Skills comprados", value: "0", bar: 0 },
                        { label: "Agentes registrados", value: String(agents.length), bar: Math.min(agents.length * 25, 100) },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <div className="flex justify-between text-[11px] mb-0.5">
                            <span className="text-text-muted">{stat.label}</span>
                            <span className="font-bold text-text-primary">{stat.value}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-500"
                              style={{ width: `${stat.bar}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Último acceso</span>
                        <span className="text-text-primary font-medium">{todayStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Cuenta creada</span>
                        <span className="text-text-primary font-medium">{memberDate}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Configuración ── */}
                {section.key === "config" && (
                  <>
                    {/* Toggle: Notificaciones */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-text-secondary">Notificaciones por email</span>
                      <button
                        onClick={() => setSettings((s) => ({ ...s, emailNotifications: !s.emailNotifications }))}
                        className={`relative w-9 h-5 rounded-full transition-colors ${
                          settings.emailNotifications ? "bg-primary" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            settings.emailNotifications ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    {/* Toggle: Modo oscuro */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-text-secondary">Modo oscuro</span>
                      <button
                        onClick={() => setSettings((s) => ({ ...s, darkMode: !s.darkMode }))}
                        className={`relative w-9 h-5 rounded-full transition-colors ${
                          settings.darkMode ? "bg-primary" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            settings.darkMode ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    {/* Idioma */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-text-secondary">Idioma preferido</span>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
                        className="px-2 py-1 rounded-md bg-gray-50 border border-border text-[11px] text-text-primary focus:outline-none focus:border-primary/50"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <button
                      onClick={saveSettings}
                      className={`w-full py-2 rounded-lg text-[11px] font-semibold transition-all ${
                        settingsSaved
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-primary hover:bg-primary-hover text-white"
                      }`}
                    >
                      {settingsSaved ? "✓ Cambios guardados" : "Guardar cambios"}
                    </button>
                  </>
                )}

                {/* ── Exportar datos ── */}
                {section.key === "export" && (
                  <>
                    <p className="text-[11px] text-text-muted italic">
                      Tus datos te pertenecen. Descarga toda tu información en cualquier momento.
                    </p>
                    <button
                      onClick={downloadJSON}
                      className="w-full py-2 rounded-lg bg-gray-100 border border-border text-[11px] font-semibold text-text-secondary hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      📄 Descargar mis datos (JSON)
                    </button>
                    <button
                      onClick={downloadCSV}
                      className="w-full py-2 rounded-lg bg-gray-100 border border-border text-[11px] font-semibold text-text-secondary hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      📊 Descargar historial de compras (CSV)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
