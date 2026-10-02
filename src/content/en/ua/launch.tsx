import { Figure, Rail, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Facts, Grid } from "@/components/bits";
import { Assumed, UseCase } from "@/components/usecase";

export const metadata = { title: "Launch stages" };

export default function Launch() {
  return (
    <>
      <PageHeader
        eyebrow="UA · concepts"
        title="Technical → Soft → Global"
        lead="Each stage has a different goal, market and exit criteria. Jumping ahead to Tier 1 before soft launch is done is the fastest way to burn the budget."
      />

      <Section title="Three stages">
        <Figure caption="Move to the next step only once the exit criteria are met">
          <Rail
            rows={[
              { label: "Technical Launch", sub: "Tier 3 · cheap CPI" },
              {
                tone: "ask",
                label: (
                  <>
                    Crash-free
                    <br />
                    engagement OK?
                  </>
                ),
                exit: { label: "no", to: "↺ Technical Launch" },
                down: "yes",
              },
              { label: "Soft Launch", sub: "near-target market · mid CPI" },
              {
                tone: "ask",
                label: (
                  <>
                    Monetization and
                    <br />
                    retention on target?
                  </>
                ),
                exit: { label: "no", to: "↺ Soft Launch" },
                down: "yes",
              },
              { tone: "good", label: "Global Launch", sub: "Tier 1 · high CPI" },
            ]}
          />
        </Figure>
        <Grid
          head={["Stage", "Market", "Goal", "What to measure"]}
          rows={[
            [
              "Technical",
              "Tier 3 — low CPI",
              "collect data, fix bugs, test mechanics",
              "crashes, loading, onboarding funnel",
            ],
            [
              "Soft",
              "markets whose behavior is close to the target market, moderate CPI",
              "test monetization, IAP prices, ad placement, retention",
              "ARPU, retention, ad frequency",
            ],
            [
              "Global",
              "Tier 1 — high ARPU",
              "scale with tuned creatives and targeting",
              "ROAS, payback",
            ],
          ]}
        />
      </Section>

      <Section title="Remote Config is the soft launch tool">
        <Figure caption="Without a condition it is only a before/after comparison over time — not an A/B test">
          <Tree
            root={{
              label: "Hypothesis: too many ads drop retention",
              kids: [
                {
                  tone: "ask",
                  label: "split into parallel groups?",
                  kids: [
                    {
                      when: "yes · condition / A/B",
                      label: (
                        <>
                          group A: spacing 30s
                          <br />
                          group B: spacing 60s
                        </>
                      ),
                      kids: [
                        { tone: "good", label: "compare retention, ad revenue", sub: "same period" },
                      ],
                    },
                    {
                      when: "no",
                      label: "change value for everyone",
                      kids: [
                        {
                          label: "compare before vs after cohorts",
                          kids: [
                            {
                              tone: "warn",
                              label: "noise: season, version, traffic source changes",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            }}
          />
        </Figure>
        <Facts
          rows={[
            [
              "Common levers",
              "on/off per format · full-screen ad spacing · ad unit list · native refresh · plans on the paywall",
            ],
            [
              "Latency must be built into the test design",
              "new values reach users according to how the app loads config: immediately, after the loading screen, or from the next launch",
            ],
            [
              "Measure both sides",
              "change ad density with only retention events and you see what is lost, not what is gained",
            ],
          ]}
        />
      </Section>

      <Section title="What data exit criteria should rest on">
        <Grid
          head={["Question", "Measured with"]}
          rows={[
            ["Does onboarding lose many users", "screen_show / screen_exit along the first screens"],
            ["Is loading slow enough to cause drop-off", "loading_start / loading_finish with error code"],
            ["Does the paywall convert", "paywall_show → paywall_click → purchase_success"],
            ["Do ads drive users away", "ad_show per session, checked against retention"],
            ["Ad revenue per head", "ad_paid in the same warehouse as behavior events"],
            ["Retention by cohort", "install date and days-since-install attached by the SDK"],
            ["Comparing markets or campaigns", "attribution on events"],
          ]}
        />
      </Section>

      <Section title="Use cases">
        <UseCase
          n="1"
          title="Soft launch hits monetization but misses retention D7"
          situation={
            <p>
              The app runs a soft launch in the Philippines and Mexico, 5,000
              installs in each country. Targets set in advance: retention D1 ≥
              35%, D7 ≥ 12%, LTV D7 ≥ 0.10 USD. Results: D1 38%, D7 9%, LTV D7
              0.12 USD
              <Assumed />.
            </p>
          }
          why={
            <p>
              Monetization is on target but D7 falls short: users like the first
              day and then leave. Opening Tier 1 now means paying a high CPI for
              users who do not stay. The next step is to look at the D2–D7 screen
              funnel and try thinning out ad density with a control group, not to
              raise the budget.
            </p>
          }
          lesson="Set exit criteria as numbers before you run; whichever metric falls short points to the work to do."
        />
      </Section>
    </>
  );
}
