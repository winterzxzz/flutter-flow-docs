import { Canvas, Figure, Group, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, P, Ref } from "@/components/bits";
import { Assumed } from "@/components/usecase";

export const metadata = { title: "Deep dive · Match rate" };

export default function DeepMatchRate() {
  return (
    <>
      <PageHeader
        eyebrow="Deep dive · Q&A"
        title="Why is match rate low, and when is low correct?"
        lead="Match rate is the percentage of requests that receive an ad. The number easily worries people, but it is a diagnostic metric, not a goal: there are ways to raise match rate without changing revenue, and there are configurations where a low match rate is the design."
      />

      <Section title="The denominator is a variable too">
        <P>
          Match rate equals matched divided by requests. Everyone looks at the
          numerator, but most of the times match rate &ldquo;dropped&rdquo; in
          the reference project came from a swollen denominator. A retry loop
          that fires three times in a row without waiting turns one no-fill into
          three failed requests; a screen that preloads native ads for five
          slots when the user only scrolls to two of them also adds three
          requests that are almost certainly discarded.
        </P>
        <Figure caption="Three groups of causes. The app-side group can usually be fixed right away; the other two need understanding more than fixing">
          <Canvas
            cols="1.6rem minmax(0, 1fr)"
            wcols="repeat(3, minmax(0, 1fr))"
            gap={["0px", "1.1rem"]}
            wgap={["0.9rem", "2.2rem"]}
            edges={[
              { from: "L", to: "A", bend: 0.4, narrow: { out: "b", in: "l", outAt: 13, inAt: 20 } },
              { from: "L", to: "U", bend: 0.4, narrow: { out: "b", in: "l", outAt: 13, inAt: 20 } },
              { from: "L", to: "K", bend: 0.4, narrow: { out: "b", in: "l", outAt: 13, inAt: 20 } },
            ]}
          >
            <Node id="L" tone="key" className="dg-wmid" col="1 / -1" row="1" wcol="1 / -1" wrow="1">
              low match rate
            </Node>
            <Group id="A" title="App-side" col="2" row="2" wcol="1" wrow="2">
              <Node>rapid retries</Node>
              <Node>too early, too many requests</Node>
              <Node>high floor</Node>
            </Group>
            <Group id="U" title="User-side · privacy" col="2" row="3" wcol="2" wrow="2">
              <Node>app for kids</Node>
              <Node>low-demand market</Node>
              <Node>no consent</Node>
            </Group>
            <Group id="K" title="Account-side · config" col="2" row="4" wcol="3" wrow="2">
              <Node>new app under review</Node>
              <Node>app-ads.txt missing or wrong</Node>
              <Node>many categories blocked</Node>
            </Group>
          </Canvas>
        </Figure>
      </Section>

      <Section title="App-side: excess requests and high floors">
        <P>
          Back-to-back retries and preloading for spots the user never reaches
          both grow the denominator without adding a single impression. Floors
          are different: Google states plainly that a high eCPM floor can limit
          match rate, because only bids that are high enough count. With several
          floor tiers in a waterfall, a low match rate on the top tier is exactly
          as designed; it exists to catch the few high-priced opportunities, and
          the lower tiers take care of fill. Lowering the floor of that tier
          just to make match rate look good burns away the high-priced share.
        </P>
        <Ref href="https://support.google.com/admob/answer/9655701?hl=en">
          AdMob Help · Common reasons for low match rate
        </Ref>
      </Section>

      <Section title="User-side and privacy">
        <P>
          Apps for children have a lower match rate because fewer advertisers
          suit the age group and because of constraints such as COPPA; Google
          says this directly. In addition, according to the bidding overview
          page, bidding sources currently do not serve ads to child-directed
          apps or requests, so part of the competition disappears. The age tag
          on the request (formerly TFCD and TFUA, now replaced by the age
          treatment setting) therefore directly affects demand.
        </P>
        <P>
          Consent acts somewhere else. When UMP reports <code>canRequestAds</code>{" "}
          as false, the app must not send any request, so the number affected
          is the request count, not match rate. When there is a request but no
          data for personalization, how far demand drops has no official figure
          in the pages checked, so no number is given here. The same goes for
          ATT being declined on iOS: Google recommends ways to protect revenue
          after ATT, but does not publish the impact on match rate.
        </P>
        <Ref href="https://support.google.com/admob/answer/9234488?hl=en">
          AdMob Help · Overview of bidding (child-directed)
        </Ref>
        <Ref href="https://developers.google.com/admob/android/targeting">
          AdMob · Targeting (age treatment, TFCD, TFUA)
        </Ref>
        <Ref href="https://support.google.com/admob/answer/9997589?hl=en">
          AdMob Help · Privacy strategies for iOS
        </Ref>
      </Section>

      <Section title="Account-side and configuration">
        <P>
          A new app or ad unit may receive little demand from Google for up to
          a week while its traffic quality is being assessed. At the account
          level, ad serving limits usually last under 30 days but can last
          longer. During that time, changing code to &ldquo;rescue&rdquo; match
          rate is pointless.
        </P>
        <P>
          app-ads.txt is often forgotten when changing domains or adding
          mediation sources. Sources that have adopted app-ads.txt only buy
          inventory in apps with a verified file; a missing or wrong line loses
          an entire group of buyers. Mediation with few sources also means
          little competition, and Google advises adding bidding sources to
          increase auction pressure. Finally there is the block list: the AdMob
          documentation says each blocked ad or category removes bids from the
          auction, so the wider you block, the lower match rate goes.
        </P>
        <Ref href="https://support.google.com/admob/answer/9493252?hl=en">
          AdMob Help · Ad serving limits
        </Ref>
        <Ref href="https://support.google.com/admob/answer/9776740?hl=en">
          AdMob Help · Resolve issues with app-ads.txt
        </Ref>
        <Ref href="https://support.google.com/admob/answer/15337570?hl=en">
          AdMob Help · Understand eCPM fluctuation (bidding pressure, blocking)
        </Ref>
      </Section>

      <Section title="A worked example: dropping rapid retries">
        <P>
          An interstitial placement needs an ad 1,000 times a day. The source
          returns an ad for 70% of first calls; the calls that get no-fill
          almost always get no-fill again when called right away. The old app
          retried three times in a row after every failure
          <Assumed />.
        </P>
        <Grid
          head={["", "3 immediate retries", "No immediate retry"]}
          rows={[
            ["Request", "1,000 + 300 × 3 = 1,900", "1,000"],
            ["Matched", "≈ 710", "700"],
            ["Match rate", "≈ 37%", "70%"],
            ["Impression", "≈ 700", "≈ 690"],
          ]}
        />
        <P>
          Match rate nearly doubles while impressions barely change. No new
          money at all; only a more honest denominator. If the team treats
          match rate as a goal, they will celebrate a change that brings no
          extra revenue or, the other way round, panic over a harmless change.
        </P>
      </Section>

      <Section title="Look at ARPDAU and impressions per user">
        <P>
          Match rate answers the question &ldquo;are my requests being
          answered&rdquo;, which is useful for narrowing down the cause. The
          business question lies elsewhere: revenue per daily active user, and
          the number of impressions per user. Those two metrics are not
          distorted by the request denominator. The check question before
          reacting to a drop in match rate: did ARPDAU and impressions per user
          fall with it? If not, what changed is probably how the app sends
          requests, not the market.
        </P>
      </Section>
    </>
  );
}
