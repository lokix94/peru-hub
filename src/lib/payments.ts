/**
 * Langosta Hub — Payment Service (structured like a Java service class)
 *
 * Responsibilities:
 *  - Platform wallet & USDT BEP20 constants
 *  - Royalty split (97% creator / 3% platform)
 *  - Tx hash validation
 *  - Order / royalty record helpers (localStorage on client)
 */

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

export const PAYMENT_WALLET =
  "0xDD49337e6B62C8B0d750CD6F809A84F339a3061e" as const;

/** USDT on Binance Smart Chain (BEP20) */
export const USDT_BEP20_CONTRACT =
  "0x55d398326f99059fF775485246999027B3197955" as const;

export const NETWORK = {
  name: "BSC",
  chainId: 56,
  currency: "USDT",
  tokenStandard: "BEP20",
  explorerTx: (hash: string) => `https://bscscan.com/tx/${hash}`,
  explorerAddress: (addr: string) => `https://bscscan.com/address/${addr}`,
} as const;

export const ROYALTY = {
  developerShare: 0.97,
  platformShare: 0.03,
  minWithdrawUsdt: 10,
  requiredConfirmations: 3,
} as const;

export const LS_ORDERS_KEY = "langosta-orders";
export const LS_ROYALTIES_KEY = "langosta-royalties";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type OrderStatus =
  | "pending_payment"
  | "pending_verification"
  | "verified"
  | "failed"
  | "refunded";

export interface OrderItem {
  skillId: string;
  skillName: string;
  price: number;
  quantity: number;
  developerId?: string;
}

export interface Order {
  id: string;
  userId?: string;
  buyerEmail?: string;
  agentId?: string;
  items: OrderItem[];
  amount: number;
  currency: string;
  network: string;
  txHash?: string;
  walletFrom?: string;
  status: OrderStatus;
  createdAt: string;
  verifiedAt?: string;
}

export interface RoyaltyRecord {
  id: string;
  orderId: string;
  skillId: string;
  skillName: string;
  developerId?: string;
  grossAmount: number;
  developerShare: number;
  platformFee: number;
  status: "pending" | "paid";
  createdAt: string;
  paidAt?: string;
}

/* ------------------------------------------------------------------ */
/*  Pure functions (no side effects)                                   */
/* ------------------------------------------------------------------ */

export function isValidBep20Address(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash.trim());
}

export function calculateRoyalties(price: number): {
  gross: number;
  developerShare: number;
  platformFee: number;
} {
  const gross = Math.max(0, Number(price) || 0);
  const platformFee = Number((gross * ROYALTY.platformShare).toFixed(2));
  const developerShare = Number((gross - platformFee).toFixed(2));
  return { gross, developerShare, platformFee };
}

export function calculateOrderTotal(
  items: { price: number; quantity: number }[],
  couponPercent = 0
): number {
  const sub = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = couponPercent > 0 ? sub * (couponPercent / 100) : 0;
  return Number(Math.max(0, sub - discount).toFixed(2));
}

export function buildRoyaltyRecords(
  order: Order
): RoyaltyRecord[] {
  const now = new Date().toISOString();
  return order.items.map((item) => {
    const line = item.price * item.quantity;
    const { developerShare, platformFee } = calculateRoyalties(line);
    return {
      id: crypto.randomUUID(),
      orderId: order.id,
      skillId: item.skillId,
      skillName: item.skillName,
      developerId: item.developerId,
      grossAmount: line,
      developerShare,
      platformFee,
      status: "pending" as const,
      createdAt: now,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Client persistence (localStorage)                                  */
/* ------------------------------------------------------------------ */

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

export function saveOrderLocal(order: Order): void {
  const list = readJson<Order[]>(LS_ORDERS_KEY, []);
  const idx = list.findIndex((o) => o.id === order.id);
  if (idx >= 0) list[idx] = order;
  else list.unshift(order);
  writeJson(LS_ORDERS_KEY, list);
}

export function getOrdersLocal(userId?: string): Order[] {
  const list = readJson<Order[]>(LS_ORDERS_KEY, []);
  if (!userId) return list;
  return list.filter((o) => o.userId === userId);
}

export function saveRoyaltiesLocal(records: RoyaltyRecord[]): void {
  const list = readJson<RoyaltyRecord[]>(LS_ROYALTIES_KEY, []);
  writeJson(LS_ROYALTIES_KEY, [...records, ...list]);
}

export function getRoyaltiesLocal(developerId?: string): RoyaltyRecord[] {
  const list = readJson<RoyaltyRecord[]>(LS_ROYALTIES_KEY, []);
  if (!developerId) return list;
  return list.filter((r) => r.developerId === developerId);
}

/** Create a pending order after user submits tx hash (client-side). */
export function createLocalOrder(params: {
  userId?: string;
  buyerEmail?: string;
  agentId?: string;
  items: OrderItem[];
  amount: number;
  txHash: string;
}): Order {
  const order: Order = {
    id: crypto.randomUUID(),
    userId: params.userId,
    buyerEmail: params.buyerEmail,
    agentId: params.agentId,
    items: params.items,
    amount: params.amount,
    currency: NETWORK.currency,
    network: NETWORK.tokenStandard,
    txHash: params.txHash.trim(),
    status: "pending_verification",
    createdAt: new Date().toISOString(),
  };
  saveOrderLocal(order);
  return order;
}

/** Mark order verified and append royalty rows. */
export function markOrderVerifiedLocal(
  orderId: string,
  walletFrom?: string
): Order | null {
  const list = readJson<Order[]>(LS_ORDERS_KEY, []);
  const idx = list.findIndex((o) => o.id === orderId);
  if (idx < 0) return null;
  list[idx] = {
    ...list[idx],
    status: "verified",
    walletFrom,
    verifiedAt: new Date().toISOString(),
  };
  writeJson(LS_ORDERS_KEY, list);
  const royalties = buildRoyaltyRecords(list[idx]);
  saveRoyaltiesLocal(royalties);
  return list[idx];
}
