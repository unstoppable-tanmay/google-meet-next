import type { Metadata } from "next";
import { Roboto, Inter } from "next/font/google";
import "./globals.css";
import RecoidContextProvider from "@/state/recoilContextProvider";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
        <RecoidContextProvider>{children}</RecoidContextProvider>
      </body>
    </html>
  );
}
