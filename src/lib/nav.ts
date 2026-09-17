export type NavItem = { href: string; label: string; hint: string };

export const NAV: NavItem[] = [
  { href: "/", label: "Tổng quan", hint: "base và lib là gì" },
  { href: "/boot", label: "Khởi động", hint: "thứ tự init" },
  { href: "/iap", label: "IAP", hint: "mua hàng" },
  { href: "/iaa", label: "IAA", hint: "quảng cáo" },
  { href: "/admob", label: "AdMob chi tiết", hint: "load, retry, reload" },
  { href: "/remote-config", label: "Remote Config", hint: "điều khiển từ xa" },
  { href: "/tracking", label: "Tracking", hint: "event" },
  { href: "/gaps", label: "Rủi ro", hint: "chỗ cần vá" },
  { href: "/files", label: "Bản đồ file", hint: "sửa gì mở đâu" },
];
