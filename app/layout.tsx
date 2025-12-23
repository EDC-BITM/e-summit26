import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  adjustFontFallback: false,
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
  preload: true,
  style: "normal",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "E-Summit 2026 | EDC BIT Mesra",
    template: "%s | E-Summit 2026",
  },
  description:
    "The official website of E-Summit 2026, organized by the Entrepreneurship Development Cell (EDC) of BIT Mesra. Join us for an exciting event filled with innovation, networking, and entrepreneurial opportunities.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "E-Summit 2026",
    title: "E-Summit 2026 | EDC BIT Mesra",
    description:
      "The official website of E-Summit 2026, organized by the Entrepreneurship Development Cell (EDC) of BIT Mesra. Join us for an exciting event filled with innovation, networking, and entrepreneurial opportunities.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "E-Summit 2026 | EDC BIT Mesra",
    description:
      "The official website of E-Summit 2026, organized by the Entrepreneurship Development Cell (EDC) of BIT Mesra.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
