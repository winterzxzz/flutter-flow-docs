import { Link } from "@/components/locale";

import { Figure, Lanes, Rail, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, P, Ref, Stat } from "@/components/bits";
import { Assumed, UseCase } from "@/components/usecase";

export const metadata = { title: "IAA · Load, retry, refresh" };

const link = "underline underline-offset-4";

export default function IaaLoad() {
  return (
    <>
      <PageHeader
        eyebrow="IAA · mechanics"
        title="Load, retry, refresh"
        lead="When an ad does not show, the cause usually lies in the rules around the SDK, not in the SDK: the ad has expired, the spacing gate recorded its timestamp at the wrong moment, or a console value was overwritten by a constant. Each format has its own load, retry and refresh rules, and each rule has a spot that is often misunderstood."
      />

      <div className="mb-10 grid gap-2 sm:grid-cols-3 sm:gap-3">
        <Stat label="App open expiry" value="4 hours" sub="Google recommendation" />
        <Stat label="Interstitial preload" value="1 hour" sub="Google suggests cache refresh" />
        <Stat label="Banner refresh" value="30–150s" sub="set in the console" />
      </div>

      <Section title="Retry only rescues transient errors">
        <P>
          A failed load can come from a flaky network or from a source that has
          no ad to return (no-fill). Retrying helps with network errors; with
          no-fill, calling again right away almost certainly fails again and
          only inflates the request count. So a retry policy has two
          independent axes: how many times to retry the same unit and how far
          apart, and whether to switch to another unit.
        </P>
        <Figure caption="Switch units only after one unit runs out of retries; when units run out, stop and remove the slot">
          <Tree
            root={{
              label: "load(unit[i])",
              kids: [
                {
                  tone: "ask",
                  label: "result",
                  kids: [
                    { when: "loaded", tone: "good", label: "Ready · reset i = 0" },
                    {
                      when: "failed",
                      tone: "ask",
                      label: "retries left for this unit?",
                      kids: [
                        {
                          when: "yes",
                          label: "backoff wait",
                          kids: [{ tone: "plain", label: "↺ load(unit[i])" }],
                        },
                        {
                          when: "no",
                          tone: "ask",
                          label: "more units left?",
                          kids: [
                            {
                              when: "yes",
                              label: "i++",
                              kids: [{ tone: "plain", label: "↺ load(unit[i])" }],
                            },
                            { when: "no", tone: "mute", label: "Idle · i = 0", sub: "remove ad slot" },
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
        <Grid
          head={["Parameter", "Reference value", "Reason"]}
          rows={[
            ["Attempts on the same unit", "about 3", "enough for transient network errors"],
            ["Wait between attempts", "increasing, starting at a few seconds", "the reference project once retried three times in a row with no wait, and it only inflated requests"],
            ["Timeout waiting for a full-screen ad when it needs to show", "about 10–15 seconds", "any longer and the user has already moved on"],
            ["App-side waterfall", "2–3 units, decreasing floor prices", "each step adds one request and latency"],
          ]}
        />
        <P>
          The numbers above are starting points taken from a real project, not
          rules. AdMob&rsquo;s interstitial guide gives no retry count; when no
          ad is available, their sample code lets the app flow continue and
          loads again next time. Rapid-fire retries also drag down match rate
          without adding a single impression, see{" "}
          <Link href="/deep/match-rate" className={link}>
            Why match rate is low
          </Link>
          .
        </P>
      </Section>

      <Section title="Spacing gate: one shared clock, timestamped when the ad actually shows">
        <P>
          Spacing is the minimum gap between two full-screen ad shows, managed
          by the app itself. The reference value is 30 seconds, set in Remote
          Config so it can be tuned without shipping a new build. The clock
          must be shared by every place that calls the interstitial; if each
          screen counts on its own, a user who goes through three screens sees
          three ads. The timestamp is recorded when the ad actually shows, not
          when a show is requested; otherwise a blocked attempt also pushes
          back the next one.
        </P>
        <Figure caption="The next ad is loaded as soon as the previous one closes, so spacing is what sets the pace">
          <Rail
            sink={{ label: "report closed · go on" }}
            rows={[
              { label: "show request" },
              {
                tone: "ask",
                label: "shared gates OK?",
                sub: "entitlement · consent · network",
                exit: { label: "no" },
                down: "yes",
              },
              {
                tone: "ask",
                label: "now − last show ≥ spacing?",
                exit: { label: "no" },
                down: "yes",
              },
              { tone: "ask", label: "ad Ready?", exit: { label: "yes", to: "show" }, down: "not yet" },
              { label: "load, wait within timeout", exit: { label: "timed out" }, down: "in time" },
              { tone: "good", label: "show" },
              { label: "record last show time", sub: "load next ad" },
            ]}
          />
        </Figure>
        <P>
          Do not confuse this mechanism with AdMob frequency capping. Frequency
          capping is configured in the console and limits the number of
          impressions per user within a time window, for the whole app or per
          ad unit; the app&rsquo;s spacing lives in code and blocks the show
          call before it reaches the SDK. The two mechanisms can stack, so when
          an ad does not show you have to check both. A preloaded ad kept too
          long also expires: Google states that interstitials expire after one
          hour, so the preloaded ad cache needs refreshing every hour.
          Preloading too early for a placement few users reach wastes the ad,
          see{" "}
          <Link href="/deep/preload" className={link}>
            Why a loaded ad is not shown in time
          </Link>
          .
        </P>
        <Ref href="https://developers.google.com/admob/android/interstitial">
          AdMob · Interstitial ads (ads expire after an hour)
        </Ref>
        <Ref href="https://support.google.com/admob/answer/6244508?hl=en">
          AdMob Help · Set frequency caps for apps or ad units
        </Ref>
      </Section>

      <Section title="App open: not expired, past spacing, not on top of another ad">
        <P>
          Google states explicitly that app open ads expire after four hours:
          an ad rendered more than four hours after the request may no longer
          be valid and may not earn revenue. The app stores the time the load
          finished and checks it before showing; if expired, drop the old ad
          and load a new one for next time. A user who left the app by tapping
          an app open ad should not be met by another app open right when they
          come back.
        </P>
        <P>
          For cold starts, Google&rsquo;s recommended approach is to show the
          app open from the loading screen while the app is loading its
          resources, and they suggest showing app open only after the user has
          used the app a few times. The reference spacing between two shows is
          30–60 seconds, and app open and interstitial need to know about each
          other so they do not show back to back.
        </P>
        <Figure caption="App open’s three gates of its own, after the shared gates">
          <Rail
            sink={{ label: "skip" }}
            rows={[
              { label: "App foregrounded" },
              {
                tone: "ask",
                label: "another full-screen ad showing?",
                exit: { label: "yes" },
                down: "no",
              },
              {
                tone: "ask",
                label: "just back from an ad click?",
                exit: { label: "yes" },
                down: "no",
              },
              {
                tone: "ask",
                label: "ad still valid?",
                sub: "loaded within 4 hours",
                exit: { label: "no", note: "drop old ad · reload" },
                down: "yes",
              },
              { tone: "ask", label: "spacing passed?", exit: { label: "no" }, down: "yes" },
              { tone: "good", label: "show" },
              { label: "record time · load next ad" },
            ]}
          />
        </Figure>
        <Ref href="https://developers.google.com/admob/android/app-open">
          AdMob · App open ads (consider ad expiration, best practices)
        </Ref>
      </Section>

      <Section title="Native: the app refreshes it, and must release it">
        <P>
          AdMob offers a console auto-refresh option only for banners, so to
          refresh a native the app loads a new ad itself after an interval
          (reference: 30–60 seconds), and only after the old ad has recorded
          an impression. The old native ad must be destroyed when it is
          replaced by a new ad or when the screen is disposed; otherwise memory
          leaks a little with every refresh. While loading, hold the space with
          a skeleton; if the load fails, remove the slot instead of leaving an
          empty frame.
        </P>
        <Ref href="https://developers.google.com/admob/android/native/advanced">
          AdMob · Native advanced (destroy an ad)
        </Ref>
      </Section>

      <Section title="Banner: let the console refresh it, do not add a timer">
        <P>
          AdMob refreshes banners itself according to the ad unit setting: use
          the Google-optimized rate (recommended), set a custom rate between
          30–150 seconds, or turn it off. When the console has refresh enabled
          and the app also reloads on its own timer, the two mechanisms stack.
          An anchored adaptive banner is requested for a specific width, so
          when the width changes (screen rotation, split screen) the old size
          no longer fits and it must be requested again.
        </P>
        <Ref href="https://support.google.com/admob/answer/3245199">
          AdMob Help · Banner refresh rate
        </Ref>
      </Section>

      <Section title="Rewarded: reward on the callback, not on the close button">
        <P>
          The reward is granted only in the &ldquo;user earned reward&rdquo;
          callback. For Google-served ads, this callback arrives before the ad
          close callback, so granting on close is both late and wrong when the
          user quits midway. If the reward has real value, do not trust only
          the on-device callback: enable server-side verification (SSV) so your
          server receives confirmation from AdMob, with custom data to know who
          to reward. Rewarded ads do not reload themselves, so preload when the
          user gets close to the watch button. Because the user taps by choice,
          rewarded ads usually do not go through the spacing gate.
        </P>
        <Ref href="https://developers.google.com/admob/android/rewarded">
          AdMob · Rewarded ads
        </Ref>
      </Section>

      <Section title="A value should have only one place that holds it">
        <P>
          When spacing or an ad unit is declared at several layers, the value
          in effect is whichever was written last, and reading the code in each
          place does not tell you which one that is. Use case 3 below recounts
          one such time.
        </P>
      </Section>

      <Section title="Use cases">
        <UseCase
          n="1"
          title="No ad on the second photo save, and none on the third"
          situation={
            <p>
              A photo editing app shows an interstitial after a photo is saved,
              with 30 seconds of spacing<Assumed />. The user saves at 10:00:00
              (sees an ad, closes it at 10:00:06), saves a second time at
              10:00:20 and a third time at 10:00:45. By design, the third save
              should show an ad, but it does not.
            </p>
          }
          flow={
            <Figure>
              <Lanes
                actors={[
                  { id: "U", label: "User" },
                  { id: "G", label: "Spacing gate" },
                  { id: "A", label: "Interstitial" },
                ]}
                steps={[
                  { from: "U", to: "G", text: "save photo 1 · 10:00:00" },
                  { from: "G", to: "A", text: "show (no timestamp)" },
                  { from: "A", to: "G", text: "record 10:00:00", reply: true },
                  { self: "A", text: "close 10:00:06 · load next ad" },
                  { from: "U", to: "G", text: "save photo 2 · 10:00:20" },
                  { from: "G", to: "U", text: "20s less than 30s · skip", reply: true },
                  { from: "U", to: "G", text: "save photo 3 · 10:00:45" },
                  { from: "G", to: "A", text: "45s · show" },
                ]}
              />
            </Figure>
          }
          why={
            <p>
              The diagram shows the correct behavior. The buggy version records
              the timestamp when the show is <i>requested</i>, so the blocked
              attempt at 10:00:20 moves the timestamp to 10:00:20, and the
              attempt at 10:00:45 is only 25 seconds after it, so it is blocked
              too. The next ad had finished loading at 10:00:08 and was never
              used.
            </p>
          }
          lesson="A timestamp must be tied to an event that happened, not to an intent. The check question: does a blocked attempt change the state of the gate?"
        />
        <UseCase
          n="2"
          title="Back after 5 hours, the app open shows but earns nothing"
          situation={
            <p>
              An app open ad finished loading at 8:00 when the user left the
              app. They come back at 13:00 and the ad shows right away. The
              end-of-day report shows many impressions of this kind but revenue
              that does not match.
            </p>
          }
          flow={
            <Figure>
              <Tree
                root={{
                  label: "foreground 13:00",
                  kids: [
                    {
                      tone: "ask",
                      label: "loaded at 8:00",
                      sub: "over 4 hours?",
                      kids: [
                        {
                          when: "yes",
                          label: "drop old ad",
                          sub: "reload for next time",
                          kids: [{ label: "enter app now", sub: "no show" }],
                        },
                        { when: "no", label: "check spacing → show" },
                      ],
                    },
                  ],
                }}
              />
            </Figure>
          }
          why={
            <p>
              The app only checks &ldquo;is there an ad yet&rdquo;, not how
              long ago the ad was loaded. An ad older than four hours may not
              earn revenue, so the user is still interrupted while the app gets
              nothing. Making the user wait for a new ad to load right when they
              come back is not the fix either.
            </p>
          }
          lesson="A resource that expires must carry the time it was created, and be checked right before use."
        />
        <UseCase
          n="3"
          title="Spacing raised in the console, but impressions do not change"
          situation={
            <p>
              The team raised app open spacing from 30 to 90 seconds in Remote
              Config. A week later, app open impressions per user had not
              changed.
            </p>
          }
          why={
            <p>
              The value was declared in four places: a constant in the app, the
              in-app default JSON, a default parameter of the ads library, and
              Remote Config, with three different numbers. The last
              initialization call overwrote it with the constant and never read
              the remote value. Only logging the value in effect at
              initialization revealed this.
            </p>
          }
          lesson="One source of truth per parameter. After every console change, check the value in effect on a real device instead of trusting that it changed."
        />
      </Section>
    </>
  );
}
