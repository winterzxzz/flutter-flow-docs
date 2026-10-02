import { PageHeader, Section } from "@/components/page-header";
import { P } from "@/components/bits";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Common mistakes" };

type Lesson = {
  area: "Tracking" | "IAA" | "IAP" | "Config";
  sev: "High" | "Medium" | "Low";
  title: string;
  symptom: string;
  cause: string;
  lesson: string;
  fix: string;
  check: string;
};

const LESSONS: Lesson[] = [
  {
    area: "Tracking",
    sev: "High",
    title: "Attribution never reaches the app",
    symptom:
      "The MMP dashboard splits installs correctly by campaign, but in the analytics warehouse every event carries the source “Unattributed”; splitting revenue by campaign shows exactly one row.",
    cause:
      "The attribution callback is not assigned before the SDK is initialized, and nobody calls the function that writes the install source into a user property.",
    lesson:
      "An integration is only done when the data travels all the way to where it is analysed; reading the code at each end of the wire does not prove that.",
    fix: "Assign the callback before init, write the five install-source fields as user properties, keep organic separate.",
    check: "Install the release build through a test tracker link; the next event must carry the right network. Repeat with an organic install.",
  },
  {
    area: "Tracking",
    sev: "High",
    title: "No ad events at all in the analytics warehouse",
    symptom:
      "ARPU, LTV and ROAS in the analytics warehouse contain only the IAP part. An app that lives on ads looks like it is losing money; the ad funnel cannot be drawn, and how spacing affects revenue cannot be measured.",
    cause:
      "Ad revenue is sent only to the MMP. The ad event group is declared but empty; the placement list exists but nobody uses it.",
    lesson:
      "Each revenue stream needs to be present everywhere decisions are made; a missing source does not make the number disappear, it makes it wrong in a plausible way.",
    fix: "Add ad_request, ad_load_success/fail, ad_show, ad_click, ad_paid with format and placement.",
    check: "In a release session, each impression has exactly one ad_paid whose value has already been divided from micros.",
  },
  {
    area: "Tracking",
    sev: "High",
    title: "Counting active days turned into counting opens per day",
    symptom:
      "Someone who opens the app three days in a row, once a day, has active day = 0; someone who opens it five times in one day has active day = 4. The “engaged users” segment is the exact opposite of reality.",
    cause:
      "The counter only increments when this open is on the same day as the previous one, and does not increment when a new day starts.",
    lesson:
      "A self-written metric needs to be tested with time scenarios, not only by reading the condition; if the SDK already computes it, use the SDK's.",
    fix: "Increment only when the calendar day (in a fixed time zone) of this open differs from the previous one, or drop the self-written field and use the SDK's days-since-install.",
    check: "Test three scenarios: two opens on the same day, two consecutive days, several days apart.",
  },
  {
    area: "Config",
    sev: "High",
    title: "Config cache written but never read",
    symptom:
      "The first ad of each session still uses the old ad unit and spacing, even though the console was changed long ago.",
    cause:
      "The parsed config is saved after every fetch, but the line that reads it back at startup is commented out, so every cold start runs on the in-app default.",
    lesson:
      "A storage mechanism is only worth something if someone reads from it; test the read path, not only the write path.",
    fix: "At startup, read the previous session's cache if there is one, and only then fetch; the in-app default is only for the very first launch.",
    check: "Change a value on the console, open the app once, kill it completely, reopen it offline: the new value must take effect.",
  },
  {
    area: "IAP",
    sev: "Medium",
    title: "Purchase event without a transaction id",
    symptom:
      "Refunds cannot be deducted from the right purchase; a purchase event sent twice because of a network retry is counted twice; revenue from several countries is added up as raw numbers.",
    cause: "The purchase payload has the plan name, price and currency but no transaction id; the price is in the local currency, not converted.",
    lesson: "Every event that carries money needs a unique key from the source that produced it.",
    fix: "Add transaction id and product id; add a value converted to one standard currency, or take revenue from the server.",
    check: "Count purchase events with a duplicate transaction id in the analytics warehouse; it must be 0.",
  },
  {
    area: "IAP",
    sev: "Medium",
    title: "Transaction verification runs outside the event stream",
    symptom: "Verification fails en masse and nobody knows; verification results cannot be joined with purchase events by user id.",
    cause: "The verify call goes straight to the server over a separate HTTP request; errors are only printed to the console, with no retry and no report to the crash reporter.",
    lesson: "If a step decides money, its result must sit in the same data stream as the money.",
    fix: "The verify result becomes an event in the same stream; errors get a bounded retry and are reported as non-fatal.",
    check: "The share of purchase_success events with a matching verify_result.",
  },
  {
    area: "Tracking",
    sev: "Medium",
    title: "A field is dropped when updating immutable state",
    symptom: "Four install-source fields are updated; the fifth is always empty.",
    cause: "The update function takes the parameter but does not pass it into the object copy call. The bug lay dormant until attribution was wired up.",
    lesson: "A bug in code that has never run with real data shows up right when you finish fixing a different bug.",
    fix: "Pass every parameter into the copy; add a test that compares each field before and after the update.",
    check: "Turn on the unused-parameter warning in the linter; add a round-trip test for the user property model.",
  },
  {
    area: "Config",
    sev: "Medium",
    title: "Ad preload runs before the config arrives",
    symptom: "Changing the ad unit on the console does not affect the first ad of the session.",
    cause: "The native ad is preloaded before the splash screen, while the config fetch happens inside the splash.",
    lesson: "Whatever runs before the source of truth runs on default values, whether or not the code reads the config.",
    fix: "Preload waits until the config takes effect, from the cache or from a fetch with a timeout.",
    check: "Log the ad unit actually used for the first request of the session.",
  },
  {
    area: "Config",
    sev: "Medium",
    title: "JSON that breaks the schema, and nobody notices",
    symptom: "One extra comma on the console sends every user back to the in-app default; no crash, no event.",
    cause: "The parse error is caught and only logged on the device.",
    lesson: "An error that is caught but reported nowhere is equivalent to a swallowed error.",
    fix: "Parse errors send an event and a non-fatal with the template version; validate the schema before publishing.",
    check: "Publish broken JSON to the test environment and see whether the alert arrives.",
  },
  {
    area: "Config",
    sev: "Medium",
    title: "One value declared in four places",
    symptom: "Three different spacing numbers in the code lead readers to wrong conclusions about the real behaviour.",
    cause: "The app open spacing exists as a constant in the app, a parser default, a default parameter of the ads library, and in Remote Config; the value that takes effect is the one written last.",
    lesson: "One source of truth per parameter; many defaults are many ways to be wrong.",
    fix: "Keep one source; log the effective value at initialization.",
    check: "Change the value on the console and look at the logged effective value.",
  },
  {
    area: "IAP",
    sev: "Low",
    title: "A plan declared but never sold",
    symptom: "The weekly plan's figures are 0 and are read as nobody buying it.",
    cause: "The product id list has four plans but the paywall screen only receives three.",
    lesson: "A 0 can mean “nobody bought” or “nobody saw”; tell the two apart before drawing a conclusion.",
    fix: "The plan list shown on the paywall comes from one source (Remote Config) and is logged when the paywall opens.",
    check: "Log the number of products the store returns, the number of ids requested, and the number of plans actually displayed.",
  },
  {
    area: "IAA",
    sev: "Low",
    title: "An ad unit array does not make a waterfall for every format",
    symptom: "Adding a backup unit for interstitials on the console does not change the fill rate.",
    cause: "The config allows an array of several units for every format, but the interstitial keeps only one unit and takes the last element.",
    lesson: "Whatever the config schema promises, the code must do exactly that; a schema broader than what the code can do is a trap for whoever operates it.",
    fix: "For a format without a waterfall, the schema accepts only one unit; or add a real waterfall.",
    check: "Make the first unit fail on purpose in the test environment and see which unit the next request uses.",
  },
  {
    area: "IAA",
    sev: "Low",
    title: "Retrying immediately without waiting",
    symptom: "Match rate on the console is worse than reality; the number of requests is twice the number of times an ad is needed.",
    cause: "When a load fails it retries the same unit immediately, three times, with no delay; a no-fill produces three back-to-back requests that all fail.",
    lesson: "Retrying only rescues transient errors; with recurring errors it only inflates the denominator.",
    fix: "Retry with backoff, or move to the next unit, or load again at a later natural point.",
    check: "Count ad_request per ad_show.",
  },
  {
    area: "Tracking",
    sev: "Low",
    title: "Testing on a debug build and concluding the integration is broken",
    symptom: "No events reach the analytics warehouse and there is no real ad revenue during QA.",
    cause: "Debug mode blocks event sending and forces ad units to test ids — by design, but easy to forget.",
    lesson: "Know what the environment is blocking before reading test results.",
    fix: "Verify end to end on a release or profile build with a test device; debug is only for viewing events in the app.",
    check: "Keep a separate QA checklist for the release build before every release.",
  },
];

