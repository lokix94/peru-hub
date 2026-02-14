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
      case "popular": return b.installs - a.installs;
      case "rating": return b.rating - a.rating;
      case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "price": return a.price - b.price;
      default: return 0;
    }
  });

  const categoryLabels: Record<string, string> = {
    "All": "🛒 Todas las skills",
    "Research": "🔍 Investigación",
    "Voice": "🎤 Voz y Audio",
    "Development": "💻 Código",
    "Utilities": "🌤️ Utilidades",
    "Agent Core": "🧠 Core del Agente",
    "Productivity": "📧 Productividad",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-text-muted mb-4">
        <span className="hover:text-primary cursor-pointer">Inicio</span>
        <span className="mx-1.5">›</span>
        <span className="text-text-primary font-medium">Todas las skills</span>
      </nav>

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
                  <span>{categoryLabels[cat.name] || cat.name}</span>
                  <span className="text-xs text-text-muted bg-gray-100 px-1.5 py-0.5 rounded-full">{cat.count}</span>
                </button>
              ))}
            </div>

            {/* Price filter */}
            <div className="mt-5 pt-4 border-t border-border">
              <h3 className="text-sm font-bold text-text-primary mb-3">Precio</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                  <input type="radio" name="price" defaultChecked className="accent-primary" />
                  Todos
                </label>
                <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                  <input type="radio" name="price" className="accent-primary" />
                  <span className="flex items-center gap-1">Gratis <span className="text-[10px] text-green-600 font-bold">FREE</span></span>
                </label>
                <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                  <input type="radio" name="price" className="accent-primary" />
                  De pago
                </label>
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
                {sortedSkills.length} skill{sortedSkills.length !== 1 ? "s" : ""} disponible{sortedSkills.length !== 1 ? "s" : ""}
                {searchQuery && <span> para &quot;{searchQuery}&quot;</span>}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar en esta categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 sm:w-56 px-3 py-2 rounded-lg bg-white border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 rounded-lg bg-white border border-border text-text-secondary text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="popular">Más populares</option>
                <option value="rating">Mejor valorados</option>
                <option value="newest">Más nuevos</option>
                <option value="price">Precio: menor a mayor</option>
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
              <h3 className="text-lg font-semibold text-text-primary mb-2">No se encontraron skills</h3>
              <p className="text-text-muted text-sm">Intenta con otra búsqueda o categoría</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
