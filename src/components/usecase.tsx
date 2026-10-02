import { T } from "@/components/locale";
import { Badge } from "@/components/ui/badge";
import type { UiKey } from "@/lib/ui";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * One worked example: symptom → what happens inside → what goes wrong if done
 * badly → lesson. The lesson must be broader than the case and must not repeat
 * a sentence from the parts above. The flow slot takes a diagram,
 * a small table, or plain text.
 */
export function UseCase({
  n,
  title,
  situation,
  flow,
  why,
  lesson,
}: {
  n: string;
  title: string;
  situation: React.ReactNode;
  flow?: React.ReactNode;
  why: React.ReactNode;
  lesson: React.ReactNode;
}) {
  return (
    <Card className="my-6 gap-0 rounded-2xl py-5 shadow-none ring-0 border">
      <CardContent className="space-y-4 px-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="secondary" className="font-mono text-[10px]">
            <T k="usecase" /> {n}
          </Badge>
          <h3 className="font-heading text-[1.2rem] leading-snug font-medium">{title}</h3>
        </div>
        <Part label="situation">{situation}</Part>
        {flow ? <Part label="inside">{flow}</Part> : null}
        <Part label="mechanism">{why}</Part>
        <div className="rounded-xl border-l-[3px] border-l-emerald-500/80 bg-muted/60 px-4 py-2.5 text-sm">
          <span className="font-semibold">
            <T k="lesson" />:{" "}
          </span>
          <span className="text-foreground/80">{lesson}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Part({ label, children }: { label: UiKey; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[0.72rem] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
        <T k={label} />
      </p>
      <div className="space-y-2 text-sm text-foreground/80 [&_figure]:my-2 [&>div]:my-1">
        {children}
      </div>
    </div>
  );
}

/**
 * Code block. A line too long for the column wraps instead of making the
 * block scroll sideways.
 */
export function Code({ children }: { children: string }) {
  return (
    <pre className="rounded-2xl border bg-card px-4 py-3.5 font-mono text-[0.8125rem] leading-[1.7] [overflow-wrap:anywhere] whitespace-pre-wrap">
      {children}
    </pre>
  );
}

/** Short side-by-side snippet, Flutter and SwiftUI. Illustration only. */
export function CodeTabs({ flutter, swift }: { flutter: string; swift: string }) {
  return (
    <Tabs defaultValue="flutter" className="my-3">
      <TabsList>
        <TabsTrigger value="flutter">Flutter</TabsTrigger>
        <TabsTrigger value="swift">SwiftUI</TabsTrigger>
      </TabsList>
      {(
        [
          ["flutter", flutter],
          ["swift", swift],
        ] as const
      ).map(([k, code]) => (
        <TabsContent key={k} value={k}>
          <Code>{code}</Code>
        </TabsContent>
      ))}
    </Tabs>
  );
}

/** Marks numbers in an example as made up for illustration. */
export function Assumed() {
  return (
    <Badge variant="outline" className="ml-1 align-middle text-[10px] font-normal">
      <T k="assumed" />
    </Badge>
  );
}
