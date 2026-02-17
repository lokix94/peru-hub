import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email?.trim()) return NextResponse.json({ error: "El email es obligatorio" }, { status: 400 });
    if (!password) return NextResponse.json({ error: "La contraseña es obligatoria" }, { status: 400 });

    const result = authenticateUser(email.trim(), password);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 401 });

    return NextResponse.json({
      success: true,
      user: { id: result.user.id, username: result.user.username, email: result.user.email, created_at: result.user.created_at },
      token: result.token,
    });
  } catch {
    return NextResponse.json({ error: "Error en la solicitud" }, { status: 400 });
  }
}
