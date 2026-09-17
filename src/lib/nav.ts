export type NavItem = { href: string; label: string; hint: string };
export type NavGroup = { title: string; items: NavItem[] };

export const GROUPS: NavGroup[] = [
  {
    title: "Codebase",
    items: [
      { href: "/", label: "Tổng quan", hint: "base và lib là gì" },
      { href: "/boot", label: "Khởi động", hint: "thứ tự init" },
      { href: "/iap", label: "IAP", hint: "mua hàng" },
      { href: "/iaa", label: "IAA", hint: "quảng cáo" },
      { href: "/admob", label: "AdMob chi tiết", hint: "load, retry, reload" },
      { href: "/remote-config", label: "Remote Config", hint: "điều khiển từ xa" },
      { href: "/tracking", label: "Tracking", hint: "event" },
    ],
  },
  {
    title: "UA & Tăng trưởng",
    items: [
      { href: "/ua", label: "Bản đồ chỉ số", hint: "đo được gì, thiếu gì" },
      { href: "/ua/ltv", label: "LTV & cohort", hint: "giá trị vòng đời" },
      { href: "/ua/cpi", label: "CPI · ROAS", hint: "trả bao nhiêu là đủ" },
      { href: "/ua/launch", label: "Các giai đoạn launch", hint: "technical → global" },
      { href: "/ua/creative", label: "Ad creative", hint: "làm và đo" },
      { href: "/ua/diagnose", label: "Chẩn đoán chỉ số", hint: "5 tổ hợp" },
      { href: "/ua/instrumentation", label: "Kế hoạch đo", hint: "cần vá gì" },
    ],
  },
  {
    title: "Tham chiếu",
    items: [
      { href: "/gaps", label: "Rủi ro", hint: "chỗ cần vá" },
      { href: "/files", label: "Bản đồ file", hint: "sửa gì mở đâu" },
    ],
  },
];

export const NAV: NavItem[] = GROUPS.flatMap((g) => g.items);
