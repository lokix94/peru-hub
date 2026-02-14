import Link from "next/link";
import { notFound } from "next/navigation";
import { skills, getSkillById, getReviewsBySkillId } from "@/data/skills";
import { StarRating } from "@/components/SkillCard";
import VoiceDemo from "@/components/VoiceDemo";

export function generateStaticParams() {
  return skills.map((skill) => ({ id: skill.id }));
}

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = getSkillById(id);

  if (!skill) {
    notFound();
  }

  const reviews = getReviewsBySkillId(skill.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <Link href="/marketplace" className="hover:text-text-primary transition-colors">
          Marketplace
        </Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-text-secondary">{skill.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="glass-card p-6">
            <div className="flex items-start gap-4">
              <span className="text-5xl">{skill.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-text-primary">{skill.name}</h1>
                  {skill.featured && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                      FEATURED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span>{skill.authorAvatar}</span>
                    <span className="text-sm text-text-secondary">{skill.author}</span>
                  </div>
                  <span className="text-text-muted">·</span>
                  <span className="text-sm text-text-muted">v{skill.version}</span>
                  <span className="text-text-muted">·</span>
                  <span className="text-sm text-text-muted">{skill.category}</span>
                </div>
                <div className="flex items-center gap-4">
                  <StarRating rating={skill.rating} />
                  <span className="text-sm text-text-muted">{skill.reviews} reviews</span>
                  <span className="text-sm text-text-muted">{skill.installs.toLocaleString()} installs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">About This Skill</h2>
            <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {skill.longDescription}
            </div>
          </div>

          {/* Voice Demo (for voice skills) */}
          {skill.category === "Voice" && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">🎙️ Voice Demo</h2>
              <VoiceDemo />
            </div>
          )}

          {/* Demo Area (for skills with demos) */}
          {skill.demoAvailable && skill.category !== "Voice" && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Try It Out</h2>
              <div className="rounded-xl bg-background border border-border p-8 text-center">
                <span className="text-4xl mb-3 block">🧪</span>
                <p className="text-sm text-text-muted mb-4">
                  Interactive demo coming soon. Install the skill to try it with your agent.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-text-muted text-sm font-mono">
                  <span className="text-primary">$</span> clawhub install {skill.id}
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-text-primary">
                Reviews ({reviews.length})
              </h2>
            </div>
            {reviews.length > 0 ? (
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-5 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm text-primary font-semibold">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-text-primary">{review.author}</span>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} />
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-text-muted">{review.date}</span>
                    </div>
                    <p className="text-sm text-text-secondary ml-11">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-8">
                No reviews yet. Be the first to review this skill!
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Install Card */}
          <div className="glass-card p-6 sticky top-24 animate-pulse-glow">
            <div className="text-center mb-6">
              <span className={`text-3xl font-bold ${skill.price === 0 ? "text-success" : "text-text-primary"}`}>
                {skill.price === 0 ? "Free" : `$${skill.price.toFixed(2)}`}
              </span>
              {skill.price > 0 && (
                <p className="text-xs text-text-muted mt-1">One-time purchase</p>
              )}
            </div>

            <button className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl mb-3">
              {skill.price === 0 ? "Install Free" : "Buy & Install"}
            </button>

            <div className="text-center">
              <span className="text-xs text-text-muted font-mono bg-background px-3 py-1.5 rounded-lg border border-border inline-block">
                clawhub install {skill.id}
              </span>
            </div>

            <div className="mt-6 pt-6 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Version</span>
                <span className="text-sm text-text-secondary">{skill.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Published</span>
                <span className="text-sm text-text-secondary">{skill.createdAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Category</span>
                <span className="text-sm text-text-secondary">{skill.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Installs</span>
                <span className="text-sm text-text-secondary">{skill.installs.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/marketplace?q=${tag}`}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-border/50 text-text-muted hover:text-text-secondary hover:bg-border transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Author */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Author</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                {skill.authorAvatar}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{skill.author}</p>
                <p className="text-xs text-text-muted">Skill Creator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
