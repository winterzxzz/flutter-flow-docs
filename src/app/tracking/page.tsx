import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Facts, Note, Tag } from "@/components/bits";

export const metadata = { title: "Tracking" };

const EVENTS: [string, string][] = [
  ["screen_show", "screen"],
  ["screen_exit", "screen"],
  ["iap_show", "iap"],
  ["iap_close", "iap"],
  ["iap_click", "iap"],
  ["iap_purchase_success", "iap"],
  ["loading_start", "loading"],
  ["loading_finish", "loading"],
  ["button_click", "screen"],
  ["language_change", "screen"],
  ["rate_app", "screen"],
  ["overlay_show", "screen"],
];

export default function Tracking() {
  return (
    <>
      <PageHeader
        eyebrow="07"
        title="Luồng Tracking"
        lead="Mọi event đi qua đúng một hàm. Nhánh devtools luôn chạy, nhánh gửi mạng chỉ chạy ở bản release."
      />

      <Section title="Một event đi đường nào">
        <Mermaid
          caption="_sendEvent chia hai nhánh, chỉ một nhánh có điều kiện"
          chart={`flowchart TB
  A["UI gọi sendXxx()"] --> B["_sendEvent(event, param)"]
  B --> C["BucketDevtoolsCubit<br/>luôn chạy · xem trong app"]
  B --> D{"kDebugMode ?"}
  D -->|có| E["dừng · không gửi mạng"]
  D -->|không| F["DatabucketsEventTracker.record"]
  F --> G["HTTP TRACKING_BASE_URL"]`}
        />
      </Section>

      <Section title="12 event hiện có">
        <div className="my-5 flex flex-wrap gap-1.5">
          {EVENTS.map(([name, group]) => (
            <Tag key={name}>
              {name} · {group}
            </Tag>
          ))}
        </div>
        <Note tone="warn" title="Nhóm ad rỗng">
          <p>
            <C>EventGroup.ad</C> khai báo danh sách rỗng và <C>AdPlacement</C>{" "}
            có 8 giá trị nhưng 0 lần dùng. Không có event quảng cáo nào vào
            DataBuckets.
          </p>
        </Note>
      </Section>

      <Section title="Thuộc tính gắn kèm mọi event">
        <Mermaid
          caption="setCommonProperties được gọi lại mỗi khi có thay đổi"
          chart={`flowchart LR
  A["Adjust attribution"] --> U["UserProperties"]
  B["Connectivity stream"] --> U
  C["SharedPreferences user_id"] --> U
  D["trạng thái premium"] --> U
  U --> E["setCommonProperties"]
  E --> F["gắn vào mọi event"]`}
        />
        <Facts
          rows={[
            ["Định danh", <><C>userId</C> · uuid v4 lưu SharedPreferences</>],
            ["Bối cảnh", <><C>connectionType</C> · <C>activeDay</C> · <C>languageSelected</C> · <C>isIAPUser</C></>],
            [
              "Quy nguồn",
              <>
                <C>ua_network</C> · <C>ua_campaign</C> · <C>ua_adgroup</C> ·{" "}
                <C>ua_creative</C> · <C>ua_tracker_name</C>
              </>,
            ],
            [
              "Khi Adjust không trả về",
              <>cả 5 trường thành <C>&quot;Unattributed&quot;</C>; nếu network là organic thì trường thiếu điền bằng chính tên network</>,
            ],
          ]}
        />
      </Section>

      <Section title="Cấu hình tracker">
        <Facts
          rows={[
            ["Bỏ qua khi", <>API key rỗng → log <C>[startup] tracker disabled: empty API key</C></>],
            ["Ngưỡng flush", "500 event"],
            ["Giữ local tối đa", "50 000 event"],
            ["Chu kỳ flush", "10 giây"],
            ["Payload tối đa", "256 KB"],
          ]}
        />
      </Section>
    </>
  );
}
