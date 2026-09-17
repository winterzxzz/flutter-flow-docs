import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Facts, Grid, Note } from "@/components/bits";

export const metadata = { title: "Các giai đoạn launch" };

export default function Launch() {
  return (
    <>
      <PageHeader
        eyebrow="UA · chương 7.4"
        title="Technical → Soft → Global"
        lead="Mỗi giai đoạn có mục tiêu, thị trường và tiêu chí thoát khác nhau. Nhảy cóc sang Tier 1 khi chưa xong soft launch là cách đốt ngân sách nhanh nhất."
      />

      <Section title="Ba giai đoạn">
        <Mermaid
          caption="Chỉ tiến sang bước sau khi tiêu chí thoát đã đạt"
          chart={`flowchart LR
  T["Technical Launch<br/>Tier 3 · CPI rẻ"] --> TG{"Hết crash<br/>gắn kết ổn ?"}
  TG -->|chưa| T
  TG -->|rồi| S["Soft Launch<br/>Tier 2 · CPI vừa"]
  S --> SG{"Kiếm tiền và<br/>giữ chân đạt mục tiêu ?"}
  SG -->|chưa| S
  SG -->|rồi| G["Global Launch<br/>Tier 1 · CPI cao"]`}
        />
        <Grid
          head={["Giai đoạn", "Thị trường", "Mục tiêu", "Đo cái gì"]}
          rows={[
            [
              "Technical",
              "Tier 3 — CPI thấp",
              "thu dữ liệu, sửa lỗi, test cơ chế",
              "crash, loading, funnel onboarding",
            ],
            [
              "Soft",
              "Tier 2 — hành vi gần toàn cầu",
              "test kiếm tiền, giá IAP, vị trí ad, giữ chân",
              "ARPU, retention, tần suất ad",
            ],
            [
              "Global",
              "Tier 1 — ARPU cao",
              "scale với creative và targeting đã tinh chỉnh",
              "ROAS, payback",
            ],
          ]}
        />
      </Section>

      <Section title="Remote Config là công cụ của giai đoạn soft launch">
        <Mermaid
          caption="Với một khoá phẳng, đây là so sánh trước/sau theo thời gian — KHÔNG phải A/B test"
          chart={`flowchart TB
  A["Giả thuyết: ad dày quá làm rơi retention"] --> B["Đổi ad_show_interval<br/>trên Firebase console"]
  B --> C["Publish"]
  C --> D["User nhận sau tối đa 1 giờ<br/>và từ lần mở app kế tiếp"]
  D --> E{"So cohort cài TRƯỚC<br/>với cohort cài SAU"}
  E -->|khá hơn| F["giữ giá trị mới"]
  E -->|xấu đi| G["trả lại giá trị cũ"]
  E --> H["Nhiễu: mùa vụ, phiên bản,<br/>thay đổi nguồn traffic"]`}
        />
        <Facts
          rows={[
            [
              "Đòn bẩy sẵn có",
              <>
                <C>is_ad_enabled</C> bật tắt từng format · <C>ad_show_interval</C>{" "}
                giãn tần suất · <C>ad_units</C> đổi waterfall ·{" "}
                <C>ad_refresh_time</C> chỉnh reload native
              </>,
            ],
            [
              "Độ trễ phải tính vào thiết kế test",
              "tối đa 1 giờ do minimumFetchInterval, và chỉ áp dụng từ lần mở app kế tiếp vì fetch nằm ở splash",
            ],
          ]}
        />

        <Note tone="warn" title="Hai hạn chế cản việc test theo giai đoạn">
          <p>
            <b>Chưa dùng Firebase Remote Config conditions, nên chưa A/B test được.</b>{" "}
            Một khoá phẳng nghĩa là mọi người dùng nhận cùng giá trị tại cùng
            thời điểm — không tồn tại hai nhóm song song để so. Thứ bạn làm được
            chỉ là so trước/sau theo thời gian, và kết quả bị nhiễu bởi mùa vụ,
            phiên bản app và thay đổi nguồn traffic. Muốn test thật thì tạo
            condition trên console (theo quốc gia, hoặc theo phần trăm người
            dùng) rồi tách giá trị theo condition; cấu trúc một khoá JSON hiện
            tại không cần đổi.
          </p>
          <p>
            <b>Không đo được tác động lên doanh thu ad.</b> Đổi{" "}
            <C>ad_show_interval</C> xong không có event nào cho biết số lần hiển
            thị thay đổi thế nào. Bạn chỉ thấy retention đổi, không thấy đánh
            đổi doanh thu.
          </p>
        </Note>
      </Section>

      <Section title="Tiêu chí thoát nên dựa trên dữ liệu nào">
        <Grid
          head={["Câu hỏi", "Đo bằng", "Sẵn sàng chưa"]}
          rows={[
            [
              "Onboarding có rơi nhiều không",
              <>
                <C>screen_show</C> / <C>screen_exit</C> chuỗi splash → language →
                intro → home
              </>,
              "Sẵn sàng",
            ],
            [
              "Load có chậm gây bỏ cuộc không",
              <>
                <C>loading_start</C> / <C>loading_finish</C> kèm <C>error_code</C>
              </>,
              "Sẵn sàng",
            ],
            [
              "Paywall có chuyển đổi không",
              <>
                <C>iap_show</C> → <C>iap_click</C> → <C>iap_purchase_success</C>
              </>,
              "Sẵn sàng",
            ],
            [
              "Ad có làm rơi người dùng không",
              "cần event ad show / ad click",
              "Chưa có",
            ],
            [
              "Doanh thu ad trên đầu người",
              "cần ad revenue trong cùng hệ",
              "Chưa có",
            ],
            [
              "Retention theo cohort",
              <>
                <C>install_day</C> và <C>retention_day</C> do SDK gắn sẵn
              </>,
              "Sẵn sàng",
            ],
            [
              "So sánh hiệu quả giữa các thị trường hoặc campaign",
              "cần attribution chảy về app",
              "Chưa có",
            ],
          ]}
        />
      </Section>
    </>
  );
}
