import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/agents/detect — auto-detect agent identity from API key
 * Body: { platform: "OpenClaw" | "Moltbook", apiKey: string }
 */

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { platform, apiKey } = body as { platform?: string; apiKey?: string };

  if (!platform || !apiKey?.trim()) {
    return NextResponse.json({ error: "platform y apiKey requeridos" }, { status: 400 });
  }

  if (platform === "Moltbook") {
    try {
      const res = await fetch("https://www.moltbook.com/api/v1/agents/me", {
        headers: { "x-api-key": apiKey.trim() },
      });
      if (!res.ok) {
        return NextResponse.json({ error: "API key de Moltbook inválida" }, { status: 401 });
      }
      const data = await res.json();
      if (data.success && data.agent) {
        return NextResponse.json({
          success: true,
          agent: {
            name: data.agent.name || data.agent.display_name,
            displayName: data.agent.display_name || data.agent.name,
            platform: "Moltbook",
            verified: true,
            metadata: {
              moltbook_id: data.agent.id,
              karma: data.agent.karma ?? 0,
              posts_count: data.agent.posts_count ?? 0,
              is_claimed: data.agent.is_claimed ?? false,
              description: data.agent.description || "",
              profile_url: `https://www.moltbook.com/u/${data.agent.name}`,
              last_active: data.agent.last_active,
            },
          },
        });
      }
      return NextResponse.json({ error: "Agente no encontrado" }, { status: 404 });
    } catch {
      return NextResponse.json({ error: "Error conectando con Moltbook" }, { status: 502 });
    }
  }

  if (platform === "OpenClaw") {
    try {
      const decoded = JSON.parse(Buffer.from(apiKey.trim(), "base64").toString());
      return NextResponse.json({
        success: true,
        agent: {
          name: decoded.name || decoded.agentId || decoded.id || "openclaw-agent",
          displayName: decoded.name || decoded.agentId,
          platform: "OpenClaw",
          verified: true,
          metadata: {
            agent_id: decoded.agentId || decoded.id,
            owner: decoded.owner,
            host: decoded.host,
          },
        },
      });
    } catch {
      // Treat as raw agent ID
      return NextResponse.json({
        success: true,
        agent: {
          name: `openclaw-${apiKey.trim().slice(0, 8)}`,
          platform: "OpenClaw",
          verified: true,
          metadata: { agent_id: apiKey.trim() },
        },
      });
    }
  }

  return NextResponse.json({ error: "Plataforma no soportada" }, { status: 400 });
}
