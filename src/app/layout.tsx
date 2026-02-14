import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSidebar from "@/components/AdSidebar";
import InstallPrompt from "@/components/InstallPrompt";
import LiveChat from "@/components/LiveChat";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "Langosta Hub — Upgrade Store for AI Agents",
    template: "%s | Langosta Hub",
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
  authors: [{ name: "Langosta Hub", url: "https://peru-hub.vercel.app" }],
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
    siteName: "Langosta Hub",
    title: "Langosta Hub — Upgrade Store for AI Agents",
    description:
      "The marketplace where humans buy improvement tools for their AI agents. Skills, upgrades, and tools powered by crypto.",
    images: [
      {
        url: "/lobster-black.png",
        width: 1200,
        height: 630,
        alt: "Langosta Hub - AI Agent Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Langosta Hub — Upgrade Store for AI Agents",
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
  name: "Langosta Hub",
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/lobster-black-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              <div className="flex flex-1">
                <AdSidebar />
                <main className="flex-1 min-w-0">
                  {children}
                </main>
              </div>
              <Footer />
              <InstallPrompt />
              <LiveChat />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
