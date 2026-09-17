import { Mermaid } from "@/components/mermaid";
import { PageHeader, Section } from "@/components/page-header";
import { C, Grid, Note } from "@/components/bits";

export const metadata = { title: "Khởi động" };

export default function Boot() {
  return (
    <>
      <PageHeader
        eyebrow="02"
        title="Thứ tự khởi động"
        lead="main.dart quyết định IAP và IAA có dữ liệu đúng hay không. Vài bước chạy song song, vài bước bắt buộc nối tiếp."
      />

      <Section title="Toàn cảnh">
        <Mermaid
          caption="Khối màu nhạt chạy song song bằng Future.wait"
          chart={`flowchart TB
  A["onError → Crashlytics<br/>main.dart:35"] --> B["SystemChrome<br/>khoá dọc màn hình"]
  B --> C["docsDir + Hive.init<br/>main.dart:57"]
  C --> D["initDependencyInjection<br/>get_it · main.dart:61"]
  D --> E{{"Future.wait · main.dart:65"}}
  E --> E1["_initStorage<br/>HydratedBloc"]
  E --> E2["initFirebase<br/>lib_firebase"]
  E --> E3["generateUserId<br/>uuid v4"]
  E1 --> F["setupPurchase<br/>RevenueCat · main.dart:72"]
  E2 --> F
  E3 --> F
  F --> G["ShimmerUtils.init<br/>main.dart:81"]
  G --> H{{"Future.wait · main.dart:84"}}
  H --> H1["FirebaseConstantManager<br/>.initialize"]
  H --> H2["setupDataBucket<br/>tracker"]
  H1 --> I["setupPreloadNative<br/>main.dart:91"]
  H2 --> I
  I --> J["runApp<br/>MultiBlocProvider"]`}
        />
      </Section>

      <Section title="Ba ràng buộc bắt buộc">
        <Mermaid
          caption="Đảo thứ tự bất kỳ mũi tên nào là hỏng lặng lẽ, không crash"
          chart={`flowchart LR
  U["userId tracking"] -->|phải có trước| P["setupPurchase"]
  AC["ad config"] -->|phải có trước| PN["preload native"]
  ST["HydratedStorage"] -->|phải có trước| CB["sl&lt;AppConfigCubit&gt;()"]`}
        />
      </Section>

      <Section title="Bloc nào nằm ở root">
        <Grid
          head={["Bloc", "Cách tạo", "Vì sao"]}
          rows={[
            ["BucketDevtoolsCubit", "create", "nhận mọi event tracking"],
            ["AppConfigCubit", "value", "đã tạo trước runApp, hydrated"],
            [
              "PremiumCubit",
              "create · lazy",
              <>
                constructor gọi <C>loadPackages()</C> tức là network RevenueCat
              </>,
            ],
            ["AdManagerBloc", "value", "giữ native ad đã preload"],
          ]}
        />
        <Note tone="info" title="NativeWidgetBloc không ở root">
          <p>
            Mọi <C>BlocBuilder</C> đều truyền <C>bloc:</C> tường minh; consumer
            lấy qua <C>nativeManager.nativeWidgetBloc(id)</C>.
          </p>
        </Note>
      </Section>
    </>
  );
}
