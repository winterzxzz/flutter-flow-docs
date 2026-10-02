"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ListTree, Menu, X } from "lucide-react";
import { Dialog } from "radix-ui";

import { TocList, useToc } from "@/components/toc";
import { GROUPS, NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="block">
      <div className="text-xs font-semibold tracking-wider text-brand uppercase">Flow Docs</div>
      <div className="text-lg font-semibold tracking-tight">IAA &amp; IAP</div>
    </Link>
  );
}

/** Grouped page list. The hint line shows for the current page only, unless roomy. */
function NavList({
  here,
  roomy,
  onPick,
}: {
  here: string;
  roomy?: boolean;
  onPick?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-5">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mb-1.5 px-3 text-[0.68rem] font-semibold tracking-wider text-muted-foreground/80 uppercase">
            {group.title}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = here === norm(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.hint}
                  onClick={onPick}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-accent font-medium text-accent-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-brand"
                      : "text-foreground/70 hover:bg-accent/50 hover:text-foreground",
                  )}
                >
                  {item.label}
                  {active || roomy ? (
                    <span className="block text-xs text-muted-foreground/80">{item.hint}</span>
                  ) : null}
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
function Pager({ here }: { here: string }) {
  const i = NAV.findIndex((n) => norm(n.href) === here);
  if (i < 0) return null;
  const prev = NAV[i - 1];
  const next = NAV[i + 1];
  const card =
    "group flex flex-1 flex-col gap-0.5 rounded-lg border px-4 py-3 transition-colors hover:border-foreground/30 hover:bg-accent/40";
  return (
    <nav aria-label="Trang trước và trang sau" className="mt-16 flex flex-col gap-3 border-t pt-6 sm:flex-row">
      {prev ? (
        <Link href={prev.href} className={card}>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="size-3.5" aria-hidden />
            Trang trước
          </span>
          <span className="text-sm font-medium">{prev.label}</span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
      {next ? (
        <Link href={next.href} className={cn(card, "sm:items-end sm:text-right")}>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Trang sau
            <ArrowRight className="size-3.5" aria-hidden />
          </span>
          <span className="text-sm font-medium">{next.label}</span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
    </nav>
  );
}

const iconButton =
  "inline-flex size-9 items-center justify-center rounded-md border text-foreground/80 transition-colors hover:bg-accent hover:text-foreground";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const here = norm(pathname);
  const current = NAV.find((n) => norm(n.href) === here);
  const toc = useToc(pathname);
  const [menu, setMenu] = useState(false);
  const [outline, setOutline] = useState(false);

  return (
    <div className="mx-auto flex max-w-[88rem] gap-8 lg:px-8">
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col gap-6 overflow-y-auto py-8 pr-1 lg:flex">
        <Brand />
        <NavList here={here} />
      </aside>

      <div className="min-w-0 flex-1">
        {/* Phone and tablet: one sticky bar instead of the sidebar. */}
        <div className="sticky top-0 z-30 flex items-center gap-2 border-b bg-background/90 px-4 py-2.5 backdrop-blur lg:hidden">
          <Dialog.Root open={menu} onOpenChange={setMenu}>
            <Dialog.Trigger className={iconButton} aria-label="Mở danh sách trang">
              <Menu className="size-4.5" aria-hidden />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-y-0 left-0 z-50 flex w-[19rem] max-w-[86vw] flex-col gap-6 overflow-y-auto border-r bg-background px-4 py-5 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left"
              >
                <div className="flex items-start justify-between">
                  <Dialog.Title asChild>
                    <div>
                      <Brand onClick={() => setMenu(false)} />
                    </div>
                  </Dialog.Title>
                  <Dialog.Close className={iconButton} aria-label="Đóng">
                    <X className="size-4.5" aria-hidden />
                  </Dialog.Close>
                </div>
                <NavList here={here} roomy onPick={() => setMenu(false)} />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{current?.label ?? "Flow Docs"}</p>
          </div>

          {toc.items.length > 1 ? (
            <Dialog.Root open={outline} onOpenChange={setOutline}>
              <Dialog.Trigger className={iconButton} aria-label="Mở mục lục của trang">
                <ListTree className="size-4.5" aria-hidden />
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <Dialog.Content
                  aria-describedby={undefined}
                  className="fixed inset-x-3 top-14 z-50 max-h-[70svh] overflow-y-auto rounded-xl border bg-popover p-4 shadow-xl data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
                >
                  <Dialog.Title className="mb-2.5 text-[0.68rem] font-semibold tracking-wider text-muted-foreground uppercase">
                    Trên trang này
                  </Dialog.Title>
                  <TocList items={toc.items} active={toc.active} onPick={() => setOutline(false)} />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          ) : null}
        </div>

        <div className="flex gap-10 px-4 lg:px-0">
          <main className="min-w-0 max-w-[50rem] flex-1 py-8 lg:py-12">
            {children}
            <Pager here={here} />
          </main>

          {toc.items.length > 1 ? (
            <aside className="sticky top-0 hidden h-svh w-52 shrink-0 overflow-y-auto py-12 xl:block">
              <p className="mb-2.5 text-[0.68rem] font-semibold tracking-wider text-muted-foreground uppercase">
                Trên trang này
              </p>
              <TocList items={toc.items} active={toc.active} />
            </aside>
          ) : (
            <div className="hidden w-52 shrink-0 xl:block" />
          )}
        </div>
      </div>
    </div>
  );
}
