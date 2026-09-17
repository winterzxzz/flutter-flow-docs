import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Facts, Grid, Note } from "@/components/bits";

export const metadata = { title: "CPI · ROAS" };

export default function Cpi() {
  return (
    <>
      <PageHeader
        eyebrow="UA · chương 7"
        title="CPI, ARPU và ROAS"
        lead="ARPU nói người dùng đáng giá bao nhiêu. CPI nói thu hút họ tốn bao nhiêu. ROAS là tỉ số giữa hai con số đó, và là thứ quyết định scale hay dừng."
      />

      <Section title="Quan hệ ba chỉ số">
        <Mermaid
          caption="ROAS = doanh thu ÷ chi phí; cả hai vế đều phải đo được"
          chart={`flowchart LR
  A["ARPU<br/>doanh thu / user"] --> R{"ROAS"}
  B["CPI<br/>chi phí / install"] --> R
  R -->|dương| S["scale · tăng ngân sách"]
  R -->|trung tính| O["tối ưu creative, targeting"]
  R -->|âm| X["dừng chiến dịch"]`}
        />
        <Note tone="info" title="Thị trường CPI cao thường có ARPU cao">
          <p>
            Đây là lý do CPI thấp không tự động tốt. Tier 3 cho CPI rẻ nhưng
            ARPU cũng thấp; Tier 1 đắt nhưng người dùng đáng giá hơn. So sánh
            phải theo cặp, không so CPI trần.
          </p>
        </Note>
      </Section>

      <Section title="Kỳ hoàn vốn quyết định ngưỡng chấp nhận">
        <Mermaid
          caption="CPI vượt ARPU ở giai đoạn sớm là bình thường; điều quan trọng là vị trí tại mốc hoàn vốn"
          chart={`flowchart TB
  P{"Chọn kỳ hoàn vốn"}
  P -->|30-90 ngày| S1["Thu hồi nhanh<br/>ít chịu đựng lỗ dài hạn<br/>hợp app vòng đời ngắn"]
  P -->|180-365 ngày| S2["Thu hồi chậm<br/>nhắm user LTV cao<br/>cần vốn khoẻ"]
  S1 --> R["Điều kiện chung:<br/>CPI &lt; ARPU tại mốc hoàn vốn"]
  S2 --> R`}
        />
        <Facts
          rows={[
            [
              "Cách tính CPI tối đa",
              "lấy LTV dự kiến tại mốc hoàn vốn, trừ biên an toàn, ra trần CPI được phép trả",
            ],
            [
              "Sai lầm hay gặp",
              "so CPI hôm nay với ARPU hôm nay. Phải so với ARPU tích luỹ tới hết kỳ hoàn vốn.",
            ],
          ]}
        />
      </Section>

      <Section title="Khi nào ưu tiên CPI, khi nào ưu tiên ROAS">
        <Grid
          head={["Tình huống", "Ưu tiên", "Vì sao"]}
          rows={[
            ["Soft launch", "CPI thấp", "cần nhiều dữ liệu với chi phí rẻ nhất"],
            [
              "Cần khối lượng để đẩy organic",
              "CPI thấp",
              "nhiều lượt cài kéo theo xếp hạng, đánh giá, lan truyền",
            ],
            ["Xây nhận diện", "CPI thấp", "tiếp cận quan trọng hơn lợi nhuận ngắn hạn"],
            [
              "Giai đoạn tăng trưởng có lãi",
              "ROAS cao",
              "scale chiến dịch ROAS thấp chỉ đốt nguồn lực",
            ],
            [
              "Ngân sách hữu hạn",
              "ROAS cao",
              "mỗi đồng phải quay về, không có chỗ cho khối lượng rỗng",
            ],
          ]}
        />
      </Section>

      <Section title="CPI biến động theo cái gì">
        <Facts
          rows={[
            ["Nền tảng", "iOS cao hơn Android do tiềm năng ARPU cao hơn"],
            [
              "Địa lý",
              "Tier 1 (Mỹ, Canada, Anh) cao · Tier 2 (Mexico, Ba Lan, Thái Lan) trung bình · Tier 3 (Việt Nam, Iraq, Moldova) thấp",
            ],
            ["Thể loại", "casual rẻ hơn chiến thuật hoặc nhập vai"],
            ["Định dạng", "video đắt hơn banner nhưng gắn kết tốt hơn"],
            ["Thời điểm", "biến động theo mùa, ngày lễ, cạnh tranh"],
          ]}
        />
      </Section>

      <Section title="Code hỗ trợ được phần nào">
        <Mermaid
          caption="Phần chi phí luôn nằm ngoài app; phần doanh thu mới là chỗ code quyết định"
          chart={`flowchart TB
  subgraph out["Ngoài app — mạng quảng cáo"]
    C1["chi tiêu"]
    C2["số lượt cài"]
    C3["CPI = C1 ÷ C2"]
  end
  subgraph inapp["Trong app"]
    D1["iap_purchase_success<br/>doanh thu IAP"]
    D2["ua_campaign, ua_creative<br/>gắn vào mọi event"]
    D3["onPaidEvent → Adjust<br/>doanh thu ad"]
  end
  C3 --> ROAS{"ROAS theo campaign"}
  D1 --> ROAS
  D2 --> ROAS
  D3 -.->|không cùng hệ| ROAS
  style D3 stroke-dasharray: 4 4`}
        />
        <Note tone="good" title="Làm được ngay: ROAS theo creative cho phần IAP">
          <p>
            Vì <C>ua_creative</C> gắn vào mọi event, bạn có thể nhóm{" "}
            <C>iap_purchase_success</C> theo creative và chia cho chi phí của
            chính creative đó lấy từ mạng quảng cáo. Không cần sửa code.
          </p>
        </Note>
        <Note tone="warn" title="Chưa làm được: ROAS tổng">
          <p>
            Thiếu doanh thu IAA trong cùng hệ, nên ROAS tính ra sẽ thấp giả với
            app sống bằng quảng cáo. Với app chủ yếu IAA, con số này có thể làm
            bạn tắt nhầm một chiến dịch đang có lãi.
          </p>
        </Note>
      </Section>

      <Section title="Khi nào nên dừng hẳn">
        <Facts
          rows={[
            ["Chỉ số kém dai dẳng", "tối ưu nhiều vòng mà CPI, ROAS, retention vẫn không đạt"],
            ["Không thể scale có lãi", "chi phí thu hút luôn vượt giá trị người dùng"],
            ["Sai market fit", "dữ liệu và phản hồi đều cho thấy sản phẩm không cộng hưởng"],
            ["Cạn nguồn lực đội ngũ", "dự án ngốn tập trung mà không có tiến bộ đo được"],
          ]}
        />
        <Note tone="info" title="Dừng không phải thất bại">
          <p>
            Nhận ra sớm tiết kiệm thời gian và ngân sách cho cơ hội tiếp theo.
            Trước khi đầu tư nặng vào dự án mới, kiểm chứng ý tưởng bằng concept
            testing.
          </p>
        </Note>
      </Section>
    </>
  );
}
