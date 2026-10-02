import { Children, isValidElement } from "react";

import { Section } from "@/components/page-header";
import { PAGES, type PageModule, type Slug } from "@/content";
import type { Locale } from "@/lib/i18n";
import { navGroups } from "@/lib/nav";

export type SearchEntry = {
  href: string;
  label: string;
  hint: string;
  group: string;
  sections: string[];
};

/** Section titles of a page, read off the element tree the page returns. */
function sections(page: PageModule): string[] {
  const tree = page.default() as React.ReactElement<{ children?: React.ReactNode }>;
  const out: string[] = [];
  Children.forEach(tree.props.children, (child) => {
    if (isValidElement<{ title: string }>(child) && child.type === Section)
      out.push(child.props.title);
  });
  return out;
}

/** What the search box looks through: every page and its sections. */
export function searchIndex(locale: Locale): SearchEntry[] {
  return navGroups(locale).flatMap((g) =>
    g.items.map((i) => ({
      ...i,
      group: g.title,
      sections: sections(PAGES[i.href.slice(1) as Slug][locale]),
    })),
  );
}
