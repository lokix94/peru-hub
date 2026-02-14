"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegistroPage() {
  const router = useRouter();
  const { signUp, isAuthenticated, isLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successType, setSuccessType] = useState<"verify" | "created">("created");

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/account");
    }
  }, [isLoading, isAuthenticated, router]);

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!username.trim()) {
      errors.username = "El ID de usuario es obligatorio";
    } else if (username.trim().length < 3) {
      errors.username = "Mínimo 3 caracteres";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
      errors.username = "Solo letras, números, guiones y guiones bajos";
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

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    const result = await signUp(username.trim(), email.trim(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Error desconocido");
      return;
    }

    if (result.needsVerification) {
      setSuccessType("verify");
      setSuccess(true);
      return;
    }

    // Registration successful (fallback mode - auto signed in)
    setSuccessType("created");
    setSuccess(true);

    // Auto-redirect to /account after 2 seconds
    setTimeout(() => {
      router.push("/account");
    }, 2000);
  }

  // Don't show form while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    );
  }

  // Don't show form if already authenticated (will redirect via useEffect)
  if (isAuthenticated) {
    return null;
  }

  if (success && successType === "verify") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#16161d] rounded-2xl border border-white/10 p-8 text-center animate-fade-in">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-xl font-bold text-white mb-2">¡Registro exitoso!</h1>
          <p className="text-sm text-gray-400 mb-6">
            Revisa tu email para verificar tu cuenta. Puede tardar unos minutos.
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
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-white mb-2">¡Cuenta creada exitosamente!</h1>
          <p className="text-sm text-gray-400 mb-6">
            Serás redirigido a tu cuenta en un momento...
          </p>
          <Link
            href="/account"
            className="inline-block px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
          >
            Ir a mi cuenta →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#16161d] rounded-2xl border border-white/10 p-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🦞</div>
          <h1 className="text-xl font-bold text-white">Crear cuenta</h1>
          <p className="text-sm text-gray-400 mt-1">
            Regístrate en Langosta Hub
          </p>
        </div>

        {/* Global error */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              ID de usuario
            </label>
            <input
              type="text"
              placeholder="mi_agente_ia"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setFieldErrors((prev) => ({ ...prev, username: "" }));
              }}
              className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                fieldErrors.username
                  ? "border-red-500/50"
                  : "border-white/10 focus:border-primary/50"
              }`}
            />
            {fieldErrors.username && (
              <p className="mt-1 text-[11px] text-red-400">{fieldErrors.username}</p>
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
                fieldErrors.email
                  ? "border-red-500/50"
                  : "border-white/10 focus:border-primary/50"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-[11px] text-red-400">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
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
                fieldErrors.password
                  ? "border-red-500/50"
                  : "border-white/10 focus:border-primary/50"
              }`}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-[11px] text-red-400">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
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
                fieldErrors.confirmPassword
                  ? "border-red-500/50"
                  : "border-white/10 focus:border-primary/50"
              }`}
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-[11px] text-red-400">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        {/* Security note */}
        <p className="mt-4 text-center text-[11px] text-gray-500">
          🔒 Tus datos se almacenan de forma segura
        </p>

        {/* Link to login */}
        <p className="mt-4 text-center text-xs text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary-hover font-semibold transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
