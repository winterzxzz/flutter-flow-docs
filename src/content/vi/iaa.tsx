import { Link } from "@/components/locale";

import { Figure, Lanes, Rail, States } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, P, Ref } from "@/components/bits";
import { UseCase } from "@/components/usecase";

export const metadata = { title: "IAA · Format & vòng đời" };

const link = "underline underline-offset-4";

export default function Iaa() {
  return (
    <>
      <PageHeader
        eyebrow="IAA · khái niệm"
        title="Format và vòng đời quảng cáo"
        lead="Ad “không hiện” hiếm khi là lỗi của SDK. Thường thì ad đã hết hạn, đã bị show một lần rồi, hoặc bị một cổng chặn lại mà không báo cho màn hình đang chờ nó. Năm format khác nhau ở cách chiếm màn hình, nhưng cùng đi qua một vòng đời và cùng phải qua những cổng đó."
      />

      <Section title="Năm format">
        <Grid
          head={["Format", "Chiếm màn hình", "Đặt ở đâu", "Cần nhớ"]}
          rows={[
            ["Banner", "một dải cố định", "đáy hoặc đỉnh màn nội dung", "tự làm mới theo thiết lập console"],
            ["Interstitial", "toàn màn hình, đóng được", "điểm chuyển tự nhiên giữa hai đoạn nội dung", "show một lần; cần cổng giãn cách"],
            ["Rewarded", "toàn màn hình, người dùng chủ động xem", "đổi lấy phần thưởng", "thưởng theo callback, không theo nút đóng"],
            ["App open", "toàn màn hình", "lúc mở app hoặc quay lại từ nền", "có hạn sử dụng tính từ lúc load"],
            ["Native", "hoà vào layout", "trong feed, danh sách", "app tự dựng giao diện từ thành phần ad"],
          ]}
        />
        <Ref href="https://developers.google.com/admob/android/interstitial">
          AdMob · Interstitial ads
        </Ref>
      </Section>

      <Section title="Ad đã load có hạn, và chỉ show được một lần">
        <P>
          Mọi format đi qua bốn trạng thái: Idle, Loading, Ready, Showing. Hai
          điều làm vòng đời này khác với một request mạng bình thường. Thứ nhất,
          Ready không phải trạng thái bền: ad đã load có hạn sử dụng, và ad cũ
          hiện ra vẫn có thể không được tính doanh thu. Thứ hai, ad toàn màn
          hình (interstitial, rewarded, app open) chỉ show được một lần; show
          xong thì bỏ tham chiếu và load cái mới.
        </P>
        <Figure caption="Failed và timeout là nơi chính sách thử lại quyết định; Ready có thể quay về Idle vì hết hạn">
          <States
            main={[
              { name: "Idle", enter: [""], next: "load" },
              {
                name: "Loading",
                next: "loaded",
                exits: [
                  { on: "failed to load", to: "Failed" },
                  { on: "timeout", to: "Idle" },
                ],
              },
              { name: "Ready", next: "show", exits: [{ on: "hết hạn", to: "Idle" }] },
              {
                name: "Showing",
                tone: "good",
                exits: [
                  { on: "dismissed", to: "Idle" },
                  { on: "failed to show", to: "Idle" },
                ],
              },
            ]}
            side={[
              {
                name: "Failed",
                tone: "warn",
                exits: [
                  { on: "còn lượt thử / còn unit", to: "Loading" },
                  { on: "hết lượt", to: "Idle" },
                ],
              },
            ]}
          />
        </Figure>
        <P>
          Toàn app chỉ nên có một ad toàn màn hình tại một thời điểm, nên app
          open và interstitial phải biết về nhau qua một cờ &ldquo;đang
          hiện&rdquo; chung. Khi load lại trong lúc lần trước chưa xong, callback
          của lần cũ phải bị bỏ qua và ad thừa phải được giải phóng; nếu không,
          một ad về muộn có thể ghi đè ad mới hơn.
        </P>
      </Section>

      <Section title="Mọi nhánh bị chặn phải báo “đã đóng”">
        <P>
          Trước mỗi lệnh load hay show có một chuỗi kiểm tra, rẻ trước đắt sau:
          người dùng có entitlement không, consent cho phép request chưa, format
          có đang bật trong config không, có mạng không, đã qua cổng giãn cách
          chưa. Kiểm tra entitlement dựa trên dữ liệu từ store hoặc server, không
          dựa trên một cờ tự đặt sau khi bấm mua. Kiểm tra mạng giúp không đốt
          request khi biết chắc sẽ hỏng, nên tỉ lệ fill không bị kéo tụt.
        </P>
        <Figure caption="Bị chặn ở đâu thì cũng kết thúc bằng cùng tín hiệu như khi ad đóng">
          <Rail
            sink={{ label: "bỏ qua · báo đã đóng" }}
            rows={[
              { label: "load / show" },
              { tone: "ask", label: "có entitlement ?", exit: { label: "có" }, down: "không" },
              { tone: "ask", label: "consent cho request ads ?", exit: { label: "không" }, down: "có" },
              { tone: "ask", label: "format bật trong config ?", exit: { label: "không" }, down: "có" },
              { tone: "ask", label: "có mạng ?", exit: { label: "không" }, down: "có" },
              { tone: "ask", label: "qua cổng giãn cách ?", exit: { label: "không" }, down: "có" },
              { tone: "good", label: "load / show" },
            ]}
          />
        </Figure>
        <P>
          Luồng UI thường viết theo kiểu &ldquo;show interstitial, đóng xong thì
          chuyển màn&rdquo;. Nếu một cổng chặn mà không gọi callback đóng, người
          dùng kẹt lại ở màn cũ. Bản debug thì nên dùng ad unit test: Google
          khuyến nghị bật test ads khi phát triển để tránh invalid activity.
        </P>
        <Ref href="https://developers.google.com/admob/android/test-ads">
          AdMob · Enable test ads
        </Ref>
      </Section>

      <Section title="Mediation chọn nguồn theo giá trung bình hoặc theo giá hiện tại">
        <P>
          Waterfall mediation gọi lần lượt từng nguồn theo eCPM trung bình bạn
          đặt, không theo giá nguồn sẵn sàng trả cho impression này. Bidding cho
          các nguồn đấu giá theo thời gian thực cho cùng một request. Một số app
          còn tự dựng waterfall phía app bằng mảng nhiều ad unit, hỏng cái này
          thì thử cái kế: tăng fill nhưng mỗi bước là thêm một request và thêm
          độ trễ. So sánh chi tiết ở{" "}
          <Link href="/deep/bidding" className={link}>
            Bidding khác waterfall ở đâu
          </Link>
          ; thử lại, timeout và hạn sử dụng từng format ở{" "}
          <Link href="/iaa/load" className={link}>
            Load, thử lại, làm mới
          </Link>
          .
        </P>
        <Ref href="https://support.google.com/admob/answer/13420272">
          AdMob Help · Mediation (bidding, waterfall)
        </Ref>
      </Section>

      <Section title="Paid event: một impression, một sự kiện doanh thu">
        <P>
          Mỗi impression có thể kèm một paid event mang giá trị, mã tiền tệ và
          độ chính xác (<C>UNKNOWN</C>, <C>ESTIMATED</C>,{" "}
          <C>PUBLISHER_PROVIDED</C>, <C>PRECISE</C>). Trên Android và Flutter,
          giá trị tính bằng micros: 5 000 nghĩa là 0,005 đơn vị tiền tệ, quên
          chia một triệu là doanh thu phình gấp triệu lần. Tính năng phải được
          bật trên AdMob và cần SDK đủ mới. Lúc test với nguồn bidding,
          impression test trả giá trị 0 và độ chính xác UNKNOWN, nên số 0 lúc
          test không có nghĩa là tích hợp hỏng. Gửi paid event đi đâu và vì sao
          phải gửi cả hai nơi ở trang{" "}
          <Link href="/tracking" className={link}>
            Tracking
          </Link>
          .
        </P>
        <Ref href="https://developers.google.com/admob/android/impression-level-ad-revenue">
          AdMob · Impression-level ad revenue
        </Ref>
      </Section>

      <Section title="Usecase">
        <UseCase
          n="1"
          title="Mua premium giữa phiên mà banner vẫn nằm đó"
          situation={
            <p>
              Người dùng đang ở màn chính, có banner ở đáy, một native trong
              feed, và một interstitial đã preload. Họ mua gói tháng. Ba phút
              sau họ chụp màn hình gửi hỗ trợ: banner vẫn còn.
            </p>
          }
          flow={
            <Figure>
              <Lanes
                actors={[
                  { id: "P", label: "Paywall" },
                  { id: "E", label: "Entitlement" },
                  { id: "A", label: "Lớp quảng cáo" },
                ]}
                steps={[
                  { from: "P", to: "E", text: "mua thành công, đã verify" },
                  { from: "E", to: "A", text: "phát sự kiện có quyền" },
                  { self: "A", text: "gỡ banner, native đang hiện" },
                  { self: "A", text: "huỷ interstitial, app open đã preload" },
                  { self: "A", text: "dừng timer làm mới" },
                  { note: "A", text: "mọi lệnh show sau đó đi nhánh bỏ qua" },
                ]}
              />
            </Figure>
          }
          why={
            <p>
              App chỉ kiểm tra entitlement ở lệnh show tiếp theo. Banner đang
              hiện không có lệnh show nào mới nên nằm đó tới khi đổi màn, và
              timer làm mới native vẫn tiếp tục gửi request.
            </p>
          }
          lesson="Trạng thái thay đổi giữa chừng phải được phát đi cho những thành phần đang chạy, không chỉ được hỏi ở lần gọi kế tiếp."
        />
        <UseCase
          n="2"
          title="Mất mạng đúng lúc bấm “Bài tiếp”"
          situation={
            <p>
              App luyện từ vựng show interstitial sau mỗi bài. Người dùng trên
              tàu điện mất sóng đúng lúc bấm &ldquo;Bài tiếp&rdquo;, và nút như
              bị đơ.
            </p>
          }
          why={
            <p>
              Cổng mạng chặn đúng, nhưng chỉ return mà không gọi callback đóng.
              Màn kế tiếp đang chờ callback đó để mở, nên không bao giờ mở.
            </p>
          }
          lesson="Một lớp chặn tốt là lớp mà người gọi không cần biết nó tồn tại: mọi đường ra đều trả cùng một tín hiệu."
        />
        <UseCase
          n="3"
          title="“Xem để nhận thưởng” quay mãi không dừng"
          situation={
            <p>
              Game giải đố cho thêm một gợi ý nếu xem rewarded. Người dùng bấm
              nút, request no-fill, spinner quay tới khi họ thoát game.
            </p>
          }
          why={
            <p>
              App chỉ load rewarded khi người dùng bấm. Khi no-fill, không có
              nhánh nào kết thúc. Có ba lối thoát hợp lý: ẩn nút khi chưa có ad
              Ready (tốt nhất, preload khi người dùng vào màn), báo &ldquo;chưa
              có video, thử lại sau&rdquo;, hoặc vẫn trao thưởng. Trao thưởng khi
              không có ad là đổi doanh thu lấy thiện cảm, nên chọn có chủ đích.
            </p>
          }
          lesson="Nút gắn với một tài nguyên bất định phải phản ánh trạng thái của tài nguyên đó, và mọi lần chờ phải có điểm kết thúc."
        />
      </Section>
    </>
  );
}
