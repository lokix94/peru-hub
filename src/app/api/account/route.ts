import { NextRequest, NextResponse } from "next/server";
import {
  getUserFromToken,
  getUserAgents,
  getUserSkills,
  getUserTransactions,
  getUserStats,
} from "@/lib/store";

/**
 * GET /api/account — full account data (profile + agents + skills + transactions + stats)
 */

export async function GET(req: NextRequest) {
  const user = getUserFromToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const agents = getUserAgents(user.id);
  const installedSkills = getUserSkills(user.id);
  const transactions = getUserTransactions(user.id);
  const stats = getUserStats(user.id);

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    },
    agents,
    installedSkills,
    transactions,
    stats,
  });
}
