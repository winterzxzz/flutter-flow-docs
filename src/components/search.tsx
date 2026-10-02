"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CornerDownLeft, FileText, Hash, Search as SearchIcon } from "lucide-react";
import { Dialog } from "radix-ui";

import { useLocale } from "@/components/locale";
import type { SearchEntry } from "@/content/outline";
import { localeHref } from "@/lib/i18n";
import { slug } from "@/lib/slug";
import { UI } from "@/lib/ui";
import { cn } from "@/lib/utils";

type Hit = { href: string; title: string; context: string; section: boolean };

/** Lower case, no diacritics: "luong mua" finds "Luồng mua". */
const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();

function find(index: SearchEntry[], query: string): Hit[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  const match = (text: string) => {
    const t = fold(text);
    return words.every((w) => t.includes(w));
  };
  const hits: Hit[] = [];
  for (const page of index) {
    if (!words.length || match(`${page.label} ${page.hint} ${page.group}`))
      hits.push({ href: page.href, title: page.label, context: `${page.group} · ${page.hint}`, section: false });
    if (!words.length) continue;
    for (const s of page.sections)
      if (match(s))
        hits.push({ href: `${page.href}#${slug(s)}`, title: s, context: page.label, section: true });
  }
  return hits.slice(0, 40);
}

/** Jump to a page or a section by typing part of its name. */
export function Search({
  open,
  onOpenChange,
  index,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index: SearchEntry[];
}) {
  const locale = useLocale();
  const t = UI[locale];
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const hits = find(index, query);
  const at = Math.min(cursor, hits.length - 1);

  const close = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setQuery("");
      setCursor(0);
    }
  };
  const go = (hit: Hit) => {
    close(false);
    const [path, hash] = hit.href.split("#");
    router.push(localeHref(locale, path) + (hash ? `#${hash}` : ""));
  };

  return (
    <Dialog.Root open={open} onOpenChange={close}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-[12svh] left-1/2 z-50 flex max-h-[70svh] w-[min(36rem,calc(100vw-1.5rem))] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border bg-popover shadow-2xl data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          <Dialog.Title className="sr-only">{t.searchTitle}</Dialog.Title>
          <div className="flex items-center gap-2.5 border-b px-4">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCursor(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setCursor(Math.min(at + 1, hits.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setCursor(Math.max(at - 1, 0));
                } else if (e.key === "Enter" && hits[at]) {
                  e.preventDefault();
                  go(hits[at]);
                }
              }}
              placeholder={t.search}
              aria-label={t.searchTitle}
              className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul className="overflow-y-auto p-2">
            {hits.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">{t.searchEmpty}</li>
            ) : null}
            {hits.map((hit, i) => {
              const Icon = hit.section ? Hash : FileText;
              return (
                <li key={hit.href}>
                  <button
                    type="button"
                    data-search-hit
                    onClick={() => go(hit)}
                    onMouseMove={() => setCursor(i)}
                    ref={i === at ? (el) => el?.scrollIntoView({ block: "nearest" }) : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm",
                      i === at && "bg-foreground/[0.06]",
                    )}
                  >
                    <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{hit.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{hit.context}</span>
                    </span>
                    {i === at ? (
                      <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
