# Flow Docs — IAA & IAP

Tài liệu đọc và nghiên cứu về kiếm tiền trong app: **IAA** (quảng cáo) và
**IAP** (mua hàng), kèm UA. Dùng chung cho dự án Flutter lẫn SwiftUI.

Xem online: https://winterzxzz.github.io/flutter-flow-docs/

## Cấu trúc

Phần lớn chỗ hỏng trong một app vừa bán gói vừa hiện quảng cáo không crash:
người đã trả tiền vẫn thấy ad, doanh thu ad không về kho phân tích, campaign
đang lãi bị tắt vì ROAS thiếu một nửa. Tài liệu chia làm ba tầng để giải thích
những chỗ đó:

1. **Khái niệm** — cơ chế, lý do, đánh đổi; không gắn với một codebase.
2. **Đối chiếu Flutter ↔ SwiftUI** — mỗi khái niệm gọi bằng package/API nào.
3. **Bài học** — lỗi hay gặp rút từ một dự án Flutter thực tế, kèm checklist.

Mục **Chuyên sâu** trả lời các câu hỏi khó hơn về chỉ số quảng cáo theo mạch
hiện tượng → cơ chế → chỉ số → ví dụ số → bài học. Usecase trên các trang khái
niệm đi theo mạch tình huống → bên trong → cơ chế · nếu làm sai → bài học. Số
liệu trong ví dụ là giả định minh hoạ; khẳng định về StoreKit, Play Billing,
AdMob, UMP/ATT, Firebase, Adjust có link tài liệu chính thức ngay dưới.

## Nội dung

| Trang | Nói về |
| --- | --- |
| Tổng quan | hai dòng tiền gặp nhau ở entitlement |
| Khởi động | phụ thuộc nào đảo thứ tự là hỏng: consent, entitlement, config, preload |
| IAA · Format & vòng đời | năm format, ad có hạn và show một lần, cổng chặn, mediation, paid event |
| IAA · Load, thử lại, làm mới | thử lại, cổng giãn cách, app open hết hạn 4 giờ, refresh banner/native, rewarded |
| IAP · Luồng mua | entitlement, catalog, mua, verify, paywall |
| IAP · Subscription | trạng thái, grace/billing retry, restore, hoàn tiền, server notifications |
| Remote Config | in-app default, thời điểm activate, rollout và nhóm đối chứng |
| Tracking | taxonomy event, attribution, doanh thu tới cả MMP lẫn kho phân tích |
| UA · Bản đồ chỉ số, LTV, CPI · ROAS, launch, creative, chẩn đoán, kế hoạch đo | chỉ số UA và dữ liệu chúng cần |
| UA · Thuật ngữ | từ viết tắt và thuật ngữ toàn site |
| Chuyên sâu | load rồi không hiện, match rate thấp, eCPM giảm trong ngày, bidding vs waterfall, AdMob lệch MMP |
| Flutter ↔ SwiftUI | bảng đối chiếu package và API |
| Lỗi hay gặp | hiện tượng → nguyên nhân → bài học, kèm checklist |

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

## Deploy

```bash
npm run deploy
```

Build rồi đẩy thư mục `out/` lên nhánh `gh-pages`, sau đó yêu cầu GitHub Pages
build lại. Pages phục vụ từ `gh-pages` chứ không phải `main`.

Có sẵn `.github/workflows/deploy.yml` làm đúng việc này bằng GitHub Actions,
nhưng Actions hiện không chạy được trên tài khoản (`your account is locked due
to a billing issue`). Khi billing được gỡ, đổi Pages source về
`build_type=workflow` là dùng lại được workflow và bỏ script thủ công.

## Kiểm tra sơ đồ

Mermaid render phía client nên lỗi cú pháp sẽ ra ô trống im lặng thay vì báo
lỗi build. Khi thêm hoặc sửa sơ đồ, parse lại toàn bộ trước khi push.

## Lưu ý

Tên API và phiên bản package đối chiếu với tài liệu chính thức ngày
2026-10-02. SDK đổi nhanh — kiểm lại tài liệu gốc trước khi dựa vào một chi
tiết cụ thể.
