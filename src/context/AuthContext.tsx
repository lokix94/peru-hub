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

export interface MoltbookData {
  moltbook_id: string;
  moltbook_name: string;
  post_count: number;
  karma: number;
  last_active: string;
  profile_url: string;
}

export interface AuthAgent {
  id: string;
  name: string;
  platform: string;
  api_key?: string;
  verified: boolean;
  created_at: string;
  moltbook_data?: MoltbookData;
}

interface StoredUserLocal {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  created_at: string;
  agents: AuthAgent[];
}

interface SessionLocal {
  user: AuthUser;
  token: string;
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
  autoRegister: (
    platform: "moltbook" | "openclaw",
    apiKey: string
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  addAgent: (
    name: string,
    platform: string,
    apiKey?: string,
    moltbookData?: MoltbookData,
    verified?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  removeAgent: (id: string) => Promise<void>;
  updateAgent: (id: string, updates: Partial<AuthAgent>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Keys                                                               */
/* ------------------------------------------------------------------ */

const LEGACY_USER_KEY = "peru-hub-auth-user";
const LEGACY_TOKEN_KEY = "peru-hub-auth-token";
const LEGACY_AGENTS_KEY = "peru-hub-agents";

const LS_USERS_KEY = "langosta-users";
const LS_SESSION_KEY = "langosta-session";

/* ------------------------------------------------------------------ */
/*  Helpers — localStorage                                             */
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
/*  Client-side password hashing + validation                           */
/* ------------------------------------------------------------------ */

const SALT = "langosta-hub-salt-2026";

function hashPasswordClient(password: string): string {
  return btoa(`${SALT}:${password}`);
}

function verifyPasswordClient(password: string, hash: string): boolean {
  return hashPasswordClient(password) === hash;
}

function validatePasswordStrength(password: string): string | null {
  if (!password || password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres";
  }
  if (password.length > 128) {
    return "La contraseña es demasiado larga";
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return "La contraseña debe contener al menos una letra y un número";
  }
  return null;
}

function sanitizeUsername(username: string): string | null {
  const cleaned = username.trim();
  if (cleaned.length < 3 || cleaned.length > 32) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(cleaned)) return null;
  return cleaned;
}

/* ------------------------------------------------------------------ */
/*  Client-side token generation                                       */
/* ------------------------------------------------------------------ */

function generateTokenClient(userId: string): string {
  const payload = { id: userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  return btoa(JSON.stringify(payload));
}

function verifyTokenClient(token: string): { id: string } | null {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) return null;
    return { id: payload.id };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Client-side user store helpers                                     */
/* ------------------------------------------------------------------ */

function getLocalUsers(): StoredUserLocal[] {
  return loadFromStorage<StoredUserLocal[]>(LS_USERS_KEY) ?? [];
}

function saveLocalUsers(users: StoredUserLocal[]) {
  saveToStorage(LS_USERS_KEY, users);
}

function getLocalSession(): SessionLocal | null {
  return loadFromStorage<SessionLocal>(LS_SESSION_KEY);
}

function saveLocalSession(session: SessionLocal) {
  saveToStorage(LS_SESSION_KEY, session);
}

function clearLocalSession() {
  removeFromStorage(LS_SESSION_KEY);
}

/* ------------------------------------------------------------------ */
/*  Supabase agents helpers                                            */
/* ------------------------------------------------------------------ */

async function fetchAgentsFromSupabase(userId: string): Promise<AuthAgent[]> {
  const supabase = createBrowserClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("agents")
    .select("id, name, platform, api_key, verified, metadata, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[Auth] Failed to load agents from Supabase:", error?.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    platform: row.platform,
    api_key: row.api_key ? "••••••••" : undefined,
    verified: !!row.verified,
    created_at: row.created_at,
    moltbook_data: (row.metadata as MoltbookData | null) ?? undefined,
  }));
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState<AuthAgent[]>([]);

  /* ---- Bootstrap: restore session + agents ---- */
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
                  (session.user.user_metadata?.username as string) ??
                  session.user.email ??
                  "",
                created_at: session.user.created_at,
              };
              setUser(u);
              const loaded = await fetchAgentsFromSupabase(u.id);
              setAgents(loaded);
            }
          }
        } else {
          const session = getLocalSession();
          if (session && session.token) {
            const tokenData = verifyTokenClient(session.token);
            if (tokenData) {
              setUser(session.user);
              const users = getLocalUsers();
              const storedUser = users.find((u) => u.id === session.user.id);
              if (storedUser?.agents) {
                setAgents(storedUser.agents);
              }
            } else {
              clearLocalSession();
            }
          }
        }

        removeFromStorage(LEGACY_USER_KEY);
        removeFromStorage(LEGACY_TOKEN_KEY);
      } catch {
        /* silent fail */
      } finally {
        setIsLoading(false);
      }
    }
    restore();
  }, []);

  /* ---- Sign Up ---- */
  const signUp = useCallback(
    async (
      username: string,
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string; needsVerification?: boolean }> => {
      try {
        const pwdError = validatePasswordStrength(password);
        if (pwdError) return { success: false, error: pwdError };

        const safeUsername = sanitizeUsername(username);
        if (!safeUsername) {
          return {
            success: false,
            error: "Usuario inválido (3-32 caracteres, solo letras, números, _ o -)",
          };
        }

        const normalEmail = email.toLowerCase().trim();
        if (!normalEmail.includes("@") || normalEmail.length < 5) {
          return { success: false, error: "Email inválido" };
        }

        if (isSupabaseConfigured()) {
          const supabase = createBrowserClient();
          if (!supabase) return { success: false, error: "Error de configuración" };
          const emailRedirectTo =
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/confirm`
              : undefined;
          const { data, error } = await supabase.auth.signUp({
            email: normalEmail,
            password,
            options: {
              data: { username: safeUsername },
              ...(emailRedirectTo ? { emailRedirectTo } : {}),
            },
          });
          if (error) return { success: false, error: error.message };
          if (data.user && !data.session) {
            return { success: true, needsVerification: true };
          }
          if (data.user && data.session) {
            const u: AuthUser = {
              id: data.user.id,
              email: data.user.email ?? "",
              username: safeUsername,
              created_at: data.user.created_at,
            };
            setUser(u);
            setAgents([]);
            return { success: true };
          }
          return { success: false, error: "Error inesperado" };
        }

        // Local fallback
        const users = getLocalUsers();
        if (users.some((u) => u.email === normalEmail)) {
          return { success: false, error: "Ya existe una cuenta con este email" };
        }
        if (users.some((u) => u.username.toLowerCase() === safeUsername.toLowerCase())) {
          return { success: false, error: "Este nombre de usuario ya está en uso" };
        }

        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const newUser: StoredUserLocal = {
          id,
          username: safeUsername,
          email: normalEmail,
          passwordHash: hashPasswordClient(password),
          created_at: now,
          agents: [],
        };
        users.push(newUser);
        saveLocalUsers(users);

        const authUser: AuthUser = {
          id,
          email: normalEmail,
          username: safeUsername,
          created_at: now,
        };
        saveLocalSession({ user: authUser, token: generateTokenClient(id) });
        setUser(authUser);
        setAgents([]);
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
                (data.user.user_metadata?.username as string) ??
                data.user.email ??
                "",
              created_at: data.user.created_at,
            };
            setUser(u);
            const loaded = await fetchAgentsFromSupabase(u.id);
            setAgents(loaded);
            return { success: true };
          }
          return { success: false, error: "Error inesperado" };
        }

        const normalEmail = email.toLowerCase().trim();
        const users = getLocalUsers();
        const storedUser = users.find((u) => u.email === normalEmail);
        if (!storedUser) {
          return { success: false, error: "No existe una cuenta con este email" };
        }
        if (!verifyPasswordClient(password, storedUser.passwordHash)) {
          return { success: false, error: "Contraseña incorrecta" };
        }

        const authUser: AuthUser = {
          id: storedUser.id,
          email: storedUser.email,
          username: storedUser.username,
          created_at: storedUser.created_at,
        };
        saveLocalSession({
          user: authUser,
          token: generateTokenClient(storedUser.id),
        });
        setUser(authUser);
        setAgents(storedUser.agents ?? []);
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
    clearLocalSession();
    removeFromStorage(LEGACY_USER_KEY);
    removeFromStorage(LEGACY_TOKEN_KEY);
    removeFromStorage(LEGACY_AGENTS_KEY);
  }, []);

  /* ---- Auto Register (AI agents) ---- */
  const autoRegister = useCallback(
    async (
      platform: "moltbook" | "openclaw",
      apiKey: string
    ): Promise<{ success: boolean; error?: string; message?: string }> => {
      try {
        if (!apiKey?.trim()) {
          return { success: false, error: "API key requerida" };
        }

        const res = await fetch("/api/auth/auto-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform, apiKey: apiKey.trim() }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Error de registro automático" };
        }

        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          created_at: data.user.created_at,
        };

        if (!isSupabaseConfigured()) {
          const users = getLocalUsers();
          const existing = users.find(
            (u) =>
              u.email === authUser.email ||
              u.username.toLowerCase() === authUser.username.toLowerCase()
          );
          if (existing) {
            const token = generateTokenClient(existing.id);
            const existingAuth: AuthUser = {
              id: existing.id,
              email: existing.email,
              username: existing.username,
              created_at: existing.created_at,
            };
            saveLocalSession({ user: existingAuth, token });
            setUser(existingAuth);
            setAgents(existing.agents ?? []);
            return {
              success: true,
              message: `¡Bienvenido de vuelta, ${existing.username}! 🦞`,
            };
          }

          const newUser: StoredUserLocal = {
            id: authUser.id,
            username: authUser.username,
            email: authUser.email,
            passwordHash: hashPasswordClient(crypto.randomUUID()),
            created_at: authUser.created_at,
            agents: [
              {
                id: crypto.randomUUID(),
                name: authUser.username,
                platform,
                api_key: undefined,
                verified: true,
                created_at: authUser.created_at,
              },
            ],
          };
          users.push(newUser);
          saveLocalUsers(users);
          saveLocalSession({
            user: authUser,
            token: generateTokenClient(authUser.id),
          });
          setAgents(newUser.agents);
        } else {
          // Supabase mode: agents may already be created by the API
          const loaded = await fetchAgentsFromSupabase(authUser.id);
          setAgents(loaded);
        }

        setUser(authUser);
        return { success: true, message: data.message };
      } catch {
        return { success: false, error: "Error de conexión" };
      }
    },
    []
  );

  /* ---- Agents ---- */
  const addAgent = useCallback(
    async (
      name: string,
      platform: string,
      apiKey?: string,
      moltbookData?: MoltbookData,
      verified?: boolean
    ): Promise<{ success: boolean; error?: string }> => {
      if (!name.trim()) return { success: false, error: "El nombre es obligatorio" };
      if (!platform) return { success: false, error: "Selecciona una plataforma" };

      if (isSupabaseConfigured()) {
        const supabase = createBrowserClient();
        if (!supabase) return { success: false, error: "Error de configuración" };

        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
          return { success: false, error: "No autenticado" };
        }

        const { data, error } = await supabase
          .from("agents")
          .insert({
            user_id: session.user.id,
            name: name.trim(),
            platform,
            api_key: apiKey || null,
            verified: verified ?? !!moltbookData,
            metadata: moltbookData || {},
          })
          .select("id, name, platform, api_key, verified, metadata, created_at")
          .single();

        if (error || !data) {
          return {
            success: false,
            error: error?.message || "No se pudo guardar el agente",
          };
        }

        const agent: AuthAgent = {
          id: data.id,
          name: data.name,
          platform: data.platform,
          api_key: data.api_key ? "••••••••" : undefined,
          verified: !!data.verified,
          created_at: data.created_at,
          moltbook_data: (data.metadata as MoltbookData | null) ?? undefined,
        };
        setAgents((prev) => [agent, ...prev]);
        return { success: true };
      }

      // Local fallback
      const agent: AuthAgent = {
        id: crypto.randomUUID(),
        name: name.trim(),
        platform,
        api_key: apiKey ? "••••••••" : undefined,
        verified: verified ?? !!moltbookData,
        created_at: new Date().toISOString(),
        moltbook_data: moltbookData || undefined,
      };
      setAgents((prev) => {
        const next = [...prev, agent];
        const session = getLocalSession();
        if (session) {
          const users = getLocalUsers();
          const idx = users.findIndex((u) => u.id === session.user.id);
          if (idx >= 0) {
            users[idx].agents = next;
            saveLocalUsers(users);
          }
        }
        return next;
      });
      return { success: true };
    },
    []
  );

  const removeAgent = useCallback(async (id: string) => {
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      if (supabase) {
        await supabase.from("agents").delete().eq("id", id);
      }
    }

    setAgents((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (!isSupabaseConfigured()) {
        const session = getLocalSession();
        if (session) {
          const users = getLocalUsers();
          const idx = users.findIndex((u) => u.id === session.user.id);
          if (idx >= 0) {
            users[idx].agents = next;
            saveLocalUsers(users);
          }
        }
      }
      return next;
    });
  }, []);

  const updateAgent = useCallback(
    async (id: string, updates: Partial<AuthAgent>) => {
      if (isSupabaseConfigured()) {
        const supabase = createBrowserClient();
        if (supabase) {
          const payload: Record<string, unknown> = {};
          if (updates.name !== undefined) payload.name = updates.name;
          if (updates.platform !== undefined) payload.platform = updates.platform;
          if (updates.verified !== undefined) payload.verified = updates.verified;
          if (updates.moltbook_data !== undefined)
            payload.metadata = updates.moltbook_data;
          if (Object.keys(payload).length > 0) {
            await supabase.from("agents").update(payload).eq("id", id);
          }
        }
      }

      setAgents((prev) => {
        const next = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
        if (!isSupabaseConfigured()) {
          const session = getLocalSession();
          if (session) {
            const users = getLocalUsers();
            const idx = users.findIndex((u) => u.id === session.user.id);
            if (idx >= 0) {
              users[idx].agents = next;
              saveLocalUsers(users);
            }
          }
        }
        return next;
      });
    },
    []
  );

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
        autoRegister,
        addAgent,
        removeAgent,
        updateAgent,
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
