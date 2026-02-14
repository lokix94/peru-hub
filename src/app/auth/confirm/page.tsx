"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

/**
 * /auth/confirm
 *
 * Client-side handler for Supabase email confirmation links that use
 * hash fragments (implicit flow):
 *   /auth/confirm#access_token=...&type=signup&...
 *
 * Extracts the hash params, sets the Supabase session, and redirects.
 */

type Status = "loading" | "success" | "error";

export default function AuthConfirmPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function handleConfirmation() {
      try {
        // Parse hash fragment
        const hash = window.location.hash.substring(1); // remove #
        if (!hash) {
          setErrorMsg("No se encontró información de autenticación en el enlace.");
          setStatus("error");
          return;
        }

        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        // If we have access_token + refresh_token, set session directly
        if (accessToken && refreshToken) {
          if (!isSupabaseConfigured()) {
            setErrorMsg("Supabase no está configurado.");
            setStatus("error");
            return;
          }

          const supabase = createBrowserClient();
          if (!supabase) {
            setErrorMsg("Error al inicializar el cliente de autenticación.");
            setStatus("error");
            return;
          }

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("setSession error:", error.message);
            setErrorMsg(error.message);
            setStatus("error");
            return;
          }

          setStatus("success");

          // Redirect based on type
          setTimeout(() => {
            if (type === "recovery") {
              router.push("/account");
            } else {
              // signup confirmation — send to login with success
              router.push("/login?confirmed=true");
            }
          }, 2000);
          return;
        }

        // If we have a token_hash + type, use verifyOtp
        const tokenHash = params.get("token_hash") || params.get("token");
        const otpType = params.get("type");

        if (tokenHash && otpType) {
          if (!isSupabaseConfigured()) {
            setErrorMsg("Supabase no está configurado.");
            setStatus("error");
            return;
          }

          const supabase = createBrowserClient();
          if (!supabase) {
            setErrorMsg("Error al inicializar el cliente de autenticación.");
            setStatus("error");
            return;
          }

          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: otpType as "signup" | "email" | "recovery" | "invite",
          });

          if (error) {
            console.error("verifyOtp error:", error.message);
            setErrorMsg(error.message);
            setStatus("error");
            return;
          }

          setStatus("success");
          setTimeout(() => {
            router.push("/login?confirmed=true");
          }, 2000);
          return;
        }

        // No recognizable params
        setErrorMsg("El enlace de confirmación no es válido o ha expirado.");
        setStatus("error");
      } catch (err) {
        console.error("Auth confirm exception:", err);
        setErrorMsg("Ocurrió un error inesperado.");
        setStatus("error");
      }
    }

    handleConfirmation();
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#16161d] rounded-2xl border border-white/10 p-8 text-center animate-fade-in">
        {status === "loading" && (
          <>
            <div className="text-5xl mb-4 animate-bounce">🦞</div>
            <h1 className="text-xl font-bold text-white mb-2">
              Verificando tu email...
            </h1>
            <p className="text-sm text-gray-400">
              Estamos confirmando tu cuenta. Un momento por favor.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-xl font-bold text-white mb-2">
              ¡Email confirmado exitosamente!
            </h1>
            <p className="text-sm text-gray-400 mb-6">
              Tu cuenta ha sido verificada. Redirigiendo...
            </p>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-xl font-bold text-white mb-2">
              El enlace ha expirado o es inválido
            </h1>
            <p className="text-sm text-gray-400 mb-6">
              {errorMsg || "No pudimos verificar tu email. Intenta registrarte de nuevo."}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/registro"
                className="inline-block px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
              >
                Registrarse de nuevo
              </Link>
              <Link
                href="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Ir a Iniciar Sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
