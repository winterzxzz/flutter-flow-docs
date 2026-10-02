import { Figure, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Facts, Grid, P } from "@/components/bits";
import { Assumed, UseCase } from "@/components/usecase";

export const metadata = { title: "Ad creative" };

export default function Creative() {
  return (
    <>
      <PageHeader
        eyebrow="UA · khái niệm"
        title="Ad creative: làm và đo"
        lead="Creative quyết định CTR và IPM, tức quyết định CPI. Phần khó không phải quay video mà là biết video nào mang về người dùng thật sự có giá trị."
      />

      <Section title="Nền móng trước khi sản xuất">
        <Figure caption="Bốn câu hỏi phải trả lời xong mới bắt đầu quay">
          <Tree
            feedsAsGroup
            feeds={[
              { label: "Đối tượng là ai ?", sub: "nhân khẩu, tâm lý, hành vi" },
              { label: "App khác biệt ở đâu ?" },
              { label: "Chiến dịch nhằm mục tiêu gì ?", sub: "burst · remarketing · user testing" },
              { label: "Niềm vui bắt đầu lúc nào ?", sub: "FTUE thực tế" },
            ]}
            root={{
              tone: "key",
              label: "User Persona",
              sub: "một con người cụ thể, có tên",
              kids: [{ label: "Quyết định giọng điệu, nền tảng, nội dung" }],
            }}
          />
        </Figure>
        <Facts
          rows={[
            [
              "Vì sao cần persona",
              <>
                Phân khúc kiểu &ldquo;25–35 tuổi&rdquo; quá mơ hồ để viết kịch
                bản. Một &ldquo;Roberto, 28 tuổi, chơi casual trên tàu điện&rdquo;
                mới trả lời được: nói giọng gì, đặt hook ở đâu, quảng cáo dài bao
                lâu.
              </>,
            ],
            [
              "Khớp nền tảng",
              "chọn mạng theo nơi persona thật sự ở, không mặc định Facebook và Google",
            ],
            [
              "Mục tiêu đổi cách làm creative",
              "burst khoe tính năng gây ấn tượng nhất · remarketing khoe cái đã cải thiện · user testing khoe đúng tính năng đang test",
            ],
          ]}
        />
      </Section>

      <Section title="Một quảng cáo một tính năng, vì đó là cách duy nhất đo được">
        <P>
          Vài giây đầu quyết định người xem có ở lại không, nên video mở bằng
          thứ ấn tượng nhất và đưa câu chốt tới sớm; cái gì không phục vụ câu
          chốt thì cắt. CTA nói thẳng hành động, có thể thử ở đầu, giữa hay cuối.
          Video ngắn giữ người xem tốt hơn, còn độ dài tối đa và mốc cho phép bỏ
          qua thì mỗi mạng quảng cáo quy định khác nhau, cần tra quy định hiện
          hành của từng mạng. Nhạc cũng đáng A/B test như hình ảnh.
        </P>
        <P>
          Nguyên tắc quan trọng nhất cho việc đo là mỗi quảng cáo chỉ khoe một
          tính năng. Khi đó tên creative gắn trên event trở thành nhãn có nghĩa:
          bạn biết người đến từ creative &ldquo;tính năng A&rdquo; hành xử khác
          người đến từ &ldquo;tính năng B&rdquo; thế nào. Nhồi mọi thứ vào một
          video vừa làm loãng thông điệp vừa vứt bỏ khả năng đó.
        </P>
      </Section>

      <Section title="Nối creative với hành vi trong app">
        <Figure caption="Mắt xích đầu tiên là attribution chảy về app; thiếu nó thì mọi nhánh sau chỉ có số trung bình">
          <Tree
            root={{
              label: "Creative X trên mạng quảng cáo",
              kids: [
                {
                  label: "Cài đặt",
                  kids: [
                    {
                      label: "MMP gán attribution",
                      kids: [
                        {
                          when: "callback về app",
                          tone: "key",
                          label: "thuộc tính creative = X",
                          sub: "trên mọi event",
                          kids: [
                            { label: "onboarding", sub: "có đi hết không" },
                            { label: "paywall", sub: "có xem, có mua không" },
                            { label: "ad_paid", sub: "xem bao nhiêu ad" },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            }}
            join={{ tone: "good", label: "Chân dung thật của user từ creative X" }}
          />
        </Figure>
        <Grid
          head={["Câu hỏi về creative", "Cần"]}
          rows={[
            ["Creative nào mang về người mua IAP", "attribution trên event + purchase_success"],
            ["Creative nào mang về người bỏ ngay ở màn đầu", "attribution + screen_show / screen_exit"],
            ["Creative nào hứa sai so với FTUE", "attribution + funnel onboarding"],
            ["Creative nào mang về người xem nhiều quảng cáo", "attribution + ad_show"],
            ["Creative nào cho doanh thu ad cao", "attribution + ad_paid trong cùng kho"],
            ["Funnel onboarding và paywall ở mức tổng", "chỉ cần event hành vi"],
          ]}
        />
      </Section>

      <Section title="Usecase">
        <UseCase
          n="1"
          title="Creative rẻ nhất chưa chắc là creative tốt nhất"
          situation={
            <p>
              App luyện nói tiếng Anh chạy hai video. Video A (hài, mini-game)
              có CPI 0,40 USD; video B (trước/sau khi luyện) CPI 0,70 USD. Sau 7
              ngày, LTV D7 của người từ A là 0,15 USD, của người từ B là 0,60 USD
              <Assumed />.
            </p>
          }
          flow={
            <Grid
              head={["Creative", "CPI", "LTV D7", "ROAS D7"]}
              rows={[
                ["A · hài", "0,40", "0,15", "≈ 38%"],
                ["B · trước/sau", "0,70", "0,60", "≈ 86%"],
              ]}
            />
          }
          why={
            <p>
              Nhìn CPI thì dồn tiền vào A. A hứa một trò chơi, app thật là bài
              học — người dùng tới rồi đi. B đắt hơn nhưng hứa đúng thứ app làm.
              Chỉ thấy được điều này khi attribution có trên event in-app.
            </p>
          }
          lesson="Đánh giá creative bằng ROAS và hành vi sau cài, không chỉ bằng CPI."
        />
      </Section>
    </>
  );
}
