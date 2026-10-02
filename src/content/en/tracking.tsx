import { Link } from "@/components/locale";

import { Canvas, Figure, Group, Lanes, Node, Rail } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, P, Ref } from "@/components/bits";
import { Assumed, CodeTabs, UseCase } from "@/components/usecase";

export const metadata = { title: "Tracking" };

const link = "underline underline-offset-4";

export default function Tracking() {
  return (
    <>
      <PageHeader
        eyebrow="Operations · concepts"
        title="Tracking: events, attribution, revenue"
        lead="Three different data streams: in-app behavior, install source, and money. Only when all three can be tied to the same user can you compute ARPU, LTV and ROAS per campaign; with one thread missing, every number downstream still comes out, it is just wrong."
      />

      <Section title="Install source flows back into the app, revenue goes both ways">
        <P>
          The analytics warehouse here is where behavior and revenue events
          land, which can be Firebase Analytics or a data warehouse. The MMP
          (mobile measurement partner, such as Adjust or AppsFlyer) is the party
          that attributes each install to a source. The two need each other:
          the analytics warehouse needs the install source to split behavior by
          campaign, and the MMP needs revenue to compute ROAS.
        </P>
        <Figure caption="Attribution returns to the app as user properties; revenue goes to both the MMP and the analytics warehouse">
          <Canvas
            className="mx-auto max-w-xl pr-7"
            cols="repeat(2, minmax(0, 1fr))"
            gap={["1rem", "2.9rem"]}
            edges={[
              { from: "MMP", to: "UP", label: "attribution callback", tone: "main" },
              { from: "UP", to: "EV" },
              { from: "UP", to: "REV" },
              { from: "REV", to: "MMP", out: "r", in: "r" },
              { from: "EV", to: "WH", inAt: 0.3 },
              { from: "REV", to: "WH", inAt: 0.7 },
            ]}
          >
            <Node id="MMP" className="dg-mid" col="1 / -1" sub="Adjust, AppsFlyer">
              MMP
            </Node>
            <Group
              title="In the app"
              col="1 / -1"
              cols="repeat(2, minmax(0, 1fr))"
              gap={["0.9rem", "1.6rem"]}
            >
              <Node id="UP" tone="key" className="dg-mid" col="1 / -1" sub="user id, entitlement, install source">
                user property
              </Node>
              <Node id="EV" sub="screen, paywall, ad">
                behavior event
              </Node>
              <Node id="REV" sub="purchase, ad_paid">
                revenue event
              </Node>
            </Group>
            <Node id="WH" className="dg-mid" col="1 / -1">
              Analytics warehouse
            </Node>
          </Canvas>
        </Figure>
      </Section>

      <Section title="Event taxonomy">
        <Grid
          head={["Group", "Suggested events", "Minimum parameters"]}
          rows={[
            ["Lifecycle", "first_open, session_start, loading_start/finish", "time, error code"],
            ["Screen", "screen_show, screen_exit, button_click", "screen name, button name"],
            ["Paywall · IAP", "paywall_show, paywall_click, purchase_success, purchase_fail, restore", "entry point, product id, price, currency, transaction id"],
            ["Ads", "ad_request, ad_load_success, ad_load_fail, ad_show, ad_click, ad_paid", "format, placement, ad unit, error code, value, currency, precision"],
            ["System", "remote_config_parse_fail, consent_result", "config version, choice"],
          ]}
        />
        <P>
          Event names are written in snake_case and kept fixed, because a rename
          breaks the time series. Placement is a closed list of values, not a
          free-form string. Analytics SDKs usually attach some keys themselves,
          such as install date or session, and silently ignore them if the app
          overwrites them; read the SDK&rsquo;s list of reserved keys before
          adding user properties. Debug builds should not send events to the
          real analytics warehouse but should still be able to display them in
          the app for checking; end-to-end verification must be done on a
          release or profile build.
        </P>
      </Section>

      <Section title="Attribution has to flow back into the app">
        <P>
          The MMP attributes each install to a network, campaign, adgroup and
          creative based on click and impression data from the ad networks.
          That information reaches the app through the SDK&rsquo;s attribution
          callback: with Adjust, set{" "}
          <C>attributionCallback</C> on the config <b>before</b> initializing
          the SDK, or read it on demand with <C>getAttribution()</C>. The app
          writes tracker name, network, campaign, adgroup and creative as user
          properties so they travel with every event, and keeps the organic
          group separate so it does not blend in as a campaign.
        </P>
        <Ref href="https://dev.adjust.com/en/sdk/flutter/features/attribution">
          Adjust · Flutter SDK attribution
        </Ref>
      </Section>

      <Section title="Revenue has to reach both the MMP and the analytics warehouse">
        <P>
          IAP revenue comes from the verified purchase result; the most
          trustworthy value comes from the server, which already knows the
          store fee and the exchange rate. IAA revenue comes from the Ad
          SDK&rsquo;s paid event for each impression, sent to the MMP (with
          Adjust, that is{" "}
          <C>AdjustAdRevenue(&apos;admob_sdk&apos;)</C>) and sent to the
          analytics warehouse. Send it to one place and the other is missing
          it: missing in the MMP, ROAS per campaign is wrong; missing in the
          analytics warehouse, ARPU and LTV are left with only the IAP part.
          The two places will never match to the cent, see{" "}
          <Link href="/deep/revenue-gap" className={link}>
            Why AdMob revenue differs from the MMP
          </Link>
          .
        </P>
        <Ref href="https://dev.adjust.com/en/sdk/flutter/features/ad-revenue">
          Adjust · Flutter SDK ad revenue
        </Ref>
      </Section>

      <Section title="Use cases">
        <UseCase
          n="1"
          title="Campaigns are running but every install reports “Unattributed”"
          situation={
            <p>
              The UA team runs three campaigns with five creatives for two
              weeks. The MMP dashboard shows installs correctly attributed by
              campaign, but in the analytics warehouse, splitting revenue by
              campaign yields a single row:{" "}
              <C>Unattributed</C>.
            </p>
          }
          flow={
            <Figure>
              <Rail
                rows={[
                  { tone: "mute", label: "MMP SDK init", down: "callback not set before init", broken: true },
                  { tone: "mute", label: "attribution handler", down: "never called", broken: true },
                  { label: "install source user property" },
                  { tone: "bad", label: "all events carry initial value" },
                ]}
              />
            </Figure>
          }
          why={
            <>
              <p>
                The MMP knows the source but the app is never told, because the
                callback was set after init. The user property keeps its initial
                value, so every by-source analysis in the analytics warehouse is
                meaningless without a single error showing up.
              </p>
              <p>
                How to check: install a release build through a test tracker
                link, see in the logs whether the callback runs and whether the
                first event after it carries the correct network name. Repeat
                with an organic install.
              </p>
            </>
          }
          lesson="An integration is done only when the data travels all the way to where it is analyzed; reading the code at each end of the wire does not prove that."
        />

        <UseCase
          n="2"
          title="A campaign’s ROAS jumps to millions of percent"
          situation={
            <p>
              After adding ad revenue reporting to the MMP, one campaign&rsquo;s
              D1 ROAS reports millions of percent. One user sees 3
              interstitials and 10 banner impressions on day one, and the paid
              events add up to 18,000 micros
              <Assumed />.
            </p>
          }
          flow={
            <Figure>
              <Lanes
                actors={[
                  { id: "SDK", label: "Ad SDK" },
                  { id: "App", label: "App" },
                  { id: "MMP", label: "MMP" },
                  { id: "WH", label: "Analytics warehouse" },
                ]}
                steps={[
                  { from: "SDK", to: "App", text: "paid(valueMicros, currency, precision)" },
                  { self: "App", text: "value = micros / 1,000,000" },
                  { from: "App", to: "MMP", text: "ad revenue (source, value, currency)" },
                  { from: "App", to: "WH", text: "ad_paid + format + placement" },
                ]}
              />
            </Figure>
          }
          why={
            <>
              <p>
                18,000 micros is 0.018 USD, but the app sends 18,000 straight
                to the MMP. The iOS port is correct, because the iOS SDK returns{" "}
                <C>GADAdValue.value</C> as a decimal already in the right unit,
                while Flutter returns micros.
              </p>
              <CodeTabs
                flutter={`ad.onPaidEvent = (ad, valueMicros, precision, currency) {
  final value = valueMicros / 1e6;
  // send value, currency, precision to the MMP and the analytics warehouse
};`}
                swift={`ad.paidEventHandler = { adValue in
  let value = adValue.value // already a decimal
  // send value, adValue.currencyCode, adValue.precision
}`}
              />
            </>
          }
          lesson="The same concept on two platforms can use different units. When porting, check units before checking logic."
        />

        <UseCase
          n="3"
          title="A refund with no way to know which purchase it cancels"
          situation={
            <p>
              A user buys an annual plan and is refunded after 5 days. The
              server receives the refund notification, but cohort revenue in the
              analytics warehouse still counts that purchase. The{" "}
              <C>purchase_success</C> event has only the plan name, price and
              currency.
            </p>
          }
          why={
            <p>
              Without a transaction id, the refund cannot be linked to the
              purchase. A purchase event sent twice because of a network retry
              is also counted twice, because there is no key to deduplicate on.
            </p>
          }
          lesson="Every event that carries money needs a unique key from the source that produced it, so it can later be added, subtracted and deduplicated."
        />
        <Ref href="https://developers.google.com/admob/ios/impression-level-ad-revenue">
          AdMob iOS · Impression-level ad revenue (paidEventHandler, GADAdValue)
        </Ref>
      </Section>
    </>
  );
}
