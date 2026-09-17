import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, Note } from "@/components/bits";

export const metadata = { title: "IAP" };

export default function Iap() {
  return (
    <>
      <PageHeader
        eyebrow="03"
        title="Luồng IAP"
        lead="RevenueCat là SDK chính. in_app_purchase chỉ dùng cho tầng verify và lấy receipt. lib_iap không tham gia."
      />

      <Section title="Các tầng">
        <Mermaid
          caption="UI không bao giờ gọi thẳng purchases_flutter"
          chart={`flowchart TB
  UI["UI<br/>premium_page · trial_page"] --> CU["PremiumCubit<br/>chủ sở hữu trạng thái premium"]
  CU --> SV["PurchaseService<br/>cổng duy nhất ra SDK"]
  SV --> RC["RevenueCat<br/>purchases_flutter"]
  SV --> LC["PurchaseLocalDataSource<br/>cache local"]
  VF["BillingClientManager<br/>in_app_purchase android/storekit"] --> ST["Store<br/>Play Billing · StoreKit"]
  CU --> VF`}
        />
      </Section>

      <Section title="Một lần mua">
        <Mermaid
          caption="Mua thành công lan ra ba hướng cùng lúc"
          chart={`sequenceDiagram
  autonumber
  participant U as Người dùng
  participant P as premium_page
  participant C as PremiumCubit
  participant S as PurchaseService
  participant R as RevenueCat
  U->>P: bấm chọn gói
  P->>C: purchase(package)
  C->>S: purchase(package)
  S->>R: purchasePackage
  R-->>S: customerInfo
  S-->>C: Either của PurchaseError hoặc bool
  C->>C: _statusVerified = true
  C->>C: _applyPremium(true)
  C-->>P: true
  Note over C: lan ra ba hướng
  C->>C: AppConfigCubit lưu cờ
  C->>C: AdmobConfigManager.setUserIsPremium
  P->>P: sendIAPPurchaseSuccess`}
        />
      </Section>

      <Section title="Verify receipt đi đường riêng">
        <Mermaid
          caption="Không đi qua _sendEvent, nên không có event iap_verify trong stream"
          chart={`flowchart LR
  A["verifyIAP(iapInfo)"] --> B["SKReceiptManager<br/>lấy receipt iOS"]
  B --> C["IAPVerifyParam<br/>+ install_day, retention_day"]
  C --> D["Dio.post<br/>IAP_VERIFY_URL"]
  D --> E{"server quyết định"}
  E -->|is_send_databucket| F["DataBuckets"]
  E -->|is_send_facebook| G["Facebook"]`}
        />
        <Note tone="info" title="Server mới là bên fan-out">
          <p>
            App chỉ gửi hai cờ <C>is_send_databucket</C> và{" "}
            <C>is_send_facebook</C>; việc bắn tiếp sang đâu do server quyết.
          </p>
        </Note>
      </Section>

      <Section title="Bốn quy tắc an toàn đã cài sẵn">
        <Grid
          head={["Quy tắc", "Nghĩa là"]}
          rows={[
            [
              "Không hạ cấp khi lỗi",
              <>
                <C>fetchPremiumStatus</C> fail thì giữ nguyên trạng thái, chỉ
                log
              </>,
            ],
            [
              "_statusVerified",
              "trước khi store xác nhận lần đầu, listener chỉ được nâng cấp",
            ],
            [
              "Restore thủ công",
              "chỉ chạy khi user bấm; không tìm thấy entitlement cũng không hạ cấp",
            ],
            [
              "Mock ở debug",
              "kDebugMode + danh sách rỗng → chèn 3 gói giả để dựng UI",
            ],
          ]}
        />
      </Section>

      <Section title="Gói nào được load">
        <Mermaid
          chart={`flowchart LR
  PC["PurchaseConstant<br/>4 key"] --> W["KEY_IAP_WEEKLY"]
  PC --> M["KEY_IAP_MONTHLY"]
  PC --> Y["KEY_IAP_YEARLY"]
  PC --> L["KEY_IAP_LIFETIME"]
  M --> LP["loadPackages()"]
  Y --> LP
  L --> LP
  W -.->|không truyền vào| LP
  style W stroke-dasharray: 4 4`}
          caption="Gói weekly khai báo nhưng không bao giờ hiện trên paywall"
        />
      </Section>
    </>
  );
}
