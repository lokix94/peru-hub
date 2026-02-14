"use client";

import { useState } from "react";
import { skills } from "@/data/skills";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface DemoResult {
  skill?: string;
  title?: string;
  data?: any;
  error?: string;
}

export default function SkillTester() {
  const [results, setResults] = useState<Record<string, DemoResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [testingAll, setTestingAll] = useState(false);

  const runDemo = async (skillId: string) => {
    setLoading((prev) => ({ ...prev, [skillId]: true }));
    try {
      const res = await fetch(`/api/skill-demo?skill=${skillId}`);
      const data = await res.json();
      if (data.error) {
        setResults((prev) => ({ ...prev, [skillId]: { error: data.error } }));
      } else {
        setResults((prev) => ({ ...prev, [skillId]: data }));
      }
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [skillId]: { error: err instanceof Error ? err.message : "Error de conexión" },
      }));
    }
    setLoading((prev) => ({ ...prev, [skillId]: false }));
  };

  const runAll = async () => {
    setTestingAll(true);
    for (const skill of skills) {
      await runDemo(skill.id);
    }
    setTestingAll(false);
  };

  const testedCount = Object.keys(results).length;
  const passedCount = Object.values(results).filter((r) => !r.error).length;
  const failedCount = Object.values(results).filter((r) => r.error).length;

  const getStatus = (skillId: string): "idle" | "loading" | "pass" | "fail" => {
    if (loading[skillId]) return "loading";
    if (!results[skillId]) return "idle";
    return results[skillId].error ? "fail" : "pass";
  };

  const statusIcon = (s: ReturnType<typeof getStatus>) => {
    switch (s) {
      case "idle":
        return "⬜";
      case "loading":
        return "⏳";
      case "pass":
        return "✅";
      case "fail":
        return "❌";
    }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-[#13131d] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">🧪 Probar Herramientas</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ejecuta demos de todas las skills del marketplace ({skills.length} skills)
          </p>
        </div>
        <div className="flex items-center gap-3">
          {testedCount > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-400">✅ {passedCount}</span>
              {failedCount > 0 && <span className="text-red-400">❌ {failedCount}</span>}
              <span className="text-slate-500">/ {skills.length}</span>
            </div>
          )}
          <button
            onClick={runAll}
            disabled={testingAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border border-violet-500/20 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {testingAll ? (
              <>
                <span className="animate-spin">⏳</span>
                Probando...
              </>
            ) : (
              <>🚀 Probar Todos</>
            )}
          </button>
        </div>
      </div>

      {/* Skills list */}
      <div className="divide-y divide-white/5">
        {skills.map((skill) => {
          const status = getStatus(skill.id);
          const isExpanded = expanded === skill.id;
          const result = results[skill.id];

          return (
            <div key={skill.id} className="group">
              {/* Skill row */}
              <div className="flex items-center gap-3 px-6 py-3 hover:bg-white/[0.02] transition-colors">
                {/* Status icon */}
                <span className="text-base w-6 text-center shrink-0">
                  {status === "loading" ? (
                    <span className="animate-spin inline-block">⏳</span>
                  ) : (
                    statusIcon(status)
                  )}
                </span>

                {/* Skill icon */}
                <span className="text-xl shrink-0">{skill.icon}</span>

                {/* Name & category */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{skill.name}</p>
                  <p className="text-[10px] text-slate-500">{skill.category}</p>
                </div>

                {/* Price */}
                <span className="text-xs font-semibold text-emerald-400 shrink-0 w-14 text-right">
                  {skill.price === 0 ? "Gratis" : `$${skill.price.toFixed(2)}`}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => runDemo(skill.id)}
                    disabled={loading[skill.id]}
                    className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-wait"
                  >
                    {loading[skill.id] ? "⏳..." : "▶ Probar"}
                  </button>
                  {result && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : skill.id)}
                      className="px-2 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 text-xs transition-colors"
                    >
                      {isExpanded ? "▲" : "▼"}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded result */}
              {isExpanded && result && (
                <div className="px-6 pb-4">
                  <div className="ml-9 rounded-xl border border-white/5 bg-white/[0.02] p-4 overflow-x-auto">
                    {result.error ? (
                      <div className="text-sm text-red-400">
                        ❌ Error: {result.error}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {result.title && (
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-slate-200">{result.title}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 animate-pulse">
                              EN VIVO
                            </span>
                          </div>
                        )}
                        {result.data && (
                          <pre className="text-[11px] text-slate-400 font-mono whitespace-pre-wrap break-words max-h-80 overflow-y-auto leading-relaxed">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary footer */}
      {testedCount > 0 && (
        <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {testedCount} de {skills.length} probados
            </p>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-emerald-400">✅ {passedCount} exitosos</span>
              {failedCount > 0 && <span className="text-red-400">❌ {failedCount} fallidos</span>}
              {testedCount === skills.length && failedCount === 0 && (
                <span className="text-emerald-400 font-bold animate-pulse">🎉 Todas las pruebas pasaron</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
