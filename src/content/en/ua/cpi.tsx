import { Canvas, Figure, Group, Node, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Facts, Grid, Note, P } from "@/components/bits";
import { Assumed, UseCase } from "@/components/usecase";

export const metadata = { title: "CPI · ROAS" };

export default function Cpi() {
  return (
    <>
      <PageHeader
        eyebrow="UA · concepts"
        title="CPI, ARPU and ROAS"
        lead="A cheap install is only worth buying when that person pays back more than was spent, within a payback period you can tolerate. ROAS packs that question into a ratio, and its threshold is derived from the app's own revenue curve."
      />

      <Section title="How the three metrics relate">
        <Figure caption="ROAS = revenue ÷ cost. Break-even is at 1, that is 100%">
          <Tree
            feeds={[
              { label: "ARPU", sub: "revenue / user" },
              { label: "CPI", sub: "cost / install" },
            ]}
            root={{
              tone: "key",
              label: "ROAS",
              kids: [
                { when: "> 1 · above 100%", tone: "good", label: "profitable · scale" },
                { when: "= 1 · break-even", label: "optimize creative, targeting" },
                { when: "< 1 · below 100%", tone: "bad", label: "loss · stop or fix" },
              ],
            }}
          />
        </Figure>
        <Note tone="info" title="High-CPI markets usually have high ARPU">
          <p>
            This is why a low CPI is not automatically good. Tier 3 gives a
            cheap CPI but ARPU is low too; Tier 1 is expensive but users are
            worth more. Compare in pairs, not CPI alone.
          </p>
        </Note>
      </Section>

      <Section title="The payback period sets the acceptable threshold">
        <Figure caption="CPI above ARPU in the early stage is normal; what matters is where it stands at the payback point">
          <Tree
            root={{
              tone: "ask",
              label: "Pick payback period",
              kids: [
                {
                  when: "30-90 days",
                  label: "Fast recovery",
                  sub: (
                    <>
                      low long-term loss tolerance
                      <br />
                      for short-lived apps
                    </>
                  ),
                },
                {
                  when: "180-365 days",
                  label: "Slow recovery",
                  sub: (
                    <>
                      for high-LTV users
                      <br />
                      needs solid funding
                    </>
                  ),
                },
              ],
            }}
            join={{
              tone: "key",
              label: (
                <>
                  Common condition:
                  <br />
                  CPI &lt; ARPU at payback point
                </>
              ),
            }}
          />
        </Figure>
        <P>
          The maximum CPI is LTV at the payback point: cumulative revenue per
          person up to the exact day you want to recover the cost. ARPU is the
          average revenue over a period of time, while lifetime LTV is a
          forecast for the whole lifetime; using lifetime LTV as the ceiling
          gives a much higher number and makes you pay in advance for revenue
          that has not arrived. A common mistake is to compare today&apos;s CPI
          with today&apos;s revenue per head, when it has to be compared with
          LTV up to the end of the payback period.
        </P>
      </Section>

      <Section title="When to prioritize CPI, when to prioritize ROAS">
        <Grid
          head={["Situation", "Priority", "Why"]}
          rows={[
            ["Technical launch", "low CPI", "you need a lot of data at the lowest cost"],
            [
              "Volume needed to boost organic",
              "low CPI",
              "many installs bring rankings, ratings, word of mouth",
            ],
            ["Building awareness", "low CPI", "reach matters more than short-term profit"],
            [
              "Profitable growth stage",
              "high ROAS",
              "scaling a low-ROAS campaign only burns resources",
            ],
          ]}
        />
      </Section>

      <Section title="What CPI varies with">
        <Facts
          rows={[
            ["Platform", "iOS is usually higher than Android, usually along with higher ARPU"],
            [
              "Geography",
              "by market tier: Tier 1 high, Tier 3 low (examples of each tier on the Glossary page)",
            ],
            ["Genre", "casual is cheaper than strategy or role-playing"],
            ["Format", "video costs more than banner but engages better"],
            ["Timing", "varies with season, holidays, competition"],
          ]}
        />
      </Section>

      <Section title="Data for ROAS per campaign">
        <Figure caption="The cost side always lives outside the app; the revenue and source side is where the app decides">
          <Canvas
            cols="minmax(0, 1fr) 5.4rem"
            wcols="minmax(0, 2fr) minmax(0, 5fr)"
            gap={["1.5rem", "1rem"]}
            wgap={["1rem", "2.4rem"]}
            edges={[
              { from: "C3", to: "ROAS", inAt: 0.14, narrow: { inAt: "align" } },
              { from: "D1", to: "ROAS", inAt: 0.38, narrow: { inAt: "align" } },
              { from: "D2", to: "ROAS", inAt: 0.62, narrow: { inAt: "align" } },
              { from: "D3", to: "ROAS", inAt: 0.86, narrow: { inAt: "align" } },
            ]}
          >
            <Group title="Outside the app — ad network" col="1" row="1" wcol="1" wrow="1">
              <Node>spend</Node>
              <Node>installs</Node>
              <Node id="C3">CPI = spend ÷ installs</Node>
            </Group>
            <Group
              title="In the app"
              col="1"
              row="2"
              wcol="2"
              wrow="1"
              wcols="repeat(3, minmax(0, 1fr))"
            >
              <Node id="D1">IAP revenue</Node>
              <Node id="D2" sub="network · campaign · creative">
                install source on events
              </Node>
              <Node id="D3" sub="paid event">
                ad revenue
              </Node>
            </Group>
            <Node id="ROAS" tone="key" className="dg-tall dg-mid" col="2" row="1 / 3" wcol="1 / -1" wrow="2">
              ROAS per campaign
            </Node>
          </Canvas>
        </Figure>
        <Note tone="warn" title="One missing piece points the wrong way">
          <p>
            Without the source on events you only get total ROAS and cannot
            split by campaign. Without ad revenue, ROAS skews low — for an app
            that lives on ads, enough to switch off a profitable campaign by
            mistake.
          </p>
        </Note>
      </Section>

      <Section title="Use cases">
        <UseCase
          n="1"
          title="What CPI breaks even"
          situation={
            <p>
              The app chooses a 90-day payback period. From earlier cohorts, LTV
              D90 is 1.20 USD<Assumed />.
            </p>
          }
          why={
            <p>
              The maximum CPI to break even at D90 is 1.20 USD. To make 20% profit
              at that point, CPI ≤ 1.20 ÷ 1.2 = 1.00 USD. Using lifetime LTV
              (suppose 2.00 USD) as the ceiling means paying in advance for revenue
              after day 90, which may never arrive.
            </p>
          }
          lesson="CPI ceiling = LTV at the payback point ÷ (1 + target margin). Check question: up to which day is the LTV you are using as the ceiling?"
        />
        <UseCase
          n="2"
          title="What ROAS D7 is acceptable"
          situation={
            <p>
              A new campaign has ROAS D7 = 45%. The app&apos;s earlier cohorts show
              D90 revenue at 2.5 times D7<Assumed />.
            </p>
          }
          flow={
            <Grid
              head={["Point", "Expected ROAS", "Calculation"]}
              rows={[
                ["D7", "45%", "measured"],
                ["D90", "≈ 112%", "45% × 2.5"],
              ]}
            />
          }
          why={
            <p>
              There is no &ldquo;industry standard&rdquo; ROAS D7 that applies
              across apps. Your threshold is 100% divided by the app&apos;s own
              D90/D7 multiplier: here 100 ÷ 2.5 = 40%. The 45% campaign clears the
              threshold; the 30% campaign does not, even though it looks
              &ldquo;not bad&rdquo;.
            </p>
          }
          lesson="The early ROAS threshold is derived from the app's own revenue curve and the chosen payback period, not borrowed from another app."
        />
      </Section>

      <Section title="Stopping a campaign is not stopping the project">
        <P>
          Stop a campaign when, after two or three rounds of new creatives, ROAS
          D7 is still below the app&apos;s threshold, that is 100% divided by the
          D90/D7 multiplier as in use case 2. Stopping the whole project is a
          different decision: it is for when no creative, in any market, gets
          LTV at the payback point above CPI. Before reaching that conclusion,
          check again that the revenue data includes both IAP and ads, because
          missing half the revenue is the fastest way to kill a profitable app
          by mistake.
        </P>
      </Section>
    </>
  );
}
