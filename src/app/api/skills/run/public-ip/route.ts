import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/skills/run/public-ip
 * Información de IP pública del cliente (ipapi.co free tier).
 * Body: { ip?: string } — si no se envía, intenta detectar desde headers.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    let ip = typeof body.ip === "string" ? body.ip.trim() : "";

    if (!ip) {
      const fwd =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "";
      ip = fwd.split(",")[0].trim();
    }

    // Fallback: servicio que devuelve la IP de salida del servidor
    if (!ip || ip === "::1" || ip === "127.0.0.1") {
      const me = await fetch("https://api.ipify.org?format=json");
      if (me.ok) {
        const j = await me.json();
        ip = j.ip || ip;
      }
    }

    if (!ip) {
      return NextResponse.json(
        { success: false, error: "No se pudo determinar la IP" },
        { status: 400 }
      );
    }

    const geoRes = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      headers: { "User-Agent": "LangostaHub/1.0" },
    });

    let geo: Record<string, unknown> = {};
    if (geoRes.ok) {
      geo = await geoRes.json();
    }

    return NextResponse.json({
      success: true,
      real: true,
      skill: "network-scout",
      provider: "ipify + ipapi.co",
      ip,
      city: geo.city ?? null,
      region: geo.region ?? null,
      country: geo.country_name ?? geo.country ?? null,
      org: geo.org ?? null,
      timezone: geo.timezone ?? null,
      latitude: geo.latitude ?? null,
      longitude: geo.longitude ?? null,
    });
  } catch (e) {
    console.error("[public-ip]", e);
    return NextResponse.json(
      { success: false, error: "Error al consultar IP" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    skill: "network-scout",
    method: "POST",
    body: { ip: "8.8.8.8" },
  });
}
