import type { Metadata } from "next";
import "./globals.css";
import AppProviders from '@/components/providers/AppProviders';
import { generalSans } from './fonts'

export const metadata: Metadata = {
  title: "Vincent Le",
  description: "Technical Designer, Composer, and Writer",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className={generalSans.variable}>
            <body className="bg-[#0D0E11] text-white">
                <style>{`:root{ --brand:#6E3FF3; --brand-2:#7E58F6; }`}</style>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
