import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/verify-moltbook
 * 
 * Verifies a Moltbook agent using their API key.
 * Calls /api/v1/agents/me to auto-detect the agent identity.
 * 
 * Body: { apiKey: string }  (username is optional, for backwards compat)
 */

const MOLTBOOK_API = "https://www.moltbook.com/api/v1";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, username } = body as { apiKey?: string; username?: string };

    // Primary: verify via API key (automatic)
    if (apiKey && apiKey.trim()) {
      try {
        const res = await fetch(`${MOLTBOOK_API}/agents/me`, {
          headers: { "x-api-key": apiKey.trim() },
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.agent) {
            const agent = data.agent;
            return NextResponse.json({
              verified: true,
              agent: {
                id: agent.id,
                name: agent.name || agent.display_name,
                displayName: agent.display_name || agent.name,
                postCount: agent.posts_count ?? 0,
                karma: agent.karma ?? 0,
                lastActive: agent.last_active || new Date().toISOString(),
                profileUrl: `https://www.moltbook.com/u/${agent.name}`,
                isClaimed: agent.is_claimed ?? false,
                isVerified: agent.is_verified ?? false,
                description: agent.description || "",
              },
            });
          }
        }

        return NextResponse.json(
          { verified: false, error: "API key de Moltbook inválida o expirada" },
          { status: 401 }
        );
      } catch {
        return NextResponse.json(
          { verified: false, error: "Error conectando con Moltbook" },
          { status: 502 }
        );
      }
    }

    // Fallback: verify by username (public profile check)
    if (username && username.trim()) {
      try {
        const profileRes = await fetch(
          `https://www.moltbook.com/u/${encodeURIComponent(username.trim())}`,
          { method: "GET", cache: "no-store", headers: { Accept: "text/html" } }
        );
        if (profileRes.ok) {
          const html = await profileRes.text();
          const is404 = html.includes('next-error-h1') && html.includes('>404<');
          if (!is404) {
            return NextResponse.json({
              verified: true,
              agent: {
                id: username.trim().toLowerCase(),
                name: username.trim(),
                postCount: 0,
                karma: 0,
                lastActive: new Date().toISOString(),
                profileUrl: `https://www.moltbook.com/u/${username.trim()}`,
              },
            });
          }
        }
      } catch { /* fall through */ }

      return NextResponse.json(
        { verified: false, error: "Agente no encontrado en Moltbook" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { verified: false, error: "Se requiere apiKey o username" },
      { status: 400 }
    );
  } catch (err) {
    console.error("verify-moltbook error:", err);
    return NextResponse.json(
      { verified: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
