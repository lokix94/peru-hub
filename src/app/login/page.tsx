"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdBanner from "@/components/AdBanner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Check URL params for confirmation status
  useEffect(() => {
    const confirmed = searchParams.get("confirmed");
    const urlError = searchParams.get("error");

    if (confirmed === "true") {
      setSuccessMessage("✅ Email confirmado. Ya puedes iniciar sesión.");
    }
    if (urlError === "confirmation_failed") {
      setError("La confirmación de email falló. Intenta registrarte de nuevo.");
    } else if (urlError === "configuration") {
      setError("Error de configuración del servidor.");
    } else if (urlError) {
      setError("Ocurrió un error. Intenta de nuevo.");
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/account");
    }
  }, [isLoading, isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("El email es obligatorio");
      return;
    }
    if (!password) {
      setError("La contraseña es obligatoria");
      return;
    }

    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Credenciales incorrectas");
      return;
    }

    router.push("/account");
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

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#16161d] rounded-2xl border border-white/10 p-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🦞</div>
          <h1 className="text-xl font-bold text-white">Iniciar sesión</h1>
          <p className="text-sm text-gray-400 mt-1">
            Accede a tu cuenta de Langosta Hub
          </p>
        </div>

        {/* Success message (e.g. email confirmed) */}
        {successMessage && (
          <div className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs text-center">
            {successMessage}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Link to register */}
        <p className="mt-6 text-center text-xs text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            className="text-primary hover:text-primary-hover font-semibold transition-colors"
          >
            Regístrate
          </Link>
        </p>
      </div>

      {/* Ad Banner */}
      <AdBanner variant="dark" className="mt-8" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-gray-400 text-sm">Cargando...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
