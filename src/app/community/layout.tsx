import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comunidad",
  description: "Únete a la comunidad de Peru Hub — discusiones, guías, tutoriales y tips para mejorar tu agente IA.",
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
