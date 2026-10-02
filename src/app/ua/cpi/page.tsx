import { Canvas, Figure, Group, Node, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Facts, Grid, Note, P } from "@/components/bits";
import { Assumed, UseCase } from "@/components/usecase";

export const metadata = { title: "CPI · ROAS" };

export default function Cpi() {
  return (
    <>
      <PageHeader
        eyebrow="UA · khái niệm"
        title="CPI, ARPU và ROAS"
        lead="Một lượt cài rẻ chỉ đáng mua khi người đó trả lại nhiều hơn số tiền bỏ ra, trong kỳ hoàn vốn bạn chịu được. ROAS gói câu hỏi đó thành một tỉ số, và ngưỡng của nó suy ra từ đường cong doanh thu của chính app."
      />

      <Section title="Quan hệ ba chỉ số">
        <Figure caption="ROAS = doanh thu ÷ chi phí. Hoà vốn ở mức 1, tức 100%">
          <Tree
            feeds={[
              { label: "ARPU", sub: "doanh thu / user" },
              { label: "CPI", sub: "chi phí / install" },
            ]}
            root={{
              tone: "key",
              label: "ROAS",
              kids: [
                { when: "> 1 · trên 100%", tone: "good", label: "có lãi · scale" },
                { when: "= 1 · hoà vốn", label: "tối ưu creative, targeting" },
                { when: "< 1 · dưới 100%", tone: "bad", label: "lỗ · dừng hoặc sửa" },
              ],
            }}
          />
        </Figure>
        <Note tone="info" title="Thị trường CPI cao thường có ARPU cao">
          <p>
            Đây là lý do CPI thấp không tự động tốt. Tier 3 cho CPI rẻ nhưng
            ARPU cũng thấp; Tier 1 đắt nhưng người dùng đáng giá hơn. So sánh
            phải theo cặp, không so CPI trần.
          </p>
        </Note>
      </Section>

      <Section title="Kỳ hoàn vốn quyết định ngưỡng chấp nhận">
        <Figure caption="CPI vượt ARPU ở giai đoạn sớm là bình thường; điều quan trọng là vị trí tại mốc hoàn vốn">
          <Tree
            root={{
              tone: "ask",
              label: "Chọn kỳ hoàn vốn",
              kids: [
                {
                  when: "30-90 ngày",
                  label: "Thu hồi nhanh",
                  sub: (
                    <>
                      ít chịu đựng lỗ dài hạn
                      <br />
                      hợp app vòng đời ngắn
                    </>
                  ),
                },
                {
                  when: "180-365 ngày",
                  label: "Thu hồi chậm",
                  sub: (
                    <>
                      nhắm user LTV cao
                      <br />
                      cần vốn khoẻ
                    </>
                  ),
                },
              ],
            }}
            join={{
              tone: "key",
              label: (
                <>
                  Điều kiện chung:
                  <br />
                  CPI &lt; ARPU tại mốc hoàn vốn
                </>
              ),
            }}
          />
        </Figure>
        <P>
          CPI tối đa là LTV tại mốc hoàn vốn: doanh thu tích luỹ trên mỗi người
          tới đúng ngày bạn muốn thu hồi chi phí. ARPU là doanh thu trung bình
          trong một khoảng thời gian, còn LTV trọn đời là con số dự báo cho cả
          vòng đời; lấy LTV trọn đời làm trần sẽ ra con số cao hơn nhiều và
          khiến bạn trả trước cho doanh thu chưa tới. Sai lầm hay gặp là so CPI
          hôm nay với doanh thu trên đầu người hôm nay, trong khi phải so với
          LTV tới hết kỳ hoàn vốn.
        </P>
      </Section>

      <Section title="Khi nào ưu tiên CPI, khi nào ưu tiên ROAS">
        <Grid
          head={["Tình huống", "Ưu tiên", "Vì sao"]}
          rows={[
            ["Technical launch", "CPI thấp", "cần nhiều dữ liệu với chi phí rẻ nhất"],
            [
              "Cần khối lượng để đẩy organic",
              "CPI thấp",
              "nhiều lượt cài kéo theo xếp hạng, đánh giá, lan truyền",
            ],
            ["Xây nhận diện", "CPI thấp", "tiếp cận quan trọng hơn lợi nhuận ngắn hạn"],
            [
              "Giai đoạn tăng trưởng có lãi",
              "ROAS cao",
              "scale chiến dịch ROAS thấp chỉ đốt nguồn lực",
            ],
          ]}
        />
      </Section>

      <Section title="CPI biến động theo cái gì">
        <Facts
          rows={[
            ["Nền tảng", "iOS thường cao hơn Android, thường đi cùng ARPU cao hơn"],
            [
              "Địa lý",
              "theo tier thị trường: Tier 1 cao, Tier 3 thấp (ví dụ từng tier ở trang Thuật ngữ)",
            ],
            ["Thể loại", "casual rẻ hơn chiến thuật hoặc nhập vai"],
            ["Định dạng", "video đắt hơn banner nhưng gắn kết tốt hơn"],
            ["Thời điểm", "biến động theo mùa, ngày lễ, cạnh tranh"],
          ]}
        />
      </Section>

      <Section title="Dữ liệu cho ROAS theo campaign">
        <Figure caption="Phần chi phí luôn nằm ngoài app; phần doanh thu và nguồn mới là chỗ app quyết định">
          <Canvas
            cols="minmax(0, 1fr) 5.4rem"
            wcols="minmax(0, 2fr) minmax(0, 5fr)"
            gap={["1.5rem", "1rem"]}
            wgap={["1rem", "2.4rem"]}
            edges={[
              { from: "C3", to: "ROAS", inAt: 0.14, narrow: { inAt: "align" } },
              { from: "D1", to: "ROAS", inAt: 0.38, narrow: { inAt: "align" } },
              { from: "D2", to: "ROAS", inAt: 0.62, narrow: { inAt: "align" } },
              { from: "D3", to: "ROAS", inAt: 0.86, narrow: { inAt: "align" } },
            ]}
          >
            <Group title="Ngoài app — mạng quảng cáo" col="1" row="1" wcol="1" wrow="1">
              <Node>chi tiêu</Node>
              <Node>số lượt cài</Node>
              <Node id="C3">CPI = chi tiêu ÷ số lượt cài</Node>
            </Group>
            <Group
              title="Trong app"
              col="1"
              row="2"
              wcol="2"
              wrow="1"
              wcols="repeat(3, minmax(0, 1fr))"
            >
              <Node id="D1">doanh thu IAP</Node>
              <Node id="D2" sub="network · campaign · creative">
                nguồn cài trên event
              </Node>
              <Node id="D3" sub="paid event">
                doanh thu ad
              </Node>
            </Group>
            <Node id="ROAS" tone="key" className="dg-tall dg-mid" col="2" row="1 / 3" wcol="1 / -1" wrow="2">
              ROAS theo campaign
            </Node>
          </Canvas>
        </Figure>
        <Note tone="warn" title="Thiếu một mảnh là sai hướng">
          <p>
            Thiếu nguồn trên event thì chỉ có ROAS tổng, không tách được
            campaign. Thiếu doanh thu ad thì ROAS lệch thấp — với app sống bằng
            quảng cáo, đủ để tắt nhầm một chiến dịch đang có lãi.
          </p>
        </Note>
      </Section>

      <Section title="Usecase">
        <UseCase
          n="1"
          title="CPI bao nhiêu thì hoà vốn"
          situation={
            <p>
              App chọn kỳ hoàn vốn 90 ngày. Từ cohort cũ, LTV D90 là
              1,20 USD<Assumed />.
            </p>
          }
          why={
            <p>
              CPI tối đa để hoà vốn ở D90 là 1,20 USD. Nếu muốn lãi 20% ở mốc đó
              thì CPI ≤ 1,20 ÷ 1,2 = 1,00 USD. Lấy LTV trọn đời (giả sử 2,00 USD)
              làm trần là đang trả trước cho doanh thu sau ngày 90, thứ chưa chắc tới.
            </p>
          }
          lesson="Trần CPI = LTV tại mốc hoàn vốn ÷ (1 + biên lãi mong muốn). Câu hỏi kiểm tra: con số bạn đang dùng làm trần là LTV tới ngày nào?"
        />
        <UseCase
          n="2"
          title="ROAS D7 bao nhiêu là tạm ổn"
          situation={
            <p>
              Một campaign mới có ROAS D7 = 45%. Cohort cũ của app cho thấy doanh
              thu D90 gấp 2,5 lần D7<Assumed />.
            </p>
          }
          flow={
            <Grid
              head={["Mốc", "ROAS dự kiến", "Cách tính"]}
              rows={[
                ["D7", "45%", "đo được"],
                ["D90", "≈ 112%", "45% × 2,5"],
              ]}
            />
          }
          why={
            <p>
              Không có con số ROAS D7 &ldquo;chuẩn ngành&rdquo; dùng chung được.
              Ngưỡng của bạn là 100% chia cho hệ số D90/D7 của chính app: ở đây
              100 ÷ 2,5 = 40%. Campaign 45% vượt ngưỡng; campaign 30% thì không,
              dù trông &ldquo;không tệ&rdquo;.
            </p>
          }
          lesson="Ngưỡng ROAS sớm suy ra từ đường cong doanh thu của chính app và kỳ hoàn vốn đã chọn, không mượn từ app khác."
        />
      </Section>

      <Section title="Dừng một campaign khác với dừng cả dự án">
        <P>
          Dừng một campaign khi sau hai, ba vòng thay creative mà ROAS D7 vẫn
          dưới ngưỡng của app, tức 100% chia cho hệ số D90/D7 như ở usecase 2.
          Dừng cả dự án là một quyết định khác: khi không creative nào, ở thị
          trường nào, đưa được LTV tại mốc hoàn vốn lên trên CPI. Trước khi đi
          tới kết luận đó, kiểm tra lại dữ liệu doanh thu có đủ cả IAP lẫn
          quảng cáo chưa, vì thiếu một nửa doanh thu là cách nhanh nhất để giết
          nhầm một app có lãi.
        </P>
      </Section>
    </>
  );
}
