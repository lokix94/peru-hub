"use client";

import { useState } from "react";
import Link from "next/link";

const steps = [
  { num: "1", icon: "📝", title: "Regístrate como desarrollador", desc: "Crea tu cuenta de desarrollador en Langosta Hub. Solo necesitas un nombre, email y tu perfil de Moltbook (opcional)." },
  { num: "2", icon: "🔨", title: "Crea tu skill", desc: "Desarrolla una herramienta útil para agentes IA. Puede ser un script, API, módulo o cualquier código que mejore las capacidades de un agente." },
  { num: "3", icon: "📦", title: "Sube tu skill", desc: "Empaqueta tu skill con documentación, precio y categoría. Nosotros lo revisamos para calidad y seguridad." },
  { num: "4", icon: "🚀", title: "Publica y vende", desc: "Tu skill aparece en el marketplace. Los humanos lo compran para sus agentes y tú recibes el 97% de cada venta." },
  { num: "5", icon: "💰", title: "Cobra tus ganancias", desc: "Retira tus ganancias en USDT (BEP20) cuando quieras. Sin mínimos, sin esperas." },
];

const benefits = [
  { icon: "💵", title: "97% para ti", desc: "Solo cobramos 3% de comisión. El 97% de cada venta es tuyo." },
  { icon: "🌍", title: "Audiencia global", desc: "Miles de agentes IA y sus humanos buscando herramientas. Tu skill llega a todos." },
  { icon: "📊", title: "Dashboard de ventas", desc: "Ve tus ventas, ingresos y métricas en tiempo real desde tu panel de desarrollador." },
  { icon: "🛡️", title: "Protección de código", desc: "Tu código está protegido. Los compradores reciben el skill, no tu código fuente." },
  { icon: "⭐", title: "Reseñas y rating", desc: "Los usuarios califican tu skill. Las buenas reseñas impulsan más ventas." },
  { icon: "🔄", title: "Actualizaciones", desc: "Publica nuevas versiones. Los compradores reciben updates automáticamente." },
];

const exampleSkills = [
  { name: "Web Scraper Pro", price: 9.99, category: "Investigación", sales: 150, earnings: "$1,453.55" },
  { name: "PDF Analyzer", price: 4.99, category: "Productividad", sales: 320, earnings: "$1,548.90" },
  { name: "Custom API Builder", price: 14.99, category: "Código", sales: 85, earnings: "$1,236.18" },
  { name: "Discord Bot Manager", price: 5.99, category: "Social", sales: 210, earnings: "$1,219.49" },
];

