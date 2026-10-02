import Link from "next/link";

import { Figure, States, Tree } from "@/components/diagram";
import { PageHeader, Section } from "@/components/page-header";
import { UseCase } from "@/components/usecase";
import { C, Grid, Note, P, Ref } from "@/components/bits";

export const metadata = { title: "IAP · Subscription" };

export default function Subscription() {
  return (
    <>
      <PageHeader
        eyebrow="IAP · khái niệm"
        title="Subscription và entitlement"
        lead="Subscription không phải một cờ đúng/sai. Nó là một chuỗi trạng thái do store quản lý, và app chỉ cần trả lời một câu: lúc này người dùng có được dùng hay không."
      />

      <Section title="Một chuỗi trạng thái do store quản lý">
        <Figure caption="Trạng thái chung cho cả hai store">
          <States
            main={[
              { name: "Trial", enter: ["dùng thử / giá giới thiệu"], next: "chuyển sang trả phí" },
              {
                name: "Active",
                tone: "key",
                enter: ["mua"],
                next: "tắt tự gia hạn",
                exits: [
                  { on: "gia hạn thành công", to: "Active" },
                  { on: "gia hạn hỏng · có grace period", to: "Grace" },
                  { on: "gia hạn hỏng · không grace", to: "BillingRetry" },
                  { on: "hoàn tiền / thu hồi", to: "Revoked" },
                ],
              },
              { name: "Canceled", next: "hết kỳ", exits: [{ on: "bật lại", to: "Active" }] },
              { name: "Expired", exits: [{ on: "đăng ký lại", to: "Active" }] },
            ]}
            side={[
              {
                name: "Grace",
                exits: [
                  { on: "thanh toán lại được", to: "Active" },
                  { on: "hết grace", to: "BillingRetry" },
                ],
              },
              {
                name: "BillingRetry",
                exits: [
                  { on: "thanh toán lại được", to: "Active" },
                  { on: "hết thời gian thử lại", to: "Expired" },
                ],
              },
              { name: "Revoked" },
            ]}
          />
        </Figure>
      </Section>

      <Section title="Có quyền dùng hay không">
        <Grid
          head={["Trạng thái", "App Store (StoreKit 2)", "Google Play", "Có quyền ?"]}
          rows={[
            ["Đang hoạt động", <C key="a">subscribed</C>, <C key="b">ACTIVE</C>, "có"],
            [
              "Đã tắt gia hạn, còn hạn",
              <>vẫn <C>subscribed</C>, renewal info có <C>willAutoRenew = false</C></>,
              <C key="c">CANCELED</C>,
              "có, tới hết kỳ",
            ],
            [
              "Grace period",
              <C key="d">inGracePeriod</C>,
              <C key="e">IN_GRACE_PERIOD</C>,
              "có",
            ],
            [
              "Thanh toán hỏng, đang thử lại",
              <C key="f">inBillingRetryPeriod</C>,
              <>
                <C>ON_HOLD</C> (account hold)
              </>,
              "không",
            ],
            ["Tạm dừng", "không có", <C key="g">PAUSED</C>, "không"],
            ["Hết hạn", <C key="h">expired</C>, <C key="i">EXPIRED</C>, "không"],
            [
              "Hoàn tiền / thu hồi",
              <C key="j">revoked</C>,
              "EXPIRED (thu hồi, chargeback)",
              "không",
            ],
          ]}
        />
        <Note tone="info" title="Cùng tên, khác nghĩa">
          <p>
            Trên Apple, subscription trong billing retry mà <b>không</b> ở
            grace period thì không có quyền. Trên Google, grace period có quyền
            còn account hold thì không. Hai bên chung một ý: <b>grace = còn
            quyền, thử lại sau grace = mất quyền</b>.
          </p>
          <p>
            Apple ghi rõ: người dùng có thể có nhiều status cho cùng một
            subscription (ví dụ một cái hết hạn khi tự mua và một cái đang hoạt
            động qua Family Sharing). Có quyền nếu <b>bất kỳ</b> status nào cho
            quyền.
          </p>
        </Note>
        <Ref href="https://developer.apple.com/documentation/storekit/product/subscriptioninfo/renewalstate">
          Apple · Product.SubscriptionInfo.RenewalState
        </Ref>
        <Ref href="https://developer.android.com/google/play/billing/lifecycle/subscriptions">
          Android · Subscription lifecycle
        </Ref>
      </Section>

      <Section title="Quyền hiện có lấy từ store, cache chỉ để mở offline">
        <P>
          Trên StoreKit 2, <C>Transaction.currentEntitlements</C> trả giao dịch
          mới nhất cho mỗi sản phẩm đang có quyền: non-consumable, subscription
          ở trạng thái <C>subscribed</C> hoặc <C>inGracePeriod</C>, và
          non-renewing. Sản phẩm đã hoàn tiền hay bị thu hồi không xuất hiện ở
          đó. Trên Play, app đọc <C>queryPurchasesAsync</C> trên máy, còn nguồn
          sự thật phía server là <C>purchases.subscriptionsv2.get</C> của Play
          Developer API. Cache local lưu kết quả gần nhất kèm thời điểm hết hạn
          để mở app offline vẫn đúng, và được làm mới khi có mạng.
        </P>
        <Ref href="https://developer.apple.com/documentation/storekit/transaction/currententitlements">
          Apple · Transaction.currentEntitlements
        </Ref>
      </Section>

      <Section title="Restore bổ sung quyền, không thu hồi">
        <P>
          Với StoreKit 2, cài lại app hay sang máy mới thì giao dịch đã có sẵn
          từ lần mở đầu qua <C>currentEntitlements</C>, nên restore không phải
          bước đồng bộ thường ngày. Tài liệu StoreKit vẫn hướng dẫn đặt một cơ
          chế như nút Restore Purchases cho trường hợp hiếm người dùng nghi thiếu
          giao dịch; nút đó gọi <C>AppStore.sync()</C>, thứ hiện hộp thoại đăng
          nhập nên chỉ được gọi khi người dùng bấm. Trên Play, app đồng bộ bằng{" "}
          <C>queryPurchasesAsync</C> lúc mở app và khi quay lại foreground; giữ
          một nút chung cho cả hai nền tảng vẫn đơn giản hơn. Restore không tìm
          thấy gì thì báo cho người dùng, nhưng không hạ cấp trạng thái hiện có.
        </P>
        <Ref href="https://developer.apple.com/documentation/storekit/appstore/sync()">
          Apple · AppStore.sync()
        </Ref>
      </Section>

      <Section title="Thông báo từ server của store">
        <Grid
          head={["Sự kiện", "App Store Server Notifications v2", "Play RTDN"]}
          rows={[
            [
              "Mua lần đầu",
              <C key="a">SUBSCRIBED · INITIAL_BUY</C>,
              <C key="b">SUBSCRIPTION_PURCHASED</C>,
            ],
            ["Gia hạn", <C key="c">DID_RENEW</C>, <C key="d">SUBSCRIPTION_RENEWED</C>],
            [
              "Tắt tự gia hạn",
              <C key="e">DID_CHANGE_RENEWAL_STATUS · AUTO_RENEW_DISABLED</C>,
              <C key="f">SUBSCRIPTION_CANCELED</C>,
            ],
            [
              "Gia hạn hỏng",
              <C key="g">DID_FAIL_TO_RENEW (· GRACE_PERIOD)</C>,
              <C key="h">SUBSCRIPTION_IN_GRACE_PERIOD · SUBSCRIPTION_ON_HOLD</C>,
            ],
            [
              "Thanh toán lại được",
              <C key="i">DID_RENEW · BILLING_RECOVERY</C>,
              <C key="j">SUBSCRIPTION_RECOVERED</C>,
            ],
            ["Hết hạn", <C key="k">EXPIRED</C>, <C key="l">SUBSCRIPTION_EXPIRED</C>],
            ["Hoàn tiền / thu hồi", <C key="m">REFUND</C>, <C key="n">SUBSCRIPTION_REVOKED</C>],
          ]}
        />
        <P>
          Hoàn tiền là doanh thu âm; trừ đúng được hay không phụ thuộc vào việc
          event mua có mang transaction id, xem usecase 3 ở trang{" "}
          <Link href="/tracking" className="underline underline-offset-4">
            Tracking
          </Link>
          .
        </P>
        <Ref href="https://developer.apple.com/documentation/appstoreservernotifications/notificationtype">
          Apple · notificationType
        </Ref>
        <Ref href="https://developer.android.com/google/play/billing/lifecycle/subscriptions">
          Android · Subscription lifecycle (RTDN)
        </Ref>
      </Section>

      <Section title="Usecase">
        <UseCase
          n="1"
          title="Gói năm có 7 ngày dùng thử"
          situation={
            <p>
              Người dùng bắt đầu trial ngày 1. Ngày 5 họ vào cài đặt tài khoản
              store và tắt tự gia hạn.
            </p>
          }
          flow={
            <Figure>
              <Tree
                root={{
                  when: "ngày 1",
                  label: "Trial",
                  kids: [
                    {
                      when: "ngày 5 · tắt gia hạn",
                      label: "TrialCanceled",
                      kids: [{ when: "hết ngày 7", label: "Expired" }],
                    },
                    { when: "ngày 8 · trừ tiền thành công", label: "Active" },
                  ],
                }}
              />
            </Figure>
          }
          why={
            <p>
              Ngày 5 tới ngày 7 người dùng <b>vẫn có quyền</b>. App thu hồi ngay
              khi thấy tắt gia hạn là sai; Google còn ghi rõ không được bỏ quyền
              khi người dùng vẫn đang được hưởng. Ngược lại, tính trial là doanh
              thu là thổi phồng: trial chỉ thành tiền ở lần trừ tiền đầu tiên.
            </p>
          }
          lesson="Có quyền tính theo thời hạn hiện tại; tắt gia hạn là tín hiệu churn, không phải lệnh thu hồi."
        />
        <UseCase
          n="2"
          title="Thẻ bị từ chối khi gia hạn"
          situation={
            <p>
              Gói tháng tới hạn, thẻ hết hạn. Một người dùng trên iOS (đã bật
              Billing Grace Period), một trên Android.
            </p>
          }
          flow={
            <Figure>
              <Tree
                root={{
                  label: "gia hạn hỏng",
                  kids: [
                    {
                      label: "grace period",
                      sub: "vẫn có quyền",
                      kids: [
                        { when: "cập nhật thẻ", label: "active" },
                        {
                          when: "hết grace",
                          label: (
                            <>
                              iOS: billing retry
                              <br />
                              Android: account hold
                            </>
                          ),
                          sub: "mất quyền",
                          kids: [
                            { when: "cập nhật thẻ", label: "active" },
                            { when: "hết thời gian thử lại", label: "expired" },
                          ],
                        },
                      ],
                    },
                  ],
                }}
              />
            </Figure>
          }
          why={
            <p>
              Trong grace, giữ quyền và nhắc người dùng cập nhật phương thức
              thanh toán. Sau grace, khoá tính năng nhưng hiện lối sửa thanh toán
              thay vì paywall mua mới, vì họ vẫn là khách đang trả tiền. Ứng xử
              như đã hết hạn (bắt mua lại) dễ khiến họ mua trùng.
            </p>
          }
          lesson="Ánh xạ trạng thái store sang ba câu: có quyền không, có cần nhắc thanh toán không, có cần paywall không."
        />
        <UseCase
          n="3"
          title="Đổi máy mới thấy paywall dù đã trả tiền"
          situation={
            <p>
              Người dùng có gói năm, chuyển sang iPhone mới và cài lại app. Màn
              đầu tiên là paywall; họ phải tự tìm nút restore mới lấy lại được
              quyền.
            </p>
          }
          why={
            <p>
              App chỉ đọc entitlement từ cache local, mà cache thì không đi theo
              máy. Với StoreKit 2, giao dịch đã có sẵn ngay lần mở đầu qua{" "}
              <C>currentEntitlements</C>; app chỉ cần đọc nó lúc khởi động thay vì
              chờ người dùng bấm restore.
            </p>
          }
          lesson="Cache là bản sao để chạy offline, không phải nguồn sự thật. Câu hỏi kiểm tra: xoá cache rồi mở app, trạng thái có tự đúng lại không?"
        />
        <UseCase
          n="4"
          title="Hoàn tiền được duyệt mà app vẫn mở khoá"
          situation={
            <p>
              Người dùng xin Apple hoàn tiền gói năm sau 10 ngày và được chấp
              nhận. Một tháng sau họ vẫn dùng tính năng trả phí bình thường.
            </p>
          }
          why={
            <p>
              Server đã nhận notification <C>REFUND</C>, giao dịch có{" "}
              <C>revocationDate</C> và đã biến mất khỏi{" "}
              <C>currentEntitlements</C>. Nhưng app chỉ kiểm tra quyền lúc mua và
              lúc restore, còn lại tin cache, nên không bao giờ thấy thay đổi.
            </p>
          }
          lesson="Quyền có thể bị lấy lại từ bên ngoài app, nên app phải kiểm tra lại quyền định kỳ, không chỉ ở những lúc chính nó thay đổi quyền."
        />
        <Ref href="https://developer.apple.com/documentation/storekit/transaction/revocationdate">
          Apple · Transaction.revocationDate
        </Ref>
      </Section>
    </>
  );
}
