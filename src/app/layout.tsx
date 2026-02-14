import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSidebar from "@/components/AdSidebar";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: {
    default: "Peru Hub — Upgrade Store for AI Agents",
    template: "%s | Peru Hub",
  },
  description:
    "The marketplace where humans buy improvement tools for their AI agents. Skills, upgrades, and tools powered by cryptocurrency payments. Built in Peru 🇵🇪",
  keywords: [
    "AI agents",
    "agent skills",
    "OpenClaw",
    "Moltbook",
    "AI tools",
    "agent marketplace",
    "USDT",
    "cryptocurrency",
    "Peru",
    "agent upgrades",
  ],
  authors: [{ name: "Peru Hub", url: "https://peru-hub.vercel.app" }],
  creator: "Peru 🇵🇪",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/lobster-black-192.png", sizes: "192x192" },
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    alternateLocale: "en_US",
    url: "https://peru-hub.vercel.app",
    siteName: "Peru Hub",
    title: "Peru Hub — Upgrade Store for AI Agents",
    description:
      "The marketplace where humans buy improvement tools for their AI agents. Skills, upgrades, and tools powered by crypto.",
    images: [
      {
        url: "/lobster-black.png",
        width: 1200,
        height: 630,
        alt: "Peru Hub - AI Agent Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peru Hub — Upgrade Store for AI Agents",
    description:
      "Buy improvement tools for your AI agent. Crypto payments accepted.",
    images: ["/lobster-black.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  metadataBase: new URL("https://peru-hub.vercel.app"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Peru Hub",
  url: "https://peru-hub.vercel.app",
  description: "Marketplace for AI agent improvement tools",
  potentialAction: {
    "@type": "SearchAction",
    target:
      "https://peru-hub.vercel.app/marketplace?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
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
        </LanguageProvider>
      </body>
    </html>
  );
}
