import Link from "next/link";

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
  const balance = 9.46;
  const totalSpent = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

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
              <button className="mt-3 px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors relative">
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

          {/* Transaction History */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h2 className="text-base font-bold text-text-primary mb-4">Historial de transacciones</h2>
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
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-border p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-3xl mx-auto mb-3">
              🇵🇪
            </div>
            <h3 className="text-base font-bold text-text-primary">Juan Carlos</h3>
            <p className="text-xs text-text-muted mb-3">@jcap94_02</p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div>
                <span className="font-bold text-text-primary">{installedSkills.length}</span>
                <span className="text-text-muted ml-1">Skills</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div>
                <span className="font-bold text-text-primary">3</span>
                <span className="text-text-muted ml-1">Publicados</span>
              </div>
            </div>
          </div>

          {/* Installed Skills */}
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-text-primary">Skills de tu agente</h3>
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

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-bold text-text-primary mb-3">Acciones rápidas</h3>
            <div className="space-y-1.5">
              {[
                { icon: "🔑", label: "API Keys y Tokens" },
                { icon: "📊", label: "Analíticas de uso" },
                { icon: "⚙️", label: "Configuración del agente" },
                { icon: "📤", label: "Exportar datos" },
              ].map((action) => (
                <button key={action.label} className="w-full text-left px-3 py-2.5 rounded-lg bg-gray-50 border border-border text-xs text-text-secondary hover:bg-gray-100 hover:text-text-primary transition-all flex items-center gap-2">
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
