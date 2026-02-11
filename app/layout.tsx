import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import { getSiteUrl } from "@/lib/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import OnboardingBanner from "@/components/OnboardingBanner";

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
  applicationName: "E-Summit 2026",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "E-Summit 2026",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
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
    images: [
      {
        url: "/screenshot_desktop.png",
        width: 2880,
        height: 1800,
        alt: "E-Summit 2026 - BIT Mesra",
      },
      {
        url: "/screenshot_tablet.png",
        width: 1024,
        height: 768,
        alt: "E-Summit 2026 - BIT Mesra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Summit 2026 | EDC BIT Mesra",
    description:
      "The official website of E-Summit 2026, organized by the Entrepreneurship Development Cell (EDC) of BIT Mesra.",
    images: ["/screenshot_desktop.png"],
  },
  icons: {
    icon: [{ url: "/E_Fav.svg" }, { url: "/favicon.ico" }],
    apple: [{ url: "/esummit_logo.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${googleSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <OnboardingBanner />
          </Suspense>
          <Suspense>{children}</Suspense>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
