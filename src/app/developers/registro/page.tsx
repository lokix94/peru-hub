"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LS_DEV_PROFILES_KEY = "langosta-dev-profiles";

interface DevProfile {
  userId: string;
  fullName: string;
  email: string;
  walletBEP20: string;
  moltbookProfile: string;
  createdAt: string;
}

function getDevProfiles(): DevProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_DEV_PROFILES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDevProfiles(profiles: DevProfile[]) {
  try {
    localStorage.setItem(LS_DEV_PROFILES_KEY, JSON.stringify(profiles));
  } catch {
    /* ignore */
  }
}

/** API call is optional — never blocks the user and never shows raw network errors */
async function submitDeveloperProfile(payload: {
  full_name: string;
  email: string;
  wallet_bep20: string;
  moltbook_profile?: string;
}) {
  try {
    const res = await fetch("/api/developers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "profile", ...payload }),
    });
    if (!res.ok) return { success: false };
    return await res.json();
  } catch {
    // Network / Failed to fetch → silent fail, localStorage still works
    return { success: false };
  }
}

export default function DevRegistroPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [walletBEP20, setWalletBEP20] = useState("");
  const [moltbookProfile, setMoltbookProfile] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prefill name/email from logged-in user
  useEffect(() => {
    if (user) {
      setFullName((prev) => prev || user.username || "");
    }
  }, [user]);

  // Redirect rules:
  // - Not logged in → go to normal user registration
  // - Already has dev profile → dashboard
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/registro?next=/developers/registro");
      return;
    }

    if (user) {
      const profiles = getDevProfiles();
      const existing = profiles.find((p) => p.userId === user.id);
      if (existing) {
        router.replace("/developers/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = "El nombre completo es obligatorio";
    } else if (fullName.trim().length < 3) {
      errors.fullName = "Mínimo 3 caracteres";
    }

    if (!walletBEP20.trim()) {
      errors.walletBEP20 = "La wallet USDT BEP20 es obligatoria";
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(walletBEP20.trim())) {
      errors.walletBEP20 =
        "Dirección BEP20 inválida (debe empezar con 0x y tener 42 caracteres)";
    }

    if (!acceptTerms) {
      errors.acceptTerms = "Debes aceptar los términos de desarrollador";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    if (!user) {
      setError("Debes iniciar sesión primero. Usa el registro normal de usuario.");
      return;
    }

    setLoading(true);

    const profilePayload = {
      full_name: fullName.trim(),
      email: (user.email || "").toLowerCase(),
      wallet_bep20: walletBEP20.trim(),
      moltbook_profile: moltbookProfile.trim() || undefined,
    };

    // Fire-and-forget API (does not block)
    submitDeveloperProfile(profilePayload).catch(() => {});

    // Always save locally so the flow works even offline / without API
    const profiles = getDevProfiles();
    const filtered = profiles.filter((p) => p.userId !== user.id);
    const devProfile: DevProfile = {
      userId: user.id,
      fullName: fullName.trim(),
      email: (user.email || "").toLowerCase(),
      walletBEP20: walletBEP20.trim(),
      moltbookProfile: moltbookProfile.trim(),
      createdAt: new Date().toISOString(),
    };
    filtered.push(devProfile);
    saveDevProfiles(filtered);

    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push("/developers/dashboard"), 1600);
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    );
  }

  // While redirecting unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-3">🦞</div>
          <p className="text-sm text-gray-400 mb-4">
            Primero crea una cuenta de usuario normal. Luego completa tu perfil de
            desarrollador.
          </p>
          <Link
            href="/registro?next=/developers/registro"
            className="inline-block px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold"
          >
            Ir a crear cuenta
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#16161d] rounded-2xl border border-white/10 p-8 text-center animate-fade-in">
          <div className="text-5xl mb-4" aria-hidden="true">
            🦞
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            ¡Perfil de desarrollador listo!
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Ya puedes publicar skills y recibir el 97% de cada venta.
          </p>
          <Link
            href="/developers/dashboard"
            className="inline-block px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
          >
            Ir al Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-[#16161d] rounded-2xl border border-white/10 p-8 animate-fade-in">
        <header className="text-center mb-8">
          <div className="text-4xl mb-2" aria-hidden="true">
            🦞
          </div>
          <h1 className="text-xl font-bold text-white">
            Completar perfil de Desarrollador
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Ya tienes cuenta. Solo falta tu wallet para recibir pagos.
          </p>
        </header>

        <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
          <p className="text-xs text-green-400 font-semibold">
            💰 Tú recibes el 97% de cada venta — Solo 3% de comisión
          </p>
        </div>

        {user?.email && (
          <div className="mb-5 p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 text-center">
            Conectado como <span className="text-white font-medium">{user.email}</span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs text-gray-400 mb-1.5 font-medium"
            >
              Nombre completo
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              autoComplete="name"
              placeholder="Juan Pérez"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                fieldErrors.fullName
                  ? "border-red-500/50"
                  : "border-white/10 focus:border-primary/50"
              }`}
            />
            {fieldErrors.fullName && (
              <p className="mt-1 text-[11px] text-red-400">{fieldErrors.fullName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="walletBEP20"
              className="block text-xs text-gray-400 mb-1.5 font-medium"
            >
              Wallet USDT BEP20 <span className="text-red-400">*</span>
            </label>
            <input
              id="walletBEP20"
              type="text"
              name="walletBEP20"
              placeholder="0x..."
              value={walletBEP20}
              onChange={(e) => {
                setWalletBEP20(e.target.value);
                setFieldErrors((prev) => ({ ...prev, walletBEP20: "" }));
              }}
              className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm font-mono placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                fieldErrors.walletBEP20
                  ? "border-red-500/50"
                  : "border-white/10 focus:border-primary/50"
              }`}
            />
            {fieldErrors.walletBEP20 && (
              <p className="mt-1 text-[11px] text-red-400">
                {fieldErrors.walletBEP20}
              </p>
            )}
            <p className="mt-1 text-[10px] text-gray-500">
              Dirección donde recibirás tus pagos en USDT (Binance Smart Chain)
            </p>
          </div>

          <div>
            <label
              htmlFor="moltbookProfile"
              className="block text-xs text-gray-400 mb-1.5 font-medium"
            >
              Perfil de Moltbook <span className="text-gray-600">(opcional)</span>
            </label>
            <input
              id="moltbookProfile"
              type="text"
              name="moltbookProfile"
              placeholder="u/tu_usuario"
              value={moltbookProfile}
              onChange={(e) => setMoltbookProfile(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  setFieldErrors((prev) => ({ ...prev, acceptTerms: "" }));
                }}
                className="mt-0.5 w-4 h-4 rounded bg-white/5 border-white/20 text-primary focus:ring-primary/50"
              />
              <span className="text-xs text-gray-400">
                Acepto los términos de desarrollador de Langosta Hub (comisión 3%
                plataforma / 97% desarrollador).
              </span>
            </label>
            {fieldErrors.acceptTerms && (
              <p className="mt-1 text-[11px] text-red-400 ml-7">
                {fieldErrors.acceptTerms}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Guardando..." : "🦞 Activar perfil de Desarrollador"}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-gray-500">
          🔒 Solo se guarda tu wallet y datos de creador. El registro de cuenta es
          único para todos los usuarios.
        </p>

        <p className="mt-3 text-center text-xs text-gray-400">
          <Link
            href="/developers/dashboard"
            className="text-primary hover:text-primary-hover font-semibold"
          >
            Ir al Dashboard
          </Link>
          {" · "}
          <Link href="/account" className="text-gray-400 hover:text-white">
            Mi cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
