import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/skills/run/qr-data
 * Prepara payload + URL de imagen QR (api.qrserver.com gratis).
 * Body: { text: string, size?: number }
 * Ideal para que el agente pase un link de Langosta Hub al humano.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const text = String(body.text || "https://langosta-hub.vercel.app").trim();
    const size = Math.min(Math.max(Number(body.size) || 200, 80), 500);

    if (text.length < 2) {
      return NextResponse.json(
        { success: false, error: "Envía 'text' con el contenido del QR" },
        { status: 400 }
      );
    }

    const imageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;

    return NextResponse.json({
      success: true,
      real: true,
      skill: "qr-share",
      text,
      size,
      imageUrl,
      agent_pitch:
        "Usa QR Share para enviar a tu humano un código que abre Langosta Hub o cualquier link. Gratis en la tienda.",
      tip: "Pega imageUrl en un mensaje o email para que el humano escanee.",
    });
  } catch (e) {
    console.error("[qr-data]", e);
    return NextResponse.json(
      { success: false, error: "Error al crear QR" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    skill: "qr-share",
    method: "POST",
    body: { text: "https://langosta-hub.vercel.app/registro", size: 220 },
  });
}
