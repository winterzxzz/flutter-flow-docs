import { PageHeader } from "@/components/page-header";
import { C, Src } from "@/components/bits";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Rủi ro" };

type Gap = {
  sev: "Cao" | "TB" | "Thấp";
  title: string;
  body: React.ReactNode;
  src: string;
};

const GAPS: Gap[] = [
  {
    sev: "Cao",
    title: "IAA không có event nào vào DataBuckets",
    body: (
      <>
        <C>BucketEvent</C> không có event ad nào, <C>EventGroup.ad</C> rỗng,{" "}
        <C>AdPlacement</C> 8 giá trị nhưng 0 lần dùng. Doanh thu ad chỉ đi
        Adjust. Không thể vẽ funnel quảng cáo từ dữ liệu hiện có.
      </>
    ),
    src: "bucket_event.dart · bucket_devtools_state.dart · ad_placement.dart",
  },
  {
    sev: "Cao",
    title: "Cache Remote Config ghi mà không bao giờ đọc",
    body: (
      <>
        <C>_cacheAdConfigs</C> ghi vào <C>KEY_ADMOB_CONFIGS</C> sau mỗi lần
        parse, nhưng dòng đọc lại trong <C>initialize()</C> đang bị comment nên{" "}
        <C>data</C> luôn null. Mọi lần mở app lạnh đều khởi động bằng bundled
        default.
      </>
    ),
    src: "firebase_config_manager.dart:26-31",
  },
  {
    sev: "TB",
    title: "Preload native chạy trước khi fetch Remote Config",
    body: (
      <>
        <C>setupPreloadNative</C> ở <C>main.dart:91</C> đứng trước splash, mà
        fetch lại nằm trong splash. Lượt preload đầu luôn dùng ad unit viết
        cứng.
      </>
    ),
    src: "main.dart:91 · splash_remote_config_loader.dart:74",
  },
  {
    sev: "TB",
    title: "JSON sai schema thì im lặng",
    body: (
      <>
        <C>setAdConfigs</C> nuốt mọi exception, chỉ <C>logE</C>. Sai schema trên
        console thì app giữ config cũ, không crash, không Crashlytics, không
        event — rất khó phát hiện từ xa.
      </>
    ),
    src: "firebase_config_manager.dart:73-75",
  },
  {
    sev: "TB",
    title: "iap_verify không nằm trong dòng event",
    body: (
      <>
        <C>verifyIAP</C> post thẳng bằng Dio nên không join được với{" "}
        <C>iap_purchase_success</C> theo <C>user_id</C>. Lỗi chỉ{" "}
        <C>debugPrint</C>, không retry, không báo Crashlytics.
      </>
    ),
    src: "bucket_tracking_utils.dart:372-415",
  },
  {
    sev: "TB",
    title: "lib_adjust rỗng ruột",
    body: (
      <>
        Mất cả <C>pubspec.yaml</C> lẫn <C>lib/</C>. Chưa gây vỡ vì không ai trỏ
        vào, nhưng thêm path dependency vào là fail resolve ngay.
      </>
    ),
    src: "lib/lib_adjust",
  },
  {
    sev: "Thấp",
    title: "Mảng ad_units của interstitial không tạo waterfall",
    body: (
      <>
        <C>InterstitialAdmob</C> giữ đúng một unit, và{" "}
        <C>SplashAdmobInitializer</C> chỉ lấy <C>adUnits.lastOrNull</C>. Thêm
        unit vào mảng cho interstitial là không có tác dụng.
      </>
    ),
    src: "interstitial_admob.dart:23 · splash_admob_initializer.dart:38",
  },
  {
    sev: "Thấp",
    title: "RemoteConfigUtils.TIME_OUT không được dùng",
    body: (
      <>
        Hằng số 3 giây là code chết; timeout thật là 15 giây từ tham số mặc
        định. Dễ đọc nhầm.
      </>
    ),
    src: "remote_config_utils.dart",
  },
  {
    sev: "Thấp",
    title: "Debug build không sinh dữ liệu thật",
    body: (
      <>
        <C>kDebugMode</C> chặn gửi event và ép mọi ad unit về id test. Kiểm
        chứng end-to-end phải làm trên release hoặc profile.
      </>
    ),
    src: "bucket_tracking_utils.dart:204-207",
  },
  {
    sev: "Thấp",
    title: "Gói weekly khai báo nhưng không load",
    body: (
      <>
        <C>PurchaseConstant</C> có 4 key nhưng <C>loadPackages()</C> chỉ truyền
        3. Gói weekly không bao giờ hiện trên paywall.
      </>
    ),
    src: "purchase_constant.dart:4 · premium_cubit.dart:50-54",
  },
];

export default function Gaps() {
  return (
    <>
      <PageHeader
        eyebrow="08"
        title="Khoảng trống và rủi ro"
        lead="Đọc ra từ source hiện tại. Chưa sửa gì — đây là ghi nhận để quyết định thứ tự vá."
      />

      <div className="space-y-3">
        {GAPS.map((g) => (
          <Card key={g.title} className="gap-0 py-4">
            <CardContent className="px-5">
              <div className="mb-1.5 flex items-center gap-2.5">
                <Badge
                  variant={g.sev === "Cao" ? "destructive" : "secondary"}
                  className="text-[10px]"
                >
                  {g.sev}
                </Badge>
                <h3 className="text-sm font-semibold">{g.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{g.body}</p>
              <Src>{g.src}</Src>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
