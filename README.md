# Flow Docs — Base & Lib

Tài liệu mô tả luồng code giữa hai repo Flutter: **base** (app) và **lib**
(thư viện dùng chung), tập trung vào IAP (in-app purchase) và IAA (in-app ads).

Xem online: https://winterzxzz.github.io/flutter-flow-docs/

## Nội dung

| Trang | Nói về |
| --- | --- |
| Tổng quan | base và lib nối với nhau bằng gì |
| Khởi động | thứ tự init trong `main.dart` và ba ràng buộc bắt buộc |
| IAP | UI → PremiumCubit → PurchaseService → RevenueCat → verify server |
| IAA | base khai báo, lib thực thi; năm format ad |
| AdMob chi tiết | luật load, retry, timeout, reload, waterfall của từng format |
| Remote Config | một khoá, ba tầng giá trị, lúc nào fetch, cách sửa JSON |
| Tracking | `_sendEvent` và 12 event hiện có |
| Rủi ro | 10 khoảng trống đọc ra từ source |
| Bản đồ file | muốn sửa gì thì mở file nào |

## Stack

Next.js App Router (static export) · Tailwind CSS v4 · shadcn/ui · Mermaid.

## Chạy local

```bash
npm install
npm run dev
```

## Build tĩnh

```bash
npm run build   # ra thư mục out/
```

GitHub Actions tự build và deploy mỗi lần push lên `main`
(`.github/workflows/deploy.yml`).

## Kiểm tra sơ đồ

Mermaid render phía client nên lỗi cú pháp sẽ ra ô trống im lặng thay vì báo
lỗi build. Khi thêm hoặc sửa sơ đồ, parse lại toàn bộ trước khi push.

## Lưu ý

Tài liệu đọc từ source bytes ngày 2026-09-17. Khi code đổi, đọc lại rồi cập
nhật — đừng tin tài liệu hơn tin code.
