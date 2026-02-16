import { NextRequest, NextResponse } from "next/server";

const WALLET = "0xDD49337e6B62C8B0d750CD6F809A84F339a3061e";
const USDT_CONTRACT = "0x55d398326f99059fF775485246999027B3197955";
const BSCSCAN_API = "https://api.etherscan.io/v2/api";
const REQUIRED_CONFIRMATIONS = 3;

interface VerifyRequest {
  txHash: string;
  expectedAmount: number;
  buyerEmail: string;
}

interface VerifyResponse {
  verified: boolean;
  amount?: number;
  from?: string;
  to?: string;
  confirmations?: number;
  timestamp?: string;
  error?: string;
}

function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json();
    const { txHash, expectedAmount, buyerEmail } = body;

    // Validate input
    if (!txHash || typeof txHash !== "string") {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "Hash de transacción requerido",
      }, { status: 400 });
    }

    if (!isValidTxHash(txHash)) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "Hash de transacción inválido. Debe ser formato 0x seguido de 64 caracteres hexadecimales",
      }, { status: 400 });
    }

    if (typeof expectedAmount !== "number" || expectedAmount <= 0) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "Monto esperado inválido",
      }, { status: 400 });
    }

    const API_KEY = process.env.BSCSCAN_API_KEY;
    if (!API_KEY) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "Servicio de verificación no configurado. Contacta al administrador.",
      }, { status: 503 });
    }

    // Step 1: Get transaction receipt to check status
    const receiptUrl = new URL(BSCSCAN_API);
    receiptUrl.searchParams.set("chainid", "56");
    receiptUrl.searchParams.set("module", "proxy");
    receiptUrl.searchParams.set("action", "eth_getTransactionReceipt");
    receiptUrl.searchParams.set("txhash", txHash);
    receiptUrl.searchParams.set("apikey", API_KEY);

    const receiptRes = await fetch(receiptUrl.toString());
    if (!receiptRes.ok) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "Error al conectar con BSCScan. Intenta de nuevo.",
      }, { status: 502 });
    }

    const receiptData = await receiptRes.json();

    if (!receiptData.result || receiptData.result === null) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "Transacción no encontrada. Verifica el hash e intenta de nuevo.",
      });
    }

    // Check transaction status (0x1 = success, 0x0 = failed)
    const txStatus = receiptData.result.status;
    if (txStatus === "0x0") {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "La transacción falló en la blockchain.",
      });
    }

    // Step 2: Get token transfer details for this specific transaction
    // We query token transfers by the sender address from the receipt, filtering by tx hash
    const fromAddress = receiptData.result.from;

    const tokenTxUrl = new URL(BSCSCAN_API);
    tokenTxUrl.searchParams.set("chainid", "56");
    tokenTxUrl.searchParams.set("module", "account");
    tokenTxUrl.searchParams.set("action", "tokentx");
    tokenTxUrl.searchParams.set("contractaddress", USDT_CONTRACT);
    tokenTxUrl.searchParams.set("address", WALLET);
    tokenTxUrl.searchParams.set("page", "1");
    tokenTxUrl.searchParams.set("offset", "100");
    tokenTxUrl.searchParams.set("sort", "desc");
    tokenTxUrl.searchParams.set("apikey", API_KEY);

    const tokenRes = await fetch(tokenTxUrl.toString());
    if (!tokenRes.ok) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "Error al consultar transferencias de token. Intenta de nuevo.",
      }, { status: 502 });
    }

    const tokenData = await tokenRes.json();

    if (tokenData.status !== "1" || !Array.isArray(tokenData.result)) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "No se encontraron transferencias de USDT asociadas a esta transacción.",
      });
    }

    // Find the specific transaction by hash
    const matchingTx = tokenData.result.find(
      (tx: Record<string, string>) => tx.hash.toLowerCase() === txHash.toLowerCase()
    );

    if (!matchingTx) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "Esta transacción no es una transferencia de USDT BEP20 a nuestra wallet.",
      });
    }

    // Verify destination wallet
    if (matchingTx.to.toLowerCase() !== WALLET.toLowerCase()) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "Wallet de destino incorrecta. El pago no fue enviado a la dirección correcta.",
      });
    }

    // Verify token contract
    if (matchingTx.contractAddress.toLowerCase() !== USDT_CONTRACT.toLowerCase()) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        error: "Token incorrecto. Solo se aceptan pagos en USDT BEP20.",
      });
    }

    // Calculate amount
    const decimals = Number(matchingTx.tokenDecimal) || 18;
    const amount = Number(matchingTx.value) / Math.pow(10, decimals);
    const confirmations = Number(matchingTx.confirmations) || 0;

    // Verify amount
    if (amount < expectedAmount) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        amount,
        from: matchingTx.from,
        to: matchingTx.to,
        confirmations,
        error: `Monto incorrecto. Se esperaba $${expectedAmount.toFixed(2)} USDT pero se recibió $${amount.toFixed(2)} USDT.`,
      });
    }

    // Verify confirmations
    if (confirmations < REQUIRED_CONFIRMATIONS) {
      return NextResponse.json<VerifyResponse>({
        verified: false,
        amount,
        from: matchingTx.from,
        to: matchingTx.to,
        confirmations,
        error: `Esperando confirmaciones... (${confirmations}/${REQUIRED_CONFIRMATIONS}). Intenta de nuevo en unos segundos.`,
      });
    }

    // Build timestamp
    const timestamp = new Date(Number(matchingTx.timeStamp) * 1000).toISOString();

    // All checks passed!
    // Log verified transaction (buyerEmail for records)
    console.log(`[TX VERIFIED] hash=${txHash} amount=${amount} from=${matchingTx.from} buyer=${buyerEmail}`);

    return NextResponse.json<VerifyResponse>({
      verified: true,
      amount,
      from: matchingTx.from,
      to: matchingTx.to,
      confirmations,
      timestamp,
    });

  } catch (err) {
    console.error("[verify-transaction] Error:", err);
    return NextResponse.json<VerifyResponse>({
      verified: false,
      error: "Error interno del servidor. Intenta de nuevo más tarde.",
    }, { status: 500 });
  }
}
