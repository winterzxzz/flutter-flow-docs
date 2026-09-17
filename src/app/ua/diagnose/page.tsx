import Link from "next/link";

import { Mermaid } from "@/components/mermaid";
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
};

const CASES: Case[] = [
  {
    code: "11.1",
    title: "ROAS · IPM · CTR cao, CPI thấp",
    reading: "Chiến dịch đang thắng ở mọi khâu.",
    cause: "Creative cộng hưởng đúng đối tượng và người dùng có giá trị.",
    fix: [
      "Bóc tách yếu tố thắng: tính năng nào được khoe, hình ảnh nào, câu chữ nào",
      "Sản xuất thêm creative cùng chủ đề và phong cách",
      "Tinh chỉnh nhỏ rồi A/B test, đừng đổi lớn",
      "Scale ngân sách và theo dõi sát để không tụt",
    ],
  },
  {
    code: "11.2",
    title: "CTR · CPI cao, ROAS · IPM thấp",
    reading: "Người dùng nhấp nhưng bỏ đi trước khi cài.",
    cause: "Lệch pha giữa quảng cáo và trang cửa hàng.",
    fix: [
      "Đồng bộ hình ảnh, tính năng và tông giữa quảng cáo và store",
      "Khoe lối chơi hoặc màn hình thật để đặt kỳ vọng đúng",
      "Cập nhật ảnh chụp, video, mô tả trên store",
      "Nếu đã đồng bộ mà vẫn vậy: kiểm tra click gian lận hoặc bot",
    ],
  },
  {
    code: "11.3",
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
  },
  {
    code: "11.4",
    title: "ROAS · ARPU · CPI cao, CTR · IPM thấp",
    reading:
      "Người dùng chất lượng nhưng quá ít, không scale được. Tổ hợp này hiếm — gặp nó thì kiểm tra lại số liệu trước đã.",
    cause: "Creative chưa đủ cuốn hút, hoặc store chưa chuyển đổi tốt.",
    fix: [
      "Giữ nguyên targeting — đối tượng đang có lãi",
      "Nâng cấp hook ở vài giây đầu",
      "Test biến thể thông điệp, hình ảnh, CTA",
      "Tối ưu ASO: ảnh chụp, mô tả, độ mượt của hành trình cài",
    ],
  },
  {
    code: "11.5",
    title: "Mọi chỉ số đều thấp",
    reading:
      "Concept không kết nối với đối tượng. Ở đây CPI thấp KHÔNG phải tin tốt — nó thấp vì gần như không ai muốn nhấp, tức nhu cầu thấp chứ không phải hiệu quả cao.",
    cause:
      "Ý tưởng lệch, hoặc lệch văn hoá khi bê nguyên creative từ thị trường khác sang.",
    fix: [
      "Rà lại concept: có truyền được giá trị độc đáo không",
      "Bản địa hoá hình ảnh, ngôn ngữ, tham chiếu văn hoá",
      "So hiệu suất giữa các thị trường để khoanh vùng",
      "Test concept mới hẳn, đừng tinh chỉnh cái cũ",
    ],
  },
];

