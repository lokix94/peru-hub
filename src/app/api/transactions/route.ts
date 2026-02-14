import { NextResponse } from "next/server";

const WALLET = "0xcbc14706f7f8167505de1690e1e8419399f9506d";
const USDT_CONTRACT = "0x55d398326f99059fF775485246999027B3197955";
const API_KEY = process.env.BSCSCAN_API_KEY || "";

interface BscTransaction {
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  hash: string;
  tokenDecimal: string;
  confirmations: string;
}

function formatTimestamp(ts: string): string {
  const date = new Date(Number(ts) * 1000);
  return date.toISOString().replace("T", " ").slice(0, 16);
}

function getStatus(confirmations: string): "confirmed" | "pending" | "failed" {
  const n = Number(confirmations);
  if (n >= 12) return "confirmed";
  if (n > 0) return "pending";
  return "pending";
}

export async function GET() {
  const lastChecked = new Date().toISOString();

  // If no API key, return mock data
  if (!API_KEY) {
    return NextResponse.json({
      transactions: [],
      total_received: 0,
      last_checked: lastChecked,
      note: "Configure BSCSCAN_API_KEY en las variables de entorno para datos en vivo",
    });
  }

  try {
    const url = new URL("https://api.bscscan.com/api");
    url.searchParams.set("module", "account");
    url.searchParams.set("action", "tokentx");
    url.searchParams.set("contractaddress", USDT_CONTRACT);
    url.searchParams.set("address", WALLET);
    url.searchParams.set("page", "1");
    url.searchParams.set("offset", "20");
    url.searchParams.set("sort", "desc");
    url.searchParams.set("apikey", API_KEY);

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 }, // cache for 60 seconds
    });

    if (!res.ok) {
      throw new Error(`BSCScan API returned ${res.status}`);
    }

    const data = await res.json();

    if (data.status !== "1" || !Array.isArray(data.result)) {
      return NextResponse.json({
        transactions: [],
        total_received: 0,
        last_checked: lastChecked,
        note: data.message || "No transactions found",
      });
    }

    // Filter only incoming transfers TO our wallet
    const incoming = (data.result as BscTransaction[]).filter(
      (tx) => tx.to.toLowerCase() === WALLET.toLowerCase()
    );

    const transactions = incoming.map((tx) => {
      const decimals = Number(tx.tokenDecimal) || 18;
      const amount = (Number(tx.value) / Math.pow(10, decimals)).toFixed(2);
      return {
        date: formatTimestamp(tx.timeStamp),
        user: tx.from.slice(0, 8) + "..." + tx.from.slice(-4),
        amount,
        txHash: tx.hash,
        status: getStatus(tx.confirmations),
      };
    });

    const totalReceived = transactions.reduce(
      (sum, tx) => sum + parseFloat(tx.amount),
      0
    );

    return NextResponse.json({
      transactions,
      total_received: Math.round(totalReceived * 100) / 100,
      last_checked: lastChecked,
    });
  } catch (err) {
    return NextResponse.json(
      {
        transactions: [],
        total_received: 0,
        last_checked: lastChecked,
        note: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
