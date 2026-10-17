import { NextRequest, NextResponse } from "next/server";
import {
  PAYMENT_WALLET,
  NETWORK,
  ROYALTY,
  isValidTxHash,
  calculateRoyalties,
} from "@/lib/payments";

/**
 * Checkout Controller (Java-style)
 * POST — register a payment intent / order after user sent USDT
 * GET  — schema + payment wallet info
 */

interface CheckoutBody {
  wallet?: string;
  amount?: number;
  currency?: string;
  network?: string;
  items?: string[] | { skillId: string; skillName?: string; price?: number; quantity?: number }[];
  agent_id?: string;
  tx_hash?: string;
  buyer_email?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutBody = await request.json();

    const missing: string[] = [];
    if (body.amount == null || typeof body.amount !== "number" || body.amount < 0) {
      missing.push("amount");
    }
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      missing.push("items");
    }
    if (!body.tx_hash || typeof body.tx_hash !== "string" || !body.tx_hash.trim()) {
      missing.push("tx_hash");
    }

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Campos obligatorios faltantes",
          missing_fields: missing,
          required_schema: {
            amount: "number (USDT total)",
            items: "string[] skill ids o objetos { skillId, price, quantity }",
            tx_hash: "string (hash BSC 0x...)",
            wallet: "string (opcional, wallet del comprador)",
            agent_id: "string (opcional)",
            buyer_email: "string (opcional)",
          },
        },
        { status: 400 }
      );
    }

    const txHash = body.tx_hash!.trim();
    if (!isValidTxHash(txHash)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Hash de transacción inválido. Debe ser 0x seguido de 64 caracteres hexadecimales.",
        },
        { status: 400 }
      );
    }

    const orderId = crypto.randomUUID();
    const amount = Number(body.amount);
    const { developerShare, platformFee } = calculateRoyalties(amount);

    // Normalize items for response
    const normalizedItems = body.items!.map((it) => {
      if (typeof it === "string") {
        return { skillId: it, quantity: 1 };
      }
      return {
        skillId: it.skillId,
        skillName: it.skillName,
        price: it.price,
        quantity: it.quantity ?? 1,
      };
    });

    return NextResponse.json(
      {
        success: true,
        order_id: orderId,
        amount,
        currency: body.currency || NETWORK.currency,
        network: body.network || NETWORK.tokenStandard,
        items: normalizedItems,
        agent_id: body.agent_id || null,
        buyer_email: body.buyer_email || null,
        tx_hash: txHash,
        bscscan_url: NETWORK.explorerTx(txHash),
        payment_wallet: PAYMENT_WALLET,
        royalties: {
          developer_share: developerShare,
          platform_fee: platformFee,
          split: `${ROYALTY.developerShare * 100}/${ROYALTY.platformShare * 100}`,
        },
        status: "pending_verification",
        message:
          "Pago registrado. Verifica el hash en /api/verify-transaction para confirmar on-chain.",
        next_step: {
          method: "POST",
          url: "/api/verify-transaction",
          body: {
            txHash,
            expectedAmount: amount,
            buyerEmail: body.buyer_email || "",
          },
        },
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "JSON inválido. Envía amount, items y tx_hash.",
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Langosta Hub Checkout API",
    version: "2.0.0",
    methods: ["GET", "POST"],
    payment: {
      wallet: PAYMENT_WALLET,
      currency: NETWORK.currency,
      network: NETWORK.tokenStandard,
      chainId: NETWORK.chainId,
      usdt_contract: "0x55d398326f99059fF775485246999027B3197955",
      explorer: NETWORK.explorerAddress(PAYMENT_WALLET),
    },
    royalties: {
      developer: `${ROYALTY.developerShare * 100}%`,
      platform: `${ROYALTY.platformShare * 100}%`,
      min_withdraw_usdt: ROYALTY.minWithdrawUsdt,
    },
    schema: {
      amount: "number (total USDT)",
      items: "string[] o { skillId, price?, quantity? }[]",
      tx_hash: "string (BSC tx hash)",
      wallet: "string (opcional)",
      agent_id: "string (opcional)",
      buyer_email: "string (opcional)",
    },
    documentation:
      "1) Envía USDT BEP20 a la wallet. 2) POST aquí con tx_hash. 3) POST /api/verify-transaction.",
  });
}
