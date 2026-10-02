import { Link } from "@/components/locale";

import { Canvas, Figure, Lanes, Node, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, P, Ref } from "@/components/bits";
import { CodeTabs, UseCase } from "@/components/usecase";

export const metadata = { title: "IAP · Purchase flow" };

const link = "underline underline-offset-4";

export default function Iap() {
  return (
    <>
      <PageHeader
        eyebrow="IAP · concepts"
        title="Purchase flow"
        lead="From fetching the product list to the moment the user has the right to use the feature. The most important part is not the buy button but the entitlement, meaning the access right the store or server confirms, and who is allowed to change it."
      />

      <Section title="A single owner for the entitlement">
        <P>
          The UI does not call the store SDK directly. Every change to the
          access right goes through one place, and from there spreads to the
          local cache, the ad layer and analytics. Premium in this guide is only
          the name of a plan or of the &ldquo;no ads&rdquo; gate; what decides
          whether the user gets access is always the entitlement.
        </P>
        <Figure caption="The service layer is the only gateway to the SDK; the entitlement owner is the only place that changes state">
          <Canvas
            className="mx-auto max-w-xl"
            cols="repeat(2, minmax(0, 1fr))"
            gap={["1.25rem", "1.9rem"]}
            edges={[
              { from: "UI", to: "EN", tone: "main" },
              { from: "EN", to: "ADS" },
              { from: "EN", to: "CACHE" },
              { from: "EN", to: "SV", tone: "main" },
              { from: "SV", to: "SDK", tone: "main" },
              { from: "SV", to: "BE" },
              { from: "SDK", to: "ST", tone: "main" },
              { from: "BE", to: "ST" },
            ]}
          >
            <Node id="UI" className="dg-mid" col="1 / -1" sub="paywall · restore button">
              UI
            </Node>
            <Node id="EN" tone="key" className="dg-mid" col="1 / -1" sub="entitled? until when?">
              Entitlement owner
            </Node>
            <Node id="ADS" sub="off when entitled">
              Ad layer
            </Node>
            <Node id="CACHE" sub="still correct offline">
              Local cache
            </Node>
            <Node id="SV" className="dg-mid" col="1 / -1">
              Purchase service layer
            </Node>
            <Node id="SDK" sub="or a wrapper like RevenueCat">
              StoreKit 2 · Play Billing
            </Node>
            <Node id="BE" sub="verify · save transactions">
              Your backend
            </Node>
            <Node id="ST" className="dg-mid" col="1 / -1">
              Store
            </Node>
          </Canvas>
        </Figure>
      </Section>

      <Section title="Three product types">
        <Grid
          head={["Type", "Example", "After purchase"]}
          rows={[
            ["Consumable", "coins, uses", "granted then consumed; can be bought again"],
            ["Non-consumable", "lifetime unlock", "permanent access; can be restored on another device"],
            [
              "Subscription",
              "weekly, monthly, yearly",
              <>
                time-limited access, auto-renews.{" "}
                <Link href="/iap/subscription" className={link}>
                  See the states
                </Link>
              </>,
            ],
          ]}
        />
        <P>
          Apple also has subscriptions that do not auto-renew (non-renewing),
          where the app manages the duration itself. On StoreKit 2, consumables
          do not appear in{" "}
          <C>currentEntitlements</C>; to see consumable transactions that have
          not been finished, use the <C>unfinished</C> or <C>all</C> sequence.
        </P>
        <Ref href="https://developer.apple.com/documentation/storekit/transaction/currententitlements">
          Apple · Transaction.currentEntitlements
        </Ref>
      </Section>

      <Section title="Wrong product ids are silently dropped from the catalog">
        <P>
          The app has to know the product ids in advance, bundled in the app or
          fetched from a server or Remote Config. StoreKit 2{" "}
          <C>Product.products(for:)</C> drops invalid ids from the result
          instead of reporting an error, so the app should compare the number of
          products received with the number of ids sent and log the difference.
          Fetch the whole list in one request, and display the store&apos;s
          formatted price string instead of joining a number and a currency
          symbol yourself. The sandbox store may be slow or empty; mock data is
          only for building UI in debug builds and must be fully turned off in
          release builds.
        </P>
        <Ref href="https://developer.apple.com/documentation/storekit/product/products(for:)">
          Apple · Product.products(for:)
        </Ref>
      </Section>

      <Section title="A successful purchase is not the end">
        <P>
          After the store returns a successful result, the app still has three
          things to do, in this order: verify the transaction, grant the
          entitlement, then tell the store that delivery is complete. A
          &ldquo;pending&rdquo; result (Ask to Buy, deferred payment) is not an
          error and not yet a success either; the access right arrives later
          through the listener.
        </P>
        <Figure caption="Tell the store after granting the entitlement, not before">
          <Lanes
            numbered
            actors={[
              { id: "U", label: "User" },
              { id: "P", label: "Paywall" },
              { id: "E", label: "Entitlement" },
              { id: "S", label: "Store SDK" },
              { id: "B", label: "Backend" },
            ]}
            steps={[
              { from: "U", to: "P", text: "picks a plan" },
              { from: "P", to: "S", text: "purchase(product)" },
              { from: "S", to: "P", text: "success / cancel / pending", reply: true },
              { from: "P", to: "B", text: "signed transaction or purchase token" },
              { self: "B", text: "verify with store" },
              { from: "B", to: "E", text: "valid, expires at X", reply: true },
              { self: "E", text: "update entitlement" },
              { from: "E", to: "S", text: "finish / acknowledge" },
              { from: "E", to: "P", text: "unlock", reply: true },
            ]}
          />
        </Figure>
        <Grid
          head={["Result", "StoreKit 2", "Play Billing", "What the app does"]}
          rows={[
            ["Success", <C key="a">.success(verification)</C>, <C key="b">PURCHASED</C>, "verify, grant the entitlement, then finish / acknowledge"],
            ["Pending", <C key="c">.pending</C>, <C key="d">PENDING</C>, "do not grant; wait for the listener"],
            ["Cancelled", <C key="e">.userCancelled</C>, "user canceled error code", "show no error message"],
          ]}
        />
        <P>
          Google Play requires a transaction to be acknowledged within three
          days, otherwise it is automatically refunded and the entitlement is
          revoked; only grant the entitlement when the state is{" "}
          <C>PURCHASED</C>. On the App Store, call <C>finish()</C>{" "}
          after the content has been delivered or the service turned on. The
          Flutter plugin{" "}
          <C>in_app_purchase</C> wraps both into <C>completePurchase</C> and
          warns about the same three-day deadline on Android.
        </P>
        <Ref href="https://developer.android.com/google/play/billing/integrate">
          Android · Integrate Google Play Billing
        </Ref>
        <Ref href="https://developer.apple.com/documentation/storekit/product/purchaseresult">
          Apple · Product.PurchaseResult
        </Ref>
        <Ref href="https://developer.apple.com/documentation/storekit/transaction/finish()">
          Apple · Transaction.finish()
        </Ref>
        <Ref href="https://pub.dev/packages/in_app_purchase">pub.dev · in_app_purchase</Ref>
      </Section>

      <Section title="Transactions arrive from outside the buy button, so listen from app launch">
        <P>
          StoreKit 2 emits through <C>Transaction.updates</C> the transactions
          that happen outside the app or on another device: Ask to Buy, offer
          codes, purchases in the App Store. Unfinished transactions are emitted
          again once right after the app opens, so not listening from the start
          means missing them. On Play, Google recommends calling{" "}
          <C>queryPurchasesAsync</C> when the billing connection succeeds at app
          launch and when the app returns to the foreground, to catch
          transactions cut off by a network drop, made on another device, or
          that just moved from PENDING to PURCHASED.
        </P>
        <Ref href="https://developer.apple.com/documentation/storekit/transaction/updates">
          Apple · Transaction.updates
        </Ref>
      </Section>

      <Section title="The level of verification follows the value of what you sell">
        <P>
          StoreKit 2 checks the signature itself and returns{" "}
          <C>VerificationResult.verified</C>{" "}
          or <C>.unverified</C>. This is simple and works offline, but there is
          no server-side source of truth and fraud is hard to fight at the
          account level. Verifying on the server means sending the signed
          transaction (JWS) or the purchase token to your backend; Apple has the
          App Store Server Library, Google has the Play Developer API. This gives
          the most control and receives refunds and renewals through
          notifications, at the cost of running a backend. An intermediary
          service such as RevenueCat does the server part for you, at the cost
          of depending on a third party and its entitlement model. The Play
          Billing documentation advises verifying on the backend before granting
          the entitlement, and, for consumables, checking that the token has not
          been used so the entitlement is not granted twice.
        </P>
        <Ref href="https://developer.apple.com/documentation/storekit/verificationresult">
          Apple · VerificationResult
        </Ref>
      </Section>

      <Section title="Downgrade the entitlement only on real data">
        <P>
          A network or server error is not evidence that the user has lost
          access: if fetching the state fails, keep the current state and only
          log. When the app has just opened, before the store answers for the
          first time, only allow upgrades from the cache; downgrades must wait
          for real data. Restore is an operation that adds access, so a restore
          that finds nothing must not downgrade either.
        </P>
      </Section>

      <Section title="Paywall: a separate label for each entry point">
        <P>
          A paywall usually shows in a few places: after onboarding, when the
          user taps a paid feature, when the app is opened again. Each entry
          point should have its own label on the event so conversion can be
          compared between them. The plan list should be remotely controllable,
          because a plan that is declared but never passed to the screen can
          never be sold. Show trials and introductory prices exactly according
          to the eligibility the store returns; do not guess it. The minimum
          events are <C>paywall_show</C>{" "}
          with the entry point, <C>paywall_click</C> with the plan,{" "}
          <C>purchase_success</C>{" "}
          with the transaction id, and <C>purchase_fail</C>.
        </P>
      </Section>

      <Section title="Use cases">
        <UseCase
          n="1"
          title="Twice as many entitled users as transactions"
          situation={
            <p>
              The app sells a lifetime unlock. The number of entitled users in
              analytics is twice the number of transactions in the store. The
              difference comes from jailbroken or rooted devices running tools
              that fake the purchase response.
            </p>
          }
          flow={
            <Figure>
              <Tree
                root={{
                  label: "fake purchase result",
                  kids: [
                    {
                      tone: "ask",
                      label: "where does the app check?",
                      kids: [
                        { when: "only a success flag", tone: "bad", label: "unlocked · revenue lost" },
                        { when: "StoreKit 2 signature", tone: "good", label: "unverified · rejected" },
                        {
                          when: "server calls store API",
                          tone: "good",
                          label: "no transaction found · rejected",
                        },
                      ],
                    },
                  ],
                }}
              />
            </Figure>
          }
          why={
            <>
              <p>
                The app trusts only a success flag, the easiest thing to fake.
                Checking the StoreKit 2 JWS signature blocks most cases; a server
                calling the store&apos;s API is the strongest source of truth and
                also receives refunds later on.
              </p>
              <CodeTabs
                flutter={`for (final p in purchases) {
  if (p.status == PurchaseStatus.purchased) {
    final ok = await backend.verify(p.verificationData);
    if (ok) grant(p.productID);
  }
  if (p.pendingCompletePurchase) {
    await InAppPurchase.instance.completePurchase(p);
  }
}`}
                swift={`switch try await product.purchase() {
case .success(.verified(let tx)):
  grant(tx.productID)
  await tx.finish()
case .success(.unverified):
  break // do not grant
case .pending, .userCancelled:
  break
@unknown default: break
}`}
              />
            </>
          }
          lesson="Periodically compare the number of entitled users with the number of real transactions; the difference directly measures the verification you are missing."
        />
        <UseCase
          n="2"
          title="The parent approves Ask to Buy, the child still has no access"
          situation={
            <p>
              A child account in a family group taps buy and the result is
              &ldquo;pending&rdquo;. Two hours later the parent approves, while
              the app is running in the background. That evening the family
              contacts support: they have been charged but still see the
              paywall.
            </p>
          }
          why={
            <p>
              The transaction arrives through <C>Transaction.updates</C>, not
              through the buy button, and the app only listens in the paywall
              screen. On Play, the equivalent case is PENDING turning into
              PURCHASED while the app is not running, which is only caught by{" "}
              <C>queryPurchasesAsync</C> when the app returns to the foreground.
            </p>
          }
          lesson="Every channel through which the state can change must be listened to for the whole app lifecycle, not only on the screen that caused the change."
        />
      </Section>
    </>
  );
}
