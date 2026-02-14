/**
 * In-memory user store for fallback auth (no Supabase).
 * Resets on server restart — suitable for demo/development only.
 */

export interface StoredUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  created_at: string;
}

// In-memory store
const users = new Map<string, StoredUser>();

// Simple index by email for fast lookup
const emailIndex = new Map<string, string>(); // email → id
const usernameIndex = new Map<string, string>(); // username → id

/**
 * Minimal password "hashing" — for demo only.
 * In production, use bcrypt or argon2.
 */
export function hashPassword(password: string): string {
  // Simple base64 encode + salt — NOT cryptographically secure
  const salt = "langosta-hub-salt-2026";
  return Buffer.from(`${salt}:${password}`).toString("base64");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Simple JWT-like token — for demo only.
 * In production, use a real JWT library.
 */
export function generateToken(userId: string): string {
  const payload = { id: userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }; // 7 days
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

export function createUser(
  username: string,
  email: string,
  password: string
): { user: StoredUser; token: string } | { error: string } {
  const normalEmail = email.toLowerCase().trim();
  const normalUsername = username.toLowerCase().trim();

  if (emailIndex.has(normalEmail)) {
    return { error: "Ya existe una cuenta con este email" };
  }
  if (usernameIndex.has(normalUsername)) {
    return { error: "Este nombre de usuario ya está en uso" };
  }

  const id = crypto.randomUUID();
  const user: StoredUser = {
    id,
    username: username.trim(),
    email: normalEmail,
    passwordHash: hashPassword(password),
    created_at: new Date().toISOString(),
  };

  users.set(id, user);
  emailIndex.set(normalEmail, id);
  usernameIndex.set(normalUsername, id);

  return { user, token: generateToken(id) };
}

export function authenticateUser(
  email: string,
  password: string
): { user: StoredUser; token: string } | { error: string } {
  const normalEmail = email.toLowerCase().trim();
  const userId = emailIndex.get(normalEmail);
  if (!userId) return { error: "No existe una cuenta con este email" };

  const user = users.get(userId);
  if (!user) return { error: "Error interno" };

  if (!verifyPassword(password, user.passwordHash)) {
    return { error: "Contraseña incorrecta" };
  }

  return { user, token: generateToken(userId) };
}

export function getUserById(id: string): StoredUser | null {
  return users.get(id) ?? null;
}
