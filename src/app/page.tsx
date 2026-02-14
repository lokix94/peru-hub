import Link from "next/link";
import Image from "next/image";
import SkillCard from "@/components/SkillCard";
import { getFeaturedSkills, skills } from "@/data/skills";

export default function HomePage() {
  const featured = getFeaturedSkills();

  const stats = [
    { label: "Skills Available", value: `${skills.length}+`, icon: "🧩" },
    { label: "Agents Upgraded", value: `${(skills.reduce((a, s) => a + s.installs, 0) / 1000).toFixed(1)}k`, icon: "🚀" },
    { label: "Avg Rating", value: (skills.reduce((a, s) => a + s.rating, 0) / skills.length).toFixed(1), icon: "⭐" },
    { label: "Happy Humans", value: `${new Set(skills.map(s => s.author)).size * 200}+`, icon: "😊" },
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
              Now Open — Early Access
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary mb-6 animate-fade-in leading-[1.1]">
              The Upgrade Store for{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Your AI Agent
              </span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 animate-fade-in max-w-2xl mx-auto">
              Browse, buy, and install skills that make your AI agent smarter, faster, and more capable. 
              Think App Store — but for your agent&apos;s brain.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link
                href="/marketplace"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Browse Upgrades
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface-hover hover:bg-border text-text-primary font-semibold text-base transition-all duration-200 border border-border hover:border-border-hover"
              >
                How It Works
              </Link>
            </div>

            {/* Trust line */}
            <p className="mt-8 text-sm text-text-muted animate-fade-in">
              ✓ Free skills available &nbsp;·&nbsp; ✓ Install in one click &nbsp;·&nbsp; ✓ Works with any AI agent
            </p>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="border-2 border-dashed border-border rounded-xl bg-surface/50 py-5 px-6 text-center">
          <p className="text-sm text-text-muted">
            📢 Espacio publicitario — <span className="text-text-secondary font-medium">Advertise Here</span>
          </p>
        </div>
      </section>

      {/* Value Proposition Strip */}
      <section className="border-y border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-center text-text-muted text-sm mb-6 uppercase tracking-wider font-medium">Your agent is good. Make it great.</p>
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

      {/* What Can Your Agent Become? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
            What Can Your Agent Become?
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Each skill unlocks a new ability. Mix and match to build the perfect agent for your life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: "⚖️", title: "A Legal Expert", desc: "Researches law, drafts documents, cites articles", color: "from-blue-500/10 to-blue-600/5" },
            { icon: "🎙️", title: "A Voice That Speaks", desc: "Reads aloud in natural, warm voices", color: "from-purple-500/10 to-purple-600/5" },
            { icon: "🌐", title: "A Fact-Checker", desc: "Verifies info across multiple sources", color: "from-emerald-500/10 to-emerald-600/5" },
            { icon: "🧠", title: "A Perfect Memory", desc: "Remembers everything from past chats", color: "from-amber-500/10 to-amber-600/5" },
          ].map((item) => (
            <div key={item.title} className={`glass-card p-6 text-center bg-gradient-to-b ${item.color}`}>
              <span className="text-4xl mb-3 block">{item.icon}</span>
              <h3 className="text-base font-semibold text-text-primary mb-1.5">{item.title}</h3>
              <p className="text-sm text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-y border-border bg-surface/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              Upgrade Your Agent in 4 Steps
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              It&apos;s as easy as installing an app on your phone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Browse Skills",
                description: "Explore the marketplace. Filter by what you need — research, voice, productivity, and more.",
                icon: "🛒",
              },
              {
                step: "2",
                title: "Choose & Purchase",
                description: "Found one you like? Many are free. Premium skills start at just a few dollars.",
                icon: "💳",
              },
              {
                step: "3",
                title: "Install on Your Agent",
                description: "One click and it's done. The skill gets added to your agent instantly — no tech skills needed.",
                icon: "⚡",
              },
              {
                step: "4",
                title: "Your Agent Levels Up",
                description: "Your agent immediately gains the new ability. Ask it to do things it couldn't do before.",
                icon: "🚀",
              },
            ].map((item) => (
              <div key={item.step} className="glass-card p-6 text-center relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary/30">
                  {item.step}
                </div>
                <span className="text-4xl mb-4 block mt-4">{item.icon}</span>
                <h3 className="text-base font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">Most Popular Upgrades</h2>
            <p className="text-text-secondary text-sm">Top-rated skills that humans love</p>
          </div>
          <Link
            href="/marketplace"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium transition-colors"
          >
            See all upgrades
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

        <div className="text-center mt-10 sm:hidden">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium transition-colors"
          >
            See all upgrades →
          </Link>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-t border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-center text-text-muted text-sm uppercase tracking-wider font-medium mb-10">What people are saying</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "My agent went from clueless about Peruvian law to citing specific constitutional articles. Incredible upgrade.", author: "LegalEagle_Lima", skill: "Peruvian Legal Research" },
              { quote: "My agent can TALK now! The Peruvian accent sounds so natural, my family thought I was on a call with a real person.", author: "PodcasterPE", skill: "Voice: Camila Neural" },
              { quote: "Night and day difference. My agent used to make things up — now it checks multiple sources and shows its work.", author: "DataAnalyst42", skill: "Web Research Pro" },
            ].map((item) => (
              <div key={item.author} className="glass-card p-6">
                <p className="text-sm text-text-secondary leading-relaxed italic mb-4">&ldquo;{item.quote}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">{item.author}</span>
                  <span className="text-xs text-text-muted">on {item.skill}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-b from-background to-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-text-primary mb-4">
            Your Agent Can Be Better.<br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Start upgrading today.</span>
          </h2>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">
            Free skills available. No credit card needed. Just pick a skill and watch your agent grow.
          </p>
          <Link
            href="/marketplace"
            className="inline-block px-10 py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-lg transition-all duration-200 shadow-lg shadow-primary/25 hover:-translate-y-0.5"
          >
            Power Up Your Agent →
          </Link>
        </div>
      </section>
    </div>
  );
}
