import { Link } from "@/components/locale";

import { Canvas, Figure, Group, Node, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Note } from "@/components/bits";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Diagnosing metrics" };

type Case = {
  code: string;
  title: string;
  reading: string;
  cause: string;
  fix: string[];
  example: string;
};

const CASES: Case[] = [
  {
    code: "Wins every stage",
    title: "High ROAS · IPM · CTR, low CPI",
    reading: "The campaign is winning at every stage.",
    cause: "The creative hits a real need of the audience, and that audience is valuable.",
    fix: [
      "Isolate the winning elements: which feature is shown off, which visuals, which copy",
      "Produce more creatives with the same theme and style",
      "Make small tweaks and A/B test them; do not make big changes",
      "Scale the budget and watch closely so it does not drop",
    ],
    example:
      "Campaign median: CTR 1.0%, IPM 8, CPI 0.80 USD, ROAS D7 35%. Creative X: CTR 1.8%, IPM 14, CPI 0.55 USD, ROAS D7 60%.",
  },
  {
    code: "Clicks, no installs",
    title: "High CTR · CPI, low ROAS · IPM",
    reading: "Users click but leave before installing.",
    cause: "The ad and the store page are out of step.",
    fix: [
      "Align visuals, features and tone between the ad and the store",
      "Show the real gameplay or screens to set the right expectations",
      "Update the screenshots, video and description on the store",
      "If it is already aligned and nothing changes: check for click fraud or bots",
    ],
    example:
      "Creative Y: CTR 2.2% (median 1.0%) but IPM 4 (median 8), CPI 1.40 USD. The video shows off 3D graphics; the store screenshots show a flat 2D interface — users click because of the video, then do not recognize the app on the store.",
  },
  {
    code: "Many installs, no money",
    title: "High CTR · IPM, low CPI · ROAS · ARPU",
    reading: "Many cheap installs, but no money.",
    cause:
      "The ad promises one thing and the FTUE delivers another; or the audience never intended to spend.",
    fix: [
      "Align the creative with the real experience, especially the first screen",
      "Segment the users who generate revenue and retarget that group",
      "Analyze early churn and compare LTV across segments",
      "If the audience is right but does not monetize: change the creative's message",
    ],
    example:
      "Creative Z: CTR 2.0%, IPM 16, CPI 0.35 USD, but ROAS D7 12% (median 35%). The video promises “free to play, no ads”; the real app has an interstitial after every level.",
  },
  {
    code: "Few but good",
    title: "High ROAS · ARPU · CPI, low CTR · IPM",
    reading:
      "Quality users, but far too few to scale. This combination is rare; if you see it, check the data again first.",
    cause: "The creative is not engaging enough, or the store does not convert well.",
    fix: [
      "Keep the targeting as is — the audience is profitable",
      "Improve the hook in the first few seconds",
      "Test variants of the message, visuals and CTA",
      "Optimize ASO: screenshots, description, how smooth the install journey is",
    ],
    example:
      "Creative W: CTR 0.4%, IPM 3, CPI 2.10 USD, but ROAS D7 70% and ARPU 3 times the median. A long video whose first 8 seconds are a logo — few people watch through to the good part, but those who do are the right audience.",
  },
  {
    code: "Broken concept",
    title: "Every metric is low",
    reading:
      "The concept does not connect with the audience. Here a low CPI is not good news: it is low because almost nobody wants to click, meaning low demand rather than high efficiency.",
    cause:
      "The idea is off, or there is a cultural mismatch from carrying a creative over unchanged from another market.",
    fix: [
      "Review the concept: does it convey a unique value",
      "Localize visuals, language and cultural references",
      "Compare performance across markets to narrow it down",
      "Test a completely new concept; do not tweak the old one",
    ],
    example:
      "Creative V in a new market: CTR 0.3%, IPM 2, ROAS D7 8%. The CPI of 0.30 USD looks cheap only because almost nobody clicks; the video was carried over unchanged from another market, with a local meme nobody understands.",
  },
];

