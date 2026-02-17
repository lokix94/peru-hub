"use client";

import React from "react";

/**
 * Vertical sidebar with 5 ad slots (160×600-ish skyscraper style).
 * Each slot is a placeholder "Espacio Publicitario" card.
 */

const adSlots = [
  { id: 1, emoji: "📢", color: "from-orange-400 to-red-500" },
  { id: 2, emoji: "🚀", color: "from-blue-400 to-indigo-500" },
  { id: 3, emoji: "⚡", color: "from-emerald-400 to-teal-500" },
  { id: 4, emoji: "🎯", color: "from-violet-400 to-purple-500" },
  { id: 5, emoji: "💡", color: "from-amber-400 to-orange-500" },
];

export default function AdSidebar({ className = "" }: { className?: string }) {
  return (
    <aside className={`hidden lg:flex flex-col gap-4 w-[180px] shrink-0 ${className}`}>
      {adSlots.map((slot) => (
        <div
          key={slot.id}
          className="relative flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:border-primary/40 hover:bg-primary-light/40 transition-all duration-300 p-4"
          style={{ minHeight: "140px" }}
        >
          {/* "Ad" label */}
          <span className="absolute top-1 right-2 text-[8px] uppercase tracking-wider text-gray-400 select-none">
            Ad
          </span>

          {/* Gradient accent bar */}
          <div className={`w-10 h-1 rounded-full bg-gradient-to-r ${slot.color} mb-1`} />

          <span className="text-2xl">{slot.emoji}</span>

          <p className="text-[11px] font-semibold text-gray-500 text-center leading-tight">
            Espacio Publicitario
          </p>
          <a
            href="mailto:jc.aguipuente94@gmail.com"
            className="text-[10px] text-primary hover:text-primary-hover underline transition-colors"
          >
            Contáctanos
          </a>
        </div>
      ))}
    </aside>
  );
}
