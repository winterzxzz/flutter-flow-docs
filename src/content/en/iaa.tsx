import { Link } from "@/components/locale";

import { Figure, Lanes, Rail, States } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, P, Ref } from "@/components/bits";
import { UseCase } from "@/components/usecase";

export const metadata = { title: "IAA · Formats & lifecycle" };

const link = "underline underline-offset-4";

export default function Iaa() {
  return (
    <>
      <PageHeader
        eyebrow="IAA · concepts"
        title="Ad formats and lifecycle"
        lead="An ad that “does not show” is rarely the SDK’s fault. Usually the ad has expired, has already been shown once, or was stopped by a gate that never told the screen waiting for it. The five formats differ in how they take up the screen, but they all go through one lifecycle and all have to pass the same gates."
      />

      <Section title="Five formats">
        <Grid
          head={["Format", "Screen use", "Where it goes", "Remember"]}
          rows={[
            ["Banner", "a fixed strip", "bottom or top of a content screen", "refreshes itself per the console setting"],
            ["Interstitial", "full screen, closable", "a natural break between two pieces of content", "shows once; needs a spacing gate"],
            ["Rewarded", "full screen, the user opts in to watch", "in exchange for a reward", "reward on the callback, not on the close button"],
            ["App open", "full screen", "when the app opens or returns from the background", "has an expiry counted from load time"],
            ["Native", "blends into the layout", "in feeds, lists", "the app builds the UI itself from the ad components"],
          ]}
        />
        <Ref href="https://developers.google.com/admob/android/interstitial">
          AdMob · Interstitial ads
        </Ref>
      </Section>

      <Section title="A loaded ad expires, and can be shown only once">
        <P>
          Every format goes through four states: Idle, Loading, Ready, Showing.
          Two things make this lifecycle different from an ordinary network
          request. First, Ready is not a durable state: a loaded ad has an
          expiry, and a stale ad that shows may still not be counted as
          revenue. Second, a full-screen ad (interstitial, rewarded, app open)
          can be shown only once; after showing, drop the reference and load a
          new one.
        </P>
        <Figure caption="Failed and timeout are where the retry policy decides; Ready can fall back to Idle on expiry">
          <States
            main={[
              { name: "Idle", enter: [""], next: "load" },
              {
                name: "Loading",
                next: "loaded",
                exits: [
                  { on: "failed to load", to: "Failed" },
                  { on: "timeout", to: "Idle" },
                ],
              },
              { name: "Ready", next: "show", exits: [{ on: "expired", to: "Idle" }] },
              {
                name: "Showing",
                tone: "good",
                exits: [
                  { on: "dismissed", to: "Idle" },
                  { on: "failed to show", to: "Idle" },
                ],
              },
            ]}
            side={[
              {
                name: "Failed",
                tone: "warn",
                exits: [
                  { on: "retries / units left", to: "Loading" },
                  { on: "exhausted", to: "Idle" },
                ],
              },
            ]}
          />
        </Figure>
        <P>
          The whole app should have only one full-screen ad at a time, so app
          open and interstitial must know about each other through a shared
          &ldquo;showing&rdquo; flag. When reloading while the previous load has
          not finished, the old load&rsquo;s callback must be ignored and the
          surplus ad must be released; otherwise a late-arriving ad can
          overwrite a newer one.
        </P>
      </Section>

      <Section title="Every blocked branch must report “closed”">
        <P>
          Before every load or show call there is a chain of checks, cheap ones
          first and expensive ones last: does the user have the entitlement,
          does consent allow requests yet, is the format enabled in the config,
          is there a network, has the spacing gate been passed. The entitlement
          check relies on data from the store or the server, not on a flag the
          app sets itself after the buy button is tapped. The network check
          avoids burning requests that are certain to fail, so the fill rate is
          not dragged down.
        </P>
        <Figure caption="Wherever it is blocked, it ends with the same signal as when the ad closes">
          <Rail
            sink={{ label: "skip · report closed" }}
            rows={[
              { label: "load / show" },
              { tone: "ask", label: "has entitlement?", exit: { label: "yes" }, down: "no" },
              { tone: "ask", label: "consent for ad requests?", exit: { label: "no" }, down: "yes" },
              { tone: "ask", label: "format enabled in config?", exit: { label: "no" }, down: "yes" },
              { tone: "ask", label: "online?", exit: { label: "no" }, down: "yes" },
              { tone: "ask", label: "spacing gate passed?", exit: { label: "no" }, down: "yes" },
              { tone: "good", label: "load / show" },
            ]}
          />
        </Figure>
        <P>
          UI flows are usually written as &ldquo;show the interstitial, then
          navigate once it closes&rdquo;. If a gate blocks without calling the
          close callback, the user is stuck on the old screen. Debug builds
          should use test ad units: Google recommends enabling test ads during
          development to avoid invalid activity.
        </P>
        <Ref href="https://developers.google.com/admob/android/test-ads">
          AdMob · Enable test ads
        </Ref>
      </Section>

      <Section title="Mediation picks a source by average price or by current price">
        <P>
          Waterfall mediation calls the sources one after another by the
          average eCPM you set, not by the price a source is willing to pay for
          this impression. Bidding lets the sources bid in real time for the
          same request. Some apps also build their own app-side waterfall from
          an array of ad units, trying the next one when one fails: it raises
          fill, but every step adds one more request and more latency. A
          detailed comparison is in{" "}
          <Link href="/deep/bidding" className={link}>
            How bidding differs from waterfall
          </Link>
          ; retry, timeouts and the expiry of each format are in{" "}
          <Link href="/iaa/load" className={link}>
            Load, retry, refresh
          </Link>
          .
        </P>
        <Ref href="https://support.google.com/admob/answer/13420272">
          AdMob Help · Mediation (bidding, waterfall)
        </Ref>
      </Section>

      <Section title="Paid event: one impression, one revenue event">
        <P>
          Each impression can come with a paid event carrying a value, a
          currency code and a precision (<C>UNKNOWN</C>, <C>ESTIMATED</C>,{" "}
          <C>PUBLISHER_PROVIDED</C>, <C>PRECISE</C>). On Android and Flutter,
          the value is in micros: 5,000 means 0.005 currency units, and
          forgetting to divide by one million inflates revenue a millionfold.
          The feature must be enabled in AdMob and needs a recent enough SDK.
          When testing with bidding sources, test impressions return a value
          of 0 and precision UNKNOWN, so a 0 during testing does not mean the
          integration is broken. Where to send the paid event, and why it has
          to go to both places, is covered on{" "}
          <Link href="/tracking" className={link}>
            Tracking
          </Link>
          .
        </P>
        <Ref href="https://developers.google.com/admob/android/impression-level-ad-revenue">
          AdMob · Impression-level ad revenue
        </Ref>
      </Section>

      <Section title="Use cases">
        <UseCase
          n="1"
          title="Premium bought mid-session, but the banner stays put"
          situation={
            <p>
              The user is on the main screen, with a banner at the bottom, a
              native in the feed, and a preloaded interstitial. They buy a
              monthly plan. Three minutes later they send a screenshot to
              support: the banner is still there.
            </p>
          }
          flow={
            <Figure>
              <Lanes
                actors={[
                  { id: "P", label: "Paywall" },
                  { id: "E", label: "Entitlement" },
                  { id: "A", label: "Ad layer" },
                ]}
                steps={[
                  { from: "P", to: "E", text: "purchase OK, verified" },
                  { from: "E", to: "A", text: "emit entitled event" },
                  { self: "A", text: "remove visible banner, native" },
                  { self: "A", text: "drop preloaded interstitial, app open" },
                  { self: "A", text: "stop refresh timer" },
                  { note: "A", text: "all later shows take the skip path" },
                ]}
              />
            </Figure>
          }
          why={
            <p>
              The app checks the entitlement only at the next show call. The
              visible banner gets no new show call, so it stays until the screen
              changes, and the native refresh timer keeps sending requests.
            </p>
          }
          lesson="State that changes midway must be broadcast to the components that are running, not only queried at the next call."
        />
        <UseCase
          n="2"
          title="Network lost right when “Next lesson” is tapped"
          situation={
            <p>
              A vocabulary app shows an interstitial after each lesson. A user
              on the subway loses signal right when they tap &ldquo;Next
              lesson&rdquo;, and the button seems frozen.
            </p>
          }
          why={
            <p>
              The network gate blocks correctly, but just returns without
              calling the close callback. The next screen is waiting for that
              callback to open, so it never opens.
            </p>
          }
          lesson="A good blocking layer is one the caller does not need to know exists: every exit returns the same signal."
        />
        <UseCase
          n="3"
          title="“Watch for a reward” spins forever"
          situation={
            <p>
              A puzzle game gives one extra hint for watching a rewarded ad. The
              user taps the button, the request gets no-fill, and the spinner
              spins until they quit the game.
            </p>
          }
          why={
            <p>
              The app loads the rewarded ad only when the user taps. On no-fill,
              no branch ends the wait. There are three sensible ways out: hide
              the button while no ad is Ready (best, with a preload when the
              user enters the screen), say &ldquo;no video yet, try again
              later&rdquo;, or grant the reward anyway. Granting the reward with
              no ad trades revenue for goodwill, so choose it deliberately.
            </p>
          }
          lesson="A button tied to an uncertain resource must reflect that resource’s state, and every wait must have an end point."
        />
      </Section>
    </>
  );
}
