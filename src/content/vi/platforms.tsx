import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, Note, Ref } from "@/components/bits";

export const metadata = { title: "Flutter ↔ SwiftUI" };

export default function Platforms() {
  return (
    <>
      <PageHeader
        eyebrow="Đối chiếu"
        title="Flutter ↔ SwiftUI"
        lead="Mỗi khái niệm ở các trang trước gọi bằng package hay API nào trên từng nền tảng. Chỉ là bảng tra; cơ chế đọc ở trang khái niệm."
      />

      <Note tone="info" title="Phạm vi">
        <p>
          Cột Flutter là package trên pub.dev; cột SwiftUI là framework hay SDK
          native iOS. Phiên bản package ghi theo pub.dev ngày 2026-10-02 — kiểm
          lại trước khi dùng. Tên API trong bảng đã đối chiếu với tài liệu chính
          thức trừ chỗ ghi &ldquo;chưa kiểm chứng&rdquo;.
        </p>
      </Note>

      <Section title="Package và SDK">
        <Grid
          head={["Khái niệm", "Flutter", "SwiftUI / iOS"]}
          rows={[
            [
              "Quảng cáo",
              <C key="a">google_mobile_ads</C>,
              "Google Mobile Ads SDK (GoogleMobileAds)",
            ],
            [
              "Consent GDPR",
              <>
                UMP đi kèm <C>google_mobile_ads</C> (<C>ConsentInformation</C>)
              </>,
              "User Messaging Platform SDK (UserMessagingPlatform)",
            ],
            [
              "ATT",
              <>
                package cộng đồng, ví dụ <C>app_tracking_transparency</C>
              </>,
              <C key="b">AppTrackingTransparency</C>,
            ],
            [
              "Mua hàng trực tiếp",
              <C key="c">in_app_purchase</C>,
              "StoreKit 2",
            ],
            [
              "Mua hàng qua dịch vụ",
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
          head={["Khái niệm", "Flutter (google_mobile_ads)", "iOS (Google Mobile Ads SDK)"]}
          rows={[
            [
              "Consent mỗi lần mở",
              <C key="a">ConsentInformation.instance.requestConsentInfoUpdate</C>,
              "requestConsentInfoUpdate (UMP)",
            ],
            ["Được phép request", <C key="b">canRequestAds()</C>, "canRequestAds"],
            [
              "Paid event",
              <>
                <C>ad.onPaidEvent</C> — <C>valueMicros</C>, <C>precision</C>,{" "}
                <C>currencyCode</C>
              </>,
              <>
                <C>paidEventHandler</C> — <C>GADAdValue</C>, <C>value</C> là số
                thập phân
              </>,
            ],
            [
              "Ad toàn màn hình",
              "InterstitialAd, RewardedAd, AppOpenAd — load qua callback, show một lần",
              "tương ứng từng lớp ad; show một lần",
            ],
            [
              "Vào foreground (app open)",
              "theo dõi vòng đời app (ví dụ AppLifecycleListener)",
              <>
                <C>scenePhase</C> trong SwiftUI
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
          head={["Khái niệm", "Flutter (in_app_purchase)", "SwiftUI (StoreKit 2)"]}
          rows={[
            [
              "Lấy catalog",
              <C key="a">queryProductDetails(ids)</C>,
              <C key="b">Product.products(for:)</C>,
            ],
            [
              "Mua",
              <C key="c">buyNonConsumable / buyConsumable</C>,
              <C key="d">product.purchase()</C>,
            ],
            [
              "Kết quả",
              <>
                <C>purchaseStream</C>: <C>PurchaseStatus</C> purchased · pending ·
                error · canceled · restored
              </>,
              <>
                <C>PurchaseResult</C>: success · pending · userCancelled
              </>,
            ],
            [
              "Giao dịch ngoài nút mua",
              <C key="e">purchaseStream (nghe từ lúc mở app)</C>,
              <C key="f">Transaction.updates</C>,
            ],
            [
              "Báo hoàn tất",
              <C key="g">completePurchase</C>,
              <C key="h">transaction.finish()</C>,
            ],
            [
              "Quyền hiện có",
              <>
                <C>restorePurchases</C> rồi đọc stream; hoặc từ server
              </>,
              <C key="i">Transaction.currentEntitlements</C>,
            ],
            [
              "Restore",
              <C key="j">restorePurchases()</C>,
              <C key="k">AppStore.sync()</C>,
            ],
            [
              "Trạng thái subscription",
              "từ server (Play Developer API, App Store Server API) hoặc dịch vụ trung gian",
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

      <Section title="Remote Config và attribution">
        <Grid
          head={["Khái niệm", "Flutter", "iOS"]}
          rows={[
            [
              "Nạp và kích hoạt",
              <C key="a">fetchAndActivate()</C>,
              <C key="b">fetchAndActivate</C>,
            ],
            [
              "Cập nhật real-time",
              <C key="c">onConfigUpdated (Stream)</C>,
              <C key="d">addOnConfigUpdateListener</C>,
            ],
            [
              "Giới hạn fetch",
              <C key="e">RemoteConfigSettings(minimumFetchInterval, fetchTimeout)</C>,
              <C key="f">RemoteConfigSettings.minimumFetchInterval, fetchTimeout</C>,
            ],
            [
              "Attribution Adjust",
              <C key="g">config.attributionCallback · Adjust.getAttribution()</C>,
              "attribution callback qua delegate của Adjust SDK (chưa kiểm chứng tên API iOS)",
            ],
            [
              "Doanh thu ad Adjust",
              <C key="h">AdjustAdRevenue(&apos;admob_sdk&apos;)</C>,
              "AdjustAdRevenue với source AdMob (chưa kiểm chứng tên hằng iOS)",
            ],
            [
              "AppsFlyer",
              "callback conversion data",
              "callback conversion data (tên API chưa kiểm chứng)",
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

      <Section title="Khác biệt hay làm sai khi port">
        <Grid
          head={["Chỗ", "Flutter", "iOS native"]}
          rows={[
            ["Đơn vị doanh thu ad", "micros (chia 1 000 000)", "số thập phân, đã đúng đơn vị"],
            [
              "Giao dịch chưa hoàn tất",
              "phải gọi completePurchase; không gọi thì Android hoàn tiền sau 3 ngày, iOS giữ giao dịch trong hàng đợi chưa hoàn tất",
              "Transaction.updates phát lại một lần lúc mở app; phải finish()",
            ],
            [
              "ATT",
              "không có trong SDK chính thức của Google hay Flutter; cần package riêng",
              "framework hệ thống",
            ],
            [
              "Kiểm chữ ký giao dịch",
              "plugin không tự kết luận hợp lệ; gửi verificationData lên server",
              "StoreKit 2 tự kiểm và trả verified / unverified",
            ],
          ]}
        />
      </Section>
    </>
  );
}
