import { PageHeader, Section } from "@/components/page-header";
import { C, Grid } from "@/components/bits";

export const metadata = { title: "Bản đồ file" };

export default function Files() {
  return (
    <>
      <PageHeader
        eyebrow="09"
        title="Bản đồ file"
        lead="Tra nhanh: muốn sửa cái gì thì mở file nào, và file đó nằm ở base hay ở lib."
      />

      <Section title="IAP">
        <Grid
          head={["Muốn làm", "Mở file"]}
          rows={[
            ["Đổi product id các gói", <C key="a">configs/iap/purchase_constant.dart</C>],
            ["Sửa cách gọi store", <C key="b">data_module/services/purchase_service.dart</C>],
            ["Sửa logic premium", <C key="c">blocs/premium/premium_cubit.dart</C>],
            ["Sửa màn paywall", <C key="d">ui/premium/ · ui/trial/</C>],
            ["Sửa verify receipt", <C key="e">configs/iap/verify/</C>],
            ["Đổi cách hiển thị giá", <C key="f">configs/iap/package_extension.dart</C>],
          ]}
        />
      </Section>

      <Section title="IAA">
        <Grid
          head={["Muốn làm", "Mở file"]}
          rows={[
            ["Đổi ad unit id", <C key="a">configs/admob/config/key_ads_android.dart · key_ads_ios.dart</C>],
            ["Đổi giãn cách full ad (fallback)", <C key="b">configs/admob/config/admob_constant.dart</C>],
            ["Sửa open ad lúc mở app", <C key="c">configs/admob/utils/app_open_ad_setup.dart</C>],
            ["Sửa native ad đặt chỗ", <C key="d">configs/admob/provider/native_widget.dart</C>],
            [
              "Sửa vòng đời ad, retry, timer",
              <>
                repo <b>lib</b> · <C>lib_admob_plugin/lib/src/</C>
              </>,
            ],
            [
              "Sửa báo doanh thu ad",
              <>
                repo <b>lib</b> · <C>lib_admob_plugin/lib/src/adjust/adjust_tracker_utils.dart</C>
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="Remote Config">
        <Grid
          head={["Muốn làm", "Mở file"]}
          rows={[
            ["Đổi tiền tố khoá", <>
              <C>configs/firebase/firebase_constants.dart</C> — <C>FBASE_ROOT</C>
            </>],
            ["Sửa JSON mặc định viết cứng", <C key="b">configs/firebase/firebase_admob_config.dart</C>],
            ["Sửa cách parse JSON", <>
              <C>configs/firebase/firebase_config_manager.dart</C> — <C>setAdConfigs</C>
            </>],
            ["Sửa lúc nào fetch, xử lý lỗi", <C key="d">ui/splash/services/splash_remote_config_loader.dart</C>],
            [
              "Đổi thời gian cache / timeout",
              <>
                repo <b>lib</b> · <C>lib_firebase/lib/src/remote_config_utils.dart</C>
              </>,
            ],
            [
              "Sửa default từng trường",
              <>
                repo <b>lib</b> · <C>lib_admob_plugin/lib/src/models/ad_config_constants.dart</C>
              </>,
            ],
            [
              "Thêm format ad vào schema",
              <>
                repo <b>lib</b> · <C>models/ad_format.dart</C> + <C>ad_config.dart</C>
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="Tracking">
        <Grid
          head={["Muốn làm", "Mở file"]}
          rows={[
            [
              "Thêm event mới",
              <>
                <C>configs/tracking/constants/bucket_event.dart</C> + model ở{" "}
                <C>models/</C> + hàm send ở <C>utils/bucket_tracking_utils.dart</C>
              </>,
            ],
            ["Thêm tên màn / tên nút", <C key="b">configs/tracking/constants/</C>],
            ["Xem event trong app", <C key="c">configs/tracking/dev/bucket_devtools_view.dart</C>],
            ["Đổi endpoint / ngưỡng flush", <>
              <C>main.dart</C> hàm <C>setupDataBucket</C>
            </>],
          ]}
        />
      </Section>
    </>
  );
}
