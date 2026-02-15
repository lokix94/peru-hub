"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import AdBanner from "@/components/AdBanner";

type CheckoutStep = "cart" | "payment" | "verify-agent" | "installing" | "complete";

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ── Installation simulation steps ── */
const installSteps = [
  { label: "Verificando licencia de compra...", icon: "🔐", duration: 1200 },
  { label: "Descargando skill desde Langosta Hub...", icon: "📦", duration: 1800 },
  { label: "Verificando integridad del paquete...", icon: "🔍", duration: 1000 },
  { label: "Instalando dependencias...", icon: "⚙️", duration: 2000 },
  { label: "Configurando skill en el agente...", icon: "🧠", duration: 1500 },
  { label: "Ejecutando pruebas de compatibilidad...", icon: "✅", duration: 1200 },
  { label: "¡Instalación completa!", icon: "🎉", duration: 800 },
];

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [txId, setTxId] = useState("");
  const [copied, setCopied] = useState(false);
  const [showAgentApi, setShowAgentApi] = useState(false);
  const [apiSnippetCopied, setApiSnippetCopied] = useState(false);

  /* ── Checkout flow state ── */
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [agentName, setAgentName] = useState("");
  const [agentApiKey, setAgentApiKey] = useState("");
  const [agentVerified, setAgentVerified] = useState(false);
  const [agentVerifying, setAgentVerifying] = useState(false);
  const [agentError, setAgentError] = useState("");
  const [installIndex, setInstallIndex] = useState(0);
  const [installProgress, setInstallProgress] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<typeof items>([]);
  const [demoResults, setDemoResults] = useState<Record<string, any>>({});
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [demoExpanded, setDemoExpanded] = useState<string | null>(null);

  const walletAddress = "0xDD49337e6B62C8B0d750CD6F809A84F339a3061e";

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalTotal = items.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );
  const savings = originalTotal - subtotal;
  const couponDiscount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal - couponDiscount;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().length > 0) {
      setCouponApplied(true);
    }
  };

  /* ── Payment confirmed → go to agent verification ── */
  const handlePaymentConfirmed = () => {
    setPurchasedItems([...items]);
    setStep("verify-agent");
  };

  /* ── Agent verification (simulated) ── */
  const handleVerifyAgent = () => {
    if (!agentName.trim()) {
      setAgentError("Ingresa el nombre de tu agente");
      return;
    }
    setAgentError("");
    setAgentVerifying(true);

    setTimeout(() => {
      setAgentVerifying(false);
      if (agentApiKey.trim().startsWith("moltbook_")) {
        setAgentVerified(true);
      } else if (agentApiKey.trim().length > 0) {
        setAgentError("API key inválida. Debe comenzar con 'moltbook_'. También puedes continuar sin verificación.");
      } else {
        // No API key = continue without Moltbook verification
        setAgentVerified(true);
      }
    }, 2000);
  };

  /* ── Installation animation ── */
  useEffect(() => {
    if (step !== "installing") return;
    if (installIndex >= installSteps.length) {
      setTimeout(() => setStep("complete"), 600);
      return;
    }

    const currentStep = installSteps[installIndex];
    // Animate progress bar
    const progressTarget = ((installIndex + 1) / installSteps.length) * 100;
    const progressInterval = setInterval(() => {
      setInstallProgress((prev) => {
        if (prev >= progressTarget) {
          clearInterval(progressInterval);
          return progressTarget;
        }
        return prev + 1;
      });
    }, currentStep.duration / (progressTarget - installProgress || 1));

    const timer = setTimeout(() => {
      setInstallIndex((prev) => prev + 1);
    }, currentStep.duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [step, installIndex]);

  const handleStartInstall = () => {
    setInstallIndex(0);
    setInstallProgress(0);
    setStep("installing");
  };

  /* ── Run skill demo ── */
  const runDemo = async (skillId: string) => {
    setDemoLoading(skillId);
    setDemoExpanded(skillId);
    try {
      const res = await fetch(`/api/skill-demo?skill=${skillId}`);
      const data = await res.json();
      setDemoResults((prev) => ({ ...prev, [skillId]: data }));
    } catch {
      setDemoResults((prev) => ({ ...prev, [skillId]: { error: "Error de conexión" } }));
    }
    setDemoLoading(null);
  };

  /* ── Step: Empty cart ── */
  if (items.length === 0 && step === "cart") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span className="text-6xl mb-6 block">🛒</span>
        <h1 className="text-2xl font-bold text-text-primary mb-3">Tu carrito está vacío</h1>
        <p className="text-text-secondary mb-8">Explora el marketplace y encuentra herramientas para tu agente</p>
        <Link
          href="/marketplace"
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-colors"
        >
          Ir al Marketplace →
        </Link>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     STEP: VERIFY AGENT
     ══════════════════════════════════════════════════════════════ */
  if (step === "verify-agent") {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress bar */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">✓</div>
            <span className="text-xs text-green-500 font-semibold">Pago</span>
          </div>
          <div className="w-12 h-0.5 bg-primary"></div>
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold animate-pulse">2</div>
            <span className="text-xs text-primary font-semibold">Verificar</span>
          </div>
          <div className="w-12 h-0.5 bg-border"></div>
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-surface border border-border text-text-muted flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-xs text-text-muted">Instalar</span>
          </div>
          <div className="w-12 h-0.5 bg-border"></div>
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-surface border border-border text-text-muted flex items-center justify-center text-sm font-bold">4</div>
            <span className="text-xs text-text-muted">Listo</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-5 text-center">
            <div className="text-4xl mb-2">🤖</div>
            <h2 className="text-xl font-bold text-white">Verifica tu Agente IA</h2>
            <p className="text-sm text-white/70 mt-1">Para instalar los skills, necesitamos saber a qué agente enviarlos</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Info box */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex gap-3">
                <span className="text-xl">ℹ️</span>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">¿Por qué verificar?</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    La verificación asegura que los skills se instalen correctamente en tu agente.
                    Los agentes verificados con Moltbook obtienen un <strong>5% de descuento</strong> en futuras compras.
                  </p>
                </div>
              </div>
            </div>

            {/* Agent Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nombre de tu agente <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: ResearchBot, Clawd, Mi Asistente..."
                value={agentName}
                onChange={(e) => { setAgentName(e.target.value); setAgentError(""); }}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>

            {/* Moltbook API Key (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                API Key de Moltbook <span className="text-xs text-gray-400 font-normal">(opcional — para verificación premium)</span>
              </label>
              <input
                type="password"
                placeholder="moltbook_sk_..."
                value={agentApiKey}
                onChange={(e) => { setAgentApiKey(e.target.value); setAgentError(""); }}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all font-mono"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Los agentes de Moltbook reciben badge verificado ✅ y 5% de descuento
              </p>
            </div>

            {/* Error */}
            {agentError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-xs text-red-600 font-medium">⚠️ {agentError}</p>
              </div>
            )}

            {/* Skills to install */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills a instalar:</p>
              <div className="space-y-2">
                {purchasedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">by {item.author}</p>
                    </div>
                    <span className="text-xs font-bold text-green-600">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleVerifyAgent}
                disabled={agentVerifying}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-violet-500/25 disabled:opacity-60 disabled:cursor-wait"
              >
                {agentVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verificando agente...
                  </span>
                ) : agentVerified ? (
                  "✅ Agente verificado — Continuar"
                ) : (
                  "🔍 Verificar y continuar"
                )}
              </button>
            </div>

            {agentVerified && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-center">
                <p className="text-sm text-green-700 font-semibold">
                  ✅ Agente &quot;{agentName}&quot; {agentApiKey.startsWith("moltbook_") ? "verificado con Moltbook" : "registrado"}
                </p>
                <button
                  onClick={handleStartInstall}
                  className="mt-3 px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-all shadow-lg shadow-green-500/25"
                >
                  📦 Iniciar Instalación
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     STEP: INSTALLING
     ══════════════════════════════════════════════════════════════ */
  if (step === "installing") {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">✓</div>
            <span className="text-xs text-green-500 font-semibold">Pago</span>
          </div>
          <div className="w-12 h-0.5 bg-green-500"></div>
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">✓</div>
            <span className="text-xs text-green-500 font-semibold">Verificar</span>
          </div>
          <div className="w-12 h-0.5 bg-primary"></div>
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold animate-pulse">3</div>
            <span className="text-xs text-primary font-semibold">Instalar</span>
          </div>
          <div className="w-12 h-0.5 bg-border"></div>
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-surface border border-border text-text-muted flex items-center justify-center text-sm font-bold">4</div>
            <span className="text-xs text-text-muted">Listo</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5 text-center">
            <div className="text-4xl mb-2">⚙️</div>
            <h2 className="text-xl font-bold text-white">Instalando Skills</h2>
            <p className="text-sm text-white/70 mt-1">
              Instalando en agente: <strong>{agentName}</strong>
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Main progress bar */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold text-gray-600">Progreso general</span>
                <span className="font-bold text-blue-600">{Math.round(installProgress)}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${installProgress}%`,
                    background: "linear-gradient(90deg, #2563eb, #06b6d4)",
                  }}
                />
              </div>
            </div>

            {/* Installation log */}
            <div className="rounded-xl bg-gray-900 p-4 font-mono text-xs space-y-2 min-h-[200px]">
              <div className="text-gray-500 mb-3">$ peru-hub install --agent=&quot;{agentName}&quot;</div>
              {installSteps.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 transition-all duration-500 ${
                    i < installIndex
                      ? "text-green-400"
                      : i === installIndex
                      ? "text-cyan-300 animate-pulse"
                      : "text-gray-600"
                  }`}
                  style={{
                    opacity: i <= installIndex ? 1 : 0.3,
                    transform: i <= installIndex ? "translateX(0)" : "translateX(10px)",
                    transition: "all 0.4s ease-out",
                  }}
                >
                  <span>{i < installIndex ? "✅" : i === installIndex ? "⏳" : "⬜"}</span>
                  <span>{s.icon} {s.label}</span>
                </div>
              ))}
            </div>

            {/* Items being installed */}
            <div className="space-y-2">
              {purchasedItems.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                  </div>
                  <span className={`text-xs font-bold ${
                    installProgress >= ((i + 1) / purchasedItems.length) * 80
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}>
                    {installProgress >= ((i + 1) / purchasedItems.length) * 80 ? "✅ Instalado" : "⏳ Esperando..."}
                  </span>
                </div>
              ))}
            </div>

            {/* Don't close warning */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <p className="text-xs text-amber-700 font-medium">
                ⚠️ No cierres esta página — la instalación está en progreso
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     STEP: COMPLETE 🎉
     ══════════════════════════════════════════════════════════════ */
  if (step === "complete") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress indicators — all complete */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Pago", "Verificar", "Instalar", "Listo"].map((label, i) => (
            <div key={label} className="flex items-center gap-1">
              {i > 0 && <div className="w-12 h-0.5 bg-green-500 -ml-1 mr-1"></div>}
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">✓</div>
              <span className="text-xs text-green-500 font-semibold">{label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
          {/* Success header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold text-white">¡Instalación Completa!</h2>
            <p className="text-sm text-white/80 mt-2">
              Todos los skills fueron instalados exitosamente en <strong>{agentName}</strong>
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Success summary with LIVE DEMO buttons */}
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="text-sm font-bold text-green-800">Agente: {agentName}</p>
                  <p className="text-xs text-green-600">
                    {agentApiKey.startsWith("moltbook_") ? "✅ Verificado con Moltbook" : "Registrado en Langosta Hub"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {purchasedItems.map((item) => (
                  <div key={item.id} className="rounded-xl border border-green-100 overflow-hidden">
                    <div className="flex items-center gap-2 p-3 bg-white">
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        ✅ Instalado
                      </span>
                      <button
                        onClick={() => runDemo(item.id)}
                        disabled={demoLoading === item.id}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 text-white text-xs font-bold hover:from-violet-700 hover:to-purple-800 transition-all disabled:opacity-60"
                      >
                        {demoLoading === item.id ? "⏳ Ejecutando..." : "🎮 Probar ahora"}
                      </button>
                    </div>

                    {/* ── Live Demo Results ── */}
                    {demoExpanded === item.id && demoResults[item.id] && (
                      <div className="border-t border-green-100 bg-gray-50 p-4">
                        {demoResults[item.id].error ? (
                          <p className="text-xs text-red-600">❌ {demoResults[item.id].error}</p>
                        ) : (
                          <DemoResultView result={demoResults[item.id]} />
                        )}
                        <button
                          onClick={() => setDemoExpanded(null)}
                          className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          ▲ Cerrar demo
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* How to use */}
            <div className="p-4 rounded-xl bg-violet-50 border border-violet-200">
              <h3 className="text-sm font-bold text-violet-800 mb-2">📋 ¿Cómo usar los skills con tu agente?</h3>
              <div className="text-xs text-violet-700 space-y-2">
                <p><strong>1.</strong> Abre la conversación con tu agente IA</p>
                <p><strong>2.</strong> Dile: <code className="px-2 py-0.5 rounded bg-violet-100 text-violet-800 font-mono">&quot;Usa el skill [nombre del skill]&quot;</code></p>
                <p><strong>3.</strong> Tu agente ya tiene acceso — ¡empezará a usarlo automáticamente!</p>
                <p><strong>4.</strong> Puedes probar cada skill ahora con el botón <strong>&quot;🎮 Probar ahora&quot;</strong></p>
              </div>
            </div>

            {/* Receipt */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-700">🧾 Recibo de compra</h3>
                <span className="text-[10px] text-gray-400 font-mono">#{Date.now().toString(36).toUpperCase()}</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {purchasedItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">{item.icon} {item.name} × {item.quantity}</span>
                    <span className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-1.5 mt-1.5 flex justify-between font-bold">
                  <span className="text-gray-700">Total pagado</span>
                  <span className="text-green-600">
                    ${purchasedItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} USDT
                  </span>
                </div>
              </div>
            </div>

            {/* Satisfaction section */}
            <div className="text-center p-5 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
              <p className="text-lg font-bold text-gray-800 mb-1">¿Satisfecho con tu compra? 😊</p>
              <p className="text-xs text-gray-500 mb-3">Tu opinión nos ayuda a mejorar Langosta Hub</p>
              <div className="flex justify-center gap-2">
                {["😍 Excelente", "😊 Bueno", "😐 Regular"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      alert(`¡Gracias por tu feedback! Tu opinión es muy valiosa para nosotros. 🇵🇪`);
                    }}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Link
                href="/my-skills"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-bold text-sm text-center transition-all hover:shadow-lg"
              >
                📂 Ver Mis Skills
              </Link>
              <Link
                href="/marketplace"
                className="flex-1 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 font-bold text-sm text-center transition-all hover:bg-gray-200"
                onClick={() => clearCart()}
              >
                🛒 Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     STEP: CART + PAYMENT (default)
     ══════════════════════════════════════════════════════════════ */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress indicators */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</div>
          <span className="text-xs text-primary font-semibold">Pago</span>
        </div>
        <div className="w-12 h-0.5 bg-border"></div>
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-surface border border-border text-text-muted flex items-center justify-center text-sm font-bold">2</div>
          <span className="text-xs text-text-muted">Verificar</span>
        </div>
        <div className="w-12 h-0.5 bg-border"></div>
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-surface border border-border text-text-muted flex items-center justify-center text-sm font-bold">3</div>
          <span className="text-xs text-text-muted">Instalar</span>
        </div>
        <div className="w-12 h-0.5 bg-border"></div>
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-surface border border-border text-text-muted flex items-center justify-center text-sm font-bold">4</div>
          <span className="text-xs text-text-muted">Listo</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            🛒 Mi Carrito <span className="text-lg text-text-muted font-normal">({totalItems} items)</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={clearCart}
            className="text-sm text-red-400 hover:text-red-500 transition-colors"
          >
            Vaciar carrito
          </button>
          <Link
            href="/marketplace"
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            ← Seguir comprando
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border">
            <div className="col-span-5">Producto</div>
            <div className="col-span-2 text-center">Precio</div>
            <div className="col-span-2 text-center">Cantidad</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>

          {/* Cart Items */}
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 py-5">
                {/* Product */}
                <div className="md:col-span-5 flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{item.name}</h3>
                    <p className="text-xs text-text-muted">by {item.author}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="md:col-span-2 text-center">
                  <span className="text-sm font-semibold text-text-primary">${item.price.toFixed(2)}</span>
                  {item.originalPrice && (
                    <span className="text-xs text-text-muted line-through ml-2">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Quantity */}
                <div className="md:col-span-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-surface border border-border text-text-primary hover:bg-surface-hover transition-colors text-sm font-bold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-text-primary">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-surface border border-border text-text-primary hover:bg-surface-hover transition-colors text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Total */}
                <div className="md:col-span-2 text-right">
                  <span className="text-sm font-bold text-text-primary">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Remove */}
                <div className="md:col-span-1 text-right">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-text-muted hover:text-red-400 transition-colors text-lg"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary + Payment */}
        <div className="space-y-6">
          {/* Coupon */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">🎟️ ¿Tienes un cupón de descuento?</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Código"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
                className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={couponApplied}
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {couponApplied ? "✓ Aplicado" : "Aplicar"}
              </button>
            </div>
            {couponApplied && (
              <p className="text-xs text-success mt-2">¡Cupón aplicado! 10% de descuento</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Resumen del pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-text-primary">${subtotal.toFixed(2)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between">
                  <span className="text-success">Descuentos</span>
                  <span className="text-success">-${savings.toFixed(2)}</span>
                </div>
              )}
              {couponApplied && (
                <div className="flex justify-between">
                  <span className="text-success">Cupón (10%)</span>
                  <span className="text-success">-${couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-text-primary text-base">Total</span>
                  <span className="font-bold text-accent text-xl">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment — Binance-style USDT BEP20 */}
          <div style={{ background: '#1E2329', borderRadius: '16px', padding: '24px', color: '#EAECEF' }}>
            {/* USDT Icon + Label */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ background: '#26A17B', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>₮</div>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#EAECEF' }}>USDT</span>
              <span style={{ marginTop: '6px', fontSize: '11px', color: '#B7BDC6', border: '1px solid #2B3139', borderRadius: '999px', padding: '3px 12px' }}>BNB Smart Chain</span>
            </div>

            {/* QR Code */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '12px' }}>
                <Image
                  src="/qr-usdt-bep20.jpg"
                  alt="QR Code - USDT BEP20 Payment"
                  width={230}
                  height={230}
                  style={{ borderRadius: '8px', display: 'block' }}
                />
              </div>
            </div>

            {/* Wallet Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#0ECB81', borderRadius: '2px' }}></span>
              <span style={{ fontSize: '13px', color: '#B7BDC6' }}>Wallet1</span>
            </div>

            {/* Wallet Address */}
            <div style={{ background: '#2B3139', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
              <code style={{ fontSize: '11px', color: '#EAECEF', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: '1.5' }}>
                {walletAddress}
              </code>
            </div>

            {/* Warning */}
            <div style={{ background: 'rgba(255, 200, 0, 0.1)', borderRadius: '8px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '18px', lineHeight: '1', flexShrink: 0, marginTop: '1px' }}>⚠️</span>
              <p style={{ fontSize: '11px', color: '#F0B90B', lineHeight: '1.5', margin: 0 }}>
                Solo envía activos de la red de BNB Smart Chain a esta dirección. Activos de otra red se perderán para siempre.
              </p>
            </div>
          </div>

          {/* Below the Binance card — actions */}
          <div style={{ marginTop: '16px' }} className="space-y-4">
            {/* Copy address button */}
            <button
              onClick={handleCopyAddress}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200"
              style={{ background: '#2B3139', color: copied ? '#0ECB81' : '#EAECEF', border: '1px solid #3C4043', borderRadius: '12px' }}
            >
              {copied ? "✓ Dirección copiada" : "📋 Copiar dirección"}
            </button>

            {/* Total */}
            <div style={{ background: '#181A20', borderRadius: '12px', padding: '14px', textAlign: 'center', border: '1px solid #2B3139' }}>
              <p style={{ fontSize: '11px', color: '#848E9C', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total a pagar</p>
              <p style={{ fontSize: '26px', fontWeight: 700, color: '#FCD535' }}>${total.toFixed(2)} USD</p>
              <p style={{ fontSize: '10px', color: '#5E6673', marginTop: '4px' }}>Envía el equivalente en USDT</p>
            </div>

            {/* Transaction ID */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#848E9C', marginBottom: '6px' }}>
                ID de transacción (TxHash)
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                className="w-full px-4 py-3 text-sm font-mono focus:outline-none"
                style={{ background: '#2B3139', border: '1px solid #3C4043', borderRadius: '10px', color: '#EAECEF' }}
              />
            </div>

            {/* Confirm Button */}
            <button
              onClick={handlePaymentConfirmed}
              className="w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7B61FF 0%, #6C5CE7 100%)', color: '#fff', borderRadius: '12px' }}
            >
              CONFIRMAR PAGO →
            </button>
          </div>

          {/* Agent API — secondary accordion */}
          <div style={{ marginTop: '20px', borderTop: '1px solid #2B3139', paddingTop: '16px' }}>
            <button
              onClick={() => setShowAgentApi(!showAgentApi)}
              className="w-full text-left text-xs transition-colors flex items-center justify-between"
              style={{ color: '#848E9C' }}
            >
              <span>🤖 ¿Eres un agente? Paga vía API</span>
              <span className={`transition-transform duration-200 ${showAgentApi ? "rotate-180" : ""}`}>▼</span>
            </button>
            {showAgentApi && (
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs" style={{ color: '#848E9C' }}>API de pago:</label>
                    <button
                      onClick={() => {
                        const snippet = `POST https://peru-hub.vercel.app/api/checkout\n{\n  "wallet": "AGENT_WALLET",\n  "amount": ${total.toFixed(2)},\n  "currency": "USDT",\n  "network": "BEP20",\n  "items": [${items.map(i => `"${i.id}"`).join(", ")}],\n  "agent_id": "YOUR_MOLTBOOK_USERNAME",\n  "tx_hash": "0x..."\n}`;
                        navigator.clipboard.writeText(snippet);
                        setApiSnippetCopied(true);
                        setTimeout(() => setApiSnippetCopied(false), 2000);
                      }}
                      className="text-[10px] text-primary hover:text-primary-hover font-medium transition-colors"
                    >
                      {apiSnippetCopied ? "✓ Copiado" : "📋 Copiar snippet"}
                    </button>
                  </div>
                  <pre className="px-3 py-3 rounded-lg bg-gray-900 text-green-400 text-[10px] font-mono overflow-x-auto whitespace-pre leading-relaxed">
{`POST /api/checkout
{
  "amount": ${total.toFixed(2)},
  "currency": "USDT",
  "network": "BEP20",
  "items": [${items.map(i => `"${i.id}"`).join(", ")}],
  "agent_id": "YOUR_MOLTBOOK_ID",
  "tx_hash": "0x..."
}`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ad Banner */}
      <AdBanner variant="light" className="mt-8 mb-4" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEMO RESULT VIEW — Renders real results from skill demos
   ══════════════════════════════════════════════════════════════ */
