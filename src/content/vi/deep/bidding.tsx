import { Canvas, Figure, Group, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, P, Ref } from "@/components/bits";
import { Assumed } from "@/components/usecase";

export const metadata = { title: "Chuyên sâu · Bidding và waterfall" };

export default function DeepBidding() {
  return (
    <>
      <PageHeader
        eyebrow="Chuyên sâu · hỏi đáp"
        title="Bidding khác waterfall ở đâu, và nó đổi gì ở match rate, latency, doanh thu?"
        lead="Waterfall hỏi từng nguồn quảng cáo lần lượt theo thứ tự bạn đặt từ eCPM trung bình trong quá khứ; bidding cho mọi nguồn trả giá cùng lúc cho đúng impression này. Khác biệt đó quyết định ai thắng một impression, request đi bao nhiêu vòng, và vì sao một waterfall sắp xếp cẩn thận vẫn có thể bán rẻ inventory."
      />

      <Section title="Waterfall hỏi theo giá quá khứ, bidding hỏi theo giá hiện tại">
        <P>
          Trong waterfall, mỗi nguồn được gán một eCPM trung bình, do bạn nhập
          hoặc lấy từ lịch sử, và AdMob gọi lần lượt từ trên xuống. Nguồn nào
          trả ad trước thì thắng, kể cả khi một nguồn ở tầng dưới sẵn sàng trả
          nhiều hơn cho đúng người dùng này. Bidding gọi mọi nguồn tham gia cùng
          lúc; mỗi nguồn trả giá cho impression cụ thể, và nguồn trả cao nhất
          thắng trong một phiên đấu giá duy nhất.
        </P>
        <Figure caption="Hai cách chọn nguồn cho cùng một request">
          <Canvas
            cols="minmax(0, 1fr)"
            wcols="minmax(0, 2fr) minmax(0, 3fr)"
            gap={["1rem", "1rem"]}
            edges={[
              { from: "W1", to: "W2", label: "no-fill" },
              { from: "W2", to: "W3", label: "no-fill" },
              { from: "BA", to: "AU" },
              { from: "BB", to: "AU" },
              { from: "BC", to: "AU" },
              { from: "AU", to: "WIN", tone: "main" },
            ]}
          >
            <Group title="Waterfall" gap={["0.6rem", "2.3rem"]}>
              <Node id="W1" className="dg-mid" sub="eCPM TB 8">
                Nguồn A
              </Node>
              <Node id="W2" className="dg-mid" sub="eCPM TB 5">
                Nguồn B
              </Node>
              <Node id="W3" className="dg-mid" sub="eCPM TB 2">
                Nguồn C
              </Node>
            </Group>
            <Group title="Bidding" cols="repeat(3, minmax(0, 1fr))" gap={["0.5rem", "1.7rem"]}>
              <Node id="BA" sub="trả 4">
                Nguồn A
              </Node>
              <Node id="BB" sub="trả 9">
                Nguồn B
              </Node>
              <Node id="BC" sub="trả 3">
                Nguồn C
              </Node>
              <Node id="AU" tone="key" className="dg-mid" col="1 / -1">
                đấu giá
              </Node>
              <Node id="WIN" tone="good" className="dg-mid" col="1 / -1">
                B thắng · 9
              </Node>
            </Group>
          </Canvas>
        </Figure>
        <P>
          Một mediation group có thể dùng cả hai. Phiên đấu giá bidding chạy
          trước, nguồn thắng được đặt vào waterfall cạnh các nguồn waterfall
          theo giá; nếu nó không phải giá cao nhất trong waterfall thì các nguồn
          waterfall cao hơn được gọi trước.
        </P>
        <Ref href="https://support.google.com/admob/answer/9234488?hl=en">
          AdMob Help · Overview of bidding
        </Ref>
        <Ref href="https://support.google.com/admob/answer/13420272?hl=en">
          AdMob Help · Guide to AdMob Mediation (bidding & waterfall)
        </Ref>
      </Section>

      <Section title="Latency: bidding không thêm vòng gọi">
        <P>
          Mỗi tầng waterfall no-fill là thêm một vòng gọi trước khi tới tầng
          kế, nên waterfall dài thì ad về chậm hơn, nhất là trên mạng yếu. Với
          bidding, Google trả lời thẳng rằng nó không làm tăng latency: đấu giá
          chạy trên data center của Google và song song với quá trình trả ad
          AdMob thông thường. Waterfall phía app, tức app tự giữ mảng nhiều ad
          unit và thử lần lượt, cộng dồn latency theo đúng cách tệ nhất: mỗi
          bước là một request đầy đủ từ thiết bị.
        </P>
        <Ref href="https://support.google.com/admob/answer/9360574?hl=en">
          AdMob Help · Bidding FAQ (latency)
        </Ref>
      </Section>

      <Section title="Match rate và doanh thu">
        <P>
          Theo định nghĩa của AdMob, với nguồn waterfall, matched request được
          đếm mỗi khi nguồn được gọi trong waterfall và trả ad. Vì vậy match
          rate của từng nguồn waterfall phản ánh cả vị trí của nó trong thứ tự,
          không chỉ nhu cầu của nó. Một nguồn ở tầng dưới chỉ được hỏi khi các
          tầng trên đã no-fill, nên match rate riêng của nó khó so trực tiếp với
          một nguồn bidding được hỏi ở mọi request.
        </P>
        <P>
          Về doanh thu, Google nói bidding giúp nhận giá cao nhất cho từng
          impression, và khuyên thêm nguồn bidding để tăng áp lực đấu giá. Mức
          tăng cụ thể phụ thuộc vào app và nguồn; ở đây không có con số chính
          thức để dẫn.
        </P>
        <Ref href="https://support.google.com/admob/table/9462111?hl=en">
          AdMob Help · Reports glossary (matched requests)
        </Ref>
      </Section>

      <Section title="Ví dụ số: waterfall bán rẻ một impression">
        <P>
          Waterfall đặt nguồn A trên cùng vì eCPM trung bình 8 USD. Với người
          dùng này, A sẵn sàng trả 4 USD, B sẵn sàng trả 9 USD
          <Assumed />.
        </P>
        <Grid
          head={["Cách chọn", "Ai thắng", "Giá impression"]}
          rows={[
            ["Waterfall: A trả ad ngay ở tầng đầu", "A", "4 USD (eCPM)"],
            ["Bidding: A, B, C cùng trả giá", "B", "9 USD (eCPM)"],
          ]}
        />
        <P>
          Waterfall không sai ở thứ tự: trung bình A quả thật trả cao nhất. Nó
          sai ở chỗ dùng một con số trung bình để quyết định cho một impression
          cụ thể. Câu hỏi kiểm tra cho mỗi nguồn còn ở waterfall: nguồn này có
          hỗ trợ bidding không, và nếu có, lý do gì để giữ nó ở dạng waterfall?
        </P>
      </Section>
    </>
  );
}
