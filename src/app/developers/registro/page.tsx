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
  } catch { /* ignore */ }
}

export default function DevRegistroPage() {
  const router = useRouter();
  const { signUp, isAuthenticated, isLoading, user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [walletBEP20, setWalletBEP20] = useState("");
  const [moltbookProfile, setMoltbookProfile] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successType, setSuccessType] = useState<"verify" | "created">("created");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if already has a dev profile
      const profiles = getDevProfiles();
      const existing = profiles.find((p) => p.userId === user?.id);
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

    if (!email.trim()) {
      errors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Ingresa un email válido";
    }

    if (!password) {
      errors.password = "La contraseña es obligatoria";
    } else if (password.length < 8) {
      errors.password = "Mínimo 8 caracteres";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Debe incluir al menos una mayúscula";
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Debe incluir al menos un número";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirma tu contraseña";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!walletBEP20.trim()) {
      errors.walletBEP20 = "La wallet USDT BEP20 es obligatoria";
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(walletBEP20.trim())) {
      errors.walletBEP20 = "Dirección BEP20 inválida (debe empezar con 0x y tener 42 caracteres)";
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

    setLoading(true);

    // If already authenticated, just save the dev profile
    if (isAuthenticated && user) {
      const profiles = getDevProfiles();
      const devProfile: DevProfile = {
        userId: user.id,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        walletBEP20: walletBEP20.trim(),
        moltbookProfile: moltbookProfile.trim(),
        createdAt: new Date().toISOString(),
      };
      profiles.push(devProfile);
      saveDevProfiles(profiles);
      setLoading(false);
      setSuccessType("created");
      setSuccess(true);
      setTimeout(() => router.push("/developers/dashboard"), 2000);
      return;
    }

    // Register new user
    const username = fullName.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_-]/g, "");
    const result = await signUp(username, email.trim(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Error desconocido");
      return;
    }

    if (result.needsVerification) {
      // Save dev profile data for after verification
      const tempData = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        walletBEP20: walletBEP20.trim(),
        moltbookProfile: moltbookProfile.trim(),
      };
      try {
        localStorage.setItem("langosta-dev-pending", JSON.stringify(tempData));
      } catch { /* ignore */ }
      setSuccessType("verify");
      setSuccess(true);
      return;
    }

    // Save dev profile after successful registration
    // Need to get the user ID from the session
    setTimeout(() => {
      try {
        const sessionRaw = localStorage.getItem("langosta-session");
        const session = sessionRaw ? JSON.parse(sessionRaw) : null;
        if (session?.user?.id) {
          const profiles = getDevProfiles();
          const devProfile: DevProfile = {
            userId: session.user.id,
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            walletBEP20: walletBEP20.trim(),
            moltbookProfile: moltbookProfile.trim(),
            createdAt: new Date().toISOString(),
          };
          profiles.push(devProfile);
          saveDevProfiles(profiles);
        }
      } catch { /* ignore */ }
    }, 100);

    setSuccessType("created");
    setSuccess(true);
    setTimeout(() => router.push("/developers/dashboard"), 2000);
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    );
  }

  if (success && successType === "verify") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#16161d] rounded-2xl border border-white/10 p-8 text-center animate-fade-in">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-xl font-bold text-white mb-2">¡Registro exitoso!</h1>
          <p className="text-sm text-gray-400 mb-2">
            Te enviamos un email de confirmación a:
          </p>
          <p className="text-sm text-white font-semibold mb-4">{email}</p>
          <p className="text-sm text-gray-400 mb-6">
            Revisa tu bandeja de entrada (y la carpeta de spam) y haz clic en el enlace para activar tu cuenta de desarrollador.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
          >
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (success && successType === "created") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#16161d] rounded-2xl border border-white/10 p-8 text-center animate-fade-in">
          <div className="text-5xl mb-4">🦞</div>
          <h1 className="text-xl font-bold text-white mb-2">¡Bienvenido, desarrollador!</h1>
          <p className="text-sm text-gray-400 mb-6">
            Tu cuenta de desarrollador ha sido creada. Serás redirigido al dashboard...
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🦞</div>
          <h1 className="text-xl font-bold text-white">Registro de Desarrollador</h1>
          <p className="text-sm text-gray-400 mt-1">
            Crea tu cuenta y empieza a vender skills en Langosta Hub
          </p>
        </div>

        {/* Revenue split banner */}
        <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
          <p className="text-xs text-green-400 font-semibold">💰 Tú recibes el 97% de cada venta — Solo 3% de comisión</p>
        </div>

        {/* Global error */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Juan Pérez"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                fieldErrors.fullName ? "border-red-500/50" : "border-white/10 focus:border-primary/50"
              }`}
            />
            {fieldErrors.fullName && (
              <p className="mt-1 text-[11px] text-red-400">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                fieldErrors.email ? "border-red-500/50" : "border-white/10 focus:border-primary/50"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-[11px] text-red-400">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          {!isAuthenticated && (
            <>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                    fieldErrors.password ? "border-red-500/50" : "border-white/10 focus:border-primary/50"
                  }`}
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-[11px] text-red-400">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                    fieldErrors.confirmPassword ? "border-red-500/50" : "border-white/10 focus:border-primary/50"
                  }`}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-red-400">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </>
          )}

          {/* Wallet BEP20 */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              Wallet USDT BEP20 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={walletBEP20}
              onChange={(e) => {
                setWalletBEP20(e.target.value);
                setFieldErrors((prev) => ({ ...prev, walletBEP20: "" }));
              }}
              className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm font-mono placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                fieldErrors.walletBEP20 ? "border-red-500/50" : "border-white/10 focus:border-primary/50"
              }`}
            />
            {fieldErrors.walletBEP20 && (
              <p className="mt-1 text-[11px] text-red-400">{fieldErrors.walletBEP20}</p>
            )}
            <p className="mt-1 text-[10px] text-gray-500">
              Esta es la dirección donde recibirás tus pagos en USDT (Binance Smart Chain)
            </p>
          </div>

          {/* Moltbook Profile */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              Perfil de Moltbook <span className="text-gray-600">(opcional)</span>
            </label>
            <input
              type="text"
              placeholder="u/tu_usuario"
              value={moltbookProfile}
              onChange={(e) => setMoltbookProfile(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Accept Terms */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  setFieldErrors((prev) => ({ ...prev, acceptTerms: "" }));
                }}
                className="mt-0.5 w-4 h-4 rounded bg-white/5 border-white/20 text-primary focus:ring-primary/50"
              />
              <span className="text-xs text-gray-400">
                Acepto los <span className="text-primary hover:underline cursor-pointer">términos de desarrollador</span> de Langosta Hub, incluyendo la política de contenido, pagos y comisiones (3% plataforma / 97% desarrollador).
              </span>
            </label>
            {fieldErrors.acceptTerms && (
              <p className="mt-1 text-[11px] text-red-400 ml-7">{fieldErrors.acceptTerms}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creando cuenta..." : "🦞 Registrarse como Desarrollador"}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-gray-500">
          🔒 Tus datos y wallet se almacenan de forma segura
        </p>

        <p className="mt-4 text-center text-xs text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/developers/dashboard"
            className="text-primary hover:text-primary-hover font-semibold transition-colors"
          >
            Ir al Dashboard
          </Link>
        </p>

        <p className="mt-2 text-center text-xs text-gray-400">
          ¿Buscas registrarte como usuario?{" "}
          <Link
            href="/registro"
            className="text-primary hover:text-primary-hover font-semibold transition-colors"
          >
            Registro de usuario
          </Link>
        </p>
      </div>
    </div>
  );
}
