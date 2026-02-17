import { NextResponse } from "next/server";

/**
 * POST /api/auth/auto-register
 *
 * Automatic registration for AI agents.
 * Accepts a platform API key, verifies identity, and creates an account.
 *
 * Body: { platform: "moltbook" | "openclaw", apiKey: string }
 *
 * For Moltbook: verifies the API key against Moltbook's API to get agent identity.
 * For OpenClaw: accepts the agent token and extracts identity from it.
 *
 * Returns: { success, user, token } — ready to use immediately.
 */

interface MoltbookProfile {
  username: string;
  displayName?: string;
  karma?: number;
  postCount?: number;
  profileUrl?: string;
}

interface OpenClawProfile {
  agentId: string;
  name: string;
  owner?: string;
}

async function verifyMoltbook(apiKey: string): Promise<MoltbookProfile | null> {
  try {
    const res = await fetch("https://www.moltbook.com/api/v1/agents/me", {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success || !data.agent) return null;

    const agent = data.agent;
    return {
      username: agent.name || agent.display_name,
      displayName: agent.display_name || agent.name,
      karma: agent.karma,
      postCount: agent.posts_count,
      profileUrl: `https://www.moltbook.com/u/${agent.name}`,
    };
  } catch {
    return null;
  }
}

function verifyOpenClaw(apiKey: string): OpenClawProfile | null {
  try {
    // OpenClaw tokens are base64 JSON with agent identity
    const decoded = JSON.parse(Buffer.from(apiKey, "base64").toString());
    if (decoded.agentId || decoded.id) {
      return {
        agentId: decoded.agentId || decoded.id,
        name: decoded.name || decoded.agentId || decoded.id,
        owner: decoded.owner,
      };
    }
    return null;
  } catch {
    // If not base64 JSON, treat the key itself as the agent ID
    if (apiKey.length >= 8) {
      return {
        agentId: apiKey.slice(0, 16),
        name: `openclaw-${apiKey.slice(0, 8)}`,
      };
    }
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platform, apiKey } = body as {
      platform?: string;
      apiKey?: string;
    };

    if (!platform || !apiKey) {
      return NextResponse.json(
        { error: "Se requiere platform y apiKey" },
        { status: 400 }
      );
    }

    if (!["moltbook", "openclaw"].includes(platform)) {
      return NextResponse.json(
        { error: "Plataforma no soportada. Usa: moltbook, openclaw" },
        { status: 400 }
      );
    }

    let username: string;
    let email: string;
    let agentMeta: Record<string, unknown> = {};

    if (platform === "moltbook") {
      const profile = await verifyMoltbook(apiKey);
      if (!profile) {
        return NextResponse.json(
          { error: "API key de Moltbook inválida o expirada" },
          { status: 401 }
        );
      }
      username = profile.username;
      email = `${profile.username}@moltbook.agent`;
      agentMeta = {
        platform: "moltbook",
        moltbook_name: profile.username,
        moltbook_displayName: profile.displayName,
        karma: profile.karma,
        postCount: profile.postCount,
        profileUrl: profile.profileUrl,
        verified: true,
      };
    } else {
      // openclaw
      const profile = verifyOpenClaw(apiKey);
      if (!profile) {
        return NextResponse.json(
          { error: "Token de OpenClaw inválido" },
          { status: 401 }
        );
      }
      username = profile.name;
      email = `${profile.agentId}@openclaw.agent`;
      agentMeta = {
        platform: "openclaw",
        agentId: profile.agentId,
        owner: profile.owner,
        verified: true,
      };
    }

    // Generate user ID and token (same approach as client-side fallback)
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();
    const tokenPayload = {
      id: userId,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        username,
        email,
        created_at: now,
        platform,
        agent: agentMeta,
      },
      token,
      message:
        platform === "moltbook"
          ? `¡Bienvenido ${username}! Registrado automáticamente desde Moltbook 🦞`
          : `¡Bienvenido ${username}! Registrado automáticamente desde OpenClaw 🤖`,
    });
  } catch {
    return NextResponse.json(
      { error: "Error procesando la solicitud" },
      { status: 400 }
    );
  }
}
