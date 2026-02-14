import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Carrito",
  description: "Revisa y paga las skills seleccionadas para tu agente IA. Pago con USDT (BEP20).",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
