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
        lead="Mỗi chỉ số UA cần một loại dữ liệu cụ thể. Trang này đối chiếu công thức với những gì codebase hiện tại thực sự bắn ra, để biết chỉ số nào tin được và chỉ số nào đang mù."
      />

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Event hiện có" value="12" sub="0 event ad" />
        <Stat label="Trường attribution" value="5" sub="ua_network → ua_creative" />
        <Stat label="Đo được đủ" value="4/11" sub="chỉ số UA" />
        <Stat label="Mù hoàn toàn" value="3/11" sub="cần network hoặc event mới" />
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
    UAP["ua_* gắn vào mọi event"]
  end
  SPEND --> ROAS{"ROAS"}
  IAPREV --> ROAS
  ADREV --> ROAS
  ADREV -.->|thiếu cầu nối| DB
  style ADREV stroke-dasharray: 4 4`}
        />
        <Note tone="warn" title="Doanh thu bị chẻ làm đôi">
          <p>
            Doanh thu IAP nằm trong DataBuckets. Doanh thu IAA chỉ nằm trong
            Adjust. Không hệ nào giữ cả hai, nên mọi chỉ số doanh thu trên đầu
            người đều phải ghép thủ công ở tầng phân tích.
          </p>
        </Note>
      </Section>

      <Section title="Từng chỉ số đo được tới đâu">
        <Grid
          head={["Chỉ số", "Cần gì", "Code hiện có", "Kết luận"]}
          rows={[
            [
              "ARPU (IAP)",
              <>doanh thu IAP ÷ số user</>,
              <>
                <C>iap_purchase_success</C> + <C>user_id</C>
              </>,
              "Đo được",
            ],
            [
              "ARPU (IAA)",
              <>doanh thu ad ÷ số user</>,
              <>chỉ có <C>AdjustAdRevenue</C>, không có event</>,
              "Mù trong DataBuckets",
            ],
            [
              "ARPU tổng",
              "cộng hai nguồn trên",
              "hai hệ tách rời, không cùng khoá",
              "Phải ghép tay",
            ],
            [
              "ARPDAU",
              "doanh thu ngày ÷ DAU",
              <>
                <C>user_id</C> cho DAU; doanh thu thiếu nửa IAA
              </>,
              "Một nửa",
            ],
            [
              "LTV",
              "doanh thu tích luỹ theo cohort",
              <>
                <C>install_day</C> và <C>retention_day</C> chỉ gửi trong{" "}
                <C>iap_verify</C>, không có trong common properties
              </>,
              "Thiếu chiều cohort",
            ],
            [
              "Retention D1/D7/D30",
              "ngày cài + ngày hoạt động",
              <>
                <C>activeDay</C> có; <C>install_day</C> không có trong event
              </>,
              "Thiếu mốc gốc",
            ],
            [
              "CPI",
              "chi phí ÷ lượt cài",
              "dữ liệu nằm ở mạng quảng cáo",
              "Ngoài app",
            ],
            [
              "ROAS theo creative",
              <>doanh thu theo <C>ua_creative</C> ÷ chi phí</>,
              <>
                <C>ua_creative</C> gắn sẵn vào mọi event
              </>,
              "Đo được phần IAP",
            ],
            ["CTR", "click ÷ impression", "mạng quảng cáo báo", "Ngoài app"],
            ["IPM", "install ÷ 1000 impression", "mạng quảng cáo báo", "Ngoài app"],
            [
              "eCPM",
              "doanh thu ÷ 1000 impression",
              <>
                <C>onPaidEvent</C> có giá trị nhưng không đếm impression
              </>,
              "Mù",
            ],
          ]}
        />
      </Section>

      <Section title="Tài sản đang có mà dễ bị bỏ quên">
        <Note tone="good" title="5 trường attribution gắn vào MỌI event">
          <p>
            <C>ua_network</C> · <C>ua_campaign</C> · <C>ua_adgroup</C> ·{" "}
            <C>ua_creative</C> · <C>ua_tracker_name</C> được đẩy bằng{" "}
            <C>setCommonProperties</C>, nên mọi event hành vi đều biết user đến
            từ creative nào.
          </p>
          <p>
            Nghĩa là <b>đã có thể</b> trả lời: creative nào mang về người mua
            IAP, creative nào mang về người xem hết onboarding, creative nào
            mang về người rơi ngay ở splash. Đây là phần khó nhất của chương 11
            và nó đã sẵn sàng — chỉ là chưa dùng.
          </p>
        </Note>
        <Mermaid
          caption="Đường đã thông cho IAP, còn đứt ở nhánh IAA"
          chart={`flowchart LR
  A["Adjust attribution"] --> B["handleAttribution()"]
  B --> C["UserProperties ua_*"]
  C --> D["setCommonProperties"]
  D --> E["mọi event mang theo creative"]
  E --> F["ROAS theo creative · phần IAP"]
  E -.->|thiếu ad event| G["ROAS theo creative · phần IAA"]
  style G stroke-dasharray: 4 4`}
        />
      </Section>

      <Section title="Đọc tiếp theo thứ tự nào">
        <Grid
          head={["Trang", "Trả lời câu hỏi"]}
          rows={[
            ["LTV & cohort", "một người dùng đáng giá bao nhiêu, và đo thế nào"],
            ["CPI · ROAS", "được phép trả bao nhiêu cho một lượt cài"],
            ["Các giai đoạn launch", "khi nào mở rộng, mở ở đâu trước"],
            ["Ad creative", "làm quảng cáo thế nào và đo nó ra sao"],
            ["Chẩn đoán chỉ số", "số liệu xấu thì sửa creative hay sửa store"],
            ["Kế hoạch đo", "cần thêm event gì để hết mù"],
          ]}
        />
      </Section>
    </>
  );
}
