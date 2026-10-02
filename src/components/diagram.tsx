import { CircleCheck, CircleX, Diamond, RotateCw, StickyNote, TriangleAlert } from "lucide-react";

import { Canvas, type Edge } from "@/components/diagram-canvas";
import { cn } from "@/lib/utils";

export { Canvas, type Edge };

/**
 * What a box is, not how it looks:
 * ask = a question that splits the flow, good = the outcome you want,
 * bad = money or data lost, warn = works but risky, mute = skipped or absent,
 * key = the one box the diagram is about, plain = a bare label.
 */
export type Tone = "ask" | "good" | "bad" | "warn" | "mute" | "key" | "plain";

const ICON = {
  ask: Diamond,
  good: CircleCheck,
  bad: CircleX,
  warn: TriangleAlert,
} as const;

type Place = {
  /** grid-column / grid-row in the narrow layout, and in the wide one. */
  col?: string;
  row?: string;
  wcol?: string;
  wrow?: string;
};

const place = ({ col, row, wcol, wrow }: Place) =>
  ({ "--c": col, "--r": row, "--wc": wcol, "--wr": wrow }) as React.CSSProperties;

/** Frame and caption shared by every diagram. */
export function Figure({
  caption,
  children,
}: {
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-6" data-diagram>
      <div className="dg rounded-xl border p-3 sm:p-5">{children}</div>
      {caption ? (
        <figcaption className="mt-2.5 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function Node({
  id,
  tone,
  when,
  sub,
  span,
  className,
  style,
  children,
  ...at
}: Place & {
  id?: string;
  tone?: Tone;
  /** Condition under which the flow reaches this box. */
  when?: React.ReactNode;
  sub?: React.ReactNode;
  span?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const Icon = tone && tone in ICON ? ICON[tone as keyof typeof ICON] : null;
  return (
    <div
      data-n={id}
      data-tone={tone}
      data-span={span ? "" : undefined}
      className={cn("dg-node", className)}
      style={{ ...place(at), ...style }}
    >
      {when ? <span className="dg-when">{when}</span> : null}
      <span className="dg-title">
        {Icon ? <Icon className="dg-icon" aria-hidden /> : null}
        {children}
      </span>
      {sub ? <span className="dg-sub">{sub}</span> : null}
    </div>
  );
}

/** Dashed panel that holds related boxes. Children sit in their own grid. */
export function Group({
  id,
  title,
  cols,
  wcols,
  gap,
  wgap,
  bare,
  className,
  children,
  ...at
}: Place & {
  id?: string;
  title?: string;
  cols?: string;
  wcols?: string;
  /** [column gap, row gap] for the narrow and the wide layout. */
  gap?: [string, string];
  wgap?: [string, string];
  /** Groups for layout only: no border, no fill. */
  bare?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const grid = {
    "--gc": cols,
    "--wgc": wcols,
    "--gx": gap?.[0] ?? "0.6rem",
    "--gy": gap?.[1] ?? "0.6rem",
    "--wgx": wgap?.[0],
    "--wgy": wgap?.[1],
  } as React.CSSProperties;
  return (
    <div
      data-n={id}
      data-tone={bare ? "plain" : undefined}
      className={cn("dg-group", className)}
      style={place(at)}
    >
      {title ? <p className="dg-group-title">{title}</p> : null}
      <div className="dg-grid" style={grid}>
        {children}
      </div>
    </div>
  );
}

/* ───────────────────────────── Tree ───────────────────────────── */

export type Branch = {
  label: React.ReactNode;
  sub?: React.ReactNode;
  tone?: Tone;
  when?: React.ReactNode;
  kids?: Branch[];
};

type Placed = Branch & {
  id: string;
  parent?: Placed;
  fork: boolean;
  depth: number;
  indent: number;
  first: number;
  last: number;
  order: number;
};

/**
 * Decision tree. Wide: an org chart, parents centred over their branches.
 * Narrow: an indented outline, one box per row. The condition for each branch
 * rides on the child box, so no edge label can collide with anything.
 *
 * feeds are inputs drawn above the root. join is a box every branch ends in.
 */
export function Tree({
  root,
  feeds,
  feedsAsGroup,
  join,
}: {
  root: Branch;
  feeds?: Branch[];
  /** One arrow from the whole set of feeds instead of one per feed. */
  feedsAsGroup?: boolean;
  join?: Branch;
}) {
  const nodes: Placed[] = [];
  let leaf = 0;
  let maxIndent = 0;
  let maxDepth = 0;

  const walk = (b: Branch, depth: number, indent: number, parent?: Placed): Placed => {
    const p: Placed = {
      ...b,
      id: `t${nodes.length}`,
      parent,
      fork: (parent?.kids?.length ?? 0) > 1,
      depth,
      indent,
      first: 0,
      last: 0,
      order: nodes.length,
    };
    nodes.push(p);
    maxIndent = Math.max(maxIndent, indent);
    maxDepth = Math.max(maxDepth, depth);
    const kids = b.kids ?? [];
    if (kids.length === 0) {
      p.first = p.last = leaf++;
    } else {
      const placed = kids.map((k) => walk(k, depth + 1, kids.length > 1 ? indent + 1 : indent, p));
      p.first = placed[0].first;
      p.last = placed[placed.length - 1].last;
    }
    return p;
  };
  walk(root, 0, 0);

  const top = feeds?.length ? 1 : 0;
  const edges: Edge[] = nodes
    .filter((n) => n.parent)
    .map((n) => ({
      from: n.parent!.id,
      to: n.id,
      bend: 0.4,
      head: !n.when,
      narrow: n.fork ? { out: "b", in: "l", outAt: 13, inAt: 0.5 } : undefined,
    }));

  if (feeds?.length) {
    if (feedsAsGroup) edges.push({ from: "feeds", to: "t0" });
    else feeds.forEach((_, i) => edges.push({ from: `f${i}`, to: "t0" }));
  }

  if (join) {
    const leaves = nodes.filter((n) => !n.kids?.length);
    // Wide: every branch runs into the join. Narrow: the trunk of the last
    // fork carries on down past its branches into the join.
    leaves.forEach((n) => edges.push({ from: n.id, to: "join", only: "wide", bend: 0.6 }));
    const forks = nodes.filter((n) => (n.kids?.length ?? 0) > 1);
    const trunk = forks.length ? forks[forks.length - 1] : leaves[leaves.length - 1];
    edges.push({
      from: trunk.id,
      to: "join",
      only: "narrow",
      ...(forks.length ? { out: "b", in: "t", outAt: 13, inAt: "align" } : {}),
    });
  }

  return (
    <Canvas
      edges={edges}
      className="dg-tree"
      cols={`repeat(${maxIndent}, 1.6rem) minmax(0, 1fr)`}
      wcols={`repeat(${leaf}, minmax(0, 1fr))`}
      gap={["0px", "1.15rem"]}
      wgap={["0.75rem", "2.4rem"]}
    >
      {feeds?.length ? (
        <div
          data-n={feedsAsGroup ? "feeds" : undefined}
          className={feedsAsGroup ? "dg-group" : undefined}
          style={place({ col: "1 / -1", row: "1" })}
        >
          <div
            className="dg-feeds"
            style={{ "--feeds": feedsAsGroup ? 2 : feeds.length } as React.CSSProperties}
          >
            {feeds.map((f, i) => (
              <Node key={i} id={`f${i}`} tone={f.tone} sub={f.sub}>
                {f.label}
              </Node>
            ))}
          </div>
        </div>
      ) : null}
      {nodes.map((n) => (
        <Node
          key={n.id}
          id={n.id}
          tone={n.tone}
          when={n.when}
          sub={n.sub}
          span={n.last > n.first}
          col={`${n.indent + 1} / -1`}
          row={`${n.order + 1 + top}`}
          wcol={`${n.first + 1} / ${n.last + 2}`}
          wrow={`${n.depth + 1 + top}`}
        >
          {n.label}
        </Node>
      ))}
      {join ? (
        <Node
          id="join"
          tone={join.tone}
          sub={join.sub}
          span
          col="1 / -1"
          row={`${nodes.length + 1 + top}`}
          wrow={`${maxDepth + 2 + top}`}
        >
          {join.label}
        </Node>
      ) : null}
    </Canvas>
  );
}

/* ───────────────────────────── Rail ───────────────────────────── */

export type RailRow = {
  label: React.ReactNode;
  sub?: React.ReactNode;
  tone?: Tone;
  /** Label on the arrow down to the next row. */
  down?: string;
  /** The step down from this row is one that does not actually happen. */
  broken?: boolean;
  /** Branch that leaves the main path at this row. */
  exit?: {
    label?: React.ReactNode;
    /** Small print under the label: what happens on the way out. */
    note?: React.ReactNode;
    /** Own destination. Without it the branch runs to the shared sink. */
    to?: React.ReactNode;
  };
};

/**
 * A chain read top to bottom: the main path runs down the left, every branch
 * that leaves it points right. Branches that end the same way share one
 * destination panel, so "they all end here" is visible without tracing edges.
 */
export function Rail({
  rows,
  sink,
}: {
  rows: RailRow[];
  sink?: { label: React.ReactNode; tone?: Tone };
}) {
  const sinkRows = rows.map((r, i) => (r.exit && !r.exit.to ? i : -1)).filter((i) => i >= 0);
  const hasExit = rows.some((r) => r.exit);
  const cols = hasExit
    ? sink
      ? "minmax(0, 1fr) minmax(3.5rem, auto) auto"
      : "minmax(0, 1fr) auto"
    : "minmax(0, 1fr)";

  return (
    <div
      className={cn("dg-rail mx-auto", hasExit ? "max-w-xl" : "max-w-sm")}
      data-solid={sink?.tone && sink.tone !== "mute" ? "" : undefined}
      style={{ "--rail-cols": cols } as React.CSSProperties}
    >
      {rows.map((r, i) => (
        <RailCells key={i} r={r} i={i} last={i === rows.length - 1} />
      ))}
      {sink && sinkRows.length ? (
        <div
          data-tone={sink.tone ?? "mute"}
          className="dg-node dg-sink"
          style={{
            gridColumn: 3,
            gridRow: `${sinkRows[0] * 2 + 1} / ${sinkRows[sinkRows.length - 1] * 2 + 2}`,
          }}
        >
          <span className="dg-title">{sink.label}</span>
        </div>
      ) : null}
    </div>
  );
}

function RailCells({ r, i, last }: { r: RailRow; i: number; last: boolean }) {
  const row = i * 2 + 1;
  return (
    <>
      <Node tone={r.tone} sub={r.sub} style={{ gridColumn: 1, gridRow: row }}>
        {r.label}
      </Node>
      {r.exit ? (
        <div className="dg-exit" style={{ gridColumn: 2, gridRow: row }}>
          {r.exit.label ? (
            <span>
              {r.exit.label}
              {r.exit.note ? <small>{r.exit.note}</small> : null}
            </span>
          ) : null}
          <u />
          <i />
          {r.exit.to ? <span className="dg-chip ml-1.5">{r.exit.to}</span> : null}
        </div>
      ) : null}
      {last ? null : (
        <div
          className="dg-down"
          data-tone={r.broken ? undefined : "main"}
          data-dashed={r.broken ? "" : undefined}
          style={{ gridColumn: 1, gridRow: row + 1 }}
        >
          {r.down ? <span>{r.down}</span> : null}
          <i />
        </div>
      )}
    </>
  );
}

/* ──────────────────────────── States ──────────────────────────── */

export type StateBox = {
  name: string;
  sub?: React.ReactNode;
  tone?: Tone;
  /** Ways into this state from outside the machine. "" is an unnamed start. */
  enter?: string[];
  /** Trigger that moves on to the next state on the main path. */
  next?: string;
  /** Every other transition out of this state. */
  exits?: { on: string; to: string }[];
};

/**
 * State machine as a main path plus exits. The path most users take runs down
 * the left; each state lists its other transitions next to it as
 * "trigger → state", so no edge ever has to loop back across the figure.
 */
export function States({ main, side }: { main: StateBox[]; side?: StateBox[] }) {
  return (
    <div className="mx-auto max-w-2xl">
      {main.map((s, i) => (
        <div key={s.name}>
          {s.enter?.length ? (
            <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 pl-1">
              {s.enter.map((e) => (
                <span key={e} className="inline-flex items-center gap-1.5 text-[0.76rem] font-medium text-foreground/90">
                  <span className="size-2 rounded-full bg-[var(--dg-line-strong)]" aria-hidden />
                  {e}
                  <span aria-hidden className="text-muted-foreground">↓</span>
                </span>
              ))}
            </div>
          ) : null}
          <StateRow s={s} />
          {i < main.length - 1 ? (
            <div className="dg-state">
              <div className="dg-down" data-tone="main">
                {s.next ? <span>{s.next}</span> : null}
                <i />
              </div>
            </div>
          ) : null}
        </div>
      ))}
      {side?.length ? (
        <div className="mt-4 space-y-2.5 border-t border-dashed pt-4">
          {side.map((s) => (
            <StateRow key={s.name} s={s} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StateRow({ s }: { s: StateBox }) {
  return (
    <div className="dg-state">
      <Node tone={s.tone} sub={s.sub}>
        {s.name}
      </Node>
      <ul className="space-y-1">
        {s.exits?.map((x) => (
          <li key={x.on + x.to} className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.78rem] leading-snug">
            <span className="text-foreground/85">{x.on}</span>
            <span aria-hidden className="text-muted-foreground">→</span>
            <span className="dg-chip">
              {x.to === s.name ? <RotateCw className="size-3" aria-hidden /> : null}
              {x.to}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────────── Lanes ──────────────────────────── */

export type LaneStep =
  | { from: string; to: string; text: React.ReactNode; reply?: boolean }
  | { self: string; text: React.ReactNode }
  | { note: string; text: React.ReactNode };

/**
 * Sequence diagram. One column per participant; each message is a row with its
 * text above an arrow spanning the two columns. The text is free to use the
 * whole row, so it stays readable when five participants share a phone screen.
 */
export function Lanes({
  actors,
  steps,
  numbered,
}: {
  actors: { id: string; label: string }[];
  steps: LaneStep[];
  numbered?: boolean;
}) {
  const n = actors.length;
  const centre = (id: string) => ((actors.findIndex((a) => a.id === id) + 0.5) / n) * 100;
  let count = 0;

  /** Text hugs the side its arrow is on, and only centres mid-figure. */
  const align = (lo: number, hi: number) => {
    const mid = (lo + hi) / 2;
    if (mid < 42) return { "--pl": `${lo}%`, "--just": "flex-start", "--ta": "left" };
    if (mid > 58) return { "--pr": `${100 - hi}%`, "--just": "flex-end", "--ta": "right" };
    return { "--just": "center", "--ta": "center" };
  };

  return (
    <div
      className="dg-lanes mx-auto max-w-3xl"
      data-dense={n > 4 ? "" : undefined}
      style={{ "--lanes": n } as React.CSSProperties}
    >
      {actors.map((a) => (
        <span key={a.id} className="dg-life" style={{ left: `${centre(a.id)}%` }} aria-hidden />
      ))}
      {actors.map((a) => (
        <div key={a.id} className="dg-node dg-actor">
          {a.label}
        </div>
      ))}
      {steps.map((s, i) => {
        if ("from" in s) {
          const a = centre(s.from);
          const b = centre(s.to);
          const lo = Math.min(a, b);
          const hi = Math.max(a, b);
          count++;
          return (
            <div key={i} className="dg-msg">
              <div className="dg-msg-text" style={align(lo, hi) as React.CSSProperties}>
                <span>
                  {numbered ? <span className="dg-num">{count}</span> : null}
                  {s.text}
                </span>
              </div>
              <div
                className="dg-arrow"
                data-dir={b > a ? "r" : "l"}
                data-reply={s.reply ? "" : undefined}
                style={{ "--from": `${lo}%`, "--len": `${hi - lo}%` } as React.CSSProperties}
              />
            </div>
          );
        }
        const isNote = "note" in s;
        const c = centre(isNote ? s.note : s.self);
        if (!isNote) count++;
        const side =
          c > 58
            ? { "--pr": `calc(${100 - c}% - 0.7rem)`, "--just": "flex-end" }
            : { "--pl": `calc(${c}% - 0.7rem)`, "--just": "flex-start" };
        return (
          <div key={i} className="dg-msg">
            <div className="dg-self" data-note={isNote ? "" : undefined} style={side as React.CSSProperties}>
              <span>
                {isNote ? <StickyNote aria-hidden /> : <RotateCw aria-hidden />}
                <span>
                  {numbered && !isNote ? <span className="dg-num">{count}</span> : null}
                  {s.text}
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────────────────── Share ──────────────────────────── */

// Categorical slots 1 and 2 of the dark palette; validated as a pair.
const SEGMENT = ["#3987e5", "#d95926"];

type ShareRowData = {
  label: string;
  parts: { pct: number; text: string }[];
  result: string;
  tone?: Tone;
};

/**
 * Part-to-whole rows: one stacked bar per row, the result at the end.
 * Used where the point is that the mix changes while each part stays the same.
 */
export function Share({ legend, rows }: { legend: string[]; rows: ShareRowData[] }) {
  return (
    <div className="mx-auto max-w-xl">
      <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.76rem] text-foreground/90">
        {legend.map((l, i) => (
          <li key={l} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px]" style={{ background: SEGMENT[i] }} aria-hidden />
            {l}
          </li>
        ))}
      </ul>
      <div className="dg-share">
        {rows.map((r) => (
          <ShareRow key={r.label} r={r} />
        ))}
      </div>
    </div>
  );
}

function ShareRow({ r }: { r: ShareRowData }) {
  return (
    <>
      <p className="pt-px text-[0.84rem] font-semibold text-foreground">{r.label}</p>
      <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
        <div className="dg-share-bar min-w-40 flex-1">
          {r.parts.map((p, i) => (
            <div key={i} style={{ flex: p.pct, "--seg": SEGMENT[i] } as React.CSSProperties}>
              <i />
              <span>{p.text}</span>
            </div>
          ))}
        </div>
        <span aria-hidden className="text-muted-foreground">→</span>
        <Node tone={r.tone} className="py-1">
          {r.result}
        </Node>
      </div>
    </>
  );
}
