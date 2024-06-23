import type { Metadata } from "next";
import { Roboto, Inter } from "next/font/google";
import "./globals.css";

import RecoilContextProvider from "@/state/recoilContextProvider";
import { NextUIProvider } from "@nextui-org/react";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  subsets: ["greek"],
});
const inter = Inter({
  subsets: ["greek"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Google Meet",
  description: "A clone app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilContextProvider>
          <NextUIProvider>{children}</NextUIProvider>
        </RecoilContextProvider>
      </body>
    </html>
  );
}
