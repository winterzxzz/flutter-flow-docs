import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Facts, Grid, Note, Stat } from "@/components/bits";

export const metadata = { title: "Remote Config" };

const SCHEMA = `{
  "admob_config": {
    "open_ad": {
      "id": "OPEN_AD",
      "ad_units": ["<unit-1>", "<unit-2>"],
      "is_ad_enabled": true,
      "ad_show_interval": 15000,
      "is_use_interstitial_ad": false,
      "is_use_native_ad": true,
      "interstitial_ad_units": ["<unit>"]
    },
    "interstitial_ad": {
      "id": "INTERSTITIAL",
      "ad_units": ["<unit>"],
      "is_ad_enabled": false,
      "ad_show_interval": 30000,
      "include_native_ad": true,
      "remain_time": 3,
      "native_ad_units": ["<unit>"]
    },
    "native_ad": [
      {
        "id": "NATIVE_FULL2",
        "ad_units": ["<unit>"],
        "is_ad_enabled": true,
        "ad_size": "full",
        "ad_refresh_time": 0,
        "is_auto_reload": true,
        "ctr_position": "bottom"
      }
    ],
    "banner_ad": [
      {
        "id": "BANNER_HOME",
        "ad_units": ["<unit>"],
        "is_ad_enabled": true,
        "ad_request_banner": "collapsible"
      }
    ],
    "reward_ad": {
      "id": "REWARD",
      "ad_units": ["<unit>"],
      "is_ad_enabled": true
    }
  }
}`;

