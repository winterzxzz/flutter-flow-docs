import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { Shell } from "@/components/shell";
import "./globals.css";

// Vietnamese subset matters here: the whole site is written in Vietnamese and
// a font without it renders diacritics from a fallback face.
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Flow Docs — Base & Lib",
    template: "%s · Flow Docs",
  },
  description:
    "Luồng code giữa Flutter base và lib, tập trung vào IAP, IAA và UA.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`dark ${sans.variable} ${mono.variable}`}>
      <body className="min-h-svh bg-background antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
