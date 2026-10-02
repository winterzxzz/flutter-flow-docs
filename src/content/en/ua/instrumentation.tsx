import { Canvas, Figure, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, Note } from "@/components/bits";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UseCase } from "@/components/usecase";

export const metadata = { title: "Measurement plan" };

type Step = {
  order: string;
  effort: string;
  title: string;
  why: string;
  what: string;
  done: string;
};

const STEPS: Step[] = [
  {
    order: "1",
    effort: "Small",
    title: "User identity and user properties",
    why: "Every event and transaction must be attached to the same person; otherwise nothing can be joined.",
    what: "Create or read back the user id before initializing the IAP, MMP and analytics SDKs. Set premium, language and config version as user properties. Check the SDK's list of reserved keys before choosing names.",
    done: "Any event in the warehouse has the user id and the correct user properties.",
  },
  {
    order: "2",
    effort: "Medium",
    title: "Connect attribution back to the app",
    why: "Without this step, any analysis by campaign, network or creative is impossible.",
    what: "Register the attribution callback before initializing the MMP SDK; when it arrives, write network, campaign, adgroup, creative and tracker name into user properties. Keep organic separate.",
    done: "An install through a test tracker link shows the correct network on the first in-app event after it.",
  },
  {
    order: "3",
    effort: "Medium",
    title: "Ad events",
    why: "An app that lives on IAA needs an ad funnel: request, fill, show, click.",
    what: "ad_request, ad_load_success, ad_load_fail, ad_show, ad_click; each event carries the format, placement (closed enum), ad unit, and error code if any.",
    done: "Fill rate and ad_show count per session can be computed by placement.",
  },
  {
    order: "4",
    effort: "Medium",
    title: "Ad revenue to both the MMP and the warehouse",
    why: "Without it, ARPU, LTV and ROAS are missing half of the revenue.",
    what: "From the Ad SDK's paid event: send to the MMP (ad revenue API) and send ad_paid to the warehouse with the unit-converted value, currency, precision, format and placement.",
    done: "The daily ad_paid total roughly matches the ad network's report.",
  },
  {
    order: "5",
    effort: "Small",
    title: "IAP events complete enough to deduplicate and reverse",
    why: "Refunds and duplicate events make revenue wrong if there is no key.",
    what: "paywall_show (entry point), paywall_click (plan), purchase_success / purchase_fail with transaction id, product id, price and currency; the verify result is an event in the same flow.",
    done: "No duplicate transaction ids in the warehouse; a refund can be subtracted from the right purchase.",
  },
  {
    order: "6",
    effort: "Small",
    title: "Error reporting for what fails silently",
    why: "A broken config parse, a failed verify and a consent error do not crash, so if they are not reported nobody knows.",
    what: "Events and non-fatals for Remote Config parsing, IAP verification and consent; include the config template version.",
    done: "Publishing a broken JSON in the test environment makes the alert arrive.",
  },
  {
    order: "7",
    effort: "Small",
    title: "Control group on Remote Config",
    why: "The minimum condition for A/B testing ad density or the paywall.",
    what: "Use a random percentile condition, a rollout or A/B testing to split groups in parallel; write the group into a user property.",
    done: "Retention and ARPU can be compared between the two groups over the same period.",
  },
];

