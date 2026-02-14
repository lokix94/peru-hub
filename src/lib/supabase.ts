import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Check if Supabase is configured (env vars present).
 * When false, the app falls back to the local API auth routes.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Browser Supabase client — only call from client components.
 * Returns null when Supabase env vars are not set.
 */
export function createBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
