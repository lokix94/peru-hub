"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

const LS_USERS_KEY = "langosta-users";
const SALT = "langosta-hub-salt-2026";

function hashPasswordClient(password: string): string {
  return btoa(`${SALT}:${password}`);
}

function validatePasswordStrength(password: string): string | null {
  if (!password || password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres";
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "La contraseña debe contener al menos una letra y un número";
  }
  return null;
}

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const useSupabase = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const normalEmail = email.toLowerCase().trim();
    if (!normalEmail.includes("@")) {
      setError("Email inválido");
      return;
    }

    setLoading(true);

    try {
      if (useSupabase) {
        // Supabase: envía email de recuperación
        const supabase = createBrowserClient();
        if (!supabase) {
          setError("Error de configuración");
          setLoading(false);
          return;
        }
        const redirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/login?recovered=true`
            : undefined;
        const { error: sbError } = await supabase.auth.resetPasswordForEmail(
          normalEmail,
          redirectTo ? { redirectTo } : undefined
        );
        if (sbError) {
          setError(sbError.message);
        } else {
          setSuccess(
            "Si existe una cuenta con ese email, recibirás un enlace para restablecer la contraseña. Revisa tu bandeja y spam."
          );
        }
      } else {
        // Modo local: cambiar contraseña en este navegador
        if (!newPassword) {
          setError("Escribe la nueva contraseña");
          setLoading(false);
          return;
        }
        if (newPassword !== confirm) {
          setError("Las contraseñas no coinciden");
          setLoading(false);
          return;
        }
        const pwdError = validatePasswordStrength(newPassword);
        if (pwdError) {
          setError(pwdError);
          setLoading(false);
          return;
        }

        const raw = localStorage.getItem(LS_USERS_KEY);
        const users = raw ? JSON.parse(raw) : [];
        const idx = users.findIndex(
          (u: { email: string }) => u.email === normalEmail
        );
        if (idx === -1) {
          setError("No hay una cuenta con ese email en este navegador");
          setLoading(false);
          return;
        }
        users[idx].passwordHash = hashPasswordClient(newPassword);
        localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
        setSuccess("Contraseña actualizada. Ya puedes iniciar sesión.");
        setNewPassword("");
        setConfirm("");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#16161d] rounded-2xl border border-white/10 p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🔑</div>
          <h1 className="text-xl font-bold text-white">Recuperar cuenta</h1>
          <p className="text-sm text-gray-400 mt-1">
            {useSupabase
              ? "Te enviaremos un enlace a tu email"
              : "Restablece la contraseña en este dispositivo"}
          </p>
        </div>

        {success && (
          <div className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs text-center">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email de la cuenta</label>
            <input
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {!useSupabase && (
            <>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Nueva contraseña</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Confirmar</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repite la contraseña"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors disabled:opacity-50"
          >
            {loading
              ? "Procesando..."
              : useSupabase
                ? "Enviar enlace de recuperación"
                : "Cambiar contraseña"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 space-y-2 text-center">
          <Link href="/login" className="block text-sm text-primary hover:underline font-medium">
            Volver a iniciar sesión
          </Link>
          <Link href="/registro" className="block text-sm text-gray-400 hover:text-white">
            Crear cuenta nueva
          </Link>
        </div>
      </div>
    </div>
  );
}
