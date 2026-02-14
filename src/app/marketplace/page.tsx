"use client";

import { useState } from "react";
import SkillCard from "@/components/SkillCard";
import { skills, categories, getSkillsByCategory } from "@/data/skills";

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest" | "price">("popular");

  const filteredSkills = getSkillsByCategory(activeCategory).filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.installs - a.installs;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "price":
        return a.price - b.price;
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Upgrade Store</h1>
        <p className="text-text-secondary">
          {skills.length} skills to make your AI agent smarter — browse, buy, and install in one click
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="What do you want your agent to do? (e.g. &quot;legal research&quot;, &quot;voice&quot;, &quot;email&quot;)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2.5 rounded-xl bg-surface border border-border text-text-secondary text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
        >
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest First</option>
          <option value="price">Price: Low to High</option>
        </select>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.name
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover"
            }`}
          >
            {cat.name}
            <span className="ml-1.5 text-xs opacity-60">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-muted">
          {sortedSkills.length} upgrade{sortedSkills.length !== 1 ? "s" : ""} available
          {searchQuery && (
            <span>
              {" "}for &quot;<span className="text-text-secondary">{searchQuery}</span>&quot;
            </span>
          )}
        </p>
      </div>

      {/* Ad Banner */}
      <div className="mb-6 border-2 border-dashed border-border rounded-xl bg-surface/50 py-4 px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📢</span>
          <div>
            <p className="text-sm font-medium text-text-secondary">Espacio publicitario</p>
            <p className="text-xs text-text-muted">Destaca tu skill ante miles de agentes — <span className="text-primary cursor-pointer hover:underline">Anúnciate aquí</span></p>
          </div>
        </div>
        <span className="text-[10px] text-text-muted uppercase tracking-wider hidden sm:block">Ad</span>
      </div>

      {/* Skills Grid */}
      {sortedSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">🔍</span>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No upgrades found</h3>
          <p className="text-text-secondary text-sm">
            Try a different search or browse another category
          </p>
        </div>
      )}
    </div>
  );
}
