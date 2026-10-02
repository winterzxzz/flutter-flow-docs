import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, Note } from "@/components/bits";

export const metadata = { title: "Glossary" };

export default function Glossary() {
  return (
    <>
      <PageHeader
        eyebrow="UA · reference"
        title="Glossary"
        lead="Abbreviations and terms used across the site, with formulas where they exist. A reference page is best kept as tables; keep it open alongside while reading the UA and Deep dives sections."
      />

      <Section title="Revenue per head">
        <Grid
          head={["Abbreviation", "Full form", "Meaning and formula"]}
          rows={[
            [
              "ARPU",
              "Average Revenue Per User",
              <>
                Average revenue per user ={" "}
                <C>total revenue ÷ total users</C>
              </>,
            ],
            [
              "ARPPU",
              "Average Revenue Per Paying User",
              <>
                Counts only people who have paid ={" "}
                <C>total revenue ÷ number of paying users</C>. Never lower than
                ARPU when both are computed on the same type of revenue (for
                example IAP only).
              </>,
            ],
            [
              "ARPDAU",
              "Average Revenue Per Daily Active User",
              <>
                Revenue for the day ÷ DAU of that day. The input to the quick LTV
                formula.
              </>,
            ],
            [
              "LTV",
              "Life-Time Value",
              <>
                <b>LTV Dn</b>: cumulative revenue per person of a cohort up to
                day n. <b>Lifetime LTV</b>: a forecast for the whole lifetime.
                Quick estimate: <C>ARPDAU × average number of active days</C>.
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="Ad cost and performance">
        <Grid
          head={["Abbreviation", "Full form", "Meaning and formula"]}
          rows={[
            [
              "CPI",
              "Cost Per Install",
              "Cost of each install. Varies by platform, country, genre and season.",
            ],
            [
              "ROAS",
              "Return on Ad Spend",
              <>
                <C>revenue ÷ ad spend</C>. Break-even at <C>1</C> (100%).
              </>,
            ],
            [
              "CTR",
              "Click-Through Rate",
              "Clicks as a share of impressions. Measures how much attention the ad draws.",
            ],
            [
              "IPM",
              "Installs Per Mille",
              "Installs per 1000 impressions. Measures how well impressions turn into installs.",
            ],
            [
              "eCPM",
              "effective Cost Per Mille",
              "Estimated revenue per 1000 ad impressions. Used to rank placements.",
            ],
          ]}
        />
      </Section>

      <Section title="Users and lifecycle">
        <Grid
          head={["Abbreviation", "Full form", "Meaning"]}
          rows={[
            ["DAU", "Daily Active Users", "Number of people active in a day."],
            [
              "FTUE",
              "First Time User Experience",
              "The first experience after install. Whatever the ad promises, the FTUE has to deliver, or users churn early.",
            ],
            [
              "Cohort",
              "—",
              "A group of users who installed on the same day, tracked together over time.",
            ],
            [
              "Retention D1/D7/D30",
              "—",
              "Share of people still coming back 1, 7, 30 days after the install date.",
            ],
            [
              "Payback Period",
              "Payback period",
              "The time expected to recover the acquisition cost. Usually 30–90 days or 180–365 days.",
            ],
            [
              "Organic",
              "—",
              "Installs that cannot be attributed to any paid source; keep them separate, do not treat them as a campaign.",
            ],
            [
              "Country Tiers",
              "Country tiers",
              "Tier 1 high ARPU and CPI (US, Canada, UK) · Tier 2 medium (Mexico, Poland, Thailand) · Tier 3 low (Vietnam, Iraq, Moldova).",
            ],
          ]}
        />
      </Section>

      <Section title="Monetization">
        <Grid
          head={["Abbreviation", "Full form", "Meaning"]}
          rows={[
            [
              "UA",
              "User Acquisition",
              "Acquiring new users, usually through paid ads.",
            ],
            [
              "IAP",
              "In-App Purchase",
              "Purchases inside the app: consumables, permanent unlocks, subscriptions.",
            ],
            [
              "IAA",
              "In-App Advertising",
              "Earning money by showing ads: banner, interstitial, rewarded, app open, native.",
            ],
            [
              "ASO",
              "App Store Optimization",
              "Optimizing the store page: title, description, screenshots, video.",
            ],
          ]}
        />
        <Note tone="info" title="Two easily confused terms">
          <p>
            <b>ARPU and LTV.</b> ARPU is the average revenue over a period of
            time; LTV Dn is the cumulative amount up to day n. Set the CPI
            ceiling by LTV at the payback point, not by lifetime LTV.
          </p>
          <p>
            <b>A low CPI is not always good.</b> In the &ldquo;wins every
            stage&rdquo; combination it means efficient acquisition; in
            &ldquo;broken concept&rdquo; it means almost nobody wants to click.
            It has to be read together with the other metrics.
          </p>
        </Note>
      </Section>

      <Section title="Measurement and platforms">
        <Grid
          head={["Abbreviation", "Full form", "Meaning"]}
          rows={[
            ["MMP", "Mobile Measurement Partner", "The party that attributes installs to sources and receives revenue to compute ROAS, such as Adjust, AppsFlyer."],
            ["Tracker link", "—", "The MMP link attached to an ad; use a test link to check attribution end to end."],
            ["Paid event · ILRD", "Impression-Level Revenue Data", "The per-impression revenue event the Ad SDK emits: value, currency, precision."],
            ["Fill · no-fill", "—", "Whether or not a request received an ad from the source."],
            ["Match rate", "—", <><C>matched ÷ request</C>. A diagnostic metric, not a target.</>],
            ["Show rate", "—", <><C>impression ÷ matched</C>. Low means ads were requested but not used.</>],
            ["Spacing", "—", "The minimum gap between two full-screen ad shows, managed by the app itself. Not the same as frequency capping in the AdMob console."],
            ["SSV", "Server-Side Verification", "The server receives confirmation of the rewarded reward directly from AdMob."],
            ["UMP", "User Messaging Platform", "Google's consent SDK for GDPR and the IDFA message."],
            ["ATT · IDFA", "App Tracking Transparency · Identifier for Advertisers", "The iOS prompt that asks for permission to access the IDFA for tracking."],
            ["Entitlement", "—", "The access right that the store or server confirms. Premium is just a plan name."],
            ["RTDN", "Real-time Developer Notifications", "Subscription status notifications from Google Play to the server."],
          ]}
        />
      </Section>
    </>
  );
}
