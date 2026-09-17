import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, Note } from "@/components/bits";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Kế hoạch đo" };

type Step = {
  order: string;
  effort: string;
  title: string;
  why: string;
  what: React.ReactNode;
  where: string;
};

const STEPS: Step[] = [
  {
    order: "1",
    effort: "Nhỏ",
    title: "Đưa install_day và retention_day vào UserProperties",
    why: "Mở khoá toàn bộ phân tích cohort và retention mà không cần join ngoài.",
    what: (
      <>
        Hai giá trị này đã được tính sẵn trong <C>verifyIAP</C>. Chuyển phần
        tính ra ngoài rồi đẩy vào <C>updateUserPropertiesEvent</C> để mọi event
        đều mang theo.
      </>
    ),
    where: "bucket_tracking_utils.dart · UserProperties",
  },
  {
    order: "2",
    effort: "Vừa",
    title: "Thêm nhóm event quảng cáo",
    why: "Đây là lỗ hổng lớn nhất: app sống bằng IAA nhưng không có event IAA nào.",
    what: (
      <>
        Thêm vào <C>BucketEvent</C>: <C>ad_request</C>, <C>ad_load_success</C>,{" "}
        <C>ad_load_fail</C>, <C>ad_show</C>, <C>ad_click</C>, <C>ad_paid</C>.
        Điền <C>EventGroup.ad</C> đang rỗng, và dùng <C>AdPlacement</C> vốn đã
        khai báo 8 giá trị nhưng chưa ai gọi.
      </>
    ),
    where: "bucket_event.dart · ad_placement.dart · bucket_devtools_state.dart",
  },
  {
    order: "3",
    effort: "Vừa",
    title: "Bắc cầu onPaidEvent về BucketTrackingUtils",
    why: "Không có bước này thì ARPU, LTV, ROAS đều thiếu một nửa doanh thu.",
    what: (
      <>
        Mọi format ad đã gắn <C>onPaidEvent</C> và đẩy sang Adjust. Thêm một
        listener song song bắn <C>ad_paid</C> kèm <C>value_micros</C>,{" "}
        <C>currency</C>, <C>precision</C>, <C>ad_format</C>, <C>placement</C>.
      </>
    ),
    where: "lib · adjust_tracker_utils.dart và 6 chỗ gắn onPaidEvent",
  },
  {
    order: "4",
    effort: "Nhỏ",
    title: "Đưa iap_verify vào dòng event",
    why: "Để nối được lần verify với lần mua trên cùng user_id, và thấy tỉ lệ verify hỏng.",
    what: (
      <>
        <C>verifyIAP</C> đang <C>dio.post</C> thẳng. Gọi thêm <C>_sendEvent</C>{" "}
        với kết quả, và báo lỗi lên Crashlytics thay vì chỉ <C>debugPrint</C>.
      </>
    ),
    where: "bucket_tracking_utils.dart:372-415",
  },
  {
    order: "5",
    effort: "Nhỏ",
    title: "Báo lỗi parse Remote Config",
    why: "JSON sai schema hiện im lặng hoàn toàn, có thể tắt nhầm quảng cáo hàng loạt mà không ai biết.",
    what: (
      <>
        <C>setAdConfigs</C> đang nuốt exception. Thêm event{" "}
        <C>remote_config_parse_fail</C> và ghi Crashlytics.
      </>
    ),
    where: "firebase_config_manager.dart:73-75",
  },
  {
    order: "6",
    effort: "Nhỏ",
    title: "Bật lại cache config local",
    why: "Mỗi lần mở app lạnh đang khởi động bằng config viết cứng thay vì config remote lần trước.",
    what: (
      <>
        Bỏ comment dòng đọc <C>KEY_ADMOB_CONFIGS</C> trong <C>initialize()</C>.
        Phần ghi đã chạy sẵn.
      </>
    ),
    where: "firebase_config_manager.dart:26-31",
  },
  {
    order: "7",
    effort: "Lớn",
    title: "Đặt điều kiện Remote Config theo quốc gia",
    why: "Để test mật độ quảng cáo khác nhau giữa Tier 1, 2, 3 trong soft launch.",
    what: (
      <>
        Tạo condition theo country trên Firebase console và tách giá trị cho
        cùng khoá <C>BASE_ADMOB_CONFIG</C>. Cấu trúc một khoá JSON hiện tại
        không cần đổi.
      </>
    ),
    where: "Firebase console · không cần sửa code",
  },
];

export default function Instrumentation() {
  return (
    <>
      <PageHeader
        eyebrow="UA · hành động"
        title="Kế hoạch đo"
        lead="Bảy việc, xếp theo tỉ lệ lợi ích trên công sức. Ba việc đầu mở khoá phần lớn chỉ số UA đang mù."
      />

      <Section title="Vá theo thứ tự nào">
        <Mermaid
          caption="Bước 2 và 3 phải đi cùng nhau mới có ý nghĩa"
          chart={`flowchart TB
  S1["1 · install_day vào UserProperties"] --> R1["Cohort, retention, LTV theo nhóm"]
  S2["2 · Nhóm event ad"] --> S3["3 · onPaidEvent → DataBuckets"]
  S3 --> R2["ARPU tổng, ROAS tổng, eCPM theo placement"]
  S2 --> R3["Funnel ad, tần suất, tác động lên retention"]
  S4["4 · iap_verify vào dòng event"] --> R4["Tỉ lệ verify hỏng"]
  S5["5 · Báo lỗi parse config"] --> R5["Hết mù khi đổi config sai"]
  S6["6 · Bật cache config"] --> R6["Config remote có hiệu lực ngay lần mở app lạnh"]
  S7["7 · Condition theo quốc gia"] --> R7["Test mật độ ad theo tier"]`}
        />
      </Section>

      <Section title="Bảy việc">
        <div className="space-y-3">
          {STEPS.map((s) => (
            <Card key={s.order} className="gap-0 py-4">
              <CardContent className="px-5">
                <div className="mb-2 flex flex-wrap items-center gap-2.5">
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {s.order}
                  </Badge>
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                  <Badge variant="outline" className="text-[10px]">
                    {s.effort}
                  </Badge>
                </div>
                <p className="text-sm">{s.why}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.what}</p>
                <p className="mt-2 font-mono text-[11px] text-muted-foreground/70">
                  {s.where}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Sau khi vá thì đo được gì">
        <Grid
          head={["Chỉ số", "Trước", "Sau bước 1–3"]}
          rows={[
            ["ARPU tổng", "chỉ phần IAP", "đủ IAP + IAA"],
            ["LTV theo cohort", "phải join ngoài", "truy vấn thẳng"],
            ["ROAS theo creative", "lệch thấp", "phản ánh đúng"],
            ["eCPM theo placement", "không có", "có"],
            ["Ad frequency vs retention", "không có", "có"],
            ["Chẩn đoán chương 11", "dễ đọc sai hướng", "tin được"],
          ]}
        />
        <Note tone="info" title="Không đụng tới CTR, IPM, CPI">
          <p>
            Ba chỉ số đó do mạng quảng cáo báo, nằm ngoài app. Kế hoạch này chỉ
            sửa phần doanh thu và hành vi — tức vế còn lại của ROAS.
          </p>
        </Note>
      </Section>
    </>
  );
}
