"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WALLET_ADDRESS = "0xDD49337e6B62C8B0d750CD6F809A84F339a3061e";
const PRESET_AMOUNTS = [5, 10, 25, 50];

export default function RechargeModal({ isOpen, onClose }: RechargeModalProps) {
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
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
        setSubmitted(false);
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
        className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl transition-all duration-300 ${
          visible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        style={{ background: '#181A20', borderColor: '#2B3139' }}
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
              {/* Amount selection */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#848E9C', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
                  {t("recharge.how.much")}
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2.5">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(String(preset))}
                      style={{
                        padding: '8px 0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 700,
                        transition: 'all 0.2s',
                        background: amount === String(preset) ? '#FCD535' : '#2B3139',
                        color: amount === String(preset) ? '#1E2329' : '#848E9C',
                        border: amount === String(preset) ? 'none' : '1px solid #3C4043',
                        cursor: 'pointer',
                      }}
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
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#2B3139', border: '1px solid #3C4043', color: '#EAECEF', fontSize: '14px', outline: 'none' }}
                />
              </div>

              {/* Binance-style dark card */}
              <div style={{ background: '#1E2329', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
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
                      alt="QR USDT BEP20"
                      width={200}
                      height={200}
                      style={{ borderRadius: '8px', display: 'block' }}
                      priority
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
                    {WALLET_ADDRESS}
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

              {/* Copy address button */}
              <button
                onClick={copyAddress}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  background: '#2B3139',
                  color: copied ? '#0ECB81' : '#EAECEF',
                  border: '1px solid #3C4043',
                  cursor: 'pointer',
                  marginBottom: '16px',
                  transition: 'all 0.2s',
                }}
              >
                {copied ? "✓ Dirección copiada" : "📋 Copiar dirección"}
              </button>

              {/* Transaction hash */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#848E9C', marginBottom: '6px' }}>
                  ID de transacción (TxHash)
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: '#2B3139', border: '1px solid #3C4043', color: '#EAECEF', fontSize: '14px', fontFamily: 'monospace', outline: 'none' }}
                />
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!amount || !txHash.trim()}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  background: (!amount || !txHash.trim()) ? '#3C4043' : 'linear-gradient(135deg, #7B61FF 0%, #6C5CE7 100%)',
                  color: (!amount || !txHash.trim()) ? '#5E6673' : '#fff',
                  border: 'none',
                  cursor: (!amount || !txHash.trim()) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                CONFIRMAR RECARGA →
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
