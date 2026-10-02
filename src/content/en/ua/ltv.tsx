import { Figure, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Facts, Grid, Note, P } from "@/components/bits";
import { Assumed, UseCase } from "@/components/usecase";

export const metadata = { title: "LTV & cohorts" };

export default function Ltv() {
  return (
    <>
      <PageHeader
        eyebrow="UA · concepts"
        title="LTV and cohorts"
        lead="LTV tells you how much money a user ultimately brings in. But the number that sets the ceiling for CPI is LTV at the payback point, not lifetime LTV; using the latter by mistake means paying in advance for revenue that may never arrive."
      />

      <Section title="Two ways to calculate, chosen by maturity">
        <Figure caption="Before launch there is no ARPDAU to multiply — you have to borrow numbers from similar apps">
          <Tree
            root={{
              tone: "ask",
              label: "Has the app launched?",
              kids: [
                {
                  when: "no",
                  label: "Borrow historical data from similar apps",
                  sub: "estimate retention and revenue",
                  kids: [
                    {
                      tone: "warn",
                      label: "Caution: specifics may make behavior differ sharply",
                    },
                  ],
                },
                {
                  when: "yes",
                  tone: "ask",
                  label: "Is there enough data yet?",
                  kids: [
                    {
                      when: "new, still thin",
                      label: "Quick method",
                      sub: "LTV = ARPDAU × average lifetime in days",
                      kids: [
                        {
                          tone: "warn",
                          label: "Drawback: assumes all users alike",
                          sub: "ignores churn and variance",
                        },
                      ],
                    },
                    {
                      when: "enough",
                      label: "Cohort method",
                      sub: "cumulative revenue by install date",
                      kids: [
                        {
                          label: "Split cohorts D1 D7 D15 D30 D90",
                          kids: [
                            {
                              label: "Sum cumulative revenue per point",
                              kids: [
                                {
                                  label: "Cohort LTV = total revenue ÷ users",
                                  kids: [{ label: "Average LTV = pool several cohorts" }],
                                },
                              ],
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
              "Quick formula",
              <>
                <C>LTV = ARPDAU × average lifetime in days</C>
              </>,
            ],
            [
              "Cohort example",
              "100 people install on the same day and generate 500$ by D30 → LTV D30 = 5$/person",
            ],
            [
              "Before launch",
              "there is no DAU, so there is no ARPDAU. Use historical figures from apps in the same genre to estimate retention and revenue, and state clearly that they are assumptions.",
            ],
            [
              "Revenue sources must all be added",
              "IAP + ads + subscription. Missing one source makes LTV falsely low.",
            ],
            [
              "Costs to subtract",
              "development, operations, and the UA cost itself",
            ],
          ]}
        />
      </Section>

      <Section title="Data needed for cohorts">
        <Grid
          head={["Data point", "Usually comes from", "Note"]}
          rows={[
            ["install date", "attached by the analytics SDK to every event", "use the SDK value, do not recompute it"],
            ["days since install", "computed by the SDK from install date and event time", "the basis for D1, D7, D30"],
            ["session", "the SDK attaches session id and sequence number", "used to compute DAU"],
            ["IAP revenue", "purchase event with transaction id, or server", "subtract refunds"],
            ["IAA revenue", "paid event sent to the analytics warehouse", "if missing, LTV skews low"],
          ]}
        />
        <Note tone="warn" title="Hand-written counters are often wrong">
          <p>
            A hand-written &ldquo;active days&rdquo; field easily ends up
            counting the number of opens in a day instead. Use the SDK&apos;s
            days-since-install if it has one; see the Common mistakes page.
          </p>
        </Note>
      </Section>

      <Section title="Use cases">
        <UseCase
          n="1"
          title="Calculating LTV D7 and D30 from a cohort"
          situation={
            <p>
              1,000 people install on March 1. Cumulative revenue (IAP + ad) of
              exactly this group: D1 = 150 USD, D7 = 600 USD, D30 = 1,500 USD
              <Assumed />.
            </p>
          }
          flow={
            <Grid
              head={["Point", "Cumulative revenue", "LTV = ÷ 1,000"]}
              rows={[
                ["D1", "150", "0.15"],
                ["D7", "600", "0.60"],
                ["D30", "1,500", "1.50"],
              ]}
            />
          }
          why={
            <p>
              A D30/D7 ratio of 2.5 says the curve is still steep: half the
              value arrives after the first week. If only IAP is present
              (suppose 40% of the total), LTV D30 reads 0.60 instead of 1.50,
              and the CPI ceiling is set 2.5 times too low.
            </p>
          }
          lesson="LTV is the cumulative revenue of a group that installed on the same day divided by the size of the group, at a specific point. Always state the point and always add every source."
        />
        <UseCase
          n="2"
          title="A quick estimate while data is still thin"
          situation={
            <p>
              The app is two weeks old, with no D30 yet. ARPDAU is around 0.05
              USD, and the estimated average number of active days per person is
              20<Assumed />.
            </p>
          }
          why={
            <p>
              LTV ≈ 0.05 × 20 = 1.00 USD. Quick, but it assumes everyone is
              alike: the average number of active days is pulled by a small group
              that uses the app for a very long time. Use it for direction, and
              replace it with cohorts once there is enough data.
            </p>
          }
          lesson="The quick method gives you a number; the cohort method gives you a decision."
        />
      </Section>

      <Section title="Start simple, raise LTV through retention">
        <P>
          A complex LTV model built too early only slows the loop down; the
          quick estimate is enough for direction, and the cohort method is for
          when you need a decision. Because people who stay longer generate
          more revenue, improving retention is usually the cheapest way to
          raise LTV. When setting the CPI ceiling, use LTV at the chosen payback
          point, not lifetime LTV, because lifetime LTV is always larger and
          includes revenue that may never arrive. The exact ceiling calculation
          is on the CPI · ROAS page.
        </P>
      </Section>
    </>
  );
}
