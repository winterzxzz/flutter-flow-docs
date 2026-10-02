export const LOCALES = ["vi", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * The locale served at the site root. Every other locale lives under
 * /<locale>/. Changing this one constant swaps which language owns the
 * unprefixed URLs; no page or link needs editing.
 */
export const DEFAULT_LOCALE: Locale = "vi";

export const LOCALE_NAME: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

export const isLocale = (v: string): v is Locale =>
  (LOCALES as readonly string[]).includes(v);

/** Site path of a page ("/iap") as served in the given locale. */
export function localeHref(locale: Locale, href: string) {
  if (!href.startsWith("/") || locale === DEFAULT_LOCALE) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

/** Splits a pathname into its locale and the locale-free page path. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const p = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const first = p.split("/")[1] ?? "";
  if (isLocale(first) && first !== DEFAULT_LOCALE)
    return { locale: first, path: p.slice(first.length + 1) || "/" };
  return { locale: DEFAULT_LOCALE, path: p };
}
