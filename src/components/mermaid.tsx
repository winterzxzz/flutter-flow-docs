"use client";

import { useEffect, useId, useState } from "react";

// Mermaid ships a large bundle and touches the DOM, so it is imported lazily
// on the client only. Each diagram renders into its own container.
export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const mermaid = (await import("mermaid")).default;

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        themeVariables: {
          fontSize: "13px",
          background: "transparent",
          primaryColor: "#f4f4f5",
          primaryTextColor: "#18181b",
          primaryBorderColor: "#d4d4d8",
          lineColor: "#a1a1aa",
          secondaryColor: "#fafafa",
          tertiaryColor: "#fafafa",
        },
        flowchart: { curve: "basis", padding: 14, nodeSpacing: 34, rankSpacing: 44 },
        sequence: { actorMargin: 44, useMaxWidth: true },
      });

      try {
        const { svg } = await mermaid.render(`m-${id}`, chart);
        if (!cancelled) setSvg(svg);
      } catch {
        if (!cancelled) setSvg("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <figure className="my-6">
      <div
        className="overflow-x-auto rounded-xl border bg-card p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
