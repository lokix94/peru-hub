"use client";

import { Suspense, useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import SkillCard from "@/components/SkillCard";
import AdBanner from "@/components/AdBanner";
import {
  skills as builtInSkills,
  CATEGORIES,
  CATEGORY_ICON,
  type Skill,
  getAllSkillsWithDeveloper,
  groupSkillsByCategory,
  countByCategory,
  getFeaturedSkills,
  getNewSkills,
} from "@/data/skills";

interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

type SortOption = "popular" | "newest" | "price-asc" | "price-desc" | "rating";

const sortLabels: Record<SortOption, string> = {
  popular: "Más populares",
  newest: "Más nuevos",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
  rating: "Mejor valorados",
};

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  const priceParam = searchParams.get("price");

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

  // Web search state
  const [webResults, setWebResults] = useState<WebSearchResult[]>([]);
  const [webSearching, setWebSearching] = useState(false);
  const [webSearchDone, setWebSearchDone] = useState(false);

  // Load all skills including developer-submitted ones
  const [allSkills, setAllSkills] = useState<Skill[]>(builtInSkills);

  useEffect(() => {
    setAllSkills(getAllSkillsWithDeveloper());
  }, []);

  // Sync URL param → state on mount and param change
  useEffect(() => {
    if (categoryParam) {
      // Check if it matches a known category
      const match = CATEGORIES.find((c) => c.key === categoryParam);
      if (match) {
        setActiveCategory(match.key);
      } else {
        setActiveCategory("All");
      }
    } else {
      setActiveCategory("All");
    }
  }, [categoryParam]);

  useEffect(() => {
    if (priceParam === "free") {
      setPriceFilter("free");
    }
  }, [priceParam]);

  // Navigate to a category
  const selectCategory = useCallback(
    (cat: string) => {
      setActiveCategory(cat);
      if (cat === "All") {
        router.push("/marketplace", { scroll: false });
      } else {
        router.push(`/marketplace?category=${encodeURIComponent(cat)}`, { scroll: false });
      }
    },
    [router],
  );

  // Counts per category
  const categoryCounts = useMemo(() => countByCategory(allSkills), [allSkills]);

  // Filter skills
  const filteredSkills = useMemo(() => {
    let result = activeCategory === "All" ? allSkills : allSkills.filter((s) => s.category === activeCategory);

    if (priceFilter === "free") result = result.filter((s) => s.price === 0);
    if (priceFilter === "paid") result = result.filter((s) => s.price > 0);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (skill) =>
          skill.name.toLowerCase().includes(q) ||
          skill.shortDescription.toLowerCase().includes(q) ||
          skill.description.toLowerCase().includes(q) ||
          skill.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [activeCategory, allSkills, searchQuery, priceFilter]);

  // Sort skills
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

  // Group skills by category for "Todas" view
  const grouped = useMemo(() => groupSkillsByCategory(sortedSkills), [sortedSkills]);

  // Trigger web search when local results are few and there's a search query
  useEffect(() => {
    setWebResults([]);
    setWebSearchDone(false);

    if (!searchQuery || searchQuery.trim().length < 3) return;
    if (sortedSkills.length > 5) return; // enough local results

    const timer = setTimeout(async () => {
      setWebSearching(true);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery.trim() }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setWebResults(data.results || []);
          }
        }
      } catch {
        // silent fail
      } finally {
        setWebSearching(false);
        setWebSearchDone(true);
      }
    }, 800); // debounce

    return () => clearTimeout(timer);
  }, [searchQuery, sortedSkills.length]);

  const showFeaturedSection = activeCategory === "All" && !searchQuery && priceFilter === "all";
  const featured = getFeaturedSkills();
  const newSkills = getNewSkills();

  // Determine active category label
  const activeCategoryLabel =
    activeCategory === "All"
      ? "🛒 Todas las herramientas"
      : `${CATEGORY_ICON[activeCategory] || ""} ${activeCategory}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-text-muted mb-4">
        <Link href="/" className="hover:text-primary cursor-pointer">Inicio</Link>
        <span className="mx-1.5">›</span>
        {activeCategory === "All" ? (
          <span className="text-text-primary font-medium">Todas las herramientas</span>
        ) : (
          <>
            <Link href="/marketplace" className="hover:text-primary cursor-pointer">Marketplace</Link>
            <span className="mx-1.5">›</span>
            <span className="text-text-primary font-medium">{activeCategory}</span>
          </>
        )}
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

      {/* ===== AD BANNER — Marketplace ===== */}
      <div className="mb-6">
        <AdBanner variant="light" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="lg:w-60 shrink-0">
          <div className="bg-white rounded-xl border border-border p-4 sticky top-36">
            <h3 className="text-sm font-bold text-text-primary mb-3">Categorías</h3>
            <div className="space-y-0.5">
              {/* "Todas" button */}
              <button
                onClick={() => selectCategory("All")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                  activeCategory === "All"
                    ? "bg-primary-light text-primary font-medium"
                    : "text-text-secondary hover:bg-gray-50 hover:text-text-primary"
                }`}
              >
                <span className="truncate">🛒 Todas</span>
                <span className="text-xs text-text-muted bg-gray-100 px-1.5 py-0.5 rounded-full ml-1">
                  {allSkills.length}
                </span>
              </button>

              {/* Category buttons with counts */}
              {CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.key] || 0;
                return (
                  <button
                    key={cat.key}
                    onClick={() => selectCategory(cat.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      activeCategory === cat.key
                        ? "bg-primary-light text-primary font-medium"
                        : "text-text-secondary hover:bg-gray-50 hover:text-text-primary"
                    }`}
                  >
                    <span className="truncate">
                      {cat.icon} {cat.key}
                    </span>
                    <span className="text-xs text-text-muted bg-gray-100 px-1.5 py-0.5 rounded-full ml-1">
                      {count}
                    </span>
                  </button>
                );
              })}
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
              <h1 className="text-xl font-bold text-text-primary">{activeCategoryLabel}</h1>
              <p className="text-xs text-text-muted mt-0.5">
                {sortedSkills.length} herramienta{sortedSkills.length !== 1 ? "s" : ""} disponible
                {sortedSkills.length !== 1 ? "s" : ""}
                {searchQuery && <span> para &quot;{searchQuery}&quot;</span>}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar herramientas..."
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

          {/* Category-grouped display */}
          {sortedSkills.length > 0 ? (
            activeCategory === "All" && !searchQuery ? (
              // ===== GROUPED BY CATEGORY =====
              <div className="space-y-10">
                {CATEGORIES.map((cat) => {
                  const catSkills = grouped.get(cat.key) || [];
                  if (catSkills.length === 0) return null;
                  return (
                    <section key={cat.key}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-text-primary">
                            {cat.icon} {cat.key}
                          </h2>
                          <span className="text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">
                            {catSkills.length} herramienta{catSkills.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <button
                          onClick={() => selectCategory(cat.key)}
                          className="text-sm text-primary hover:text-primary-hover font-medium"
                        >
                          Ver todas →
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {catSkills.map((skill) => (
                          <SkillCard key={skill.id} skill={skill} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              // ===== SINGLE CATEGORY or SEARCH RESULTS =====
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {sortedSkills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            )
          ) : (
            // ===== EMPTY STATE =====
            <div className="text-center py-20 bg-white rounded-xl border border-border">
              <span className="text-5xl mb-4 block">🔍</span>
              {searchQuery ? (
                <>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    No se encontraron herramientas
                  </h3>
                  <p className="text-text-muted text-sm">Intenta con otra búsqueda o categoría</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    No hay herramientas en esta categoría todavía
                  </h3>
                  <p className="text-text-muted text-sm mb-4">
                    ¿Eres desarrollador? ¡Crea la primera!
                  </p>
                  <Link
                    href="/developers/nueva-skill"
                    className="inline-block px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-full text-sm transition-colors"
                  >
                    🛠️ Crear herramienta →
                  </Link>
                </>
              )}
            </div>
          )}

          {/* ===== WEB SEARCH RESULTS ===== */}
          {searchQuery && searchQuery.trim().length >= 3 && (
            <div className="mt-8">
              {webSearching && (
                <div className="flex items-center gap-3 py-6 justify-center">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-text-muted">Buscando en la web...</span>
                </div>
              )}

              {webSearchDone && webResults.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">🌐</span>
                    <h3 className="text-base font-bold text-text-primary">
                      Resultados web relacionados
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                      Google
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mb-4">
                    No encontramos suficientes herramientas locales para &quot;{searchQuery}&quot;. Estos resultados web podrían ayudarte:
                  </p>
                  <div className="space-y-3">
                    {webResults.map((result, idx) => (
                      <a
                        key={idx}
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white rounded-lg border border-blue-100 p-4 hover:border-primary hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-primary group-hover:text-primary-hover transition-colors line-clamp-1">
                              {result.title}
                            </h4>
                            <p className="text-[11px] text-text-muted mt-1 line-clamp-2">
                              {result.snippet}
                            </p>
                            <p className="text-[10px] text-blue-500 mt-1.5 truncate">
                              {result.url}
                            </p>
                          </div>
                          <svg className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between">
                    <p className="text-[10px] text-text-muted">
                      Resultados proporcionados por Google vía Serper
                    </p>
                    <Link
                      href="/developers/nueva-skill"
                      className="text-[11px] text-primary hover:text-primary-hover font-semibold"
                    >
                      ¿No encuentras lo que buscas? Créalo →
                    </Link>
                  </div>
                </div>
              )}

              {webSearchDone && webResults.length === 0 && !webSearching && sortedSkills.length === 0 && (
                <p className="text-center text-xs text-text-muted py-4">
                  Tampoco se encontraron resultados web para esta búsqueda.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function MarketplaceLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-48" />
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<MarketplaceLoading />}>
      <MarketplaceContent />
    </Suspense>
  );
}
