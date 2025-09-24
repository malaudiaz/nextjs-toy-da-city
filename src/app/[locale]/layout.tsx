import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { Inter } from "next/font/google";

import "../globals.css";

import { dark } from "@clerk/themes";
import Navbar from "@/components/shared/header/Navbar";
import Footer from "@/components/shared/footer/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { PushNotifier } from '@/components/shared/PushNotifier';
import { clerkLocalizations } from "@/lib/clerkLocalization";
import { Toaster } from "sonner";
import { OnlineTracker } from "@/components/shared/OlineTracker";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const poppins = Poppins({
  subsets: ["latin"],
  weight: "100",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Toydacity Marketplace",
  description: "Compra y vende juguetes únicos y coleccionables en Toydacity.",
  icons: {
    icon: [
      { url: "/favicon/icon1.png" },           // 16x16 (default)
      { url: "/favicon/icon2.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon/icon1.png" }],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Toydacity Marketplace",
    description: "Compra y vende juguetes únicos y coleccionables en Toydacity.",
    url: "https://toydacity.com",
    siteName: "Toydacity",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Toydacity Marketplace",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toydacity Marketplace",
    description: "Compra y vende juguetes únicos y coleccionables en Toydacity.",
    images: ["/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Selecciona la localización de Clerk basada en el `locale`
  const localization =
    clerkLocalizations[locale as keyof typeof clerkLocalizations];

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <ClerkProvider
        localization={localization}
        appearance={{ baseTheme: dark }}
      >
        <body className={`min-h-screen flex flex-col antialiased font-inter`}>
          <NextIntlClientProvider>
            <Navbar />
            {children}
            <ScrollToTop />
            <Footer />
          </NextIntlClientProvider>
          <Toaster />
          <PushNotifier />
          <OnlineTracker />
        </body>
      </ClerkProvider>
    </html>
  );
}
