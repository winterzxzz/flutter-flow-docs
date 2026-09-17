import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Facts, Grid, Note } from "@/components/bits";

export const metadata = { title: "Ad creative" };

export default function Creative() {
  return (
    <>
      <PageHeader
        eyebrow="UA · chương 9 và 10"
        title="Ad creative: làm và đo"
        lead="Creative quyết định CTR và IPM, tức quyết định CPI. Phần khó không phải quay video mà là biết video nào mang về người dùng thật sự có giá trị."
      />

      <Section title="Nền móng trước khi sản xuất">
        <Mermaid
          caption="Bốn câu hỏi phải trả lời xong mới bắt đầu quay"
          chart={`flowchart TB
  Q1["Đối tượng là ai ?<br/>nhân khẩu, tâm lý, hành vi"] --> P["User Persona<br/>một con người cụ thể, có tên"]
  Q2["App khác biệt ở đâu ?"] --> P
  Q3["Chiến dịch nhằm mục tiêu gì ?<br/>burst · remarketing · user testing"] --> P
  Q4["Niềm vui bắt đầu lúc nào ?<br/>FTUE thực tế"] --> P
  P --> C["Quyết định giọng điệu, nền tảng, nội dung"]`}
        />
        <Facts
          rows={[
            [
              "Vì sao cần persona",
              <>
                Phân khúc kiểu &ldquo;25–35 tuổi&rdquo; quá mơ hồ để viết kịch
                bản. Một &ldquo;Roberto, 28 tuổi, chơi casual trên tàu điện&rdquo;
                mới trả lời được: nói giọng gì, đặt hook ở đâu, quảng cáo dài bao
                lâu.
              </>,
            ],
            [
              "Khớp nền tảng",
              "chọn mạng theo nơi persona thật sự ở, không mặc định Facebook và Google",
            ],
            [
              "Mục tiêu đổi cách làm creative",
              "burst khoe tính năng ngoạn mục · remarketing khoe cái đã cải thiện · user testing khoe đúng tính năng đang test",
            ],
          ]}
        />
      </Section>

      <Section title="Sáu nguyên tắc sản xuất">
        <Grid
          head={["Nguyên tắc", "Cụ thể"]}
          rows={[
            [
              "Vài giây đầu quyết định",
              "mở bằng thứ ấn tượng nhất, tạo hook gây tò mò hoặc hứng khởi",
            ],
            [
              "Câu chốt đến sớm",
              "cắt dẫn dắt và chuyển cảnh dài; cái gì không phục vụ câu chốt thì bỏ",
            ],
            [
              "CTA rõ ràng",
              "nói thẳng hành động; thử đặt ở đầu, giữa và cuối; kết hợp chữ, hình, tiếng",
            ],
            [
              "Dưới 30 giây",
              "YouTube non-skippable cần 15–20 giây; dài hơn thì thành skippable sau 3 giây",
            ],
            [
              "Một quảng cáo một tính năng",
              "nhồi hết vào một video làm loãng thông điệp và mất khả năng biết cái gì hiệu quả",
            ],
            [
              "Âm thanh tạo cảm xúc",
              "nhạc khớp nhịp và tông; A/B test bản nhạc như test hình ảnh",
            ],
          ]}
        />
        <Note tone="info" title="Vì sao tách tính năng lại quan trọng cho việc đo">
          <p>
            Mỗi quảng cáo một tính năng thì <C>ua_creative</C> trở thành nhãn có
            nghĩa: bạn biết người đến từ creative &ldquo;tính năng A&rdquo; hành
            xử khác người đến từ &ldquo;tính năng B&rdquo; thế nào. Nhồi hết vào
            một video là vứt bỏ khả năng đó.
          </p>
        </Note>
      </Section>

      <Section title="Nối creative với hành vi trong app">
        <Mermaid
          caption="Đường ống đã dựng đủ, nhưng mắt xích đầu tiên chưa cắm điện"
          chart={`flowchart LR
  A["Creative X trên mạng quảng cáo"] --> B["Cài đặt"]
  B --> C["Adjust gán attribution"]
  C -.->|"callback CHƯA nối"| D["ua_creative = X<br/>hiện luôn là Unattributed"]
  style C stroke-dasharray: 4 4
  D --> E1["screen_show splash → home<br/>có đi hết onboarding không"]
  D --> E2["iap_show → iap_click<br/>có xem paywall không"]
  D --> E3["iap_purchase_success<br/>có trả tiền không"]
  E1 --> F["Chân dung thật của user từ creative X"]
  E2 --> F
  E3 --> F`}
        />
        <Grid
          head={["Câu hỏi về creative", "Trả lời được chưa", "Chặn ở đâu"]}
          rows={[
            [
              "Creative nào mang về người mua IAP",
              "Chưa",
              <>
                <C>ua_creative</C> luôn là <C>&quot;Unattributed&quot;</C>
              </>,
            ],
            [
              "Creative nào mang về người bỏ ngay ở splash",
              "Chưa",
              "cùng lý do — không tách được nguồn",
            ],
            [
              "Creative nào hứa sai so với FTUE",
              "Chưa",
              "cùng lý do",
            ],
            [
              "Creative nào mang về người xem nhiều quảng cáo",
              "Chưa",
              "thiếu cả attribution lẫn event ad",
            ],
            [
              "Creative nào cho eCPM cao",
              "Chưa",
              "thiếu cả ba: attribution, event ad, doanh thu ad trong cùng hệ",
            ],
            [
              "Funnel onboarding và paywall ở mức tổng",
              "Được",
              <>
                <C>screen_show</C>, <C>screen_exit</C>, <C>iap_*</C> đều hoạt
                động, chỉ không bóc tách theo nguồn
              </>,
            ],
          ]}
        />
        <Note tone="warn" title="Toàn bộ chương này chưa chạy được trên dữ liệu hiện tại">
          <p>
            Chương 9 đến 11 đều giả định bạn so sánh được hiệu quả giữa các
            creative. Điều kiện tối thiểu cho việc đó là attribution chảy về
            app — hiện chưa. Trước khi đầu tư sản xuất nhiều biến thể creative
            để A/B test, hãy nối attribution, nếu không bạn sẽ không đọc được
            kết quả của chính thử nghiệm đó.
          </p>
        </Note>
      </Section>
    </>
  );
}
