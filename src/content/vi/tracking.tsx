import { Link } from "@/components/locale";

import { Canvas, Figure, Group, Lanes, Node, Rail } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, P, Ref } from "@/components/bits";
import { Assumed, CodeTabs, UseCase } from "@/components/usecase";

export const metadata = { title: "Tracking" };

const link = "underline underline-offset-4";

export default function Tracking() {
  return (
    <>
      <PageHeader
        eyebrow="Vận hành · khái niệm"
        title="Tracking: event, attribution, doanh thu"
        lead="Ba dòng dữ liệu khác nhau: hành vi trong app, nguồn cài, và tiền. Chỉ khi cả ba gắn được vào cùng một người dùng thì mới tính được ARPU, LTV, ROAS theo campaign; thiếu một sợi thì mọi con số phía sau vẫn ra, chỉ là sai."
      />

      <Section title="Nguồn cài chảy ngược về app, doanh thu đi cả hai hướng">
        <P>
          Kho phân tích ở đây là nơi event hành vi và doanh thu đổ về, có thể là
          Firebase Analytics hay một data warehouse. MMP (mobile measurement
          partner, như Adjust hay AppsFlyer) là bên gán mỗi lượt cài cho một
          nguồn. Hai bên cần nhau: kho phân tích cần biết nguồn cài để chia hành
          vi theo campaign, MMP cần doanh thu để tính ROAS.
        </P>
        <Figure caption="Attribution về app thành user property; doanh thu gửi cả MMP lẫn kho phân tích">
          <Canvas
            className="mx-auto max-w-xl pr-7"
            cols="repeat(2, minmax(0, 1fr))"
            gap={["1rem", "2.9rem"]}
            edges={[
              { from: "MMP", to: "UP", label: "attribution callback", tone: "main" },
              { from: "UP", to: "EV" },
              { from: "UP", to: "REV" },
              { from: "REV", to: "MMP", out: "r", in: "r" },
              { from: "EV", to: "WH", inAt: 0.3 },
              { from: "REV", to: "WH", inAt: 0.7 },
            ]}
          >
            <Node id="MMP" className="dg-mid" col="1 / -1" sub="Adjust, AppsFlyer">
              MMP
            </Node>
            <Group
              title="Trong app"
              col="1 / -1"
              cols="repeat(2, minmax(0, 1fr))"
              gap={["0.9rem", "1.6rem"]}
            >
              <Node id="UP" tone="key" className="dg-mid" col="1 / -1" sub="user id, entitlement, nguồn cài">
                user property
              </Node>
              <Node id="EV" sub="screen, paywall, ad">
                event hành vi
              </Node>
              <Node id="REV" sub="purchase, ad_paid">
                event doanh thu
              </Node>
            </Group>
            <Node id="WH" className="dg-mid" col="1 / -1">
              Kho phân tích
            </Node>
          </Canvas>
        </Figure>
      </Section>

      <Section title="Taxonomy event">
        <Grid
          head={["Nhóm", "Event gợi ý", "Tham số tối thiểu"]}
          rows={[
            ["Vòng đời", "first_open, session_start, loading_start/finish", "thời gian, mã lỗi"],
            ["Màn hình", "screen_show, screen_exit, button_click", "tên màn, tên nút"],
            ["Paywall · IAP", "paywall_show, paywall_click, purchase_success, purchase_fail, restore", "điểm vào, product id, giá, tiền tệ, transaction id"],
            ["Quảng cáo", "ad_request, ad_load_success, ad_load_fail, ad_show, ad_click, ad_paid", "format, placement, ad unit, mã lỗi, giá trị, tiền tệ, độ chính xác"],
            ["Hệ thống", "remote_config_parse_fail, consent_result", "phiên bản config, lựa chọn"],
          ]}
        />
        <P>
          Tên event viết snake_case và giữ cố định, vì đổi tên là đứt chuỗi thời
          gian. Placement là một danh sách giá trị đóng, không phải chuỗi tự do.
          SDK analytics thường tự gắn một số khoá như ngày cài hay session, và
          bỏ qua mà không báo lỗi nếu app ghi đè chúng; đọc danh sách khoá dành
          riêng của SDK trước khi thêm user property. Bản debug nên không gửi
          event lên kho phân tích thật nhưng vẫn hiện được trong app để kiểm tra;
          kiểm chứng đầu-cuối phải làm trên bản release hoặc profile.
        </P>
      </Section>

      <Section title="Attribution phải chảy ngược về app">
        <P>
          MMP gán mỗi lượt cài cho network, campaign, adgroup, creative dựa trên
          dữ liệu click và impression từ mạng quảng cáo. Thông tin đó về app qua
          callback attribution của SDK: với Adjust, gán{" "}
          <C>attributionCallback</C> trên config <b>trước</b> khi init SDK, hoặc
          chủ động đọc bằng <C>getAttribution()</C>. App ghi tracker name,
          network, campaign, adgroup, creative thành user property để chúng đi
          kèm mọi event, và tách riêng nhóm organic để nó không lẫn vào như một
          campaign.
        </P>
        <Ref href="https://dev.adjust.com/en/sdk/flutter/features/attribution">
          Adjust · Flutter SDK attribution
        </Ref>
      </Section>

      <Section title="Doanh thu phải tới cả MMP lẫn kho phân tích">
        <P>
          Doanh thu IAP lấy từ kết quả mua đã verify; giá trị đáng tin nhất đến
          từ server, nơi đã biết phí store và tỷ giá. Doanh thu IAA lấy từ paid
          event của Ad SDK cho từng impression, gửi cho MMP (với Adjust là{" "}
          <C>AdjustAdRevenue(&apos;admob_sdk&apos;)</C>) và gửi vào kho phân tích.
          Gửi một nơi thì nơi kia thiếu: thiếu ở MMP thì ROAS theo campaign sai,
          thiếu ở kho phân tích thì ARPU và LTV chỉ còn phần IAP. Hai nơi sẽ
          không bao giờ khớp từng đồng, xem{" "}
          <Link href="/deep/revenue-gap" className={link}>
            Vì sao doanh thu AdMob lệch với MMP
          </Link>
          .
        </P>
        <Ref href="https://dev.adjust.com/en/sdk/flutter/features/ad-revenue">
          Adjust · Flutter SDK ad revenue
        </Ref>
      </Section>

      <Section title="Usecase">
        <UseCase
          n="1"
          title="Campaign chạy nhưng mọi lượt cài báo “Unattributed”"
          situation={
            <p>
              Team UA chạy ba campaign với năm creative trong hai tuần. Dashboard
              của MMP thấy lượt cài phân bổ đúng theo campaign, nhưng trong kho
              phân tích, chia doanh thu theo campaign chỉ ra một dòng:{" "}
              <C>Unattributed</C>.
            </p>
          }
          flow={
            <Figure>
              <Rail
                rows={[
                  { tone: "mute", label: "MMP SDK init", down: "callback chưa gán trước init", broken: true },
                  { tone: "mute", label: "hàm nhận attribution", down: "không ai gọi", broken: true },
                  { label: "user property nguồn cài" },
                  { tone: "bad", label: "mọi event mang giá trị khởi tạo" },
                ]}
              />
            </Figure>
          }
          why={
            <>
              <p>
                MMP biết nguồn nhưng app không bao giờ được báo, vì callback được
                gán sau khi init. User property giữ nguyên giá trị khởi tạo, nên
                mọi phân tích theo nguồn trong kho phân tích vô nghĩa mà không có
                lỗi nào hiện ra.
              </p>
              <p>
                Cách kiểm tra: cài bản release qua một tracker link test, xem log
                callback có chạy không và event đầu tiên sau đó có mang đúng tên
                network không. Lặp lại với một lượt cài organic.
              </p>
            </>
          }
          lesson="Một tích hợp chỉ xong khi dữ liệu đi hết đường tới chỗ được phân tích; đọc code từng đầu dây không chứng minh được điều đó."
        />

        <UseCase
          n="2"
          title="ROAS của một campaign nhảy lên hàng triệu phần trăm"
          situation={
            <p>
              Sau khi thêm gửi doanh thu ad cho MMP, ROAS D1 của một campaign
              báo hàng triệu phần trăm. Một người dùng xem 3 interstitial và 10
              lượt banner trong ngày đầu, paid event cộng lại 18 000 micros
              <Assumed />.
            </p>
          }
          flow={
            <Figure>
              <Lanes
                actors={[
                  { id: "SDK", label: "Ad SDK" },
                  { id: "App", label: "App" },
                  { id: "MMP", label: "MMP" },
                  { id: "WH", label: "Kho phân tích" },
                ]}
                steps={[
                  { from: "SDK", to: "App", text: "paid(valueMicros, currency, precision)" },
                  { self: "App", text: "value = micros / 1 000 000" },
                  { from: "App", to: "MMP", text: "ad revenue (source, value, currency)" },
                  { from: "App", to: "WH", text: "ad_paid + format + placement" },
                ]}
              />
            </Figure>
          }
          why={
            <>
              <p>
                18 000 micros là 0,018 USD, nhưng app gửi thẳng 18 000 cho MMP.
                Bản port sang iOS thì đúng, vì iOS SDK trả{" "}
                <C>GADAdValue.value</C> là số thập phân đã đúng đơn vị, còn
                Flutter trả micros.
              </p>
              <CodeTabs
                flutter={`ad.onPaidEvent = (ad, valueMicros, precision, currency) {
  final value = valueMicros / 1e6;
  // gửi value, currency, precision cho MMP và kho phân tích
};`}
                swift={`ad.paidEventHandler = { adValue in
  let value = adValue.value // đã là số thập phân
  // gửi value, adValue.currencyCode, adValue.precision
}`}
              />
            </>
          }
          lesson="Cùng một khái niệm trên hai nền tảng có thể khác đơn vị. Khi port, kiểm đơn vị trước khi kiểm logic."
        />

        <UseCase
          n="3"
          title="Hoàn tiền mà không biết trừ vào lần mua nào"
          situation={
            <p>
              Người dùng mua gói năm rồi được hoàn tiền sau 5 ngày. Server nhận
              notification hoàn tiền, nhưng doanh thu cohort trong kho phân tích
              vẫn tính lần mua đó. Event <C>purchase_success</C> chỉ có tên gói,
              giá và tiền tệ.
            </p>
          }
          why={
            <p>
              Không có transaction id thì không nối được hoàn tiền với lần mua.
              Event mua gửi hai lần do retry mạng cũng bị đếm hai lần, vì không
              có khoá để khử trùng.
            </p>
          }
          lesson="Mọi event mang tiền cần một khoá duy nhất từ nguồn phát sinh ra nó, để sau này cộng, trừ và khử trùng được."
        />
        <Ref href="https://developers.google.com/admob/ios/impression-level-ad-revenue">
          AdMob iOS · Impression-level ad revenue (paidEventHandler, GADAdValue)
        </Ref>
      </Section>
    </>
  );
}