export default function RemoteConfig() {
  return (
    <>
      <PageHeader
        eyebrow="06"
        title="Remote Config"
        lead="Toàn bộ hành vi quảng cáo điều khiển bằng đúng một khoá chứa một chuỗi JSON. Đổi trên console là đổi được ad unit, bật tắt format, giãn tần suất — không cần build lại."
      />

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Số khoá" value="1" sub="BASE_ADMOB_CONFIG" />
        <Stat label="Cache release" value="1 giờ" sub="minimumFetchInterval" />
        <Stat label="Cache debug" value="0s" sub="fetch mỗi lần" />
        <Stat label="Fetch timeout" value="15s" sub="giá trị mặc định" />
      </div>

      <Section title="Ba tầng giá trị">
        <Mermaid
          caption="Tầng dưới đỡ cho tầng trên khi thiếu"
          chart={`flowchart TB
  A["1 · Remote<br/>getString sau fetchAndActivate"] --> D{"có giá trị ?"}
  D -->|có| OUT["giá trị dùng thật"]
  D -->|không| B["2 · Bundled default<br/>IOS_CONFIG / ANDROID_CONFIG"]
  B --> E{"trường có trong JSON ?"}
  E -->|có| OUT
  E -->|không| C["3 · AdConfigConstants<br/>default từng trường"]
  C --> OUT`}
        />
      </Section>

      <Section title="Thời điểm nào đọc gì">
        <Mermaid
          caption="Điểm mấu chốt: preload native chạy trước khi fetch remote"
          chart={`sequenceDiagram
  autonumber
  participant M as main.dart
  participant F as FirebaseProvider
  participant K as FirebaseConstantManager
  participant S as Splash
  participant R as Firebase Remote Config
  M->>F: initFirebase()
  F->>F: setConfigSettings + setDefaults
  Note over F: chưa gọi mạng
  M->>K: initialize()
  K->>K: parse BUNDLED default
  Note over K: không đọc remote
  M->>M: setupPreloadNative()
  Note over M: dùng config tạm
  M->>S: runApp
  S->>S: CMP consent
  S->>R: fetchAndActivate()
  R-->>S: JSON
  S->>K: setAdConfigs(json)
  K->>K: ghi đè _adConfigs
  S->>S: SplashAdmobInitializer`}
        />
      </Section>

      <Section title="Hình dạng JSON">
        <Grid
          head={["Nhánh", "Kiểu", "Trường riêng"]}
          rows={[
            [
              <C key="1">open_ad</C>,
              "object",
              <>
                <C>ad_show_interval</C>, <C>is_use_interstitial_ad</C>,{" "}
                <C>is_use_native_ad</C>, <C>interstitial_ad_units</C>
              </>,
            ],
            [
              <C key="2">interstitial_ad</C>,
              "object",
              <>
                <C>ad_show_interval</C>, <C>include_native_ad</C>,{" "}
                <C>remain_time</C>, <C>native_ad_units</C>
              </>,
            ],
            [
              <C key="3">native_ad</C>,
              "mảng",
              <>
                <C>ad_size</C>, <C>ad_refresh_time</C>, <C>is_auto_reload</C>,{" "}
                <C>ctr_position</C>
              </>,
            ],
            [<C key="4">banner_ad</C>, "mảng", <C key="x">ad_request_banner</C>],
            [<C key="5">reward_ad</C>, "object · tuỳ chọn", "chỉ trường chung"],
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Trường chung mọi nhánh: <C>id</C>, <C>ad_units</C>, <C>is_ad_enabled</C>.
        </p>

        <pre className="mt-5 overflow-x-auto rounded-xl border bg-muted/40 p-4 font-mono text-[12px] leading-relaxed">
          {SCHEMA}
        </pre>
      </Section>

      <Section title="Parse rồi tra cứu thế nào">
        <Mermaid
          caption="Năm nhánh bị làm phẳng thành một danh sách; tra theo type hoặc theo id"
          chart={`flowchart LR
  J["JSON admob_config"] --> P["setAdConfigs()"]
  P --> F["List&lt;AdConfig&gt;<br/>đã làm phẳng"]
  F --> T1["theo type<br/>interstitialConfig<br/>openAdConfig<br/>rewardedConfig"]
  F --> T2["theo id<br/>getBannerAdConfig(id)<br/>getNativeAdConfig(id)"]`}
        />
        <Note tone="warn" title="id phải khớp chính xác">
          <p>
            Widget truyền <C>id</C> vào để tra config. Sai một ký tự thì
            <C>firstWhereOrNull</C> trả <C>null</C> và ad im lặng không hiện —
            không lỗi, không log.
          </p>
        </Note>
      </Section>

      <Section title="Khi fetch hỏng">
        <Grid
          head={["Tình huống", "Xử lý", "Event"]}
          rows={[
            ["Không có mạng", "return sớm, giữ bundled default", <C key="1">loading_finish · no_internet</C>],
            ["remoteConfig null", "log cảnh báo, giữ bundled default", <C key="2">loading_finish · server_error</C>],
            ["Exception khi fetch", "debugPrint rồi đi tiếp", <C key="3">loading_finish · server_error</C>],
            ["JSON sai schema", "catch trong setAdConfigs, giữ config cũ", "không có event nào"],
          ]}
        />
      </Section>

      <Section title="Cách đổi config an toàn">
        <Facts
          rows={[
            ["Bật tắt nhanh một format", <>đổi <C>is_ad_enabled</C></>],
            ["Giãn tần suất full ad", <>đổi <C>ad_show_interval</C></>],
            ["Đổi waterfall", <>sắp lại thứ tự mảng <C>ad_units</C> (chỉ có tác dụng với native và open ad)</>],
            ["Tắt reload native", <>đặt <C>ad_refresh_time</C> về 0</>],
            [
              "Hiệu lực sau bao lâu",
              "tối đa 1 giờ do minimumFetchInterval, và chỉ áp dụng từ lần mở app kế tiếp vì fetch nằm ở splash",
            ],
            [
              "Mỗi app một tiền tố",
              <>
                <C>FBASE_ROOT</C> đang là <C>&quot;BASE&quot;</C> kèm comment{" "}
                <C>TODO</C>. App fork phải đổi, nếu không hai app tranh cùng một
                khoá
              </>,
            ],
          ]}
        />
      </Section>
    </>
  );
}
