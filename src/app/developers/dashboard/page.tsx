"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LS_DEV_PROFILES_KEY = "langosta-dev-profiles";
const LS_SKILLS_KEY = "langosta-dev-skills";

interface DevProfile {
  userId: string;
  fullName: string;
  email: string;
  walletBEP20: string;
  moltbookProfile: string;
  createdAt: string;
}

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

interface Transaction {
  id: string;
  date: string;
  skillName: string;
  buyer: string;
  amount: number;
  devShare: number;
  status: "pagado" | "pendiente";
}

function getDevProfiles(): DevProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_DEV_PROFILES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDevProfiles(profiles: DevProfile[]) {
  try {
    localStorage.setItem(LS_DEV_PROFILES_KEY, JSON.stringify(profiles));
  } catch { /* ignore */ }
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

type TabId = "perfil" | "skills" | "ganancias" | "transacciones";

export default function DevDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<TabId>("skills");
  const [profile, setProfile] = useState<DevProfile | null>(null);
  const [mySkills, setMySkills] = useState<SkillSubmission[]>([]);
  const [transactions] = useState<Transaction[]>([]);
  const [editingWallet, setEditingWallet] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const loadData = useCallback(() => {
    if (!user) return;
    const profiles = getDevProfiles();
    const myProfile = profiles.find((p) => p.userId === user.id);
    if (myProfile) {
      setProfile(myProfile);
      setWalletInput(myProfile.walletBEP20);
    }
    const skills = getSkills();
    setMySkills(skills.filter((s) => s.developerId === user.id));
  }, [user]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/developers/registro");
      return;
    }
    loadData();
  }, [isLoading, isAuthenticated, router, loadData]);

  function saveWallet() {
    if (!profile || !user) return;
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletInput.trim())) {
      alert("Dirección BEP20 inválida");
      return;
    }
    const profiles = getDevProfiles();
    const idx = profiles.findIndex((p) => p.userId === user.id);
    if (idx >= 0) {
      profiles[idx].walletBEP20 = walletInput.trim();
      saveDevProfiles(profiles);
      setProfile({ ...profile, walletBEP20: walletInput.trim() });
    }
    setEditingWallet(false);
  }

  // Compute earnings
  const approvedSkills = mySkills.filter((s) => s.status === "approved");
  const totalEarned = transactions.reduce((sum, t) => sum + t.devShare, 0);
  const pendingPayment = transactions.filter((t) => t.status === "pendiente").reduce((sum, t) => sum + t.devShare, 0);
  const alreadyPaid = transactions.filter((t) => t.status === "pagado").reduce((sum, t) => sum + t.devShare, 0);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const statusBadge = (status: string, reason?: string) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">🟡 Pendiente</span>;
      case "approved":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">🟢 Aprobado</span>;
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20" title={reason}>
            🔴 Rechazado
          </span>
        );
      default:
        return null;
    }
  };

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "perfil", label: "Mi Perfil", icon: "👤" },
    { id: "skills", label: "Mis Skills", icon: "🔧" },
    { id: "ganancias", label: "Mis Ganancias", icon: "💰" },
    { id: "transacciones", label: "Transacciones", icon: "📋" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Inicio</Link>
        <span className="mx-1.5">›</span>
        <Link href="/developers" className="hover:text-primary">Desarrolladores</Link>
        <span className="mx-1.5">›</span>
        <span className="text-text-primary font-medium">Dashboard</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            🦞 Dashboard de Desarrollador
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Bienvenido, <span className="font-semibold">{profile?.fullName || user?.username}</span>
          </p>
        </div>
        <Link
          href="/developers/nueva-skill"
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-all shadow-lg shadow-primary/25"
        >
          ➕ Nueva Skill
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="p-4 rounded-xl bg-surface border border-border">
          <p className="text-[10px] text-text-muted uppercase font-semibold">Skills enviados</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{mySkills.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border">
          <p className="text-[10px] text-text-muted uppercase font-semibold">Aprobados</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{approvedSkills.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border">
          <p className="text-[10px] text-text-muted uppercase font-semibold">Total ganado</p>
          <p className="text-2xl font-bold text-text-primary mt-1">${totalEarned.toFixed(2)}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border">
          <p className="text-[10px] text-text-muted uppercase font-semibold">Pendiente</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">${pendingPayment.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-surface border border-border p-1 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-sm"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "perfil" && (
        <div className="bg-surface rounded-2xl border border-border p-6 animate-fade-in">
          <h2 className="text-lg font-bold text-text-primary mb-6">👤 Mi Perfil de Desarrollador</h2>

          {!profile ? (
            <div className="text-center py-8">
              <p className="text-sm text-text-secondary mb-4">No tienes un perfil de desarrollador aún.</p>
              <Link
                href="/developers/registro"
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors"
              >
                Completar registro
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background border border-border">
                  <p className="text-[10px] text-text-muted uppercase font-semibold mb-1">Nombre completo</p>
                  <p className="text-sm text-text-primary font-medium">{profile.fullName}</p>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border">
                  <p className="text-[10px] text-text-muted uppercase font-semibold mb-1">Email</p>
                  <p className="text-sm text-text-primary font-medium">{profile.email}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-text-muted uppercase font-semibold">Wallet USDT BEP20</p>
                  <button
                    onClick={() => {
                      if (editingWallet) {
                        saveWallet();
                      } else {
                        setEditingWallet(true);
                      }
                    }}
                    className="text-[10px] text-primary hover:text-primary-hover font-semibold"
                  >
                    {editingWallet ? "💾 Guardar" : "✏️ Editar"}
                  </button>
                </div>
                {editingWallet ? (
                  <input
                    type="text"
                    value={walletInput}
                    onChange={(e) => setWalletInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-primary/50"
                  />
                ) : (
                  <p className="text-sm text-text-primary font-mono break-all">{profile.walletBEP20}</p>
                )}
              </div>

              {profile.moltbookProfile && (
                <div className="p-4 rounded-xl bg-background border border-border">
                  <p className="text-[10px] text-text-muted uppercase font-semibold mb-1">Perfil de Moltbook</p>
                  <p className="text-sm text-text-primary font-medium">{profile.moltbookProfile}</p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-background border border-border">
                <p className="text-[10px] text-text-muted uppercase font-semibold mb-1">Miembro desde</p>
                <p className="text-sm text-text-primary font-medium">
                  {new Date(profile.createdAt).toLocaleDateString("es-PE", { dateStyle: "long" })}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "skills" && (
        <div className="animate-fade-in">
          {mySkills.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-border p-8 text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">No has publicado skills aún</h3>
              <p className="text-sm text-text-secondary mb-4">
                Publica tu primera skill y empieza a ganar dinero.
              </p>
              <Link
                href="/developers/nueva-skill"
                className="inline-block px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors"
              >
                ➕ Publicar mi primera skill
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-text-primary">🔧 Mis Skills ({mySkills.length})</h2>
              </div>
              {mySkills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-surface rounded-xl border border-border p-4 hover:border-primary/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-2xl">{skill.emoji}</span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-text-primary">{skill.skillName}</h3>
                        <p className="text-xs text-text-secondary mt-0.5 truncate">{skill.description.slice(0, 100)}...</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[10px] text-text-muted bg-background px-2 py-0.5 rounded-full border border-border">{skill.category}</span>
                          <span className="text-[10px] text-text-muted">${skill.price.toFixed(2)}</span>
                          <span className="text-[10px] text-text-muted">•</span>
                          <span className="text-[10px] text-text-muted">{new Date(skill.submittedAt).toLocaleDateString("es-PE")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {statusBadge(skill.status, skill.rejectionReason)}
                    </div>
                  </div>
                  {skill.status === "rejected" && skill.rejectionReason && (
                    <div className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                      <p className="text-[10px] text-red-400 font-semibold mb-0.5">Motivo del rechazo:</p>
                      <p className="text-xs text-red-300">{skill.rejectionReason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "ganancias" && (
        <div className="animate-fade-in space-y-6">
          {/* Earnings Summary */}
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="text-lg font-bold text-text-primary mb-6">💰 Mis Ganancias</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <p className="text-[10px] text-green-600 uppercase font-semibold">Total ganado</p>
                <p className="text-2xl font-black text-green-700 mt-1">${totalEarned.toFixed(2)}</p>
                <p className="text-[10px] text-green-500">USDT</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-[10px] text-amber-600 uppercase font-semibold">Pendiente de pago</p>
                <p className="text-2xl font-black text-amber-700 mt-1">${pendingPayment.toFixed(2)}</p>
                <p className="text-[10px] text-amber-500">USDT</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-[10px] text-blue-600 uppercase font-semibold">Ya pagado</p>
                <p className="text-2xl font-black text-blue-700 mt-1">${alreadyPaid.toFixed(2)}</p>
                <p className="text-[10px] text-blue-500">USDT</p>
              </div>
            </div>

            {/* Revenue split info */}
            <div className="p-4 rounded-xl bg-background border border-border">
              <p className="text-xs text-text-muted font-semibold mb-2">📊 División de ingresos</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-green-100 rounded-full h-4 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "97%" }} />
                </div>
                <span className="text-xs font-bold text-green-600 whitespace-nowrap">97% tuyo</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1 bg-violet-100 rounded-full h-4 overflow-hidden">
                  <div className="bg-violet-500 h-full rounded-full" style={{ width: "3%" }} />
                </div>
                <span className="text-xs font-bold text-violet-600 whitespace-nowrap">3% plataforma</span>
              </div>
            </div>
          </div>

          {/* Per-skill Breakdown */}
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h3 className="text-sm font-bold text-text-primary mb-4">📈 Desglose por skill</h3>
            {approvedSkills.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">
                Aún no tienes skills aprobados. Las ganancias aparecerán aquí cuando vendas.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] text-text-muted uppercase border-b border-border">
                      <th className="px-3 py-2">Skill</th>
                      <th className="px-3 py-2 text-center">Ventas</th>
                      <th className="px-3 py-2 text-center">Ingresos</th>
                      <th className="px-3 py-2 text-right">Tu 97%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedSkills.map((skill) => (
                      <tr key={skill.id} className="border-b border-border/50">
                        <td className="px-3 py-3">
                          <span className="mr-1">{skill.emoji}</span>
                          <span className="font-medium text-text-primary">{skill.skillName}</span>
                        </td>
                        <td className="px-3 py-3 text-center text-text-secondary">0</td>
                        <td className="px-3 py-3 text-center text-text-secondary">$0.00</td>
                        <td className="px-3 py-3 text-right font-bold text-green-600">$0.00</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Withdraw Button */}
          <div className="bg-surface rounded-2xl border border-border p-6 text-center">
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={pendingPayment < 10}
              className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              💸 Solicitar retiro
            </button>
            <p className="text-[10px] text-text-muted mt-2">
              Mínimo de retiro: $10.00 USDT
            </p>
            {profile?.walletBEP20 && (
              <p className="text-[10px] text-text-muted mt-1">
                Wallet: <span className="font-mono">{profile.walletBEP20.slice(0, 10)}...{profile.walletBEP20.slice(-6)}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "transacciones" && (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-bold text-text-primary">📋 Historial de transacciones</h2>
            <p className="text-xs text-text-muted mt-0.5">Todas tus ventas y pagos</p>
          </div>

          {transactions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-3xl mb-3">📭</div>
              <p className="text-sm text-text-secondary">No hay transacciones aún</p>
              <p className="text-xs text-text-muted mt-1">Las ventas aparecerán aquí cuando alguien compre tus skills</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] text-text-muted uppercase border-b border-border">
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Skill</th>
                    <th className="px-4 py-3">Comprador</th>
                    <th className="px-4 py-3 text-center">Monto</th>
                    <th className="px-4 py-3 text-center">Tu parte (97%)</th>
                    <th className="px-4 py-3 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-background/50">
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{tx.date}</td>
                      <td className="px-4 py-3 text-text-primary font-medium">{tx.skillName}</td>
                      <td className="px-4 py-3 text-text-secondary">{tx.buyer}</td>
                      <td className="px-4 py-3 text-center text-text-primary">${tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center font-bold text-green-600">${tx.devShare.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        {tx.status === "pagado" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700 border border-green-200">✅ Pagado</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">⏳ Pendiente</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-surface rounded-2xl border border-border p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-text-primary mb-4">💸 Solicitar retiro</h3>

            <div className="space-y-3 mb-6">
              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-[10px] text-text-muted uppercase font-semibold">Saldo disponible</p>
                <p className="text-xl font-bold text-text-primary">${pendingPayment.toFixed(2)} USDT</p>
              </div>

              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-[10px] text-text-muted uppercase font-semibold">Wallet de destino</p>
                <p className="text-xs text-text-primary font-mono break-all">{profile?.walletBEP20}</p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-700">
                  ⚠️ Mínimo de retiro: <strong>$10.00 USDT</strong>. Los retiros se procesan en 24-48 horas hábiles.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-background border border-border text-text-secondary text-sm font-semibold hover:bg-border/30 transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={pendingPayment < 10}
                className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Confirmar retiro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
