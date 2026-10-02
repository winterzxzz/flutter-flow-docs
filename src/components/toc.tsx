"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Item = { id: string; text: string };

/**
 * Reads the section headings of the page currently in <main> and tracks which
 * one is being read. pathname is the reset key: a new page means new headings.
 */
export function useToc(pathname: string) {
  const [state, setState] = useState<{ path: string; items: Item[]; active: string }>({
    path: "",
    items: [],
    active: "",
  });

  useEffect(() => {
    const heads = [...document.querySelectorAll<HTMLElement>("main [data-toc]")];
    const items = heads.map((h) => ({ id: h.id, text: h.textContent ?? "" }));

    // The section being read is the last heading that has passed the top of
    // the viewport. Measured on scroll, so a jump lands on the right entry too.
    let frame = 0;
    const measure = () => {
      frame = 0;
      let active = items[0]?.id ?? "";
      for (const h of heads) {
        if (h.getBoundingClientRect().top > 120) break;
        active = h.id;
      }
      setState((s) =>
        s.path === pathname && s.active === active && s.items.length === items.length
          ? s
          : { path: pathname, items, active },
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return state.path === pathname ? state : { path: pathname, items: [], active: "" };
}

export function TocList({
  items,
  active,
  onPick,
}: {
  items: Item[];
  active: string;
  onPick?: () => void;
}) {
  return (
    <ul className="space-y-0.5 border-l">
      {items.map((i) => (
        <li key={i.id}>
          <a
            href={`#${i.id}`}
            onClick={onPick}
            className={cn(
              "-ml-px block border-l py-1 pl-3 text-[0.8rem] leading-snug transition-colors",
              i.id === active
                ? "border-brand font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {i.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