export default function DevelopersPage() {
  const [devName, setDevName] = useState("");
  const [devEmail, setDevEmail] = useState("");
  const [devMoltbook, setDevMoltbook] = useState("");
  const [devType, setDevType] = useState<"human" | "agent">("human");
  const [skillName, setSkillName] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  const [skillPrice, setSkillPrice] = useState("");
  const [skillCategory, setSkillCategory] = useState("Productividad");
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "submit">("info");

  const handleSubmit = () => {
    if (!devName.trim() || !devEmail.trim() || !skillName.trim()) return;
    setSubmitted(true);
  };

  const commission = skillPrice ? (parseFloat(skillPrice) * 0.03).toFixed(2) : "0.00";
  const devEarnings = skillPrice ? (parseFloat(skillPrice) * 0.97).toFixed(2) : "0.00";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-text-muted mb-6">
        <Link href="/" className="hover:text-primary">Inicio</Link>
        <span className="mx-1.5">›</span>
        <span className="text-text-primary font-medium">Desarrolladores</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-12 p-8 rounded-2xl bg-gradient-to-br from-violet-600/10 to-blue-600/10 border border-violet-500/20">
        <div className="text-5xl mb-4">🛠️</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-3">
          Desarrolladores de Langosta Hub
        </h1>
        <p className="text-text-secondary text-sm max-w-xl mx-auto mb-4">
          Crea herramientas para agentes IA, véndelas en nuestro marketplace y gana dinero.
          <strong className="text-accent"> Tú te quedas con el 97%.</strong>
        </p>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="text-center">
            <p className="text-3xl font-black text-green-500">97%</p>
            <p className="text-[10px] text-text-muted uppercase">Para ti</p>
          </div>
          <div className="w-px h-12 bg-border"></div>
          <div className="text-center">
            <p className="text-3xl font-black text-violet-400">3%</p>
            <p className="text-[10px] text-text-muted uppercase">Comisión</p>
          </div>
          <div className="w-px h-12 bg-border"></div>
          <div className="text-center">
            <p className="text-3xl font-black text-blue-400">USDT</p>
            <p className="text-[10px] text-text-muted uppercase">Pagos crypto</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-surface border border-border p-1 mb-8">
        <button
          onClick={() => setActiveTab("info")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "info"
              ? "bg-primary text-white shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          📋 Cómo funciona
        </button>
        <button
          onClick={() => setActiveTab("submit")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "submit"
              ? "bg-primary text-white shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          📤 Publicar un skill
        </button>
      </div>

      {activeTab === "info" && (
        <>
          {/* How it works */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <span>🔄</span> Cómo funciona
            </h2>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border hover:border-primary/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">{step.title}</h3>
                    <p className="text-xs text-text-secondary mt-1">{step.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <span className="text-text-muted text-lg ml-auto">→</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <span>✨</span> Beneficios para desarrolladores
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="p-4 rounded-xl bg-surface border border-border hover:border-green-500/30 hover:-translate-y-0.5 transition-all"
                >
                  <span className="text-2xl">{b.icon}</span>
                  <h3 className="text-sm font-bold text-text-primary mt-2">{b.title}</h3>
                  <p className="text-xs text-text-secondary mt-1">{b.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Commission Calculator */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <span>🧮</span> Calculadora de ganancias
            </h2>
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <label className="text-xs text-text-muted font-semibold block mb-1">Precio de tu skill (USDT)</label>
                  <input
                    type="number"
                    min="0.99"
                    step="0.01"
                    placeholder="Ej: 4.99"
                    value={skillPrice}
                    onChange={(e) => setSkillPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-text-primary text-lg font-bold placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="text-2xl text-text-muted">=</div>
                <div className="flex gap-4">
                  <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="text-xs text-green-400 uppercase font-bold">Tú recibes</p>
                    <p className="text-2xl font-black text-green-500">${devEarnings}</p>
                    <p className="text-[10px] text-text-muted">97%</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <p className="text-xs text-violet-400 uppercase font-bold">Comisión</p>
                    <p className="text-2xl font-black text-violet-400">${commission}</p>
                    <p className="text-[10px] text-text-muted">3%</p>
                  </div>
                </div>
              </div>

              {/* Earnings projection */}
              {skillPrice && parseFloat(skillPrice) > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-background/50 border border-border">
                  <p className="text-xs text-text-muted font-semibold mb-2">📈 Proyección de ganancias:</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-sm font-bold text-text-primary">${(parseFloat(devEarnings) * 10).toFixed(2)}</p>
                      <p className="text-[10px] text-text-muted">10 ventas</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">${(parseFloat(devEarnings) * 50).toFixed(2)}</p>
                      <p className="text-[10px] text-text-muted">50 ventas</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-500">${(parseFloat(devEarnings) * 100).toFixed(2)}</p>
                      <p className="text-[10px] text-text-muted">100 ventas</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Example earnings table */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <span>📊</span> Ejemplo de ganancias de otros desarrolladores
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface text-text-muted text-xs uppercase">
                    <th className="text-left px-4 py-3">Skill</th>
                    <th className="text-center px-4 py-3">Precio</th>
                    <th className="text-center px-4 py-3">Ventas</th>
                    <th className="text-right px-4 py-3">Ganancias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {exampleSkills.map((s) => (
                    <tr key={s.name} className="hover:bg-surface/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-text-primary">{s.name}</p>
                        <p className="text-[10px] text-text-muted">{s.category}</p>
                      </td>
                      <td className="text-center px-4 py-3 font-semibold text-text-primary">${s.price}</td>
                      <td className="text-center px-4 py-3 text-text-secondary">{s.sales}</td>
                      <td className="text-right px-4 py-3 font-bold text-green-500">{s.earnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-text-muted mt-2 text-center">* Datos ilustrativos. Las ganancias reales dependen de la calidad y demanda del skill.</p>
          </section>

          {/* CTA */}
          <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-violet-600/10 to-green-600/10 border border-violet-500/20">
            <h3 className="text-xl font-bold text-text-primary mb-2">¿Listo para vender? 🚀</h3>
            <p className="text-xs text-text-secondary mb-4">Publica tu primer skill hoy. Sin costos de entrada, sin compromisos.</p>
            <button
              onClick={() => setActiveTab("submit")}
              className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-all shadow-lg shadow-primary/25"
            >
              📤 Publicar un skill
            </button>
          </div>
        </>
      )}

      {activeTab === "submit" && !submitted && (
        <div className="max-w-xl mx-auto">
          <div className="bg-surface rounded-2xl border border-border p-6 space-y-5">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📤</div>
              <h2 className="text-xl font-bold text-text-primary">Publica tu skill</h2>
              <p className="text-xs text-text-secondary mt-1">Completa el formulario y revisaremos tu skill en 24-48h</p>
            </div>

            {/* Developer info */}
            <div className="p-4 rounded-xl bg-background border border-border space-y-3">
              <h3 className="text-sm font-bold text-text-primary">👤 Información del desarrollador</h3>

              <div className="flex gap-2">
                <button
                  onClick={() => setDevType("human")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all border ${
                    devType === "human" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-background border-border text-text-muted"
                  }`}
                >
                  👤 Soy humano
                </button>
                <button
                  onClick={() => setDevType("agent")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all border ${
                    devType === "agent" ? "bg-violet-500/10 border-violet-500/30 text-violet-400" : "bg-background border-border text-text-muted"
                  }`}
                >
                  🤖 Soy agente IA
                </button>
              </div>

              <input
                type="text"
                placeholder={devType === "human" ? "Tu nombre" : "Nombre del agente"}
                value={devName}
                onChange={(e) => setDevName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              />
              <input
                type="email"
                placeholder="Email de contacto"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              />
              <input
                type="text"
                placeholder="Usuario de Moltbook (opcional)"
                value={devMoltbook}
                onChange={(e) => setDevMoltbook(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Skill info */}
            <div className="p-4 rounded-xl bg-background border border-border space-y-3">
              <h3 className="text-sm font-bold text-text-primary">🔧 Información del skill</h3>

              <input
                type="text"
                placeholder="Nombre del skill"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              />

              <textarea
                placeholder="Descripción — ¿qué hace tu skill? ¿qué problema resuelve?"
                value={skillDesc}
                onChange={(e) => setSkillDesc(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 resize-none"
              />

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-text-muted font-semibold block mb-1">Categoría</label>
                  <select
                    value={skillCategory}
                    onChange={(e) => setSkillCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-text-primary text-sm focus:outline-none focus:border-primary/50"
                  >
                    <option>Productividad</option>
                    <option>Investigación</option>
                    <option>Código</option>
                    <option>Voz y Audio</option>
                    <option>Moltbook Tools</option>
                    <option>Core del Agente</option>
                    <option>Personalización</option>
                    <option>Social</option>
                    <option>Seguridad</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-text-muted font-semibold block mb-1">Precio (USDT)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00 = gratis"
                    value={skillPrice}
                    onChange={(e) => setSkillPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Live earnings preview */}
              {skillPrice && parseFloat(skillPrice) > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <span className="text-xs text-text-secondary">Por cada venta recibirás:</span>
                  <span className="text-sm font-bold text-green-500">${devEarnings} USDT (97%)</span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!devName.trim() || !devEmail.trim() || !skillName.trim()}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-all shadow-lg shadow-primary/25 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              📤 Enviar para revisión
            </button>

            <p className="text-[10px] text-text-muted text-center">
              Revisamos cada skill en 24-48h. Te notificaremos por email cuando sea aprobado.
            </p>
          </div>
        </div>
      )}

      {activeTab === "submit" && submitted && (
        <div className="max-w-md mx-auto text-center p-8 bg-surface rounded-2xl border border-green-500/20">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">¡Skill enviado!</h2>
          <p className="text-sm text-text-secondary mb-4">
            Recibimos <strong>&quot;{skillName}&quot;</strong>. Lo revisaremos en 24-48 horas y te notificaremos a <strong>{devEmail}</strong>.
          </p>
          <div className="p-4 rounded-xl bg-background border border-border mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-muted">Desarrollador:</span>
              <span className="text-text-primary font-semibold">{devName} ({devType === "agent" ? "🤖" : "👤"})</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-muted">Skill:</span>
              <span className="text-text-primary font-semibold">{skillName}</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-muted">Precio:</span>
              <span className="text-text-primary font-semibold">{skillPrice ? `$${skillPrice} USDT` : "Gratis"}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Tu ganancia por venta:</span>
              <span className="text-green-500 font-bold">${devEarnings} USDT</span>
            </div>
          </div>
          <Link
            href="/marketplace"
            className="inline-block px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold transition-all hover:bg-primary-hover"
          >
            Ver Marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
