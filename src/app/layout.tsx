import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Flow Docs — Base & Lib",
    template: "%s · Flow Docs",
  },
  description:
    "Luồng code giữa Flutter base và lib, tập trung vào IAP và IAA.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-svh bg-background antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
