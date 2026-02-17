"use client";

import Link from "next/link";
import type { Skill } from "@/data/skills";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

function StarRating({ rating, showValue = true }: { rating: number; showValue?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {showValue && <span className="text-xs text-text-muted ml-1">({rating})</span>}
    </div>
  );
}

export default function SkillCard({ skill, index = 0 }: { skill: Skill; index?: number }) {
  const { addItem, isInCart } = useCart();
  const { t } = useLanguage();
  const inCart = isInCart(skill.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Free skills → go to skill detail page for direct install (no cart)
    if (skill.price === 0) {
      window.location.href = `/marketplace/${skill.id}`;
      return;
    }
    if (!inCart) {
      addItem({
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
        author: skill.author,
        price: skill.price,
      });
    }
  };

  return (
    <Link href={`/marketplace/${skill.id}`}>
      <div className="product-card p-4 h-full flex flex-col cursor-pointer group">
        {/* Icon area */}
        <div className="w-full aspect-[4/3] rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-3 relative overflow-hidden">
          <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{skill.icon}</span>
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {(skill.isFree || skill.price === 0) && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-500 text-white shadow-sm">
                GRATIS
              </span>
            )}
            {skill.isNew && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500 text-white shadow-sm">
                🆕 NUEVO
              </span>
            )}
            {skill.isFeatured && !skill.isNew && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                ⭐ TOP
              </span>
            )}
          </div>
          {/* In-cart indicator */}
          {inCart && (
            <div className="absolute top-2 right-2">
              <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                ✓
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col">
          {/* Author */}
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[11px] text-text-muted">{skill.author}</span>
          </div>

          {/* Name */}
          <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug mb-1">
            {skill.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-text-secondary leading-relaxed mb-3 line-clamp-2 flex-1">
            {skill.shortDescription}
          </p>

          {/* Rating & reviews */}
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={skill.rating} />
            <span className="text-[10px] text-text-muted">
              {skill.reviewCount} {t("reviews")}
            </span>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              {skill.price === 0 ? (
                <span className="text-lg font-bold text-green-600">{t("free")}</span>
              ) : (
                <>
                  <span className="text-lg font-bold text-text-primary">${skill.price.toFixed(2)}</span>
                  {skill.originalPrice && (
                    <span className="text-xs text-text-muted line-through">${skill.originalPrice.toFixed(2)}</span>
                  )}
                </>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-sm ${
                inCart
                  ? "bg-green-500 text-white cursor-default"
                  : "bg-primary hover:bg-primary-hover text-white"
              }`}
            >
              {inCart ? `✓ ${t("added.short")}` : skill.price === 0 ? "⚡ Instalar" : t("add.short")}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export { StarRating };
