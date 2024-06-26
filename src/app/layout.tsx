import type { Metadata } from "next";
import { Roboto, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/provider/Providers";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  subsets: ["greek", "vietnamese"],
});
const inter = Inter({
  subsets: ["greek", "vietnamese"],
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
