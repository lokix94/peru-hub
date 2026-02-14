import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * GET /auth/callback?code=...
 *
 * Server-side route handler that exchanges the Supabase PKCE auth code
 * for a session. Used when Supabase sends a redirect with ?code= param.
 *
 * If no code is present, redirects to /auth/confirm (the client-side
 * hash-fragment handler) for the implicit flow.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const origin = request.nextUrl.origin;

  if (!code) {
    // No code — redirect to client-side hash handler
    return NextResponse.redirect(`${origin}/auth/confirm`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(`${origin}/login?error=configuration`);
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error.message);
      return NextResponse.redirect(
        `${origin}/login?error=confirmation_failed`
      );
    }

    // Success — redirect to login with confirmed flag
    return NextResponse.redirect(`${origin}/login?confirmed=true`);
  } catch (err) {
    console.error("Auth callback exception:", err);
    return NextResponse.redirect(
      `${origin}/login?error=confirmation_failed`
    );
  }
}
