import Link from "next/link";
import { notFound } from "next/navigation";
import { skills, getSkillById, getReviewsBySkillId, getSkillsByCategory } from "@/data/skills";
import { StarRating } from "@/components/SkillCard";
import SkillCard from "@/components/SkillCard";
import AdBanner from "@/components/AdBanner";
import VoiceDemo from "@/components/VoiceDemo";
import { AddToCartButton, AddAndUpgradeButton, InstallFreeButton } from "@/components/SkillDetailClient";

export function generateStaticParams() {
  return skills.map((skill) => ({ id: skill.id }));
}

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = getSkillById(id);

  if (!skill) {
    notFound();
  }

  const reviewsList = getReviewsBySkillId(skill.id);
  const relatedSkills = getSkillsByCategory(skill.category)
    .filter((s) => s.id !== skill.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-text-muted mb-6">
        <Link href="/" className="hover:text-primary">
          Inicio
        </Link>
        <span className="mx-1.5">›</span>
        <Link href="/marketplace" className="hover:text-primary">
          Todas las skills
        </Link>
        <span className="mx-1.5">›</span>
        <span className="text-text-primary font-medium">{skill.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Product header card */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-start gap-5">
              {/* Large icon */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-5xl shrink-0 border border-border">
                {skill.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-xl font-bold text-text-primary">{skill.name}</h1>
                  {skill.isFree && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-100 text-green-700">
                      GRATIS
                    </span>
                  )}
                  {skill.isNew && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700">
                      🆕 NUEVO
                    </span>
                  )}
                  {skill.isFeatured && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700">
                      ⭐ TOP
                    </span>
                  )}
                </div>

                {/* Short description */}
                <p className="text-sm text-primary font-medium mb-2">{skill.shortDescription}</p>

                <div className="flex items-center gap-3 flex-wrap text-xs text-text-muted mb-2">
                  <span>{skill.author}</span>
                  <span>·</span>
                  <span>v{skill.version}</span>
                  <span>·</span>
                  <span>{skill.category}</span>
                </div>

                <div className="flex items-center gap-3">
                  <StarRating rating={skill.rating} />
                  <span className="text-xs text-text-muted">{skill.reviewCount} reseñas</span>
                  <span className="text-xs text-text-muted">·</span>
                  <span className="text-xs text-text-muted">
                    {skill.installCount.toLocaleString()} agentes mejorados
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Features list */}
          {skill.features.length > 0 && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-base font-bold text-text-primary mb-3">✨ Características</h2>
              <ul className="space-y-2.5">
                {skill.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <span className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full description */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-base font-bold text-text-primary mb-3">¿Qué gana tu agente?</h2>
            <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {skill.description}
            </div>
          </div>

          {/* Voice Demo */}
          {skill.category === "Voz y Audio" && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-base font-bold text-text-primary mb-1">🎙️ Escúchalo en acción</h2>
              <p className="text-xs text-text-muted mb-4">
                Así sonará tu agente después de instalar este skill
              </p>
              <VoiceDemo />
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-base font-bold text-text-primary mb-4">
              Reseñas ({reviewsList.length})
            </h2>
            {reviewsList.length > 0 ? (
              <div className="space-y-4">
                {reviewsList.map((review) => (
                  <div
                    key={review.id}
                    className="pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-xs text-primary font-semibold">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-text-primary">
                            {review.author}
                          </span>
                          <div className="mt-0.5">
                            <StarRating rating={review.rating} showValue={false} />
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-text-muted">{review.date}</span>
                    </div>
                    <p className="text-sm text-text-secondary ml-11">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-8">
                Sin reseñas todavía. ¡Instala este skill y sé el primero en opinar!
              </p>
            )}
          </div>

          {/* ===== AD BANNER — Skill Detail ===== */}
          <div className="py-2">
            <AdBanner variant="light" />
          </div>

          {/* Related skills */}
          {relatedSkills.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-text-primary mb-3">
                Más en {skill.category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedSkills.map((s) => (
                  <SkillCard key={s.id} skill={s} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — Buy box */}
        <div className="space-y-4">
          {/* Price & CTA card */}
          <div className="bg-white rounded-xl border border-border p-5 sticky top-36">
            {/* Price */}
            <div className="text-center mb-5 pb-5 border-b border-border">
              {skill.price === 0 ? (
                <div>
                  <span className="text-3xl font-bold text-green-600">Gratis</span>
                  <p className="text-xs text-green-600/70 mt-1">Sin tarjeta de crédito</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-text-primary">
                      ${skill.price.toFixed(2)}
                    </span>
                    {skill.originalPrice && (
                      <span className="text-lg text-text-muted line-through">
                        ${skill.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-1">Pago único · Tuyo para siempre</p>
                  {skill.originalPrice && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
                      {Math.round((1 - skill.price / skill.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* CTA buttons */}
            {skill.price === 0 ? (
              <InstallFreeButton
                skill={{
                  id: skill.id,
                  name: skill.name,
                  icon: skill.icon,
                  author: skill.author,
                  price: skill.price,
                }}
              />
            ) : (
              <>
                <AddAndUpgradeButton
                  skill={{
                    id: skill.id,
                    name: skill.name,
                    icon: skill.icon,
                    author: skill.author,
                    price: skill.price,
                  }}
                />
                <AddToCartButton
                  skill={{
                    id: skill.id,
                    name: skill.name,
                    icon: skill.icon,
                    author: skill.author,
                    price: skill.price,
                  }}
                />
              </>
            )}

            <p className="text-center text-[11px] text-text-muted mt-3">
              {skill.installCount.toLocaleString()} personas ya mejoraron su agente
            </p>

            {/* CLI install */}
            <div className="mt-4 pt-4 border-t border-border text-center">
              <p className="text-[10px] text-text-muted mb-1">O instala por línea de comandos:</p>
              <code className="text-[11px] text-text-muted font-mono bg-gray-50 px-3 py-1.5 rounded-lg border border-border inline-block">
                clawhub install {skill.id}
              </code>
            </div>

            {/* Details */}
            <div className="mt-4 pt-4 border-t border-border space-y-2.5">
              {(
                [
                  ["Versión", skill.version],
                  ["Categoría", skill.category],
                  ["Agentes mejorados", skill.installCount.toLocaleString()],
                  ["Reseñas", skill.reviewCount.toString()],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">{label}</span>
                  <span className="text-xs text-text-primary font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-xs font-bold text-text-primary mb-2 uppercase tracking-wider">
              Etiquetas
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skill.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/marketplace?q=${tag}`}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-text-muted hover:bg-primary-light hover:text-primary transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Author */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-xs font-bold text-text-primary mb-2 uppercase tracking-wider">
              Vendido por
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-xl">
                {skill.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{skill.author}</p>
                <p className="text-[11px] text-text-muted">Creador verificado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
