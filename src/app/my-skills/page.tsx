"use client";

import { useState } from "react";
import Link from "next/link";

interface Skill {
  id: string;
  name: string;
  icon: string;
  version: string;
  status: "active" | "paused";
  type: "installed" | "purchased";
  lastUsed: string;
  usageCount: number;
}

interface PublishedSkill {
  name: string;
  icon: string;
  installs: number;
  rating: number;
  earnings: string;
  status: string;
}

export default function MySkillsPage() {
  // Dynamic data — starts empty for new users, populates as they acquire/create skills
  const [mySkills] = useState<Skill[]>([]);
  const [publishedSkills] = useState<PublishedSkill[]>([]);

  const activeCount = mySkills.filter((s) => s.status === "active").length;
  const totalUsage = mySkills.reduce((sum, s) => sum + s.usageCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-text-muted mb-5">
        <span className="hover:text-primary cursor-pointer">Inicio</span>
        <span className="mx-1.5">›</span>
        <span className="text-text-primary font-medium">Mi agente</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Mi agente</h1>
          <p className="text-xs text-text-muted mt-1">
            {mySkills.length} skills instalados · {activeCount} activos · {totalUsage} usos totales
          </p>
        </div>
        <Link
          href="/marketplace"
          className="px-5 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors shadow-sm"
        >
          + Más upgrades
        </Link>
      </div>

      {/* Installed Skills */}
      <div className="mb-10">
        <h2 className="text-base font-bold text-text-primary mb-3">Skills instalados en tu agente</h2>
        {mySkills.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-8 text-center">
            <div className="text-4xl mb-3">🧩</div>
            <p className="text-sm font-medium text-text-primary mb-1">Aún no tienes skills instalados</p>
            <p className="text-xs text-text-muted mb-4">Explora el marketplace y encuentra upgrades para tu agente</p>
            <Link
              href="/marketplace"
              className="inline-block px-5 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
            >
              Explorar marketplace →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {mySkills.map((skill) => (
              <Link key={skill.id} href={`/marketplace/${skill.id}`}>
                <div className="bg-white rounded-xl border border-border p-4 flex items-center justify-between hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{skill.icon}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">{skill.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-text-muted">v{skill.version}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          skill.type === "purchased"
                            ? "bg-primary-light text-primary"
                            : "bg-gray-100 text-text-muted"
                        }`}>
                          {skill.type === "purchased" ? "COMPRADO" : "GRATIS"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block text-right">
                      <p className="text-[10px] text-text-muted">Último uso</p>
                      <p className="text-xs text-text-secondary">{skill.lastUsed}</p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-[10px] text-text-muted">Usos</p>
                      <p className="text-xs text-text-secondary font-medium">{skill.usageCount}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      skill.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {skill.status === "active" ? "ACTIVO" : "PAUSADO"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Published Skills */}
      <div>
        <h2 className="text-base font-bold text-text-primary mb-3">Skills que creaste</h2>
        {publishedSkills.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-8 text-center">
            <div className="text-4xl mb-3">🛠️</div>
            <p className="text-sm font-medium text-text-primary mb-1">No has creado skills todavía</p>
            <p className="text-xs text-text-muted mb-4">¿Tienes una idea? Crea un skill y compártelo con la comunidad</p>
            <Link
              href="/developers/dashboard"
              className="inline-block px-5 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
            >
              Crear skill →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {publishedSkills.map((skill) => (
              <div key={skill.name} className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="text-2xl">{skill.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{skill.name}</h3>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-700">
                      EN VIVO
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-text-primary">{skill.installs}</p>
                    <p className="text-[10px] text-text-muted">Instalaciones</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-500">{skill.rating}</p>
                    <p className="text-[10px] text-text-muted">Rating</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{skill.earnings}</p>
                    <p className="text-[10px] text-text-muted">Ganado</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