const CHECKLIST: [string, string[]][] = [
  [
    "Before release",
    [
      "An install through a test tracker link shows the right network on in-app events",
      "Each impression has one ad_paid, with the value in the right unit",
      "Test purchase in sandbox: the purchase event has a transaction id, access unlocks immediately, ads turn off immediately",
      "Turn off the network and open the app: entitlement still correct, no screen stuck because of an ad",
      "The in-app default is the latest version and conservative",
    ],
  ],
  [
    "After every Remote Config change",
    [
      "Log the effective value on a real device",
      "No new parse-error events",
      "Have a control group if you want to draw conclusions about metrics",
    ],
  ],
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="text-sm text-foreground/80">
      <span className="font-medium text-foreground">{label}: </span>
      {children}
    </p>
  );
}

export default function Lessons() {
  return (
    <>
      <PageHeader
        eyebrow="Lessons"
        title="Common mistakes and checklist"
        lead="Almost none of the mistakes below crash: the app keeps running, the dashboard still shows numbers, the numbers are just wrong. That is why they survived several releases of a real Flutter project with IAA, IAP and UA. Each entry starts from the symptom you will see, and only then gets to the cause."
      />

      <P>
        The entries describe what was read from that project&apos;s source at
        one point in time, not the current state of any codebase. There are no
        class names or file paths, because the value lies in the kind of
        mistake, not in where it is.
      </P>

      <Section title="Lessons, sorted by severity">
        <div className="space-y-3">
          {LESSONS.map((l) => (
            <Card key={l.title} className="gap-0 py-4">
              <CardContent className="space-y-2 px-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge
                    variant={l.sev === "High" ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {l.sev}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {l.area}
                  </Badge>
                  <h3 className="text-sm font-semibold">{l.title}</h3>
                </div>
                <Row label="Symptom">{l.symptom}</Row>
                <Row label="Cause">{l.cause}</Row>
                <div className="rounded-md border-l-4 border-l-emerald-400/70 bg-muted/40 px-3 py-2 text-sm">
                  <span className="font-semibold">Lesson: </span>
                  <span className="text-foreground/80">{l.lesson}</span>
                </div>
                <Row label="Fix">{l.fix}</Row>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground/80">Check: </span>
                  {l.check}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Checklist">
        <div className="grid gap-3 sm:grid-cols-2">
          {CHECKLIST.map(([title, items]) => (
            <Card key={title} className="gap-0 py-4">
              <CardContent className="px-5">
                <h3 className="mb-2 text-sm font-semibold">{title}</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/80">
                  {items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
