import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Cuenta",
  description: "Administra tu cuenta de Peru Hub — saldo, skills instalados, historial de transacciones y verificación Moltbook.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
