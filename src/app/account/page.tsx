import Link from "next/link";

const transactions = [
  { id: "tx-1", type: "deposit", description: "Added funds", amount: 20.00, date: "2026-02-12", status: "completed" },
  { id: "tx-2", type: "purchase", description: "Code Review Assistant", amount: -9.99, date: "2026-02-11", status: "completed" },
  { id: "tx-3", type: "purchase", description: "Web Research Pro", amount: -4.99, date: "2026-02-10", status: "completed" },
  { id: "tx-4", type: "earning", description: "Skill sale: Peruvian Legal Research", amount: 0.00, date: "2026-02-09", status: "completed" },
  { id: "tx-5", type: "purchase", description: "Email Composer Pro", amount: -3.99, date: "2026-02-08", status: "completed" },
  { id: "tx-6", type: "deposit", description: "Initial deposit", amount: 10.00, date: "2026-02-01", status: "completed" },
];

const installedSkills = [
  { name: "Peruvian Legal Research", icon: "⚖️", version: "1.0.0", status: "active" },
  { name: "Voice: Camila Neural TTS", icon: "🎙️", version: "2.1.0", status: "active" },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Account</h1>
        <p className="text-text-secondary">Manage your balance, skills, and activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-6 animate-pulse-glow">
              <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">Available Balance</p>
              <p className="text-3xl font-bold text-accent">${balance.toFixed(2)}</p>
              <button className="mt-3 px-4 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors">
                Add Funds
              </button>
            </div>
            <div className="glass-card p-6">
              <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">Total Spent</p>
              <p className="text-3xl font-bold text-text-primary">${totalSpent.toFixed(2)}</p>
              <p className="text-xs text-text-muted mt-3">
                {transactions.filter(t => t.type === "purchase").length} purchases
              </p>
            </div>
            <div className="glass-card p-6">
              <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">Earnings</p>
              <p className="text-3xl font-bold text-success">$0.00</p>
              <p className="text-xs text-text-muted mt-3">From skill sales</p>
            </div>
          </div>

          {/* Transaction History */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Transaction History</h2>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      tx.type === "deposit" ? "bg-success/10 text-success" :
                      tx.type === "earning" ? "bg-accent/10 text-accent" :
                      "bg-primary/10 text-primary"
                    }`}>
                      {tx.type === "deposit" ? "↑" : tx.type === "earning" ? "★" : "↓"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{tx.description}</p>
                      <p className="text-xs text-text-muted">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${
                    tx.amount >= 0 ? "text-success" : "text-text-primary"
                  }`}>
                    {tx.amount >= 0 ? "+" : ""}{tx.amount === 0 ? "Free" : `$${tx.amount.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Profile & Installed Skills */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="glass-card p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl mx-auto mb-4">
              🇵🇪
            </div>
            <h3 className="text-lg font-semibold text-text-primary">Juan Carlos</h3>
            <p className="text-sm text-text-muted mb-4">@jcap94_02</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div>
                <span className="font-semibold text-text-primary">{installedSkills.length}</span>
                <span className="text-text-muted ml-1">Skills</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div>
                <span className="font-semibold text-text-primary">3</span>
                <span className="text-text-muted ml-1">Published</span>
              </div>
            </div>
          </div>

          {/* Installed Skills */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary">Installed Skills</h3>
              <Link href="/my-skills" className="text-xs text-primary hover:text-primary-hover transition-colors">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {installedSkills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{skill.icon}</span>
                    <div>
                      <p className="text-sm text-text-primary">{skill.name}</p>
                      <p className="text-xs text-text-muted">v{skill.version}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    skill.status === "active"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}>
                    {skill.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2.5 rounded-lg bg-background border border-border text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-all">
                🔑 API Keys & Tokens
              </button>
              <button className="w-full text-left px-4 py-2.5 rounded-lg bg-background border border-border text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-all">
                📊 Usage Analytics
              </button>
              <button className="w-full text-left px-4 py-2.5 rounded-lg bg-background border border-border text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-all">
                ⚙️ Agent Settings
              </button>
              <button className="w-full text-left px-4 py-2.5 rounded-lg bg-background border border-border text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-all">
                📤 Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
