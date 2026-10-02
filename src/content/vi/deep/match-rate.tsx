import { Canvas, Figure, Group, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, P, Ref } from "@/components/bits";
import { Assumed } from "@/components/usecase";

export const metadata = { title: "Chuyên sâu · Match rate" };

export default function DeepMatchRate() {
  return (
    <>
      <PageHeader
        eyebrow="Chuyên sâu · hỏi đáp"
        title="Vì sao match rate thấp, và khi nào thấp là đúng?"
        lead="Match rate là phần trăm request nhận được ad. Con số này dễ khiến người ta lo, nhưng nó là chỉ số chẩn đoán chứ không phải mục tiêu: có cách làm match rate tăng mà doanh thu không đổi, và có cấu hình mà match rate thấp chính là thiết kế."
      />

      <Section title="Mẫu số cũng là một biến">
        <P>
          Match rate bằng matched chia cho request. Ai cũng nhìn tử số, nhưng
          phần lớn lần match rate &ldquo;tụt&rdquo; mà dự án tham chiếu từng gặp
          đến từ mẫu số phình lên. Một vòng thử lại liền ba lần không chờ biến
          một lần no-fill thành ba request hỏng; một màn hình preload native cho
          năm chỗ đặt mà người dùng chỉ cuộn tới hai chỗ cũng thêm ba request
          gần như chắc chắn bị bỏ.
        </P>
        <Figure caption="Ba nhóm nguyên nhân. Nhóm do app thường sửa được ngay; hai nhóm còn lại cần hiểu hơn là cần sửa">
          <Canvas
            cols="1.6rem minmax(0, 1fr)"
            wcols="repeat(3, minmax(0, 1fr))"
            gap={["0px", "1.1rem"]}
            wgap={["0.9rem", "2.2rem"]}
            edges={[
              { from: "L", to: "A", bend: 0.4, narrow: { out: "b", in: "l", outAt: 13, inAt: 20 } },
              { from: "L", to: "U", bend: 0.4, narrow: { out: "b", in: "l", outAt: 13, inAt: 20 } },
              { from: "L", to: "K", bend: 0.4, narrow: { out: "b", in: "l", outAt: 13, inAt: 20 } },
            ]}
          >
            <Node id="L" tone="key" className="dg-wmid" col="1 / -1" row="1" wcol="1 / -1" wrow="1">
              match rate thấp
            </Node>
            <Group id="A" title="Do app" col="2" row="2" wcol="1" wrow="2">
              <Node>thử lại dồn dập</Node>
              <Node>request quá sớm, quá nhiều</Node>
              <Node>floor cao</Node>
            </Group>
            <Group id="U" title="Do người dùng · quyền riêng tư" col="2" row="3" wcol="2" wrow="2">
              <Node>app cho trẻ em</Node>
              <Node>thị trường ít nhu cầu</Node>
              <Node>không có consent</Node>
            </Group>
            <Group id="K" title="Do tài khoản · cấu hình" col="2" row="4" wcol="3" wrow="2">
              <Node>app mới đang được đánh giá</Node>
              <Node>app-ads.txt thiếu hoặc sai</Node>
              <Node>chặn nhiều danh mục</Node>
            </Group>
          </Canvas>
        </Figure>
      </Section>

      <Section title="Nhóm do app: request thừa và floor cao">
        <P>
          Thử lại liền tay và preload cho chỗ người dùng không tới đều làm mẫu
          số tăng mà không thêm impression nào. Floor thì khác: Google ghi rõ
          floor eCPM cao có thể làm match rate bị giới hạn, vì chỉ những bid đủ
          cao mới được tính. Đặt nhiều tầng floor trong waterfall, tầng cao nhất
          có match rate thấp là đúng như thiết kế; nó tồn tại để bắt đúng số ít
          lần có giá cao, các tầng thấp hơn mới lo phần fill. Hạ floor tầng đó
          xuống chỉ để match rate đẹp là đốt mất phần giá cao.
        </P>
        <Ref href="https://support.google.com/admob/answer/9655701?hl=en">
          AdMob Help · Common reasons for low match rate
        </Ref>
      </Section>

      <Section title="Nhóm do người dùng và quyền riêng tư">
        <P>
          App dành cho trẻ em có match rate thấp hơn vì ít nhà quảng cáo phù hợp
          độ tuổi và vì các ràng buộc như COPPA; Google nêu thẳng điều này.
          Thêm nữa, theo trang tổng quan về bidding, các nguồn bidding hiện không
          phục vụ ad cho app hay request dành cho trẻ em, nên một phần cạnh tranh
          biến mất. Tag tuổi trên request (trước đây là TFCD và TFUA, nay được
          thay bằng thiết lập age treatment) vì vậy ảnh hưởng thẳng tới nhu cầu.
        </P>
        <P>
          Consent thì tác động ở chỗ khác. Khi UMP báo <code>canRequestAds</code>{" "}
          là false thì app không được gửi request nào, nên con số bị ảnh hưởng
          là số request chứ không phải match rate. Khi có request nhưng không có
          dữ liệu để cá nhân hoá, việc nhu cầu giảm tới mức nào chưa có số liệu
          chính thức trong các trang đã đối chiếu, nên ở đây không đưa con số.
          Tương tự với ATT bị từ chối trên iOS: Google khuyến nghị cách bảo vệ
          doanh thu sau ATT, nhưng không công bố mức tác động lên match rate.
        </P>
        <Ref href="https://support.google.com/admob/answer/9234488?hl=en">
          AdMob Help · Overview of bidding (child-directed)
        </Ref>
        <Ref href="https://developers.google.com/admob/android/targeting">
          AdMob · Targeting (age treatment, TFCD, TFUA)
        </Ref>
        <Ref href="https://support.google.com/admob/answer/9997589?hl=en">
          AdMob Help · Privacy strategies for iOS
        </Ref>
      </Section>

      <Section title="Nhóm do tài khoản và cấu hình">
        <P>
          App hay ad unit mới có thể nhận ít nhu cầu từ Google trong tối đa một
          tuần trong lúc chất lượng traffic được đánh giá. Ở mức tài khoản, giới
          hạn phân phối quảng cáo thường kéo dài dưới 30 ngày nhưng có thể lâu
          hơn. Trong thời gian đó, sửa code để &ldquo;cứu&rdquo; match rate là
          vô ích.
        </P>
        <P>
          app-ads.txt là chỗ hay bị quên khi đổi domain hay thêm nguồn
          mediation. Các nguồn đã áp dụng app-ads.txt chỉ mua inventory trên app
          có file đã xác minh; thiếu hoặc sai dòng là mất nguyên một nhóm người
          mua. Mediation có ít nguồn thì cũng ít cạnh tranh, và Google khuyên
          thêm nguồn bidding để tăng áp lực đấu giá. Cuối cùng là danh sách
          chặn: tài liệu AdMob nói mỗi ad hay danh mục bị chặn là bớt đi bid
          trong phiên đấu giá, nên chặn càng rộng thì match rate càng giảm.
        </P>
        <Ref href="https://support.google.com/admob/answer/9493252?hl=en">
          AdMob Help · Ad serving limits
        </Ref>
        <Ref href="https://support.google.com/admob/answer/9776740?hl=en">
          AdMob Help · Resolve issues with app-ads.txt
        </Ref>
        <Ref href="https://support.google.com/admob/answer/15337570?hl=en">
          AdMob Help · Understand eCPM fluctuation (bidding pressure, blocking)
        </Ref>
      </Section>

      <Section title="Ví dụ số: bỏ thử lại dồn dập">
        <P>
          Một placement interstitial nhận 1 000 lần cần ad mỗi ngày. Nguồn trả
          ad cho 70% lần gọi đầu; những lần no-fill gần như luôn no-fill tiếp
          khi gọi lại ngay. App cũ thử lại liền ba lần mỗi khi hỏng
          <Assumed />.
        </P>
        <Grid
          head={["", "Thử lại liền 3 lần", "Không thử lại ngay"]}
          rows={[
            ["Request", "1 000 + 300 × 3 = 1 900", "1 000"],
            ["Matched", "≈ 710", "700"],
            ["Match rate", "≈ 37%", "70%"],
            ["Impression", "≈ 700", "≈ 690"],
          ]}
        />
        <P>
          Match rate gần như gấp đôi trong khi impression hầu như không đổi.
          Không có đồng nào mới; chỉ có mẫu số trung thực hơn. Nếu team coi
          match rate là mục tiêu, họ sẽ ăn mừng một thay đổi không mang thêm
          doanh thu, hoặc ngược lại, hoảng hốt vì một thay đổi vô hại.
        </P>
      </Section>

      <Section title="Nhìn ARPDAU và impression trên mỗi người dùng">
        <P>
          Match rate trả lời câu &ldquo;request của mình có được đáp không&rdquo;,
          hữu ích để khoanh vùng nguyên nhân. Câu hỏi kinh doanh nằm ở chỗ khác:
          doanh thu trên mỗi người dùng hoạt động mỗi ngày, và số impression
          trên mỗi người dùng. Hai chỉ số đó không bị mẫu số request làm méo.
          Câu hỏi kiểm tra trước khi phản ứng với một lần match rate giảm: ARPDAU
          và impression trên mỗi người dùng có giảm theo không? Nếu không, thứ
          thay đổi có lẽ là cách app gửi request, không phải thị trường.
        </P>
      </Section>
    </>
  );
}
