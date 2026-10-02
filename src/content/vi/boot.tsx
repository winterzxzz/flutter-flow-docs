import { Canvas, Figure, Group, Lanes, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, P, Ref } from "@/components/bits";
import { UseCase } from "@/components/usecase";

export const metadata = { title: "Khởi động" };

export default function Boot() {
  return (
    <>
      <PageHeader
        eyebrow="Khái niệm"
        title="Thứ tự khởi động"
        lead="Nhiều lỗi kiếm tiền khó tìm nhất sinh ra trong vài trăm mili-giây đầu khi app mở: ad được preload trước khi biết người dùng đã trả tiền, request gửi đi trước khi có consent, ad unit viết cứng được dùng vì config chưa về. Chạy sai thứ tự không crash, nên thứ tự phải được thiết kế chứ không để tự nhiên mà thành."
      />

      <Section title="Mỗi mũi tên là một phụ thuộc thật">
        <P>
          Sơ đồ dưới là một khung tham khảo. Nhiều app gộp splash, consent và
          fetch Remote Config vào một màn loading; điều cần giữ là các phụ thuộc,
          không phải đúng từng ô. Các khối cùng tầng chạy song song được, nhưng
          lệnh khởi tạo Ad SDK luôn đứng sau ba thứ: entitlement, consent và
          config đã có hiệu lực.
        </P>
        <Figure caption="Khối cùng tầng chạy song song; mọi thứ liên quan tới ads chờ ở cổng consent">
          <Canvas
            className="mx-auto max-w-2xl"
            cols="repeat(2, minmax(0, 1fr))"
            gap={["0.75rem", "1.7rem"]}
            edges={[
              { from: "A", to: "B", tone: "main" },
              { from: "B", to: "par", tone: "main" },
              { from: "C1", to: "D", inAt: "align" },
              { from: "C2", to: "E", inAt: "align" },
              { from: "C3", to: "F", inAt: "align" },
              { from: "par", to: "G", tone: "main" },
              { from: "G", to: "H", tone: "main" },
              { from: "H", to: "I", bend: 0.4, head: false },
              { from: "H", to: "J", bend: 0.4, head: false },
              { from: "I", to: "K" },
              { from: "J", to: "K" },
            ]}
          >
            <Node id="A" className="dg-mid" col="1 / -1" sub="crash reporter">
              Bắt lỗi toàn cục
            </Node>
            <Node id="B" className="dg-mid" col="1 / -1" sub="entitlement cache, user id">
              Storage local
            </Node>
            <Group
              id="par"
              title="song song"
              col="1 / -1"
              cols="repeat(2, minmax(0, 1fr))"
              wcols="repeat(3, minmax(0, 1fr))"
              gap={["1.6rem", "0.6rem"]}
              wgap={["0.75rem", "1.5rem"]}
            >
              <Node id="C1" col="1" row="1" wcol="1" wrow="1">
                Firebase core
              </Node>
              <Node id="D" col="2" row="1" wcol="1" wrow="2" sub="activate giá trị đã có">
                Remote Config
              </Node>
              <Node id="C2" col="1" row="2" wcol="2" wrow="1" sub="tạo hoặc đọc lại">
                Định danh user
              </Node>
              <Node id="E" col="2" row="2" wcol="2" wrow="2" sub="gán callback trước khi init">
                Attribution SDK
              </Node>
              <Node id="C3" col="1" row="3" wcol="3" wrow="1" sub="bắt đầu nghe giao dịch">
                Store / SDK IAP
              </Node>
              <Node id="F" col="2" row="3" wcol="3" wrow="2">
                Entitlement
              </Node>
            </Group>
            <Node id="G" className="dg-mid" col="1 / -1" sub="UMP · ATT">
              Consent
            </Node>
            <Node id="H" tone="ask" className="dg-mid" col="1 / -1">
              được phép request ads ?
            </Node>
            <Node id="I" when="có, và không có quyền premium" sub="preload ad đầu tiên">
              Khởi tạo Ad SDK
            </Node>
            <Node id="J" when="không">
              Vào app không có ads
            </Node>
            <Node id="K" className="dg-mid" col="1 / -1">
              UI chính
            </Node>
          </Canvas>
        </Figure>
      </Section>

      <Section title="Phụ thuộc nào đảo thứ tự là hỏng">
        <P>
          Mỗi dòng dưới đây là một cặp &ldquo;phải có trước / rồi mới
          tới&rdquo; mà đảo lại thì app vẫn chạy, chỉ là dữ liệu hay trải nghiệm
          sai đi.
        </P>
        <Grid
          head={["Phải có trước", "Rồi mới tới", "Nếu đảo"]}
          rows={[
            ["user id", "SDK IAP, MMP, analytics", "giao dịch và event gắn vào user rỗng, không join lại được"],
            ["nghe giao dịch từ store", "UI có nút mua", "bỏ lỡ giao dịch dở dang, Ask to Buy, gia hạn"],
            ["consent (UMP, ATT)", "request ads đầu tiên", "request không đúng lựa chọn quyền riêng tư"],
            ["entitlement", "preload ads", "người đã trả tiền thấy ad ở màn đầu"],
            ["config có hiệu lực", "preload ads", "ad đầu phiên dùng ad unit viết cứng"],
          ]}
        />
      </Section>

      <Section title="Consent là một bước tuần tự có điểm kết thúc">
        <P>
          Google khuyến nghị gọi <C>requestConsentInfoUpdate</C> của UMP ở mỗi
          lần mở app, hiện form nếu cần, và chỉ request ads khi{" "}
          <C>canRequestAds</C> trả true. Điểm dễ sai là <C>canRequestAds</C> có
          thể đúng ngay sau khi update xong, vì consent của phiên trước vẫn còn
          hiệu lực, và đúng thêm lần nữa sau khi người dùng chọn trên form. App
          kiểm tra ở cả hai chỗ thì cần một cờ để Ad SDK chỉ được khởi tạo một
          lần. Một số thông điệp còn yêu cầu app có nút cho người dùng mở lại
          lựa chọn quyền riêng tư bất cứ lúc nào.
        </P>
        <P>
          Trên iOS, ATT là prompt của hệ thống và cần khoá{" "}
          <C>NSUserTrackingUsageDescription</C>. Hệ thống không hiện prompt khi
          app chưa ở trạng thái active, nên gọi quá sớm lúc khởi động là bị bỏ
          qua và trạng thái vẫn chưa xác định. UMP có thể hiện một thông điệp
          giải thích IDFA ngay trước prompt ATT, cấu hình trên AdMob.
        </P>
        <Ref href="https://developers.google.com/admob/android/privacy">
          AdMob · Get started with UMP
        </Ref>
        <Ref href="https://developer.apple.com/documentation/apptrackingtransparency/attrackingmanager/requesttrackingauthorization(completionhandler:)">
          Apple · requestTrackingAuthorization
        </Ref>
        <Ref href="https://developers.google.com/admob/ios/privacy/idfa">
          AdMob · IDFA explainer message
        </Ref>
      </Section>

      <Section title="Chỉ chặn màn đầu ở những bước thật sự cần">
        <P>
          Fetch Remote Config là bước duy nhất trong danh sách đáng chặn màn
          hình, và chỉ chặn có giới hạn: timeout ngắn cho màn loading, quá hạn
          thì đi tiếp bằng giá trị đã có. Giá sản phẩm chỉ cần khi người dùng mở
          paywall nên lấy nền sau khi vào app. App open ad nên hiện trong lúc
          người dùng vốn đang phải chờ, không bắt họ chờ thêm vì ad. Còn gửi
          event thì luôn bất đồng bộ, có hàng đợi local.
        </P>
      </Section>

      <Section title="Usecase">
        <UseCase
          n="1"
          title="Người dùng mới ở EU mở app lần đầu"
          situation={
            <p>
              Một app ghi chú có banner và app open ad. Log của người dùng mới ở
              Đức cho thấy mỗi người sinh hai lệnh khởi tạo Ad SDK, và trạng
              thái ATT vẫn là <C>notDetermined</C> sau lần mở đầu.
            </p>
          }
          flow={
            <Figure>
              <Lanes
                actors={[
                  { id: "App", label: "App" },
                  { id: "UMP", label: "UMP" },
                  { id: "ATT", label: "iOS ATT" },
                  { id: "Ads", label: "Ad SDK" },
                ]}
                steps={[
                  { from: "App", to: "UMP", text: "requestConsentInfoUpdate" },
                  { from: "UMP", to: "App", text: "cần consent", reply: true },
                  { from: "App", to: "UMP", text: "hiện form GDPR" },
                  { from: "UMP", to: "App", text: "đã chọn", reply: true },
                  { from: "App", to: "ATT", text: "prompt khi app đã active" },
                  { from: "ATT", to: "App", text: "authorized hoặc denied", reply: true },
                  { self: "App", text: "canRequestAds ?" },
                  { from: "App", to: "Ads", text: "init và preload, một lần duy nhất" },
                ]}
              />
            </Figure>
          }
          why={
            <p>
              Prompt ATT được gọi trong lúc khởi động, khi app chưa active, nên
              hệ thống bỏ qua. Ad SDK được khởi tạo ở cả nhánh &ldquo;consent từ
              phiên trước&rdquo; lẫn nhánh &ldquo;vừa chọn xong&rdquo; mà không
              có cờ chặn, nên request ads bị nhân đôi ngay trong phiên đầu.
            </p>
          }
          lesson="Bước nào có nhiều đường đi tới thì phải có một cờ đánh dấu đã làm. Câu hỏi kiểm tra: nếu điều kiện đúng ở hai chỗ, code có chạy hai lần không?"
        />
        <UseCase
          n="2"
          title="Người đã trả tiền vẫn thấy app open ad"
          situation={
            <p>
              Người dùng mua gói năm hôm qua. Sáng nay mở app, màn đầu tiên vẫn
              là một app open ad, sau đó mới vào app không quảng cáo. Họ để lại
              đánh giá một sao.
            </p>
          }
          why={
            <p>
              Preload và show app open chạy song song với việc đọc entitlement,
              và ad thắng cuộc đua. Lỗi này hiếm khi tái hiện trên máy dev, vì
              máy dev thường không có gói đang hoạt động.
            </p>
          }
          lesson="Entitlement, ít nhất là bản cache local, phải có trước lệnh preload ad đầu tiên. Cuộc đua giữa hai tác vụ song song chỉ an toàn khi kết quả không phụ thuộc ai về trước."
        />
      </Section>
    </>
  );
}
