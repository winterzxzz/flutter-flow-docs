import { Figure, Share } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, Note, P, Ref } from "@/components/bits";
import { Assumed } from "@/components/usecase";

export const metadata = { title: "Deep dive · eCPM during the day" };

export default function DeepEcpmDay() {
  return (
    <>
      <PageHeader
        eyebrow="Deep dive · Q&A"
        title="Why does eCPM fall during the day?"
        lead="Many teams see a high eCPM in the morning and a low one in the evening, and immediately guess that advertisers have run out of budget. That may be true, but the official documentation does not say so; before believing a story about the market, you should rule out the case where the average is changing because the set of impressions itself has changed."
      />

      <Note tone="warn" title="Scope of verification">
        <p>
          The AdMob pages checked explain that eCPM fluctuates with the market,
          seasonality, block lists and floors, but none of them describes a
          pattern of eCPM falling within a day or its cause. The
          &ldquo;hypothesis&rdquo; part below is therefore unverified.
        </p>
      </Note>

      <Section title="What Google says about eCPM fluctuation">
        <P>
          eCPM is the estimated revenue per thousand impressions. Google lists
          the factors that make it fluctuate: market trends by country and
          platform, blocking many categories, and floor changes. They advise
          looking at eCPM over several time frames to spot seasonal factors. One
          point is worth remembering: a lower eCPM that comes with more
          impressions can still raise total estimated revenue, so you have to
          look at eCPM together with impressions and revenue, not on its own.
        </P>
        <Ref href="https://support.google.com/admob/answer/15337570?hl=en">
          AdMob Help · Understand eCPM fluctuation
        </Ref>
      </Section>

      <Section title="Rule out first: the impression mix changes by the hour">
        <P>
          Hourly eCPM is an average, and an average changes when the shares of
          the groups inside it change, even if the price of each group stays
          put. Mornings in a global app may lean toward users in high-priced
          markets; evenings lean toward other markets. Banners run continuously
          all day, while interstitials cluster in the hours when users play the
          most. Each format and each market has its own price level, so the
          shares between them changing by the hour is on its own enough to pull
          the average down.
        </P>
        <Figure caption="The price of each group does not change, only the shares do, yet the average eCPM still falls">
          <Share
            legend={["market A", "market B"]}
            rows={[
              {
                label: "Morning",
                parts: [
                  { pct: 60, text: "60% market A" },
                  { pct: 40, text: "40% B" },
                ],
                result: "high avg eCPM",
              },
              {
                label: "Evening",
                parts: [
                  { pct: 30, text: "30% A" },
                  { pct: 70, text: "70% B" },
                ],
                result: "low avg eCPM",
              },
            ]}
          />
        </Figure>
      </Section>

      <Section title="A worked example: eCPM falls while prices stay the same">
        <P>
          Market A pays an eCPM of 10 USD, market B pays 2 USD, unchanged all
          day<Assumed />.
        </P>
        <Grid
          head={["Time of day", "Impression A", "Impression B", "Average eCPM"]}
          rows={[
            ["Morning", "6,000", "4,000", "(60 + 8) ÷ 10 = 6.8 USD"],
            ["Evening", "3,000", "7,000", "(30 + 14) ÷ 10 = 4.4 USD"],
          ]}
        />
        <P>
          Average eCPM falls 35% without any advertiser changing its price. If
          you split by country, format and placement and the eCPM of each group
          still holds steady, there is nothing to fix; only when
          eCPM <i>within the same group</i> falls by the hour is it worth
          looking for a cause on the market side.
        </P>
      </Section>

      <Section title="Market-side hypotheses (unverified)">
        <P>
          Once the groups are split, three explanations are commonly mentioned.
          Advertisers set daily budgets, so as the budgets of the high payers
          run down, the remaining auctions have fewer high bids. Advertisers set
          a frequency cap per user, so a user who has seen enough of their ads
          no longer receives their bids. And the auction cycles or intraday
          budget pacing differ between ad buying platforms. All three sound
          reasonable, but here they are only hypotheses to test against the
          data of the app itself.
        </P>
        <P>
          The check question: after splitting by country, format and placement,
          does the eCPM of each group still fall by the hour? If not, the story
          is the impression mix, and the right decision is to look at revenue
          per user rather than change the hours when ads are shown.
        </P>
      </Section>
    </>
  );
}
