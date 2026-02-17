import { NextRequest, NextResponse } from "next/server";
import { skills } from "@/data/skills";
import {
  getUserFromToken,
  getAgentById,
  installSkill,
  createTransaction,
} from "@/lib/store";

/**
 * POST /api/skills/install — install one or more skills to an agent
 * Body: { agentId: string, skillIds: string[] }
 */

export async function POST(req: NextRequest) {
  const user = getUserFromToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { agentId, skillIds } = body as {
    agentId?: string;
    skillIds?: string[];
  };

  if (!agentId) {
    return NextResponse.json({ error: "agentId requerido" }, { status: 400 });
  }
  if (!skillIds || !Array.isArray(skillIds) || skillIds.length === 0) {
    return NextResponse.json({ error: "skillIds requerido (array)" }, { status: 400 });
  }

  // Verify agent belongs to user
  const agent = getAgentById(agentId);
  if (!agent || agent.user_id !== user.id) {
    return NextResponse.json(
      { error: "Agente no encontrado o no te pertenece" },
      { status: 404 }
    );
  }

  const installed = [];
  const notFound = [];
  let totalCost = 0;

  for (const skillId of skillIds) {
    const skillData = skills.find((s) => s.id === skillId);
    if (!skillData) {
      notFound.push(skillId);
      continue;
    }

    totalCost += skillData.price;

    const record = installSkill(
      user.id,
      agentId,
      skillData.id,
      skillData.name,
      skillData.icon
    );

    installed.push({
      id: record.id,
      skill_id: skillData.id,
      skill_name: skillData.name,
      skill_icon: skillData.icon,
      price: skillData.price,
      installed_at: record.installed_at,
      status: record.status,
    });
  }

  // Create transaction record
  if (installed.length > 0) {
    const desc =
      installed.length === 1
        ? `Instalado: ${installed[0].skill_name}`
        : `${installed.length} skills instalados`;

    createTransaction(
      user.id,
      "purchase",
      desc,
      totalCost > 0 ? -totalCost : 0,
      installed.map((s) => s.skill_id),
      agentId
    );
  }

  return NextResponse.json({
    success: true,
    installed,
    notFound: notFound.length > 0 ? notFound : undefined,
    agent: { id: agent.id, name: agent.name, platform: agent.platform },
    total: totalCost,
    message: `${installed.length} skill(s) instalados en ${agent.name} 🦞`,
  });
}