export default function Diagnose() {
  return (
    <>
      <PageHeader
        eyebrow="UA · concepts"
        title="Diagnosing by metric combination"
        lead="Each combination of CTR, IPM, CPI, ROAS and ARPU points to a different place where the path from ad to revenue breaks: in the creative, on the store page, or in the first experience. Misread the combination and you end up fixing something that works fine."
      />

      <Section title="First: high and low compared with what">
        <Note tone="info" title="There are no absolute thresholds">
          <p>
            <b>ROAS</b> has the only hard reference point: <C>1</C> (that is,
            100%) is break-even. Above 1 is profit, below 1 is loss. But
            &ldquo;profitable enough&rdquo; still depends on the payback period
            you choose.
          </p>
          <p>
            <b>CTR, IPM, CPI, ARPU</b> have no universal reference point: they
            vary by genre, platform and country. Take your reference point from
            your own data: the median of the creatives running in the same
            campaign, or the figures from last week for the same market. A
            &ldquo;low CTR&rdquo; creative means clearly lower than its sibling
            creatives, not lower than a number from a book.
          </p>
        </Note>
      </Section>

      <Section title="Decision tree">
        <Figure caption="Compare each metric with the median of the creatives in the same campaign, not with a fixed threshold">
          <Tree
            root={{
              tone: "ask",
              label: "High CTR?",
              kids: [
                {
                  when: "no",
                  tone: "ask",
                  label: "High ROAS · ARPU?",
                  kids: [
                    {
                      when: "yes",
                      label: "Few but good",
                      sub: (
                        <>
                          good users, but few
                          <br />
                          fix hook and ASO
                        </>
                      ),
                    },
                    {
                      when: "no",
                      tone: "bad",
                      label: "Broken concept",
                      sub: (
                        <>
                          everything low
                          <br />
                          new concept, localize
                        </>
                      ),
                    },
                  ],
                },
                {
                  when: "yes",
                  tone: "ask",
                  label: "High IPM?",
                  kids: [
                    { when: "no", label: "Clicks, no installs", sub: "ad and store mismatch" },
                    {
                      when: "yes",
                      tone: "ask",
                      label: "High ROAS · ARPU?",
                      kids: [
                        {
                          when: "yes",
                          tone: "good",
                          label: "Wins every stage",
                          sub: (
                            <>
                              ideal
                              <br />
                              replicate and scale
                            </>
                          ),
                        },
                        { when: "no", label: "Many installs, no money", sub: "FTUE vs expectation" },
                      ],
                    },
                  ],
                },
              ],
            }}
          />
        </Figure>
      </Section>

      <Section title="Five situations">
        <div className="space-y-3">
          {CASES.map((c) => (
            <Card key={c.code} className="gap-0 py-4">
              <CardContent className="px-5">
                <div className="mb-2 flex items-center gap-2.5">
                  <Badge variant="secondary" className="text-[10px]">
                    {c.code}
                  </Badge>
                  <h3 className="text-sm font-semibold">{c.title}</h3>
                </div>
                <p className="text-sm">{c.reading}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.cause}</p>
                <ul className="mt-3 space-y-1">
                  {c.fix.map((f) => (
                    <li
                      key={f}
                      className="pl-4 text-sm text-muted-foreground before:-ml-4 before:inline-block before:w-4 before:text-muted-foreground/50 before:content-['→']"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 rounded-md bg-muted/40 px-3 py-2 text-sm text-foreground/80">
                  <span className="font-medium">Example (assumed figures): </span>
                  {c.example}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Can the diagnosis be trusted">
        <Figure caption="Three of the five metrics come from the ad network; the other two depend on in-app measurement">
          <Canvas
            className="mx-auto max-w-2xl"
            cols="minmax(0, 1fr) 4.6rem"
            wcols="minmax(0, 1fr) 9rem"
            gap={["1.5rem", "1rem"]}
            wgap={["2.5rem", "1rem"]}
            edges={[
              { from: "net", to: "DX", inAt: "align" },
              { from: "app", to: "DX", inAt: "align" },
              { from: "ARPU", to: "W", dashed: true, tone: "warn", inAt: "align", head: false },
              { from: "ROAS", to: "W", dashed: true, tone: "warn", outAt: 0.3, inAt: 0.8, head: false },
              { from: "ROAS", to: "W2", dashed: true, tone: "warn", outAt: 0.7, inAt: "align", head: false },
            ]}
          >
            <Group id="net" title="Ad network reports" col="1" row="1" cols="repeat(3, minmax(0, 1fr))">
              <Node>CTR</Node>
              <Node>IPM</Node>
              <Node>CPI</Node>
            </Group>
            <Group
              id="app"
              title="Rely on in-app measurement"
              col="1"
              row="2"
              cols="repeat(2, minmax(0, 1fr))"
            >
              <Node id="ARPU">ARPU</Node>
              <Node id="ROAS">ROAS</Node>
            </Group>
            <Node id="DX" tone="key" className="dg-tall" col="2" row="1 / 3">
              Diagnosis
            </Node>
            <Group bare className="mt-4 px-[0.7rem]" col="1" row="3" cols="repeat(2, minmax(0, 1fr))">
              <Node id="W" tone="warn" when="missing ad revenue">
                skewed low
              </Node>
              <Node id="W2" tone="warn" when="missing attribution">
                cannot split by creative
              </Node>
            </Group>
          </Canvas>
        </Figure>
        <Note tone="warn" title="Two reasons the diagnosis can point the wrong way">
          <p>
            <b>ARPU and ROAS skew low.</b> If the warehouse only has IAP
            revenue, then in an app that lives on ads, a campaign that actually
            belongs to the <b>&ldquo;wins every stage&rdquo;</b> group is easily read as <b>&ldquo;many installs, no money&rdquo;</b>, and you go fixing a creative that was already good.
          </p>
          <p>
            <b>Cannot split by creative.</b> This table assumes you compare
            creatives with each other. If in-app events do not carry the
            install source, you only have one average figure for all of them.
          </p>
          <p>
            Check those two conditions before using the table to make budget
            decisions, see{" "}
            <Link href="/ua/instrumentation" className="underline underline-offset-4">
              Measurement plan
            </Link>
            . Ad revenue on the MMP also differs from AdMob for entirely normal
            reasons, see{" "}
            <Link href="/deep/revenue-gap" className="underline underline-offset-4">
              Why AdMob revenue differs from the MMP
            </Link>
            ; and for eCPM falling by the hour, see{" "}
            <Link href="/deep/ecpm-day" className="underline underline-offset-4">
              Why eCPM falls during the day
            </Link>
            .
          </p>
        </Note>
      </Section>
    </>
  );
}
