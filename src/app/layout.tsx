import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";

import "material-symbols/outlined.css";
import "react-nestable/dist/styles/index.css";

import { AppName } from "@/config/app-config";

import { NextTopLoaderProvider } from "@/providers/next-top-loader-provider";
import { NuqsProvider } from "@/providers/nuqs-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { SnackbarProvider } from "@/providers/snackbar-provider";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: AppName,
    template: `%s | ${AppName}`,
  },
  description: AppName,
};

const inter = Inter({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.variable}>
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProvider>
            <SnackbarProvider>
              <NuqsProvider>
                <NextTopLoaderProvider />
                {children}
              </NuqsProvider>
            </SnackbarProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
