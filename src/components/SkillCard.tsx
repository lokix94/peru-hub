import Link from "next/link";
import type { Skill } from "@/data/skills";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating) ? "text-accent" : "text-text-muted/30"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-text-muted ml-1">({rating})</span>
    </div>
  );
}

export default function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link href={`/marketplace/${skill.id}`}>
      <div className="glass-card p-5 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{skill.icon}</span>
            <div>
              <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors text-sm leading-tight">
                {skill.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs">{skill.authorAvatar}</span>
                <span className="text-xs text-text-muted">{skill.author}</span>
              </div>
            </div>
          </div>
          {skill.featured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/10 text-accent border border-accent/20">
              POPULAR
            </span>
          )}
        </div>

        {/* Tagline — the human-friendly value prop */}
        <p className="text-sm font-medium text-primary/80 mb-2">
          {skill.tagline}
        </p>

        {/* Description */}
        <p className="text-xs text-text-secondary leading-relaxed mb-4 flex-1 line-clamp-2">
          {skill.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <StarRating rating={skill.rating} />
            <span className="text-xs text-text-muted">
              {skill.installs.toLocaleString()} agents
            </span>
          </div>
          <span className={`text-sm font-bold ${skill.price === 0 ? "text-success" : "text-text-primary"}`}>
            {skill.price === 0 ? "Free" : `$${skill.price.toFixed(2)}`}
          </span>
        </div>
      </div>
    </Link>
  );
}

export { StarRating };
