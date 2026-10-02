import { Canvas, Figure, Group, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, Note, P } from "@/components/bits";
import { Assumed, UseCase } from "@/components/usecase";

export const metadata = { title: "UA metrics map" };

export default function Ua() {
  return (
    <>
      <PageHeader
        eyebrow="UA"
        title="Metrics map"
        lead="A wrong UA metric is rarely caused by the formula; usually a data source has not been connected, and the number still comes out, just skewed to one side. Each metric needs data from a specific place, so knowing that place in advance means knowing in advance which metrics the app will be able to measure and which it will be blind to."
      />

      <Section title="Three data sources, three different pictures">
        <Figure caption="No single source is enough to compute ROAS per campaign; the two dashed lines are where things are often missing">
          <Canvas
            cols="minmax(0, 1fr) 4.2rem"
            wcols="minmax(0, 1fr) 1rem minmax(0, 1fr) 10rem minmax(0, 1fr)"
            gap={["1.5rem", "3.7rem"]}
            wgap={["0px", "2.4rem"]}
            edges={[
              { from: "SPEND", to: "ROAS", inAt: "align" },
              { from: "ADREV", to: "ROAS", inAt: "align" },
              { from: "IAPREV", to: "ROAS", inAt: "align" },
              {
                from: "ATTR",
                to: "DB",
                label: "needs app callback",
                dashed: true,
                tone: "warn",
                inAt: "align",
                narrow: { t: 0.28 },
              },
              {
                from: "ADREV",
                to: "DB",
                label: "also send to warehouse",
                dashed: true,
                tone: "warn",
                inAt: "align",
                narrow: { t: 0.72, lw: 10.5 },
              },
            ]}
          >
            <Group title="Ad network · where installs are bought" col="1" row="1" wcol="1" wrow="1">
              <Node>CTR, IPM</Node>
              <Node id="SPEND">Cost, CPI</Node>
            </Group>
            <Group
              title="MMP · attribution"
              col="1"
              row="2"
              wcol="3"
              wrow="1"
              cols="repeat(2, minmax(0, 1fr))"
              wcols="minmax(0, 1fr)"
            >
              <Node id="ATTR">
                installs by network/
                <wbr />
                campaign/
                <wbr />
                creative
              </Node>
              <Node id="ADREV">ad revenue from paid event</Node>
            </Group>
            <Group id="DB" title="Analytics warehouse · behavior" col="1" row="3" wcol="5" wrow="1">
              <Node>screen, paywall, ad events</Node>
              <Node sub="set by analytics SDK">install date, days-since-install, session</Node>
              <Node id="IAPREV">purchase_success</Node>
            </Group>
            <Node id="ROAS" tone="key" className="dg-tall dg-mid" col="2" row="1 / 4" wcol="1 / -1" wrow="2">
              ROAS
            </Node>
          </Canvas>
        </Figure>
        <Note tone="warn" title="Two lines that often break">
          <p>
            <b>Ad revenue</b> is sent only to the MMP and never reaches the
            analytics warehouse: ARPU and LTV in the warehouse contain only the
            IAP part.
          </p>
          <p>
            <b>Attribution</b> does not flow back to the app: the MMP knows the
            source but in-app events do not carry it, so behavior cannot be split
            by campaign. See the lesson on the Common mistakes page.
          </p>
        </Note>
      </Section>

      <Section title="What each metric needs">
        <Grid
          head={["Metric", "Formula", "Data needed", "Source"]}
          rows={[
            [
              "ARPU (IAP)",
              "IAP revenue ÷ number of users",
              <>
                <C>purchase_success</C> + user id
              </>,
              "analytics warehouse or server",
            ],
            [
              "Retention D1/D7/D30",
              "users still active on day N ÷ users installed",
              "install date + active dates",
              "usually built into the analytics SDK",
            ],
            [
              "LTV cohort",
              "cumulative revenue per install-date group",
              "install date + every revenue source",
              "analytics warehouse",
            ],
            [
              "ARPU (IAA)",
              "ad revenue ÷ number of users",
              <>
                <C>ad_paid</C> per user
              </>,
              "analytics warehouse (if sent there) or MMP",
            ],
            ["ARPDAU", "daily revenue ÷ DAU", "session + both revenue sources", "analytics warehouse"],
            [
              "ROAS per creative",
              "revenue per creative ÷ cost",
              "attribution on events + cost",
              "MMP + analytics warehouse",
            ],
            ["eCPM", "revenue ÷ 1000 impressions", "ad_show, ad_paid per placement", "analytics warehouse or AdMob"],
            ["CPI", "cost ÷ installs", "spend, installs", "ad network / MMP"],
            ["CTR", "clicks ÷ impressions", "campaign data", "ad network"],
            ["IPM", "installs ÷ 1000 impressions", "campaign data", "ad network"],
          ]}
        />
      </Section>

      <Section title="Do not rewrite the cohort logic the SDK already has">
        <P>
          Many analytics SDKs attach the install date, days since install and
          session id on their own, and fire <C>first_open</C>, <C>session_start</C>
          themselves. Check your SDK before writing your own
          counters; those keys are usually reserved keys the app cannot
          overwrite, as covered on the Tracking page.
        </P>
      </Section>

      <Section title="Use cases">
        <UseCase
          n="1"
          title="Reading ROAS with half the revenue missing"
          situation={
            <p>
              A hybrid IAA + IAP app. Campaign A spends 1,000 USD and brings in
              2,000 installs. After 7 days, IAP has earned 400 USD and ads 500 USD
              <Assumed />.
            </p>
          }
          flow={
            <Figure>
              <Canvas
                className="mx-auto max-w-lg"
                cols="repeat(2, minmax(0, 1fr))"
                gap={["0.9rem", "1.5rem"]}
                edges={[
                  { from: "in1", to: "R1" },
                  { from: "R1", to: "X" },
                  { from: "in2", to: "R2" },
                  { from: "R2", to: "Y" },
                ]}
              >
                <Node id="in1" tone="plain" col="1" row="1">
                  <span className="dg-chips">
                    <span className="dg-chip">spend 1000</span>
                    <span className="dg-chip">IAP 400</span>
                  </span>
                </Node>
                <Node id="in2" tone="plain" col="2" row="1">
                  <span className="dg-chips">
                    <span className="dg-chip">spend 1000</span>
                    <span className="dg-chip">IAP 400</span>
                    <span className="dg-chip">Ad 500</span>
                  </span>
                </Node>
                <Node id="R1" col="1" row="2" sub="IAP only">
                  ROAS D7
                </Node>
                <Node id="R2" col="2" row="2" sub="both sources">
                  ROAS D7
                </Node>
                <Node id="X" tone="bad" col="1" row="3">
                  40% · seems a heavy loss
                </Node>
                <Node id="Y" tone="good" col="2" row="3">
                  90% · near break-even
                </Node>
              </Canvas>
            </Figure>
          }
          why={
            <p>
              With ad revenue missing from the warehouse, the team reads ROAS D7
              = 40% and switches the campaign off. With complete data, ROAS D7 =
              90% and may already have passed 100% by D14. The wrong decision came
              from missing data, not from the campaign.
            </p>
          }
          lesson="Before reading a metric, ask: which data is missing, and which way does it pull the number."
        />
      </Section>

      <Section title="What order to read next">
        <Grid
          head={["Page", "Answers the question"]}
          rows={[
            ["LTV & cohorts", "how much a user is worth, and how to measure it"],
            ["CPI · ROAS", "how much you can afford to pay for an install"],
            ["Launch stages", "when to scale up, and where to open first"],
            ["Ad creative", "how to make ads and how to measure them"],
            ["Diagnosing metrics", "bad numbers: fix the creative or fix the store"],
            ["Measurement plan", "what order to build measurement in"],
          ]}
        />
      </Section>
    </>
  );
}
