import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/skills/run/fx-rates
 * Tipos de cambio (Frankfurter / ECB data, gratis).
 * Body: { from?: string, to?: string, amount?: number }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const from = String(body.from || "USD").toUpperCase().slice(0, 3);
    const to = String(body.to || "PEN").toUpperCase().slice(0, 3);
    const amount = Math.max(0, Number(body.amount) || 1);

    const url = `https://api.frankfurter.app/latest?from=${from}&to=${to}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "No se pudo obtener el tipo de cambio" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const rate = data.rates?.[to];
    if (typeof rate !== "number") {
      return NextResponse.json(
        {
          success: false,
          error: `Par no soportado: ${from} → ${to}. Prueba USD, EUR, PEN no siempre está; usa USD→EUR o MXN.`,
        },
        { status: 400 }
      );
    }

    const converted = Number((amount * rate).toFixed(4));

    return NextResponse.json({
      success: true,
      real: true,
      skill: "fx-converter",
      provider: "frankfurter",
      base: data.base,
      date: data.date,
      from,
      to,
      amount,
      rate,
      converted,
      message: `${amount} ${from} = ${converted} ${to} (tasa ${rate})`,
    });
  } catch (e) {
    console.error("[fx-rates]", e);
    return NextResponse.json(
      { success: false, error: "Error de conversión de moneda" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    skill: "fx-converter",
    method: "POST",
    body: { from: "USD", to: "EUR", amount: 100 },
  });
}
