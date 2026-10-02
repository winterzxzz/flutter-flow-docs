import { Figure, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Facts, Grid, Note, P } from "@/components/bits";
import { Assumed, UseCase } from "@/components/usecase";

export const metadata = { title: "LTV & cohort" };

export default function Ltv() {
  return (
    <>
      <PageHeader
        eyebrow="UA · khái niệm"
        title="LTV và cohort"
        lead="LTV cho biết một người dùng rốt cuộc mang về bao nhiêu tiền. Nhưng con số đặt trần cho CPI là LTV tại mốc hoàn vốn, không phải LTV trọn đời; lấy nhầm cái sau là trả trước cho doanh thu chưa chắc tới."
      />

      <Section title="Hai cách tính, chọn theo độ trưởng thành">
        <Figure caption="Chưa ra mắt thì không có ARPDAU để mà nhân — phải mượn số của app tương tự">
          <Tree
            root={{
              tone: "ask",
              label: "App đã ra mắt chưa ?",
              kids: [
                {
                  when: "chưa",
                  label: "Mượn dữ liệu lịch sử của app tương tự",
                  sub: "ước tính retention và doanh thu",
                  kids: [
                    {
                      tone: "warn",
                      label: "Thận trọng: đặc thù riêng có thể làm hành vi khác hẳn",
                    },
                  ],
                },
                {
                  when: "rồi",
                  tone: "ask",
                  label: "Dữ liệu đã đủ dày chưa ?",
                  kids: [
                    {
                      when: "mới, còn mỏng",
                      label: "Cách nhanh",
                      sub: "LTV = ARPDAU × số ngày sống trung bình",
                      kids: [
                        {
                          tone: "warn",
                          label: "Nhược: giả định mọi user như nhau",
                          sub: "bỏ qua churn và biến thiên",
                        },
                      ],
                    },
                    {
                      when: "đã đủ",
                      label: "Cách cohort",
                      sub: "doanh thu tích luỹ theo nhóm ngày cài",
                      kids: [
                        {
                          label: "Chia cohort D1 D7 D15 D30 D90",
                          kids: [
                            {
                              label: "Cộng doanh thu tích luỹ từng mốc",
                              kids: [
                                {
                                  label: "LTV cohort = tổng doanh thu ÷ số user",
                                  kids: [{ label: "LTV trung bình = gộp nhiều cohort" }],
                                },
                              ],
                            },
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
        <Facts
          rows={[
            [
              "Công thức nhanh",
              <>
                <C>LTV = ARPDAU × số ngày sống trung bình</C>
              </>,
            ],
            [
              "Ví dụ cohort",
              "100 người cài cùng ngày, tới D30 tạo ra 500$ → LTV D30 = 5$/người",
            ],
            [
              "Khi chưa ra mắt",
              "không có DAU nên không có ARPDAU. Dùng số liệu lịch sử của app cùng thể loại để ước tính retention và doanh thu, và ghi rõ đó là giả định.",
            ],
            [
              "Nguồn doanh thu phải cộng đủ",
              "IAP + quảng cáo + subscription. Thiếu một nguồn là LTV thấp giả.",
            ],
            [
              "Chi phí phải trừ",
              "phát triển, vận hành, và chính chi phí UA",
            ],
          ]}
        />
      </Section>

      <Section title="Dữ liệu cần cho cohort">
        <Grid
          head={["Mảnh dữ liệu", "Thường lấy từ đâu", "Lưu ý"]}
          rows={[
            ["ngày cài", "SDK analytics gắn sẵn trên mọi event", "dùng của SDK, đừng tự tính lại"],
            ["số ngày kể từ cài", "SDK tính từ ngày cài và thời điểm event", "nền của D1, D7, D30"],
            ["session", "SDK gắn session id, số thứ tự", "dùng để tính DAU"],
            ["doanh thu IAP", "event mua có transaction id, hoặc server", "trừ hoàn tiền"],
            ["doanh thu IAA", "paid event gửi về kho phân tích", "thiếu là LTV lệch thấp"],
          ]}
        />
        <Note tone="warn" title="Bộ đếm tự viết hay sai">
          <p>
            Trường &ldquo;số ngày hoạt động&rdquo; tự viết dễ đếm nhầm thành số
            lần mở trong ngày. Dùng ngày-kể-từ-cài của SDK nếu có, xem trang Lỗi
            hay gặp.
          </p>
        </Note>
      </Section>

      <Section title="Usecase">
        <UseCase
          n="1"
          title="Tính LTV D7 và D30 từ một cohort"
          situation={
            <p>
              1 000 người cài ngày 1/3. Doanh thu tích luỹ (IAP + ad) của đúng
              nhóm này: D1 = 150 USD, D7 = 600 USD, D30 = 1 500 USD
              <Assumed />.
            </p>
          }
          flow={
            <Grid
              head={["Mốc", "Doanh thu tích luỹ", "LTV = ÷ 1 000"]}
              rows={[
                ["D1", "150", "0,15"],
                ["D7", "600", "0,60"],
                ["D30", "1 500", "1,50"],
              ]}
            />
          }
          why={
            <p>
              Tỉ lệ D30/D7 = 2,5 cho biết đường cong còn dốc: một nửa giá trị
              tới sau tuần đầu. Nếu chỉ có IAP (giả sử 40% tổng), LTV D30 đọc ra
              là 0,60 thay vì 1,50, và trần CPI bị đặt thấp 2,5 lần.
            </p>
          }
          lesson="LTV là doanh thu tích luỹ của một nhóm cài cùng ngày chia cho kích thước nhóm, ở một mốc cụ thể. Luôn ghi mốc và luôn cộng đủ nguồn."
        />
        <UseCase
          n="2"
          title="Ước nhanh khi dữ liệu còn mỏng"
          situation={
            <p>
              App mới hai tuần, chưa có D30. ARPDAU đang khoảng 0,05 USD, ước số
              ngày hoạt động trung bình mỗi người là 20<Assumed />.
            </p>
          }
          why={
            <p>
              LTV ≈ 0,05 × 20 = 1,00 USD. Nhanh nhưng giả định mọi người như
              nhau: số ngày hoạt động trung bình bị kéo bởi một nhóm nhỏ dùng rất
              lâu. Dùng để định hướng, thay bằng cohort khi đủ dữ liệu.
            </p>
          }
          lesson="Cách nhanh cho một con số; cách cohort cho một quyết định."
        />
      </Section>

      <Section title="Bắt đầu đơn giản, nâng LTV bằng retention">
        <P>
          Mô hình LTV phức tạp quá sớm chỉ làm chậm vòng lặp; cách ước nhanh đủ
          để định hướng, cách cohort dùng khi cần quyết định. Vì người ở lại lâu
          tạo nhiều doanh thu hơn, cải thiện retention thường là cách nâng LTV
          rẻ nhất. Khi đặt trần cho CPI, dùng LTV tại mốc hoàn vốn đã chọn chứ
          không dùng LTV trọn đời, vì LTV trọn đời luôn lớn hơn và bao gồm cả
          doanh thu chưa chắc tới. Cách tính trần cụ thể ở trang CPI · ROAS.
        </P>
      </Section>
    </>
  );
}
