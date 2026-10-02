import { Link } from "@/components/locale";

import { PageHeader, Section } from "@/components/page-header";
import { Grid, P, Ref } from "@/components/bits";
import { Assumed } from "@/components/usecase";

export const metadata = { title: "Deep dive · AdMob vs MMP gap" };

const link = "underline underline-offset-4";

export default function DeepRevenueGap() {
  return (
    <>
      <PageHeader
        eyebrow="Deep dive · Q&A"
        title="Why does ad revenue on AdMob differ from the figure on the MMP?"
        lead="The two dashboards describe the same revenue stream but count it at two different times, in two time zones, with two ways of converting currency. A gap is normal; what you need to know is which direction each source of the gap pushes, so you do not go fixing an integration that was never broken."
      />

      <Section title="An estimate today, a finalized figure at month end">
        <P>
          Revenue in the AdMob report is an estimate. Google only finalizes the
          figure at the end of the month, when invalid clicks and impressions are
          deducted and their money is refunded to advertisers. The MMP receives
          the paid event the moment the impression happens, while the deduction
          made at finalization does not travel that path. So when you compare the MMP figure with the finalized AdMob figure, the MMP is almost always
          slightly higher, and that difference is invalid traffic that has been
          deducted, not an integration bug.
        </P>
        <Ref href="https://support.google.com/admob/answer/6147072?hl=en">
          AdMob Help · Estimated vs finalized earnings
        </Ref>
      </Section>

      <Section title="Two time zones, two ideas of “one day”">
        <P>
          Every AdMob report uses the time zone of the publisher, and the US
          daylight saving changeover days leave one hour in the report empty or
          holding two hours of data. Changing the account time zone only takes
          effect from the moment of the change, not retroactively. Adjust
          records in UTC. An app whose AdMob account is set to Vietnam time will
          see seven hours of revenue from each &ldquo;day&rdquo; land on two
          different days on the two dashboards; compared by day they differ,
          compared by week they nearly match.
        </P>
        <Ref href="https://support.google.com/admob/answer/2751663?hl=en">
          AdMob Help · Overview of your reports (time zone)
        </Ref>
        <Ref href="https://help.adjust.com/en/article/data-discrepancies">
          Adjust Help · Data discrepancies (Adjust timezone: UTC)
        </Ref>
      </Section>

      <Section title="Exchange rates, precision, test ads, old app versions">
        <P>
          The paid event carries its value in the original currency; Adjust
          keeps the original currency code and converts to the reporting
          currency. If the exchange rate used for conversion differs from the
          one AdMob uses, the two sides differ even though they count the same
          impression; the size of the gap depends on the rate of each day, so
          there is no fixed figure.
        </P>
        <P>
          Each paid event has a precision field: UNKNOWN, ESTIMATED,
          PUBLISHER_PROVIDED or PRECISE. An ESTIMATED value is an estimate; for
          bidding sources, a test impression returns a value of 0 and a
          precision of UNKNOWN. Counting test ads in the warehouse pulls the
          average down; forgetting to filter test devices out of the comparison
          creates a discrepancy of your own making.
        </P>
        <P>
          Adjust also notes an easily forgotten source of discrepancy: right
          after the revenue plugin is integrated, some users are still running
          an old app version without the plugin, so the MMP is lower than
          AdMob until most users have updated. If the same revenue goes through
          both the SDK and a server-to-server connection, Adjust will count it
          twice.
        </P>
        <Ref href="https://developers.google.com/admob/android/impression-level-ad-revenue">
          AdMob · Impression-level ad revenue (precision, test impressions)
        </Ref>
        <Ref href="https://help.adjust.com/en/article/ad-revenue-sdk">
          Adjust Help · Mediation platform revenue SDK connections
        </Ref>
        <Ref href="https://help.adjust.com/en/article/ad-revenue-reporting">
          Adjust Help · Ad revenue reporting (currency fields)
        </Ref>
      </Section>

      <Section title="A worked example: one month, five sources of discrepancy">
        <P>
          In September, the paid events sent to the MMP add up to 10,000 USD
          <Assumed />. Compared with the finalized AdMob figure:
        </P>
        <Grid
          head={["Source of discrepancy", "AdMob − MMP (USD)", "Note"]}
          rows={[
            ["Invalid traffic deducted at finalization", "− 300", "only AdMob deducts"],
            ["The first 7 hours of October in Vietnam time fall in September in UTC", "± 80", "depends on revenue at the start and end of the month"],
            ["Different conversion exchange rates", "± 50", "either direction"],
            ["2% of users still on the old version without the plugin", "+ 200", "the MMP does not see this part"],
            ["Test devices not filtered out", "≈ 0", "values close to 0"],
          ]}
        />
        <P>
          All in all, a discrepancy of a few percent is the sum of sources that
          are entirely normal. What is worth worrying about is a discrepancy
          that suddenly grows or flips direction after a release: that is
          usually a sign that the paid event is being sent twice, sent in the
          wrong unit (forgetting to divide micros on Flutter), or no longer sent
          for one format.
        </P>
      </Section>

      <Section title="Reconcile by week and by trend">
        <P>
          Use the finalized AdMob figure as the source of truth for revenue, and
          use the MMP figure to allocate that revenue across campaigns. Compare
          the two sides by week or by month, in the same time zone if possible,
          and track the discrepancy ratio over time rather than the absolute
          figure. The check question: is the discrepancy ratio this week
          within the range of previous weeks? If so, nothing needs to be done.
        </P>
        <p className="mt-3 text-sm text-muted-foreground">
          How to send the paid event to both the MMP and the analytics warehouse:
          see{" "}
          <Link href="/tracking" className={link}>
            Tracking
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
