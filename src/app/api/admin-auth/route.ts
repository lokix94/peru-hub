import { NextResponse } from "next/server";

/**
 * POST /api/admin-auth
 * Validates the admin panel password.
 *
 * Set ADMIN_PASSWORD in Vercel / .env.local
 * If not set, falls back to a demo password (only for local development).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body as { password?: string };

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Contraseña requerida" },
        { status: 400 }
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    // In production without env var, reject (force configuration)
    if (!adminPassword) {
      const isProd = process.env.NODE_ENV === "production";
      if (isProd) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Admin no configurado. Define ADMIN_PASSWORD en las variables de entorno.",
          },
          { status: 503 }
        );
      }
      // Local / demo only
      if (password === "langosta2026!admin") {
        return NextResponse.json({ success: true, mode: "demo" });
      }
      return NextResponse.json(
        { success: false, error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

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
