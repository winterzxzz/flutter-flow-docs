import { Link } from "@/components/locale";

import { Canvas, Figure, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, P, Ref } from "@/components/bits";
import { Assumed } from "@/components/usecase";

export const metadata = { title: "Chuyên sâu · Preload" };

const link = "underline underline-offset-4";

export default function DeepPreload() {
  return (
    <>
      <PageHeader
        eyebrow="Chuyên sâu · hỏi đáp"
        title="Vì sao ad đã load mà không kịp hiện, hoặc hiện mà vẫn mất tiền?"
        lead="Preload sinh ra để người dùng không phải chờ ad, nhưng nó đặt cược vào một tương lai: người dùng sẽ đi tới điểm hiện trước khi ad hết hạn. Cược sai theo hướng này thì ad bị bỏ phí; cược sai theo hướng kia thì người dùng tới nơi mà ad chưa xong."
      />

      <Section title="Bốn con số trên đường từ request tới click">
        <P>
          Báo cáo AdMob chia đường đi của một ad thành bốn mốc. App gửi{" "}
          <b>request</b>; nguồn quảng cáo trả về một ad thì request đó thành{" "}
          <b>matched</b>; ad được hiện ra cho người dùng thì có một{" "}
          <b>impression</b>; người dùng bấm thì có <b>click</b>. Hai tỉ lệ đầu
          tiên là thứ trang này quan tâm: match rate là matched chia cho
          request, show rate là impression chia cho matched. Match rate nói
          nguồn quảng cáo có chịu trả ad hay không; show rate nói app có dùng
          hết những ad nó đã xin hay không.
        </P>
        <Figure caption="Mỗi mũi tên là một chỗ rơi. Preload chủ yếu ảnh hưởng mũi tên thứ hai">
          <Canvas
            cols="repeat(2, minmax(0, 1fr))"
            wcols="repeat(4, minmax(0, 1fr))"
            gap={["1.5rem", "2.6rem"]}
            wgap={["5.4rem", "2.4rem"]}
            edges={[
              { from: "R", to: "M", label: "match rate", tone: "main" },
              { from: "M", to: "I", label: "show rate", tone: "main" },
              { from: "I", to: "C", label: "CTR", tone: "main" },
              { from: "M", to: "W", dashed: true, inAt: "align" },
            ]}
          >
            <Node id="R" col="1" row="1" wcol="1" wrow="1">
              Request
            </Node>
            <Node id="M" col="1" row="2" wcol="2" wrow="1">
              Matched
            </Node>
            <Node id="I" col="1" row="3" wcol="3" wrow="1">
              Impression
            </Node>
            <Node id="C" col="1" row="4" wcol="4" wrow="1">
              Click
            </Node>
            <Node
              id="W"
              tone="mute"
              when="không ai tới điểm hiện hoặc ad hết hạn"
              col="2"
              row="2 / 4"
              wcol="2 / 4"
              wrow="2"
            >
              bỏ phí
            </Node>
          </Canvas>
        </Figure>
        <P>
          Google ghi rõ show rate thấp là dấu hiệu có vấn đề ở cách cài đặt ad
          unit hoặc ở trải nghiệm trong app. Nói cách khác, show rate là chỉ số
          của chính app, không phải của thị trường quảng cáo.
        </P>
        <Ref href="https://support.google.com/admob/table/9462111?hl=en">
          AdMob Help · Reports glossary (match rate, show rate)
        </Ref>
      </Section>

      <Section title="Ad sẵn sàng nhưng người dùng không tới điểm hiện">
        <P>
          Một app đọc truyện preload interstitial ngay khi mở app để hiện lúc
          người dùng đọc xong một chương. Phần lớn người dùng đọc một đoạn rồi
          thoát, không bao giờ tới cuối chương. Request vẫn được gửi, nguồn vẫn
          trả ad, matched vẫn tăng, nhưng impression thì không. Show rate tụt
          mà match rate trông vẫn khoẻ.
        </P>
        <P>
          Ad nằm chờ cũng không giữ giá trị mãi. Theo tài liệu AdMob, ad
          interstitial hết hạn sau một giờ nên cache ad preload cần được làm
          mới mỗi giờ; app open ad hết hạn sau bốn giờ kể từ lúc request và có
          thể không được tính doanh thu nếu hiện sau mốc đó. Ad preload rồi để
          quá hạn là một request đã tiêu, một lần tải creative đã tốn băng thông
          và bộ nhớ, mà không đổi lại được impression nào. Preload dàn trải lúc
          khởi động còn tranh băng thông và CPU với chính nội dung app đang cố
          hiện lên, đúng vào lúc người dùng nhạy cảm nhất với độ trễ.
        </P>
        <Ref href="https://developers.google.com/admob/android/interstitial">
          AdMob · Interstitial ads (ads expire after an hour)
        </Ref>
        <Ref href="https://developers.google.com/admob/android/app-open">
          AdMob · App open ads (four hours)
        </Ref>
      </Section>

      <Section title="Người dùng tới điểm hiện nhưng ad chưa xong">
        <P>
          Chiều ngược lại xảy ra khi app chỉ load lúc cần hiện. Người dùng bấm
          &ldquo;Lưu&rdquo;, app mới gửi request, và có ba lựa chọn đều có giá.
          Chờ trong một timeout ngắn thì người dùng nhìn spinner. Bỏ qua thì mất
          impression. Còn hiện khi ad về muộn thì ad bật lên lúc người dùng đã
          sang màn kế tiếp và đang đọc nội dung mới.
        </P>
        <P>
          Lựa chọn thứ ba không chỉ là trải nghiệm tệ. Chính sách AdMob coi
          interstitial bật lên bất ngờ khi người dùng đang tập trung vào việc gì
          đó là triển khai không được phép, và nêu đúng nguyên nhân hay gặp: ad
          định hiện giữa hai trang nội dung nhưng vì độ trễ mạng mà xuất hiện
          ngay sau khi trang mới đã load. Cách Google khuyến nghị là preload
          interstitial từ trước. Vì vậy &ldquo;load muộn thì hiện muộn&rdquo;
          không phải phương án, chỉ còn chờ có timeout hoặc bỏ qua.
        </P>
        <Ref href="https://support.google.com/admob/answer/6201362?hl=en">
          AdMob Help · Disallowed interstitial implementations
        </Ref>
      </Section>

      <Section title="Ví dụ số: cùng một app, hai cách preload">
        <P>
          Giả sử 10 000 phiên mỗi ngày, mỗi phiên preload một interstitial ngay
          khi mở app. Chỉ 40% phiên đi tới điểm hiện trong vòng một giờ
          <Assumed />. Cách thứ hai chỉ preload khi người dùng đã vào màn có
          điểm hiện, nơi 85% phiên đi tới điểm đó.
        </P>
        <Grid
          head={["", "Preload lúc mở app", "Preload khi vào màn"]}
          rows={[
            ["Request", "10 000", "4 700"],
            ["Matched (match rate 90%)", "9 000", "4 230"],
            ["Impression", "3 600", "3 600"],
            ["Show rate", "40%", "≈ 85%"],
          ]}
        />
        <P>
          Số impression bằng nhau vì số người tới điểm hiện không đổi; cách thứ
          hai chỉ bớt đi khoảng 5 300 request và gần 4 800 ad tải về rồi vứt.
          Doanh thu gần như không đổi, còn băng thông, bộ nhớ và nhịp khởi động
          thì tốt hơn. Đổi lại, nếu màn đó mở quá nhanh sau khi vào, một phần
          người dùng sẽ tới điểm hiện trước khi ad kịp về, và đó là lúc cần timeout
          ngắn hoặc bỏ qua.
        </P>
      </Section>

      <Section title="Preload theo xác suất người dùng đi tới điểm hiện">
        <P>
          Nguyên tắc rút ra là preload ở mức sát nhất với điểm hiện mà vẫn đủ
          thời gian để ad về. Điểm hiện mà gần như mọi phiên đi qua, như app
          open lúc quay lại từ nền, đáng preload sớm. Điểm hiện chỉ một phần nhỏ
          người dùng chạm tới thì preload khi họ đã ở gần. Câu hỏi kiểm tra cho
          mỗi placement: trong những ad đã load cho chỗ này, bao nhiêu phần được
          hiện ra trước khi hết hạn?
        </P>
        <P>
          Có một giả thuyết hay được nhắc là show rate thấp kéo dài khiến các
          nguồn mediation đánh giá thấp inventory của app. Chưa tìm thấy tài
          liệu chính thức nào xác nhận điều này, nên ở đây chỉ coi đó là giả
          thuyết; lý do để giữ show rate cao đã đủ mà không cần nó.
        </P>
        <p className="mt-3 text-sm text-muted-foreground">
          Cơ chế hết hạn và cổng giãn cách của từng format ở trang{" "}
          <Link href="/iaa/load" className={link}>
            Load, thử lại, làm mới
          </Link>
          ; vì sao match rate thấp ở{" "}
          <Link href="/deep/match-rate" className={link}>
            bài kế tiếp
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
