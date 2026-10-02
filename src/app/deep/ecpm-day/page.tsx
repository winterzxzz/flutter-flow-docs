import { Figure, Share } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { Grid, Note, P, Ref } from "@/components/bits";
import { Assumed } from "@/components/usecase";

export const metadata = { title: "Chuyên sâu · eCPM trong ngày" };

export default function DeepEcpmDay() {
  return (
    <>
      <PageHeader
        eyebrow="Chuyên sâu · hỏi đáp"
        title="Vì sao eCPM giảm dần trong ngày?"
        lead="Nhiều team thấy eCPM buổi sáng cao, chiều tối thấp và đoán ngay là nhà quảng cáo hết ngân sách. Có thể đúng, nhưng tài liệu chính thức không nói điều đó; trước khi tin một câu chuyện về thị trường, nên loại trừ trường hợp con số trung bình đang đổi vì chính tập impression đã đổi."
      />

      <Note tone="warn" title="Phạm vi kiểm chứng">
        <p>
          Các trang AdMob đã đối chiếu giải thích eCPM dao động theo thị trường,
          mùa vụ, danh sách chặn và floor, nhưng không có trang nào mô tả mẫu
          hình eCPM giảm trong một ngày hay nguyên nhân của nó. Phần &ldquo;giả
          thuyết&rdquo; dưới đây vì vậy chưa kiểm chứng.
        </p>
      </Note>

      <Section title="Những gì Google nói về eCPM dao động">
        <P>
          eCPM là doanh thu ước tính trên một nghìn impression. Google liệt kê
          các yếu tố làm nó dao động: xu hướng thị trường theo quốc gia và nền
          tảng, chặn nhiều danh mục, và thay đổi floor. Họ khuyên xem eCPM theo
          nhiều khung thời gian để nhận ra yếu tố mùa vụ. Có một câu đáng nhớ:
          eCPM thấp hơn mà đi kèm nhiều impression hơn thì tổng doanh thu ước
          tính vẫn có thể tăng, nên phải nhìn eCPM cùng impression và doanh thu
          chứ không nhìn riêng.
        </P>
        <Ref href="https://support.google.com/admob/answer/15337570?hl=en">
          AdMob Help · Understand eCPM fluctuation
        </Ref>
      </Section>

      <Section title="Loại trừ trước: thành phần impression đổi theo giờ">
        <P>
          eCPM theo giờ là một số trung bình, và số trung bình đổi khi tỉ trọng
          các nhóm bên trong đổi, kể cả khi giá của từng nhóm đứng yên. Buổi
          sáng ở một app toàn cầu có thể nghiêng về người dùng ở thị trường giá
          cao; buổi tối nghiêng về thị trường khác. Banner chạy liên tục cả
          ngày, còn interstitial dồn vào giờ người dùng chơi nhiều. Mỗi format,
          mỗi thị trường có mức giá riêng, nên chỉ riêng việc tỉ trọng giữa
          chúng đổi theo giờ đã đủ kéo số trung bình đi xuống.
        </P>
        <Figure caption="Giá từng nhóm không đổi, chỉ tỉ trọng đổi, nhưng eCPM trung bình vẫn giảm">
          <Share
            legend={["thị trường A", "thị trường B"]}
            rows={[
              {
                label: "Sáng",
                parts: [
                  { pct: 60, text: "60% thị trường A" },
                  { pct: 40, text: "40% B" },
                ],
                result: "eCPM TB cao",
              },
              {
                label: "Tối",
                parts: [
                  { pct: 30, text: "30% A" },
                  { pct: 70, text: "70% B" },
                ],
                result: "eCPM TB thấp",
              },
            ]}
          />
        </Figure>
      </Section>

      <Section title="Ví dụ số: eCPM giảm mà giá không đổi">
        <P>
          Thị trường A trả eCPM 10 USD, thị trường B trả 2 USD, cả ngày không
          đổi<Assumed />.
        </P>
        <Grid
          head={["Khung giờ", "Impression A", "Impression B", "eCPM trung bình"]}
          rows={[
            ["Sáng", "6 000", "4 000", "(60 + 8) ÷ 10 = 6,8 USD"],
            ["Tối", "3 000", "7 000", "(30 + 14) ÷ 10 = 4,4 USD"],
          ]}
        />
        <P>
          eCPM trung bình giảm 35% mà không nhà quảng cáo nào đổi giá. Nếu tách
          theo quốc gia, format và placement mà eCPM từng nhóm vẫn đứng yên thì
          không có gì cần sửa; chỉ khi eCPM <i>trong cùng một nhóm</i> giảm
          theo giờ thì mới đáng đi tìm nguyên nhân phía thị trường.
        </P>
      </Section>

      <Section title="Giả thuyết phía thị trường (chưa kiểm chứng)">
        <P>
          Sau khi đã tách nhóm, có ba giải thích thường được nhắc. Nhà quảng cáo
          đặt ngân sách theo ngày, nên khi ngân sách của những người trả cao cạn
          dần, phiên đấu giá còn lại ít bid cao hơn. Nhà quảng cáo đặt frequency
          cap cho từng người dùng, nên người đã thấy đủ quảng cáo của họ không
          còn nhận bid của họ nữa. Và chu kỳ đấu giá hay cách phân bổ ngân sách
          trong ngày của từng nền tảng mua quảng cáo khác nhau. Cả ba nghe hợp
          lý, nhưng ở đây chúng chỉ là giả thuyết để kiểm tra bằng dữ liệu của
          chính app.
        </P>
        <P>
          Câu hỏi kiểm tra: tách theo quốc gia, format và placement rồi, eCPM
          của từng nhóm còn giảm theo giờ không? Nếu không, câu chuyện là thành
          phần impression, và quyết định đúng là nhìn doanh thu trên mỗi người
          dùng chứ không phải đổi giờ hiện ad.
        </P>
      </Section>
    </>
  );
}
