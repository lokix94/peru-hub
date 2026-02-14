"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface CartItem {
  id: string;
  name: string;
  icon: string;
  author: string;
  price: number;
  originalPrice?: number;
  quantity: number;
}

const initialCartItems: CartItem[] = [
  {
    id: "web-research-pro",
    name: "Web Research Pro",
    icon: "🌐",
    author: "SearchCraft",
    price: 4.99,
    originalPrice: 9.99,
    quantity: 1,
  },
  {
    id: "code-review-assistant",
    name: "Code Review Assistant",
    icon: "💻",
    author: "DevTools Inc",
    price: 9.99,
    quantity: 1,
  },
  {
    id: "email-composer",
    name: "Email Composer Pro",
    icon: "📧",
    author: "WriteWell",
    price: 3.99,
    originalPrice: 5.99,
    quantity: 1,
  },
];

type PaymentTab = "human" | "agent";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [txId, setTxId] = useState("");
  const [copied, setCopied] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentTab, setPaymentTab] = useState<PaymentTab>("human");
  const [agentWalletCopied, setAgentWalletCopied] = useState(false);
  const [apiSnippetCopied, setApiSnippetCopied] = useState(false);

  const walletAddress = "0xcbc14706f7f8167505de1690e1e8419399f9506d";

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

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

  if (items.length === 0) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            🛒 Mi Carrito <span className="text-lg text-text-muted font-normal">({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
          </h1>
        </div>
        <Link
          href="/marketplace"
          className="text-sm text-primary hover:text-primary-hover transition-colors"
        >
          ← Seguir comprando
        </Link>
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
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 rounded-lg bg-surface border border-border text-text-primary hover:bg-surface-hover transition-colors text-sm font-bold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-text-primary">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
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
                👤 Pago para Humanos (QR)
              </button>
              <button
                onClick={() => setPaymentTab("agent")}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                  paymentTab === "agent"
                    ? "bg-white text-text-primary shadow-sm border border-border"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                🤖 Pago para Agentes IA
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
                <p className="text-center text-xs text-text-muted mb-4">Escanea para recargar tu saldo</p>

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
                  onClick={() => setPaymentConfirmed(true)}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl"
                >
                  {paymentConfirmed ? "✅ PAGO ENVIADO — VERIFICANDO..." : "CONFIRMAR PAGO"}
                </button>

                {paymentConfirmed && (
                  <p className="text-center text-xs text-success mt-3 animate-pulse">
                    Verificando transacción... Recibirás confirmación por email.
                  </p>
                )}

                <p className="text-center text-[10px] text-text-muted mt-3">
                  Envía exactamente <strong>${total.toFixed(2)} USDT</strong> a la dirección indicada.
                  <br />La verificación puede tomar de 1 a 5 minutos.
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

                {/* Payment Amount (plain text for agents) */}
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
                    <label className="text-xs text-text-muted">API de pago programático:</label>
                    <button
                      onClick={() => {
                        const snippet = `POST https://peru-hub.vercel.app/api/checkout\n{\n  "wallet": "AGENT_WALLET_ADDRESS",\n  "amount": ${total.toFixed(2)},\n  "currency": "USDT",\n  "network": "BEP20",\n  "items": [${items.map(i => `"${i.id}"`).join(", ")}],\n  "agent_id": "YOUR_MOLTBOOK_USERNAME",\n  "tx_hash": "0x..."\n}`;
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
{`POST https://peru-hub.vercel.app/api/checkout
{
  "wallet": "AGENT_WALLET_ADDRESS",
  "amount": ${total.toFixed(2)},
  "currency": "USDT",
  "network": "BEP20",
  "items": [${items.map(i => `"${i.id}"`).join(", ")}],
  "agent_id": "YOUR_MOLTBOOK_USERNAME",
  "tx_hash": "0x..."
}`}
                  </pre>
                </div>

                {/* Instructions Note */}
                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 mb-4">
                  <p className="text-[11px] text-amber-300 leading-relaxed">
                    <strong>Instrucciones:</strong> Envía exactamente <strong>${total.toFixed(2)} USDT</strong> (BEP20) a la wallet indicada arriba, luego haz POST del <code className="px-1 py-0.5 bg-amber-500/10 rounded text-[10px]">tx_hash</code> a nuestra API.
                  </p>
                </div>

                {/* Agent Benefits */}
                <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
                  <p className="text-[11px] text-violet-300 font-semibold mb-1">🤖 Ventajas para agentes:</p>
                  <ul className="text-[10px] text-text-muted space-y-0.5">
                    <li>• Respuesta JSON con order_id y enlace BSCScan</li>
                    <li>• Verificación automática de transacción</li>
                    <li>• Compatible con Moltbook — verifica tu agente en <strong>Mi Cuenta</strong></li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
