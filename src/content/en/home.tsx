import { Link } from "@/components/locale";

import { Canvas, Figure, Group, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, P } from "@/components/bits";

const link = "underline underline-offset-4";

export default function Home() {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Making money in an app: IAA and IAP"
        lead="An app that both sells plans and shows ads has two revenue streams running through the same startup flow, the same control panel and the same measurement stack. Most of what breaks does not crash: someone who has paid still sees ads, ad revenue never reaches the analytics warehouse, a profitable campaign gets switched off because ROAS is missing half of its numerator. This guide explains the mechanism behind each of those failures, for both Flutter and SwiftUI."
      />

      <Section title="Entitlement is the thread that ties the two revenue streams together">
        <P>
          IAP and IAA look like two independent systems: one talks to the App
          Store or Google Play, the other talks to the Ad SDK. They meet at
          exactly one point, the entitlement, meaning the access right that the
          store or the server confirms. For someone who has the right, the ad
          layer must stay silent; for someone who does not, every load and show
          call still has to pass consent, Remote Config and the spacing gate.
          Both revenue streams end up in the same analytics warehouse and the
          same MMP, where they are added together into ARPU, LTV and ROAS.
        </P>
        <Figure caption="Entitlement turns ads off; both revenue streams flow into the same measurement stack">
          <Canvas
            className="mx-auto max-w-2xl"
            cols="repeat(2, minmax(0, 1fr))"
            gap={["4.6rem", "1.9rem"]}
            wgap={["9rem", "1.9rem"]}
            edges={[
              { from: "ctl", to: "ADS", outAt: "align" },
              { from: "ST", to: "ENT" },
              {
                from: "ENT",
                to: "ADS",
                label: "entitled: ads off",
                tone: "main",
                inAt: "align",
                narrow: { lw: 4.2 },
              },
              { from: "ADS", to: "MMP", inAt: "align" },
              {
                from: "ADS",
                to: "EV",
                label: "revenue per impression",
                bend: 0.7,
                inAt: 0.14,
                narrow: { bend: 0.86 },
              },
              { from: "ST", to: "EV", label: "transaction revenue", inAt: "align", t: 0.42 },
              { from: "MMP", to: "EV", label: "install source", outAt: "align", narrow: { lw: 3.4 } },
            ]}
          >
            <Group id="ctl" title="Control" col="1 / -1" row="1" cols="repeat(2, minmax(0, 1fr))">
              <Node id="RC" sub="on/off, spacing, ad units">
                Remote Config
              </Node>
              <Node id="CS" sub="UMP · ATT">
                Consent
              </Node>
            </Group>
            <Group title="IAA · ads" col="1" row="2">
              <Node id="ADS" sub="load · show · paid event">
                Ad SDK
              </Node>
            </Group>
            <Group title="IAP · purchases" col="2" row="2" gap={["0.6rem", "1.5rem"]}>
              <Node id="ENT" tone="key">
                Entitlement
              </Node>
              <Node id="ST" sub="StoreKit · Play Billing">
                Store
              </Node>
            </Group>
            <Group
              title="Measurement"
              className="mt-16"
              col="1 / -1"
              row="3"
              cols="repeat(2, minmax(0, 1fr))"
              gap={["5rem", "0.6rem"]}
              wgap={["8.4rem", "0.6rem"]}
            >
              <Node id="MMP" sub="Adjust · AppsFlyer">
                MMP
              </Node>
              <Node id="EV">Analytics warehouse</Node>
            </Group>
          </Canvas>
        </Figure>
      </Section>

      <Section title="Concepts first, APIs next, lessons last">
        <P>
          The concept pages are not tied to any codebase: they cover mechanism,
          reasons and trade-offs, with use cases built on assumed figures.
          Numbers such as retry counts or timeouts are reference values that
          come with a reason; official recommendations from Google or Apple
          cite their source right underneath. Once the mechanism is clear, the{" "}
          <Link href="/platforms" className={link}>
            Flutter ↔ SwiftUI
          </Link>{" "}
          page tells you which API each concept is called by, and the{" "}
          <Link href="/lessons" className={link}>
            Common mistakes
          </Link>{" "}
          page recounts the places that failed silently in a real Flutter
          project. The{" "}
          <Link href="/deep/preload" className={link}>
            Deep dives
          </Link>{" "}
          section answers harder questions about ad metrics.
        </P>
        <Grid
          head={["If you need to", "Start at"]}
          rows={[
            ["Build a new app with ads and IAP", "Startup → IAA → IAP → Remote Config"],
            ["Understand why an ad does not show", "Load, retry, refresh → Deep dives"],
            ["Handle subscriptions correctly", "Purchase flow → Subscription"],
            ["Measure revenue and install source", "Tracking → UA · Measurement plan"],
            ["Port a feature between the two platforms", "Flutter ↔ SwiftUI"],
          ]}
        />
      </Section>
    </>
  );
}
