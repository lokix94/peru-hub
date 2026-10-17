"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegistroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/account";
  const { signUp, isAuthenticated, isLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(nextUrl.startsWith("/") ? nextUrl : "/account");
    }
  }, [isLoading, isAuthenticated, router, nextUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("El nombre de usuario es obligatorio");
      return;
    }
    if (!email.trim()) {
      setError("El email es obligatorio");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(username.trim(), email.trim(), password);

      if (!result.success) {
        const msg = result.error || "No se pudo crear la cuenta";
        // Never show raw network errors
        if (
          /failed to fetch|network|load failed|cors/i.test(msg) ||
          msg === "Error de conexión"
        ) {
          setError(
            "No se pudo conectar. Revisa tu internet o inténtalo de nuevo en unos segundos."
          );
        } else {
          setError(msg);
        }
        setLoading(false);
        return;
      }

      if (result.needsVerification) {
        setNeedsVerification(true);
        setLoading(false);
        return;
      }

      router.push(nextUrl.startsWith("/") ? nextUrl : "/account");
    } catch {
      setError(
        "No se pudo conectar. Revisa tu internet o inténtalo de nuevo en unos segundos."
      );
      setLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  if (needsVerification) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-[#16161d] rounded-2xl border border-white/10 p-8 text-center">
          <div className="text-4xl mb-3">📧</div>
          <h1 className="text-xl font-bold text-white mb-2">Revisa tu email</h1>
          <p className="text-sm text-gray-400 mb-6">
            Te enviamos un enlace de confirmación a{" "}
            <strong className="text-white">{email}</strong>. Confirma y luego
            inicia sesión.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-3 rounded-xl bg-primary text-white text-sm font-bold"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#16161d] rounded-2xl border border-white/10 p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🦞</div>
          <h1 className="text-xl font-bold text-white">Crear cuenta</h1>
          <p className="text-sm text-gray-400 mt-1">
            Un solo registro para usuarios · Luego puedes ser desarrollador
          </p>
        </div>

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
              htmlFor="username"
              className="block text-xs text-gray-400 mb-1.5 font-medium"
            >
              Usuario
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="tu_usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="mt-1 text-[10px] text-gray-500">
              3–32 caracteres · letras, números, _ o -
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs text-gray-400 mb-1.5 font-medium"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs text-gray-400 mb-1.5 font-medium"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="mt-1 text-[10px] text-gray-500">
              Mín. 8 caracteres · al menos 1 letra y 1 número
            </p>
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="block text-xs text-gray-400 mb-1.5 font-medium"
            >
              Confirmar contraseña
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Repite la contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Iniciar sesión
          </Link>
        </p>

        <p className="text-center text-[10px] text-gray-600 mt-4">
          Un solo registro. Si quieres vender skills, después activas el perfil de
          desarrollador desde tu cuenta.
        </p>
      </div>
    </div>
  );
}
