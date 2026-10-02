import { Figure, Rail, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Facts, Grid } from "@/components/bits";
import { Assumed, UseCase } from "@/components/usecase";

export const metadata = { title: "Các giai đoạn launch" };

export default function Launch() {
  return (
    <>
      <PageHeader
        eyebrow="UA · khái niệm"
        title="Technical → Soft → Global"
        lead="Mỗi giai đoạn có mục tiêu, thị trường và tiêu chí thoát khác nhau. Nhảy cóc sang Tier 1 khi chưa xong soft launch là cách đốt ngân sách nhanh nhất."
      />

      <Section title="Ba giai đoạn">
        <Figure caption="Chỉ tiến sang bước sau khi tiêu chí thoát đã đạt">
          <Rail
            rows={[
              { label: "Technical Launch", sub: "Tier 3 · CPI rẻ" },
              {
                tone: "ask",
                label: (
                  <>
                    Hết crash
                    <br />
                    gắn kết ổn ?
                  </>
                ),
                exit: { label: "chưa", to: "↺ Technical Launch" },
                down: "rồi",
              },
              { label: "Soft Launch", sub: "thị trường gần đích · CPI vừa" },
              {
                tone: "ask",
                label: (
                  <>
                    Kiếm tiền và
                    <br />
                    giữ chân đạt mục tiêu ?
                  </>
                ),
                exit: { label: "chưa", to: "↺ Soft Launch" },
                down: "rồi",
              },
              { tone: "good", label: "Global Launch", sub: "Tier 1 · CPI cao" },
            ]}
          />
        </Figure>
        <Grid
          head={["Giai đoạn", "Thị trường", "Mục tiêu", "Đo cái gì"]}
          rows={[
            [
              "Technical",
              "Tier 3 — CPI thấp",
              "thu dữ liệu, sửa lỗi, test cơ chế",
              "crash, loading, funnel onboarding",
            ],
            [
              "Soft",
              "thị trường có hành vi gần thị trường đích, CPI vừa phải",
              "test kiếm tiền, giá IAP, vị trí ad, giữ chân",
              "ARPU, retention, tần suất ad",
            ],
            [
              "Global",
              "Tier 1 — ARPU cao",
              "scale với creative và targeting đã tinh chỉnh",
              "ROAS, payback",
            ],
          ]}
        />
      </Section>

      <Section title="Remote Config là công cụ của giai đoạn soft launch">
        <Figure caption="Không có condition thì chỉ là so trước/sau theo thời gian — không phải A/B test">
          <Tree
            root={{
              label: "Giả thuyết: ad dày quá làm rơi retention",
              kids: [
                {
                  tone: "ask",
                  label: "có chia nhóm song song ?",
                  kids: [
                    {
                      when: "có · condition / A/B",
                      label: (
                        <>
                          nhóm A: giãn cách 30s
                          <br />
                          nhóm B: giãn cách 60s
                        </>
                      ),
                      kids: [
                        { tone: "good", label: "so retention và doanh thu ad", sub: "cùng thời điểm" },
                      ],
                    },
                    {
                      when: "không",
                      label: "đổi giá trị cho mọi người",
                      kids: [
                        {
                          label: "so cohort trước với cohort sau",
                          kids: [
                            {
                              tone: "warn",
                              label: "nhiễu: mùa vụ, phiên bản, thay đổi nguồn traffic",
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
              "Đòn bẩy thường có",
              "bật tắt từng format · giãn cách ad toàn màn hình · danh sách ad unit · làm mới native · gói trên paywall",
            ],
            [
              "Độ trễ phải tính vào thiết kế test",
              "giá trị mới tới người dùng theo cách app nạp config: ngay lập tức, sau màn loading, hay từ lần mở kế tiếp",
            ],
            [
              "Đo cả hai phía",
              "đổi mật độ ad mà chỉ có event retention thì thấy được cái mất, không thấy được cái được",
            ],
          ]}
        />
      </Section>

      <Section title="Tiêu chí thoát nên dựa trên dữ liệu nào">
        <Grid
          head={["Câu hỏi", "Đo bằng"]}
          rows={[
            ["Onboarding có rơi nhiều không", "screen_show / screen_exit theo chuỗi màn đầu"],
            ["Load có chậm gây bỏ cuộc không", "loading_start / loading_finish kèm mã lỗi"],
            ["Paywall có chuyển đổi không", "paywall_show → paywall_click → purchase_success"],
            ["Ad có làm rơi người dùng không", "ad_show theo phiên, đối chiếu retention"],
            ["Doanh thu ad trên đầu người", "ad_paid trong cùng kho với event hành vi"],
            ["Retention theo cohort", "ngày cài và ngày-kể-từ-cài do SDK gắn"],
            ["So thị trường hoặc campaign", "attribution trên event"],
          ]}
        />
      </Section>

      <Section title="Usecase">
        <UseCase
          n="1"
          title="Soft launch đạt kiếm tiền nhưng hụt retention D7"
          situation={
            <p>
              App chạy soft launch ở Philippines và Mexico, mỗi nước 5 000
              install. Mục tiêu đặt trước: retention D1 ≥ 35%, D7 ≥ 12%, LTV D7
              ≥ 0,10 USD. Kết quả: D1 38%, D7 9%, LTV D7 0,12 USD
              <Assumed />.
            </p>
          }
          why={
            <p>
              Kiếm tiền đạt nhưng D7 hụt: người dùng thích ngày đầu rồi rời đi.
              Mở Tier 1 lúc này là trả CPI cao cho người dùng không ở lại. Việc
              tiếp theo là xem funnel màn hình D2–D7 và thử giãn mật độ ad bằng
              một nhóm đối chứng, không phải tăng ngân sách.
            </p>
          }
          lesson="Đặt tiêu chí thoát bằng con số trước khi chạy; chỉ số nào hụt thì nó chỉ ra việc phải làm."
        />
      </Section>
    </>
  );
}
