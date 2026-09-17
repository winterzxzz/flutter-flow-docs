import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, Note } from "@/components/bits";

export const metadata = { title: "IAA" };

export default function Iaa() {
  return (
    <>
      <PageHeader
        eyebrow="04"
        title="Luồng IAA"
        lead="Ngược với IAP: base chỉ giữ ad unit id và lớp đặt chỗ, còn toàn bộ vòng đời quảng cáo nằm trong lib."
      />

      <Section title="Ai giữ phần nào">
        <Mermaid
          caption="Base khai báo, lib thực thi"
          chart={`flowchart TB
  subgraph b["repo base"]
    K["key_ads.dart<br/>id theo platform"]
    S["AppOpenAdSetup<br/>đổ config vào lib"]
    W["banner_ad_base · native_widget<br/>widget đặt chỗ"]
  end
  subgraph l["repo lib · lib_admob_plugin"]
    ACM["AdmobConfigManager<br/>state toàn cục"]
    BAN["BannerAdmob"]
    NAT["NativeAdmob + preload"]
    INT["InterstitialAdmob + Timer"]
    OPN["AppOpenAdManager"]
    REW["RewardedAdmob"]
    CMP["CMP consent"]
  end
  K --> ACM
  S --> ACM
  W --> BAN
  W --> NAT
  ACM --> INT
  ACM --> OPN
  ACM --> BAN
  ACM --> NAT
  ACM --> REW`}
        />
      </Section>

      <Section title="Năm format, năm cơ chế khác nhau">
        <Grid
          head={["Format", "Waterfall nhiều unit", "Tự load lại", "Cổng thời gian"]}
          rows={[
            ["Open ad", "có", "sau mỗi lần show", <>
              <C>ad_show_interval</C> + hết hạn 4 giờ
            </>],
            ["Interstitial", "không · 1 unit", <><C>setAutoReload(true)</C></>, <>
              <C>InterstitialAdmobTimer</C> toàn cục
            </>],
            ["Native", "có", <>timer <C>ad_refresh_time</C></>, "không"],
            ["Banner", "không · 1 unit", "AdMob tự refresh phía server", "không"],
            ["Rewarded", "không", "không", "không"],
          ]}
        />
        <Note tone="info" title="Xem chi tiết từng cơ chế">
          <p>
            Trang <b>AdMob chi tiết</b> mô tả đầy đủ: số lần thử lại, timeout,
            điều kiện hết hạn, và thứ tự waterfall.
          </p>
        </Note>
      </Section>

      <Section title="Cổng premium">
        <Mermaid
          caption="Mọi lệnh load và show đều hỏi cờ này trước"
          chart={`flowchart LR
  A["startLoad / showAd"] --> B{"AdmobConfigManager<br/>.isUserPremium ?"}
  B -->|true| C["dừng · gọi onAdClosed"]
  B -->|false| D{"có mạng ?"}
  D -->|không| C
  D -->|có| E["tiếp tục load / show"]`}
        />
      </Section>

      <Section title="Doanh thu ad đi đâu">
        <Mermaid
          caption="Dừng ở Adjust — không có nhánh nào quay về DataBuckets"
          chart={`flowchart LR
  A["AdMob SDK trả tiền"] --> B["onPaidEvent<br/>valueMicros, precision, currency"]
  B --> C["AdjustTrackerUtils"]
  C --> D["AdjustAdRevenue('admob_sdk')"]
  D --> E["Adjust · quy về campaign"]
  B -.->|không có| F["DataBuckets"]
  style F stroke-dasharray: 4 4`}
        />
        <Grid
          head={["Format", "File trong lib", "Dòng"]}
          rows={[
            ["Banner", <C key="1">src/banner/banner_admob.dart</C>, "196"],
            ["Interstitial", <C key="2">src/interstitial/interstitial_admob.dart</C>, "299"],
            ["Native", <C key="3">src/native/native_admob.dart</C>, "133"],
            ["Native preload", <C key="4">src/native/preload/native_widget_bloc.dart</C>, "178"],
            ["Open ad", <C key="5">src/open_ad/app_open_ad_manager.dart</C>, "310, 448"],
            ["Rewarded", <C key="6">src/rewarded/rewarded_admob.dart</C>, "184"],
          ]}
        />
      </Section>
    </>
  );
}
