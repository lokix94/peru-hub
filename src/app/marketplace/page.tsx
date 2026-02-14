"use client";

import { useState, useMemo } from "react";
import SkillCard from "@/components/SkillCard";
import { skills, categories, getSkillsByCategory, getFeaturedSkills, getNewSkills } from "@/data/skills";

type SortOption = "popular" | "newest" | "price-asc" | "price-desc" | "rating";

const categoryLabels: Record<string, string> = {
  All: "🛒 Todas las skills",
  Investigación: "🔍 Investigación",
  "Core del Agente": "🧠 Core del Agente",
  Productividad: "📧 Productividad",
  "Moltbook Tools": "🦞 Moltbook Tools",
  Utilidades: "🌤️ Utilidades",
  Código: "💻 Código",
  "Voz y Audio": "🎤 Voz y Audio",
  "Legal y Compliance": "⚖️ Legal y Compliance",
};

const sortLabels: Record<SortOption, string> = {
  popular: "Más populares",
  newest: "Más nuevos",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
  rating: "Mejor valorados",
};

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

  const featured = getFeaturedSkills();
  const newSkills = getNewSkills();

  const filteredSkills = useMemo(() => {
    let result = getSkillsByCategory(activeCategory);

    // Price filter
    if (priceFilter === "free") result = result.filter((s) => s.price === 0);
    if (priceFilter === "paid") result = result.filter((s) => s.price > 0);

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (skill) =>
          skill.name.toLowerCase().includes(q) ||
          skill.shortDescription.toLowerCase().includes(q) ||
          skill.description.toLowerCase().includes(q) ||
          skill.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activeCategory, searchQuery, priceFilter]);

  const sortedSkills = useMemo(() => {
    return [...filteredSkills].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.installCount - a.installCount;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [filteredSkills, sortBy]);

  const showFeaturedSection = activeCategory === "All" && !searchQuery && priceFilter === "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-text-muted mb-4">
        <span className="hover:text-primary cursor-pointer">Inicio</span>
        <span className="mx-1.5">›</span>
        <span className="text-text-primary font-medium">Todas las skills</span>
      </nav>

      {/* Featured section (only on "All" with no filters) */}
      {showFeaturedSection && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-text-primary">⭐ Skills destacados</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase">
              Staff Pick
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.slice(0, 4).map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}

      {/* New skills banner (only on "All" with no filters) */}
      {showFeaturedSection && newSkills.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-text-primary">🆕 Recién llegados</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">
              New
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newSkills.slice(0, 4).map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-border p-4 sticky top-36">
            <h3 className="text-sm font-bold text-text-primary mb-3">Categorías</h3>
            <div className="space-y-0.5">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    activeCategory === cat.name
                      ? "bg-primary-light text-primary font-medium"
                      : "text-text-secondary hover:bg-gray-50 hover:text-text-primary"
                  }`}
                >
                  <span className="truncate">{categoryLabels[cat.name] || cat.name}</span>
                  <span className="text-xs text-text-muted bg-gray-100 px-1.5 py-0.5 rounded-full ml-1">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Price filter */}
            <div className="mt-5 pt-4 border-t border-border">
              <h3 className="text-sm font-bold text-text-primary mb-3">Precio</h3>
              <div className="space-y-2">
                {(
                  [
                    ["all", "Todos"],
                    ["free", "Gratis"],
                    ["paid", "De pago"],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === value}
                      onChange={() => setPriceFilter(value)}
                      className="accent-primary"
                    />
                    <span className="flex items-center gap-1">
                      {label}
                      {value === "free" && (
                        <span className="text-[10px] text-green-600 font-bold">FREE</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Header + search + sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                {categoryLabels[activeCategory] || activeCategory}
              </h1>
              <p className="text-xs text-text-muted mt-0.5">
                {sortedSkills.length} skill{sortedSkills.length !== 1 ? "s" : ""} disponible
                {sortedSkills.length !== 1 ? "s" : ""}
                {searchQuery && <span> para &quot;{searchQuery}&quot;</span>}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 sm:w-56 px-3 py-2 rounded-lg bg-white border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 rounded-lg bg-white border border-border text-text-secondary text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {sortedSkills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-border">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No se encontraron skills
              </h3>
              <p className="text-text-muted text-sm">Intenta con otra búsqueda o categoría</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
