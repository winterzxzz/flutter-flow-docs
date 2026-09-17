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
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12.5px]">
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
    info: "border-l-foreground/30",
    warn: "border-l-destructive",
    good: "border-l-foreground/60",
  }[tone];

  return (
    <div className={cn("my-5 rounded-lg border border-l-4 bg-card p-4", border)}>
      <p className="mb-1 text-sm font-semibold">{title}</p>
      <div className="space-y-2 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

/** Simple key/value table. */
export function Facts({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <Table className="my-5">
      <TableBody>
        {rows.map(([k, v]) => (
          <TableRow key={k}>
            <TableCell className="w-56 align-top font-medium">{k}</TableCell>
            <TableCell className="text-muted-foreground">{v}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Column table with a header row. */
export function Grid({
  head,
  rows,
}: {
  head: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <Table className="my-5">
      <TableHeader>
        <TableRow>
          {head.map((h) => (
            <TableHead key={h}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow key={i}>
            {r.map((cell, j) => (
              <TableCell
                key={j}
                className={j === 0 ? "font-medium" : "text-muted-foreground"}
              >
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
    <Card className="gap-0 py-4">
      <CardContent className="px-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
        {sub ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
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

/** File path reference shown under a claim. */
export function Src({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 font-mono text-[11px] text-muted-foreground/70">
      {children}
    </p>
  );
}
