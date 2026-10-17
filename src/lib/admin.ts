/**
 * Admin account (local / demo).
 * Login: admin@langostahub.com
 * Password: as configured by owner
 */

export const ADMIN_EMAIL = "admin@langostahub.com";
export const ADMIN_USERNAME = "Admin";
/** Owner-defined admin password */
export const ADMIN_PASSWORD = "Palkiañ94";

export function isAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}
