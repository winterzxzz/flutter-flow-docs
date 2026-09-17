import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Facts, Grid, Note, Stat } from "@/components/bits";

export default function Home() {
  return (
    <>
      <PageHeader
        eyebrow="Tổng quan"
        title="Base và lib"
        lead="Hai repo Flutter nối với nhau bằng path dependency. Base giữ màn hình và toàn bộ logic mua hàng; lib giữ vòng đời quảng cáo và lớp Firebase."
      />

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Base" value="145" sub="file dart" />
        <Stat label="Lib" value="5" sub="module" />
        <Stat label="Path dep" value="3" sub="base → lib" />
        <Stat label="Module chết" value="2" sub="lib_iap, lib_adjust" />
      </div>

      <Section title="Ai nối vào ai">
        <Mermaid
          caption="Ba path dependency, khai báo ở base/pubspec.yaml:80-85"
          chart={`flowchart LR
  subgraph B["repo base"]
    APP["base_project_flutter<br/>app Flutter"]
  end
  subgraph L["repo lib"]
    FB["lib_firebase"]
    AD["lib_admob_plugin"]
    UT["lib_utils"]
    IAPX["lib_iap"]
    ADJ["lib_adjust"]
  end
  APP -->|path| FB
  APP -->|path| AD
  APP -->|path| UT
  APP -.->|không dùng| IAPX
  APP -.->|không dùng| ADJ
  style IAPX stroke-dasharray: 4 4
  style ADJ stroke-dasharray: 4 4`}
        />
      </Section>

      <Section title="Hai trục chính nằm ở đâu">
        <Mermaid
          caption="IAP gần như trọn trong base; IAA gần như trọn trong lib"
          chart={`flowchart TB
  subgraph base["repo base"]
    direction TB
    UI["UI: paywall, splash, home"]
    IAP["IAP<br/>PurchaseService + PremiumCubit"]
    CFG["Lớp cấu hình ads<br/>key_ads, AppOpenAdSetup"]
    TRK["Tracking<br/>BucketTrackingUtils"]
  end
  subgraph lib["repo lib"]
    direction TB
    ADM["lib_admob_plugin<br/>vòng đời mọi format ad"]
    FBS["lib_firebase<br/>Remote Config, FCM, FIAM"]
    UTL["lib_utils"]
  end
  UI --> IAP
  UI --> CFG
  CFG --> ADM
  UI --> TRK
  ADM --> FBS
  IAP -->|tắt ads khi premium| ADM`}
        />
      </Section>

      <Section title="Mức phụ thuộc thực tế">
        <Grid
          head={["Import từ lib", "Số lần", "Dùng để"]}
          rows={[
            [<C key="a">lib_admob_plugin</C>, "18", "mọi format ad"],
            [<C key="b">lib_utils</C>, "14", "AppNavigator, log, widget chung"],
            [<C key="c">admob_config_manager</C>, "5", "cấu hình ad từ Remote Config"],
            [<C key="d">lib_firebase</C>, "4", "Firebase, Crashlytics, FCM, FIAM"],
            [<C key="e">key_ads_provider</C>, "2", "interface khai báo ad unit"],
            [<C key="f">admob_provider</C>, "1", "provider gốc SDK ads"],
          ]}
        />
      </Section>

      <Section title="Hai module lib không được dùng">
        <Facts
          rows={[
            [
              "lib_iap",
              <>
                Không có trong pubspec của base. Thế hệ trước RevenueCat, dựa
                trên <C>in_app_purchase</C> thuần.
              </>,
            ],
            [
              "lib_adjust",
              <>
                Rỗng ruột: chỉ còn <C>pubspec.lock</C>, mất cả{" "}
                <C>pubspec.yaml</C> lẫn <C>lib/</C>. Base dùng thẳng{" "}
                <C>adjust_sdk</C> từ pub.dev.
              </>,
            ],
          ]}
        />
        <Note tone="warn" title="Bẫy">
          <p>
            Thêm <C>lib_adjust</C> vào pubspec là fail resolve ngay, vì thư mục
            đó không còn là một package hợp lệ.
          </p>
        </Note>
      </Section>
    </>
  );
}
