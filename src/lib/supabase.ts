import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Check if Supabase is configured (env vars present).
 * When false, the app falls back to localStorage / in-memory auth.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Browser Supabase client — only call from client components.
 * Returns null when Supabase env vars are not set.
 */
export function createBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Server-side Supabase client (Route Handlers, Server Components).
 * Uses the anon key. For elevated privileges use createServiceClient().
 */
export function createServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Service-role client (admin). ONLY use in secure server contexts.
 * Requires SUPABASE_SERVICE_ROLE_KEY — never expose to the browser.
 */
export function createServiceClient(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return null;
  return createSupabaseClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/** Database types (keep in sync with supabase/schema.sql) */
export type Profile = {
  id: string;
  username: string;
  email: string;
  balance?: number;
  role?: "user" | "admin" | "developer";
  created_at: string;
};

export type AgentRow = {
  id: string;
  user_id: string;
  name: string;
  platform: string;
  api_key?: string | null;
  verified: boolean;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

export type InstalledSkillRow = {
  id: string;
  user_id: string;
  agent_id: string;
  skill_id: string;
  skill_name: string;
  skill_icon?: string | null;
  status: "active" | "paused";
  installed_at: string;
};

export type PurchaseRow = {
  id: string;
  user_id: string | null;
  agent_id: string | null;
  skill_id: string;
  price: number;
  payment_method?: string | null;
  transaction_id?: string | null;
  created_at: string;
};

export type DeveloperProfile = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  wallet_bep20: string;
  moltbook_profile?: string | null;
  bio?: string | null;
  website?: string | null;
  total_earned: number;
  pending_payout: number;
  created_at: string;
  updated_at?: string;
};

export type SkillSubmission = {
  id: string;
  developer_id: string;
  user_id: string;
  skill_name: string;
  description: string;
  category: string;
  price: number;
  repo_url: string;
  source_code?: string | null;
  documentation?: string | null;
  tags?: string[] | null;
  emoji?: string;
  status: "pending" | "approved" | "rejected" | "archived";
  rejection_reason?: string | null;
  is_real?: boolean;
  runtime_endpoint?: string | null;
  installs_count?: number;
  sales_count?: number;
  total_revenue?: number;
  submitted_at: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  created_at: string;
  updated_at?: string;
};

export type Royalty = {
  id: string;
  developer_id: string;
  skill_submission_id?: string | null;
  purchase_id?: string | null;
  buyer_user_id?: string | null;
  amount_total: number;
  platform_fee: number;
  developer_share: number;
  status: "pending" | "paid" | "failed" | "cancelled";
  payout_tx_hash?: string | null;
  payout_wallet?: string | null;
  notes?: string | null;
  created_at: string;
  paid_at?: string | null;
};
