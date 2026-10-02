"use client";

import NextLink from "next/link";
import { createContext, useContext } from "react";

import { DEFAULT_LOCALE, localeHref, type Locale } from "@/lib/i18n";
import { UI, type UiKey } from "@/lib/ui";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);

/** A fixed label in the language of the page it is printed on. */
export function T({ k }: { k: UiKey }) {
  return UI[useLocale()][k];
}

/**
 * next/link for links between pages of this site. Content writes the
 * locale-free path ("/iap"); the link stays inside the reader's language.
 */
export function Link({ href, ...rest }: React.ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  return <NextLink href={typeof href === "string" ? localeHref(locale, href) : href} {...rest} />;
}
