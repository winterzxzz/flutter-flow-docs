import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, Note, Ref } from "@/components/bits";

export const metadata = { title: "Flutter ↔ SwiftUI" };

export default function Platforms() {
  return (
    <>
      <PageHeader
        eyebrow="Comparison"
        title="Flutter ↔ SwiftUI"
        lead="Which package or API each concept from the previous pages is called by on each platform. This is only a lookup table; for the mechanism, read the concept pages."
      />

      <Note tone="info" title="Scope">
        <p>
          The Flutter column lists packages on pub.dev; the SwiftUI column lists
          native iOS frameworks or SDKs. Package versions follow pub.dev as of
          2026-10-02 — check again before use. API names in the tables have been
          checked against the official documentation except where marked
          &ldquo;unverified&rdquo;.
        </p>
      </Note>

      <Section title="Packages and SDKs">
        <Grid
          head={["Concept", "Flutter", "SwiftUI / iOS"]}
          rows={[
            [
              "Ads",
              <C key="a">google_mobile_ads</C>,
              "Google Mobile Ads SDK (GoogleMobileAds)",
            ],
            [
              "Consent GDPR",
              <>
                UMP bundled with <C>google_mobile_ads</C> (<C>ConsentInformation</C>)
              </>,
              "User Messaging Platform SDK (UserMessagingPlatform)",
            ],
            [
              "ATT",
              <>
                community package, e.g. <C>app_tracking_transparency</C>
              </>,
              <C key="b">AppTrackingTransparency</C>,
            ],
            [
              "Direct purchases",
              <C key="c">in_app_purchase</C>,
              "StoreKit 2",
            ],
            [
              "Purchases via a service",
              <C key="d">purchases_flutter</C>,
              "RevenueCat Purchases SDK",
            ],
            [
              "Remote Config",
              <C key="e">firebase_remote_config</C>,
              "FirebaseRemoteConfig",
            ],
            [
              "Analytics",
              <C key="f">firebase_analytics</C>,
              "FirebaseAnalytics",
            ],
            [
              "Attribution",
              <>
                <C>adjust_sdk</C> · <C>appsflyer_sdk</C>
              </>,
              "Adjust SDK · AppsFlyer SDK",
            ],
          ]}
        />
        <Ref href="https://pub.dev/packages/google_mobile_ads">pub.dev · google_mobile_ads</Ref>
        <Ref href="https://pub.dev/packages/in_app_purchase">pub.dev · in_app_purchase</Ref>
        <Ref href="https://pub.dev/packages/firebase_remote_config">pub.dev · firebase_remote_config</Ref>
      </Section>

      <Section title="IAA">
        <Grid
          head={["Concept", "Flutter (google_mobile_ads)", "iOS (Google Mobile Ads SDK)"]}
          rows={[
            [
              "Consent on every launch",
              <C key="a">ConsentInformation.instance.requestConsentInfoUpdate</C>,
              "requestConsentInfoUpdate (UMP)",
            ],
            ["Allowed to request", <C key="b">canRequestAds()</C>, "canRequestAds"],
            [
              "Paid event",
              <>
                <C>ad.onPaidEvent</C> — <C>valueMicros</C>, <C>precision</C>,{" "}
                <C>currencyCode</C>
              </>,
              <>
                <C>paidEventHandler</C> — <C>GADAdValue</C>, <C>value</C> is a decimal
                number
              </>,
            ],
            [
              "Full-screen ad",
              "InterstitialAd, RewardedAd, AppOpenAd — load via callback, show once",
              "the matching class for each ad; show once",
            ],
            [
              "Entering the foreground (app open)",
              "watch the app lifecycle (e.g. AppLifecycleListener)",
              <>
                <C>scenePhase</C> in SwiftUI
              </>,
            ],
          ]}
        />
        <Ref href="https://developers.google.com/admob/flutter/privacy">AdMob Flutter · UMP</Ref>
        <Ref href="https://developers.google.com/admob/ios/impression-level-ad-revenue">
          AdMob iOS · Impression-level ad revenue
        </Ref>
      </Section>

      <Section title="IAP">
        <Grid
          head={["Concept", "Flutter (in_app_purchase)", "SwiftUI (StoreKit 2)"]}
          rows={[
            [
              "Fetch catalog",
              <C key="a">queryProductDetails(ids)</C>,
              <C key="b">Product.products(for:)</C>,
            ],
            [
              "Purchase",
              <C key="c">buyNonConsumable / buyConsumable</C>,
              <C key="d">product.purchase()</C>,
            ],
            [
              "Result",
              <>
                <C>purchaseStream</C>: <C>PurchaseStatus</C> purchased · pending ·
                error · canceled · restored
              </>,
              <>
                <C>PurchaseResult</C>: success · pending · userCancelled
              </>,
            ],
            [
              "Transactions outside the buy button",
              <C key="e">purchaseStream (listen from app launch)</C>,
              <C key="f">Transaction.updates</C>,
            ],
            [
              "Report completion",
              <C key="g">completePurchase</C>,
              <C key="h">transaction.finish()</C>,
            ],
            [
              "Current entitlements",
              <>
                <C>restorePurchases</C> then read the stream; or from the server
              </>,
              <C key="i">Transaction.currentEntitlements</C>,
            ],
            [
              "Restore",
              <C key="j">restorePurchases()</C>,
              <C key="k">AppStore.sync()</C>,
            ],
            [
              "Subscription status",
              "from the server (Play Developer API, App Store Server API) or an intermediary service",
              <C key="l">Product.SubscriptionInfo.status → RenewalState</C>,
            ],
            [
              "Verify",
              <C key="m">verificationData → backend</C>,
              <>
                <C>VerificationResult</C>, <C>jwsRepresentation</C> → backend
              </>,
            ],
          ]}
        />
        <Ref href="https://pub.dev/documentation/in_app_purchase/latest/in_app_purchase/InAppPurchase-class.html">
          pub.dev · InAppPurchase API
        </Ref>
        <Ref href="https://pub.dev/documentation/in_app_purchase_platform_interface/latest/in_app_purchase_platform_interface/PurchaseStatus.html">
          pub.dev · PurchaseStatus
        </Ref>
      </Section>

      <Section title="Remote Config and attribution">
        <Grid
          head={["Concept", "Flutter", "iOS"]}
          rows={[
            [
              "Fetch and activate",
              <C key="a">fetchAndActivate()</C>,
              <C key="b">fetchAndActivate</C>,
            ],
            [
              "Real-time updates",
              <C key="c">onConfigUpdated (Stream)</C>,
              <C key="d">addOnConfigUpdateListener</C>,
            ],
            [
              "Fetch limits",
              <C key="e">RemoteConfigSettings(minimumFetchInterval, fetchTimeout)</C>,
              <C key="f">RemoteConfigSettings.minimumFetchInterval, fetchTimeout</C>,
            ],
            [
              "Adjust attribution",
              <C key="g">config.attributionCallback · Adjust.getAttribution()</C>,
              "attribution callback via the Adjust SDK delegate (iOS API name unverified)",
            ],
            [
              "Adjust ad revenue",
              <C key="h">AdjustAdRevenue(&apos;admob_sdk&apos;)</C>,
              "AdjustAdRevenue with source AdMob (iOS constant name unverified)",
            ],
            [
              "AppsFlyer",
              "conversion data callback",
              "conversion data callback (API name unverified)",
            ],
          ]}
        />
        <Ref href="https://firebase.google.com/docs/reference/swift/firebaseremoteconfig/api/reference/Classes/RemoteConfigSettings">
          Firebase · RemoteConfigSettings (Swift)
        </Ref>
        <Ref href="https://dev.adjust.com/en/sdk/flutter/features/attribution">
          Adjust · Flutter attribution
        </Ref>
      </Section>

      <Section title="Differences that often go wrong when porting">
        <Grid
          head={["Area", "Flutter", "iOS native"]}
          rows={[
            ["Ad revenue unit", "micros (divide by 1,000,000)", "decimal number, already in the right unit"],
            [
              "Unfinished transactions",
              "must call completePurchase; if it is not called, Android refunds after 3 days and iOS keeps the transaction in the unfinished queue",
              "Transaction.updates emits it again once at app launch; must finish()",
            ],
            [
              "ATT",
              "not in the official Google or Flutter SDKs; needs a separate package",
              "system framework",
            ],
            [
              "Transaction signature check",
              "the plugin does not decide validity itself; send verificationData to the server",
              "StoreKit 2 checks it itself and returns verified / unverified",
            ],
          ]}
        />
      </Section>
    </>
  );
}
