"use client";

import { useEffect, useId, useRef, useState } from "react";

type Side = "t" | "b" | "l" | "r";
/** 0..1 is a fraction along the side, above 1 is pixels from its start,
 *  "align" lines the anchor up with the other end so the edge runs straight. */
type Anchor = number | "align";
type Route = {
  out?: Side;
  in?: Side;
  outAt?: Anchor;
  inAt?: Anchor;
  /** Where a Z-shaped edge turns, as a fraction of the gap. */
  bend?: number;
  /** Which segment carries the label. Default is the longest one. */
  at?: "start" | "mid" | "end";
  /** How far along that segment the label sits, 0..1. */
  t?: number;
  /** Max label width in rem, for labels that must wrap inside a tight gap. */
  lw?: number;
  /** Draw the arrowhead. Default true. */
  head?: boolean;
};
export type Edge = Route & {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  tone?: "main" | "good" | "bad" | "warn";
  /** Draw this edge in one layout only. */
  only?: "wide" | "narrow";
  /** Overrides used when the diagram is in its narrow layout. */
  narrow?: Route;
};

type Box = { x: number; y: number; w: number; h: number };
type Pt = [number, number];
type Drawn = {
  key: string;
  d: string;
  tone?: Edge["tone"];
  dashed?: boolean;
  head: boolean;
  label?: string;
  lw?: number;
  lx: number;
  ly: number;
};

// Matches the @container (min-width: 36rem) switch in globals.css.
const WIDE = 576;
const TONES = ["base", "main", "good", "bad", "warn"] as const;

function anchor(b: Box, side: Side, at: number): Pt {
  const f = (len: number) => (at > 1 ? Math.min(at, len) : at * len);
  if (side === "t") return [b.x + f(b.w), b.y];
  if (side === "b") return [b.x + f(b.w), b.y + b.h];
  if (side === "l") return [b.x, b.y + f(b.h)];
  return [b.x + b.w, b.y + f(b.h)];
}

function autoSides(s: Box, t: Box): [Side, Side] {
  if (t.y >= s.y + s.h - 1) return ["b", "t"];
  if (t.y + t.h <= s.y + 1) return ["t", "b"];
  if (t.x >= s.x + s.w - 1) return ["r", "l"];
  return ["l", "r"];
}

const vertical = (s: Side) => s === "t" || s === "b";
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

function route(p0: Pt, s0: Side, p1: Pt, s1: Side, bend: number): Pt[] {
  const [x0, y0] = p0;
  const [x1, y1] = p1;
  if (vertical(s0) && vertical(s1)) {
    if (s0 === s1) {
      const y = s0 === "b" ? Math.max(y0, y1) + 18 : Math.min(y0, y1) - 18;
      return [p0, [x0, y], [x1, y], p1];
    }
    if (Math.abs(x0 - x1) < 1.5) return [p0, [x0, y1]];
    const y = y0 + (y1 - y0) * bend;
    return [p0, [x0, y], [x1, y], p1];
  }
  if (!vertical(s0) && !vertical(s1)) {
    if (s0 === s1) {
      const x = s0 === "r" ? Math.max(x0, x1) + 18 : Math.min(x0, x1) - 18;
      return [p0, [x, y0], [x, y1], p1];
    }
    if (Math.abs(y0 - y1) < 1.5) return [p0, [x1, y0]];
    const x = x0 + (x1 - x0) * bend;
    return [p0, [x, y0], [x, y1], p1];
  }
  return vertical(s0) ? [p0, [x0, y1], p1] : [p0, [x1, y0], p1];
}

function toPath(pts: Pt[]): string {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    const next = pts[i + 1];
    if (!next) {
      d += `L${x},${y}`;
      continue;
    }
    const [px, py] = pts[i - 1];
    const r = Math.min(8, Math.hypot(x - px, y - py) / 2, Math.hypot(next[0] - x, next[1] - y) / 2);
    const ax = x - Math.sign(x - px) * r;
    const ay = y - Math.sign(y - py) * r;
    const bx = x + Math.sign(next[0] - x) * r;
    const by = y + Math.sign(next[1] - y) * r;
    d += `L${ax},${ay}Q${x},${y} ${bx},${by}`;
  }
  return d;
}

function labelPoint(pts: Pt[], at?: Route["at"], t = 0.5): Pt {
  const segs = pts.slice(1).map((p, i) => [pts[i], p] as const);
  let pick = segs[0];
  if (at === "end") pick = segs[segs.length - 1];
  else if (at === "mid") pick = segs[Math.floor(segs.length / 2)];
  else if (at !== "start") {
    for (const s of segs) {
      const len = (q: readonly [Pt, Pt]) => Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]);
      if (len(s) > len(pick)) pick = s;
    }
  }
  return [
    pick[0][0] + (pick[1][0] - pick[0][0]) * t,
    pick[0][1] + (pick[1][1] - pick[0][1]) * t,
  ];
}