export default function Diagnose() {
  return (
    <>
      <PageHeader
        eyebrow="UA · chương 11"
        title="Chẩn đoán theo tổ hợp chỉ số"
        lead="Mỗi tổ hợp CTR, IPM, CPI, ROAS, ARPU kể một câu chuyện khác nhau. Đọc đúng câu chuyện thì biết phải sửa creative hay sửa trang cửa hàng."
      />

      <Section title="Trước tiên: cao và thấp là so với cái gì">
        <Note tone="info" title="Không có ngưỡng tuyệt đối">
          <p>
            <b>ROAS</b> có mốc cứng duy nhất: <C>1</C> (tức 100%) là hoà vốn.
            Trên 1 là lãi, dưới 1 là lỗ. Nhưng &ldquo;đủ lãi&rdquo; còn tuỳ kỳ
            hoàn vốn bạn chọn.
          </p>
          <p>
            <b>CTR, IPM, CPI, ARPU</b> không có mốc phổ quát — chúng đổi theo
            thể loại, nền tảng và quốc gia. Lấy mốc so sánh từ chính bạn: trung
            vị của các creative đang chạy cùng chiến dịch, hoặc số liệu tuần
            trước của cùng thị trường. Một creative &ldquo;CTR thấp&rdquo; nghĩa
            là thấp hơn hẳn các creative anh em của nó, không phải thấp hơn một
            con số trong sách.
          </p>
        </Note>
      </Section>

      <Section title="Cây quyết định">
        <Mermaid
          caption="So mỗi chỉ số với trung vị của các creative cùng chiến dịch, không với một ngưỡng cố định"
          chart={`flowchart TB
  S{"CTR cao ?"}
  S -->|không| L{"ROAS · ARPU cao ?"}
  L -->|có| C4["11.4 — user tốt nhưng ít<br/>sửa hook và ASO"]
  L -->|không| C5["11.5 — mọi thứ thấp<br/>đổi concept, bản địa hoá"]
  S -->|có| I{"IPM cao ?"}
  I -->|không| C2["11.2 — nhấp mà không cài<br/>lệch quảng cáo và store"]
  I -->|có| R{"ROAS · ARPU cao ?"}
  R -->|có| C1["11.1 — lý tưởng<br/>nhân bản và scale"]
  R -->|không| C3["11.3 — cài nhiều không ra tiền<br/>lệch kỳ vọng FTUE"]`}
        />
      </Section>

      <Section title="Năm tình huống">
        <div className="space-y-3">
          {CASES.map((c) => (
            <Card key={c.code} className="gap-0 py-4">
              <CardContent className="px-5">
                <div className="mb-2 flex items-center gap-2.5">
                  <Badge variant="secondary" className="font-mono text-[10px]">
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
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Chẩn đoán này chạy được trên dữ liệu của bạn không">
        <Mermaid
          caption="Ba trong năm chỉ số đến từ mạng quảng cáo; hai còn lại phụ thuộc code"
          chart={`flowchart LR
  subgraph net["Mạng quảng cáo báo — có sẵn"]
    CTR["CTR"]
    IPM["IPM"]
    CPI["CPI"]
  end
  subgraph app["Phụ thuộc code"]
    ARPU["ARPU"]
    ROAS["ROAS"]
  end
  CTR --> DX{"Chẩn đoán"}
  IPM --> DX
  CPI --> DX
  ARPU --> DX
  ROAS --> DX
  ARPU -.->|thiếu doanh thu IAA| W["lệch thấp"]
  ROAS -.->|thiếu doanh thu IAA| W
  ROAS -.->|attribution chưa nối| W2["không tách được<br/>theo creative"]
  style W stroke-dasharray: 4 4
  style W2 stroke-dasharray: 4 4`}
        />
        <Note tone="warn" title="Hai lý do chẩn đoán có thể sai hướng">
          <p>
            <b>ARPU và ROAS lệch thấp.</b> Chúng chỉ phản ánh doanh thu IAP. Với
            app sống bằng quảng cáo, một chiến dịch thật ra thuộc nhóm{" "}
            <b>11.1</b> dễ bị đọc thành <b>11.3</b> — và bạn đi sửa creative
            trong khi creative đó vốn đang tốt.
          </p>
          <p>
            <b>Không tách được theo creative.</b> Bảng này giả định bạn so từng
            creative với nhau. Vì attribution chưa nối, mọi event đều mang{" "}
            <C>ua_creative = &quot;Unattributed&quot;</C>, nên bạn chỉ có một
            con số trung bình cho tất cả.
          </p>
          <p>
            Nói thẳng: bảng chẩn đoán này <b>chưa dùng được</b> để ra quyết định
            ngân sách. Nối attribution rồi thêm event ad trước —{" "}
            <Link href="/ua/instrumentation" className="underline underline-offset-4">
              xem Kế hoạch đo
            </Link>
            .
          </p>
        </Note>
      </Section>
    </>
  );
}
