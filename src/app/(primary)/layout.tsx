import { RootDocument, siteMetadata } from "@/app/root-document";
import { DEFAULT_LOCALE } from "@/lib/i18n";

export const metadata = siteMetadata(DEFAULT_LOCALE);

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale={DEFAULT_LOCALE}>{children}</RootDocument>;
}
