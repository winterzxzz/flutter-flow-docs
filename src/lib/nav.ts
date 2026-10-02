export type NavItem = { href: string; label: string; hint: string };
export type NavGroup = { title: string; items: NavItem[] };

export const GROUPS: NavGroup[] = [
  {
    title: "Bắt đầu",
    items: [
      { href: "/", label: "Tổng quan", hint: "đọc tài liệu này thế nào" },
      { href: "/boot", label: "Khởi động", hint: "thứ tự init" },
    ],
  },
  {
    title: "IAA · Quảng cáo",
    items: [
      { href: "/iaa", label: "Format & vòng đời", hint: "năm format, bốn trạng thái" },
      { href: "/iaa/load", label: "Load, thử lại, làm mới", hint: "cổng giãn cách, hết hạn" },
    ],
  },
  {
    title: "IAP · Mua hàng",
    items: [
      { href: "/iap", label: "Luồng mua", hint: "catalog, mua, verify" },
      { href: "/iap/subscription", label: "Subscription", hint: "trạng thái, restore, hoàn tiền" },
    ],
  },
  {
    title: "Vận hành",
    items: [
      { href: "/remote-config", label: "Remote Config", hint: "điều khiển từ xa" },
      { href: "/tracking", label: "Tracking", hint: "event, attribution, doanh thu" },
    ],
  },
  {
    title: "UA & Tăng trưởng",
    items: [
      { href: "/ua", label: "Bản đồ chỉ số", hint: "chỉ số cần dữ liệu gì" },
      { href: "/ua/ltv", label: "LTV & cohort", hint: "giá trị vòng đời" },
      { href: "/ua/cpi", label: "CPI · ROAS", hint: "trả bao nhiêu là đủ" },
      { href: "/ua/launch", label: "Các giai đoạn launch", hint: "technical → global" },
      { href: "/ua/creative", label: "Ad creative", hint: "làm và đo" },
      { href: "/ua/diagnose", label: "Chẩn đoán chỉ số", hint: "5 tổ hợp" },
      { href: "/ua/instrumentation", label: "Kế hoạch đo", hint: "dựng đo lường theo thứ tự" },
      { href: "/ua/glossary", label: "Thuật ngữ", hint: "ARPU, IPM, eCPM…" },
    ],
  },
  {
    title: "Chuyên sâu",
    items: [
      { href: "/deep/preload", label: "Load rồi không hiện", hint: "show rate, ad hết hạn" },
      { href: "/deep/match-rate", label: "Match rate thấp", hint: "khi nào thấp là đúng" },
      { href: "/deep/ecpm-day", label: "eCPM giảm trong ngày", hint: "thành phần hay thị trường" },
      { href: "/deep/bidding", label: "Bidding vs waterfall", hint: "latency, doanh thu" },
      { href: "/deep/revenue-gap", label: "AdMob lệch MMP", hint: "ước tính, múi giờ, tỷ giá" },
    ],
  },
  {
    title: "Tham chiếu",
    items: [
      { href: "/platforms", label: "Flutter ↔ SwiftUI", hint: "khái niệm map sang API nào" },
      { href: "/lessons", label: "Lỗi hay gặp", hint: "bài học & checklist" },
    ],
  },
];

export const NAV: NavItem[] = GROUPS.flatMap((g) => g.items);
