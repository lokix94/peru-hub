import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/store";

export async function GET(req: NextRequest) {
  const user = getUserFromToken(req.headers.get("authorization"));
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  return NextResponse.json({
    success: true,
    user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at },
  });
}
