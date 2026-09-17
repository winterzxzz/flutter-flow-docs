import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, Note, Stat } from "@/components/bits";

export const metadata = { title: "Bản đồ chỉ số UA" };

export default function Ua() {
  return (
    <>
      <PageHeader
        eyebrow="UA"
        title="Bản đồ chỉ số"
        lead="Mỗi chỉ số UA cần một loại dữ liệu cụ thể. Trang này đối chiếu công thức với những gì codebase thực sự bắn ra, để biết chỉ số nào tin được và chỉ số nào đang mù."
      />

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Đo được ngay" value="3" sub="trên 11 chỉ số" />
        <Stat label="Mù" value="3" sub="ARPU IAA · eCPM · ROAS creative" />
        <Stat label="Ngoài app" value="3" sub="CPI · CTR · IPM" />
        <Stat label="Attribution" value="0" sub="chưa nối dây" />
      </div>

      <Section title="Ba nguồn dữ liệu, ba bức tranh khác nhau">
        <Mermaid
          caption="Không nguồn nào một mình đủ để tính ROAS tổng"
          chart={`flowchart TB
  subgraph N["Mạng quảng cáo — nơi bạn mua user"]
    CTR["CTR, IPM"]
    SPEND["Chi phí, CPI"]
  end
  subgraph AJ["Adjust — attribution"]
    ATTR["install theo network/campaign/creative"]
    ADREV["ad revenue từ onPaidEvent"]
  end
  subgraph DB["DataBuckets — hành vi in-app"]
    IAPREV["iap_purchase_success"]
    BEHAV["screen, loading, button"]
    AUTO["install_day, retention_day,<br/>session_id — SDK tự gắn"]
  end
  SPEND --> ROAS{"ROAS"}
  IAPREV --> ROAS
  ADREV --> ROAS
  ADREV -.->|thiếu cầu nối| DB
  ATTR -.->|callback chưa nối| DB
  style ADREV stroke-dasharray: 4 4
  style ATTR stroke-dasharray: 4 4`}
        />
        <Note tone="warn" title="Hai sợi dây bị đứt">
          <p>
            <b>Doanh thu quảng cáo</b> chỉ đến Adjust, không vào DataBuckets.
          </p>
          <p>
            <b>Attribution</b> không chảy về app: Adjust SDK không đăng ký
            callback, và hàm nhận attribution trong app không có nơi nào gọi.
            Chi tiết ở mục dưới.
          </p>
        </Note>
      </Section>

      <Section title="Từng chỉ số đo được tới đâu">
        <Grid
          head={["Chỉ số", "Cần gì", "Thực tế trong code", "Kết luận"]}
          rows={[
            [
              "ARPU (IAP)",
              "doanh thu IAP ÷ số user",
              <>
                <C>iap_purchase_success</C> + <C>user_id</C> +{" "}
                <C>user_pseudo_id</C>
              </>,
              "Đo được",
            ],
            [
              "Retention D1/D7/D30",
              "ngày cài + ngày hoạt động",
              <>
                SDK tự gắn <C>install_day</C> và <C>retention_day</C> vào mọi
                event
              </>,
              "Đo được",
            ],
            [
              "LTV cohort (phần IAP)",
              "doanh thu tích luỹ theo nhóm ngày cài",
              <>
                cùng hai trường trên + <C>iap_purchase_success</C>
              </>,
              "Đo được",
            ],
            [
              "ARPU (IAA)",
              "doanh thu ad ÷ số user",
              <>
                chỉ có <C>AdjustAdRevenue</C>, không event nào
              </>,
              "Mù",
            ],
            [
              "ARPU tổng",
              "cộng hai nguồn trên",
              "hai hệ tách rời",
              "Phải ghép tay",
            ],
            [
              "ARPDAU",
              "doanh thu ngày ÷ DAU",
              <>
                DAU lấy được từ <C>session_id</C>; doanh thu thiếu nửa IAA
              </>,
              "Một nửa",
            ],
            [
              "ROAS theo creative",
              <>
                doanh thu theo <C>ua_creative</C> ÷ chi phí
              </>,
              <>
                <C>ua_creative</C> luôn bằng <C>&quot;Unattributed&quot;</C>
              </>,
              "Mù cho tới khi nối attribution",
            ],
            [
              "eCPM",
              "doanh thu ÷ 1000 impression",
              "không đếm impression, không có event ad",
              "Mù",
            ],
            ["CPI", "chi phí ÷ lượt cài", "dữ liệu ở mạng quảng cáo", "Ngoài app"],
            ["CTR", "click ÷ impression", "mạng quảng cáo báo", "Ngoài app"],
            ["IPM", "install ÷ 1000 impression", "mạng quảng cáo báo", "Ngoài app"],
          ]}
        />
      </Section>

      <Section title="Tin tốt: SDK đã làm sẵn phần cohort">
        <Note tone="good" title="Chín trường gắn tự động vào mọi event">
          <p>
            <C>databuckets_event_tracker</C> tự stamp{" "}
            <C>install_day</C>, <C>retention_day</C>, <C>retention_hour</C>,{" "}
            <C>retention_minute</C>, <C>session_id</C>, <C>session_number</C>,{" "}
            <C>session_progress</C>, <C>event_date</C>, <C>event_local_hour</C>{" "}
            vào từng event. Bạn <b>không cần</b> tự thêm gì để phân tích cohort
            và retention.
          </p>
          <p>
            SDK cũng tự bắn <C>first_open</C> và <C>session_start</C>, nên kho
            dữ liệu có nhiều hơn 12 event mà app khai báo.
          </p>
        </Note>
        <Note tone="warn" title="Và chín trường đó là khoá cấm ghi đè">
          <p>
            Chúng nằm trong danh sách reserved key của SDK. Nếu ai đó cố đẩy{" "}
            <C>install_day</C> vào common properties, SDK <b>lặng lẽ bỏ qua</b>{" "}
            và chỉ ghi một dòng log. Trước khi lên kế hoạch &ldquo;thêm trường X
            vào common properties&rdquo;, phải đối chiếu danh sách này.
          </p>
        </Note>
      </Section>

      <Section title="Tin xấu: attribution chưa từng được nối">
        <Mermaid
          caption="Dây đứt ở hai chỗ, nên năm trường ua_* không bao giờ rời giá trị khởi tạo"
          chart={`flowchart LR
  A["Adjust SDK"] -.->|"chưa set<br/>attributionCallback"| B["handleAttribution()"]
  B -.->|"0 caller<br/>trong toàn repo"| C["UserProperties ua_*"]
  C --> D["setCommonProperties"]
  D --> E["mọi event mang ua_* =<br/>Unattributed vĩnh viễn"]
  style A stroke-dasharray: 4 4
  style B stroke-dasharray: 4 4`}
        />
        <Grid
          head={["Mắt xích", "Trạng thái", "Bằng chứng"]}
          rows={[
            [
              "Adjust gọi về app",
              "Chưa nối",
              <>
                <C>adjust_sdk.dart</C> dựng <C>AdjustConfig</C> nhưng không gán{" "}
                <C>attributionCallback</C>
              </>,
            ],
            [
              "App nhận attribution",
              "Hàm có, không ai gọi",
              <>
                <C>handleAttribution</C> chỉ xuất hiện đúng một lần: dòng khai
                báo
              </>,
            ],
            [
              "Đẩy vào common properties",
              "Thiếu bước cuối",
              <>
                <C>handleAttribution</C> chỉ sửa state cục bộ, không gọi{" "}
                <C>updateUserPropertiesEvent</C>
              </>,
            ],
            [
              "Trường uaTrackerName",
              "Bị rơi",
              <>
                <C>updateUserPropertiesEvent</C> nhận tham số này nhưng không
                truyền vào <C>copyWith</C>
              </>,
            ],
          ]}
        />
        <Note tone="warn" title="Hệ quả cho toàn bộ phần UA còn lại">
          <p>
            Mọi khuyến nghị dạng &ldquo;so ROAS giữa các creative&rdquo;,
            &ldquo;tắt campaign kém&rdquo;, &ldquo;xếp hạng network&rdquo; trong
            các trang sau <b>chưa chạy được</b> trên dữ liệu hiện tại. Nối
            attribution là việc đầu tiên, không phải việc thêm event ad.
          </p>
        </Note>
      </Section>

      <Section title="Đọc tiếp theo thứ tự nào">
        <Grid
          head={["Trang", "Trả lời câu hỏi"]}
          rows={[
            ["LTV & cohort", "một người dùng đáng giá bao nhiêu, đo thế nào"],
            ["CPI · ROAS", "được phép trả bao nhiêu cho một lượt cài"],
            ["Các giai đoạn launch", "khi nào mở rộng, mở ở đâu trước"],
            ["Ad creative", "làm quảng cáo thế nào và đo nó ra sao"],
            ["Chẩn đoán chỉ số", "số liệu xấu thì sửa creative hay sửa store"],
            ["Kế hoạch đo", "cần vá gì, theo thứ tự nào"],
          ]}
        />
      </Section>
    </>
  );
}
