"use client";

import { useState, useEffect, useCallback } from "react";

const LS_SKILLS_KEY = "langosta-dev-skills";

interface SkillSubmission {
  id: string;
  developerId: string;
  developerName: string;
  developerEmail: string;
  skillName: string;
  description: string;
  category: string;
  price: number;
  repoUrl: string;
  sourceCode: string;
  documentation: string;
  tags: string;
  emoji: string;
  declaracionNombre: string;
  declaracionFecha: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  submittedAt: string;
}

function getSkills(): SkillSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_SKILLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSkills(skills: SkillSubmission[]) {
  try {
    localStorage.setItem(LS_SKILLS_KEY, JSON.stringify(skills));
  } catch { /* ignore */ }
}

export default function SkillReviewQueue() {
  const [skills, setSkills] = useState<SkillSubmission[]>([]);
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const loadSkills = useCallback(() => {
    setSkills(getSkills());
  }, []);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const pendingSkills = skills.filter((s) => s.status === "pending");
  const recentReviewed = skills.filter((s) => s.status !== "pending").slice(-5).reverse();

  function approveSkill(id: string) {
    const updated = skills.map((s) =>
      s.id === id ? { ...s, status: "approved" as const } : s
    );
    saveSkills(updated);
    setSkills(updated);
  }

  function rejectSkill(id: string) {
    const reason = rejectionReasons[id] || "No cumple los requisitos de calidad";
    const updated = skills.map((s) =>
      s.id === id ? { ...s, status: "rejected" as const, rejectionReason: reason } : s
    );
    saveSkills(updated);
    setSkills(updated);
    setShowRejectInput(null);
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-[#13131d] overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">📋 Skills Pendientes de Revisión</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {pendingSkills.length} skill{pendingSkills.length !== 1 ? "s" : ""} esperando revisión
          </p>
        </div>
        <button
          onClick={loadSkills}
          className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
        >
          🔄 Actualizar
        </button>
      </div>

      {pendingSkills.length === 0 ? (
        <div className="px-6 py-12 text-center text-slate-500">
          <p className="text-lg">✅</p>
          <p className="text-sm mt-1">No hay skills pendientes de revisión</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {pendingSkills.map((skill) => (
            <div key={skill.id} className="px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{skill.emoji}</span>
                    <h3 className="text-sm font-bold text-white">{skill.skillName}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-semibold">
                      🟡 Pendiente
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                    <span>👤 {skill.developerName}</span>
                    <span>•</span>
                    <span>📧 {skill.developerEmail}</span>
                    <span>•</span>
                    <span>📅 {new Date(skill.submittedAt).toLocaleDateString("es-PE")}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">{skill.category}</span>
                    <span className="text-xs text-emerald-400 font-semibold">${skill.price.toFixed(2)}</span>
                    <a
                      href={skill.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      📁 Repositorio →
                    </a>
                  </div>

                  {/* Expandable details */}
                  <button
                    onClick={() => setExpandedSkill(expandedSkill === skill.id ? null : skill.id)}
                    className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {expandedSkill === skill.id ? "▼ Ocultar detalles" : "▶ Ver detalles"}
                  </button>

                  {expandedSkill === skill.id && (
                    <div className="mt-3 space-y-2 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <div>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase">Descripción</p>
                        <p className="text-xs text-slate-300 mt-0.5">{skill.description}</p>
                      </div>
                      {skill.tags && (
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">Tags</p>
                          <p className="text-xs text-slate-300 mt-0.5">{skill.tags}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase">Declaración jurada</p>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Firmada por: <strong>{skill.declaracionNombre}</strong> el {skill.declaracionFecha}
                        </p>
                      </div>
                      {skill.documentation && (
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">Documentación</p>
                          <p className="text-xs text-slate-300 mt-0.5 whitespace-pre-wrap">{skill.documentation.slice(0, 500)}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => approveSkill(skill.id)}
                    className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-semibold transition-colors"
                  >
                    ✅ Aprobar
                  </button>
                  <button
                    onClick={() => setShowRejectInput(showRejectInput === skill.id ? null : skill.id)}
                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-xs font-semibold transition-colors"
                  >
                    ❌ Rechazar
                  </button>
                </div>
              </div>

              {/* Rejection reason input */}
              {showRejectInput === skill.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Motivo del rechazo..."
                    value={rejectionReasons[skill.id] || ""}
                    onChange={(e) =>
                      setRejectionReasons((prev) => ({ ...prev, [skill.id]: e.target.value }))
                    }
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-red-500/20 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                  <button
                    onClick={() => rejectSkill(skill.id)}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
                  >
                    Confirmar rechazo
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recently reviewed */}
      {recentReviewed.length > 0 && (
        <div className="px-6 py-4 border-t border-white/5">
          <p className="text-xs text-slate-500 font-semibold mb-2">Revisados recientemente:</p>
          <div className="space-y-1">
            {recentReviewed.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  {skill.emoji} {skill.skillName}
                  <span className="text-slate-500 ml-2">por {skill.developerName}</span>
                </span>
                {skill.status === "approved" ? (
                  <span className="text-emerald-400 font-semibold">🟢 Aprobado</span>
                ) : (
                  <span className="text-red-400 font-semibold" title={skill.rejectionReason}>🔴 Rechazado</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
