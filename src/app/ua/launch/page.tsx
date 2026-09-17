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
          caption="Đổi tần suất và vị trí ad mà không cần build lại là điều kiện để test kiếm tiền nhanh"
          chart={`flowchart TB
  A["Giả thuyết: ad dày quá làm rơi retention"] --> B["Đổi ad_show_interval<br/>trên Firebase console"]
  B --> C["Publish"]
  C --> D["User nhận sau tối đa 1 giờ<br/>và từ lần mở app kế tiếp"]
  D --> E{"So retention hai nhóm"}
  E -->|khá hơn| F["giữ giá trị mới"]
  E -->|xấu đi| G["trả lại giá trị cũ"]`}
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
            <b>Chưa dùng Firebase Remote Config conditions.</b> Hiện chỉ một
            khoá phẳng cho mọi người dùng. Muốn Tier 3 chịu ad dày hơn Tier 1
            thì phải tạo điều kiện theo quốc gia trên console và tách giá trị
            theo điều kiện — cấu trúc một khoá JSON hiện tại làm được, nhưng
            chưa ai đặt điều kiện.
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
                cần <C>install_day</C> trong common properties
              </>,
              "Chưa có",
            ],
          ]}
        />
      </Section>
    </>
  );
}
