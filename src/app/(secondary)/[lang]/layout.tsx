import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RootDocument, siteMetadata } from "@/app/root-document";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

// Static export: only the locales listed here exist under /<lang>/.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.filter((l) => l !== DEFAULT_LOCALE).map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? siteMetadata(lang) : {};
}

export default async function Layout({
  children,
  params,
}: Readonly<{ children: React.ReactNode }> & Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <RootDocument locale={lang}>{children}</RootDocument>;
}
