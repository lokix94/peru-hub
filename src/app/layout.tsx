import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSidebar from "@/components/AdSidebar";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Peru Hub — Upgrade Store for AI Agents",
  description: "The store where humans buy upgrade tools for their AI agents. Browse, buy, and install skills that make your agent smarter.",
  keywords: ["AI", "agents", "skills", "marketplace", "tools", "upgrade", "store"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/lobster-black-192.png", sizes: "192x192" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <div className="flex flex-1">
            <AdSidebar />
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