function draw(root: HTMLElement, edges: Edge[]) {
  const rb = root.getBoundingClientRect();
  const narrow = rb.width < WIDE;
  const boxes = new Map<string, Box>();
  root.querySelectorAll<HTMLElement>("[data-n]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width && el.dataset.n)
      boxes.set(el.dataset.n, { x: r.left - rb.left, y: r.top - rb.top, w: r.width, h: r.height });
  });

  const items: Drawn[] = [];
  edges.forEach((edge, i) => {
    const s = boxes.get(edge.from);
    const t = boxes.get(edge.to);
    if (!s || !t) return;
    if (edge.only && (edge.only === "narrow") !== narrow) return;
    const e = narrow && edge.narrow ? { ...edge, ...edge.narrow } : edge;
    const [as, at] = autoSides(s, t);
    const so = e.out ?? as;
    const si = e.in ?? at;
    let p0 = anchor(s, so, e.outAt === "align" || e.outAt == null ? 0.5 : e.outAt);
    let p1 = anchor(t, si, e.inAt === "align" || e.inAt == null ? 0.5 : e.inAt);
    if (e.inAt === "align")
      p1 = vertical(si)
        ? [clamp(p0[0], t.x + 10, t.x + t.w - 10), p1[1]]
        : [p1[0], clamp(p0[1], t.y + 10, t.y + t.h - 10)];
    if (e.outAt === "align")
      p0 = vertical(so)
        ? [clamp(p1[0], s.x + 10, s.x + s.w - 10), p0[1]]
        : [p0[0], clamp(p1[1], s.y + 10, s.y + s.h - 10)];
    const pts = route(p0, so, p1, si, e.bend ?? 0.5);
    const [lx, ly] = labelPoint(pts, e.at, e.t);
    items.push({
      key: `${edge.from}-${edge.to}-${i}`,
      d: toPath(pts),
      tone: edge.tone,
      dashed: edge.dashed,
      head: e.head ?? true,
      label: edge.label,
      lw: e.lw,
      lx,
      ly,
    });
  });
  return items;
}

/**
 * Lays its children out in a CSS grid and draws the edges between them after
 * measuring where the boxes ended up. Boxes are real HTML, so text keeps its
 * size at every width; only the connectors wait for the client.
 */
export function Canvas({
  edges,
  cols,
  wcols,
  gap,
  wgap,
  className,
  children,
}: {
  edges: Edge[];
  /** grid-template-columns for the narrow and the wide layout. */
  cols?: string;
  wcols?: string;
  /** [column gap, row gap] for the narrow and the wide layout. */
  gap?: [string, string];
  wgap?: [string, string];
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const [items, setItems] = useState<Drawn[]>([]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ro = new ResizeObserver(() => setItems(draw(root, edges)));
    ro.observe(root);
    root.querySelectorAll("[data-n]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [edges]);

  const style = {
    "--gc": cols,
    "--wgc": wcols,
    "--gx": gap?.[0],
    "--gy": gap?.[1],
    "--wgx": wgap?.[0],
    "--wgy": wgap?.[1],
  } as React.CSSProperties;

  return (
    <div ref={ref} className="dg-canvas">
      <svg className="dg-edges" width="100%" height="100%" aria-hidden>
        <defs>
          {TONES.map((tone) => (
            <marker
              key={tone}
              id={`${uid}-${tone}`}
              data-tone={tone}
              markerUnits="userSpaceOnUse"
              markerWidth="9"
              markerHeight="9"
              refX="8"
              refY="4.5"
              orient="auto"
            >
              <path d="M0,0.5L8.5,4.5L0,8.5Z" />
            </marker>
          ))}
        </defs>
        {items.map((it) => (
          <path
            key={it.key}
            d={it.d}
            data-tone={it.tone}
            data-dashed={it.dashed ? "" : undefined}
            markerEnd={it.head ? `url(#${uid}-${it.tone ?? "base"})` : undefined}
          />
        ))}
      </svg>
      <div className={className ? `dg-grid ${className}` : "dg-grid"} style={style}>
        {children}
      </div>
      {items.map((it) =>
        it.label ? (
          <span
            key={it.key}
            className="dg-elabel"
            style={{ left: it.lx, top: it.ly, maxWidth: it.lw ? `${it.lw}rem` : undefined }}
          >
            {it.label}
          </span>
        ) : null,
      )}
    </div>
  );
}
