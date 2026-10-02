import { Link } from "@/components/locale";

import { Canvas, Figure, Group, Node } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, P } from "@/components/bits";

const link = "underline underline-offset-4";

export default function Home() {
  return (
    <>
      <PageHeader
        eyebrow="Tổng quan"
        title="Kiếm tiền trong app: IAA và IAP"
        lead="Một app vừa bán gói vừa hiện quảng cáo có hai dòng tiền chạy qua cùng một luồng khởi động, cùng một bảng điều khiển và cùng một hệ đo. Phần lớn chỗ hỏng không crash: người đã trả tiền vẫn thấy quảng cáo, doanh thu ad không về kho phân tích, campaign đang lãi bị tắt vì ROAS thiếu một nửa. Tài liệu này giải thích cơ chế đằng sau từng chỗ đó, cho cả Flutter lẫn SwiftUI."
      />

      <Section title="Entitlement là sợi dây nối hai dòng tiền">
        <P>
          IAP và IAA trông như hai hệ độc lập: một bên nói chuyện với App Store
          hay Google Play, một bên nói chuyện với Ad SDK. Chúng gặp nhau ở đúng
          một điểm là entitlement, tức quyền dùng mà store hoặc server xác nhận.
          Người có quyền thì lớp quảng cáo phải im lặng; người không có thì mọi
          lệnh load và show còn phải qua consent, Remote Config và cổng giãn
          cách. Cả hai dòng tiền cuối cùng đổ về cùng một kho phân tích và cùng
          một MMP, nơi chúng được cộng lại thành ARPU, LTV và ROAS.
        </P>
        <Figure caption="Entitlement tắt quảng cáo; cả hai dòng tiền đổ về cùng một hệ đo">
          <Canvas
            className="mx-auto max-w-2xl"
            cols="repeat(2, minmax(0, 1fr))"
            gap={["4.6rem", "1.9rem"]}
            wgap={["9rem", "1.9rem"]}
            edges={[
              { from: "ctl", to: "ADS", outAt: "align" },
              { from: "ST", to: "ENT" },
              {
                from: "ENT",
                to: "ADS",
                label: "có quyền thì tắt",
                tone: "main",
                inAt: "align",
                narrow: { lw: 3.5 },
              },
              { from: "ADS", to: "MMP", inAt: "align" },
              {
                from: "ADS",
                to: "EV",
                label: "doanh thu từng impression",
                bend: 0.7,
                inAt: 0.14,
                narrow: { bend: 0.86 },
              },
              { from: "ST", to: "EV", label: "doanh thu giao dịch", inAt: "align", t: 0.42 },
              { from: "MMP", to: "EV", label: "nguồn cài", outAt: "align", narrow: { lw: 3.4 } },
            ]}
          >
            <Group id="ctl" title="Điều khiển" col="1 / -1" row="1" cols="repeat(2, minmax(0, 1fr))">
              <Node id="RC" sub="bật tắt, giãn cách, ad unit">
                Remote Config
              </Node>
              <Node id="CS" sub="UMP · ATT">
                Consent
              </Node>
            </Group>
            <Group title="IAA · quảng cáo" col="1" row="2">
              <Node id="ADS" sub="load · show · paid event">
                Ad SDK
              </Node>
            </Group>
            <Group title="IAP · mua hàng" col="2" row="2" gap={["0.6rem", "1.5rem"]}>
              <Node id="ENT" tone="key">
                Entitlement
              </Node>
              <Node id="ST" sub="StoreKit · Play Billing">
                Store
              </Node>
            </Group>
            <Group
              title="Đo lường"
              className="mt-16"
              col="1 / -1"
              row="3"
              cols="repeat(2, minmax(0, 1fr))"
              gap={["5rem", "0.6rem"]}
              wgap={["8.4rem", "0.6rem"]}
            >
              <Node id="MMP" sub="Adjust · AppsFlyer">
                MMP
              </Node>
              <Node id="EV">Kho phân tích</Node>
            </Group>
          </Canvas>
        </Figure>
      </Section>

      <Section title="Khái niệm trước, API sau, bài học cuối">
        <P>
          Các trang khái niệm không gắn với codebase nào: chúng nói cơ chế, lý
          do và đánh đổi, kèm usecase có số liệu giả định. Con số như số lần thử
          lại hay timeout là giá trị tham khảo kèm lý do; khuyến nghị chính thức
          của Google hay Apple có dẫn nguồn ngay dưới. Khi đã hiểu cơ chế, trang{" "}
          <Link href="/platforms" className={link}>
            Flutter ↔ SwiftUI
          </Link>{" "}
          cho biết mỗi khái niệm gọi bằng API nào, còn trang{" "}
          <Link href="/lessons" className={link}>
            Lỗi hay gặp
          </Link>{" "}
          kể lại những chỗ đã hỏng lặng lẽ trong một dự án Flutter thật. Mục{" "}
          <Link href="/deep/preload" className={link}>
            Chuyên sâu
          </Link>{" "}
          trả lời các câu hỏi khó hơn về chỉ số quảng cáo.
        </P>
        <Grid
          head={["Nếu bạn cần", "Bắt đầu ở"]}
          rows={[
            ["Dựng app mới có ads và IAP", "Khởi động → IAA → IAP → Remote Config"],
            ["Hiểu vì sao ad không hiện", "Load, thử lại, làm mới → Chuyên sâu"],
            ["Xử lý subscription cho đúng", "Luồng mua → Subscription"],
            ["Đo doanh thu và nguồn cài", "Tracking → UA · Kế hoạch đo"],
            ["Port một tính năng giữa hai nền tảng", "Flutter ↔ SwiftUI"],
          ]}
        />
      </Section>
    </>
  );
}
