import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Facts, Grid, Note, Stat } from "@/components/bits";

export const metadata = { title: "AdMob chi tiết" };

export default function Admob() {
  return (
    <>
      <PageHeader
        eyebrow="05"
        title="AdMob chi tiết"
        lead="Mỗi format có luật load, thử lại và làm mới riêng. Đây là chỗ hay gây hiểu nhầm nhất khi chỉnh config."
      />

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Interstitial retry" value="3" sub="cùng một unit" />
        <Stat label="Timeout full ad" value="10s" sub="15s khi qua FullAdUtils" />
        <Stat label="Open ad hết hạn" value="4 giờ" sub="tính từ lúc load xong" />
        <Stat label="Native reload" value="config" sub="ad_refresh_time" />
      </div>

      <Section title="Vòng đời chung">
        <Mermaid
          caption="Mọi format đều đi qua bốn trạng thái này"
          chart={`stateDiagram-v2
  [*] --> Idle
  Idle --> Loading: startLoad()
  Loading --> Ready: onAdLoaded
  Loading --> Failed: onAdFailedToLoad
  Failed --> Loading: còn unit / còn lượt thử
  Failed --> Idle: hết unit
  Ready --> Showing: showAd()
  Showing --> Idle: onAdDismissed
  Showing --> Idle: onAdFailedToShow
  Loading --> Idle: timeout`}
        />
      </Section>

      <Section title="Interstitial — cổng thời gian toàn cục">
        <Mermaid
          caption="InterstitialAdmobTimer là singleton dùng chung cho toàn app"
          chart={`flowchart TB
  A["showFullAd(listener)"] --> B{"online và<br/>không premium ?"}
  B -->|không| Z["isCloseAds(false)"]
  B -->|có| C{"ignoreTimer<br/>hoặc readyShow() ?"}
  C -->|không| Z
  C -->|có| D{"ad đã sẵn ?"}
  D -->|có| E["show ngay"]
  D -->|chưa| F["load rồi show<br/>trong timeout"]
  E --> G["startCountingTimer()<br/>_startTime = now"]
  F --> G`}
        />

        <Facts
          rows={[
            [
              "readyShow()",
              <>
                <C>_startTime == 0</C> hoặc <C>now - _startTime ≥ _intervalTime</C>
              </>,
            ],
            [
              "_intervalTime",
              <>
                lấy từ <C>interstitial_ad.ad_show_interval</C>, mặc định 30000 ms
              </>,
            ],
            [
              "Reset đồng hồ",
              <>
                <C>start()</C> gọi sau mỗi lần show. <C>setSkipTime(true)</C> làm{" "}
                <C>start()</C> reset về 0 thay vì ghi mốc, tức là lần sau show
                được ngay
              </>,
            ],
            [
              "Thử lại",
              <>
                <C>_maxFailedLoadAttempts = 3</C>, thử lại <b>cùng một unit</b>,
                không có delay giữa các lần
              </>,
            ],
            [
              "Timeout",
              <>
                <C>_timeOut = 10</C> giây, đếm bằng <C>Timer.periodic</C> mỗi
                giây. <C>FullAdUtils</C> ghi đè thành 15 giây
              </>,
            ],
            [
              "Hiển thị ngẫu nhiên",
              <>
                <C>showAdRandom(n)</C> chỉ show khi <C>Random().nextInt(n) == 0</C>
                , tức xác suất 1/n
              </>,
            ],
          ]}
        />

        <Note tone="good" title="Tự nạp lại ngay sau khi đóng">
          <p>
            <C>FullAdUtils.initInterstitial</C> gọi cứng{" "}
            <C>setAutoReload(true)</C>. Khi quảng cáo vừa đóng{" "}
            (<C>onAdDismissedFullScreenContent</C>), một lệnh load mới chạy ngay
            nền. Nhờ vậy lần hiện kế tiếp gần như không phải chờ. Đây là lý do
            đồng hồ giãn cách mới là thứ quyết định nhịp, không phải thời gian
            load.
          </p>
        </Note>

        <Note tone="warn" title="Interstitial không có waterfall">
          <p>
            Mỗi <C>InterstitialAdmob</C> giữ đúng một <C>adUnit</C>. Mảng{" "}
            <C>ad_units</C> nhiều phần tử trong JSON <b>không</b> tạo waterfall
            cho format này — <C>SplashAdmobInitializer</C> chỉ lấy{" "}
            <C>adUnits.lastOrNull</C>.
          </p>
        </Note>
      </Section>

      <Section title="Native — waterfall thật">
        <Mermaid
          caption="Thất bại thì nhảy sang unit kế tiếp trong mảng"
          chart={`flowchart TB
  A["loadAd()"] --> B["NativeAd(adUnits[i])"]
  B --> C{"kết quả"}
  C -->|onAdLoaded| D["i = 0<br/>hiện ad"]
  C -->|onAdFailedToLoad| E["i++"]
  E --> F{"i &lt; adUnits.length ?"}
  F -->|còn| B
  F -->|hết| G["i = 0<br/>onLoadFail · ẩn shimmer"]`}
        />
        <Facts
          rows={[
            [
              "Thứ tự unit",
              <>
                <C>reversedKeyAds = true</C> thì mảng bị đảo ngược trước khi
                chạy — dùng để test thứ tự waterfall mà không đổi config
              </>,
            ],
            [
              "Làm mới",
              <>
                bloc preload đặt <C>Timer(state.adRefreshTime)</C> sau khi ad có
                impression. <C>ad_refresh_time ≤ 0</C> là tắt hẳn tính năng này
              </>,
            ],
            [
              "Chống callback cũ",
              "mỗi lần load tăng số phiên; callback của phiên cũ bị bỏ qua, ad thừa bị dispose để tránh leak",
            ],
            [
              "Shimmer",
              <>
                <C>ShimmerUtils</C> dựng placeholder trong lúc load; load fail
                thì shimmer bị gỡ
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="Open ad — hai cổng cùng lúc">
        <Mermaid
          caption="Phải qua cả kiểm tra còn hạn lẫn kiểm tra giãn cách"
          chart={`flowchart TB
  A["App vào foreground<br/>AppStateEventNotifier"] --> B{"ignoreShowOpenAd ?"}
  B -->|true| Z["bỏ qua"]
  B -->|false| C["showAdIfAvailable()"]
  C --> D{"_isShowingAd ?"}
  D -->|true| Z
  D --> DI{"interstitial<br/>đang hiện ?"}
  DI -->|true| Z
  DI -->|false| E{"isAdAvailable()"}
  E --> F["_isAdValid()<br/>ad != null và chưa quá 4 giờ"]
  E --> G["_isReadyShowAd()<br/>now - lastShow ≥ timeBetween2Ad"]
  F --> H{"cả hai đúng ?"}
  G --> H
  H -->|có| I["show open ad"]
  H -->|không| Z
  I --> J["resetTimer()<br/>lastShow = now"]`}
        />
        <Facts
          rows={[
            [
              "maxCacheDuration",
              <>
                <C>Duration(hours: 4)</C> — ad load xong mà để quá 4 giờ thì coi
                như hỏng, phải load lại
              </>,
            ],
            [
              "timeBetween2Ad",
              <>
                lấy từ <C>open_ad.ad_show_interval</C>, mặc định 60000 ms trong
                lib
              </>,
            ],
            [
              "is_use_interstitial_ad",
              <>
                bật thì open ad được thay bằng interstitial, lấy unit từ{" "}
                <C>interstitial_ad_units</C>
              </>,
            ],
            [
              "is_use_native_ad",
              "bật thì dùng native full thay cho open ad",
            ],
            ["Waterfall", <>có, duyệt <C>adUnits[i]</C> giống native</>],
            [
              "Bị interstitial chặn",
              <>
                <C>showOpenAdIfAvailable</C> thoát sớm khi một interstitial đang
                hiện. Đây là cổng toàn cục, tách biệt với cờ{" "}
                <C>_isShowingAd</C> của chính open ad
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="Banner">
        <Facts
          rows={[
            [
              "Kiểu",
              <>
                anchored adaptive — chiều cao tính theo bề ngang máy qua{" "}
                <C>getCurrentOrientationAnchoredAdaptiveBannerAdSize</C>
              </>,
            ],
            ["Waterfall", "không · đúng một unit"],
            [
              "Thử lại",
              <>
                có — đếm bằng <C>_numNativeLoadAttempts</C> trên cùng một unit,
                không chuyển sang unit khác
              </>,
            ],
            [
              "Làm mới",
              "do AdMob làm phía server theo thiết lập trên console, code không có timer",
            ],
            [
              "Xoay màn hình",
              <>
                có <C>OrientationBuilder</C>, nhưng nhánh dispose và load lại
                đang bị comment
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="Rewarded">
        <Facts
          rows={[
            [
              "Waterfall",
              <>
                có — <C>RewardedAdmob</C> nhận <C>List&lt;String&gt; adUnits</C>{" "}
                và duyệt <C>adUnits[_adUnitCount]</C>, tăng chỉ số khi load hỏng
              </>,
            ],
            ["Tự load lại", "không — phải gọi lại thủ công sau khi dùng"],
            ["Cổng thời gian", <>không chịu <C>InterstitialAdmobTimer</C></>],
            [
              "Nguồn unit",
              <>
                <C>reward_ad.ad_units</C> trong Remote Config, là nhánh{" "}
                <b>tuỳ chọn</b> — thiếu nhánh này thì không có rewarded config
                nào được tạo
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="Giá trị nào thắng khi có nhiều mặc định">
        <Mermaid
          caption="Bốn nơi cùng khai báo giãn cách; chỉ nơi cuối cùng ghi là có hiệu lực"
          chart={`flowchart TB
  A["Remote Config<br/>open_ad.ad_show_interval"] --> B["AppOpenAdSetup<br/>configAdmob(timeBetween2Ad: …)"]
  C["AdmobConstant.TIME_BETWEEN_OPENAD<br/>40000 — chỉ khi config null"] -.-> B
  B --> D["AdmobConfigManager<br/>tham số mặc định 60000"]
  D --> E["AppOpenAdManager.setTimeBetween2Ad"]
  F["AppOpenAdManager.init(openAdConfig)<br/>timeBetween2Ad = config.adShowInterval"] --> G["GIÁ TRỊ CUỐI CÙNG"]
  E -.->|bị ghi đè ngay sau đó| G`}
        />
        <Note tone="warn" title="Thứ tự ghi quyết định, không phải thứ tự khai báo">
          <p>
            <C>AppOpenAdSetup.initialize</C> gọi <C>configAdmob(...)</C> trước,
            rồi <b>ngay sau đó</b> gọi <C>AppOpenAdManager.init(openAdConfig!)</C>
            , và hàm này gán lại <C>timeBetween2Ad = openAdConfig.adShowInterval</C>
            . Vì vậy giá trị Remote Config luôn thắng, còn{" "}
            <C>AdmobConstant.TIME_BETWEEN_OPENAD</C> chỉ có tác dụng ở nhánh
            fallback của lần gọi đầu — vốn bị ghi đè.
          </p>
          <p>
            Bốn con số cùng mang nghĩa &ldquo;giãn cách open ad&rdquo;:{" "}
            <C>60000</C> (tham số mặc định của lib), <C>30000</C> (
            <C>AdConfigConstants.openAdShowInterval</C>, dùng khi JSON thiếu
            trường), <C>40000</C> (<C>AdmobConstant</C> của base), và giá trị
            thật trong Remote Config. Đừng suy ra hành vi từ ba con số đầu.
          </p>
        </Note>
      </Section>

      <Section title="Ad unit khi chạy debug">
        <Note tone="info" title="Debug luôn dùng id test của Google">
          <p>
            <C>kDebugMode</C> thì mọi format đổi sang{" "}
            <C>KeyAdsProvider.*Test()</C>. Vì vậy chạy debug không bao giờ đo
            được doanh thu thật, và cũng không làm bẩn số liệu AdMob.
          </p>
        </Note>
        <Grid
          head={["Nơi đặt", "Hằng số"]}
          rows={[
            [
              <C key="a">AdConfigConstants</C>,
              <>
                <C>adUnitId</C> · <C>isAdEnabled=true</C> ·{" "}
                <C>adShowInterval=30000</C> · <C>openAdShowInterval=30000</C> ·{" "}
                <C>remainTime=3</C> · <C>adRefreshTime=0</C>
              </>,
            ],
            [
              <C key="b">AdmobConstant</C>,
              <>
                base · <C>TIME_BETWEEN_OPENAD=40000</C> ·{" "}
                <C>TIME_BETWEEN_FULLAD=25000</C>
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="CMP — xin đồng ý trước khi fetch">
        <Mermaid
          caption="CMP chạy xong mới tới Remote Config. Hai event này đi Firebase Analytics, không nằm trong 12 event DataBuckets"
          chart={`flowchart LR
  A["Splash _handleCMP"] --> B["CmpHelper.initialize()"]
  B --> C{"FormError ?"}
  C -->|có| D["cmp_error → Firebase Analytics"]
  C -->|không| E["cmp_success → Firebase Analytics"]
  D --> F["fetch Remote Config"]
  E --> F
  F --> G["setupAdmob"]`}
        />
      </Section>
    </>
  );
}
