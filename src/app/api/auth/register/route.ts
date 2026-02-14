import { NextResponse } from "next/server";
import { createUser } from "@/lib/auth-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body as {
      username?: string;
      email?: string;
      password?: string;
    };

    // Validation
    if (!username || !username.trim()) {
      return NextResponse.json(
        { error: "El ID de usuario es obligatorio" },
        { status: 400 }
      );
    }
    if (username.trim().length < 3) {
      return NextResponse.json(
        { error: "El ID de usuario debe tener al menos 3 caracteres" },
        { status: 400 }
      );
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
      return NextResponse.json(
        { error: "El ID de usuario solo puede contener letras, números, guiones y guiones bajos" },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "El email es obligatorio" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "Ingresa un email válido" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "La contraseña es obligatoria" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: "La contraseña debe incluir al menos una mayúscula" },
        { status: 400 }
      );
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "La contraseña debe incluir al menos un número" },
        { status: 400 }
      );
    }

    const result = createUser(username.trim(), email.trim(), password);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        created_at: result.user.created_at,
      },
      token: result.token,
    });
  } catch {
    return NextResponse.json(
      { error: "Error en la solicitud" },
      { status: 400 }
    );
  }
}
