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
          caption="Chưa ra mắt thì không có ARPDAU để mà nhân — phải mượn số của app tương tự"
          chart={`flowchart TB
  Q{"App đã ra mắt chưa ?"}
  Q -->|chưa| Z["Mượn dữ liệu lịch sử<br/>của app tương tự<br/>ước tính retention và doanh thu"]
  Z --> Z1["Thận trọng: đặc thù riêng<br/>có thể làm hành vi khác hẳn"]
  Q -->|rồi| D{"Dữ liệu đã đủ dày chưa ?"}
  D -->|"mới, còn mỏng"| A["Cách nhanh<br/>LTV = ARPDAU × số ngày sống trung bình"]
  D -->|"đã đủ"| B["Cách cohort<br/>doanh thu tích luỹ theo nhóm ngày cài"]
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
              "Khi chưa ra mắt",
              "không có DAU nên không có ARPDAU. Dùng số liệu lịch sử của app cùng thể loại để ước tính retention và doanh thu, và ghi rõ đó là giả định.",
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
          caption="Hai mảnh đầu SDK đã lo; chỉ mảnh doanh thu là thiếu một nửa"
          chart={`flowchart LR
  subgraph need["Cần cho cohort"]
    N1["mốc gốc: ngày cài"]
    N2["số ngày kể từ khi cài"]
    N3["doanh thu tích luỹ"]
  end
  subgraph have["Thực tế"]
    H1["install_day<br/>SDK tự gắn mọi event"]
    H2["retention_day<br/>SDK tự tính mọi event"]
    H3["iap_purchase_success có<br/>ad revenue KHÔNG có"]
  end
  N1 --> H1
  N2 --> H2
  N3 -.-> H3
  style H3 stroke-dasharray: 4 4`}
        />

        <Grid
          head={["Mảnh dữ liệu", "Nguồn", "Trạng thái"]}
          rows={[
            [
              <C key="a">install_day</C>,
              "SDK DataBuckets stamp vào mọi event",
              "Sẵn sàng",
            ],
            [
              <C key="b">retention_day</C>,
              <>
                SDK tự tính từ <C>install_day</C> và timestamp của event
              </>,
              "Sẵn sàng",
            ],
            [
              <C key="c">session_id · session_number</C>,
              "SDK stamp vào mọi event",
              "Sẵn sàng — dùng để tính DAU",
            ],
            [
              "doanh thu IAP",
              <C key="e">iap_purchase_success</C>,
              "Có, nhưng thiếu transaction id",
            ],
            [
              "doanh thu IAA",
              <>
                <C>onPaidEvent</C> → Adjust
              </>,
              "Không có trong DataBuckets",
            ],
            [
              <C key="d">activeDay</C> ,
              <>
                trường tự viết trong <C>UserProperties</C>
              </>,
              "Có nhưng sai — xem cảnh báo dưới",
            ],
          ]}
        />

        <Note tone="good" title="Cohort làm được ngay hôm nay">
          <p>
            Không cần sửa code. <C>install_day</C> và <C>retention_day</C> đã
            nằm trên từng event, nên nhóm cohort theo ngày cài và vẽ doanh thu
            tích luỹ D1/D7/D30 là truy vấn thuần trên kho dữ liệu.
          </p>
        </Note>

        <Note tone="warn" title="Nhưng LTV vẫn lệch thấp, và activeDay thì sai">
          <p>
            <b>Thiếu nửa doanh thu.</b> Không có ad revenue trong DataBuckets
            nên LTV tính ra thấp hơn thực tế. Với app sống bằng IAA, con số đó
            gần như vô nghĩa.
          </p>
          <p>
            <b><C>activeDay</C> đếm ngược logic.</b> Nó chỉ tăng khi lần mở app
            này <i>cùng ngày</i> với lần trước, và không bao giờ tăng khi sang
            ngày mới. Đây không phải số ngày hoạt động — mọi phân khúc dựng trên
            nó đều sai. Dùng <C>retention_day</C> của SDK thay thế.
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
              "Trần cho CPI lấy theo ARPU, không theo LTV",
              "CPI phải thấp hơn ARPU tích luỹ tại mốc hoàn vốn đã chọn. LTV trọn đời luôn lớn hơn, nên lấy nó làm trần là trả trước cho doanh thu chưa tới.",
            ],
          ]}
        />
      </Section>
    </>
  );
}
