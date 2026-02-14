"use client";

import React from "react";

/**
 * Inline ad banner — same size everywhere (728×90 leaderboard style).
 * Placeholder slot showing "Espacio Publicitario" with contact link.
 *
 * Props:
 *   variant  — "light" for white-bg pages (marketplace, landing, skill detail)
 *              "dark"  for dark-bg pages (community)
 *   className — extra classes for outer wrapper
 */
export default function AdBanner({
  variant = "light",
  className = "",
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const isLight = variant === "light";

  return (
    <div
      className={`w-full max-w-[728px] mx-auto ${className}`}
    >
      <div
        className={`
          relative flex items-center justify-center gap-4
          w-full h-[90px] rounded-xl border border-dashed
          transition-all duration-300
          ${
            isLight
              ? "border-gray-300 bg-gray-50 hover:border-primary/40 hover:bg-primary-light/40"
              : "border-white/15 bg-white/[0.04] hover:border-purple-500/30 hover:bg-white/[0.07]"
          }
        `}
      >
        {/* "Ad" label */}
        <span
          className={`absolute top-1 right-2 text-[9px] uppercase tracking-wider select-none ${
            isLight ? "text-gray-400" : "text-white/30"
          }`}
        >
          Publicidad
        </span>

        {/* Content */}
        <span className="text-xl">📢</span>
        <div className="flex flex-col items-center">
          <p
            className={`text-sm font-semibold ${
              isLight ? "text-gray-500" : "text-white/50"
            }`}
          >
            Espacio Publicitario
          </p>
          <p
            className={`text-xs ${
              isLight ? "text-gray-400" : "text-white/35"
            }`}
          >
            Tu anuncio aquí —{" "}
            <a
              href="mailto:jc.aguipuente94@gmail.com"
              className={`underline transition-colors ${
                isLight
                  ? "text-primary hover:text-primary-hover"
                  : "text-purple-400 hover:text-purple-300"
              }`}
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
