import { Link } from "@/components/locale";

import { Figure, States, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { UseCase } from "@/components/usecase";
import { C, Grid, Note, P, Ref } from "@/components/bits";

export const metadata = { title: "IAP · Subscription" };

export default function Subscription() {
  return (
    <>
      <PageHeader
        eyebrow="IAP · concepts"
        title="Subscription and entitlement"
        lead="A subscription is not a true/false flag. It is a sequence of states managed by the store, and the app only needs to answer one question: is the user allowed to use it right now."
      />

      <Section title="A sequence of states managed by the store">
        <Figure caption="States common to both stores">
          <States
            main={[
              { name: "Trial", enter: ["trial / intro price"], next: "converts to paid" },
              {
                name: "Active",
                tone: "key",
                enter: ["buy"],
                next: "auto-renew off",
                exits: [
                  { on: "renewal succeeds", to: "Active" },
                  { on: "renewal fails · with grace", to: "Grace" },
                  { on: "renewal fails · no grace", to: "BillingRetry" },
                  { on: "refund / revoke", to: "Revoked" },
                ],
              },
              { name: "Canceled", next: "period ends", exits: [{ on: "re-enabled", to: "Active" }] },
              { name: "Expired", exits: [{ on: "resubscribe", to: "Active" }] },
            ]}
            side={[
              {
                name: "Grace",
                exits: [
                  { on: "payment recovered", to: "Active" },
                  { on: "grace ends", to: "BillingRetry" },
                ],
              },
              {
                name: "BillingRetry",
                exits: [
                  { on: "payment recovered", to: "Active" },
                  { on: "retry period ends", to: "Expired" },
                ],
              },
              { name: "Revoked" },
            ]}
          />
        </Figure>
      </Section>

      <Section title="Entitled or not">
        <Grid
          head={["State", "App Store (StoreKit 2)", "Google Play", "Entitled?"]}
          rows={[
            ["Active", <C key="a">subscribed</C>, <C key="b">ACTIVE</C>, "yes"],
            [
              "Renewal turned off, period not over",
              <>still <C>subscribed</C>, renewal info has <C>willAutoRenew = false</C></>,
              <C key="c">CANCELED</C>,
              "yes, until the period ends",
            ],
            [
              "Grace period",
              <C key="d">inGracePeriod</C>,
              <C key="e">IN_GRACE_PERIOD</C>,
              "yes",
            ],
            [
              "Payment failed, retrying",
              <C key="f">inBillingRetryPeriod</C>,
              <>
                <C>ON_HOLD</C> (account hold)
              </>,
              "no",
            ],
            ["Paused", "none", <C key="g">PAUSED</C>, "no"],
            ["Expired", <C key="h">expired</C>, <C key="i">EXPIRED</C>, "no"],
            [
              "Refunded / revoked",
              <C key="j">revoked</C>,
              "EXPIRED (revoked, chargeback)",
              "no",
            ],
          ]}
        />
        <Note tone="info" title="Same name, different meaning">
          <p>
            On Apple, a subscription in billing retry that is <b>not</b> in a
            grace period has no access. On Google, grace period keeps access
            while account hold does not. Both sides share one idea: <b>grace =
            still entitled, retry after grace = access lost</b>.
          </p>
          <p>
            Apple states it explicitly: a user can have several statuses for the
            same subscription (for example one expired from their own purchase
            and one active through Family Sharing). The user is entitled if{" "}
            <b>any</b> status grants access.
          </p>
        </Note>
        <Ref href="https://developer.apple.com/documentation/storekit/product/subscriptioninfo/renewalstate">
          Apple · Product.SubscriptionInfo.RenewalState
        </Ref>
        <Ref href="https://developer.android.com/google/play/billing/lifecycle/subscriptions">
          Android · Subscription lifecycle
        </Ref>
      </Section>

      <Section title="Current access comes from the store; the cache is only for opening offline">
        <P>
          On StoreKit 2, <C>Transaction.currentEntitlements</C> returns the
          latest transaction for each product the user is currently entitled to:
          non-consumables, subscriptions in the <C>subscribed</C> or{" "}
          <C>inGracePeriod</C> state, and non-renewing subscriptions. Refunded
          or revoked products do not appear there. On Play, the app reads{" "}
          <C>queryPurchasesAsync</C> on the device, while the server-side source
          of truth is <C>purchases.subscriptionsv2.get</C> in the Play Developer
          API. The local cache stores the latest result along with the expiry
          time so the app is still correct when opened offline, and is refreshed
          when the network is available.
        </P>
        <Ref href="https://developer.apple.com/documentation/storekit/transaction/currententitlements">
          Apple · Transaction.currentEntitlements
        </Ref>
      </Section>

      <Section title="Restore adds access, it does not revoke">
        <P>
          With StoreKit 2, after reinstalling the app or moving to a new device,
          existing transactions are available from the first launch through{" "}
          <C>currentEntitlements</C>, so restore is not a routine sync step. The
          StoreKit documentation still advises providing a mechanism such as a
          Restore Purchases button for the rare case where a user suspects a
          transaction is missing; that button calls <C>AppStore.sync()</C>,
          which shows a sign-in dialog and so must only be called when the user
          taps it. On Play, the app syncs with{" "}
          <C>queryPurchasesAsync</C> at app launch and when it returns to the
          foreground; keeping one shared button for both platforms is still
          simpler. If a restore finds nothing, tell the user, but do not
          downgrade the current state.
        </P>
        <Ref href="https://developer.apple.com/documentation/storekit/appstore/sync()">
          Apple · AppStore.sync()
        </Ref>
      </Section>

      <Section title="Notifications from the store's server">
        <Grid
          head={["Event", "App Store Server Notifications v2", "Play RTDN"]}
          rows={[
            [
              "First purchase",
              <C key="a">SUBSCRIBED · INITIAL_BUY</C>,
              <C key="b">SUBSCRIPTION_PURCHASED</C>,
            ],
            ["Renewal", <C key="c">DID_RENEW</C>, <C key="d">SUBSCRIPTION_RENEWED</C>],
            [
              "Auto-renew turned off",
              <C key="e">DID_CHANGE_RENEWAL_STATUS · AUTO_RENEW_DISABLED</C>,
              <C key="f">SUBSCRIPTION_CANCELED</C>,
            ],
            [
              "Renewal failed",
              <C key="g">DID_FAIL_TO_RENEW (· GRACE_PERIOD)</C>,
              <C key="h">SUBSCRIPTION_IN_GRACE_PERIOD · SUBSCRIPTION_ON_HOLD</C>,
            ],
            [
              "Payment recovered",
              <C key="i">DID_RENEW · BILLING_RECOVERY</C>,
              <C key="j">SUBSCRIPTION_RECOVERED</C>,
            ],
            ["Expired", <C key="k">EXPIRED</C>, <C key="l">SUBSCRIPTION_EXPIRED</C>],
            ["Refund / revocation", <C key="m">REFUND</C>, <C key="n">SUBSCRIPTION_REVOKED</C>],
          ]}
        />
        <P>
          A refund is negative revenue; whether it can be deducted correctly
          depends on whether the purchase event carries a transaction id, see
          use case 3 in{" "}
          <Link href="/tracking" className="underline underline-offset-4">
            Tracking
          </Link>
          .
        </P>
        <Ref href="https://developer.apple.com/documentation/appstoreservernotifications/notificationtype">
          Apple · notificationType
        </Ref>
        <Ref href="https://developer.android.com/google/play/billing/lifecycle/subscriptions">
          Android · Subscription lifecycle (RTDN)
        </Ref>
      </Section>

      <Section title="Use cases">
        <UseCase
          n="1"
          title="A yearly plan with a 7-day trial"
          situation={
            <p>
              The user starts the trial on day 1. On day 5 they go into their
              store account settings and turn off auto-renew.
            </p>
          }
          flow={
            <Figure>
              <Tree
                root={{
                  when: "day 1",
                  label: "Trial",
                  kids: [
                    {
                      when: "day 5 · renewal off",
                      label: "TrialCanceled",
                      kids: [{ when: "end of day 7", label: "Expired" }],
                    },
                    { when: "day 8 · charge succeeds", label: "Active" },
                  ],
                }}
              />
            </Figure>
          }
          why={
            <p>
              From day 5 to day 7 the user <b>still has access</b>. An app that
              revokes access as soon as it sees renewal turned off is wrong;
              Google even states explicitly that access must not be removed while
              the user is still entitled to it. Conversely, counting a trial as
              revenue inflates the numbers: a trial only turns into money at the
              first charge.
            </p>
          }
          lesson="Access follows the current period; turning off renewal is a churn signal, not a revoke command."
        />
        <UseCase
          n="2"
          title="Card declined at renewal"
          situation={
            <p>
              A monthly plan comes due and the card has expired. One user is on
              iOS (Billing Grace Period enabled), one on Android.
            </p>
          }
          flow={
            <Figure>
              <Tree
                root={{
                  label: "renewal fails",
                  kids: [
                    {
                      label: "grace period",
                      sub: "still entitled",
                      kids: [
                        { when: "card updated", label: "active" },
                        {
                          when: "grace ends",
                          label: (
                            <>
                              iOS: billing retry
                              <br />
                              Android: account hold
                            </>
                          ),
                          sub: "access lost",
                          kids: [
                            { when: "card updated", label: "active" },
                            { when: "retry period ends", label: "expired" },
                          ],
                        },
                      ],
                    },
                  ],
                }}
              />
            </Figure>
          }
          why={
            <p>
              During grace, keep access and remind the user to update their
              payment method. After grace, lock the features but show a way to
              fix the payment instead of a paywall for a new purchase, because
              they are still a paying customer. Treating them as expired (making
              them buy again) easily leads to duplicate purchases.
            </p>
          }
          lesson="Map store states to three questions: is the user entitled, do they need a payment reminder, do they need the paywall."
        />
        <UseCase
          n="3"
          title="Paywall on a new device despite having paid"
          situation={
            <p>
              The user has a yearly plan, moves to a new iPhone and reinstalls
              the app. The first screen is the paywall; they have to find the
              restore button themselves to get their access back.
            </p>
          }
          why={
            <p>
              The app reads the entitlement only from the local cache, and the
              cache does not move with the device. With StoreKit 2, the
              transactions are already available on the first launch through{" "}
              <C>currentEntitlements</C>; the app only needs to read it at startup
              instead of waiting for the user to tap restore.
            </p>
          }
          lesson="The cache is a copy for running offline, not the source of truth. Test question: clear the cache and open the app; does the state correct itself?"
        />
        <UseCase
          n="4"
          title="Refund approved but the app stays unlocked"
          situation={
            <p>
              The user asks Apple to refund a yearly plan after 10 days and is
              approved. A month later they still use the paid features as normal.
            </p>
          }
          why={
            <p>
              The server has received the <C>REFUND</C> notification, the
              transaction has a{" "}
              <C>revocationDate</C> and has disappeared from{" "}
              <C>currentEntitlements</C>. But the app only checks access at
              purchase and at restore, and otherwise trusts the cache, so it never
              sees the change.
            </p>
          }
          lesson="Access can be taken away from outside the app, so the app must recheck access periodically, not only at the moments when it changes access itself."
        />
        <Ref href="https://developer.apple.com/documentation/storekit/transaction/revocationdate">
          Apple · Transaction.revocationDate
        </Ref>
      </Section>
    </>
  );
}
