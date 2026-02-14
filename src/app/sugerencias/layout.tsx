import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sugerencias",
  description: "Envía sugerencias, reportes y opiniones sobre Peru Hub. Tu feedback nos ayuda a mejorar la plataforma.",
};

export default function SugerenciasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
