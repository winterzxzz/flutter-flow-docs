import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Facts, Grid, Note } from "@/components/bits";

export const metadata = { title: "LTV & cohort" };

export default function Ltv() {
  return (
    <>
      <PageHeader
        eyebrow="UA · chương 4"
        title="LTV và cohort"
        lead="LTV quyết định trần chi phí bạn được phép trả cho một lượt cài. Không biết LTV thì mọi con số CPI đều là đoán mò."
      />

      <Section title="Hai cách tính, chọn theo độ trưởng thành">
        <Mermaid
          caption="Bắt đầu bằng cách nhanh, chuyển sang cohort khi đã có dữ liệu thật"
          chart={`flowchart TB
  Q{"App đã ra mắt<br/>và có dữ liệu chưa ?"}
  Q -->|chưa| A["Cách nhanh<br/>LTV = ARPDAU × số ngày sống trung bình"]
  Q -->|rồi| B["Cách cohort<br/>doanh thu tích luỹ theo nhóm ngày cài"]
  A --> A1["Ưu: tính được ngay"]
  A --> A2["Nhược: giả định mọi user như nhau<br/>bỏ qua churn và biến thiên"]
  B --> B1["Chia cohort D1 D7 D15 D30 D90"]
  B1 --> B2["Cộng doanh thu tích luỹ từng mốc"]
  B2 --> B3["LTV cohort = tổng doanh thu ÷ số user"]
  B3 --> B4["LTV trung bình = gộp nhiều cohort"]`}
        />
        <Facts
          rows={[
            [
              "Công thức nhanh",
              <>
                <C>LTV = ARPDAU × số ngày sống trung bình</C>
              </>,
            ],
            [
              "Ví dụ cohort",
              "100 người cài cùng ngày, tới D30 tạo ra 500$ → LTV D30 = 5$/người",
            ],
            [
              "Nguồn doanh thu phải cộng đủ",
              "IAP + quảng cáo + subscription. Thiếu một nguồn là LTV thấp giả.",
            ],
            [
              "Chi phí phải trừ",
              "phát triển, vận hành, và chính chi phí UA",
            ],
          ]}
        />
      </Section>

      <Section title="Code của bạn tính được tới đâu">
        <Mermaid
          caption="Ba mảnh cần có để dựng một cohort; code mới có một mảnh rưỡi"
          chart={`flowchart LR
  subgraph need["Cần cho cohort"]
    N1["mốc gốc: ngày cài"]
    N2["mốc hiện tại: ngày hoạt động"]
    N3["doanh thu tích luỹ"]
  end
  subgraph have["Code đang có"]
    H1["install_day<br/>CHỈ trong iap_verify"]
    H2["activeDay<br/>trong UserProperties"]
    H3["iap_purchase_success<br/>không có ad revenue"]
  end
  N1 -.-> H1
  N2 --> H2
  N3 -.-> H3
  style H1 stroke-dasharray: 4 4
  style H3 stroke-dasharray: 4 4`}
        />

        <Grid
          head={["Mảnh dữ liệu", "Ở đâu trong code", "Vấn đề"]}
          rows={[
            [
              <C key="a">install_day</C>,
              <>
                đọc từ SharedPreferences trong <C>verifyIAP</C>, đóng gói vào{" "}
                <C>IAPVerifyParam</C>
              </>,
              "chỉ gửi tới server verify, không gắn vào event DataBuckets",
            ],
            [
              <C key="b">install_timestamp</C>,
              <>
                key <C>install_time_millis</C>, cùng chỗ với trên
              </>,
              "cùng vấn đề",
            ],
            [
              <C key="c">retention_day</C>,
              <>
                tính bằng <C>calculateRetentionDate</C> từ <C>install_day</C>{" "}
                dạng YYYYMMDD
              </>,
              "logic đã có sẵn, chỉ thiếu đường ra",
            ],
            [
              <C key="d">activeDay</C>,
              <>
                trường của <C>UserProperties</C>, gắn vào mọi event
              </>,
              "có nhưng không đủ một mình để dựng cohort",
            ],
            [
              "doanh thu IAP",
              <C key="e">iap_purchase_success</C>,
              "có",
            ],
            [
              "doanh thu IAA",
              <>
                <C>onPaidEvent</C> → Adjust
              </>,
              "không có trong DataBuckets → LTV thiếu hẳn một nguồn",
            ],
          ]}
        />

        <Note tone="warn" title="Hệ quả thực tế">
          <p>
            LTV tính từ DataBuckets hiện tại sẽ <b>thấp hơn thực tế</b> vì thiếu
            toàn bộ doanh thu quảng cáo. Với một app sống bằng IAA, con số đó
            gần như vô nghĩa.
          </p>
          <p>
            Và vì <C>install_day</C> không đi kèm event, không thể nhóm cohort
            trực tiếp trong DataBuckets — phải join ngược qua{" "}
            <C>user_id</C> với dữ liệu của server verify.
          </p>
        </Note>
      </Section>

      <Section title="Sửa nhỏ, lợi lớn">
        <Note tone="good" title="Thêm hai trường vào UserProperties">
          <p>
            <C>install_day</C> và <C>retention_day</C> đã được tính sẵn trong{" "}
            <C>BucketTrackingUtils</C>. Đưa chúng vào{" "}
            <C>updateUserPropertiesEvent</C> là mọi event đều mang theo mốc
            cohort, và phân tích cohort làm được ngay trong DataBuckets mà không
            cần join.
          </p>
        </Note>
      </Section>

      <Section title="Nguyên tắc rút ra">
        <Facts
          rows={[
            ["Bắt đầu đơn giản", "mô hình phức tạp quá sớm làm chậm khả năng lặp"],
            [
              "LTV gắn với giữ chân",
              "người ở lại lâu tạo nhiều doanh thu hơn, nên cải thiện retention là cách nâng LTV rẻ nhất",
            ],
            [
              "LTV đặt trần cho CPI",
              "CPI phải thấp hơn LTV trong kỳ hoàn vốn đã chọn",
            ],
          ]}
        />
      </Section>
    </>
  );
}