export default function Instrumentation() {
  return (
    <>
      <PageHeader
        eyebrow="UA · action"
        title="Measurement plan"
        lead="When a link in the measurement chain breaks early, every number after it still comes out, just wrong. The steps below are ordered by dependency, so that when you build a new app you do them in the right order, and when you audit a running app you can find the earliest broken link."
      />

      <Section title="Dependency order">
        <Figure caption="Steps 3 and 4 go together; step 2 unlocks the whole branch of analysis by source">
          <Canvas
            className="mx-auto max-w-2xl"
            cols="1.6rem 1.6rem minmax(0, 1fr) 2.4rem minmax(0, 1fr)"
            gap={["0px", "0.8rem"]}
            edges={[
              { from: "S1", to: "S2", out: "b", in: "l", outAt: 13 },
              { from: "S1", to: "S3", out: "b", in: "l", outAt: 13 },
              { from: "S1", to: "S5", out: "b", in: "l", outAt: 13 },
              { from: "S3", to: "S4", out: "b", in: "l", outAt: 13 },
              { from: "S2", to: "R1", tone: "good", inAt: "align" },
              { from: "S3", to: "R3", tone: "good", inAt: "align" },
              { from: "S4", to: "R2", tone: "good", inAt: "align" },
              { from: "S5", to: "R2", tone: "good", inAt: "align" },
              { from: "S6", to: "R4", tone: "good", inAt: "align" },
              { from: "S7", to: "R5", tone: "good", inAt: "align" },
            ]}
          >
            <Node id="S1" col="1 / 4" row="1">
              1 · identity + user property
            </Node>
            <Node id="S2" col="2 / 4" row="2">
              2 · attribution
            </Node>
            <Node id="R1" tone="good" col="5" row="2" sub="network · campaign · creative">
              ROAS, LTV by
            </Node>
            <Node id="S3" col="2 / 4" row="3">
              3 · ad events
            </Node>
            <Node id="R3" tone="good" col="5" row="3">
              ad funnel, frequency
            </Node>
            <Node id="S4" col="3 / 4" row="4">
              4 · ad revenue
            </Node>
            <Node id="S5" col="2 / 4" row="5">
              5 · IAP events
            </Node>
            <Node id="R2" tone="good" className="dg-tall" col="5" row="4 / 6">
              total ARPU · eCPM · total ROAS
            </Node>
            <Node id="S6" col="1 / 4" row="6">
              6 · silent-error reports
            </Node>
            <Node id="R4" tone="good" col="5" row="6">
              remote failures caught
            </Node>
            <Node id="S7" col="1 / 4" row="7">
              7 · control group
            </Node>
            <Node id="R5" tone="good" col="5" row="7">
              real A/B tests
            </Node>
          </Canvas>
        </Figure>
      </Section>

      <Section title="Each step has a “done” condition">
        <div className="space-y-3">
          {STEPS.map((s) => (
            <Card key={s.order} className="gap-0 py-4">
              <CardContent className="px-5">
                <div className="mb-2 flex flex-wrap items-center gap-2.5">
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {s.order}
                  </Badge>
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                  <Badge variant="outline" className="text-[10px]">
                    {s.effort}
                  </Badge>
                </div>
                <p className="text-sm">{s.why}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.what}</p>
                <p className="mt-2.5 text-[12px] text-muted-foreground/80">
                  Done when: {s.done}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Which metrics each step unlocks">
        <Grid
          head={["Metric", "Needs steps"]}
          rows={[
            ["ARPU (IAP)", "1, 5"],
            ["ARPU (IAA), eCPM by placement", "1, 3, 4"],
            ["Total ARPU, cohort LTV with full revenue", "1, 4, 5"],
            ["ROAS by creative", "1, 2, 4, 5"],
            ["Impact of ad density on retention", "3, 7"],
            ["Diagnosing by metric combination", "2, 4, 5"],
          ]}
        />
        <Note tone="info" title="Does not touch CTR, IPM, CPI">
          <p>
            Those three metrics are reported by the ad network, outside the
            app. This plan only builds the revenue and behavior side, that is,
            the other half of ROAS.
          </p>
        </Note>
      </Section>

      <Section title="Use cases">
        <UseCase
          n="1"
          title="Audit a running app against the seven steps"
          situation={
            <p>
              A Flutter app already has screen events and purchase events, and
              already sends ad revenue to the MMP. The team wants to know why
              ROAS by creative cannot be computed.
            </p>
          }
          why={
            <p>
              Go step by step: step 1 is there; step 2 is missing because the
              attribution callback is not connected, so every event carries the
              default source; steps 3 and 4 are missing because ad revenue does
              not reach the warehouse; step 5 lacks the transaction id. Those
              three gaps fully explain the question, and the order of fixes
              follows the dependency diagram: step 2 first, then 3–4, then 5.
            </p>
          }
          lesson="Measurement is a chain of dependencies; find the earliest broken link and fix from there. Details of each mistake are on the Common mistakes page."
        />
      </Section>
    </>
  );
}
