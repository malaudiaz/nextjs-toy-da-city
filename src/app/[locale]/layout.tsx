import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { Inter } from "next/font/google";

import "../globals.css";

import { esES } from "@clerk/localizations";
import { dark } from "@clerk/themes";
import Navbar from "@/components/shared/header/Navbar";
import Footer from "@/components/shared/footer/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";

 const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

 const poppins = Poppins({
  subsets: ["latin"],
  weight: "100",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Toydacity Markeplace",
  description: "Generated by create next app",
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

  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <ClerkProvider localization={esES} appearance={{ baseTheme: dark }}>
        <body className={`min-h-screen flex flex-col antialiased font-inter`}>
          <NextIntlClientProvider>
            <Navbar />
            {children}
            <ScrollToTop />
            <Footer />
          </NextIntlClientProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
