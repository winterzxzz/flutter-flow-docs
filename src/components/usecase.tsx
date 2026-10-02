import { Badge } from "@/components/ui/badge";
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
    <Card className="my-6 gap-0 py-5">
      <CardContent className="space-y-4 px-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="secondary" className="font-mono text-[10px]">
            Usecase {n}
          </Badge>
          <h3 className="text-base font-semibold">{title}</h3>
        </div>
        <Part label="Tình huống">{situation}</Part>
        {flow ? <Part label="Bên trong">{flow}</Part> : null}
        <Part label="Cơ chế · nếu làm sai">{why}</Part>
        <div className="rounded-md border-l-4 border-l-emerald-400/70 bg-muted/40 px-3 py-2 text-sm">
          <span className="font-semibold">Bài học: </span>
          <span className="text-foreground/80">{lesson}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Part({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="space-y-2 text-sm text-foreground/80 [&_figure]:my-2">
        {children}
      </div>
    </div>
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
          <pre className="overflow-x-auto rounded-xl border bg-muted/40 p-4 font-mono text-[12px] leading-relaxed">
            {code}
          </pre>
        </TabsContent>
      ))}
    </Tabs>
  );
}

/** Marks numbers in an example as made up for illustration. */
export function Assumed() {
  return (
    <Badge variant="outline" className="ml-1 align-middle text-[10px] font-normal">
      số liệu giả định
    </Badge>
  );
}
