import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body as { password?: string };

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Contraseña requerida" },
        { status: 400 }
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD || "langosta2026!admin";

    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Contraseña incorrecta" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Error en la solicitud" },
      { status: 400 }
    );
  }
}
