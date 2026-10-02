import Link from "next/link";

import { Figure, Lanes, Rail, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, P, Ref, Stat } from "@/components/bits";
import { Assumed, UseCase } from "@/components/usecase";

export const metadata = { title: "IAA · Load, thử lại, làm mới" };

const link = "underline underline-offset-4";

export default function IaaLoad() {
  return (
    <>
      <PageHeader
        eyebrow="IAA · cơ chế"
        title="Load, thử lại, làm mới"
        lead="Khi ad không hiện, nguyên nhân thường nằm ở luật quanh SDK chứ không ở SDK: ad đã hết hạn, cổng giãn cách ghi mốc sai lúc, hay giá trị trên console bị một hằng số ghi đè. Mỗi format có luật load, thử lại và làm mới riêng, và mỗi luật có một chỗ hay bị hiểu sai."
      />

      <div className="mb-10 grid gap-2 sm:grid-cols-3 sm:gap-3">
        <Stat label="App open hết hạn" value="4 giờ" sub="khuyến nghị của Google" />
        <Stat label="Interstitial preload" value="1 giờ" sub="Google gợi ý làm mới cache" />
        <Stat label="Banner refresh" value="30–150s" sub="đặt trên console" />
      </div>

      <Section title="Thử lại chỉ cứu được lỗi thoáng qua">
        <P>
          Một lần load hỏng có thể do mạng chập chờn hoặc do nguồn không có ad
          để trả (no-fill). Thử lại có ích với lỗi mạng; với no-fill thì gọi lại
          ngay gần như chắc chắn hỏng tiếp, chỉ làm phình số request. Vì vậy
          chính sách thử lại có hai trục độc lập: thử lại cùng unit bao nhiêu
          lần, cách nhau bao lâu, và có chuyển sang unit khác không.
        </P>
        <Figure caption="Hết lượt cho một unit thì mới chuyển unit; hết unit thì dừng và gỡ chỗ đặt">
          <Tree
            root={{
              label: "load(unit[i])",
              kids: [
                {
                  tone: "ask",
                  label: "kết quả",
                  kids: [
                    { when: "loaded", tone: "good", label: "Ready · đặt lại i = 0" },
                    {
                      when: "failed",
                      tone: "ask",
                      label: "còn lượt thử cho unit này ?",
                      kids: [
                        {
                          when: "còn",
                          label: "chờ backoff",
                          kids: [{ tone: "plain", label: "↺ load(unit[i])" }],
                        },
                        {
                          when: "hết",
                          tone: "ask",
                          label: "còn unit kế tiếp ?",
                          kids: [
                            {
                              when: "còn",
                              label: "i++",
                              kids: [{ tone: "plain", label: "↺ load(unit[i])" }],
                            },
                            { when: "hết", tone: "mute", label: "Idle · i = 0", sub: "gỡ chỗ đặt ad" },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            }}
          />
        </Figure>
        <Grid
          head={["Tham số", "Giá trị tham khảo", "Lý do"]}
          rows={[
            ["Số lần thử cùng unit", "khoảng 3", "đủ cho lỗi mạng thoáng qua"],
            ["Khoảng chờ giữa các lần", "tăng dần, từ vài giây", "dự án tham chiếu từng thử lại liền ba lần không chờ và chỉ làm phình request"],
            ["Timeout chờ ad toàn màn hình lúc cần show", "khoảng 10–15 giây", "dài hơn thì người dùng đã đi tiếp"],
            ["Waterfall phía app", "2–3 unit, giá sàn giảm dần", "mỗi bước thêm một request và độ trễ"],
          ]}
        />
        <P>
          Các con số trên là điểm xuất phát lấy từ một dự án thật, không phải
          luật. Trang hướng dẫn interstitial của AdMob không đưa ra số lần thử
          lại; mẫu code của họ khi chưa có ad là cho luồng app đi tiếp rồi load
          lại ở lượt sau. Thử lại dồn dập còn kéo tụt match rate mà không thêm
          impression nào, xem{" "}
          <Link href="/deep/match-rate" className={link}>
            Vì sao match rate thấp
          </Link>
          .
        </P>
      </Section>

      <Section title="Cổng giãn cách: một đồng hồ chung, ghi mốc khi ad thật sự hiện">
        <P>
          Giãn cách là khoảng tối thiểu giữa hai lần show ad toàn màn hình, do
          app tự quản. Giá trị tham khảo là 30 giây, đặt trên Remote Config để
          chỉnh không cần ra bản mới. Đồng hồ phải dùng chung cho mọi chỗ gọi
          interstitial; nếu mỗi màn tự đếm, người dùng đi qua ba màn là gặp ba
          ad. Mốc được ghi khi ad thật sự hiện, không phải khi có yêu cầu show,
          nếu không một lần bị chặn cũng đẩy lùi lần sau.
        </P>
        <Figure caption="Ad kế tiếp được load ngay khi ad trước đóng, nên giãn cách mới là thứ quyết định nhịp">
          <Rail
            sink={{ label: "báo đã đóng · đi tiếp" }}
            rows={[
              { label: "yêu cầu show" },
              {
                tone: "ask",
                label: "qua cổng chung ?",
                sub: "entitlement · consent · mạng",
                exit: { label: "không" },
                down: "có",
              },
              {
                tone: "ask",
                label: "now − lần show cuối ≥ giãn cách ?",
                exit: { label: "không" },
                down: "có",
              },
              { tone: "ask", label: "ad Ready ?", exit: { label: "có", to: "show" }, down: "chưa" },
              { label: "load và chờ trong timeout", exit: { label: "quá hạn" }, down: "kịp" },
              { tone: "good", label: "show" },
              { label: "ghi mốc lần show cuối", sub: "load ad kế tiếp" },
            ]}
          />
        </Figure>
        <P>
          Đừng nhầm cơ chế này với frequency capping của AdMob. Frequency
          capping cấu hình trên console và giới hạn số impression mỗi người dùng
          trong một khoảng thời gian, cho cả app hoặc từng ad unit; giãn cách
          của app thì nằm trong code và chặn lệnh show trước khi nó tới SDK. Hai
          cơ chế chồng lên nhau được, nên khi ad không hiện thì phải kiểm cả
          hai. Ad preload để lâu cũng có hạn: Google ghi interstitial hết hạn
          sau một giờ, nên cache ad preload cần làm mới mỗi giờ. Preload quá sớm
          cho một điểm hiện ít người tới là ad bỏ phí, xem{" "}
          <Link href="/deep/preload" className={link}>
            Vì sao ad đã load mà không kịp hiện
          </Link>
          .
        </P>
        <Ref href="https://developers.google.com/admob/android/interstitial">
          AdMob · Interstitial ads (ads expire after an hour)
        </Ref>
        <Ref href="https://support.google.com/admob/answer/6244508?hl=en">
          AdMob Help · Set frequency caps for apps or ad units
        </Ref>
      </Section>

      <Section title="App open: còn hạn, qua giãn cách, không chồng lên ad khác">
        <P>
          Google ghi rõ app open ad hết hạn sau bốn giờ: ad render quá bốn giờ
          kể từ lúc request có thể không còn hợp lệ và không được tính doanh
          thu. App lưu mốc lúc load xong và kiểm tra trước khi show; hết hạn thì
          bỏ ad cũ, load mới cho lần sau. Người dùng rời app vì bấm vào app open
          ad thì khi quay lại không nên gặp ngay một app open khác.
        </P>
        <P>
          Với cold start, cách Google khuyến nghị là show app open từ màn
          loading trong lúc app đang tải tài nguyên, và họ gợi ý chỉ hiện app
          open sau khi người dùng đã dùng app vài lần. Giãn cách tham khảo giữa
          hai lần show là 30–60 giây, và app open với interstitial cần biết về
          nhau để không hiện sát nhau.
        </P>
        <Figure caption="Ba cổng riêng của app open, sau các cổng chung">
          <Rail
            sink={{ label: "bỏ qua" }}
            rows={[
              { label: "App vào foreground" },
              {
                tone: "ask",
                label: "đang có ad toàn màn hình khác ?",
                exit: { label: "có" },
                down: "không",
              },
              {
                tone: "ask",
                label: "vừa quay lại sau khi bấm ad ?",
                exit: { label: "có" },
                down: "không",
              },
              {
                tone: "ask",
                label: "ad còn hạn ?",
                sub: "load chưa quá 4 giờ",
                exit: { label: "không", note: "bỏ ad cũ · load lại" },
                down: "có",
              },
              { tone: "ask", label: "qua giãn cách ?", exit: { label: "không" }, down: "có" },
              { tone: "good", label: "show" },
              { label: "ghi mốc · load ad kế tiếp" },
            ]}
          />
        </Figure>
        <Ref href="https://developers.google.com/admob/android/app-open">
          AdMob · App open ads (consider ad expiration, best practices)
        </Ref>
      </Section>

      <Section title="Native: app tự làm mới, và phải tự giải phóng">
        <P>
          AdMob chỉ có tuỳ chọn tự làm mới trên console cho banner, nên native
          muốn làm mới thì app tự load ad mới sau một khoảng (tham khảo 30–60
          giây), và chỉ sau khi ad cũ đã có impression. Ad native cũ phải được
          destroy khi thay bằng ad mới hoặc khi màn hình bị huỷ, nếu không bộ nhớ
          rò dần theo mỗi lần làm mới. Trong lúc load, giữ chỗ bằng skeleton;
          load hỏng thì gỡ chỗ đặt thay vì để khung trống.
        </P>
        <Ref href="https://developers.google.com/admob/android/native/advanced">
          AdMob · Native advanced (destroy an ad)
        </Ref>
      </Section>

      <Section title="Banner: để console làm mới, đừng thêm timer">
        <P>
          AdMob tự làm mới banner theo thiết lập ad unit: dùng tốc độ do Google
          tối ưu (được khuyến nghị), đặt tuỳ chỉnh trong khoảng 30–150 giây, hoặc
          tắt. Khi console đã bật làm mới mà app còn tự load lại theo timer, hai
          cơ chế chồng nhau. Anchored adaptive banner được request theo một bề
          ngang cụ thể, nên khi bề ngang đổi (xoay màn hình, chia đôi màn hình)
          thì kích thước cũ không còn khớp và phải request lại.
        </P>
        <Ref href="https://support.google.com/admob/answer/3245199">
          AdMob Help · Banner refresh rate
        </Ref>
      </Section>

      <Section title="Rewarded: thưởng theo callback, không theo nút đóng">
        <P>
          Phần thưởng chỉ trao trong callback &ldquo;user earned reward&rdquo;.
          Với ad do Google phục vụ, callback này tới trước callback đóng ad, nên
          trao lúc đóng vừa muộn vừa sai khi người dùng thoát giữa chừng. Nếu
          phần thưởng có giá trị thật, đừng chỉ tin callback trên máy: bật
          server-side verification (SSV) để server nhận xác nhận từ AdMob, kèm
          custom data để biết thưởng cho ai. Rewarded không tự load lại, nên
          preload khi người dùng tới gần nút xem. Vì người dùng chủ động bấm,
          rewarded thường không đi qua cổng giãn cách.
        </P>
        <Ref href="https://developers.google.com/admob/android/rewarded">
          AdMob · Rewarded ads
        </Ref>
      </Section>

      <Section title="Một giá trị chỉ nên có một nơi giữ">
        <P>
          Khi giãn cách hay ad unit được khai báo ở nhiều tầng, giá trị có hiệu
          lực là cái được ghi sau cùng, và đọc code từng nơi không cho biết đó là
          cái nào. Usecase 3 bên dưới kể một lần như vậy.
        </P>
      </Section>

      <Section title="Usecase">
        <UseCase
          n="1"
          title="Lưu ảnh lần hai không thấy ad, lần ba cũng không"
          situation={
            <p>
              App chỉnh ảnh show interstitial khi lưu ảnh xong, giãn cách 30
              giây<Assumed />. Người dùng lưu lúc 10:00:00 (thấy ad, đóng lúc
              10:00:06), lưu lần hai lúc 10:00:20 và lần ba lúc 10:00:45. Theo
              thiết kế, lần ba phải thấy ad, nhưng không thấy.
            </p>
          }
          flow={
            <Figure>
              <Lanes
                actors={[
                  { id: "U", label: "Người dùng" },
                  { id: "G", label: "Cổng giãn cách" },
                  { id: "A", label: "Interstitial" },
                ]}
                steps={[
                  { from: "U", to: "G", text: "lưu ảnh 1 · 10:00:00" },
                  { from: "G", to: "A", text: "show (chưa có mốc)" },
                  { from: "A", to: "G", text: "ghi mốc 10:00:00", reply: true },
                  { self: "A", text: "đóng 10:00:06 · load ad kế tiếp" },
                  { from: "U", to: "G", text: "lưu ảnh 2 · 10:00:20" },
                  { from: "G", to: "U", text: "20s nhỏ hơn 30s · bỏ qua", reply: true },
                  { from: "U", to: "G", text: "lưu ảnh 3 · 10:00:45" },
                  { from: "G", to: "A", text: "45s · show" },
                ]}
              />
            </Figure>
          }
          why={
            <p>
              Sơ đồ là hành vi đúng. Bản lỗi ghi mốc lúc <i>yêu cầu</i> show,
              nên lần bị chặn ở 10:00:20 dời mốc tới 10:00:20, và lần 10:00:45
              chỉ cách mốc 25 giây nên cũng bị chặn. Ad kế tiếp đã load xong từ
              10:00:08 mà không được dùng.
            </p>
          }
          lesson="Mốc thời gian phải gắn với sự kiện đã xảy ra, không với ý định. Câu hỏi kiểm tra: một lần bị chặn có làm thay đổi trạng thái của cổng không?"
        />
        <UseCase
          n="2"
          title="Quay lại sau 5 giờ, app open hiện mà không ra tiền"
          situation={
            <p>
              App open load xong lúc 8:00 khi người dùng rời app. Họ quay lại
              lúc 13:00, ad hiện ra ngay. Báo cáo cuối ngày cho thấy impression
              loại này nhiều mà doanh thu không tương xứng.
            </p>
          }
          flow={
            <Figure>
              <Tree
                root={{
                  label: "foreground 13:00",
                  kids: [
                    {
                      tone: "ask",
                      label: "load lúc 8:00",
                      sub: "quá 4 giờ ?",
                      kids: [
                        {
                          when: "có",
                          label: "bỏ ad cũ",
                          sub: "load mới cho lần sau",
                          kids: [{ label: "vào app ngay", sub: "không show" }],
                        },
                        { when: "không", label: "kiểm giãn cách → show" },
                      ],
                    },
                  ],
                }}
              />
            </Figure>
          }
          why={
            <p>
              App chỉ kiểm tra &ldquo;có ad chưa&rdquo; mà không kiểm tra ad đã
              load bao lâu. Ad quá bốn giờ có thể không được tính doanh thu, nên
              người dùng vẫn bị làm phiền mà app không nhận được gì. Bắt người
              dùng chờ load ad mới ngay lúc quay lại cũng không phải cách sửa.
            </p>
          }
          lesson="Một tài nguyên có hạn phải mang theo thời điểm tạo ra nó, và được kiểm tra ngay trước khi dùng."
        />
        <UseCase
          n="3"
          title="Tăng giãn cách trên console mà impression không đổi"
          situation={
            <p>
              Team tăng giãn cách app open từ 30 lên 90 giây trên Remote Config.
              Một tuần sau, số impression app open mỗi người dùng không đổi.
            </p>
          }
          why={
            <p>
              Giá trị được khai báo ở bốn nơi: hằng số trong app, JSON in-app
              default, tham số mặc định của thư viện ads, và Remote Config, với
              ba con số khác nhau. Lệnh khởi tạo cuối cùng ghi đè bằng hằng số
              và không đọc giá trị remote. Chỉ log giá trị có hiệu lực lúc khởi
              tạo mới lộ ra điều này.
            </p>
          }
          lesson="Mỗi tham số một nguồn sự thật. Sau mỗi lần đổi console, kiểm giá trị đang có hiệu lực trên một máy thật thay vì tin rằng nó đã đổi."
        />
      </Section>
    </>
  );
}
