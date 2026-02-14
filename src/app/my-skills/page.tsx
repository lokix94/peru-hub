import Link from "next/link";

const mySkills = [
  {
    id: "peruvian-legal-research",
    name: "Peruvian Legal Research",
    icon: "⚖️",
    version: "1.0.0",
    status: "active" as const,
    type: "installed" as const,
    lastUsed: "2 hours ago",
    usageCount: 47,
  },
  {
    id: "voice-camila-tts",
    name: "Voice: Camila Neural TTS",
    icon: "🎙️",
    version: "2.1.0",
    status: "active" as const,
    type: "installed" as const,
    lastUsed: "30 min ago",
    usageCount: 234,
  },
  {
    id: "web-research-pro",
    name: "Web Research Pro",
    icon: "🌐",
    version: "3.2.1",
    status: "active" as const,
    type: "purchased" as const,
    lastUsed: "1 hour ago",
    usageCount: 89,
  },
  {
    id: "code-review-assistant",
    name: "Code Review Assistant",
    icon: "💻",
    version: "1.5.0",
    status: "active" as const,
    type: "purchased" as const,
    lastUsed: "Yesterday",
    usageCount: 12,
  },
  {
    id: "memory-curator",
    name: "Memory Curator",
    icon: "🧠",
    version: "1.1.1",
    status: "active" as const,
    type: "installed" as const,
    lastUsed: "3 hours ago",
    usageCount: 156,
  },
  {
    id: "self-reflection",
    name: "Self Reflection",
    icon: "🪞",
    version: "1.1.1",
    status: "paused" as const,
    type: "installed" as const,
    lastUsed: "3 days ago",
    usageCount: 8,
  },
  {
    id: "email-composer",
    name: "Email Composer Pro",
    icon: "📧",
    version: "2.0.0",
    status: "active" as const,
    type: "purchased" as const,
    lastUsed: "5 hours ago",
    usageCount: 67,
  },
];

const publishedSkills = [
  {
    name: "Peruvian Legal Research",
    icon: "⚖️",
    installs: 156,
    rating: 4.8,
    earnings: "$0.00",
    status: "live",
  },
  {
    name: "Self Reflection",
    icon: "🪞",
    installs: 723,
    rating: 4.7,
    earnings: "$0.00",
    status: "live",
  },
  {
    name: "Voice: Camila Neural TTS",
    icon: "🎙️",
    installs: 432,
    rating: 4.9,
    earnings: "$0.00",
    status: "live",
  },
];

export default function MySkillsPage() {
  const activeCount = mySkills.filter((s) => s.status === "active").length;
  const totalUsage = mySkills.reduce((sum, s) => sum + s.usageCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">My Skills</h1>
          <p className="text-text-secondary">
            {mySkills.length} installed · {activeCount} active · {totalUsage} total uses
          </p>
        </div>
        <Link
          href="/marketplace"
          className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors"
        >
          + Add Skill
        </Link>
      </div>

      {/* Installed Skills */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Installed & Purchased</h2>
        <div className="grid grid-cols-1 gap-3">
          {mySkills.map((skill) => (
            <Link key={skill.id} href={`/marketplace/${skill.id}`}>
              <div className="glass-card p-4 flex items-center justify-between hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{skill.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{skill.name}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-text-muted">v{skill.version}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        skill.type === "purchased"
                          ? "bg-primary/10 text-primary"
                          : "bg-border/50 text-text-muted"
                      }`}>
                        {skill.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-text-muted">Last used</p>
                    <p className="text-sm text-text-secondary">{skill.lastUsed}</p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-text-muted">Uses</p>
                    <p className="text-sm text-text-secondary">{skill.usageCount}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    skill.status === "active"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}>
                    {skill.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Published Skills */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Published by You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {publishedSkills.map((skill) => (
            <div key={skill.name} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{skill.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{skill.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success/10 text-success">
                    {skill.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-text-primary">{skill.installs}</p>
                  <p className="text-[10px] text-text-muted">Installs</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-accent">{skill.rating}</p>
                  <p className="text-[10px] text-text-muted">Rating</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-success">{skill.earnings}</p>
                  <p className="text-[10px] text-text-muted">Earned</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
