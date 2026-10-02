import { PageHeader, Section } from "@/components/page-header";
import { P } from "@/components/bits";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Lỗi hay gặp" };

type Lesson = {
  area: "Tracking" | "IAA" | "IAP" | "Config";
  sev: "Cao" | "TB" | "Thấp";
  title: string;
  symptom: string;
  cause: string;
  lesson: string;
  fix: string;
  check: string;
};

const LESSONS: Lesson[] = [
  {
    area: "Tracking",
    sev: "Cao",
    title: "Attribution không về tới app",
    symptom:
      "Dashboard MMP chia lượt cài đúng theo campaign, nhưng trong kho phân tích mọi event mang nguồn “Unattributed”; chia doanh thu theo campaign chỉ ra đúng một dòng.",
    cause:
      "Callback attribution không được gán trước khi init SDK, và hàm ghi nguồn cài vào user property không có ai gọi.",
    lesson:
      "Một tích hợp chỉ xong khi dữ liệu đi hết đường tới chỗ được phân tích; đọc code từng đầu dây không chứng minh được điều đó.",
    fix: "Gán callback trước init, ghi năm trường nguồn cài thành user property, tách riêng organic.",
    check: "Cài bản release qua tracker link test; event kế tiếp phải mang đúng network. Lặp lại với một lượt cài organic.",
  },
  {
    area: "Tracking",
    sev: "Cao",
    title: "Không có event quảng cáo nào trong kho phân tích",
    symptom:
      "ARPU, LTV, ROAS trong kho phân tích chỉ có phần IAP. App sống bằng quảng cáo trông như đang lỗ; không vẽ được funnel ad, không đo được giãn cách ảnh hưởng doanh thu ra sao.",
    cause:
      "Doanh thu ad chỉ được gửi cho MMP. Nhóm event ad được khai báo nhưng rỗng; danh sách placement có nhưng không ai dùng.",
    lesson:
      "Mỗi dòng tiền cần có mặt ở mọi nơi ra quyết định; một nguồn thiếu không làm con số biến mất mà làm nó sai một cách hợp lý.",
    fix: "Thêm ad_request, ad_load_success/fail, ad_show, ad_click, ad_paid kèm format và placement.",
    check: "Trong một phiên release, mỗi impression có đúng một ad_paid với giá trị đã chia micros.",
  },
  {
    area: "Tracking",
    sev: "Cao",
    title: "Đếm ngày hoạt động thành đếm số lần mở trong ngày",
    symptom:
      "Người mở app ba ngày liền, mỗi ngày một lần, có active day = 0; người mở năm lần trong một ngày có active day = 4. Phân khúc “người dùng gắn bó” ngược hẳn thực tế.",
    cause:
      "Bộ đếm chỉ tăng khi lần mở này cùng ngày với lần trước, và không tăng khi sang ngày mới.",
    lesson:
      "Chỉ số tự viết cần test bằng kịch bản thời gian, không chỉ bằng đọc điều kiện; nếu SDK đã tính sẵn thì dùng của SDK.",
    fix: "Chỉ tăng khi ngày lịch (theo múi giờ cố định) của lần mở này khác lần trước, hoặc bỏ trường tự viết và dùng ngày-kể-từ-cài của SDK.",
    check: "Test ba kịch bản: hai lần mở cùng ngày, hai ngày liền kề, cách nhau nhiều ngày.",
  },
  {
    area: "Config",
    sev: "Cao",
    title: "Cache config ghi mà không bao giờ đọc",
    symptom:
      "Ad đầu mỗi phiên vẫn dùng ad unit và giãn cách cũ, dù console đã đổi từ lâu.",
    cause:
      "Cấu hình đã parse được lưu sau mỗi lần fetch, nhưng dòng đọc lại lúc khởi động bị comment, nên mọi lần mở app lạnh chạy bằng in-app default.",
    lesson:
      "Một cơ chế lưu chỉ có giá trị khi có người đọc; test đường đọc, không chỉ đường ghi.",
    fix: "Lúc khởi động đọc cache phiên trước nếu có, rồi mới fetch; in-app default chỉ dùng cho lần mở đầu tiên.",
    check: "Đổi một giá trị trên console, mở app một lần, tắt hẳn, mở lại offline: giá trị mới phải có hiệu lực.",
  },
  {
    area: "IAP",
    sev: "TB",
    title: "Event mua không có transaction id",
    symptom:
      "Hoàn tiền không trừ được vào đúng lần mua; event mua gửi hai lần do retry mạng bị đếm hai lần; doanh thu nhiều nước được cộng bằng số thô.",
    cause: "Payload mua có tên gói, giá, tiền tệ nhưng không có mã giao dịch; giá là tiền tệ bản địa chưa quy đổi.",
    lesson: "Mọi event mang tiền cần một khoá duy nhất từ nguồn phát sinh ra nó.",
    fix: "Thêm transaction id và product id; thêm giá trị quy đổi sang một tiền tệ chuẩn, hoặc lấy doanh thu từ server.",
    check: "Đếm event mua trùng transaction id trong kho phân tích; phải bằng 0.",
  },
  {
    area: "IAP",
    sev: "TB",
    title: "Verify giao dịch đi ngoài dòng event",
    symptom: "Verify hỏng hàng loạt mà không ai biết; không nối được kết quả verify với event mua theo user id.",
    cause: "Lệnh verify gửi thẳng lên server bằng HTTP riêng; lỗi chỉ in ra console, không retry, không báo crash reporter.",
    lesson: "Bước nào quyết định tiền thì kết quả của nó phải nằm trong cùng dòng dữ liệu với tiền.",
    fix: "Kết quả verify thành một event trong cùng dòng; lỗi được retry có giới hạn và báo non-fatal.",
    check: "Tỉ lệ purchase_success có verify_result tương ứng.",
  },
  {
    area: "Tracking",
    sev: "TB",
    title: "Một trường bị rơi khi cập nhật state bất biến",
    symptom: "Bốn trường nguồn cài được cập nhật, trường thứ năm luôn rỗng.",
    cause: "Hàm cập nhật nhận tham số nhưng không truyền nó vào lệnh copy object. Lỗi nằm im tới khi attribution được nối.",
    lesson: "Lỗi ở đoạn code chưa từng chạy với dữ liệu thật sẽ lộ ra đúng lúc bạn sửa xong lỗi khác.",
    fix: "Truyền mọi tham số vào bản copy; test so sánh từng trường trước và sau khi cập nhật.",
    check: "Bật cảnh báo tham số không dùng trong linter; test round-trip cho model user property.",
  },
  {
    area: "Config",
    sev: "TB",
    title: "Preload ad chạy trước khi config về",
    symptom: "Đổi ad unit trên console không ảnh hưởng tới ad đầu phiên.",
    cause: "Native được preload trước màn splash, trong khi fetch config nằm trong splash.",
    lesson: "Thứ gì chạy trước nguồn sự thật thì chạy bằng giá trị mặc định, dù code có đọc config hay không.",
    fix: "Preload chờ config có hiệu lực, từ cache hoặc fetch có timeout.",
    check: "Log ad unit thực dùng cho request đầu tiên của phiên.",
  },
  {
    area: "Config",
    sev: "TB",
    title: "JSON sai schema mà không ai biết",
    symptom: "Một dấu phẩy thừa trên console làm toàn bộ người dùng quay về in-app default; không crash, không event.",
    cause: "Lỗi parse bị bắt và chỉ log tại máy.",
    lesson: "Lỗi đã bắt mà không báo đi đâu thì tương đương lỗi bị nuốt.",
    fix: "Lỗi parse gửi event và non-fatal kèm phiên bản template; kiểm schema trước khi publish.",
    check: "Publish JSON hỏng lên môi trường test và xem cảnh báo có tới không.",
  },
  {
    area: "Config",
    sev: "TB",
    title: "Một giá trị khai báo ở bốn nơi",
    symptom: "Ba con số giãn cách khác nhau trong code khiến người đọc kết luận sai hành vi thật.",
    cause: "Giãn cách app open có ở hằng số trong app, default của parser, tham số mặc định của thư viện ads, và Remote Config; giá trị có hiệu lực là cái ghi sau cùng.",
    lesson: "Mỗi tham số một nguồn sự thật; nhiều default là nhiều cách để sai.",
    fix: "Giữ một nguồn; log giá trị có hiệu lực lúc khởi tạo.",
    check: "Đổi giá trị trên console và xem log giá trị có hiệu lực.",
  },
  {
    area: "IAP",
    sev: "Thấp",
    title: "Gói khai báo nhưng không bao giờ được bán",
    symptom: "Số liệu gói tuần bằng 0 và bị hiểu là không ai mua.",
    cause: "Danh sách product id có bốn gói nhưng màn paywall chỉ nhận ba.",
    lesson: "Số 0 có thể là “không ai mua” hoặc “không ai thấy”; phân biệt hai điều đó trước khi kết luận.",
    fix: "Danh sách gói hiện trên paywall đến từ một nguồn (Remote Config) và được log lúc mở paywall.",
    check: "Log số sản phẩm store trả về, số id yêu cầu, và số gói thật sự hiển thị.",
  },
  {
    area: "IAA",
    sev: "Thấp",
    title: "Mảng ad unit không tạo waterfall cho mọi format",
    symptom: "Thêm unit dự phòng cho interstitial trên console mà fill rate không đổi.",
    cause: "Config cho phép mảng nhiều unit cho mọi format, nhưng interstitial chỉ giữ một unit và lấy phần tử cuối.",
    lesson: "Schema config hứa gì thì code phải làm đúng điều đó; schema rộng hơn khả năng là cái bẫy cho người vận hành.",
    fix: "Format nào không có waterfall thì schema chỉ nhận một unit, hoặc thêm waterfall thật.",
    check: "Cho unit đầu fail cố ý ở môi trường test và xem request kế tiếp dùng unit nào.",
  },
  {
    area: "IAA",
    sev: "Thấp",
    title: "Thử lại liền tay không chờ",
    symptom: "Match rate trên console tệ hơn thực tế; số request gấp đôi số lần cần ad.",
    cause: "Load hỏng thì thử lại ngay cùng unit, ba lần, không có khoảng chờ; no-fill sinh ba request liền nhau đều hỏng.",
    lesson: "Thử lại chỉ cứu lỗi thoáng qua; với lỗi lặp lại, nó chỉ làm phình mẫu số.",
    fix: "Thử lại có backoff, hoặc chuyển unit kế tiếp, hoặc load lại ở điểm tự nhiên sau.",
    check: "Đếm ad_request trên mỗi ad_show.",
  },
  {
    area: "Tracking",
    sev: "Thấp",
    title: "Kiểm thử trên bản debug rồi kết luận tích hợp hỏng",
    symptom: "Không thấy event nào tới kho phân tích và không có doanh thu ad thật trong lúc QA.",
    cause: "Chế độ debug chặn gửi event và ép ad unit sang id test — đúng ý đồ, nhưng dễ quên.",
    lesson: "Biết môi trường đang chặn những gì trước khi đọc kết quả kiểm thử.",
    fix: "Kiểm chứng đầu-cuối trên bản release hoặc profile với test device; debug chỉ để xem event trong app.",
    check: "Có checklist QA riêng cho bản release trước mỗi lần phát hành.",
  },
];