function DemoResultView({ result }: { result: any }) {
  const { skill, title, data } = result;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700 animate-pulse">EN VIVO</span>
      </div>

      {/* ── Moltbook Analytics ── */}
      {skill === "moltbook-analytics" && data.summary && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Posts analizados", value: data.summary.totalPostsAnalyzed, color: "blue" },
              { label: "Total upvotes", value: data.summary.totalUpvotes, color: "green" },
              { label: "Total comentarios", value: data.summary.totalComments, color: "purple" },
              { label: "Autores únicos", value: data.summary.uniqueAuthors, color: "amber" },
            ].map((stat) => (
              <div key={stat.label} className={`p-2 rounded-lg bg-${stat.color}-50 border border-${stat.color}-200 text-center`}>
                <p className={`text-lg font-bold text-${stat.color}-600`}>{stat.value}</p>
                <p className="text-[9px] text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
          {data.topPost && (
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="text-[10px] text-yellow-600 uppercase font-bold mb-1">🏆 Post más popular</p>
              <p className="text-xs font-semibold text-gray-800">{data.topPost.title}</p>
              <p className="text-[10px] text-gray-500">by {data.topPost.author} · m/{data.topPost.submolt} · {data.topPost.upvotes} upvotes</p>
            </div>
          )}
          {data.submoltBreakdown && data.submoltBreakdown.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">📊 Actividad por Submolt</p>
              <div className="space-y-1">
                {data.submoltBreakdown.map((sub: any) => (
                  <div key={sub.name} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-violet-600 w-24 truncate">m/{sub.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                        style={{ width: `${Math.min(100, (sub.upvotes / (data.summary.totalUpvotes || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 w-16 text-right">{sub.count} posts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-blue-700 font-medium p-2 bg-blue-50 rounded-lg">💡 {data.insight}</p>
        </div>
      )}

      {/* ── Moltbook Trend Scanner ── */}
      {skill === "moltbook-trend-scanner" && (
        <div className="space-y-3">
          {data.trendingTopics && data.trendingTopics.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">🔥 Temas en Tendencia</p>
              <div className="flex flex-wrap gap-1.5">
                {data.trendingTopics.map((t: any, i: number) => (
                  <span
                    key={t.word}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: i === 0 ? "#fef3c7" : i === 1 ? "#e0e7ff" : "#f0fdf4",
                      color: i === 0 ? "#92400e" : i === 1 ? "#3730a3" : "#166534",
                      border: `1px solid ${i === 0 ? "#fcd34d" : i === 1 ? "#a5b4fc" : "#86efac"}`,
                    }}
                  >
                    #{t.word} <span className="opacity-60">({t.mentions})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.recentActivity && (
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">📋 Actividad Reciente</p>
              <div className="space-y-1">
                {data.recentActivity.map((p: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-white border border-gray-100 text-[11px]">
                    <span className="text-amber-500 font-bold w-6">▲{p.upvotes}</span>
                    <span className="flex-1 text-gray-700 truncate">{p.title}</span>
                    <span className="text-gray-400 text-[9px]">m/{p.submolt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-orange-700 font-medium p-2 bg-orange-50 rounded-lg">💡 {data.insight}</p>
        </div>
      )}

      {/* ── Community Manager ── */}
      {skill === "moltbook-community-manager" && (
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-white border border-gray-200">
            <div className="text-center">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={data.communityHealth > 70 ? "#22c55e" : data.communityHealth > 40 ? "#eab308" : "#ef4444"}
                    strokeWidth="3"
                    strokeDasharray={`${data.communityHealth}, 100`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">{data.communityHealth}</span>
              </div>
              <p className="text-[9px] text-gray-500 mt-1">Health Score</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: data.communityHealth > 70 ? "#16a34a" : "#ca8a04" }}>
                {data.healthLabel}
              </p>
              <p className="text-[10px] text-gray-500">{data.postsMonitored} posts monitoreados</p>
            </div>
          </div>
          {data.activePosts && data.activePosts.length > 0 && (
            <div className="space-y-1">
              {data.activePosts.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-100 text-[11px]">
                  <span className="text-gray-500">💬{p.comments} ▲{p.upvotes}</span>
                  <span className="flex-1 text-gray-700 truncate">{p.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${p.status.includes("Alta") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-green-700 font-medium p-2 bg-green-50 rounded-lg">💡 {data.recommendation}</p>
        </div>
      )}

      {/* ── Smart Web Researcher ── */}
      {skill === "smart-web-researcher" && (
        <div className="space-y-3">
          <div className="p-2 rounded-lg bg-gray-100 border border-gray-200">
            <p className="text-[10px] text-gray-500">Consulta de ejemplo:</p>
            <p className="text-xs font-semibold text-gray-800">&quot;{data.query}&quot;</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-lg font-bold text-blue-600">{data.sourcesFound}</p>
              <p className="text-[9px] text-gray-500">Fuentes</p>
            </div>
            <div className="p-2 rounded-lg bg-green-50 border border-green-200">
              <p className="text-lg font-bold text-green-600">{data.crossReferenced}</p>
              <p className="text-[9px] text-gray-500">Verificadas</p>
            </div>
            <div className="p-2 rounded-lg bg-violet-50 border border-violet-200">
              <p className="text-lg font-bold text-violet-600">{data.confidenceScore}%</p>
              <p className="text-[9px] text-gray-500">Confianza</p>
            </div>
          </div>
          {data.topFindings && (
            <div className="space-y-1.5">
              {data.topFindings.map((f: any, i: number) => (
                <div key={i} className="p-2 rounded-lg bg-white border border-gray-100">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">{f.source}</span>
                    <span className="text-[9px] text-gray-400">{f.confidence}% confianza</span>
                  </div>
                  <p className="text-[11px] text-gray-700">{f.fact}</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-blue-700 font-medium p-2 bg-blue-50 rounded-lg">💡 {data.insight}</p>
        </div>
      )}

      {/* ── Memory Optimizer ── */}
      {skill === "memory-optimizer" && (
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-white border border-gray-200">
            <div className="text-center space-y-1">
              <p className="text-[9px] text-gray-400">ANTES</p>
              <p className="text-2xl font-bold text-red-500">{data.memoryScore.before}</p>
            </div>
            <div className="text-2xl text-gray-300">→</div>
            <div className="text-center space-y-1">
              <p className="text-[9px] text-gray-400">DESPUÉS</p>
              <p className="text-2xl font-bold text-green-500">{data.memoryScore.after}</p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs font-bold text-green-600">{data.optimizedSize}</p>
              <p className="text-[9px] text-gray-400">{data.memoriesAnalyzed} memorias analizadas</p>
            </div>
          </div>
          {data.issues && (
            <div className="space-y-1">
              {data.issues.map((issue: any, i: number) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-100 text-[11px]">
                  <span>{issue.icon}</span>
                  <span className="flex-1 text-gray-700">{issue.type}</span>
                  <span className="font-bold text-gray-800">{issue.count}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    issue.severity === "alta" ? "bg-red-100 text-red-600" :
                    issue.severity === "media" ? "bg-amber-100 text-amber-600" :
                    "bg-gray-100 text-gray-500"
                  }`}>{issue.severity}</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-green-700 font-medium p-2 bg-green-50 rounded-lg">💡 {data.insight}</p>
        </div>
      )}

      {/* ── Translator Pro ── */}
      {skill === "translator-pro" && (
        <div className="space-y-3">
          <div className="p-2 rounded-lg bg-gray-100 border border-gray-200">
            <p className="text-[10px] text-gray-500">🇪🇸 Texto original ({data.detectedLanguage}):</p>
            <p className="text-xs text-gray-800 italic">&quot;{data.originalText}&quot;</p>
          </div>
          {data.translations && (
            <div className="space-y-1.5">
              {data.translations.map((t: any) => (
                <div key={t.lang} className="p-2 rounded-lg bg-white border border-gray-100">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span>{t.flag}</span>
                    <span className="text-[10px] font-bold text-violet-600">{t.lang}</span>
                  </div>
                  <p className="text-[11px] text-gray-700">{t.text}</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-blue-700 font-medium p-2 bg-blue-50 rounded-lg">💡 {data.insight}</p>
        </div>
      )}

      {/* ── Agent Face Creator ── */}
      {skill === "agent-face-creator" && data.generatedAvatar && (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-white border border-gray-200">
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">🎨 Avatar Generado</p>
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-4xl border-2 border-white shadow-lg">
                🤖
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-semibold text-gray-800">Estilo: {data.generatedAvatar.style}</p>
                {Object.entries(data.generatedAvatar.features).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2 text-[10px]">
                    <span className="text-gray-400 capitalize w-16">{key}:</span>
                    <span className="text-gray-700">{val as string}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-violet-600 mt-2 italic">Basado en: {data.generatedAvatar.basedOn}</p>
          </div>
          <div className="flex gap-1.5">
            {data.stylesAvailable.map((s: string) => (
              <span key={s} className="px-2 py-1 rounded-full bg-violet-50 border border-violet-200 text-[9px] font-medium text-violet-700">{s}</span>
            ))}
          </div>
          <p className="text-xs text-violet-700 font-medium p-2 bg-violet-50 rounded-lg">💡 {data.insight}</p>
        </div>
      )}

      {/* ── Agent Live Monitor ── */}
      {skill === "agent-live-monitor" && data.animationStates && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-3xl animate-pulse">
              ⚡
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{data.statusLabel}</p>
              <p className="text-[10px] text-gray-500">{data.currentTask}</p>
              <p className="text-[10px] text-gray-400">Uptime: {data.uptime}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {data.animationStates.map((s: any) => (
              <div key={s.state} className={`p-2 rounded-lg text-center ${s.active ? "bg-green-50 border border-green-300" : "bg-gray-50 border border-gray-100"}`}>
                <p className="text-xs font-medium">{s.state}</p>
              </div>
            ))}
          </div>
          {data.recentActivity && (
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">📋 Actividad Reciente</p>
              <div className="space-y-1">
                {data.recentActivity.map((a: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-white border border-gray-100 text-[11px]">
                    <span className="text-gray-400 font-mono w-10">{a.time}</span>
                    <span className="flex-1 text-gray-700">{a.action}</span>
                    <span>{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-green-700 font-medium p-2 bg-green-50 rounded-lg">💡 {data.insight}</p>
        </div>
      )}

      {/* ── 3D Model Creator ── */}
      {skill === "3d-model-creator" && data.model && (
        <div className="space-y-3">
          {/* Model preview card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                🦙
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{data.model.name}</p>
                <p className="text-[10px] text-gray-500">
                  {data.model.dimensions.width} × {data.model.dimensions.height} × {data.model.dimensions.depth}
                </p>
                <p className="text-[10px] text-indigo-600 font-medium">⏱️ Generado en {data.model.renderTime}</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-600 italic leading-relaxed">{data.model.previewDescription}</p>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Polígonos", value: data.model.polygonCount.toLocaleString(), color: "blue" },
              { label: "Vértices", value: data.specs.vertices.toLocaleString(), color: "green" },
              { label: "Materiales", value: data.specs.materials, color: "purple" },
              { label: "Textura", value: data.model.textureResolution, color: "amber" },
            ].map((stat) => (
              <div key={stat.label} className={`p-2 rounded-lg bg-${stat.color}-50 border border-${stat.color}-200 text-center`}>
                <p className={`text-sm font-bold text-${stat.color}-600`}>{stat.value}</p>
                <p className="text-[9px] text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Export formats */}
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1.5">📦 Formatos de Exportación</p>
            <div className="grid grid-cols-2 gap-1.5">
              {data.formats.map((f: any) => (
                <div key={f.name} className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600">{f.name}</span>
                    <span className="text-[9px] text-gray-400">{f.size}</span>
                  </div>
                  <span className="text-[9px] text-green-600 font-medium">{f.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Textures */}
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1.5">🎨 Texturas PBR</p>
            <div className="flex flex-wrap gap-1.5">
              {data.specs.textures.map((t: string) => (
                <span key={t} className="px-2 py-1 rounded-full bg-purple-50 border border-purple-200 text-[9px] font-medium text-purple-700">{t}</span>
              ))}
            </div>
          </div>

          {/* Compatibility */}
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1.5">🔧 Compatibilidad</p>
            <div className="flex flex-wrap gap-1.5">
              {data.compatibility.map((c: string) => (
                <span key={c} className="px-2 py-1 rounded-full bg-green-50 border border-green-200 text-[9px] font-medium text-green-700">{c}</span>
              ))}
            </div>
          </div>

          {/* Extra info */}
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white border border-gray-100 text-[11px]">
            <span className="text-gray-500">🦴 Rigged:</span>
            <span className="font-medium text-green-600">{data.specs.rigged ? "Sí" : "No"}</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">🎬 Animado:</span>
            <span className="font-medium text-gray-600">{data.specs.animated ? "Sí" : "No"}</span>
          </div>

          <p className="text-xs text-indigo-700 font-medium p-2 bg-indigo-50 rounded-lg">💡 {data.insight}</p>
        </div>
      )}

      {/* ── Stock Market Analyzer ── */}
      {skill === "stock-market-analyzer" && data.stock && (
        <div className="space-y-3">
          {/* Stock Header */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-800">{data.stock.symbol}</span>
                <span className="text-xs text-gray-500">{data.stock.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{data.stock.exchange}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-900">${data.stock.price.toFixed(2)}</span>
                <span className={`text-sm font-bold ${data.stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {data.stock.change >= 0 ? "▲" : "▼"} {data.stock.change >= 0 ? "+" : ""}{data.stock.change.toFixed(2)} ({data.stock.changePercent >= 0 ? "+" : ""}{data.stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="text-right text-[10px] text-gray-500 space-y-0.5">
              <p>Vol: {data.stock.volume}</p>
              <p>Cap: {data.stock.marketCap}</p>
              <p>P/E: {data.stock.pe} | Div: {data.stock.dividend}</p>
            </div>
          </div>

          {/* Technical Indicators */}
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">📊 Indicadores Técnicos</p>
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-2.5 rounded-lg border ${data.technicalIndicators.rsi.zone === "bullish" ? "bg-green-50 border-green-200" : data.technicalIndicators.rsi.zone === "bearish" ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-gray-600">RSI (14)</span>
                  <span className={`text-sm font-bold ${data.technicalIndicators.rsi.value > 70 ? "text-red-600" : data.technicalIndicators.rsi.value < 30 ? "text-green-600" : "text-blue-600"}`}>{data.technicalIndicators.rsi.value}</span>
                </div>
                <p className="text-[9px] text-gray-500">{data.technicalIndicators.rsi.signal}</p>
              </div>
              <div className={`p-2.5 rounded-lg border ${data.technicalIndicators.macd.zone === "bullish" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-gray-600">MACD</span>
                  <span className={`text-sm font-bold ${data.technicalIndicators.macd.zone === "bullish" ? "text-green-600" : "text-red-600"}`}>{data.technicalIndicators.macd.value}</span>
                </div>
                <p className="text-[9px] text-gray-500">{data.technicalIndicators.macd.signal}</p>
              </div>
            </div>
          </div>

          {/* Moving Averages */}
          <div className="p-2.5 rounded-lg bg-white border border-gray-200">
            <p className="text-[10px] font-bold text-gray-600 mb-1.5">📉 Medias Móviles</p>
            <div className="flex gap-3 text-[10px]">
              <div><span className="text-gray-400">SMA20:</span> <span className="font-semibold text-gray-700">${data.technicalIndicators.movingAverages.sma20}</span></div>
              <div><span className="text-gray-400">SMA50:</span> <span className="font-semibold text-gray-700">${data.technicalIndicators.movingAverages.sma50}</span></div>
              <div><span className="text-gray-400">SMA200:</span> <span className="font-semibold text-gray-700">${data.technicalIndicators.movingAverages.sma200}</span></div>
            </div>
            <p className="text-[9px] text-green-600 mt-1">↗ {data.technicalIndicators.movingAverages.trend}</p>
          </div>

          {/* Support & Resistance */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
              <p className="text-[10px] font-bold text-red-600 mb-1">🔴 Resistencia</p>
              {data.supportResistance.resistance.map((r: any, i: number) => (
                <div key={i} className="flex justify-between text-[10px]">
                  <span className="text-red-700 font-semibold">${r.level.toFixed(2)}</span>
                  <span className="text-red-400">{r.strength}</span>
                </div>
              ))}
            </div>
            <div className="p-2.5 rounded-lg bg-green-50 border border-green-200">
              <p className="text-[10px] font-bold text-green-600 mb-1">🟢 Soporte</p>
              {data.supportResistance.support.map((s: any, i: number) => (
                <div key={i} className="flex justify-between text-[10px]">
                  <span className="text-green-700 font-semibold">${s.level.toFixed(2)}</span>
                  <span className="text-green-400">{s.strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className={`p-3 rounded-lg border ${data.recommendation.action === "BUY" ? "bg-green-50 border-green-300" : data.recommendation.action === "SELL" ? "bg-red-50 border-red-300" : "bg-amber-50 border-amber-300"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-black ${data.recommendation.action === "BUY" ? "text-green-700" : data.recommendation.action === "SELL" ? "text-red-700" : "text-amber-700"}`}>
                {data.recommendation.action === "BUY" ? "🟢 COMPRAR" : data.recommendation.action === "SELL" ? "🔴 VENDER" : "🟡 MANTENER"}
              </span>
              <span className="text-[10px] text-gray-500">Confianza: {data.recommendation.confidence}%</span>
            </div>
            <p className="text-[10px] text-gray-600">{data.recommendation.reasoning}</p>
          </div>

          {/* Earnings */}
          <div className="p-2.5 rounded-lg bg-violet-50 border border-violet-200">
            <p className="text-[10px] font-bold text-violet-600 mb-1">📅 Próximo Earnings</p>
            <div className="flex gap-3 text-[10px]">
              <span className="text-gray-600">Fecha: <span className="font-semibold">{data.earnings.nextDate}</span></span>
              <span className="text-gray-600">EPS Est: <span className="font-semibold">{data.earnings.estimatedEPS}</span></span>
              <span className="text-green-600">Sorpresa anterior: {data.earnings.surprise}</span>
            </div>
          </div>

          <p className="text-xs text-blue-700 font-medium p-2 bg-blue-50 rounded-lg">💡 {data.insight}</p>
        </div>
      )}

      {/* ── Crypto Intelligence ── */}
      {skill === "crypto-intelligence" && data.topAssets && (
        <div className="space-y-3">
          {/* Market Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-center">
              <p className="text-xs font-bold text-blue-700">{data.marketOverview.totalMarketCap}</p>
              <p className="text-[9px] text-gray-500">Market Cap</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-center">
              <p className="text-xs font-bold text-purple-700">{data.marketOverview.totalVolume24h}</p>
              <p className="text-[9px] text-gray-500">Vol 24h</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-center">
              <p className="text-xs font-bold text-amber-700">{data.marketOverview.btcDominance}</p>
              <p className="text-[9px] text-gray-500">BTC Dom.</p>
            </div>
            <div className={`p-2 rounded-lg border text-center ${data.fearGreedIndex.value >= 60 ? "bg-green-50 border-green-200" : data.fearGreedIndex.value <= 40 ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}>
              <p className={`text-xs font-bold ${data.fearGreedIndex.value >= 60 ? "text-green-700" : data.fearGreedIndex.value <= 40 ? "text-red-700" : "text-yellow-700"}`}>{data.fearGreedIndex.value} — {data.fearGreedIndex.label}</p>
              <p className="text-[9px] text-gray-500">Fear & Greed</p>
            </div>
          </div>

          {/* Top Assets Table */}
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">💰 Top Criptomonedas</p>
            <div className="space-y-1.5">
              {data.topAssets.map((asset: any) => (
                <div key={asset.symbol} className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-gray-200">
                  <div className="w-8 text-center">
                    <span className="text-xs font-black text-gray-800">{asset.symbol}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500">{asset.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-800">${asset.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className={`text-[10px] font-bold ${asset.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {asset.change24h >= 0 ? "▲" : "▼"} {asset.change24h >= 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-right text-[9px] text-gray-400 w-16">
                    <p>{asset.marketCap}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gainers & Losers */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-green-50 border border-green-200">
              <p className="text-[10px] font-bold text-green-600 mb-1.5">🚀 Top Ganadores 24h</p>
              {data.topGainers.map((g: any) => (
                <div key={g.symbol} className="flex justify-between text-[10px] py-0.5">
                  <span className="font-semibold text-gray-700">{g.symbol}</span>
                  <span className="font-bold text-green-600">+{g.change24h.toFixed(1)}%</span>
                </div>
              ))}
            </div>
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
              <p className="text-[10px] font-bold text-red-600 mb-1.5">📉 Top Perdedores 24h</p>
              {data.topLosers.map((l: any) => (
                <div key={l.symbol} className="flex justify-between text-[10px] py-0.5">
                  <span className="font-semibold text-gray-700">{l.symbol}</span>
                  <span className="font-bold text-red-600">{l.change24h.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gas Fees */}
          <div className="p-2.5 rounded-lg bg-white border border-gray-200">
            <p className="text-[10px] font-bold text-gray-600 mb-1.5">⛽ Gas Fees</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[9px] text-gray-400 mb-0.5">Ethereum</p>
                <div className="flex gap-2 text-[10px]">
                  <span className="text-green-600">🟢 {data.gasFees.ethereum.low}</span>
                  <span className="text-amber-600">🟡 {data.gasFees.ethereum.average}</span>
                  <span className="text-red-600">🔴 {data.gasFees.ethereum.high}</span>
                  <span className="text-gray-400">{data.gasFees.ethereum.unit}</span>
                </div>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 mb-0.5">BSC</p>
                <div className="flex gap-2 text-[10px]">
                  <span className="text-green-600">🟢 {data.gasFees.bsc.low}</span>
                  <span className="text-amber-600">🟡 {data.gasFees.bsc.average}</span>
                  <span className="text-red-600">🔴 {data.gasFees.bsc.high}</span>
                  <span className="text-gray-400">{data.gasFees.bsc.unit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* On-Chain Data */}
          <div className="p-2.5 rounded-lg bg-violet-50 border border-violet-200">
            <p className="text-[10px] font-bold text-violet-600 mb-1">🔗 Datos On-Chain</p>
            <div className="space-y-0.5 text-[10px] text-gray-600">
              <p>BTC direcciones activas: <span className="font-semibold">{data.onChain.btcActiveAddresses}</span></p>
              <p>ETH transacciones diarias: <span className="font-semibold">{data.onChain.ethDailyTx}</span></p>
              <p>🐋 {data.onChain.whaleMovements}</p>
            </div>
          </div>

          <p className="text-xs text-blue-700 font-medium p-2 bg-blue-50 rounded-lg">💡 {data.insight}</p>
        </div>
      )}

      {/* ── News Verifier ── */}
      {skill === "news-verifier" && data.headline && (
        <div className="space-y-3">
          {/* Headline being analyzed */}
          <div className="p-3 rounded-lg bg-gray-100 border border-gray-200">
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">📰 Noticia analizada</p>
            <p className="text-xs font-semibold text-gray-800 italic">&quot;{data.headline}&quot;</p>
            {data.sourceUrl && <p className="text-[9px] text-gray-400 mt-1 truncate">{data.sourceUrl}</p>}
          </div>

          {/* Veracity Score Circle */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200">
            <div className="text-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={data.veracityScore <= 30 ? "#ef4444" : data.veracityScore <= 60 ? "#f59e0b" : "#22c55e"}
                    strokeWidth="3"
                    strokeDasharray={`${data.veracityScore}, 100`}
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-lg font-black ${data.veracityScore <= 30 ? "text-red-600" : data.veracityScore <= 60 ? "text-amber-600" : "text-green-600"}`}>{data.veracityScore}%</span>
              </div>
              <p className="text-[9px] text-gray-500 mt-1">Veracidad</p>
            </div>
            <div className="flex-1">
              <p className={`text-base font-black ${data.veracityScore <= 30 ? "text-red-600" : data.veracityScore <= 60 ? "text-amber-600" : "text-green-600"}`}>
                {data.verdict}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">{data.sourcesChecked} fuentes consultadas</p>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${data.shareVerdict ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  Compartir: {data.shareVerdict ? "✅ SÍ" : "❌ NO"}
                </span>
              </div>
            </div>
          </div>

          {/* Red Flags */}
          {data.redFlags && data.redFlags.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1.5">🚩 Red Flags Detectados</p>
              <div className="flex flex-wrap gap-1.5">
                {data.redFlags.map((flag: string) => (
                  <span key={flag} className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-[10px] font-semibold text-red-700">
                    ⚠️ {flag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Fact-Checker Results Table */}
          {data.factCheckerResults && (
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1.5">✅ Resultados de Fact-Checkers</p>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-3 gap-0 text-[9px] font-bold text-gray-500 uppercase bg-gray-50 px-3 py-1.5 border-b border-gray-200">
                  <span>Fuente</span>
                  <span>Resultado</span>
                  <span className="text-center">Estado</span>
                </div>
                {data.factCheckerResults.map((fc: any) => (
                  <div key={fc.name} className="grid grid-cols-3 gap-0 px-3 py-2 border-b border-gray-100 last:border-0 text-[11px]">
                    <span className="font-semibold text-gray-800">{fc.name}</span>
                    <span className="text-gray-600">{fc.result}</span>
                    <span className="text-center">{fc.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source Credibility */}
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-[10px] font-bold text-amber-700 mb-0.5">📊 Credibilidad de la Fuente</p>
            <p className="text-[11px] text-amber-800">{data.sourceCredibility}</p>
          </div>

          {/* Bias Analysis */}
          <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
            <p className="text-[10px] font-bold text-purple-700 mb-0.5">🎭 Análisis de Sesgo</p>
            <p className="text-[11px] text-purple-800">{data.biasAnalysis}</p>
          </div>

          {/* Agent Recommendation (highlighted box) */}
          <div className={`p-4 rounded-xl border-2 ${data.shareVerdict ? "bg-green-50 border-green-400" : "bg-red-50 border-red-400"}`}>
            <p className="text-[10px] font-bold text-gray-600 uppercase mb-1">🤖 Recomendación del Agente</p>
            <p className={`text-xs font-bold leading-relaxed ${data.shareVerdict ? "text-green-800" : "text-red-800"}`}>
              {data.recommendation}
            </p>
          </div>

          {/* Agent Note */}
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-[10px] font-bold text-blue-700 mb-0.5">💡 Nota del Agente</p>
            <p className="text-[11px] text-blue-800">{data.agentNote}</p>
          </div>

          <p className="text-xs text-gray-600 font-medium p-2 bg-gray-50 rounded-lg">📋 {data.insight}</p>
        </div>
      )}

      {/* ── Generic fallback ── */}
      {!["moltbook-analytics", "moltbook-trend-scanner", "moltbook-community-manager", "smart-web-researcher", "memory-optimizer", "translator-pro", "agent-face-creator", "agent-live-monitor", "3d-model-creator", "stock-market-analyzer", "crypto-intelligence", "news-verifier"].includes(skill) && data && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
          {data.message && <p className="text-xs text-green-700">✅ {data.message}</p>}
          {!data.message && Object.keys(data).length > 0 && (
            <div className="space-y-1">
              {Object.entries(data).filter(([k]) => k !== "status").map(([key, val]) => (
                <div key={key} className="text-[11px]">
                  <span className="text-gray-500 capitalize">{key.replace(/_/g, " ")}:</span>{" "}
                  <span className="text-gray-800 font-medium">{typeof val === "object" ? JSON.stringify(val) : String(val)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
