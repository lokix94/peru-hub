import { NextRequest, NextResponse } from "next/server";
import { skills } from "@/data/skills";
import { getUserFromToken, getUserSkills, getAgentSkills } from "@/lib/store";
import { getRuntimeForSkill, REAL_SKILL_RUNTIMES } from "@/lib/skill-runtime";

/**
 * GET /api/skills — list all available skills (public)
 * GET /api/skills?installed=true — list user's installed skills (auth required)
 * GET /api/skills?agent=xxx — list skills installed on a specific agent
 * GET /api/skills?real=true — only skills with live runtime on Langosta
 */

export async function GET(req: NextRequest) {
  const installed = req.nextUrl.searchParams.get("installed");
  const agentId = req.nextUrl.searchParams.get("agent");
  const realOnly = req.nextUrl.searchParams.get("real") === "true";

  if (installed === "true") {
    const user = getUserFromToken(req.headers.get("authorization"));
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const userSkills = getUserSkills(user.id);
    return NextResponse.json({ success: true, skills: userSkills, count: userSkills.length });
  }

  if (agentId) {
    const user = getUserFromToken(req.headers.get("authorization"));
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const agentSkills = getAgentSkills(agentId);
    return NextResponse.json({ success: true, skills: agentSkills, count: agentSkills.length });
  }

  let list = skills;
  if (realOnly) {
    const realIds = new Set(REAL_SKILL_RUNTIMES.map((r) => r.skillId));
    list = skills.filter((s) => realIds.has(s.id));
  }

  const catalog = list.map((s) => {
    const runtime = getRuntimeForSkill(s.id);
    return {
      id: s.id,
      name: s.name,
      icon: s.icon,
      author: s.author,
      price: s.price,
      originalPrice: s.originalPrice,
      category: s.category,
      rating: s.rating,
      installCount: s.installCount,
      description: s.description,
      shortDescription: s.shortDescription,
      isNew: s.isNew,
      isFeatured: s.isFeatured,
      isFree: s.isFree,
      // Real runtime flags
      isReal: !!runtime,
      runtime: runtime
        ? {
            endpoint: runtime.endpoint,
            method: runtime.method,
            provider: runtime.provider,
            license: runtime.license,
            sourceUrl: runtime.sourceUrl,
            installCommand: runtime.installCommand,
          }
        : null,
    };
  });

  return NextResponse.json({
    success: true,
    skills: catalog,
    count: catalog.length,
    realRuntimes: REAL_SKILL_RUNTIMES.length,
  });
}
