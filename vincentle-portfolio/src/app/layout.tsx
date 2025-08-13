import type { Metadata } from "next";
import PlayerProvider from "@/components/audio/PlayerProvider"
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
          <body className="bg-background text-text font-sans antialiased">
          <PlayerProvider>{children}</PlayerProvider>
          </body>
      </html>
  );
}
