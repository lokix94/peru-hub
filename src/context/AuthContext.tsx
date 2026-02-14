"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export interface AuthAgent {
  id: string;
  name: string;
  platform: string;
  api_key?: string;
  verified: boolean;
  created_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  agents: AuthAgent[];
  signUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  addAgent: (
    name: string,
    platform: string,
    apiKey?: string
  ) => Promise<{ success: boolean; error?: string }>;
  removeAgent: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USER_KEY = "peru-hub-auth-user";
const STORAGE_TOKEN_KEY = "peru-hub-auth-token";
const STORAGE_AGENTS_KEY = "peru-hub-agents";

/* ------------------------------------------------------------------ */
/*  Helper — localStorage                                             */
/* ------------------------------------------------------------------ */

function loadFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function removeFromStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState<AuthAgent[]>([]);

  /* ---- Bootstrap: restore session ---- */
  useEffect(() => {
    async function restore() {
      try {
        if (isSupabaseConfigured()) {
          const supabase = createBrowserClient();
          if (supabase) {
            const {
              data: { session },
            } = await supabase.auth.getSession();
            if (session?.user) {
              const u: AuthUser = {
                id: session.user.id,
                email: session.user.email ?? "",
                username:
                  (session.user.user_metadata?.username as string) ?? session.user.email ?? "",
                created_at: session.user.created_at,
              };
              setUser(u);
              saveToStorage(STORAGE_USER_KEY, u);
            }
          }
        } else {
          // Fallback: check localStorage + validate via /api/auth/me
          const token = loadFromStorage<string>(STORAGE_TOKEN_KEY);
          if (token) {
            const res = await fetch("/api/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              setUser(data.user);
              saveToStorage(STORAGE_USER_KEY, data.user);
            } else {
              // Token expired / invalid
              removeFromStorage(STORAGE_TOKEN_KEY);
              removeFromStorage(STORAGE_USER_KEY);
            }
          }
        }

        // Load agents from localStorage (works for both modes in demo)
        const savedAgents = loadFromStorage<AuthAgent[]>(STORAGE_AGENTS_KEY);
        if (savedAgents) setAgents(savedAgents);
      } catch {
        /* silent fail */
      } finally {
        setIsLoading(false);
      }
    }
    restore();
  }, []);

  // Persist agents whenever they change
  useEffect(() => {
    if (agents.length > 0) {
      saveToStorage(STORAGE_AGENTS_KEY, agents);
    }
  }, [agents]);

  /* ---- Sign Up ---- */
  const signUp = useCallback(
    async (
      username: string,
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string; needsVerification?: boolean }> => {
      try {
        if (isSupabaseConfigured()) {
          const supabase = createBrowserClient();
          if (!supabase) return { success: false, error: "Error de configuración" };
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username } },
          });
          if (error) return { success: false, error: error.message };
          if (data.user && !data.session) {
            // Email confirmation required
            return { success: true, needsVerification: true };
          }
          if (data.user && data.session) {
            const u: AuthUser = {
              id: data.user.id,
              email: data.user.email ?? "",
              username,
              created_at: data.user.created_at,
            };
            setUser(u);
            saveToStorage(STORAGE_USER_KEY, u);
            return { success: true };
          }
          return { success: false, error: "Error inesperado" };
        }

        // Fallback API
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();
        if (!res.ok) return { success: false, error: data.error ?? "Error al registrar" };
        setUser(data.user);
        saveToStorage(STORAGE_USER_KEY, data.user);
        saveToStorage(STORAGE_TOKEN_KEY, data.token);
        return { success: true };
      } catch {
        return { success: false, error: "Error de conexión" };
      }
    },
    []
  );

  /* ---- Sign In ---- */
  const signIn = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        if (isSupabaseConfigured()) {
          const supabase = createBrowserClient();
          if (!supabase) return { success: false, error: "Error de configuración" };
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) return { success: false, error: error.message };
          if (data.user) {
            const u: AuthUser = {
              id: data.user.id,
              email: data.user.email ?? "",
              username:
                (data.user.user_metadata?.username as string) ?? data.user.email ?? "",
              created_at: data.user.created_at,
            };
            setUser(u);
            saveToStorage(STORAGE_USER_KEY, u);
            return { success: true };
          }
          return { success: false, error: "Error inesperado" };
        }

        // Fallback API
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) return { success: false, error: data.error ?? "Error al iniciar sesión" };
        setUser(data.user);
        saveToStorage(STORAGE_USER_KEY, data.user);
        saveToStorage(STORAGE_TOKEN_KEY, data.token);
        return { success: true };
      } catch {
        return { success: false, error: "Error de conexión" };
      }
    },
    []
  );

  /* ---- Sign Out ---- */
  const signOut = useCallback(async () => {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createBrowserClient();
        if (supabase) await supabase.auth.signOut();
      }
    } catch {
      /* ignore */
    }
    setUser(null);
    setAgents([]);
    removeFromStorage(STORAGE_USER_KEY);
    removeFromStorage(STORAGE_TOKEN_KEY);
    removeFromStorage(STORAGE_AGENTS_KEY);
  }, []);

  /* ---- Agents ---- */
  const addAgent = useCallback(
    async (
      name: string,
      platform: string,
      apiKey?: string
    ): Promise<{ success: boolean; error?: string }> => {
      if (!name.trim()) return { success: false, error: "El nombre es obligatorio" };
      if (!platform) return { success: false, error: "Selecciona una plataforma" };
      const agent: AuthAgent = {
        id: crypto.randomUUID(),
        name: name.trim(),
        platform,
        api_key: apiKey || undefined,
        verified: false,
        created_at: new Date().toISOString(),
      };
      setAgents((prev) => {
        const next = [...prev, agent];
        saveToStorage(STORAGE_AGENTS_KEY, next);
        return next;
      });
      return { success: true };
    },
    []
  );

  const removeAgent = useCallback((id: string) => {
    setAgents((prev) => {
      const next = prev.filter((a) => a.id !== id);
      saveToStorage(STORAGE_AGENTS_KEY, next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        agents,
        signUp,
        signIn,
        signOut,
        addAgent,
        removeAgent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
