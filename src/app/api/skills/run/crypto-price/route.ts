import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/skills/run/crypto-price
 * Precios en vivo (CoinGecko, sin API key).
 * Body: { ids?: string, vs?: string }
 * Ejemplo: { "ids": "bitcoin,ethereum", "vs": "usd" }
 */

const DEFAULT_IDS = "bitcoin,ethereum,solana,binancecoin,tether";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const ids = String(body.ids || DEFAULT_IDS)
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 12)
      .join(",");
    const vs = String(body.vs || "usd").toLowerCase().slice(0, 8);

    const url =
      `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}` +
      `&vs_currencies=${encodeURIComponent(vs)}&include_24hr_change=true&include_market_cap=true`;

    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "LangostaHub/1.0" },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "CoinGecko no respondió. Intenta de nuevo." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const prices = Object.entries(data).map(([id, v]) => {
      const row = v as Record<string, number>;
      return {
        id,
        price: row[vs],
        change24h: row[`${vs}_24h_change`],
        marketCap: row[`${vs}_market_cap`],
        currency: vs.toUpperCase(),
      };
    });

    return NextResponse.json({
      success: true,
      real: true,
      skill: "crypto-price-radar",
      provider: "coingecko",
      count: prices.length,
      prices,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("[crypto-price]", e);
    return NextResponse.json(
      { success: false, error: "Error al obtener precios crypto" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    skill: "crypto-price-radar",
    method: "POST",
    body: { ids: "bitcoin,ethereum", vs: "usd" },
  });
}
