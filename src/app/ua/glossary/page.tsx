import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, Note } from "@/components/bits";

export const metadata = { title: "Thuật ngữ" };

export default function Glossary() {
  return (
    <>
      <PageHeader
        eyebrow="UA · tra cứu"
        title="Thuật ngữ"
        lead="Mọi từ viết tắt dùng trong phần UA, kèm công thức khi có. Mở trang này song song khi đọc phần chẩn đoán."
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
                <C>tổng doanh thu ÷ số người trả tiền</C>. Luôn cao hơn ARPU.
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
                Tổng doanh thu một người tạo ra suốt vòng đời. Cách nhanh:{" "}
                <C>ARPDAU × số ngày sống trung bình</C>.
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
                Không bao giờ âm.
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
              "Mua hàng trong ứng dụng. Trong repo này đi qua RevenueCat.",
            ],
            [
              "IAA",
              "In-App Advertising",
              "Kiếm tiền bằng hiển thị quảng cáo. Trong repo này đi qua lib_admob_plugin.",
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
            thời gian; LTV là phần tích luỹ tới hết vòng đời. Đặt trần CPI theo
            ARPU tại mốc hoàn vốn, không theo LTV trọn đời.
          </p>
          <p>
            <b>CPI thấp không luôn tốt.</b> Trong tổ hợp 11.1 nó nghĩa là thu
            hút hiệu quả; trong 11.5 nó nghĩa là gần như không ai muốn nhấp.
            Phải đọc cùng các chỉ số khác.
          </p>
        </Note>
      </Section>
    </>
  );
}
