import { Canvas, Figure, Lanes, Node, Rail } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, P, Ref } from "@/components/bits";
import { Assumed, Code, UseCase } from "@/components/usecase";

export const metadata = { title: "Remote Config" };

const SCHEMA = `{
  "ads": {
    "app_open":     { "enabled": true,  "units": ["<u1>", "<u2>"], "show_interval_ms": 30000 },
    "interstitial": { "enabled": true,  "units": ["<u>"],          "show_interval_ms": 30000 },
    "rewarded":     { "enabled": true,  "units": ["<u>"] },
    "banner":   [ { "id": "home",   "enabled": true, "units": ["<u>"] } ],
    "native":   [ { "id": "feed",   "enabled": true, "units": ["<u>"], "refresh_ms": 0 } ]
  },
  "paywall": { "products": ["monthly", "yearly"], "default": "yearly" }
}`;

export default function RemoteConfig() {
  return (
    <>
      <PageHeader
        eyebrow="Operations · concepts"
        title="Remote Config as a control panel"
        lead="Remote Config lets you turn formats on and off, tune spacing, and change ad units or the plans on the paywall without shipping a new build. That benefit is real only if the app still runs correctly when it cannot get the config: the first launch, a weak network, broken JSON. So the hard part lies in the in-app default and the moment of activation, not in the list of keys."
      />

      <Section title="Put up what needs quick tuning, keep back what must stay secret">
        <Grid
          head={["Worth putting up", "Why"]}
          rows={[
            ["On/off per format, per placement", "switch off fast when an ad causes crashes or violates policy"],
            ["Interstitial, app open spacing", "the main lever between revenue and retention"],
            ["Ad unit list, waterfall order", "change sources without a store review"],
            ["Native refresh interval", "0 means off"],
            ["Plans shown on the paywall, default plan", "test prices and presentation"],
            ["Paywall trigger points", "after onboarding, on app open, on touching a feature"],
          ]}
        />
        <P>
          Do not put secrets in Remote Config: every value is downloaded to the
          user&rsquo;s device. Logic with many branches should not live there
          either, because no one can test every combination of values. Even
          less so a product id that does not exist on the store yet, because
          the store returns empty without reporting an error.
        </P>
      </Section>

      <Section title="The in-app default is the config for the worst conditions">
        <P>
          The value actually used comes from three tiers. The top tier is the
          activated remote value; if missing, fall back to the in-app default,
          the config bundled in the app; if still missing, fall back to the
          per-field default in the parsing code. A freshly installed app, an
          offline app or a failed fetch all run on the in-app default, so it
          has to be a config that works and is conservative: fewer ads, not
          more.
        </P>
        <Figure caption="The lower tier backs up the one above when it is missing">
          <Rail
            sink={{ label: "effective value", tone: "good" }}
            rows={[
              { label: "1 · Remote value", sub: "activated", exit: { label: "found" }, down: "none" },
              {
                label: "2 · In-app default",
                sub: "bundled in the app",
                exit: { label: "field found" },
                down: "none",
              },
              { label: "3 · Per-field default", sub: "in parsing code", exit: {} },
            ]}
          />
        </Figure>
        <P>
          If the JSON does not match the schema, the app keeps its current
          config and reports the error to the crash reporter or analytics, not
          just a log on the device. A successfully parsed config should be
          saved and read on the next cold start, so the app does not fall back
          to the in-app default every time.
        </P>
      </Section>

      <Section title="When you activate decides when the user sees a change">
        <Grid
          head={["Approach", "How", "Suits"]}
          rows={[
            ["Fetch and activate on open", <><C>fetchAndActivate</C> right at startup</>, "changes that do not visibly alter the UI"],
            ["Activate after the loading screen", "hold the loading screen until the fetch finishes, with its own timeout", "A/B experiments"],
            ["Load for the next open", "activate values fetched earlier, fetch in the background for next time", "fastest startup"],
          ]}
        />
        <P>
          Firebase notes that the default one-minute timeout can be too long
          for startup, so the second approach needs its own shorter timeout.
          With the third approach, console changes take effect only from the
          next launch. The real-time listener
          (<C>addOnConfigUpdateListener</C> on native,{" "}
          <C>onConfigUpdated</C> on Flutter) keeps a connection open while the
          app is in the foreground and fetches by itself when a new version is
          available, bypassing <C>minimumFetchInterval</C>; the app still has
          to call activate itself. Whichever approach you use, apply new values
          to the screen the user is interacting with only when there is a clear
          business reason.
        </P>
        <Ref href="https://firebase.google.com/docs/remote-config/loading">
          Firebase · Remote Config loading strategies
        </Ref>
        <Ref href="https://firebase.google.com/docs/remote-config/real-time">
          Firebase · Real-time Remote Config
        </Ref>
      </Section>

      <Section title="Whatever preloads before the config arrives runs on the default">
        <Figure caption="Read the previous session’s cache, fetch with a timeout, keep the old config if parsing fails">
          <Lanes
            numbered
            actors={[
              { id: "A", label: "App" },
              { id: "C", label: "Config layer" },
              { id: "R", label: "Remote Config" },
              { id: "D", label: "Ad SDK" },
            ]}
            steps={[
              { from: "A", to: "C", text: "init: read last-session cache" },
              { note: "C", text: "no cache: use in-app default" },
              { from: "A", to: "R", text: "fetch (with timeout)" },
              { from: "R", to: "C", text: "new JSON", reply: true },
              { self: "C", text: "parse · on error keep old" },
              { from: "C", to: "D", text: "ad config" },
              { self: "D", text: "preload" },
            ]}
          />
        </Figure>
      </Section>

      <Section title="One JSON key changes many fields in sync, and breaks them all at once">
        <P>
          Grouping the whole ad group under one JSON key lets you change many
          fields in sync in a single publish. The trade-off is that one wrong
          character breaks the whole block, which is why per-field defaults and
          parse error reporting are needed. Banners and natives usually look up
          their config by placement id; one wrong character and nothing is
          found, and the ad does not show with no error at all, so log the ids
          that are not found. When several apps share one Firebase project,
          give each app its own key prefix; otherwise two apps forked from the
          same base will fight over the same key.
        </P>
        <Code>{SCHEMA}</Code>
      </Section>

      <Section title="Only a parallel group tells you whether a change is worth it">
        <P>
          Remote Config conditions target by app version, platform, language,
          country, Analytics audience or user property, or user in random
          percentile. A rollout gradually releases a new value to a percentage
          of users, watches Crashlytics and Analytics, then expands or rolls
          back. A/B testing splits parallel groups for the same key. Without a
          parallel group, all that is left is a before/after comparison over
          time, and the result gets mixed up with seasonality, app versions
          and changes in traffic sources.
        </P>
        <Ref href="https://firebase.google.com/docs/remote-config/parameters">
          Firebase · Remote Config parameters and conditions
        </Ref>
        <Ref href="https://firebase.google.com/docs/remote-config/rollouts">
          Firebase · Remote Config rollouts
        </Ref>
      </Section>

      <Section title="Use cases">
        <UseCase
          n="1"
          title="Interstitials spaced out in Brazil, retention rises, and no one knows why"
          situation={
            <p>
              D1 retention in Brazil is lower than in other countries. The team
              raises spacing from 30 to 60 seconds for Brazil only<Assumed />.
              Two weeks later D1 is up two points, but at the same time there
              was a new release and a new campaign in Brazil.
            </p>
          }
          flow={
            <Figure>
              <Canvas
                className="mx-auto max-w-lg"
                cols="repeat(2, minmax(0, 1fr))"
                gap={["0.9rem", "1.5rem"]}
                edges={[
                  { from: "A", to: "B" },
                  { from: "C", to: "D" },
                  { from: "B", to: "E" },
                  { from: "D", to: "F" },
                  { from: "E", to: "G" },
                ]}
              >
                <Node id="A" col="1" row="1">
                  condition: country = BR
                </Node>
                <Node id="C" col="2" row="1">
                  default
                </Node>
                <Node id="B" col="1" row="2">
                  show_interval_ms = 60000
                </Node>
                <Node id="D" col="2" row="2">
                  show_interval_ms = 30000
                </Node>
                <Node id="E" col="1" row="3">
                  apps in BR fetch
                </Node>
                <Node id="F" col="2" row="3">
                  apps elsewhere fetch
                </Node>
                <Node id="G" col="1" row="4">
                  BR cohort before vs after
                </Node>
              </Canvas>
            </Figure>
          }
          why={
            <p>
              A country condition can change behavior without a store review,
              but a before/after comparison within one country cannot separate
              the effect of spacing from the release and the campaign. The team
              also measured only retention, not ad revenue per user, so they do
              not know how much money they traded for two points of D1.
            </p>
          }
          lesson="Remote Config can change behavior; only a parallel control group tells you whether the change is worth it, and you have to measure both what is gained and what is lost."
        />
        <UseCase
          n="2"
          title="New users on weak networks see a flood of ads"
          situation={
            <p>
              New users who install in an area with a weak network get an
              interstitial after almost every action in their first session,
              then uninstall the app. The fetch had timed out, and there was no
              cache yet because it was the first launch.
            </p>
          }
          why={
            <p>
              The app runs entirely on the in-app default, and the default
              turns on every format with short spacing &ldquo;to be safe on
              revenue&rdquo;. The group most likely to churn gets the most
              ad-heavy experience. Conversely, if the default uses an old ad
              unit that has been turned off, they see no ads at all.
            </p>
          }
          lesson="The default value is what the newest users see under the worst conditions. Update it with every release."
        />
        <UseCase
          n="3"
          title="A 10% rollout of a new format, and no way to decide the next step"
          situation={
            <p>
              The team replaces app open with a full-screen native at app open,
              rolled out to 10% of users<Assumed />. After three days, crash-free
              users in the 10% group are unchanged, and the team has to decide
              whether to raise it to 50%.
            </p>
          }
          why={
            <p>
              There are no per-format ad events, so the team can see stability
              but not the ARPDAU of the 10% group against the remaining 90%.
              They either expand the rollout without knowing how revenue
              changes, or stop because they have nothing to go on.
            </p>
          }
          lesson="A rollout is useful only when the metric for the decision is already in place before it is turned on."
        />
      </Section>
    </>
  );
}
