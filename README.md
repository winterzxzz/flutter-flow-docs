# Flow Docs — Base & Lib

Tài liệu mô tả luồng code giữa hai repo Flutter: **base** (app) và **lib**
(thư viện dùng chung), tập trung vào hai trục IAP (in-app purchase) và
IAA (in-app ads).

Xem online: https://winterzxzz.github.io/flutter-flow-docs/

## Nội dung

1. Base và lib — cách hai repo nối với nhau
2. Thứ tự khởi động và các ràng buộc phụ thuộc
3. Luồng IAP — UI → cubit → service → RevenueCat → verify server
4. Luồng IAA — config trong base, vòng đời ad trong lib
5. Cầu nối IAP ↔ IAA
6. Luồng tracking — DataBuckets và Adjust
7. Remote Config — khoá, ba tầng giá trị, thời điểm fetch, cách hỏng
8. Khoảng trống và rủi ro
9. Bản đồ file

## Chạy local

    python3 -m http.server 8000

Rồi mở http://localhost:8000

## Lưu ý

Tài liệu đọc từ source bytes ngày 2026-09-17. Khi code đổi, đọc lại rồi
cập nhật — đừng tin tài liệu hơn tin code.
