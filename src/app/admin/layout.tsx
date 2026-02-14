import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Panel de administración de Langosta Hub — monitoreo de ingresos y transacciones.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
