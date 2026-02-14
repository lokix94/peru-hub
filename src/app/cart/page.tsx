"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

type PaymentTab = "human" | "agent";
type CheckoutStep = "cart" | "payment" | "verify-agent" | "installing" | "complete";

/* ── Installation simulation steps ── */
const installSteps = [
  { label: "Verificando licencia de compra...", icon: "🔐", duration: 1200 },
  { label: "Descargando skill desde Peru Hub...", icon: "📦", duration: 1800 },
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
  const [paymentTab, setPaymentTab] = useState<PaymentTab>("human");
  const [agentWalletCopied, setAgentWalletCopied] = useState(false);
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

  const walletAddress = "0xcbc14706f7f8167505de1690e1e8419399f9506d";

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
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            {/* Success summary */}
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="text-sm font-bold text-green-800">Agente: {agentName}</p>
                  <p className="text-xs text-green-600">
                    {agentApiKey.startsWith("moltbook_") ? "✅ Verificado con Moltbook" : "Registrado en Peru Hub"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {purchasedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-green-100">
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      ✅ Instalado
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to use */}
            <div className="p-4 rounded-xl bg-violet-50 border border-violet-200">
              <h3 className="text-sm font-bold text-violet-800 mb-2">📋 ¿Cómo usar los skills?</h3>
              <div className="text-xs text-violet-700 space-y-2">
                <p><strong>1.</strong> Abre la conversación con tu agente IA</p>
                <p><strong>2.</strong> Dile: <code className="px-2 py-0.5 rounded bg-violet-100 text-violet-800 font-mono">&quot;Usa el skill [nombre del skill]&quot;</code></p>
                <p><strong>3.</strong> Tu agente ya tiene acceso — ¡empezará a usarlo automáticamente!</p>
              </div>
            </div>

            {/* Example command */}
            <div className="rounded-xl bg-gray-900 p-4 font-mono text-xs">
              <div className="text-gray-500 mb-2"># Ejemplo de uso con tu agente:</div>
              <div className="text-cyan-300">Tú: &quot;Investiga sobre inteligencia artificial en Perú&quot;</div>
              <div className="text-green-400 mt-1">🤖 {agentName}: Usando Smart Web Researcher para buscar información...</div>
              <div className="text-green-400">🤖 {agentName}: He encontrado 15 fuentes relevantes. Aquí está mi reporte:</div>
              <div className="text-gray-400 mt-1">   [Reporte detallado generado por el skill]</div>
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
              <p className="text-xs text-gray-500 mb-3">Tu opinión nos ayuda a mejorar Peru Hub</p>
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

          {/* Crypto Payment */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4 text-center">💳 Pago con Criptomonedas</h3>

            {/* Payment Method Tabs */}
            <div className="flex rounded-lg bg-background border border-border p-1 mb-4">
              <button
                onClick={() => setPaymentTab("human")}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                  paymentTab === "human"
                    ? "bg-white text-text-primary shadow-sm border border-border"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                👤 Humanos (QR)
              </button>
              <button
                onClick={() => setPaymentTab("agent")}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                  paymentTab === "agent"
                    ? "bg-white text-text-primary shadow-sm border border-border"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                🤖 Agentes IA
              </button>
            </div>

            {paymentTab === "human" && (
              <>
                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  <div className="bg-white rounded-xl p-3">
                    <Image
                      src="/qr-usdt-bep20.jpg"
                      alt="QR Code - USDT BEP20 Payment"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <p className="text-center text-sm font-bold text-amber-400 mb-1">USDT - BEP 20 - Binance</p>
                <p className="text-center text-xs text-text-muted mb-4">Escanea para pagar</p>

                {/* Wallet Address */}
                <div className="mb-4">
                  <label className="text-xs text-text-muted mb-1 block">Dirección de wallet:</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-text-primary text-[10px] font-mono break-all">
                      {walletAddress}
                    </code>
                    <button
                      onClick={handleCopyAddress}
                      className="px-3 py-2 rounded-lg bg-surface border border-border text-text-muted hover:text-text-primary transition-colors text-xs whitespace-nowrap"
                    >
                      {copied ? "✓ Copiado" : "📋 Copiar"}
                    </button>
                  </div>
                </div>

                {/* Accepted Cryptos */}
                <div className="flex items-center justify-center gap-3 mb-4 py-2 rounded-lg bg-background/50">
                  <span className="text-xs text-text-muted">Aceptamos:</span>
                  <span className="text-xs font-semibold text-text-secondary">USDT</span>
                  <span className="text-text-muted">·</span>
                  <span className="text-xs font-semibold text-text-secondary">BNB</span>
                  <span className="text-text-muted">·</span>
                  <span className="text-xs font-semibold text-text-secondary">BUSD</span>
                </div>

                {/* Transaction ID */}
                <div className="mb-4">
                  <label className="text-xs text-text-muted mb-1 block">ID de Transacción (TxHash):</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-text-primary text-sm font-mono placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                  />
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handlePaymentConfirmed}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl"
                >
                  CONFIRMAR PAGO →
                </button>

                <p className="text-center text-[10px] text-text-muted mt-3">
                  Envía exactamente <strong>${total.toFixed(2)} USDT</strong> a la dirección indicada.
                </p>
              </>
            )}

            {paymentTab === "agent" && (
              <>
                {/* Agent API Badge */}
                <div className="flex justify-center mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    🤖 API Programática · USDT (BEP20)
                  </span>
                </div>

                {/* Payment Amount */}
                <div className="mb-4 p-3 rounded-lg bg-background border border-border text-center">
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Monto a pagar</p>
                  <p className="text-2xl font-bold text-accent">${total.toFixed(2)} USDT</p>
                  <p className="text-[10px] text-text-muted mt-1">Red: BSC (BEP20)</p>
                </div>

                {/* Wallet Address (copyable) */}
                <div className="mb-4">
                  <label className="text-xs text-text-muted mb-1 block">Wallet de destino:</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-text-primary text-[10px] font-mono break-all">
                      {walletAddress}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(walletAddress);
                        setAgentWalletCopied(true);
                        setTimeout(() => setAgentWalletCopied(false), 2000);
                      }}
                      className="px-3 py-2 rounded-lg bg-surface border border-border text-text-muted hover:text-text-primary transition-colors text-xs whitespace-nowrap"
                    >
                      {agentWalletCopied ? "✓ Copiado" : "📋 Copiar"}
                    </button>
                  </div>
                </div>

                {/* API Payment Instructions */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-text-muted">API de pago:</label>
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

                {/* Confirm Button for agents too */}
                <button
                  onClick={handlePaymentConfirmed}
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-base transition-all duration-200 shadow-lg shadow-violet-500/25"
                >
                  CONFIRMAR PAGO →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
