"use client";

import { useState, useEffect, useCallback } from "react";

interface Transaction {
  date: string;
  user: string;
  amount: string;
  txHash: string;
  status: "confirmed" | "pending" | "failed";
  isDemo?: boolean;
}

const WALLET = "0xcbc14706f7f8167505de1690e1e8419399f9506d";
const BSCSCAN_WALLET_URL = `https://bscscan.com/address/${WALLET}`;

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    date: "2026-02-14 02:30",
    user: "Demo Agent1",
    amount: "10.00",
    txHash: "0xabc123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd",
    status: "confirmed",
    isDemo: true,
  },
  {
    date: "2026-02-14 01:15",
    user: "Demo Agent2",
    amount: "25.00",
    txHash: "0xdef456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
    status: "pending",
    isDemo: true,
  },
  {
    date: "2026-02-13 22:45",
    user: "Demo Agent3",
    amount: "5.00",
    txHash: "0xghi789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
    status: "confirmed",
    isDemo: true,
  },
];

function formatHash(hash: string): string {
  return hash.slice(0, 10) + "..." + hash.slice(-6);
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const config = {
    confirmed: { label: "✅ Confirmado", classes: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    pending: { label: "⏳ Pendiente", classes: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    failed: { label: "❌ Fallido", classes: "bg-red-500/20 text-red-400 border-red-500/30" },
  };
  const { label, classes } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${classes}`}>
      {label}
    </span>
  );
}

export default function AdminPage() {
  const [totalReceived, setTotalReceived] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [registeredUsers, setRegisteredUsers] = useState(0);
  const [verifiedAgents, setVerifiedAgents] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_TRANSACTIONS);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.transactions && data.transactions.length > 0) {
        setTransactions(data.transactions);
        setTransactionCount(data.transactions.length);
      } else {
        setTransactions(DEMO_TRANSACTIONS);
        setTransactionCount(0);
      }

      if (data.total_received !== undefined) {
        setTotalReceived(data.total_received);
      }

      setLastChecked(data.last_checked || new Date().toISOString());

      if (data.note) {
        setError(data.note);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const stats = [
    {
      title: "Ingresos Totales",
      value: `$${totalReceived.toFixed(2)}`,
      subtitle: "USDT recibidos",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ),
      color: "emerald",
    },
    {
      title: "Transacciones",
      value: transactionCount.toString(),
      subtitle: "Total procesadas",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
      color: "blue",
    },
    {
      title: "Usuarios Registrados",
      value: registeredUsers.toString(),
      subtitle: "Cuentas creadas",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      color: "purple",
    },
    {
      title: "Agentes Verificados",
      value: verifiedAgents.toString(),
      subtitle: "Moltbook verificados",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      color: "amber",
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    emerald: { bg: "from-emerald-500/10 to-emerald-500/5", text: "text-emerald-400", iconBg: "bg-emerald-500/20" },
    blue: { bg: "from-blue-500/10 to-blue-500/5", text: "text-blue-400", iconBg: "bg-blue-500/20" },
    purple: { bg: "from-purple-500/10 to-purple-500/5", text: "text-purple-400", iconBg: "bg-purple-500/20" },
    amber: { bg: "from-amber-500/10 to-amber-500/5", text: "text-amber-400", iconBg: "bg-amber-500/20" },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header Section */}
      <div className="border-b border-white/10 bg-[#0f0f18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                🔐 Panel de Administrador — Langosta Hub
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Monitoreo de ingresos y transacciones
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                En línea
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error / Info banner */}
        {error && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-300">
            ⚠️ {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const c = colorMap[stat.color];
            return (
              <div
                key={stat.title}
                className={`relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${c.bg} backdrop-blur-sm p-5`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.title}</p>
                    <p className={`mt-2 text-3xl font-bold ${c.text}`}>{stat.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{stat.subtitle}</p>
                  </div>
                  <div className={`rounded-xl ${c.iconBg} p-2.5 ${c.text}`}>{stat.icon}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transaction History Table */}
        <div className="rounded-2xl border border-white/5 bg-[#13131d] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">📋 Historial de Transacciones</h2>
              <p className="text-xs text-slate-500 mt-0.5">Pagos recibidos en USDT (BEP20)</p>
            </div>
            {transactions.some((t) => t.isDemo) && (
              <span className="text-[10px] uppercase tracking-wider text-amber-400/70 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                Datos demo
              </span>
            )}
          </div>

          {transactions.length === 0 ? (
            <div className="px-6 py-16 text-center text-slate-500">
              <p className="text-lg">📭 No hay transacciones aún</p>
              <p className="text-sm mt-1">Las transacciones aparecerán aquí cuando se reciban pagos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-white/5">
                    <th className="px-6 py-3 font-medium">Fecha</th>
                    <th className="px-6 py-3 font-medium">Usuario</th>
                    <th className="px-6 py-3 font-medium">Monto (USDT)</th>
                    <th className="px-6 py-3 font-medium">TxHash</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium">BSCScan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-slate-300 whitespace-nowrap">{tx.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-200 font-medium">{tx.user}</span>
                        {tx.isDemo && (
                          <span className="ml-1.5 text-[10px] text-amber-400/50">(demo)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-emerald-400 font-semibold whitespace-nowrap">
                        ${tx.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`https://bscscan.com/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 font-mono text-xs transition-colors"
                        >
                          {formatHash(tx.txHash)}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`https://bscscan.com/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                        >
                          Ver
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Wallet Monitor Section */}
        <div className="rounded-2xl border border-white/5 bg-[#13131d] p-6">
          <h2 className="text-lg font-semibold text-white mb-4">💰 Monitor de Wallet</h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Wallet address */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-1">Dirección de recepción (BSC)</p>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                <code className="text-sm text-slate-300 font-mono truncate">{WALLET}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(WALLET)}
                  className="shrink-0 text-slate-400 hover:text-white transition-colors"
                  title="Copiar dirección"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={BSCSCAN_WALLET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Ver en BSCScan
              </a>
              <button
                onClick={fetchTransactions}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <span className={loading ? "animate-spin" : ""}>🔄</span>
                {loading ? "Cargando..." : "Actualizar"}
              </button>
            </div>
          </div>

          {/* Last checked */}
          {lastChecked && (
            <p className="mt-3 text-xs text-slate-500">
              Última verificación: {new Date(lastChecked).toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          )}
        </div>

        {/* Income Chart Placeholder */}
        <div className="rounded-2xl border border-white/5 bg-[#13131d] p-6">
          <h2 className="text-lg font-semibold text-white mb-4">📊 Gráfico de Ingresos</h2>
          <div className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02]">
            <div className="text-center">
              <p className="text-2xl mb-2">📊</p>
              <p className="text-slate-400 font-medium">Gráfico de ingresos — Próximamente</p>
              <p className="text-xs text-slate-600 mt-1">Se activará cuando haya datos suficientes</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-slate-600">
            Langosta Hub Admin Dashboard — Solo para uso interno
          </p>
        </div>
      </div>
    </div>
  );
}
