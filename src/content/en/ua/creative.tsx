import { Figure, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Facts, Grid, P } from "@/components/bits";
import { Assumed, UseCase } from "@/components/usecase";

export const metadata = { title: "Ad creative" };

export default function Creative() {
  return (
    <>
      <PageHeader
        eyebrow="UA · concepts"
        title="Ad creative: making and measuring"
        lead="The creative determines CTR and IPM, and therefore CPI. The hard part is not shooting the video but knowing which video brings in users who are actually valuable."
      />

      <Section title="Groundwork before production">
        <Figure caption="Four questions to answer before you start shooting">
          <Tree
            feedsAsGroup
            feeds={[
              { label: "Who is the audience?", sub: "demographics, mindset, behavior" },
              { label: "What sets the app apart?" },
              { label: "What is the campaign's goal?", sub: "burst · remarketing · user testing" },
              { label: "When does the fun start?", sub: "actual FTUE" },
            ]}
            root={{
              tone: "key",
              label: "User Persona",
              sub: "a specific, named person",
              kids: [{ label: "Decides tone, platforms, content" }],
            }}
          />
        </Figure>
        <Facts
          rows={[
            [
              "Why you need a persona",
              <>
                A segment like &ldquo;aged 25–35&rdquo; is too vague to write a
                script for. Only a &ldquo;Roberto, 28, plays casual games on the
                metro&rdquo; can answer: what tone to use, where to put the hook,
                how long the ad should be.
              </>,
            ],
            [
              "Match the platform",
              "choose networks by where the persona actually is, not Facebook and Google by default",
            ],
            [
              "The goal changes how creatives are made",
              "burst shows off the most impressive feature · remarketing shows off what has improved · user testing shows off exactly the feature under test",
            ],
          ]}
        />
      </Section>

      <Section title="One ad, one feature, because that is the only way to measure">
        <P>
          The first few seconds decide whether the viewer stays, so the video
          opens with the most impressive thing and gets to the key message
          early; anything that does not serve the key message gets cut. The CTA
          states the action directly and can be tried at the start, middle or
          end. Short videos hold viewers better, while the maximum length and
          the point where skipping is allowed differ from one ad network to
          another, so check each network&apos;s current rules. Music is as
          worth A/B testing as visuals.
        </P>
        <P>
          The most important rule for measurement is that each ad shows off
          only one feature. The creative name attached to events then becomes a
          meaningful label: you know how people who came from the &ldquo;feature
          A&rdquo; creative behave differently from people who came from
          &ldquo;feature B&rdquo;. Cramming everything into one video both
          dilutes the message and throws that ability away.
        </P>
      </Section>

      <Section title="Connecting creatives to in-app behavior">
        <Figure caption="The first link is attribution flowing back to the app; without it every branch after it only has averages">
          <Tree
            root={{
              label: "Creative X on an ad network",
              kids: [
                {
                  label: "Install",
                  kids: [
                    {
                      label: "MMP assigns attribution",
                      kids: [
                        {
                          when: "callback to app",
                          tone: "key",
                          label: "creative attribute = X",
                          sub: "on every event",
                          kids: [
                            { label: "onboarding", sub: "finished or not" },
                            { label: "paywall", sub: "viewed, bought or not" },
                            { label: "ad_paid", sub: "how many ads seen" },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            }}
            join={{ tone: "good", label: "True profile of users from creative X" }}
          />
        </Figure>
        <Grid
          head={["Question about creatives", "Needs"]}
          rows={[
            ["Which creative brings in IAP buyers", "attribution on events + purchase_success"],
            ["Which creative brings in people who quit on the first screen", "attribution + screen_show / screen_exit"],
            ["Which creative promises something the FTUE does not deliver", "attribution + onboarding funnel"],
            ["Which creative brings in people who watch many ads", "attribution + ad_show"],
            ["Which creative yields high ad revenue", "attribution + ad_paid in the same warehouse"],
            ["Onboarding and paywall funnels in aggregate", "behavior events only"],
          ]}
        />
      </Section>

      <Section title="Use cases">
        <UseCase
          n="1"
          title="The cheapest creative is not necessarily the best"
          situation={
            <p>
              An English-speaking practice app runs two videos. Video A (comedy,
              mini-game) has a CPI of 0.40 USD; video B (before/after practice) a
              CPI of 0.70 USD. After 7 days, LTV D7 of people from A is 0.15 USD,
              of people from B 0.60 USD
              <Assumed />.
            </p>
          }
          flow={
            <Grid
              head={["Creative", "CPI", "LTV D7", "ROAS D7"]}
              rows={[
                ["A · comedy", "0.40", "0.15", "≈ 38%"],
                ["B · before/after", "0.70", "0.60", "≈ 86%"],
              ]}
            />
          }
          why={
            <p>
              Going by CPI, you would pour money into A. A promises a game, the
              real app is lessons — users come and go. B costs more but promises
              exactly what the app does. You can only see this when attribution
              is on in-app events.
            </p>
          }
          lesson="Judge creatives by ROAS and post-install behavior, not by CPI alone."
        />
      </Section>
    </>
  );
}
