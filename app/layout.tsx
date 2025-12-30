import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getSiteUrl } from "@/lib/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const siteUrl = getSiteUrl();

// Google Sans Font
const googleSans = localFont({
  src: [
    {
      path: "../public/fonts/Google_Sans/static/GoogleSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Google_Sans/static/GoogleSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Google_Sans/static/GoogleSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Google_Sans/static/GoogleSans-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/Google_Sans/static/GoogleSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Google_Sans/static/GoogleSans-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/Google_Sans/static/GoogleSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Google_Sans/static/GoogleSans-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-google-sans",
  display: "swap",
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
      <body className={`${googleSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
