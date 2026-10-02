import { Link } from "@/components/locale";

import { Canvas, Figure, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, P, Ref } from "@/components/bits";
import { Assumed } from "@/components/usecase";

export const metadata = { title: "Deep dive · Preload" };

const link = "underline underline-offset-4";

export default function DeepPreload() {
  return (
    <>
      <PageHeader
        eyebrow="Deep dive · Q&A"
        title="Why does a loaded ad fail to show in time, or show and still lose money?"
        lead="Preload exists so that users do not have to wait for an ad, but it bets on a future: the user will reach the show point before the ad expires. Lose the bet one way and the ad is wasted; lose it the other way and the user arrives before the ad is ready."
      />

      <Section title="Four numbers on the way from request to click">
        <P>
          The AdMob report splits the path of an ad into four milestones. The
          app sends a{" "}
          <b>request</b>; when an ad source returns an ad, that request becomes{" "}
          <b>matched</b>; when the ad is shown to the user there is an{" "}
          <b>impression</b>; when the user taps it there is a <b>click</b>. The
          first two ratios are what this page is about: match rate is matched
          divided by requests, show rate is impressions divided by matched.
          Match rate says whether the ad sources are willing to return an ad;
          show rate says whether the app uses up all the ads it asked for.
        </P>
        <Figure caption="Each arrow is a place where volume drops. Preload mainly affects the second arrow">
          <Canvas
            cols="repeat(2, minmax(0, 1fr))"
            wcols="repeat(4, minmax(0, 1fr))"
            gap={["1.5rem", "2.6rem"]}
            wgap={["5.4rem", "2.4rem"]}
            edges={[
              { from: "R", to: "M", label: "match rate", tone: "main" },
              { from: "M", to: "I", label: "show rate", tone: "main" },
              { from: "I", to: "C", label: "CTR", tone: "main" },
              { from: "M", to: "W", dashed: true, inAt: "align" },
            ]}
          >
            <Node id="R" col="1" row="1" wcol="1" wrow="1">
              Request
            </Node>
            <Node id="M" col="1" row="2" wcol="2" wrow="1">
              Matched
            </Node>
            <Node id="I" col="1" row="3" wcol="3" wrow="1">
              Impression
            </Node>
            <Node id="C" col="1" row="4" wcol="4" wrow="1">
              Click
            </Node>
            <Node
              id="W"
              tone="mute"
              when="nobody reaches show point or ad expires"
              col="2"
              row="2 / 4"
              wcol="2 / 4"
              wrow="2"
            >
              wasted
            </Node>
          </Canvas>
        </Figure>
        <P>
          Google states plainly that a low show rate signals a problem with the
          ad unit implementation or with the in-app experience. In other words,
          show rate is a metric of the app itself, not of the ad market.
        </P>
        <Ref href="https://support.google.com/admob/table/9462111?hl=en">
          AdMob Help · Reports glossary (match rate, show rate)
        </Ref>
      </Section>

      <Section title="The ad is ready but the user never reaches the show point">
        <P>
          A story-reading app preloads an interstitial as soon as the app opens,
          to show it when the user finishes a chapter. Most users read a passage
          and then leave, never reaching the end of the chapter. Requests are
          still sent, the source still returns ads, matched still rises, but
          impressions do not. Show rate drops while match rate still looks
          healthy.
        </P>
        <P>
          A waiting ad does not keep its value forever either. According to the
          AdMob documentation, interstitial ads expire after one hour, so a
          cache of preloaded ads needs to be refreshed every hour; app open ads
          expire four hours after the request and may not earn revenue if shown
          after that point. An ad preloaded and then left to expire is a request
          spent and a creative download that cost bandwidth and memory, with no
          impression in return. Preloading everything at startup also competes
          for bandwidth and CPU with the very app content trying to appear,
          exactly when the user is most sensitive to latency.
        </P>
        <Ref href="https://developers.google.com/admob/android/interstitial">
          AdMob · Interstitial ads (ads expire after an hour)
        </Ref>
        <Ref href="https://developers.google.com/admob/android/app-open">
          AdMob · App open ads (four hours)
        </Ref>
      </Section>

      <Section title="The user reaches the show point but the ad is not ready">
        <P>
          The opposite happens when the app only loads at the moment it needs
          to show. The user taps &ldquo;Save&rdquo;, only then does the app send
          the request, and there are three options, each with a cost. Wait with
          a short timeout and the user watches a spinner. Skip it and the
          impression is lost. Show it when the ad arrives late and the ad pops
          up after the user has moved to the next screen and is reading new
          content.
        </P>
        <P>
          The third option is not just a bad experience. AdMob policy treats
          an interstitial that pops up unexpectedly while the user is focused on
          something as a disallowed implementation, and names exactly this
          common cause: an ad meant to show between two pages of content that,
          because of network latency, appears right after the new page has
          loaded. The approach Google recommends is to preload the interstitial
          in advance. So &ldquo;load late, show late&rdquo; is not an option;
          only waiting with a timeout or skipping remains.
        </P>
        <Ref href="https://support.google.com/admob/answer/6201362?hl=en">
          AdMob Help · Disallowed interstitial implementations
        </Ref>
      </Section>

      <Section title="A worked example: the same app, two ways to preload">
        <P>
          Assume 10,000 sessions a day, each preloading an interstitial as soon
          as the app opens. Only 40% of sessions reach the show point within an
          hour
          <Assumed />. The second approach only preloads once the user has
          entered the screen that has the show point, where 85% of sessions
          reach that point.
        </P>
        <Grid
          head={["", "Preload at app open", "Preload on entering the screen"]}
          rows={[
            ["Request", "10,000", "4,700"],
            ["Matched (match rate 90%)", "9,000", "4,230"],
            ["Impression", "3,600", "3,600"],
            ["Show rate", "40%", "≈ 85%"],
          ]}
        />
        <P>
          Impressions are equal because the number of people who reach the show
          point does not change; the second approach just cuts about 5,300
          requests and nearly 4,800 ads that are downloaded and then thrown
          away. Revenue stays almost the same, while bandwidth, memory and
          startup pacing get better. In exchange, if that screen opens very
          quickly after entry, some users will reach the show point before the
          ad arrives, and that is when you need a short timeout or a skip.
        </P>
      </Section>

      <Section title="Preload according to the probability that the user reaches the show point">
        <P>
          The principle that follows is to preload as close to the show point
          as possible while still leaving enough time for the ad to arrive. A
          show point that almost every session passes through, such as app open
          on return from the background, is worth preloading early. A show
          point that only a small share of users reach should be preloaded once
          they are near it. The check question for each placement: of the ads
          loaded for this spot, what share is shown before it expires?
        </P>
        <P>
          A frequently mentioned hypothesis is that a persistently low show rate
          makes mediation sources value the inventory of the app lower. No
          official documentation confirming this has been found, so here it is
          treated only as a hypothesis; the reasons to keep show rate high are
          enough without it.
        </P>
        <p className="mt-3 text-sm text-muted-foreground">
          The expiry mechanism and spacing gate for each format: see{" "}
          <Link href="/iaa/load" className={link}>
            Load, retry, refresh
          </Link>
          ; why match rate is low: see the{" "}
          <Link href="/deep/match-rate" className={link}>
            next article
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
