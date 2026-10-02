import { Canvas, Figure, Lanes, Node, Rail } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, P, Ref } from "@/components/bits";
import { Assumed, Code, UseCase } from "@/components/usecase";

export const metadata = { title: "Remote Config" };

const SCHEMA = `{
  "ads": {
    "app_open":     { "enabled": true,  "units": ["<u1>", "<u2>"], "show_interval_ms": 30000 },
    "interstitial": { "enabled": true,  "units": ["<u>"],          "show_interval_ms": 30000 },
    "rewarded":     { "enabled": true,  "units": ["<u>"] },
    "banner":   [ { "id": "home",   "enabled": true, "units": ["<u>"] } ],
    "native":   [ { "id": "feed",   "enabled": true, "units": ["<u>"], "refresh_ms": 0 } ]
  },
  "paywall": { "products": ["monthly", "yearly"], "default": "yearly" }
}`;

export default function RemoteConfig() {
  return (
    <>
      <PageHeader
        eyebrow="Vận hành · khái niệm"
        title="Remote Config như bảng điều khiển"
        lead="Remote Config cho phép bật tắt format, chỉnh giãn cách, đổi ad unit hay gói trên paywall mà không ra bản mới. Lợi ích đó chỉ có thật khi app vẫn chạy đúng lúc không lấy được config: lần mở đầu, mạng yếu, JSON hỏng. Vì vậy phần khó nằm ở in-app default và thời điểm activate, không ở danh sách khoá."
      />

      <Section title="Đưa lên những gì cần chỉnh nhanh, giữ lại những gì phải bí mật">
        <Grid
          head={["Nên đưa lên", "Vì sao"]}
          rows={[
            ["Bật tắt từng format, từng chỗ đặt", "tắt nhanh khi ad gây crash hoặc vi phạm chính sách"],
            ["Giãn cách interstitial, app open", "đòn bẩy chính giữa doanh thu và retention"],
            ["Danh sách ad unit, thứ tự waterfall", "đổi nguồn mà không cần review store"],
            ["Thời gian làm mới native", "0 nghĩa là tắt"],
            ["Gói hiện trên paywall, gói mặc định", "thử giá và cách trình bày"],
            ["Điểm hiện paywall", "sau onboarding, khi mở app, khi chạm tính năng"],
          ]}
        />
        <P>
          Đừng đưa bí mật lên Remote Config: mọi giá trị đều được tải về máy
          người dùng. Logic nhiều nhánh cũng không nên nằm ở đó, vì không ai
          test được mọi tổ hợp giá trị. Product id chưa tồn tại trên store thì
          càng không, vì store trả rỗng mà không báo lỗi.
        </P>
      </Section>

      <Section title="In-app default là cấu hình cho điều kiện xấu nhất">
        <P>
          Giá trị dùng thật đến từ ba tầng. Tầng trên là giá trị remote đã
          activate; thiếu thì xuống in-app default, tức cấu hình đóng gói trong
          app; thiếu nữa thì xuống default từng trường trong code parse. App mới
          cài, offline hay fetch hỏng đều chạy bằng in-app default, nên nó phải
          là cấu hình chạy được và bảo thủ: ít ad hơn, không phải nhiều hơn.
        </P>
        <Figure caption="Tầng dưới đỡ cho tầng trên khi thiếu">
          <Rail
            sink={{ label: "giá trị dùng thật", tone: "good" }}
            rows={[
              { label: "1 · Giá trị remote", sub: "đã activate", exit: { label: "có" }, down: "không" },
              {
                label: "2 · In-app default",
                sub: "đóng gói trong app",
                exit: { label: "trường có" },
                down: "không",
              },
              { label: "3 · Default từng trường", sub: "trong code parse", exit: {} },
            ]}
          />
        </Figure>
        <P>
          JSON sai schema thì app giữ cấu hình đang có và báo lỗi về crash
          reporter hoặc analytics, không chỉ log tại máy. Cấu hình đã parse
          thành công nên được lưu lại và đọc ở lần mở app lạnh kế tiếp, để không
          quay về in-app default mỗi lần.
        </P>
      </Section>

      <Section title="Activate lúc nào quyết định khi nào người dùng thấy thay đổi">
        <Grid
          head={["Cách", "Làm thế nào", "Hợp với"]}
          rows={[
            ["Fetch và activate lúc mở", <><C>fetchAndActivate</C> ngay khi khởi động</>, "thay đổi không làm UI đổi rõ rệt"],
            ["Activate sau màn loading", "giữ màn loading tới khi fetch xong, có timeout riêng", "thử nghiệm A/B"],
            ["Load cho lần mở sau", "activate giá trị đã fetch từ trước, fetch nền cho lần sau", "khởi động nhanh nhất"],
          ]}
        />
        <P>
          Firebase lưu ý timeout mặc định một phút có thể quá dài cho lúc khởi
          động, nên cách thứ hai cần timeout riêng ngắn hơn. Với cách thứ ba,
          thay đổi trên console chỉ có hiệu lực từ lần mở kế tiếp. Listener
          real-time (<C>addOnConfigUpdateListener</C> trên native,{" "}
          <C>onConfigUpdated</C> trên Flutter) giữ kết nối khi app ở foreground
          và tự fetch khi có bản mới, bỏ qua <C>minimumFetchInterval</C>; app vẫn
          phải tự gọi activate. Dù dùng cách nào, chỉ áp giá trị mới vào màn
          người dùng đang thao tác khi có lý do kinh doanh rõ ràng.
        </P>
        <Ref href="https://firebase.google.com/docs/remote-config/loading">
          Firebase · Remote Config loading strategies
        </Ref>
        <Ref href="https://firebase.google.com/docs/remote-config/real-time">
          Firebase · Real-time Remote Config
        </Ref>
      </Section>

      <Section title="Thứ gì preload trước khi config về thì chạy bằng default">
        <Figure caption="Đọc cache phiên trước, fetch có timeout, parse lỗi thì giữ cái cũ">
          <Lanes
            numbered
            actors={[
              { id: "A", label: "App" },
              { id: "C", label: "Lớp config" },
              { id: "R", label: "Remote Config" },
              { id: "D", label: "Ad SDK" },
            ]}
            steps={[
              { from: "A", to: "C", text: "init: đọc cache phiên trước" },
              { note: "C", text: "không có cache thì dùng in-app default" },
              { from: "A", to: "R", text: "fetch (có timeout)" },
              { from: "R", to: "C", text: "JSON mới", reply: true },
              { self: "C", text: "parse · lỗi thì giữ cái cũ" },
              { from: "C", to: "D", text: "cấu hình ad" },
              { self: "D", text: "preload" },
            ]}
          />
        </Figure>
      </Section>

      <Section title="Một khoá JSON đổi đồng bộ được nhiều trường, và hỏng cùng lúc">
        <P>
          Gom cả nhóm ad vào một khoá JSON giúp đổi đồng bộ nhiều trường trong
          một lần publish. Đổi lại, sai một ký tự là cả khối hỏng, nên mới cần
          default từng trường và báo lỗi parse. Banner và native thường tra
          config theo id của chỗ đặt; sai một ký tự là không tìm thấy và ad
          không hiện mà không có lỗi nào, nên hãy log id tra không thấy. Nhiều
          app chung một project Firebase thì đặt tiền tố khoá riêng cho từng
          app, nếu không hai app fork từ cùng một base sẽ tranh cùng một khoá.
        </P>
        <Code>{SCHEMA}</Code>
      </Section>

      <Section title="Chỉ nhóm song song mới cho biết thay đổi có đáng không">
        <P>
          Condition của Remote Config nhắm theo phiên bản app, nền tảng, ngôn
          ngữ, quốc gia, audience hay user property của Analytics, hoặc user in
          random percentile. Rollout phát dần một giá trị mới cho một phần trăm
          người dùng, theo dõi Crashlytics và Analytics, rồi tăng hoặc rút lại.
          A/B testing chia nhóm song song cho cùng một khoá. Không có nhóm song
          song thì chỉ còn so trước/sau theo thời gian, và kết quả lẫn với mùa
          vụ, phiên bản app và thay đổi nguồn traffic.
        </P>
        <Ref href="https://firebase.google.com/docs/remote-config/parameters">
          Firebase · Remote Config parameters and conditions
        </Ref>
        <Ref href="https://firebase.google.com/docs/remote-config/rollouts">
          Firebase · Remote Config rollouts
        </Ref>
      </Section>

      <Section title="Usecase">
        <UseCase
          n="1"
          title="Giãn interstitial ở Brazil, retention lên mà không biết vì sao"
          situation={
            <p>
              Retention D1 ở Brazil thấp hơn các nước khác. Team tăng giãn cách
              từ 30 lên 60 giây chỉ cho Brazil<Assumed />. Hai tuần sau D1 tăng
              hai điểm, nhưng cùng lúc đó có một bản phát hành mới và một
              campaign mới ở Brazil.
            </p>
          }
          flow={
            <Figure>
              <Canvas
                className="mx-auto max-w-lg"
                cols="repeat(2, minmax(0, 1fr))"
                gap={["0.9rem", "1.5rem"]}
                edges={[
                  { from: "A", to: "B" },
                  { from: "C", to: "D" },
                  { from: "B", to: "E" },
                  { from: "D", to: "F" },
                  { from: "E", to: "G" },
                ]}
              >
                <Node id="A" col="1" row="1">
                  condition: country = BR
                </Node>
                <Node id="C" col="2" row="1">
                  mặc định
                </Node>
                <Node id="B" col="1" row="2">
                  show_interval_ms = 60000
                </Node>
                <Node id="D" col="2" row="2">
                  show_interval_ms = 30000
                </Node>
                <Node id="E" col="1" row="3">
                  app tại BR fetch
                </Node>
                <Node id="F" col="2" row="3">
                  app nơi khác fetch
                </Node>
                <Node id="G" col="1" row="4">
                  so cohort BR trước / sau
                </Node>
              </Canvas>
            </Figure>
          }
          why={
            <p>
              Condition theo quốc gia đổi được hành vi mà không qua review store,
              nhưng so trước/sau trong cùng một nước không tách được tác động
              của giãn cách khỏi bản phát hành và campaign. Team cũng chỉ đo
              retention, không đo doanh thu ad trên mỗi người dùng, nên không
              biết đã đổi bao nhiêu tiền lấy hai điểm D1.
            </p>
          }
          lesson="Remote Config đổi được hành vi; nhóm đối chứng song song mới cho biết thay đổi có đáng không, và phải đo cả cái được lẫn cái mất."
        />
        <UseCase
          n="2"
          title="Người dùng mới ở vùng mạng yếu thấy ad dày đặc"
          situation={
            <p>
              Người dùng mới cài trong vùng mạng yếu gặp interstitial sau gần như
              mọi thao tác ở phiên đầu, rồi gỡ app. Fetch đã quá timeout và chưa
              có cache vì là lần mở đầu.
            </p>
          }
          why={
            <p>
              App chạy hoàn toàn bằng in-app default, mà default bật mọi format
              với giãn cách ngắn &ldquo;cho chắc doanh thu&rdquo;. Nhóm dễ rời
              bỏ nhất nhận trải nghiệm dày ad nhất. Ngược lại, nếu default dùng
              ad unit cũ đã tắt thì họ không thấy ad nào.
            </p>
          }
          lesson="Giá trị mặc định là thứ người dùng mới nhất gặp trong điều kiện tệ nhất. Cập nhật nó mỗi bản phát hành."
        />
        <UseCase
          n="3"
          title="Rollout 10% một format mới mà không quyết được bước tiếp"
          situation={
            <p>
              Team thay app open bằng native toàn màn hình lúc mở app, rollout
              10% người dùng<Assumed />. Sau ba ngày, crash-free users của nhóm
              10% không đổi, và team phải quyết có tăng lên 50% không.
            </p>
          }
          why={
            <p>
              Không có event ad theo format, nên team thấy được độ ổn định nhưng
              không thấy ARPDAU của nhóm 10% so với 90% còn lại. Họ hoặc tăng
              rollout mà không biết doanh thu đổi ra sao, hoặc dừng lại vì không
              có căn cứ.
            </p>
          }
          lesson="Rollout chỉ hữu ích khi chỉ số để quyết định đã có sẵn trước lúc bật."
        />
      </Section>
    </>
  );
}
