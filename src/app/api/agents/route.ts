import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, createAgent, getUserAgents, deleteAgent } from "@/lib/store";

/**
 * GET /api/agents — list user's linked agents
 * POST /api/agents — link a new agent
 * DELETE /api/agents?id=xxx — unlink an agent
 */

export async function GET(req: NextRequest) {
  const user = getUserFromToken(req.headers.get("authorization"));
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const agents = getUserAgents(user.id);
  return NextResponse.json({ success: true, agents });
}

export async function POST(req: NextRequest) {
  const user = getUserFromToken(req.headers.get("authorization"));
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = await req.json();
  const { name, platform, apiKey, verified, metadata } = body as {
    name?: string;
    platform?: string;
    apiKey?: string;
    verified?: boolean;
    metadata?: Record<string, unknown>;
  };

  if (!name?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  if (!platform?.trim()) return NextResponse.json({ error: "Plataforma requerida" }, { status: 400 });

  const agent = createAgent(user.id, name.trim(), platform.trim(), apiKey, verified ?? false, metadata);

  return NextResponse.json({ success: true, agent });
}

export async function DELETE(req: NextRequest) {
  const user = getUserFromToken(req.headers.get("authorization"));
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const deleted = deleteAgent(id, user.id);
  if (!deleted) return NextResponse.json({ error: "Agente no encontrado" }, { status: 404 });

  return NextResponse.json({ success: true });
}
