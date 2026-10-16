/**
 * In-memory user store for fallback auth (no Supabase).
 * Resets on server restart — suitable for demo/development only.
 *
 * SECURITY NOTES:
 * - In production ALWAYS use Supabase Auth (or similar) with bcrypt/argon2.
 * - This fallback is intentionally simple and NOT production-grade.
 * - API keys for agents should never be logged or exposed in client responses.
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
 * In production, use bcrypt or argon2 via Supabase Auth.
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
 * Password strength validation for human registrations.
 * Returns null if valid, or an error message.
 */
export function validatePasswordStrength(password: string): string | null {
  if (!password || password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres";
  }
  if (password.length > 128) {
    return "La contraseña es demasiado larga";
  }
  // At least one letter and one number recommended
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return "La contraseña debe contener al menos una letra y un número";
  }
  return null;
}

/**
 * Sanitize username for human registrations.
 */
export function sanitizeUsername(username: string): string | null {
  const cleaned = username.trim();
  if (cleaned.length < 3) return null;
  if (cleaned.length > 32) return null;
  // Allow letters, numbers, underscore, hyphen
  if (!/^[a-zA-Z0-9_-]+$/.test(cleaned)) return null;
  return cleaned;
}

/**
 * Simple JWT-like token — for demo only.
 * In production, use a real JWT library with proper signing.
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

  // Validate email format basically
  if (!normalEmail.includes("@") || normalEmail.length < 5) {
    return { error: "Email inválido" };
  }

  // Password strength
  const pwdError = validatePasswordStrength(password);
  if (pwdError) return { error: pwdError };

  // Username sanitization
  const safeUsername = sanitizeUsername(username);
  if (!safeUsername) {
    return { error: "Usuario inválido (3-32 caracteres, solo letras, números, _ o -)" };
  }

  if (emailIndex.has(normalEmail)) {
    return { error: "Ya existe una cuenta con este email" };
  }
  if (usernameIndex.has(normalUsername)) {
    return { error: "Este nombre de usuario ya está en uso" };
  }

  const id = crypto.randomUUID();
  const user: StoredUser = {
    id,
    username: safeUsername,
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
