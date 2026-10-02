import Link from "next/link";

import { Canvas, Figure, Group, Node, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Note } from "@/components/bits";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Chẩn đoán chỉ số" };

type Case = {
  code: string;
  title: string;
  reading: string;
  cause: string;
  fix: string[];
  example: string;
};

const CASES: Case[] = [
  {
    code: "Thắng mọi khâu",
    title: "ROAS · IPM · CTR cao, CPI thấp",
    reading: "Chiến dịch đang thắng ở mọi khâu.",
    cause: "Creative chạm đúng nhu cầu của đối tượng, và đối tượng đó có giá trị.",
    fix: [
      "Bóc tách yếu tố thắng: tính năng nào được khoe, hình ảnh nào, câu chữ nào",
      "Sản xuất thêm creative cùng chủ đề và phong cách",
      "Tinh chỉnh nhỏ rồi A/B test, đừng đổi lớn",
      "Scale ngân sách và theo dõi sát để không tụt",
    ],
    example:
      "Trung vị chiến dịch: CTR 1,0%, IPM 8, CPI 0,80 USD, ROAS D7 35%. Creative X: CTR 1,8%, IPM 14, CPI 0,55 USD, ROAS D7 60%.",
  },
  {
    code: "Nhấp mà không cài",
    title: "CTR · CPI cao, ROAS · IPM thấp",
    reading: "Người dùng nhấp nhưng bỏ đi trước khi cài.",
    cause: "Lệch pha giữa quảng cáo và trang cửa hàng.",
    fix: [
      "Đồng bộ hình ảnh, tính năng và tông giữa quảng cáo và store",
      "Khoe lối chơi hoặc màn hình thật để đặt kỳ vọng đúng",
      "Cập nhật ảnh chụp, video, mô tả trên store",
      "Nếu đã đồng bộ mà vẫn vậy: kiểm tra click gian lận hoặc bot",
    ],
    example:
      "Creative Y: CTR 2,2% (trung vị 1,0%) nhưng IPM 4 (trung vị 8), CPI 1,40 USD. Video khoe đồ hoạ 3D; ảnh store là giao diện 2D phẳng — người dùng nhấp vì video, tới store thì không nhận ra app.",
  },
  {
    code: "Cài nhiều, không ra tiền",
    title: "CTR · IPM cao, CPI · ROAS · ARPU thấp",
    reading: "Cài nhiều, rẻ, nhưng không ra tiền.",
    cause:
      "Quảng cáo hứa một đằng, FTUE một nẻo; hoặc đối tượng vốn không có ý định chi tiền.",
    fix: [
      "Căn chỉnh creative với trải nghiệm thật, đặc biệt là màn hình đầu tiên",
      "Phân khúc người tạo doanh thu và nhắm lại nhóm đó",
      "Phân tích churn sớm, so LTV giữa các phân khúc",
      "Nếu đối tượng đúng nhưng không kiếm tiền: đổi thông điệp creative",
    ],
    example:
      "Creative Z: CTR 2,0%, IPM 16, CPI 0,35 USD, nhưng ROAS D7 12% (trung vị 35%). Video hứa “chơi miễn phí không quảng cáo”; app thật có interstitial sau mỗi màn.",
  },
  {
    code: "Ít nhưng chất",
    title: "ROAS · ARPU · CPI cao, CTR · IPM thấp",
    reading:
      "Người dùng chất lượng nhưng quá ít, không scale được. Tổ hợp này hiếm; gặp nó thì kiểm tra lại số liệu trước đã.",
    cause: "Creative chưa đủ cuốn hút, hoặc store chưa chuyển đổi tốt.",
    fix: [
      "Giữ nguyên targeting — đối tượng đang có lãi",
      "Nâng cấp hook ở vài giây đầu",
      "Test biến thể thông điệp, hình ảnh, CTA",
      "Tối ưu ASO: ảnh chụp, mô tả, độ mượt của hành trình cài",
    ],
    example:
      "Creative W: CTR 0,4%, IPM 3, CPI 2,10 USD, nhưng ROAS D7 70% và ARPU gấp 3 trung vị. Video dài, 8 giây đầu là logo — ít người xem tới phần hay, nhưng ai xem tới thì đúng đối tượng.",
  },
  {
    code: "Concept hỏng",
    title: "Mọi chỉ số đều thấp",
    reading:
      "Concept không kết nối với đối tượng. Ở đây CPI thấp không phải tin tốt: nó thấp vì gần như không ai muốn nhấp, tức nhu cầu thấp chứ không phải hiệu quả cao.",
    cause:
      "Ý tưởng lệch, hoặc lệch văn hoá khi bê nguyên creative từ thị trường khác sang.",
    fix: [
      "Rà lại concept: có truyền được giá trị độc đáo không",
      "Bản địa hoá hình ảnh, ngôn ngữ, tham chiếu văn hoá",
      "So hiệu suất giữa các thị trường để khoanh vùng",
      "Test concept mới hẳn, đừng tinh chỉnh cái cũ",
    ],
    example:
      "Creative V ở thị trường mới: CTR 0,3%, IPM 2, ROAS D7 8%. CPI 0,30 USD trông rẻ chỉ vì gần như không ai nhấp; video bê nguyên từ thị trường khác với meme địa phương không ai hiểu.",
  },
];

