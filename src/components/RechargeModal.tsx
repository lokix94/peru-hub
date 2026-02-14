"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WALLET_ADDRESS = "0xcbc14706f7f8167505de1690e1e8419399f9506d";
const PAYPAL_EMAIL = "jc.aguipuente94@gmail.com";
const PRESET_AMOUNTS = [5, 10, 25, 50];
type RechargeMethod = "paypal" | "crypto";

export default function RechargeModal({ isOpen, onClose }: RechargeModalProps) {
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [paypalEmailCopied, setPaypalEmailCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [method, setMethod] = useState<RechargeMethod>("paypal");
  const { t } = useLanguage();

  // Animate in
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setAmount("");
        setTxHash("");
        setCopied(false);
        setPaypalEmailCopied(false);
        setSubmitted(false);
        setMethod("paypal");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const copyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = WALLET_ADDRESS;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const copyPaypalEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PAYPAL_EMAIL);
      setPaypalEmailCopied(true);
      setTimeout(() => setPaypalEmailCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = PAYPAL_EMAIL;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setPaypalEmailCopied(true);
      setTimeout(() => setPaypalEmailCopied(false), 2000);
    }
  }, []);

  const handleSubmit = () => {
    if (!amount || !txHash.trim()) return;
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#1a1a2e]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          visible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label={t("close")}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          {!submitted ? (
            <>
              {/* Title */}
              <h2 className="text-xl font-bold text-white mb-1">💳 {t("recharge.title")}</h2>
              <p className="text-xs text-white/50 mb-4">{t("recharge.subtitle")}</p>

              {/* Method Tabs */}
              <div className="flex rounded-lg bg-white/5 border border-white/10 p-1 mb-5">
                <button
                  onClick={() => setMethod("paypal")}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                    method === "paypal"
                      ? "bg-white/15 text-white shadow-sm border border-white/20"
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  👤 PayPal
                </button>
                <button
                  onClick={() => setMethod("crypto")}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                    method === "crypto"
                      ? "bg-white/15 text-white shadow-sm border border-white/20"
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  🪙 Crypto
                </button>
              </div>

              {/* Amount selection (shared) */}
              <div className="mb-4">
                <label className="block text-[11px] text-white/40 mb-2 uppercase tracking-wider font-medium">
                  {t("recharge.how.much")}
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2.5">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(String(preset))}
                      className={`py-2 rounded-lg text-sm font-bold transition-all ${
                        amount === String(preset)
                          ? "bg-primary text-white shadow-lg shadow-primary/25"
                          : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  step="any"
                  placeholder={t("recharge.other")}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                />
              </div>

              {method === "paypal" && (
                <>
                  {/* PayPal Badge */}
                  <div className="flex justify-center mb-3">
                    <span className="px-3 py-1.5 rounded-full text-sm font-bold border border-blue-400/30" style={{ background: "rgba(0, 48, 135, 0.2)", color: "#4da6ff" }}>
                      💳 Pay<span style={{ color: "#60bfff" }}>Pal</span>
                    </span>
                  </div>

                  {/* Instructions */}
                  <p className="text-center text-sm font-semibold text-white/80 mb-2">Envía el monto total a:</p>

                  {/* PayPal Email */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2.5">
                      <code className="flex-1 text-sm text-white/90 font-mono text-center font-semibold select-all">
                        {PAYPAL_EMAIL}
                      </code>
                      <button
                        onClick={copyPaypalEmail}
                        className={`shrink-0 px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                          paypalEmailCopied
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20 border border-white/10"
                        }`}
                      >
                        {paypalEmailCopied ? "✓ Copiado" : "📋 Copiar"}
                      </button>
                    </div>
                  </div>

                  {/* PayPal.me link */}
                  {amount && (
                    <a
                      href={`https://paypal.me/jcaguipuente94/${amount}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl text-white font-bold text-sm text-center transition-all duration-200 shadow-lg flex items-center justify-center gap-2 mb-3"
                      style={{ background: "linear-gradient(135deg, #003087, #0070ba)" }}
                    >
                      Pagar con PayPal →
                    </a>
                  )}

                  {/* Friends & Family note */}
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
                    <p className="text-[11px] text-amber-400 font-medium text-center">
                      ⚠️ Envía como &quot;Amigos y familiares&quot; para evitar comisiones
                    </p>
                  </div>

                  {/* Transaction ID */}
                  <div className="mb-5">
                    <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider font-medium">
                      ID de Transacción PayPal
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 5TY12345AB678901C"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                    />
                    <p className="text-[10px] text-white/30 mt-1">
                      Lo encuentras en tu historial de PayPal
                    </p>
                  </div>
                </>
              )}

              {method === "crypto" && (
                <>
                  {/* QR Code */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-white rounded-xl p-3">
                      <Image
                        src="/qr-usdt-bep20.jpg"
                        alt="QR USDT BEP20"
                        width={180}
                        height={180}
                        className="rounded-lg"
                        priority
                      />
                    </div>
                  </div>

                  <p className="text-center text-base font-bold text-amber-400 mb-1">
                    USDT - BEP 20 - Binance
                  </p>
                  <p className="text-center text-xs text-white/50 mb-4">
                    {t("recharge.scan")}
                  </p>

                  {/* Wallet address */}
                  <div className="mb-5">
                    <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider font-medium">
                      {t("recharge.deposit")}
                    </label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2.5">
                      <code className="flex-1 text-[11px] text-white/80 font-mono break-all select-all leading-relaxed">
                        {WALLET_ADDRESS}
                      </code>
                      <button
                        onClick={copyAddress}
                        className={`shrink-0 px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                          copied
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20 border border-white/10"
                        }`}
                      >
                        {copied ? `✓ ${t("copied")}` : t("copy")}
                      </button>
                    </div>
                  </div>

                  {/* Transaction hash */}
                  <div className="mb-5">
                    <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-wider font-medium">
                      {t("recharge.txhash.label")}
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                    />
                  </div>
                </>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!amount || !txHash.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-violet-500 hover:from-primary-hover hover:to-violet-600 text-white text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                {t("recharge.confirm")}
              </button>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
                ✅
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {t("recharge.processing")}
              </h3>
              <p className="text-sm text-white/60 mb-2">
                {t("recharge.verifying")}
              </p>
              <p className="text-xs text-white/40 mb-5">
                {t("recharge.amount")}: <span className="text-amber-400 font-bold">${amount} USDT</span>
              </p>

              <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-5">
                <p className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">TxHash</p>
                <code className="text-[11px] text-white/70 font-mono break-all">{txHash}</code>
              </div>

              <a
                href={`https://bscscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/25 transition-colors mb-4"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Ver en BSCScan
              </a>

              <div className="block">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