const CHECKLIST: [string, string[]][] = [
  [
    "Trước khi phát hành",
    [
      "Một lượt cài qua tracker link test ra đúng network trên event in-app",
      "Mỗi impression có một ad_paid, giá trị đúng đơn vị",
      "Mua thử ở sandbox: event mua có transaction id, quyền mở ngay, ads tắt ngay",
      "Tắt mạng rồi mở app: vẫn đúng entitlement, không kẹt màn hình vì ad",
      "In-app default là bản mới nhất và bảo thủ",
    ],
  ],
  [
    "Sau mỗi lần đổi Remote Config",
    [
      "Log giá trị có hiệu lực trên một máy thật",
      "Không có event parse lỗi mới",
      "Có nhóm đối chứng nếu muốn kết luận về chỉ số",
    ],
  ],
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="text-sm text-foreground/80">
      <span className="font-medium text-foreground">{label}: </span>
      {children}
    </p>
  );
}

export default function Lessons() {
  return (
    <>
      <PageHeader
        eyebrow="Bài học"
        title="Lỗi hay gặp và checklist"
        lead="Gần như mọi lỗi dưới đây không crash: app vẫn chạy, dashboard vẫn có số, chỉ là số sai. Đó là lý do chúng sống qua nhiều bản phát hành của một dự án Flutter thật có IAA, IAP và UA. Mỗi mục bắt đầu từ triệu chứng bạn sẽ thấy, rồi mới tới nguyên nhân."
      />

      <P>
        Các mục mô tả những gì đã đọc ra từ source của dự án đó tại một thời
        điểm, không phải trạng thái hiện tại của một codebase nào. Không có tên
        class hay đường dẫn file, vì giá trị nằm ở kiểu lỗi chứ không ở vị trí
        của nó.
      </P>

      <Section title="Bài học, xếp theo mức nghiêm trọng">
        <div className="space-y-3">
          {LESSONS.map((l) => (
            <Card key={l.title} className="gap-0 py-4">
              <CardContent className="space-y-2 px-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge
                    variant={l.sev === "Cao" ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {l.sev}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {l.area}
                  </Badge>
                  <h3 className="text-sm font-semibold">{l.title}</h3>
                </div>
                <Row label="Hiện tượng">{l.symptom}</Row>
                <Row label="Nguyên nhân">{l.cause}</Row>
                <div className="rounded-md border-l-4 border-l-emerald-400/70 bg-muted/40 px-3 py-2 text-sm">
                  <span className="font-semibold">Bài học: </span>
                  <span className="text-foreground/80">{l.lesson}</span>
                </div>
                <Row label="Sửa">{l.fix}</Row>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground/80">Kiểm tra: </span>
                  {l.check}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Checklist">
        <div className="grid gap-3 sm:grid-cols-2">
          {CHECKLIST.map(([title, items]) => (
            <Card key={title} className="gap-0 py-4">
              <CardContent className="px-5">
                <h3 className="mb-2 text-sm font-semibold">{title}</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/80">
                  {items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
