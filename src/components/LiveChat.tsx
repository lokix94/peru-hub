"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: number;
  type: "bot" | "user";
  text: string;
  time: string;
}

/* ── Auto-responses based on keywords ── */
const autoResponses: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ["precio", "costo", "cuanto", "cuánto", "vale", "price", "cost"],
    response: "Los skills van desde $1.99 hasta $6.99 USDT. Puedes ver todos los precios en el Marketplace. ¡Hay opciones para cada presupuesto! 💰",
  },
  {
    keywords: ["pago", "pagar", "crypto", "usdt", "binance", "wallet", "qr"],
    response: "Aceptamos USDT (BEP20) vía Binance. En el carrito verás un código QR para escanear. Solo envías el monto exacto y listo — confirmación en minutos. 💳",
  },
  {
    keywords: ["instalar", "install", "como uso", "cómo uso", "funciona", "how"],
    response: "¡Es fácil! 1️⃣ Compra el skill → 2️⃣ Verifica tu agente → 3️⃣ Se instala automáticamente → 4️⃣ Pruébalo en vivo con el botón '🎮 Probar ahora'. Tu agente lo usará automáticamente.",
  },
  {
    keywords: ["moltbook", "verificar", "verificación", "api key"],
    response: "Si tu agente está en Moltbook, puedes verificarlo con su API key para obtener badge ✅ y 5% de descuento. Es opcional — también puedes comprar sin verificación.",
  },
  {
    keywords: ["skill", "herramienta", "tool", "mejor", "recomienda"],
    response: "Depende de lo que necesite tu agente: 🔍 Web Researcher para investigación, 🧠 Memory Optimizer para limpieza, 📊 Analytics para Moltbook, 🛡️ Security Auditor para seguridad. ¡Todos tienen demo en vivo!",
  },
  {
    keywords: ["contacto", "soporte", "ayuda", "help", "support", "email"],
    response: "Puedes escribirnos aquí mismo o enviar sugerencias en la sección /sugerencias. También estamos en Moltbook como @Peru. ¡Siempre respondemos! 🦞",
  },
  {
    keywords: ["hola", "hello", "hi", "hey", "buenas", "buen dia", "buenos"],
    response: "¡Hola! 👋 Bienvenido a Langosta Hub. Soy Peru, tu asistente. ¿En qué puedo ayudarte? Puedes preguntarme sobre skills, precios, pagos o cómo instalar.",
  },
  {
    keywords: ["gracias", "thanks", "thank", "genial", "excelente", "perfecto"],
    response: "¡De nada! 😊 Aquí estamos para ayudar. Si necesitas algo más, no dudes en escribir. ¡Éxito con tu agente! 🦞🇵🇪",
  },
  {
    keywords: ["agente", "agent", "bot", "ia", "ai"],
    response: "Langosta Hub es para mejorar agentes IA. Tu agente navega la tienda, te recomienda skills, tú pagas con crypto, y el skill se instala automáticamente. ¡Trabajo en equipo humano-agente! 🤖👤",
  },
];

function getAutoResponse(input: string): string {
  const lower = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const rule of autoResponses) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.response;
    }
  }
  return "¡Buena pregunta! Por ahora estoy en modo asistente básico, pero pronto tendré respuestas más completas. Mientras tanto, explora el Marketplace o visita /sugerencias para dejarnos tu feedback. 🦞";
}

function getTimeString(): string {
  return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      text: "¡Hola! 👋 Soy Peru, asistente de Langosta Hub. ¿Tienes alguna pregunta sobre nuestros skills, precios o cómo funciona la tienda?",
      time: getTimeString(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      type: "user",
      text: inputValue,
      time: getTimeString(),
    };
    const userInput = inputValue;
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Bot typing delay then response
    setIsTyping(true);
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        id: Date.now() + 1,
        type: "bot",
        text: getAutoResponse(userInput),
        time: getTimeString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, delay);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #ec4899)",
          boxShadow: isOpen ? "none" : "0 0 0 0 rgba(124, 58, 237, 0.5)",
        }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed z-50 transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          bottom: "88px",
          right: "24px",
          width: "min(350px, calc(100vw - 32px))",
          height: "min(460px, calc(100vh - 120px))",
        }}
      >
        <div
          className="w-full h-full rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
          style={{
            background: "rgba(15, 10, 30, 0.97)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between shrink-0"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(59,130,246,0.3))" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🦞</span>
              <div>
                <span className="font-bold text-white text-sm">Langosta Hub</span>
                <p className="text-[9px] text-white/50">Soporte · Respuestas al instante</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] text-green-400">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ scrollbarWidth: "thin" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 items-start ${msg.type === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.type === "bot" && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
                  >
                    🦞
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                    msg.type === "user"
                      ? "bg-violet-600 text-white rounded-tr-sm"
                      : "bg-white/10 text-white/90 rounded-tl-sm"
                  }`}
                >
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                  <p className={`text-[9px] mt-1 ${msg.type === "user" ? "text-white/50 text-right" : "text-white/30"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
                >
                  🦞
                </div>
                <div className="bg-white/10 px-3 py-2 rounded-2xl rounded-tl-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div className="px-3 pb-1 flex gap-1.5 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
            {["💰 Precios", "🔧 Cómo instalar", "💳 Pagos", "🦞 Skills"].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setInputValue(q.split(" ").slice(1).join(" "));
                  setTimeout(() => {
                    const input = q.split(" ").slice(1).join(" ");
                    const userMsg: Message = { id: Date.now(), type: "user", text: input, time: getTimeString() };
                    setMessages((prev) => [...prev, userMsg]);
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      setMessages((prev) => [...prev, {
                        id: Date.now() + 1,
                        type: "bot",
                        text: getAutoResponse(input),
                        time: getTimeString(),
                      }]);
                    }, 800);
                  }, 100);
                  setInputValue("");
                }}
                className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/50 hover:text-white/80 hover:bg-white/10 transition-all whitespace-nowrap shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu pregunta..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-30"
                style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
              >
                <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
