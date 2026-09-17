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
          caption="Đây là phần code đã sẵn sàng và đang bị bỏ phí"
          chart={`flowchart LR
  A["Creative X trên mạng quảng cáo"] --> B["Cài đặt"]
  B --> C["Adjust gán attribution"]
  C --> D["ua_creative = X<br/>gắn vào mọi event"]
  D --> E1["screen_show splash → home<br/>có đi hết onboarding không"]
  D --> E2["iap_show → iap_click<br/>có xem paywall không"]
  D --> E3["iap_purchase_success<br/>có trả tiền không"]
  E1 --> F["Chân dung thật của user từ creative X"]
  E2 --> F
  E3 --> F`}
        />
        <Grid
          head={["Câu hỏi về creative", "Trả lời được chưa", "Bằng cách nào"]}
          rows={[
            [
              "Creative nào mang về người mua IAP",
              "Được",
              <>
                nhóm <C>iap_purchase_success</C> theo <C>ua_creative</C>
              </>,
            ],
            [
              "Creative nào mang về người bỏ ngay ở splash",
              "Được",
              <>
                <C>screen_exit</C> + <C>duration_prev_screen</C> theo creative
              </>,
            ],
            [
              "Creative nào hứa sai so với FTUE",
              "Gần được",
              "tỉ lệ rơi ở màn đầu cao bất thường so với creative khác",
            ],
            [
              "Creative nào mang về người xem nhiều quảng cáo",
              "Chưa",
              "không có event ad nào",
            ],
            [
              "Creative nào cho eCPM cao",
              "Chưa",
              "doanh thu ad không gắn creative trong cùng hệ",
            ],
          ]}
        />
        <Note tone="warn" title="Với app sống bằng IAA, đây là lỗ hổng lớn nhất">
          <p>
            Toàn bộ chương creative giả định bạn đo được doanh thu trên đầu
            người theo creative. App của bạn kiếm tiền chủ yếu từ quảng cáo,
            nhưng đúng nửa đó lại không có event nào — nên xếp hạng creative hiện
            tại chỉ phản ánh được nhóm người mua IAP, vốn là thiểu số.
          </p>
        </Note>
      </Section>
    </>
  );
}
