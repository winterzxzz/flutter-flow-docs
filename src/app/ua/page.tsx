import { Canvas, Figure, Group, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, Note, P } from "@/components/bits";
import { Assumed, UseCase } from "@/components/usecase";

export const metadata = { title: "Bản đồ chỉ số UA" };

export default function Ua() {
  return (
    <>
      <PageHeader
        eyebrow="UA"
        title="Bản đồ chỉ số"
        lead="Chỉ số UA sai hiếm khi do công thức; thường là một nguồn dữ liệu chưa được nối, và con số vẫn ra, chỉ là lệch về một phía. Mỗi chỉ số cần dữ liệu từ một nơi cụ thể, nên biết trước nơi đó là biết trước chỉ số nào app sẽ đo được và chỉ số nào sẽ mù."
      />

      <Section title="Ba nguồn dữ liệu, ba bức tranh khác nhau">
        <Figure caption="Không nguồn nào một mình đủ để tính ROAS theo campaign; hai sợi dây nét đứt là chỗ hay bị thiếu">
          <Canvas
            cols="minmax(0, 1fr) 4.2rem"
            wcols="minmax(0, 1fr) 1rem minmax(0, 1fr) 10rem minmax(0, 1fr)"
            gap={["1.5rem", "3.7rem"]}
            wgap={["0px", "2.4rem"]}
            edges={[
              { from: "SPEND", to: "ROAS", inAt: "align" },
              { from: "ADREV", to: "ROAS", inAt: "align" },
              { from: "IAPREV", to: "ROAS", inAt: "align" },
              {
                from: "ATTR",
                to: "DB",
                label: "cần callback về app",
                dashed: true,
                tone: "warn",
                inAt: "align",
                narrow: { t: 0.28 },
              },
              {
                from: "ADREV",
                to: "DB",
                label: "cần gửi cả về kho",
                dashed: true,
                tone: "warn",
                inAt: "align",
                narrow: { t: 0.72 },
              },
            ]}
          >
            <Group title="Mạng quảng cáo · nơi mua lượt cài" col="1" row="1" wcol="1" wrow="1">
              <Node>CTR, IPM</Node>
              <Node id="SPEND">Chi phí, CPI</Node>
            </Group>
            <Group
              title="MMP · attribution"
              col="1"
              row="2"
              wcol="3"
              wrow="1"
              cols="repeat(2, minmax(0, 1fr))"
              wcols="minmax(0, 1fr)"
            >
              <Node id="ATTR">
                install theo network/
                <wbr />
                campaign/
                <wbr />
                creative
              </Node>
              <Node id="ADREV">ad revenue từ paid event</Node>
            </Group>
            <Group id="DB" title="Kho phân tích · hành vi" col="1" row="3" wcol="5" wrow="1">
              <Node>screen, paywall, ad events</Node>
              <Node sub="SDK analytics tự gắn">ngày cài, ngày-kể-từ-cài, session</Node>
              <Node id="IAPREV">purchase_success</Node>
            </Group>
            <Node id="ROAS" tone="key" className="dg-tall dg-mid" col="2" row="1 / 4" wcol="1 / -1" wrow="2">
              ROAS
            </Node>
          </Canvas>
        </Figure>
        <Note tone="warn" title="Hai sợi dây hay bị đứt">
          <p>
            <b>Doanh thu quảng cáo</b> chỉ gửi cho MMP mà không vào kho phân tích:
            ARPU và LTV trong kho chỉ có phần IAP.
          </p>
          <p>
            <b>Attribution</b> không chảy về app: MMP biết nguồn nhưng event
            in-app không mang nguồn, nên không tách được hành vi theo campaign.
            Xem bài học ở trang Lỗi hay gặp.
          </p>
        </Note>
      </Section>

      <Section title="Mỗi chỉ số cần gì">
        <Grid
          head={["Chỉ số", "Công thức", "Dữ liệu cần", "Nguồn"]}
          rows={[
            [
              "ARPU (IAP)",
              "doanh thu IAP ÷ số user",
              <>
                <C>purchase_success</C> + user id
              </>,
              "kho phân tích hoặc server",
            ],
            [
              "Retention D1/D7/D30",
              "user còn hoạt động ngày N ÷ user cài",
              "ngày cài + ngày hoạt động",
              "SDK analytics thường gắn sẵn",
            ],
            [
              "LTV cohort",
              "doanh thu tích luỹ theo nhóm ngày cài",
              "ngày cài + mọi nguồn doanh thu",
              "kho phân tích",
            ],
            [
              "ARPU (IAA)",
              "doanh thu ad ÷ số user",
              <>
                <C>ad_paid</C> theo user
              </>,
              "kho phân tích (nếu có gửi) hoặc MMP",
            ],
            ["ARPDAU", "doanh thu ngày ÷ DAU", "session + đủ hai nguồn doanh thu", "kho phân tích"],
            [
              "ROAS theo creative",
              "doanh thu theo creative ÷ chi phí",
              "attribution trên event + chi phí",
              "MMP + kho phân tích",
            ],
            ["eCPM", "doanh thu ÷ 1000 impression", "ad_show, ad_paid theo placement", "kho phân tích hoặc AdMob"],
            ["CPI", "chi phí ÷ lượt cài", "chi tiêu, install", "mạng quảng cáo / MMP"],
            ["CTR", "click ÷ impression", "dữ liệu chiến dịch", "mạng quảng cáo"],
            ["IPM", "install ÷ 1000 impression", "dữ liệu chiến dịch", "mạng quảng cáo"],
          ]}
        />
      </Section>

      <Section title="Đừng tự viết lại phần cohort mà SDK đã có">
        <P>
          Nhiều SDK analytics tự gắn ngày cài, số ngày kể từ cài, session id và
          tự bắn <C>first_open</C>, <C>session_start</C>. Kiểm tra SDK của bạn
          trước khi tự viết bộ đếm; các khoá đó thường là khoá dành riêng mà app
          không ghi đè được, như đã nói ở trang Tracking.
        </P>
      </Section>

      <Section title="Usecase">
        <UseCase
          n="1"
          title="Đọc ROAS khi thiếu một nửa doanh thu"
          situation={
            <p>
              App lai IAA + IAP. Campaign A chi 1 000 USD, mang về 2 000 install.
              Sau 7 ngày, IAP thu 400 USD, quảng cáo thu 500 USD
              <Assumed />.
            </p>
          }
          flow={
            <Figure>
              <Canvas
                className="mx-auto max-w-lg"
                cols="repeat(2, minmax(0, 1fr))"
                gap={["0.9rem", "1.5rem"]}
                edges={[
                  { from: "in1", to: "R1" },
                  { from: "R1", to: "X" },
                  { from: "in2", to: "R2" },
                  { from: "R2", to: "Y" },
                ]}
              >
                <Node id="in1" tone="plain" col="1" row="1">
                  <span className="dg-chips">
                    <span className="dg-chip">chi 1000</span>
                    <span className="dg-chip">IAP 400</span>
                  </span>
                </Node>
                <Node id="in2" tone="plain" col="2" row="1">
                  <span className="dg-chips">
                    <span className="dg-chip">chi 1000</span>
                    <span className="dg-chip">IAP 400</span>
                    <span className="dg-chip">Ad 500</span>
                  </span>
                </Node>
                <Node id="R1" col="1" row="2" sub="chỉ IAP">
                  ROAS D7
                </Node>
                <Node id="R2" col="2" row="2" sub="đủ hai nguồn">
                  ROAS D7
                </Node>
                <Node id="X" tone="bad" col="1" row="3">
                  40% · tưởng lỗ nặng
                </Node>
                <Node id="Y" tone="good" col="2" row="3">
                  90% · gần hoà vốn
                </Node>
              </Canvas>
            </Figure>
          }
          why={
            <p>
              Thiếu doanh thu ad trong kho, team đọc ROAS D7 = 40% và tắt
              campaign. Với đủ dữ liệu, ROAS D7 = 90% và có thể đã vượt 100% ở
              D14. Quyết định sai đến từ dữ liệu thiếu, không phải từ campaign.
            </p>
          }
          lesson="Trước khi đọc chỉ số, hỏi: dữ liệu nào đang thiếu, và nó kéo con số về phía nào."
        />
      </Section>

      <Section title="Đọc tiếp theo thứ tự nào">
        <Grid
          head={["Trang", "Trả lời câu hỏi"]}
          rows={[
            ["LTV & cohort", "một người dùng đáng giá bao nhiêu, đo thế nào"],
            ["CPI · ROAS", "được phép trả bao nhiêu cho một lượt cài"],
            ["Các giai đoạn launch", "khi nào mở rộng, mở ở đâu trước"],
            ["Ad creative", "làm quảng cáo thế nào và đo nó ra sao"],
            ["Chẩn đoán chỉ số", "số liệu xấu thì sửa creative hay sửa store"],
            ["Kế hoạch đo", "dựng đo lường theo thứ tự nào"],
          ]}
        />
      </Section>
    </>
  );
}
