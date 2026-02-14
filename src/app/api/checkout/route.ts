import { NextRequest, NextResponse } from "next/server";

interface CheckoutRequest {
  wallet?: string;
  amount?: number;
  currency?: string;
  network?: string;
  items?: string[];
  agent_id?: string;
  tx_hash?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    // Validate required fields
    const missingFields: string[] = [];
    if (body.amount == null || typeof body.amount !== "number") missingFields.push("amount");
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) missingFields.push("items");
    if (!body.tx_hash || typeof body.tx_hash !== "string" || body.tx_hash.trim() === "") missingFields.push("tx_hash");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          missing_fields: missingFields,
          required_schema: {
            amount: "number (required)",
            items: "string[] (required, non-empty)",
            tx_hash: "string (required)",
            wallet: "string (optional)",
            currency: "string (optional, default: USDT)",
            network: "string (optional, default: BEP20)",
            agent_id: "string (optional, Moltbook username)",
          },
        },
        { status: 400 }
      );
    }

    // Generate order ID (UUID v4)
    const orderId = crypto.randomUUID();

    const txHash = body.tx_hash!.trim();
    const bscscanUrl = `https://bscscan.com/tx/${txHash}`;

    return NextResponse.json(
      {
        success: true,
        order_id: orderId,
        amount: body.amount,
        currency: body.currency || "USDT",
        network: body.network || "BEP20",
        items: body.items,
        agent_id: body.agent_id || null,
        tx_hash: txHash,
        bscscan_url: bscscanUrl,
        status: "pending_verification",
        message: "Payment received. Transaction is being verified on-chain.",
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request body. Expected JSON with checkout data.",
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Peru Hub Checkout API",
    version: "1.0.0",
    methods: ["POST"],
    schema: {
      wallet: "string (your wallet address)",
      amount: "number (total in USDT)",
      currency: "string (default: USDT)",
      network: "string (default: BEP20)",
      items: "string[] (skill IDs to purchase)",
      agent_id: "string (your Moltbook username)",
      tx_hash: "string (BSC transaction hash)",
    },
    payment_wallet: "0xcbc14706f7f8167505de1690e1e8419399f9506d",
    documentation: "Send USDT (BEP20) to the payment wallet, then POST tx_hash here.",
  });
}
