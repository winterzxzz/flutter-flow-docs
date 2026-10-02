import { Canvas, Figure, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, Note } from "@/components/bits";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UseCase } from "@/components/usecase";

export const metadata = { title: "Kế hoạch đo" };

type Step = {
  order: string;
  effort: string;
  title: string;
  why: string;
  what: string;
  done: string;
};

const STEPS: Step[] = [
  {
    order: "1",
    effort: "Nhỏ",
    title: "Định danh user và user property",
    why: "Mọi event và giao dịch phải gắn vào cùng một người, nếu không không join được gì.",
    what: "Tạo hoặc đọc lại user id trước khi init SDK IAP, MMP và analytics. Gắn premium, ngôn ngữ, phiên bản config làm user property. Đối chiếu danh sách khoá dành riêng của SDK trước khi đặt tên.",
    done: "Một event bất kỳ trong kho có user id và các user property đúng.",
  },
  {
    order: "2",
    effort: "Vừa",
    title: "Nối attribution về app",
    why: "Không có bước này thì mọi phân tích theo campaign, network hay creative đều bất khả thi.",
    what: "Đăng ký callback attribution trước khi init MMP SDK; khi nhận, ghi network, campaign, adgroup, creative, tracker name vào user property. Tách riêng organic.",
    done: "Lượt cài qua tracker link test hiện đúng network trên event in-app đầu tiên sau đó.",
  },
  {
    order: "3",
    effort: "Vừa",
    title: "Event quảng cáo",
    why: "App sống bằng IAA cần funnel ad: request, fill, show, click.",
    what: "ad_request, ad_load_success, ad_load_fail, ad_show, ad_click; mỗi event mang format, placement (enum đóng), ad unit, mã lỗi nếu có.",
    done: "Tính được fill rate và số ad_show trên mỗi phiên theo placement.",
  },
  {
    order: "4",
    effort: "Vừa",
    title: "Doanh thu ad về cả MMP lẫn kho",
    why: "Thiếu nó thì ARPU, LTV, ROAS thiếu một nửa doanh thu.",
    what: "Từ paid event của Ad SDK: gửi MMP (ad revenue API) và gửi ad_paid vào kho kèm giá trị đã đổi đơn vị, tiền tệ, độ chính xác, format, placement.",
    done: "Tổng ad_paid một ngày khớp tương đối với báo cáo của mạng quảng cáo.",
  },
  {
    order: "5",
    effort: "Nhỏ",
    title: "Event IAP đủ để khử trùng và đảo ngược",
    why: "Hoàn tiền và event gửi trùng làm doanh thu sai nếu không có khoá.",
    what: "paywall_show (điểm vào), paywall_click (gói), purchase_success / purchase_fail kèm transaction id, product id, giá, tiền tệ; kết quả verify là một event trong cùng dòng.",
    done: "Không có transaction id trùng trong kho; hoàn tiền trừ được đúng lần mua.",
  },
  {
    order: "6",
    effort: "Nhỏ",
    title: "Báo lỗi cho những gì hỏng lặng lẽ",
    why: "Parse config hỏng, verify hỏng, consent lỗi đều không crash, nên không báo thì không ai biết.",
    what: "Event và non-fatal cho parse Remote Config, verify IAP, consent; kèm phiên bản template config.",
    done: "Publish thử một JSON hỏng ở môi trường test thì cảnh báo tới được.",
  },
  {
    order: "7",
    effort: "Nhỏ",
    title: "Nhóm đối chứng trên Remote Config",
    why: "Điều kiện tối thiểu để A/B test mật độ quảng cáo hay paywall.",
    what: "Dùng condition random percentile, rollout hoặc A/B testing để chia nhóm song song; ghi nhóm vào user property.",
    done: "So được retention và ARPU giữa hai nhóm trong cùng khoảng thời gian.",
  },
];

