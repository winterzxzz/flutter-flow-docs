import Link from "next/link";

import { Canvas, Figure, Lanes, Node, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, P, Ref } from "@/components/bits";
import { CodeTabs, UseCase } from "@/components/usecase";

export const metadata = { title: "IAP · Luồng mua" };

const link = "underline underline-offset-4";

export default function Iap() {
  return (
    <>
      <PageHeader
        eyebrow="IAP · khái niệm"
        title="Luồng mua"
        lead="Từ lấy danh sách sản phẩm tới lúc người dùng có quyền dùng tính năng. Thứ quan trọng nhất không phải nút mua, mà là entitlement, tức quyền dùng do store hoặc server xác nhận, và ai được phép thay đổi nó."
      />

      <Section title="Một chủ sở hữu duy nhất cho entitlement">
        <P>
          UI không gọi thẳng SDK của store. Mọi thay đổi quyền dùng đi qua một
          chỗ, rồi từ đó lan ra cache local, lớp quảng cáo và analytics. Premium
          trong tài liệu này chỉ là tên gói hay cổng &ldquo;không quảng
          cáo&rdquo;; thứ quyết định người dùng có được dùng hay không luôn là
          entitlement.
        </P>
        <Figure caption="Lớp dịch vụ là cổng duy nhất ra SDK; chủ sở hữu entitlement là nơi duy nhất đổi trạng thái">
          <Canvas
            className="mx-auto max-w-xl"
            cols="repeat(2, minmax(0, 1fr))"
            gap={["1.25rem", "1.9rem"]}
            edges={[
              { from: "UI", to: "EN", tone: "main" },
              { from: "EN", to: "ADS" },
              { from: "EN", to: "CACHE" },
              { from: "EN", to: "SV", tone: "main" },
              { from: "SV", to: "SDK", tone: "main" },
              { from: "SV", to: "BE" },
              { from: "SDK", to: "ST", tone: "main" },
              { from: "BE", to: "ST" },
            ]}
          >
            <Node id="UI" className="dg-mid" col="1 / -1" sub="paywall · nút restore">
              UI
            </Node>
            <Node id="EN" tone="key" className="dg-mid" col="1 / -1" sub="có quyền không, tới khi nào">
              Chủ sở hữu entitlement
            </Node>
            <Node id="ADS" sub="tắt khi có quyền">
              Lớp quảng cáo
            </Node>
            <Node id="CACHE" sub="mở app offline vẫn đúng">
              Cache local
            </Node>
            <Node id="SV" className="dg-mid" col="1 / -1">
              Lớp dịch vụ mua hàng
            </Node>
            <Node id="SDK" sub="hoặc lớp bọc như RevenueCat">
              StoreKit 2 · Play Billing
            </Node>
            <Node id="BE" sub="verify · lưu giao dịch">
              Backend của bạn
            </Node>
            <Node id="ST" className="dg-mid" col="1 / -1">
              Store
            </Node>
          </Canvas>
        </Figure>
      </Section>

      <Section title="Ba loại sản phẩm">
        <Grid
          head={["Loại", "Ví dụ", "Sau khi mua"]}
          rows={[
            ["Tiêu hao (consumable)", "xu, lượt dùng", "trao rồi tiêu thụ; mua lại được"],
            ["Vĩnh viễn (non-consumable)", "mở khoá trọn đời", "quyền vĩnh viễn; restore được trên máy khác"],
            [
              "Subscription",
              "tuần, tháng, năm",
              <>
                quyền có thời hạn, tự gia hạn.{" "}
                <Link href="/iap/subscription" className={link}>
                  Xem trạng thái
                </Link>
              </>,
            ],
          ]}
        />
        <P>
          Apple còn có subscription không tự gia hạn (non-renewing), app tự quản
          lý thời hạn. Trên StoreKit 2, hàng tiêu hao không xuất hiện trong{" "}
          <C>currentEntitlements</C>; muốn xem giao dịch tiêu hao chưa finish
          thì dùng sequence <C>unfinished</C> hoặc <C>all</C>.
        </P>
        <Ref href="https://developer.apple.com/documentation/storekit/transaction/currententitlements">
          Apple · Transaction.currentEntitlements
        </Ref>
      </Section>

      <Section title="Product id sai bị bỏ lặng lẽ khỏi catalog">
        <P>
          App phải biết product id trước, đóng gói trong app hoặc lấy từ server
          hay Remote Config. StoreKit 2 <C>Product.products(for:)</C> loại id
          không hợp lệ khỏi kết quả thay vì báo lỗi, nên app nên so số sản phẩm
          nhận được với số id đã gửi và log phần chênh. Lấy cả danh sách trong
          một request, và hiển thị chuỗi giá đã định dạng của store thay vì tự
          ghép số với ký hiệu tiền tệ. Store sandbox có thể chậm hoặc rỗng; dữ
          liệu giả chỉ để dựng UI ở bản debug và phải tắt hẳn ở bản release.
        </P>
        <Ref href="https://developer.apple.com/documentation/storekit/product/products(for:)">
          Apple · Product.products(for:)
        </Ref>
      </Section>

      <Section title="Mua thành công chưa phải là xong">
        <P>
          Sau khi store trả kết quả thành công, app còn ba việc theo đúng thứ
          tự: verify giao dịch, trao quyền, rồi báo cho store rằng đã giao xong.
          Kết quả &ldquo;đang chờ&rdquo; (Ask to Buy, thanh toán trả sau) không
          phải lỗi và cũng chưa phải thành công; quyền sẽ đến sau qua listener.
        </P>
        <Figure caption="Báo cho store sau khi đã trao quyền, không phải trước">
          <Lanes
            numbered
            actors={[
              { id: "U", label: "Người dùng" },
              { id: "P", label: "Paywall" },
              { id: "E", label: "Entitlement" },
              { id: "S", label: "Store SDK" },
              { id: "B", label: "Backend" },
            ]}
            steps={[
              { from: "U", to: "P", text: "chọn gói" },
              { from: "P", to: "S", text: "purchase(product)" },
              { from: "S", to: "P", text: "thành công / huỷ / chờ", reply: true },
              { from: "P", to: "B", text: "giao dịch đã ký hoặc purchase token" },
              { self: "B", text: "verify với store" },
              { from: "B", to: "E", text: "hợp lệ, hết hạn lúc X", reply: true },
              { self: "E", text: "cập nhật entitlement" },
              { from: "E", to: "S", text: "finish / acknowledge" },
              { from: "E", to: "P", text: "mở khoá", reply: true },
            ]}
          />
        </Figure>
        <Grid
          head={["Kết quả", "StoreKit 2", "Play Billing", "App làm gì"]}
          rows={[
            ["Thành công", <C key="a">.success(verification)</C>, <C key="b">PURCHASED</C>, "verify, trao quyền, rồi finish / acknowledge"],
            ["Đang chờ", <C key="c">.pending</C>, <C key="d">PENDING</C>, "không trao quyền; chờ listener"],
            ["Huỷ", <C key="e">.userCancelled</C>, "mã lỗi user canceled", "không hiện thông báo lỗi"],
          ]}
        />
        <P>
          Google Play yêu cầu acknowledge giao dịch trong ba ngày, nếu không giao
          dịch tự động bị hoàn tiền và quyền bị thu hồi; chỉ trao quyền khi
          trạng thái là <C>PURCHASED</C>. Trên App Store, gọi <C>finish()</C>{" "}
          sau khi đã giao nội dung hoặc bật dịch vụ. Plugin Flutter{" "}
          <C>in_app_purchase</C> gói cả hai vào <C>completePurchase</C> và cảnh
          báo đúng mốc ba ngày trên Android.
        </P>
        <Ref href="https://developer.android.com/google/play/billing/integrate">
          Android · Integrate Google Play Billing
        </Ref>
        <Ref href="https://developer.apple.com/documentation/storekit/product/purchaseresult">
          Apple · Product.PurchaseResult
        </Ref>
        <Ref href="https://developer.apple.com/documentation/storekit/transaction/finish()">
          Apple · Transaction.finish()
        </Ref>
        <Ref href="https://pub.dev/packages/in_app_purchase">pub.dev · in_app_purchase</Ref>
      </Section>

      <Section title="Giao dịch đến từ ngoài nút mua, nên phải nghe từ lúc mở app">
        <P>
          StoreKit 2 phát qua <C>Transaction.updates</C> những giao dịch xảy ra
          ngoài app hoặc trên máy khác: Ask to Buy, offer code, mua trong App
          Store. Giao dịch chưa finish được phát lại một lần ngay sau khi app
          mở, nên không nghe từ đầu là bỏ lỡ. Trên Play, Google khuyến nghị gọi{" "}
          <C>queryPurchasesAsync</C> khi kết nối billing thành công lúc mở app
          và khi app quay lại foreground, để bắt giao dịch bị đứt mạng, mua trên
          máy khác, hoặc vừa chuyển từ PENDING sang PURCHASED.
        </P>
        <Ref href="https://developer.apple.com/documentation/storekit/transaction/updates">
          Apple · Transaction.updates
        </Ref>
      </Section>

      <Section title="Mức verify đi theo giá trị của thứ đang bán">
        <P>
          StoreKit 2 tự kiểm chữ ký và trả <C>VerificationResult.verified</C>{" "}
          hoặc <C>.unverified</C>. Cách này đơn giản và chạy offline, nhưng
          không có nguồn sự thật phía server và khó chống gian lận ở mức tài
          khoản. Verify trên server nghĩa là gửi giao dịch đã ký (JWS) hoặc
          purchase token về backend; Apple có App Store Server Library, Google
          có Play Developer API. Cách này kiểm soát cao nhất và nhận được hoàn
          tiền, gia hạn qua notification, đổi lại phải vận hành backend. Dịch vụ
          trung gian như RevenueCat làm phần server thay bạn, đổi lại phụ thuộc
          bên thứ ba và mô hình entitlement của họ. Tài liệu Play Billing khuyên
          verify trên backend trước khi trao quyền, và với hàng tiêu hao thì kiểm
          tra token chưa được dùng để không trao quyền hai lần.
        </P>
        <Ref href="https://developer.apple.com/documentation/storekit/verificationresult">
          Apple · VerificationResult
        </Ref>
      </Section>

      <Section title="Entitlement chỉ hạ cấp khi có dữ liệu thật">
        <P>
          Lỗi mạng hay lỗi server không phải bằng chứng người dùng hết quyền:
          lấy trạng thái thất bại thì giữ nguyên trạng thái đang có và chỉ log.
          Lúc mới mở app, trước khi store trả lời lần đầu, chỉ cho phép nâng cấp
          từ cache; hạ cấp phải đợi dữ liệu thật. Restore là thao tác bổ sung
          quyền, nên restore không tìm thấy gì cũng không được hạ cấp.
        </P>
      </Section>

      <Section title="Paywall: mỗi điểm vào một nhãn riêng">
        <P>
          Paywall thường hiện ở vài chỗ: sau onboarding, khi chạm tính năng trả
          phí, khi mở app lại. Mỗi điểm vào nên có nhãn riêng trên event để so
          chuyển đổi giữa chúng. Danh sách gói nên điều khiển được từ xa, vì
          khai báo một gói mà không truyền vào màn hình là gói đó không bao giờ
          bán được. Trial và giá giới thiệu thì hiện đúng điều kiện đủ tư cách
          store trả về, không tự đoán. Event tối thiểu là <C>paywall_show</C>{" "}
          kèm điểm vào, <C>paywall_click</C> kèm gói, <C>purchase_success</C>{" "}
          kèm transaction id, và <C>purchase_fail</C>.
        </P>
      </Section>

      <Section title="Usecase">
        <UseCase
          n="1"
          title="Số người có quyền gấp đôi số giao dịch"
          situation={
            <p>
              App bán gói mở khoá trọn đời. Số người dùng có quyền trong
              analytics cao gấp đôi số giao dịch trên store. Phần chênh đến từ
              máy jailbreak hoặc root dùng công cụ giả lập phản hồi mua hàng.
            </p>
          }
          flow={
            <Figure>
              <Tree
                root={{
                  label: "kết quả mua giả",
                  kids: [
                    {
                      tone: "ask",
                      label: "app kiểm tra ở đâu ?",
                      kids: [
                        { when: "chỉ một cờ success", tone: "bad", label: "mở khoá · mất doanh thu" },
                        { when: "chữ ký StoreKit 2", tone: "good", label: "unverified · từ chối" },
                        {
                          when: "server gọi API của store",
                          tone: "good",
                          label: "không tìm thấy giao dịch · từ chối",
                        },
                      ],
                    },
                  ],
                }}
              />
            </Figure>
          }
          why={
            <>
              <p>
                App chỉ tin một cờ thành công, thứ dễ giả nhất. Kiểm chữ ký JWS
                của StoreKit 2 chặn được phần lớn trường hợp; server gọi API của
                store là nguồn sự thật mạnh nhất và còn nhận được hoàn tiền về
                sau.
              </p>
              <CodeTabs
                flutter={`for (final p in purchases) {
  if (p.status == PurchaseStatus.purchased) {
    final ok = await backend.verify(p.verificationData);
    if (ok) grant(p.productID);
  }
  if (p.pendingCompletePurchase) {
    await InAppPurchase.instance.completePurchase(p);
  }
}`}
                swift={`switch try await product.purchase() {
case .success(.verified(let tx)):
  grant(tx.productID)
  await tx.finish()
case .success(.unverified):
  break // không trao quyền
case .pending, .userCancelled:
  break
@unknown default: break
}`}
              />
            </>
          }
          lesson="So số người có quyền với số giao dịch thật định kỳ; phần chênh đo trực tiếp mức verify đang thiếu."
        />
        <UseCase
          n="2"
          title="Phụ huynh duyệt Ask to Buy, con vẫn không có quyền"
          situation={
            <p>
              Tài khoản trẻ em trong nhóm gia đình bấm mua, kết quả là
              &ldquo;đang chờ&rdquo;. Hai giờ sau phụ huynh duyệt, lúc đó app
              đang chạy nền. Tối hôm đó gia đình gửi hỗ trợ: đã trừ tiền mà vẫn
              thấy paywall.
            </p>
          }
          why={
            <p>
              Giao dịch tới qua <C>Transaction.updates</C>, không qua nút mua,
              và app chỉ nghe listener trong màn paywall. Trên Play, trường hợp
              tương tự là PENDING chuyển sang PURCHASED khi app không chạy, chỉ
              bắt được bằng <C>queryPurchasesAsync</C> lúc quay lại foreground.
            </p>
          }
          lesson="Mọi kênh mà trạng thái có thể đổi phải được nghe trong suốt vòng đời app, không chỉ ở màn hình gây ra thay đổi."
        />
      </Section>
    </>
  );
}
