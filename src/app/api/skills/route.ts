import { NextRequest, NextResponse } from "next/server";
import { skills } from "@/data/skills";
import { getUserFromToken, getUserSkills, getAgentSkills } from "@/lib/store";

/**
 * GET /api/skills — list all available skills (public)
 * GET /api/skills?installed=true — list user's installed skills (auth required)
 * GET /api/skills?agent=xxx — list skills installed on a specific agent
 */

export async function GET(req: NextRequest) {
  const installed = req.nextUrl.searchParams.get("installed");
  const agentId = req.nextUrl.searchParams.get("agent");

  // List installed skills for user
  if (installed === "true") {
    const user = getUserFromToken(req.headers.get("authorization"));
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const userSkills = getUserSkills(user.id);
    return NextResponse.json({ success: true, skills: userSkills, count: userSkills.length });
  }

  // List skills for a specific agent
  if (agentId) {
    const user = getUserFromToken(req.headers.get("authorization"));
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const agentSkills = getAgentSkills(agentId);
    return NextResponse.json({ success: true, skills: agentSkills, count: agentSkills.length });
  }

  // List all available skills (public catalog)
  const catalog = skills.map((s) => ({
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
    isNew: s.isNew,
    isFeatured: s.isFeatured,
  }));

  return NextResponse.json({
    success: true,
    skills: catalog,
    count: catalog.length,
  });
}
