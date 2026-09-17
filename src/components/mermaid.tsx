"use client";

import { useEffect, useId, useState } from "react";

// Mermaid ships a large bundle and touches the DOM, so it is imported lazily
// on the client only. Each diagram renders into its own container.
//
// The palette is tuned for the dark theme: node fills sit just above the card
// background, borders and edges stay light enough to read without glowing.
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
        fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
        themeVariables: {
          fontSize: "14px",
          darkMode: true,
          background: "transparent",

          // nodes
          primaryColor: "#2c2c2c",
          primaryTextColor: "#ededed",
          primaryBorderColor: "#4a4a4a",
          secondaryColor: "#262626",
          secondaryTextColor: "#ededed",
          secondaryBorderColor: "#404040",
          tertiaryColor: "#242424",
          tertiaryTextColor: "#ededed",
          tertiaryBorderColor: "#3d3d3d",

          // edges and labels
          lineColor: "#8a8a8a",
          textColor: "#d6d6d6",
          edgeLabelBackground: "#1f1f1f",

          // clusters (subgraph)
          clusterBkg: "#202020",
          clusterBorder: "#3d3d3d",

          // sequence diagram
          actorBkg: "#2c2c2c",
          actorBorder: "#4a4a4a",
          actorTextColor: "#ededed",
          actorLineColor: "#6b6b6b",
          signalColor: "#c8c8c8",
          signalTextColor: "#d6d6d6",
          labelBoxBkgColor: "#2c2c2c",
          labelBoxBorderColor: "#4a4a4a",
          labelTextColor: "#ededed",
          loopTextColor: "#d6d6d6",
          noteBkgColor: "#33302a",
          noteBorderColor: "#5c5343",
          noteTextColor: "#e8e0d0",
          sequenceNumberColor: "#1a1a1a",

          // state diagram
          labelColor: "#ededed",
          transitionColor: "#8a8a8a",
          transitionLabelColor: "#d6d6d6",
          stateBkg: "#2c2c2c",
          stateBorder: "#4a4a4a",
          altBackground: "#242424",
          compositeBackground: "#202020",
          compositeBorder: "#3d3d3d",
          compositeTitleBackground: "#262626",
        },
        flowchart: {
          curve: "basis",
          padding: 16,
          nodeSpacing: 38,
          rankSpacing: 50,
          useMaxWidth: true,
        },
        sequence: { actorMargin: 46, useMaxWidth: true },
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
        className="overflow-x-auto rounded-xl border bg-card/60 p-5 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption ? (
        <figcaption className="mt-2.5 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
