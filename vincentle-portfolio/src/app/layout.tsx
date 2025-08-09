import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
import { generalSans } from './fonts'

export const metadata: Metadata = {
  title: "Vincent Le",
  description: "Technical Designer, Composer, and Writer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className={generalSans.variable}>
          <body className="bg-[#0B0B0E] text-white font-sans antialiased">
          <Providers>{children}</Providers>
          </body>
      </html>
  );
}
