/**
 * Admin account (local / demo).
 * Login: admin@langostahub.com
 * Password: Palkiañ94
 */

export const ADMIN_EMAIL = "admin@langostahub.com";
export const ADMIN_USERNAME = "Admin";
/** Owner-defined admin password */
export const ADMIN_PASSWORD = "Palkia\u00f194";

export function isAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}
