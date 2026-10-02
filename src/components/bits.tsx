import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/** Inline code with a consistent look across every page. */
export function C({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border border-border/60 bg-muted box-decoration-clone px-1.5 py-0.5 font-mono text-[0.86em] [overflow-wrap:anywhere] text-foreground/95">
      {children}
    </code>
  );
}

/** Short callout. tone drives the left border colour only. */
export function Note({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn" | "good";
  title: string;
  children: React.ReactNode;
}) {
  const border = {
    info: "border-l-sky-400/70",
    warn: "border-l-destructive",
    good: "border-l-emerald-400/70",
  }[tone];

  return (
    <div className={cn("my-5 rounded-lg border border-l-4 bg-card p-4", border)}>
      <p className="mb-1.5 text-sm font-semibold">{title}</p>
      <div className="space-y-2 text-sm text-foreground/75">{children}</div>
    </div>
  );
}

/** Frame shared by every table: one border, no horizontal scroll of its own. */
function Framed({ children }: { children: React.ReactNode }) {
  return <div className="my-5 overflow-hidden rounded-lg border">{children}</div>;
}

/** Simple key/value table. On a phone the value drops under its key. */
export function Facts({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <Framed>
      <Table>
        <TableBody>
          {rows.map(([k, v]) => (
            <TableRow key={k} className="max-sm:block max-sm:px-3 max-sm:py-2.5">
              <TableCell className="font-medium max-sm:block max-sm:p-0 sm:w-56">{k}</TableCell>
              <TableCell className="text-foreground/75 max-sm:block max-sm:p-0 max-sm:pt-0.5">
                {v}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Framed>
  );
}

const STACK_CELL = "max-sm:block max-sm:p-0 max-sm:py-0.5";
const STACK_LABEL =
  "max-sm:before:mt-1.5 max-sm:before:block max-sm:before:text-[0.7rem] max-sm:before:font-semibold max-sm:before:tracking-wide max-sm:before:text-muted-foreground max-sm:before:uppercase max-sm:before:content-[attr(data-label)]";

/** A cell is long when it is markup or more than a short phrase. */
const long = (cell: React.ReactNode) => typeof cell !== "string" || cell.length > 36;

/**
 * Column table with a header row. Cells wrap, so the table never scrolls
 * sideways. On a phone, a table too wide to read as columns (four columns, or
 * three with long cells) turns each row into a block with the column name
 * above each value.
 */
export function Grid({
  head,
  rows,
}: {
  head: string[];
  rows: React.ReactNode[][];
}) {
  const stack =
    head.length > 3 || (head.length === 3 && rows.some((r) => r.slice(1).some(long)));
  return (
    <Framed>
      <Table>
        <TableHeader className={stack ? "max-sm:hidden" : undefined}>
          <TableRow className="hover:bg-transparent">
            {head.map((h) => (
              <TableHead key={h}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i} className={stack ? "max-sm:block max-sm:px-3 max-sm:py-2.5" : undefined}>
              {r.map((cell, j) => (
                <TableCell
                  key={j}
                  data-label={head[j] || undefined}
                  className={cn(
                    j === 0 ? "font-medium" : "text-foreground/75",
                    stack && STACK_CELL,
                    stack && j > 0 && head[j] && STACK_LABEL,
                  )}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Framed>
  );
}

/** Card that states one fact in large type. */
export function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card className="gap-0 py-3 sm:py-4">
      <CardContent className="flex items-center justify-between gap-4 px-4 sm:block">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          {sub ? (
            <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">{sub}</p>
          ) : null}
        </div>
        <p className="shrink-0 text-2xl font-semibold tabular-nums sm:mt-1">{value}</p>
        {sub ? (
          <p className="mt-0.5 text-xs text-muted-foreground max-sm:hidden">{sub}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="secondary" className="font-mono text-[11px] font-normal">
      {children}
    </Badge>
  );
}

/** Official source backing a platform claim, shown under the claim. */
export function Ref({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <p className="mt-2.5 text-[12px] text-muted-foreground/80">
      Nguồn:{" "}
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-4 hover:text-foreground"
      >
        {children}
      </a>
    </p>
  );
}

/** Body paragraph. Concept pages argue in prose; tables are for lookup. */
export function P({ children }: { children: React.ReactNode }) {
  return <p className="my-3 text-[15px] leading-7 text-foreground/80">{children}</p>;
}
