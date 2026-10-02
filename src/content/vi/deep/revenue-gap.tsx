import { Link } from "@/components/locale";

import { PageHeader, Section } from "@/components/page-header";
import { Grid, P, Ref } from "@/components/bits";
import { Assumed } from "@/components/usecase";

export const metadata = { title: "Chuyên sâu · AdMob lệch MMP" };

const link = "underline underline-offset-4";

export default function DeepRevenueGap() {
  return (
    <>
      <PageHeader
        eyebrow="Chuyên sâu · hỏi đáp"
        title="Vì sao doanh thu ad trên AdMob lệch với số trên MMP?"
        lead="Hai dashboard cùng nói về một dòng tiền nhưng đếm nó ở hai thời điểm, hai múi giờ, hai cách quy đổi tiền tệ. Lệch là bình thường; điều cần biết là mỗi nguồn lệch theo hướng nào, để không đi sửa một tích hợp vốn không hỏng."
      />

      <Section title="Ước tính hôm nay, số chốt cuối tháng">
        <P>
          Doanh thu trong báo cáo AdMob là ước tính. Google chỉ chốt số vào cuối
          tháng, khi các click và impression không hợp lệ bị trừ ra và tiền của
          chúng được hoàn cho nhà quảng cáo. MMP nhận paid event ngay lúc impression
          xảy ra, còn khoản trừ khi chốt số thì không đi theo đường đó. Vì vậy so số MMP với số AdMob đã chốt thì MMP gần như luôn
          cao hơn một chút, và phần chênh đó là invalid traffic đã bị trừ, không
          phải lỗi tích hợp.
        </P>
        <Ref href="https://support.google.com/admob/answer/6147072?hl=en">
          AdMob Help · Estimated vs finalized earnings
        </Ref>
      </Section>

      <Section title="Hai múi giờ, hai cách gọi là “một ngày”">
        <P>
          Mọi báo cáo AdMob dùng múi giờ của publisher, và ngày chuyển giờ mùa
          hè ở Mỹ làm một giờ trong báo cáo trống hoặc chứa dữ liệu của hai giờ.
          Đổi múi giờ tài khoản chỉ có hiệu lực từ lúc đổi, không áp ngược. Adjust
          ghi nhận theo UTC. Một app có tài khoản AdMob đặt giờ Việt Nam sẽ thấy
          bảy giờ doanh thu của mỗi &ldquo;ngày&rdquo; nằm ở hai ngày khác nhau
          trên hai dashboard; so theo ngày thì lệch, so theo tuần thì gần khớp.
        </P>
        <Ref href="https://support.google.com/admob/answer/2751663?hl=en">
          AdMob Help · Overview of your reports (time zone)
        </Ref>
        <Ref href="https://help.adjust.com/en/article/data-discrepancies">
          Adjust Help · Data discrepancies (Adjust timezone: UTC)
        </Ref>
      </Section>

      <Section title="Tỷ giá, độ chính xác, ad test, bản app cũ">
        <P>
          Paid event mang giá trị theo tiền tệ gốc; Adjust giữ mã tiền tệ gốc
          và quy đổi sang tiền tệ báo cáo. Tỷ giá dùng lúc quy đổi khác tỷ giá
          AdMob dùng thì hai bên lệch dù cùng đếm một impression; mức lệch phụ
          thuộc tỷ giá từng ngày nên không có con số cố định.
        </P>
        <P>
          Mỗi paid event có một trường độ chính xác: UNKNOWN, ESTIMATED,
          PUBLISHER_PROVIDED hoặc PRECISE. Giá trị ESTIMATED là ước lượng; với nguồn
          bidding, impression test trả giá trị 0 và độ chính xác
          UNKNOWN. Đếm cả ad test vào kho là kéo trung bình xuống; quên lọc thiết
          bị test khỏi so sánh là tự tạo ra chênh lệch.
        </P>
        <P>
          Adjust còn ghi một nguồn lệch dễ quên: ngay sau khi tích hợp plugin
          doanh thu, một phần người dùng vẫn chạy bản app cũ chưa có plugin, nên
          MMP thấp hơn AdMob tới khi đa số đã cập nhật. Nếu cùng một doanh thu
          vừa đi qua SDK vừa đi qua kết nối server-to-server, Adjust sẽ đếm hai
          lần.
        </P>
        <Ref href="https://developers.google.com/admob/android/impression-level-ad-revenue">
          AdMob · Impression-level ad revenue (precision, test impressions)
        </Ref>
        <Ref href="https://help.adjust.com/en/article/ad-revenue-sdk">
          Adjust Help · Mediation platform revenue SDK connections
        </Ref>
        <Ref href="https://help.adjust.com/en/article/ad-revenue-reporting">
          Adjust Help · Ad revenue reporting (currency fields)
        </Ref>
      </Section>

      <Section title="Ví dụ số: một tháng, năm nguồn lệch">
        <P>
          Tháng 9, paid event gửi về MMP cộng lại 10 000 USD
          <Assumed />. Đối chiếu với số AdMob đã chốt:
        </P>
        <Grid
          head={["Nguồn lệch", "AdMob − MMP (USD)", "Ghi chú"]}
          rows={[
            ["Invalid traffic bị trừ khi chốt", "− 300", "chỉ AdMob trừ"],
            ["7 giờ đầu tháng 10 theo giờ VN nằm trong tháng 9 theo UTC", "± 80", "tuỳ doanh thu đầu và cuối tháng"],
            ["Tỷ giá quy đổi khác nhau", "± 50", "hai chiều"],
            ["2% người dùng còn bản cũ chưa có plugin", "+ 200", "MMP không thấy phần này"],
            ["Thiết bị test chưa lọc", "≈ 0", "giá trị gần 0"],
          ]}
        />
        <P>
          Tổng lại, chênh lệch vài phần trăm là cộng dồn của những nguồn hoàn
          toàn bình thường. Thứ đáng lo là chênh lệch đột ngột tăng hoặc đổi
          chiều sau một bản phát hành: đó thường là dấu hiệu paid event bị gửi
          hai lần, gửi sai đơn vị (quên chia micros trên Flutter), hoặc ngừng
          gửi ở một format.
        </P>
      </Section>

      <Section title="Đối chiếu theo tuần và theo xu hướng">
        <P>
          Dùng số AdMob đã chốt làm nguồn sự thật cho doanh thu, và dùng số MMP
          để phân bổ doanh thu đó theo campaign. So hai bên theo tuần hoặc tháng,
          cùng một múi giờ nếu được, và theo dõi tỉ lệ chênh theo thời gian thay
          vì con số tuyệt đối. Câu hỏi kiểm tra: tỉ lệ chênh tuần này có nằm
          trong khoảng của các tuần trước không? Nếu có, không cần làm gì.
        </P>
        <p className="mt-3 text-sm text-muted-foreground">
          Cách gửi paid event cho cả MMP lẫn kho phân tích ở trang{" "}
          <Link href="/tracking" className={link}>
            Tracking
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
