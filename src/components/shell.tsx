"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GROUPS, NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);

export function Shell({ children }: { children: React.ReactNode }) {
  const here = norm(usePathname());

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 lg:px-8">
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col overflow-y-auto py-8 lg:flex">
        <Link href="/" className="mb-6 block">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Flow Docs
          </div>
          <div className="text-lg font-semibold tracking-tight">Base &amp; Lib</div>
        </Link>

        <nav className="flex flex-col gap-5">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.title}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = here === norm(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-accent font-medium text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                      )}
                    >
                      {item.label}
                      <span className="block text-[11px] text-muted-foreground/60">
                        {item.hint}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 py-8 lg:py-12">
        <div className="mb-8 flex flex-wrap gap-1.5 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs",
                here === norm(item.href)
                  ? "bg-accent font-medium"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {children}
      </main>
    </div>
  );
}
