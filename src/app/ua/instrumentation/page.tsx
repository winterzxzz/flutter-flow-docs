import Link from "next/link";

import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, Note, Src } from "@/components/bits";
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
    title: "Bỏ comment dòng đọc cache config",
    why: "Một dòng. Chấm dứt việc mọi lần mở app lạnh đều chạy bằng ad config viết cứng.",
    what: (
      <>
        Dòng đọc <C>KEY_ADMOB_CONFIGS</C> trong <C>initialize()</C> đang bị
        comment nên biến <C>data</C> luôn null. Phần ghi đã chạy sẵn.
      </>
    ),
    where: "firebase_config_manager.dart:26-29",
  },
  {
    order: "2",
    effort: "Vừa",
    title: "Nối attribution từ Adjust về app",
    why: "Không có bước này thì mọi phân tích theo campaign, network hay creative đều bất khả thi — bao gồm toàn bộ chương 9, 10, 11.",
    what: (
      <>
        Ba mắt xích đều đứt: <C>AdjustConfig</C> không gán{" "}
        <C>attributionCallback</C>; <C>handleAttribution</C> không có caller
        nào; và bản thân nó chỉ sửa state cục bộ mà không gọi{" "}
        <C>updateUserPropertiesEvent</C>. Nối cả ba, và nhớ tách riêng nhóm
        organic để nó không bị đếm như một creative.
      </>
    ),
    where:
      "lib · adjust_sdk.dart · base · bucket_tracking_utils.dart handleAttribution",
  },
  {
    order: "3",
    effort: "Nhỏ",
    title: "Sửa uaTrackerName bị rơi",
    why: "Sẽ cắn ngay khi bước 2 xong: tham số được nhận nhưng không bao giờ được lưu.",
    what: (
      <>
        <C>updateUserPropertiesEvent</C> khai báo tham số <C>uaTrackerName</C>{" "}
        nhưng lời gọi <C>copyWith</C> ngay dưới không truyền nó.
      </>
    ),
    where: "bucket_tracking_utils.dart · updateUserPropertiesEvent",
  },
  {
    order: "4",
    effort: "Vừa",
    title: "Thêm nhóm event quảng cáo",
    why: "App sống bằng IAA nhưng không có event IAA nào. Đây là nửa còn thiếu của mọi chỉ số doanh thu.",
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
    order: "5",
    effort: "Vừa",
    title: "Bắc cầu onPaidEvent về BucketTrackingUtils",
    why: "Đi cùng bước 4. Thiếu nó thì ARPU, LTV và ROAS vẫn thiếu một nửa doanh thu.",
    what: (
      <>
        Mọi format đã gắn <C>onPaidEvent</C> và đẩy sang Adjust. Thêm nhánh song
        song bắn <C>ad_paid</C> kèm <C>value_micros</C>, <C>currency</C>,{" "}
        <C>precision</C>, <C>ad_format</C>, <C>placement</C>.
      </>
    ),
    where:
      "lib · 7 chỗ gán onPaidEvent trong 6 file, cộng 6 chỗ fan-out ở tầng app",
  },
  {
    order: "6",
    effort: "Nhỏ",
    title: "Sửa activeDay đếm ngược logic",
    why: "Mọi phân khúc dựng trên active_day hiện nay đều sai.",
    what: (
      <>
        Điều kiện tăng đang là &ldquo;lần mở này cùng ngày với lần trước&rdquo;,
        nên nó đếm số lần mở lại trong cùng một ngày và không bao giờ tăng khi
        sang ngày mới. Cân nhắc bỏ hẳn trường này và dùng{" "}
        <C>retention_day</C> của SDK.
      </>
    ),
    where: "app_config_cubit.dart · nhánh so sánh lastAccess với now",
  },
  {
    order: "7",
    effort: "Nhỏ",
    title: "Báo lỗi parse Remote Config và lỗi verify IAP",
    why: "Hai chỗ hiện chỉ log tại máy, nên hỏng từ xa là không ai biết.",
    what: (
      <>
        <C>setAdConfigs</C> có <C>logE</C> nhưng không báo đi đâu cả — thêm event{" "}
        <C>remote_config_parse_fail</C> và Crashlytics. <C>verifyIAP</C> chỉ{" "}
        <C>debugPrint</C> khi hỏng — cho nó đi qua <C>_sendEvent</C> để nối được
        với <C>iap_purchase_success</C> theo <C>user_id</C>.
      </>
    ),
    where: "firebase_config_manager.dart:73-75 · bucket_tracking_utils.dart verifyIAP",
  },
  {
    order: "8",
    effort: "Nhỏ",
    title: "Thêm transaction id vào iap_purchase_success",
    why: "Không có nó thì không khử trùng lặp được và không đảo ngược được doanh thu khi user hoàn tiền.",
    what: (
      <>
        Payload hiện có <C>pack_name</C>, <C>period</C>, <C>price</C>,{" "}
        <C>currency</C> nhưng không có mã giao dịch. Giá cũng là tiền tệ bản địa
        chưa quy đổi — cân nhắc thêm trường USD chuẩn hoá.
      </>
    ),
    where: "iap_purchase_success_param.dart",
  },
  {
    order: "9",
    effort: "Nhỏ",
    title: "Đặt condition Remote Config theo quốc gia hoặc phần trăm",
    why: "Điều kiện tối thiểu để A/B test mật độ quảng cáo. Không có nó thì mọi thử nghiệm chỉ là so trước/sau, đầy nhiễu.",
    what: (
      <>
        Tạo condition trên Firebase console rồi tách giá trị cho cùng khoá{" "}
        <C>BASE_ADMOB_CONFIG</C>. Cấu trúc một khoá JSON hiện tại không cần đổi.
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
        lead="Chín việc, xếp theo tỉ lệ lợi ích trên công sức. Bước 2 là nút thắt: chưa nối attribution thì phần lớn nội dung UA chưa chạy được."
      />

      <Note tone="warn" title="Trước khi thêm bất cứ trường nào vào common properties">
        <p>
          SDK có danh sách khoá cấm ghi đè, gồm <C>install_day</C>,{" "}
          <C>retention_day</C>, <C>session_id</C>, <C>session_number</C>,{" "}
          <C>event_date</C>, <C>platform</C>, <C>app_version</C> và nhiều khoá
          khác. Đẩy một khoá trong danh sách đó vào common properties sẽ{" "}
          <b>bị bỏ qua lặng lẽ</b>, chỉ để lại một dòng log. Đối chiếu danh sách
          trước khi lên kế hoạch.
        </p>
        <p>
          Chín trường cohort và session đã được SDK stamp sẵn vào mọi event, nên
          không cần và không thể tự thêm.{" "}
          <Link href="/ua/ltv" className="underline underline-offset-4">
            Xem LTV &amp; cohort
          </Link>
          .
        </p>
      </Note>

      <Section title="Thứ tự phụ thuộc">
        <Mermaid
          caption="Bước 4 và 5 phải đi cùng nhau; bước 2 mở khoá toàn bộ nhánh phân tích theo nguồn"
          chart={`flowchart TB
  S1["1 · bật cache config"] --> R1["Mở app lạnh dùng đúng config remote"]
  S2["2 · nối attribution"] --> S3["3 · sửa uaTrackerName"]
  S3 --> R2["ROAS, CPI, LTV tách được theo<br/>network · campaign · creative"]
  S4["4 · nhóm event ad"] --> S5["5 · onPaidEvent → DataBuckets"]
  S5 --> R3["ARPU tổng · eCPM · ROAS tổng"]
  S4 --> R4["Funnel ad, tần suất, tác động lên retention"]
  S2 --> R3
  S6["6 · sửa activeDay"] --> R5["Phân khúc theo độ gắn kết tin được"]
  S7["7 · báo lỗi config và verify"] --> R6["Hỏng từ xa phát hiện được"]
  S8["8 · transaction id"] --> R7["Khử trùng lặp, xử lý hoàn tiền"]
  S9["9 · condition theo quốc gia"] --> R8["A/B test mật độ ad thật sự"]`}
        />
      </Section>

      <Section title="Chín việc">
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
                <Src>{s.where}</Src>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Sau khi vá thì đo được gì">
        <Grid
          head={["Chỉ số", "Trước", "Sau bước 2", "Sau bước 4–5"]}
          rows={[
            ["ARPU (IAP)", "đo được", "tách theo campaign", "—"],
            ["ARPU (IAA)", "mù", "vẫn mù", "đo được"],
            ["ARPU tổng", "phải ghép tay", "vẫn ghép tay", "một truy vấn"],
            ["ROAS theo creative", "mù", "đo được phần IAP", "đủ cả hai nguồn"],
            ["eCPM theo placement", "không có", "không có", "có"],
            ["LTV cohort", "đo được phần IAP", "tách theo nguồn", "đủ doanh thu"],
            ["Chẩn đoán chương 11", "chưa dùng được", "dùng được một nửa", "tin được"],
          ]}
        />
        <Note tone="info" title="Không đụng tới CTR, IPM, CPI">
          <p>
            Ba chỉ số đó do mạng quảng cáo báo, nằm ngoài app. Kế hoạch này chỉ
            sửa vế doanh thu và hành vi — tức nửa còn lại của ROAS.
          </p>
        </Note>
      </Section>
    </>
  );
}
