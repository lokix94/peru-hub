/**
 * Unified server-side store for Langosta Hub.
 * Uses in-memory Maps with /tmp file backup for Vercel persistence.
 * Data survives warm lambda instances; resets on cold starts.
 * For production: replace with Supabase/PostgreSQL.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";

const STORE_PATH = "/tmp/langosta-hub-store.json";

// ═══════════════════════════════════════════
// Types
// ═══════════════════════════════════════════

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  created_at: string;
  balance: number;
}

export interface Agent {
  id: string;
  user_id: string;
  name: string;
  platform: string; // "OpenClaw" | "Moltbook" | "Otro"
  api_key?: string;
  verified: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface InstalledSkill {
  id: string;
  user_id: string;
  agent_id: string;
  skill_id: string;
  skill_name: string;
  skill_icon: string;
  installed_at: string;
  status: "active" | "paused";
}

export interface Transaction {
  id: string;
  user_id: string;
  type: "purchase" | "deposit" | "earning";
  description: string;
  amount: number;
  items?: string[]; // skill IDs
  agent_id?: string;
  status: "completed" | "pending" | "failed";
  created_at: string;
}

// ═══════════════════════════════════════════
// In-Memory Store
// ═══════════════════════════════════════════

interface StoreData {
  users: Record<string, User>;
  agents: Record<string, Agent>;
  skills: Record<string, InstalledSkill>;
  transactions: Record<string, Transaction>;
  emailIndex: Record<string, string>;
  usernameIndex: Record<string, string>;
}

let store: StoreData = {
  users: {},
  agents: {},
  skills: {},
  transactions: {},
  emailIndex: {},
  usernameIndex: {},
};

// Load from /tmp on cold start
function loadStore() {
  try {
    if (existsSync(STORE_PATH)) {
      const raw = readFileSync(STORE_PATH, "utf-8");
      store = JSON.parse(raw);
    }
  } catch {
    // ignore — start fresh
  }
}

function saveStore() {
  try {
    writeFileSync(STORE_PATH, JSON.stringify(store), "utf-8");
  } catch {
    // ignore on write failure
  }
}

// Initialize
loadStore();

// ═══════════════════════════════════════════
// Auth helpers
// ═══════════════════════════════════════════

const SALT = "langosta-hub-salt-2026";

export function hashPassword(password: string): string {
  return Buffer.from(`${SALT}:${password}`).toString("base64");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function generateToken(userId: string): string {
  const payload = { id: userId, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function verifyToken(token: string): { id: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (payload.exp < Date.now()) return null;
    return { id: payload.id };
  } catch {
    return null;
  }
}

export function getUserFromToken(authHeader?: string | null): User | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const data = verifyToken(token);
  if (!data) return null;
  return store.users[data.id] || null;
}

// ═══════════════════════════════════════════
// Users
// ═══════════════════════════════════════════

export function createUser(username: string, email: string, password: string): { user: User; token: string } | { error: string } {
  const normalEmail = email.toLowerCase().trim();
  const normalUsername = username.toLowerCase().trim();

  if (store.emailIndex[normalEmail]) {
    return { error: "Ya existe una cuenta con este email" };
  }
  if (store.usernameIndex[normalUsername]) {
    return { error: "Este nombre de usuario ya está en uso" };
  }

  const id = crypto.randomUUID();
  const user: User = {
    id,
    username: username.trim(),
    email: normalEmail,
    passwordHash: hashPassword(password),
    created_at: new Date().toISOString(),
    balance: 0,
  };

  store.users[id] = user;
  store.emailIndex[normalEmail] = id;
  store.usernameIndex[normalUsername] = id;
  saveStore();

  return { user, token: generateToken(id) };
}

export function authenticateUser(email: string, password: string): { user: User; token: string } | { error: string } {
  const normalEmail = email.toLowerCase().trim();
  const userId = store.emailIndex[normalEmail];
  if (!userId) return { error: "No existe una cuenta con este email" };

  const user = store.users[userId];
  if (!user) return { error: "Error interno" };
  if (!verifyPassword(password, user.passwordHash)) {
    return { error: "Contraseña incorrecta" };
  }

  return { user, token: generateToken(userId) };
}

export function getUserById(id: string): User | null {
  return store.users[id] || null;
}

// ═══════════════════════════════════════════
// Agents
// ═══════════════════════════════════════════

export function createAgent(userId: string, name: string, platform: string, apiKey?: string, verified = false, metadata?: Record<string, unknown>): Agent {
  const id = crypto.randomUUID();
  const agent: Agent = {
    id,
    user_id: userId,
    name,
    platform,
    api_key: apiKey,
    verified,
    metadata,
    created_at: new Date().toISOString(),
  };
  store.agents[id] = agent;
  saveStore();
  return agent;
}

export function getUserAgents(userId: string): Agent[] {
  return Object.values(store.agents).filter((a) => a.user_id === userId);
}

export function getAgentById(id: string): Agent | null {
  return store.agents[id] || null;
}

export function deleteAgent(id: string, userId: string): boolean {
  const agent = store.agents[id];
  if (!agent || agent.user_id !== userId) return false;
  delete store.agents[id];
  saveStore();
  return true;
}

// ═══════════════════════════════════════════
// Skills (installed)
// ═══════════════════════════════════════════

export function installSkill(userId: string, agentId: string, skillId: string, skillName: string, skillIcon: string): InstalledSkill {
  // Check if already installed
  const existing = Object.values(store.skills).find(
    (s) => s.user_id === userId && s.agent_id === agentId && s.skill_id === skillId
  );
  if (existing) return existing;

  const id = crypto.randomUUID();
  const skill: InstalledSkill = {
    id,
    user_id: userId,
    agent_id: agentId,
    skill_id: skillId,
    skill_name: skillName,
    skill_icon: skillIcon,
    installed_at: new Date().toISOString(),
    status: "active",
  };
  store.skills[id] = skill;
  saveStore();
  return skill;
}

export function getUserSkills(userId: string): InstalledSkill[] {
  return Object.values(store.skills).filter((s) => s.user_id === userId);
}

export function getAgentSkills(agentId: string): InstalledSkill[] {
  return Object.values(store.skills).filter((s) => s.agent_id === agentId);
}

export function uninstallSkill(id: string, userId: string): boolean {
  const skill = store.skills[id];
  if (!skill || skill.user_id !== userId) return false;
  delete store.skills[id];
  saveStore();
  return true;
}

export function toggleSkillStatus(id: string, userId: string): InstalledSkill | null {
  const skill = store.skills[id];
  if (!skill || skill.user_id !== userId) return null;
  skill.status = skill.status === "active" ? "paused" : "active";
  saveStore();
  return skill;
}

// ═══════════════════════════════════════════
// Transactions
// ═══════════════════════════════════════════

export function createTransaction(
  userId: string,
  type: Transaction["type"],
  description: string,
  amount: number,
  items?: string[],
  agentId?: string
): Transaction {
  const id = crypto.randomUUID();
  const tx: Transaction = {
    id,
    user_id: userId,
    type,
    description,
    amount,
    items,
    agent_id: agentId,
    status: "completed",
    created_at: new Date().toISOString(),
  };
  store.transactions[id] = tx;

  // Update user balance
  const user = store.users[userId];
  if (user) {
    user.balance += amount;
  }
  saveStore();
  return tx;
}

export function getUserTransactions(userId: string): Transaction[] {
  return Object.values(store.transactions)
    .filter((t) => t.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// ═══════════════════════════════════════════
// Stats
// ═══════════════════════════════════════════

export function getUserStats(userId: string) {
  const user = store.users[userId];
  const userAgents = getUserAgents(userId);
  const userSkills = getUserSkills(userId);
  const userTxs = getUserTransactions(userId);
  const totalSpent = userTxs
    .filter((t) => t.type === "purchase")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return {
    balance: user?.balance ?? 0,
    totalSpent,
    agentCount: userAgents.length,
    skillCount: userSkills.length,
    transactionCount: userTxs.length,
  };
}
