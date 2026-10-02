import { Canvas, Figure, Group, Lanes, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, P, Ref } from "@/components/bits";
import { UseCase } from "@/components/usecase";

export const metadata = { title: "Startup" };

export default function Boot() {
  return (
    <>
      <PageHeader
        eyebrow="Concepts"
        title="Startup order"
        lead="Many of the hardest-to-find monetization bugs are born in the first few hundred milliseconds after the app opens: an ad is preloaded before the app knows the user has paid, a request goes out before consent exists, a hard-coded ad unit is used because the config has not arrived. Running in the wrong order does not crash, so the order has to be designed rather than left to happen by itself."
      />

      <Section title="Every arrow is a real dependency">
        <P>
          The diagram below is a reference frame. Many apps merge the splash,
          consent and the Remote Config fetch into one loading screen; what has
          to be kept is the dependencies, not each box exactly. Blocks on the
          same tier can run in parallel, but the Ad SDK initialization call
          always comes after three things: entitlement, consent and config
          that has taken effect.
        </P>
        <Figure caption="Blocks on the same tier run in parallel; everything related to ads waits at the consent gate">
          <Canvas
            className="mx-auto max-w-2xl"
            cols="repeat(2, minmax(0, 1fr))"
            gap={["0.75rem", "1.7rem"]}
            edges={[
              { from: "A", to: "B", tone: "main" },
              { from: "B", to: "par", tone: "main" },
              { from: "C1", to: "D", inAt: "align" },
              { from: "C2", to: "E", inAt: "align" },
              { from: "C3", to: "F", inAt: "align" },
              { from: "par", to: "G", tone: "main" },
              { from: "G", to: "H", tone: "main" },
              { from: "H", to: "I", bend: 0.4, head: false },
              { from: "H", to: "J", bend: 0.4, head: false },
              { from: "I", to: "K" },
              { from: "J", to: "K" },
            ]}
          >
            <Node id="A" className="dg-mid" col="1 / -1" sub="crash reporter">
              Global error handler
            </Node>
            <Node id="B" className="dg-mid" col="1 / -1" sub="entitlement cache, user id">
              Local storage
            </Node>
            <Group
              id="par"
              title="parallel"
              col="1 / -1"
              cols="repeat(2, minmax(0, 1fr))"
              wcols="repeat(3, minmax(0, 1fr))"
              gap={["1.6rem", "0.6rem"]}
              wgap={["0.75rem", "1.5rem"]}
            >
              <Node id="C1" col="1" row="1" wcol="1" wrow="1">
                Firebase core
              </Node>
              <Node id="D" col="2" row="1" wcol="1" wrow="2" sub="activate stored values">
                Remote Config
              </Node>
              <Node id="C2" col="1" row="2" wcol="2" wrow="1" sub="create or reload">
                User identity
              </Node>
              <Node id="E" col="2" row="2" wcol="2" wrow="2" sub="set callback before init">
                Attribution SDK
              </Node>
              <Node id="C3" col="1" row="3" wcol="3" wrow="1" sub="listen for transactions">
                Store / IAP SDK
              </Node>
              <Node id="F" col="2" row="3" wcol="3" wrow="2">
                Entitlement
              </Node>
            </Group>
            <Node id="G" className="dg-mid" col="1 / -1" sub="UMP · ATT">
              Consent
            </Node>
            <Node id="H" tone="ask" className="dg-mid" col="1 / -1">
              allowed to request ads?
            </Node>
            <Node id="I" when="yes, and no premium access" sub="preload the first ad">
              Initialize Ad SDK
            </Node>
            <Node id="J" when="no">
              Enter app, no ads
            </Node>
            <Node id="K" className="dg-mid" col="1 / -1">
              Main UI
            </Node>
          </Canvas>
        </Figure>
      </Section>

      <Section title="Which dependencies break when reversed">
        <P>
          Each row below is a &ldquo;must exist first / only then&rdquo; pair
          where, if reversed, the app still runs; only the data or the
          experience goes wrong.
        </P>
        <Grid
          head={["Must exist first", "Only then", "If reversed"]}
          rows={[
            ["user id", "IAP SDK, MMP, analytics", "transactions and events attach to an empty user and cannot be joined back"],
            ["listening for store transactions", "UI with a buy button", "missed pending transactions, Ask to Buy, renewals"],
            ["consent (UMP, ATT)", "first ad request", "requests that do not match the privacy choice"],
            ["entitlement", "preload ads", "someone who has paid sees an ad on the first screen"],
            ["config in effect", "preload ads", "the first ad of the session uses a hard-coded ad unit"],
          ]}
        />
      </Section>

      <Section title="Consent is a sequential step with an end point">
        <P>
          Google recommends calling UMP&rsquo;s <C>requestConsentInfoUpdate</C>{" "}
          on every app launch, showing the form if needed, and requesting ads
          only when <C>canRequestAds</C> returns true. The easy mistake is that{" "}
          <C>canRequestAds</C> can be true right after the update finishes,
          because consent from the previous session is still in effect, and
          true once more after the user makes a choice on the form. An app that
          checks in both places needs a flag so the Ad SDK is initialized only
          once. Some messages also require the app to have a button that lets
          the user reopen their privacy choices at any time.
        </P>
        <P>
          On iOS, ATT is a system prompt and needs the{" "}
          <C>NSUserTrackingUsageDescription</C> key. The system does not show
          the prompt while the app is not yet in the active state, so calling it
          too early during startup gets ignored and the status stays
          undetermined. UMP can show a message explaining IDFA right before the
          ATT prompt, configured in AdMob.
        </P>
        <Ref href="https://developers.google.com/admob/android/privacy">
          AdMob · Get started with UMP
        </Ref>
        <Ref href="https://developer.apple.com/documentation/apptrackingtransparency/attrackingmanager/requesttrackingauthorization(completionhandler:)">
          Apple · requestTrackingAuthorization
        </Ref>
        <Ref href="https://developers.google.com/admob/ios/privacy/idfa">
          AdMob · IDFA explainer message
        </Ref>
      </Section>

      <Section title="Block the first screen only for the steps that truly need it">
        <P>
          The Remote Config fetch is the only step on the list worth blocking
          the screen for, and only within a limit: a short timeout for the
          loading screen, and past that, continue with the values already
          stored. Product prices are needed only when the user opens the
          paywall, so fetch them in the background after entering the app. An
          app open ad should show while the user is already having to wait, not
          make them wait longer for the ad. Sending events is always
          asynchronous, with a local queue.
        </P>
      </Section>

      <Section title="Use cases">
        <UseCase
          n="1"
          title="A new user in the EU opens the app for the first time"
          situation={
            <p>
              A note-taking app has a banner and an app open ad. Logs from new
              users in Germany show that each of them produces two Ad SDK
              initialization calls, and the ATT status is still{" "}
              <C>notDetermined</C> after the first launch.
            </p>
          }
          flow={
            <Figure>
              <Lanes
                actors={[
                  { id: "App", label: "App" },
                  { id: "UMP", label: "UMP" },
                  { id: "ATT", label: "iOS ATT" },
                  { id: "Ads", label: "Ad SDK" },
                ]}
                steps={[
                  { from: "App", to: "UMP", text: "requestConsentInfoUpdate" },
                  { from: "UMP", to: "App", text: "needs consent", reply: true },
                  { from: "App", to: "UMP", text: "show GDPR form" },
                  { from: "UMP", to: "App", text: "choice made", reply: true },
                  { from: "App", to: "ATT", text: "prompt once app is active" },
                  { from: "ATT", to: "App", text: "authorized or denied", reply: true },
                  { self: "App", text: "canRequestAds?" },
                  { from: "App", to: "Ads", text: "init and preload, exactly once" },
                ]}
              />
            </Figure>
          }
          why={
            <p>
              The ATT prompt is called during startup, while the app is not yet
              active, so the system ignores it. The Ad SDK is initialized in
              both the &ldquo;consent from the previous session&rdquo; branch
              and the &ldquo;just chose&rdquo; branch with no guard flag, so ad
              requests are doubled within the very first session.
            </p>
          }
          lesson="A step that can be reached by more than one path needs a flag marking it as done. The check question: if the condition is true in two places, does the code run twice?"
        />
        <UseCase
          n="2"
          title="Someone who has paid still sees an app open ad"
          situation={
            <p>
              The user bought an annual plan yesterday. This morning they open
              the app, and the first screen is still an app open ad; only after
              that do they get into the ad-free app. They leave a one-star
              review.
            </p>
          }
          why={
            <p>
              The app open preload and show run in parallel with reading the
              entitlement, and the ad wins the race. This bug rarely reproduces
              on a dev device, because dev devices usually have no active plan.
            </p>
          }
          lesson="The entitlement, at least its local cached copy, must be available before the first ad preload call. A race between two parallel tasks is safe only when the result does not depend on which finishes first."
        />
      </Section>
    </>
  );
}
