import { Canvas, Figure, Group, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, P, Ref } from "@/components/bits";
import { Assumed } from "@/components/usecase";

export const metadata = { title: "Deep dive · Bidding and waterfall" };

export default function DeepBidding() {
  return (
    <>
      <PageHeader
        eyebrow="Deep dive · Q&A"
        title="How does bidding differ from waterfall, and what does it change in match rate, latency and revenue?"
        lead="A waterfall asks each ad source in turn, in the order you set from past average eCPM; bidding lets every source bid at the same time for this exact impression. That difference decides who wins an impression, how many rounds a request goes through, and why a carefully ordered waterfall can still sell inventory cheaply."
      />

      <Section title="Waterfall asks by past price, bidding asks by current price">
        <P>
          In a waterfall, each source is assigned an average eCPM, entered by
          you or taken from history, and AdMob calls them in turn from the top
          down. Whichever source returns an ad first wins, even when a source on
          a lower tier is willing to pay more for this particular user. Bidding
          calls every participating source at the same time; each source bids
          for the specific impression, and the highest bidder wins in a single
          auction.
        </P>
        <Figure caption="Two ways to choose a source for the same request">
          <Canvas
            cols="minmax(0, 1fr)"
            wcols="minmax(0, 2fr) minmax(0, 3fr)"
            gap={["1rem", "1rem"]}
            edges={[
              { from: "W1", to: "W2", label: "no-fill" },
              { from: "W2", to: "W3", label: "no-fill" },
              { from: "BA", to: "AU" },
              { from: "BB", to: "AU" },
              { from: "BC", to: "AU" },
              { from: "AU", to: "WIN", tone: "main" },
            ]}
          >
            <Group title="Waterfall" gap={["0.6rem", "2.3rem"]}>
              <Node id="W1" className="dg-mid" sub="avg eCPM 8">
                Source A
              </Node>
              <Node id="W2" className="dg-mid" sub="avg eCPM 5">
                Source B
              </Node>
              <Node id="W3" className="dg-mid" sub="avg eCPM 2">
                Source C
              </Node>
            </Group>
            <Group title="Bidding" cols="repeat(3, minmax(0, 1fr))" gap={["0.5rem", "1.7rem"]}>
              <Node id="BA" sub="bids 4">
                Source A
              </Node>
              <Node id="BB" sub="bids 9">
                Source B
              </Node>
              <Node id="BC" sub="bids 3">
                Source C
              </Node>
              <Node id="AU" tone="key" className="dg-mid" col="1 / -1">
                auction
              </Node>
              <Node id="WIN" tone="good" className="dg-mid" col="1 / -1">
                B wins · 9
              </Node>
            </Group>
          </Canvas>
        </Figure>
        <P>
          A mediation group can use both. The bidding auction runs first, and
          the winning source is placed into the waterfall next to the waterfall
          sources by price; if it is not the highest price in the waterfall, the
          higher waterfall sources are called first.
        </P>
        <Ref href="https://support.google.com/admob/answer/9234488?hl=en">
          AdMob Help · Overview of bidding
        </Ref>
        <Ref href="https://support.google.com/admob/answer/13420272?hl=en">
          AdMob Help · Guide to AdMob Mediation (bidding & waterfall)
        </Ref>
      </Section>

      <Section title="Latency: bidding adds no extra call rounds">
        <P>
          Each waterfall tier that returns no-fill adds another call round
          before the next tier, so a long waterfall means the ad arrives later,
          especially on a weak network. For bidding, Google answers directly
          that it does not increase latency: the auction runs in Google data
          centers and in parallel with the normal AdMob ad-serving process. An
          app-side waterfall, where the app keeps its own array of several ad
          units and tries them in turn, adds up latency in the worst possible
          way: each step is a full request from the device.
        </P>
        <Ref href="https://support.google.com/admob/answer/9360574?hl=en">
          AdMob Help · Bidding FAQ (latency)
        </Ref>
      </Section>

      <Section title="Match rate and revenue">
        <P>
          By the AdMob definition, for a waterfall source, a matched request is
          counted each time the source is called in the waterfall and returns
          an ad. So the match rate of each waterfall source reflects its
          position in the order as well, not only its demand. A source on a
          lower tier is only asked when the tiers above have returned no-fill,
          so its own match rate is hard to compare directly with a bidding
          source that is asked on every request.
        </P>
        <P>
          On revenue, Google says bidding helps get the highest price for each
          impression, and advises adding bidding sources to increase auction
          pressure. The specific uplift depends on the app and the sources;
          there is no official figure to cite here.
        </P>
        <Ref href="https://support.google.com/admob/table/9462111?hl=en">
          AdMob Help · Reports glossary (matched requests)
        </Ref>
      </Section>

      <Section title="A worked example: a waterfall sells an impression cheaply">
        <P>
          The waterfall puts source A at the top because of its average eCPM of
          8 USD. For this user, A is willing to pay 4 USD and B is willing to
          pay 9 USD
          <Assumed />.
        </P>
        <Grid
          head={["Selection method", "Who wins", "Impression price"]}
          rows={[
            ["Waterfall: A returns an ad right on the first tier", "A", "4 USD (eCPM)"],
            ["Bidding: A, B, C bid at the same time", "B", "9 USD (eCPM)"],
          ]}
        />
        <P>
          The waterfall is not wrong about the order: on average, A really does
          pay the most. It is wrong in using an average to decide for one
          specific impression. The check question for each source still in the
          waterfall: does this source support bidding, and if it does, what is
          the reason to keep it as a waterfall source?
        </P>
      </Section>
    </>
  );
}
