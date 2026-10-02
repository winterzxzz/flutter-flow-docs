import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, Note } from "@/components/bits";

export const metadata = { title: "Thuật ngữ" };

export default function Glossary() {
  return (
    <>
      <PageHeader
        eyebrow="UA · tra cứu"
        title="Thuật ngữ"
        lead="Từ viết tắt và thuật ngữ dùng trên toàn site, kèm công thức khi có. Trang tra cứu nên giữ dạng bảng; mở song song khi đọc phần UA và Chuyên sâu."
      />

      <Section title="Doanh thu trên đầu người">
        <Grid
          head={["Viết tắt", "Đầy đủ", "Nghĩa và công thức"]}
          rows={[
            [
              "ARPU",
              "Average Revenue Per User",
              <>
                Doanh thu trung bình trên mỗi người dùng ={" "}
                <C>tổng doanh thu ÷ tổng người dùng</C>
              </>,
            ],
            [
              "ARPPU",
              "Average Revenue Per Paying User",
              <>
                Chỉ tính người có trả tiền ={" "}
                <C>tổng doanh thu ÷ số người trả tiền</C>. Không thấp hơn ARPU khi
                cả hai tính trên cùng một loại doanh thu (ví dụ chỉ IAP).
              </>,
            ],
            [
              "ARPDAU",
              "Average Revenue Per Daily Active User",
              <>
                Doanh thu trong ngày ÷ DAU của ngày đó. Là đầu vào của công thức
                LTV nhanh.
              </>,
            ],
            [
              "LTV",
              "Life-Time Value",
              <>
                <b>LTV Dn</b>: doanh thu tích luỹ trên mỗi người của một cohort
                tới ngày n. <b>LTV trọn đời</b>: con số dự báo cho cả vòng đời.
                Cách ước nhanh: <C>ARPDAU × số ngày hoạt động trung bình</C>.
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="Chi phí và hiệu quả quảng cáo">
        <Grid
          head={["Viết tắt", "Đầy đủ", "Nghĩa và công thức"]}
          rows={[
            [
              "CPI",
              "Cost Per Install",
              "Chi phí cho mỗi lượt cài. Biến động theo nền tảng, quốc gia, thể loại và mùa.",
            ],
            [
              "ROAS",
              "Return on Ad Spend",
              <>
                <C>doanh thu ÷ chi phí quảng cáo</C>. Hoà vốn ở <C>1</C> (100%).
              </>,
            ],
            [
              "CTR",
              "Click-Through Rate",
              "Tỉ lệ nhấp trên số lượt hiển thị. Đo mức độ quảng cáo gây chú ý.",
            ],
            [
              "IPM",
              "Installs Per Mille",
              "Số lượt cài trên mỗi 1000 lượt hiển thị. Đo khả năng biến hiển thị thành cài đặt.",
            ],
            [
              "eCPM",
              "effective Cost Per Mille",
              "Doanh thu ước tính trên mỗi 1000 lượt hiển thị quảng cáo. Dùng để xếp hạng placement.",
            ],
          ]}
        />
      </Section>

      <Section title="Người dùng và vòng đời">
        <Grid
          head={["Viết tắt", "Đầy đủ", "Nghĩa"]}
          rows={[
            ["DAU", "Daily Active Users", "Số người hoạt động trong ngày."],
            [
              "FTUE",
              "First Time User Experience",
              "Trải nghiệm lần đầu sau khi cài. Quảng cáo hứa gì thì FTUE phải trả cái đó, nếu không sẽ churn sớm.",
            ],
            [
              "Cohort",
              "—",
              "Nhóm người dùng cài cùng một ngày, theo dõi chung theo thời gian.",
            ],
            [
              "Retention D1/D7/D30",
              "—",
              "Tỉ lệ người còn quay lại sau 1, 7, 30 ngày kể từ ngày cài.",
            ],
            [
              "Payback Period",
              "Kỳ hoàn vốn",
              "Khoảng thời gian kỳ vọng thu hồi chi phí thu hút. Thường 30–90 ngày hoặc 180–365 ngày.",
            ],
            [
              "Organic",
              "—",
              "Lượt cài không gán được cho nguồn trả phí nào; phải tách riêng, không coi như một campaign.",
            ],
            [
              "Country Tiers",
              "Phân hạng quốc gia",
              "Tier 1 ARPU và CPI cao (Mỹ, Canada, Anh) · Tier 2 trung bình (Mexico, Ba Lan, Thái Lan) · Tier 3 thấp (Việt Nam, Iraq, Moldova).",
            ],
          ]}
        />
      </Section>

      <Section title="Kiếm tiền">
        <Grid
          head={["Viết tắt", "Đầy đủ", "Nghĩa"]}
          rows={[
            [
              "UA",
              "User Acquisition",
              "Hoạt động thu hút người dùng mới, thường bằng quảng cáo trả phí.",
            ],
            [
              "IAP",
              "In-App Purchase",
              "Mua hàng trong ứng dụng: hàng tiêu hao, mở khoá vĩnh viễn, subscription.",
            ],
            [
              "IAA",
              "In-App Advertising",
              "Kiếm tiền bằng hiển thị quảng cáo: banner, interstitial, rewarded, app open, native.",
            ],
            [
              "ASO",
              "App Store Optimization",
              "Tối ưu trang cửa hàng: tiêu đề, mô tả, ảnh chụp, video.",
            ],
          ]}
        />
        <Note tone="info" title="Hai từ dễ nhầm">
          <p>
            <b>ARPU và LTV.</b> ARPU là doanh thu trung bình trong một khoảng
            thời gian; LTV Dn là phần tích luỹ tới ngày n. Đặt trần CPI theo LTV
            tại mốc hoàn vốn, không theo LTV trọn đời.
          </p>
          <p>
            <b>CPI thấp không luôn tốt.</b> Trong tổ hợp &ldquo;thắng mọi
            khâu&rdquo; nó nghĩa là thu hút hiệu quả; trong &ldquo;concept
            hỏng&rdquo; nó nghĩa là gần như không ai muốn nhấp.
            Phải đọc cùng các chỉ số khác.
          </p>
        </Note>
      </Section>

      <Section title="Đo lường và nền tảng">
        <Grid
          head={["Viết tắt", "Đầy đủ", "Nghĩa"]}
          rows={[
            ["MMP", "Mobile Measurement Partner", "Bên gán lượt cài cho nguồn và nhận doanh thu để tính ROAS, như Adjust, AppsFlyer."],
            ["Tracker link", "—", "Link của MMP gắn vào quảng cáo; dùng một link test để kiểm attribution đầu-cuối."],
            ["Paid event · ILRD", "Impression-Level Revenue Data", "Sự kiện doanh thu cho từng impression mà Ad SDK phát ra: giá trị, tiền tệ, độ chính xác."],
            ["Fill · no-fill", "—", "Request có hay không nhận được ad từ nguồn."],
            ["Match rate", "—", <><C>matched ÷ request</C>. Chỉ số chẩn đoán, không phải mục tiêu.</>],
            ["Show rate", "—", <><C>impression ÷ matched</C>. Thấp nghĩa là ad đã xin mà không dùng.</>],
            ["Giãn cách", "—", "Khoảng tối thiểu giữa hai lần show ad toàn màn hình, do app tự quản. Khác frequency capping trên console AdMob."],
            ["SSV", "Server-Side Verification", "Server nhận xác nhận phần thưởng rewarded trực tiếp từ AdMob."],
            ["UMP", "User Messaging Platform", "SDK consent của Google cho GDPR và thông điệp IDFA."],
            ["ATT · IDFA", "App Tracking Transparency · Identifier for Advertisers", "Prompt của iOS xin quyền truy cập IDFA để tracking."],
            ["Entitlement", "—", "Quyền dùng do store hoặc server xác nhận. Premium chỉ là tên gói."],
            ["RTDN", "Real-time Developer Notifications", "Thông báo trạng thái subscription từ Google Play tới server."],
          ]}
        />
      </Section>
    </>
  );
}
