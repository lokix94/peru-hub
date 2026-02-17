"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface SkillData {
  id: string;
  name: string;
  icon: string;
  author: string;
  price: number;
}

export function AddToCartButton({ skill }: { skill: SkillData }) {
  const { addItem, isInCart } = useCart();
  const { t } = useLanguage();
  const inCart = isInCart(skill.id);

  const handleAdd = () => {
    if (!inCart) {
      addItem({
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
        author: skill.author,
        price: skill.price,
      });
    }
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${
        inCart
          ? "bg-green-50 border-2 border-green-500 text-green-700 cursor-default"
          : "bg-white border-2 border-primary text-primary hover:bg-primary-light"
      }`}
    >
      {inCart ? `✓ ${t("added.to.cart")}` : t("add.to.cart")}
    </button>
  );
}

export function AddAndUpgradeButton({ skill }: { skill: SkillData }) {
  const { addItem, isInCart } = useCart();
  const { t } = useLanguage();
  const router = useRouter();

  const handleAddAndGo = () => {
    if (!isInCart(skill.id)) {
      addItem({
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
        author: skill.author,
        price: skill.price,
      });
    }
    router.push("/cart");
  };

  return (
    <button
      onClick={handleAddAndGo}
      className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-all shadow-md shadow-primary/20 text-sm mb-2"
    >
      🛒 {t("add.and.upgrade")}
    </button>
  );
}

/**
 * InstallFreeButton — installs a free skill directly to the user's agent.
 * No cart, no payment. Just: click → select agent → installed.
 */
export function InstallFreeButton({ skill }: { skill: SkillData }) {
  const { isAuthenticated, agents } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [error, setError] = useState("");

  const handleInstallToAgent = async (agentId: string, agentName: string) => {
    setInstalling(true);
    setError("");

    try {
      // Get token from localStorage
      const session = localStorage.getItem("langosta-session");
      const token = session ? JSON.parse(session).token : null;

      if (!token) {
        setError("Sesión expirada. Inicia sesión de nuevo.");
        setInstalling(false);
        return;
      }

      const res = await fetch("/api/skills/install", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agentId,
          skillIds: [skill.id],
        }),
      });

      const data = await res.json();

      if (data.success && data.installed?.length > 0) {
        setInstalled(true);
        setShowAgentPicker(false);
      } else {
        setError(data.error || "Error al instalar");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setInstalling(false);
    }
  };

  // Not logged in → go to login
  if (!isAuthenticated) {
    return (
      <button
        onClick={() => router.push("/login")}
        className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-all shadow-md shadow-green-500/20 text-sm mb-2"
      >
        ⚡ {t("install.free")} — Inicia sesión
      </button>
    );
  }

  // No agents → go to account to link one
  if (agents.length === 0) {
    return (
      <button
        onClick={() => router.push("/account")}
        className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-all shadow-md shadow-green-500/20 text-sm mb-2"
      >
        ⚡ {t("install.free")} — Vincula tu agente
      </button>
    );
  }

  // Already installed
  if (installed) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-xl bg-green-50 border-2 border-green-500 text-green-700 font-semibold text-sm mb-2 cursor-default"
      >
        ✅ Instalado
      </button>
    );
  }

  // Single agent → install directly
  if (agents.length === 1 && !showAgentPicker) {
    return (
      <button
        onClick={() => handleInstallToAgent(agents[0].id, agents[0].name)}
        disabled={installing}
        className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold transition-all shadow-md shadow-green-500/20 text-sm mb-2"
      >
        {installing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Instalando en {agents[0].name}...
          </span>
        ) : (
          `⚡ Instalar gratis en ${agents[0].name}`
        )}
      </button>
    );
  }

  // Multiple agents → pick one
  return (
    <div className="mb-2">
      {!showAgentPicker ? (
        <button
          onClick={() => setShowAgentPicker(true)}
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-all shadow-md shadow-green-500/20 text-sm"
        >
          ⚡ {t("install.free")}
        </button>
      ) : (
        <div className="space-y-2 p-3 rounded-xl bg-green-50 border border-green-200">
          <p className="text-xs font-semibold text-green-800">¿En qué agente instalar?</p>
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => handleInstallToAgent(agent.id, agent.name)}
              disabled={installing}
              className="w-full flex items-center gap-2 p-2.5 rounded-lg border border-green-200 bg-white hover:bg-green-50 text-sm text-left transition-all disabled:opacity-50"
            >
              <span className="text-lg">{agent.platform === "Moltbook" ? "🦞" : "🤖"}</span>
              <span className="font-medium text-gray-800">{agent.name}</span>
              <span className="text-[10px] text-gray-400 ml-auto">{agent.platform}</span>
            </button>
          ))}
          <button
            onClick={() => setShowAgentPicker(false)}
            className="w-full text-xs text-gray-500 hover:text-gray-700 py-1"
          >
            Cancelar
          </button>
        </div>
      )}
      {error && (
        <p className="text-[11px] text-red-500 mt-1 text-center">{error}</p>
      )}
    </div>
  );
}