export default function Instrumentation() {
  return (
    <>
      <PageHeader
        eyebrow="UA · hành động"
        title="Kế hoạch đo"
        lead="Khi một mắt xích đo lường đứt từ sớm, mọi con số phía sau vẫn ra, chỉ là sai. Các bước dưới đây xếp theo thứ tự phụ thuộc, để khi dựng app mới bạn làm đúng trình tự, và khi rà một app đang chạy bạn tìm được mắt xích đứt sớm nhất."
      />

      <Section title="Thứ tự phụ thuộc">
        <Figure caption="Bước 3 và 4 đi cùng nhau; bước 2 mở khoá toàn bộ nhánh phân tích theo nguồn">
          <Canvas
            className="mx-auto max-w-2xl"
            cols="1.6rem 1.6rem minmax(0, 1fr) 2.4rem minmax(0, 1fr)"
            gap={["0px", "0.8rem"]}
            edges={[
              { from: "S1", to: "S2", out: "b", in: "l", outAt: 13 },
              { from: "S1", to: "S3", out: "b", in: "l", outAt: 13 },
              { from: "S1", to: "S5", out: "b", in: "l", outAt: 13 },
              { from: "S3", to: "S4", out: "b", in: "l", outAt: 13 },
              { from: "S2", to: "R1", tone: "good", inAt: "align" },
              { from: "S3", to: "R3", tone: "good", inAt: "align" },
              { from: "S4", to: "R2", tone: "good", inAt: "align" },
              { from: "S5", to: "R2", tone: "good", inAt: "align" },
              { from: "S6", to: "R4", tone: "good", inAt: "align" },
              { from: "S7", to: "R5", tone: "good", inAt: "align" },
            ]}
          >
            <Node id="S1" col="1 / 4" row="1">
              1 · định danh + user property
            </Node>
            <Node id="S2" col="2 / 4" row="2">
              2 · attribution
            </Node>
            <Node id="R1" tone="good" col="5" row="2" sub="network · campaign · creative">
              ROAS, LTV theo
            </Node>
            <Node id="S3" col="2 / 4" row="3">
              3 · event ad
            </Node>
            <Node id="R3" tone="good" col="5" row="3">
              funnel ad, tần suất
            </Node>
            <Node id="S4" col="3 / 4" row="4">
              4 · doanh thu ad
            </Node>
            <Node id="S5" col="2 / 4" row="5">
              5 · event IAP
            </Node>
            <Node id="R2" tone="good" className="dg-tall" col="5" row="4 / 6">
              ARPU tổng · eCPM · ROAS tổng
            </Node>
            <Node id="S6" col="1 / 4" row="6">
              6 · báo lỗi lặng lẽ
            </Node>
            <Node id="R4" tone="good" col="5" row="6">
              hỏng từ xa phát hiện được
            </Node>
            <Node id="S7" col="1 / 4" row="7">
              7 · nhóm đối chứng
            </Node>
            <Node id="R5" tone="good" col="5" row="7">
              A/B test thật sự
            </Node>
          </Canvas>
        </Figure>
      </Section>

      <Section title="Mỗi bước có một điều kiện “xong”">
        <div className="space-y-3">
          {STEPS.map((s) => (
            <Card key={s.order} className="gap-0 py-4">
              <CardContent className="px-5">
                <div className="mb-2 flex flex-wrap items-center gap-2.5">
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {s.order}
                  </Badge>
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                  <Badge variant="outline" className="text-[10px]">
                    {s.effort}
                  </Badge>
                </div>
                <p className="text-sm">{s.why}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.what}</p>
                <p className="mt-2.5 text-[12px] text-muted-foreground/80">
                  Xong khi: {s.done}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Mỗi bước mở khoá chỉ số nào">
        <Grid
          head={["Chỉ số", "Cần tới bước"]}
          rows={[
            ["ARPU (IAP)", "1, 5"],
            ["ARPU (IAA), eCPM theo placement", "1, 3, 4"],
            ["ARPU tổng, LTV cohort đủ doanh thu", "1, 4, 5"],
            ["ROAS theo creative", "1, 2, 4, 5"],
            ["Tác động của mật độ ad lên retention", "3, 7"],
            ["Chẩn đoán theo tổ hợp chỉ số", "2, 4, 5"],
          ]}
        />
        <Note tone="info" title="Không đụng tới CTR, IPM, CPI">
          <p>
            Ba chỉ số đó do mạng quảng cáo báo, nằm ngoài app. Kế hoạch này chỉ
            dựng vế doanh thu và hành vi, tức nửa còn lại của ROAS.
          </p>
        </Note>
      </Section>

      <Section title="Usecase">
        <UseCase
          n="1"
          title="Rà một app đang chạy theo bảy bước"
          situation={
            <p>
              Một app Flutter đã có event màn hình và event mua, đã gửi doanh thu
              ad cho MMP. Team muốn biết vì sao không tính được ROAS theo
              creative.
            </p>
          }
          why={
            <p>
              Đi lần lượt: bước 1 có; bước 2 thiếu vì callback attribution không
              được nối, mọi event mang nguồn mặc định; bước 3 và 4 thiếu vì doanh
              thu ad không vào kho; bước 5 thiếu transaction id. Ba lỗ hổng đó
              giải thích trọn vẹn câu hỏi, và thứ tự sửa đi theo sơ đồ phụ thuộc:
              bước 2 trước, rồi 3–4, rồi 5.
            </p>
          }
          lesson="Đo lường là chuỗi phụ thuộc; tìm mắt xích đứt sớm nhất rồi sửa từ đó. Chi tiết từng lỗi ở trang Lỗi hay gặp."
        />
      </Section>
    </>
  );
}