export default function Diagnose() {
  return (
    <>
      <PageHeader
        eyebrow="UA · khái niệm"
        title="Chẩn đoán theo tổ hợp chỉ số"
        lead="Mỗi tổ hợp CTR, IPM, CPI, ROAS, ARPU chỉ ra một chỗ hỏng khác nhau trên đường từ quảng cáo tới doanh thu: ở creative, ở trang cửa hàng, hay ở trải nghiệm đầu. Đọc sai tổ hợp là đi sửa một thứ đang chạy tốt."
      />

      <Section title="Trước tiên: cao và thấp là so với cái gì">
        <Note tone="info" title="Không có ngưỡng tuyệt đối">
          <p>
            <b>ROAS</b> có mốc cứng duy nhất: <C>1</C> (tức 100%) là hoà vốn.
            Trên 1 là lãi, dưới 1 là lỗ. Nhưng &ldquo;đủ lãi&rdquo; còn tuỳ kỳ
            hoàn vốn bạn chọn.
          </p>
          <p>
            <b>CTR, IPM, CPI, ARPU</b> không có mốc phổ quát: chúng đổi theo
            thể loại, nền tảng và quốc gia. Lấy mốc so sánh từ chính bạn: trung
            vị của các creative đang chạy cùng chiến dịch, hoặc số liệu tuần
            trước của cùng thị trường. Một creative &ldquo;CTR thấp&rdquo; nghĩa
            là thấp hơn hẳn các creative anh em của nó, không phải thấp hơn một
            con số trong sách.
          </p>
        </Note>
      </Section>

      <Section title="Cây quyết định">
        <Figure caption="So mỗi chỉ số với trung vị của các creative cùng chiến dịch, không với một ngưỡng cố định">
          <Tree
            root={{
              tone: "ask",
              label: "CTR cao ?",
              kids: [
                {
                  when: "không",
                  tone: "ask",
                  label: "ROAS · ARPU cao ?",
                  kids: [
                    {
                      when: "có",
                      label: "Ít nhưng chất",
                      sub: (
                        <>
                          user tốt nhưng ít
                          <br />
                          sửa hook và ASO
                        </>
                      ),
                    },
                    {
                      when: "không",
                      tone: "bad",
                      label: "Concept hỏng",
                      sub: (
                        <>
                          mọi thứ thấp
                          <br />
                          đổi concept, bản địa hoá
                        </>
                      ),
                    },
                  ],
                },
                {
                  when: "có",
                  tone: "ask",
                  label: "IPM cao ?",
                  kids: [
                    { when: "không", label: "Nhấp mà không cài", sub: "lệch quảng cáo và store" },
                    {
                      when: "có",
                      tone: "ask",
                      label: "ROAS · ARPU cao ?",
                      kids: [
                        {
                          when: "có",
                          tone: "good",
                          label: "Thắng mọi khâu",
                          sub: (
                            <>
                              lý tưởng
                              <br />
                              nhân bản và scale
                            </>
                          ),
                        },
                        { when: "không", label: "Cài nhiều, không ra tiền", sub: "lệch kỳ vọng FTUE" },
                      ],
                    },
                  ],
                },
              ],
            }}
          />
        </Figure>
      </Section>

      <Section title="Năm tình huống">
        <div className="space-y-3">
          {CASES.map((c) => (
            <Card key={c.code} className="gap-0 py-4">
              <CardContent className="px-5">
                <div className="mb-2 flex items-center gap-2.5">
                  <Badge variant="secondary" className="text-[10px]">
                    {c.code}
                  </Badge>
                  <h3 className="text-sm font-semibold">{c.title}</h3>
                </div>
                <p className="text-sm">{c.reading}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.cause}</p>
                <ul className="mt-3 space-y-1">
                  {c.fix.map((f) => (
                    <li
                      key={f}
                      className="pl-4 text-sm text-muted-foreground before:-ml-4 before:inline-block before:w-4 before:text-muted-foreground/50 before:content-['→']"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 rounded-md bg-muted/40 px-3 py-2 text-sm text-foreground/80">
                  <span className="font-medium">Ví dụ (số liệu giả định): </span>
                  {c.example}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Chẩn đoán có tin được không">
        <Figure caption="Ba trong năm chỉ số đến từ mạng quảng cáo; hai còn lại phụ thuộc đo lường trong app">
          <Canvas
            className="mx-auto max-w-2xl"
            cols="minmax(0, 1fr) 4.6rem"
            wcols="minmax(0, 1fr) 9rem"
            gap={["1.5rem", "1rem"]}
            wgap={["2.5rem", "1rem"]}
            edges={[
              { from: "net", to: "DX", inAt: "align" },
              { from: "app", to: "DX", inAt: "align" },
              { from: "ARPU", to: "W", dashed: true, tone: "warn", inAt: "align", head: false },
              { from: "ROAS", to: "W", dashed: true, tone: "warn", outAt: 0.3, inAt: 0.8, head: false },
              { from: "ROAS", to: "W2", dashed: true, tone: "warn", outAt: 0.7, inAt: "align", head: false },
            ]}
          >
            <Group id="net" title="Mạng quảng cáo báo" col="1" row="1" cols="repeat(3, minmax(0, 1fr))">
              <Node>CTR</Node>
              <Node>IPM</Node>
              <Node>CPI</Node>
            </Group>
            <Group
              id="app"
              title="Phụ thuộc đo lường in-app"
              col="1"
              row="2"
              cols="repeat(2, minmax(0, 1fr))"
            >
              <Node id="ARPU">ARPU</Node>
              <Node id="ROAS">ROAS</Node>
            </Group>
            <Node id="DX" tone="key" className="dg-tall" col="2" row="1 / 3">
              Chẩn đoán
            </Node>
            <Group bare className="mt-4 px-[0.7rem]" col="1" row="3" cols="repeat(2, minmax(0, 1fr))">
              <Node id="W" tone="warn" when="thiếu doanh thu ad">
                lệch thấp
              </Node>
              <Node id="W2" tone="warn" when="thiếu attribution">
                không tách được theo creative
              </Node>
            </Group>
          </Canvas>
        </Figure>
        <Note tone="warn" title="Hai lý do chẩn đoán có thể sai hướng">
          <p>
            <b>ARPU và ROAS lệch thấp.</b> Nếu kho chỉ có doanh thu IAP, một
            chiến dịch thật ra thuộc nhóm <b>&ldquo;thắng mọi khâu&rdquo;</b> ở app sống bằng quảng cáo
            dễ bị đọc thành <b>&ldquo;cài nhiều, không ra tiền&rdquo;</b>, và bạn đi sửa creative vốn đang tốt.
          </p>
          <p>
            <b>Không tách được theo creative.</b> Bảng này giả định bạn so từng
            creative với nhau. Nếu event in-app không mang nguồn cài, bạn chỉ có
            một con số trung bình cho tất cả.
          </p>
          <p>
            Kiểm tra hai điều kiện đó trước khi dùng bảng để ra quyết định ngân
            sách, xem{" "}
            <Link href="/ua/instrumentation" className="underline underline-offset-4">
              Kế hoạch đo
            </Link>
            . Doanh thu ad trên MMP còn lệch với AdMob vì những lý do hoàn toàn
            bình thường, xem{" "}
            <Link href="/deep/revenue-gap" className="underline underline-offset-4">
              Vì sao doanh thu AdMob lệch với MMP
            </Link>
            ; còn eCPM tụt theo giờ thì xem{" "}
            <Link href="/deep/ecpm-day" className="underline underline-offset-4">
              Vì sao eCPM giảm dần trong ngày
            </Link>
            .
          </p>
        </Note>
      </Section>
    </>
  );
}
