import type { Metadata } from "next";

import "@/app/globals.css";
import { LocaleProvider } from "@/components/locale";
import { Shell } from "@/components/shell";
import { searchIndex } from "@/content/outline";
import { mono, sans, serif } from "@/lib/fonts";
import type { Locale } from "@/lib/i18n";
import { STATIC_THEME_CLASS, THEME_SCRIPT } from "@/lib/theme";
import { UI } from "@/lib/ui";

export function siteMetadata(locale: Locale): Metadata {
  return {
    title: {
      default: "Flow Docs — IAA & IAP",
      template: "%s · Flow Docs",
    },
    description: UI[locale].description,
  };
}

/** The whole document for one language: <html lang>, theme, fonts, chrome. */
export function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html
      lang={locale}
      className={`${STATIC_THEME_CLASS} ${sans.variable} ${serif.variable} ${mono.variable}`}
      // The theme script may swap the class before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-svh bg-background antialiased">
        <LocaleProvider locale={locale}>
          <Shell index={searchIndex(locale)}>{children}</Shell>
        </LocaleProvider>
      </body>
    </html>
  );
}
