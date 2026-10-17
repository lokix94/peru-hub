import { NextRequest, NextResponse } from "next/server";
import {
  PAYMENT_WALLET,
  USDT_BEP20_CONTRACT,
  ROYALTY,
  isValidTxHash,
} from "@/lib/payments";

/**
 * VerifyTransaction Controller
 * POST — verify USDT BEP20 transfer to platform wallet on BSC
 */

const BSCSCAN_API = "https://api.etherscan.io/v2/api";

interface VerifyRequest {
  txHash: string;
  expectedAmount: number;
  buyerEmail?: string;
  /** If true and no API key, accept valid-format hash for demo (local testing) */
  allowDemo?: boolean;
}

interface VerifyResponse {
  verified: boolean;
  amount?: number;
  from?: string;
  to?: string;
  confirmations?: number;
  timestamp?: string;
  mode?: "onchain" | "demo";
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json();
    const { txHash, expectedAmount, buyerEmail, allowDemo } = body;

    if (!txHash || typeof txHash !== "string") {
      return NextResponse.json<VerifyResponse>(
        { verified: false, error: "Hash de transacción requerido" },
        { status: 400 }
      );
    }

    if (!isValidTxHash(txHash)) {
      return NextResponse.json<VerifyResponse>(
        {
          verified: false,
          error:
            "Hash inválido. Debe ser formato 0x + 64 caracteres hexadecimales.",
        },
        { status: 400 }
      );
    }

    if (typeof expectedAmount !== "number" || expectedAmount < 0) {
      return NextResponse.json<VerifyResponse>(
        { verified: false, error: "Monto esperado inválido" },
        { status: 400 }
      );
    }

    const API_KEY = process.env.BSCSCAN_API_KEY;

    // Demo mode when BSCScan is not configured (dev / preview)
    if (!API_KEY) {
      if (allowDemo || process.env.ALLOW_PAYMENT_DEMO === "true") {
        console.log(
          `[TX DEMO] hash=${txHash} amount=${expectedAmount} buyer=${buyerEmail || "-"}`
        );
        return NextResponse.json<VerifyResponse>({
          verified: true,
          amount: expectedAmount,
          from: "0xDemoBuyer000000000000000000000000000001",
          to: PAYMENT_WALLET,
          confirmations: ROYALTY.requiredConfirmations,
          timestamp: new Date().toISOString(),
          mode: "demo",
        });
      }
      return NextResponse.json<VerifyResponse>(
        {
          verified: false,
          error:
            "Verificación on-chain no configurada (BSCSCAN_API_KEY). Contacta al administrador o activa ALLOW_PAYMENT_DEMO.",
        },
        { status: 503 }
      );
    }

    // --- On-chain verification ---
    const receiptUrl = new URL(BSCSCAN_API);
    receiptUrl.searchParams.set("chainid", "56");
    receiptUrl.searchParams.set("module", "proxy");
    receiptUrl.searchParams.set("action", "eth_getTransactionReceipt");
    receiptUrl.searchParams.set("txhash", txHash.trim());
    receiptUrl.searchParams.set("apikey", API_KEY);

    const receiptRes = await fetch(receiptUrl.toString());
    if (!receiptRes.ok) {
      return NextResponse.json<VerifyResponse>(
        {
          verified: false,
          error: "Error al conectar con el explorador BSC. Intenta de nuevo.",
        },
        { status: 502 }
      );
    }

    const receiptData = await receiptRes.json();

    if (!receiptData.result) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "Transacción no encontrada. Revisa el hash en BscScan.",
      });
    }

    if (receiptData.result.status === "0x0") {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "La transacción falló en la blockchain.",
      });
    }

    const tokenTxUrl = new URL(BSCSCAN_API);
    tokenTxUrl.searchParams.set("chainid", "56");
    tokenTxUrl.searchParams.set("module", "account");
    tokenTxUrl.searchParams.set("action", "tokentx");
    tokenTxUrl.searchParams.set("contractaddress", USDT_BEP20_CONTRACT);
    tokenTxUrl.searchParams.set("address", PAYMENT_WALLET);
    tokenTxUrl.searchParams.set("page", "1");
    tokenTxUrl.searchParams.set("offset", "100");
    tokenTxUrl.searchParams.set("sort", "desc");
    tokenTxUrl.searchParams.set("apikey", API_KEY);

    const tokenRes = await fetch(tokenTxUrl.toString());
    if (!tokenRes.ok) {
      return NextResponse.json<VerifyResponse>(
        {
          verified: false,
          error: "Error al consultar transferencias USDT.",
        },
        { status: 502 }
      );
    }

    const tokenData = await tokenRes.json();

    if (tokenData.status !== "1" || !Array.isArray(tokenData.result)) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "No se encontraron transferencias USDT hacia nuestra wallet.",
      });
    }

    const matchingTx = tokenData.result.find(
      (tx: Record<string, string>) =>
        tx.hash.toLowerCase() === txHash.trim().toLowerCase()
    );

    if (!matchingTx) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error:
          "Esta transacción no es una transferencia de USDT BEP20 a la wallet de Langosta Hub.",
      });
    }

    if (matchingTx.to.toLowerCase() !== PAYMENT_WALLET.toLowerCase()) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "Wallet de destino incorrecta.",
      });
    }

    if (
      matchingTx.contractAddress.toLowerCase() !==
      USDT_BEP20_CONTRACT.toLowerCase()
    ) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "Token incorrecto. Solo USDT BEP20.",
      });
    }

    const decimals = Number(matchingTx.tokenDecimal) || 18;
    const amount = Number(matchingTx.value) / Math.pow(10, decimals);
    const confirmations = Number(matchingTx.confirmations) || 0;

    if (amount + 1e-8 < expectedAmount) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        amount,
        from: matchingTx.from,
        to: matchingTx.to,
        confirmations,
        error: `Monto insuficiente. Esperado $${expectedAmount.toFixed(2)} USDT, recibido $${amount.toFixed(2)} USDT.`,
      });
    }

    if (confirmations < ROYALTY.requiredConfirmations) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        amount,
        from: matchingTx.from,
        to: matchingTx.to,
        confirmations,
        error: `Esperando confirmaciones... (${confirmations}/${ROYALTY.requiredConfirmations}). Reintenta en unos segundos.`,
      });
    }

    const timestamp = new Date(
      Number(matchingTx.timeStamp) * 1000
    ).toISOString();

    console.log(
      `[TX VERIFIED] hash=${txHash} amount=${amount} from=${matchingTx.from} buyer=${buyerEmail || "-"}`
    );

    return NextResponse.json<VerifyResponse>({
      verified: true,
      amount,
      from: matchingTx.from,
      to: matchingTx.to,
      confirmations,
      timestamp,
      mode: "onchain",
    });
  } catch (err) {
    console.error("[verify-transaction]", err);
    return NextResponse.json<VerifyResponse>(
      {
        verified: false,
        error: "Error interno. Intenta de nuevo más tarde.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Langosta Hub Verify Transaction",
    version: "2.0.0",
    payment_wallet: PAYMENT_WALLET,
    usdt_contract: USDT_BEP20_CONTRACT,
    required_confirmations: ROYALTY.requiredConfirmations,
    post_body: {
      txHash: "0x...",
      expectedAmount: 4.99,
      buyerEmail: "opcional",
      allowDemo: "opcional, true solo para pruebas sin BSCSCAN_API_KEY",
    },
  });
}
