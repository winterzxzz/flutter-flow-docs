import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PAGES, type PageModule, type Slug } from "@/content";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";

const pageOf = (slug: Slug, locale: Locale): PageModule => PAGES[slug][locale];

/** Route at the site root: the page in the default language. */
export function primary(slug: Slug) {
  const page = pageOf(slug, DEFAULT_LOCALE);
  return { metadata: (page.metadata ?? {}) as Metadata, Page: page.default };
}

type Props = { params: Promise<{ lang: string }> };

/** Route under /<lang>/: the same page in whichever language the URL names. */
export function secondary(slug: Slug) {
  return {
    async generateMetadata({ params }: Props): Promise<Metadata> {
      const { lang } = await params;
      return isLocale(lang) ? (pageOf(slug, lang).metadata ?? {}) : {};
    },
    async Page({ params }: Props) {
      const { lang } = await params;
      if (!isLocale(lang)) notFound();
      const Body = pageOf(slug, lang).default;
      return <Body />;
    },
  };
}
