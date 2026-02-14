import Link from "next/link";
import SkillCard from "@/components/SkillCard";
import { getFeaturedSkills, skills } from "@/data/skills";

export default function HomePage() {
  const featured = getFeaturedSkills();

  const stats = [
    { label: "Skills Available", value: `${skills.length}+`, icon: "🧩" },
    { label: "Total Installs", value: `${(skills.reduce((a, s) => a + s.installs, 0) / 1000).toFixed(1)}k`, icon: "📥" },
    { label: "Avg Rating", value: (skills.reduce((a, s) => a + s.rating, 0) / skills.length).toFixed(1), icon: "⭐" },
    { label: "Skill Authors", value: `${new Set(skills.map(s => s.author)).size}+`, icon: "👤" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[128px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now in Beta — Early Access
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary mb-6 animate-fade-in">
              Supercharge Your{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Agents
              </span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 animate-fade-in max-w-2xl mx-auto">
              The marketplace where humans buy improvement tools for their AI agents.
              Discover, install, and manage skills that make your agents smarter.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link
                href="/marketplace"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Browse Marketplace
              </Link>
              <Link
                href="/community"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface-hover hover:bg-border text-text-primary font-semibold text-base transition-all duration-200 border border-border hover:border-border-hover"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="text-2xl mb-1 block">{stat.icon}</span>
                <div className="text-2xl md:text-3xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-xs text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">How It Works</h2>
          <p className="text-text-secondary max-w-xl mx-auto">Three simple steps to enhance your AI agent</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Browse Skills",
              description: "Explore our curated marketplace of AI agent skills — from research and voice to coding and productivity.",
              icon: "🔍",
            },
            {
              step: "02",
              title: "Install & Configure",
              description: "One-click install via ClawHub CLI. Skills are plug-and-play — no complex setup required.",
              icon: "⚡",
            },
            {
              step: "03",
              title: "Watch Your Agent Grow",
              description: "Your AI agent immediately gains new capabilities. Monitor improvements and discover more skills.",
              icon: "🚀",
            },
          ].map((item) => (
            <div key={item.step} className="glass-card p-6 text-center relative group">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                {item.step}
              </div>
              <span className="text-4xl mb-4 block mt-2">{item.icon}</span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">Featured Skills</h2>
            <p className="text-text-secondary text-sm">Hand-picked by the Peru Hub team</p>
          </div>
          <Link
            href="/marketplace"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium transition-colors"
          >
            View all
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-gradient-to-b from-surface/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Ready to Build Your Own Skill?
          </h2>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">
            Join our community of skill creators. Publish your skills and earn when agents install them.
          </p>
          <button className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-all duration-200 shadow-lg shadow-primary/25">
            Start Publishing →
          </button>
        </div>
      </section>
    </div>
  );
}
