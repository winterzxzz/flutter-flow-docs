"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Languages,
  ListTree,
  Menu,
  Moon,
  Search as SearchIcon,
  Sun,
  Workflow,
  X,
} from "lucide-react";
import { Dialog, DropdownMenu } from "radix-ui";

import { Link, useLocale } from "@/components/locale";
import { Search } from "@/components/search";
import { TocList, useToc } from "@/components/toc";
import type { SearchEntry } from "@/content/outline";
import { LOCALE_NAME, LOCALES, localeHref, splitLocale, type Locale } from "@/lib/i18n";
import { navGroups, type NavGroup } from "@/lib/nav";
import { THEME_KEY } from "@/lib/theme";
import { UI } from "@/lib/ui";
import { cn } from "@/lib/utils";

// Which section the reader was in when they switched language, so the other
// language opens at the same place instead of at the top.
const SECTION_KEY = "ffd-section";

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex shrink-0 items-center gap-2">
      <Workflow className="size-5 text-brand" aria-hidden />
      <span className="font-heading text-[1.3rem] leading-none font-medium tracking-[-0.01em]">
        Flow Docs
      </span>
    </Link>
  );
}

/** Grouped page list, shared by the sidebar and the phone drawer. */
function NavList({
  groups,
  here,
  onPick,
}: {
  groups: NavGroup[];
  here: string;
  onPick?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-7">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-1.5 px-3 text-sm font-semibold text-foreground">{group.title}</p>
          <div className="flex flex-col gap-px">
            {group.items.map((item) => {
              const active = here === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.hint}
                  onClick={onPick}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-foreground/[0.07] font-medium text-foreground dark:bg-brand/[0.13] dark:text-brand"
                      : "text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

/** Previous and next page in reading order, at the foot of every page. */
function Pager({ groups, here, t }: { groups: NavGroup[]; here: string; t: (typeof UI)[Locale] }) {
  const nav = groups.flatMap((g) => g.items);
  const i = nav.findIndex((n) => n.href === here);
  if (i < 0) return null;
  const prev = nav[i - 1];
  const next = nav[i + 1];
  const item = "group flex max-w-[48%] flex-col gap-1 text-sm";
  const name =
    "flex items-center gap-1 font-medium text-foreground/85 transition-colors group-hover:text-brand";
  return (
    <nav aria-label={t.pager} className="mt-16 flex justify-between gap-6 border-t pt-6">
      {prev ? (
        <Link href={prev.href} className={item}>
          <span className="pl-5 text-xs text-muted-foreground">{t.prev}</span>
          <span className={name}>
            <ChevronLeft className="size-4 shrink-0" aria-hidden />
            {prev.label}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className={cn(item, "items-end text-right")}>
          <span className="pr-5 text-xs text-muted-foreground">{t.next}</span>
          <span className={name}>
            {next.label}
            <ChevronRight className="size-4 shrink-0" aria-hidden />
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

const iconButton =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-foreground/[0.06] hover:text-foreground";

/**
 * Flips the theme class on <html> and remembers the choice. Which icon shows
 * is decided in CSS from that class, so the button renders the same on the
 * server and the client and cannot flash the wrong icon.
 */
function ThemeToggle({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={iconButton}
      onClick={() => {
        const root = document.documentElement;
        const dark = !root.classList.contains("dark");
        root.classList.toggle("dark", dark);
        try {
          localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
        } catch {}
      }}
    >
      <Sun className="hidden size-[1.125rem] dark:block" aria-hidden />
      <Moon className="size-[1.125rem] dark:hidden" aria-hidden />
    </button>
  );
}

/** Same page, other language. Remembers the section being read. */
function LanguageMenu({
  locale,
  path,
  section,
  label,
}: {
  locale: Locale;
  path: string;
  section: number;
  label: string;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={label}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
      >
        <Languages className="size-4" aria-hidden />
        <span className="max-sm:hidden">{LOCALE_NAME[locale]}</span>
        <span className="uppercase sm:hidden">{locale}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 min-w-40 rounded-xl border bg-popover p-1 text-sm shadow-lg"
        >
          {LOCALES.map((l) => (
            <DropdownMenu.Item key={l} asChild>
              <NextLink
                href={localeHref(l, path)}
                hrefLang={l}
                lang={l}
                onClick={() => {
                  try {
                    if (l !== locale && section > 0)
                      sessionStorage.setItem(SECTION_KEY, String(section));
                  } catch {}
                }}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-2.5 py-1.5 outline-none data-[highlighted]:bg-foreground/[0.06]"
              >
                {LOCALE_NAME[l]}
                {l === locale ? <Check className="size-4 text-brand" aria-hidden /> : null}
              </NextLink>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

const overlay =
  "fixed inset-0 z-40 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0";

export function Shell({ index, children }: { index: SearchEntry[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = UI[locale];
  const here = splitLocale(pathname).path;
  const groups = navGroups(locale);
  const group = groups.find((g) => g.items.some((n) => n.href === here));
  const current = group?.items.find((n) => n.href === here);
  const toc = useToc(pathname);
  const section = toc.items.findIndex((i) => i.id === toc.active);
  const [menu, setMenu] = useState(false);
  const [outline, setOutline] = useState(false);
  const [search, setSearch] = useState(false);

  // Arriving from the language switch: go back to the section left behind.
  useEffect(() => {
    try {
      const n = Number(sessionStorage.getItem(SECTION_KEY));
      sessionStorage.removeItem(SECTION_KEY);
      if (!(n > 0)) return;
      const jump = () => document.querySelectorAll("main [data-toc]")[n]?.scrollIntoView();
      jump();
      // Web fonts swap in after first paint and move every heading; land again.
      document.fonts.ready.then(jump);
    } catch {}
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const outlineButton =
    toc.items.length > 1 ? (
      <Dialog.Root open={outline} onOpenChange={setOutline}>
        <Dialog.Trigger className={iconButton} aria-label={t.openOutline} title={t.onThisPage}>
          <ListTree className="size-[1.125rem]" aria-hidden />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={overlay} />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed top-16 right-3 left-3 z-50 max-h-[70svh] overflow-y-auto rounded-2xl border bg-popover p-5 shadow-xl data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 sm:left-auto sm:w-80 lg:right-6"
          >
            <Dialog.Title className="mb-2 text-sm font-semibold">{t.onThisPage}</Dialog.Title>
            <TocList items={toc.items} active={toc.active} onPick={() => setOutline(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    ) : null;

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-1.5 px-4 sm:gap-3 lg:px-6 xl:px-8">
          <Brand />
          <LanguageMenu locale={locale} path={here} section={section} label={t.language} />

          <div className="flex min-w-0 flex-1 justify-end md:justify-center">
            <button
              type="button"
              onClick={() => setSearch(true)}
              className="hidden h-9 w-full max-w-sm items-center gap-2.5 rounded-xl border bg-foreground/[0.02] px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground md:flex"
            >
              <SearchIcon className="size-4" aria-hidden />
              <span className="flex-1 text-left">{t.search}</span>
              <kbd className="font-sans text-xs font-medium">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearch(true)}
              aria-label={t.searchTitle}
              className={cn(iconButton, "md:hidden")}
            >
              <SearchIcon className="size-[1.125rem]" aria-hidden />
            </button>
          </div>

          {/* Between the phone bar and the wide layout, the outline lives here. */}
          <div className="hidden lg:max-[1339px]:block">{outlineButton}</div>
          <ThemeToggle label={t.theme} />
        </div>

        {/* Phone and tablet: a second row stands in for the sidebar. */}
        <div className="flex h-11 items-center gap-1 border-t px-2.5 lg:hidden">
          <Dialog.Root open={menu} onOpenChange={setMenu}>
            <Dialog.Trigger className={iconButton} aria-label={t.openMenu}>
              <Menu className="size-[1.125rem]" aria-hidden />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className={overlay} />
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-y-0 left-0 z-50 flex w-[19rem] max-w-[86vw] flex-col gap-6 overflow-y-auto border-r bg-background px-3 py-4 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left"
              >
                <div className="flex items-center justify-between pl-3">
                  <Dialog.Title asChild>
                    <div>
                      <Brand onClick={() => setMenu(false)} />
                    </div>
                  </Dialog.Title>
                  <Dialog.Close className={iconButton} aria-label={t.close}>
                    <X className="size-[1.125rem]" aria-hidden />
                  </Dialog.Close>
                </div>
                <NavList groups={groups} here={here} onPick={() => setMenu(false)} />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <p className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
            {group ? (
              <>
                <span className="shrink-0 text-muted-foreground">{group.title}</span>
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              </>
            ) : null}
            <span className="truncate font-medium">{current?.label ?? "Flow Docs"}</span>
          </p>

          {outlineButton}
        </div>
      </header>

      <Search open={search} onOpenChange={setSearch} index={index} />

      <div className="mx-auto flex max-w-[90rem] lg:px-6 xl:px-8">
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-60 shrink-0 overflow-y-auto py-8 pr-3 lg:block xl:w-64">
          <NavList groups={groups} here={here} />
        </aside>

        <div className="flex min-w-0 flex-1 justify-center gap-12 px-5 lg:px-6 xl:px-10">
          <main className="w-full max-w-[46rem] min-w-0 py-9 lg:py-12">
            {children}
            <Pager groups={groups} here={here} t={t} />
          </main>

          {toc.items.length > 1 ? (
            <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-52 shrink-0 overflow-y-auto py-12 min-[1340px]:block">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <ListTree className="size-4 text-muted-foreground" aria-hidden />
                {t.onThisPage}
              </p>
              <TocList items={toc.items} active={toc.active} />
            </aside>
          ) : (
            <div className="hidden w-52 shrink-0 min-[1340px]:block" />
          )}
        </div>
      </div>
    </>
  );
}
