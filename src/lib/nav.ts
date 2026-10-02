import type { Locale } from "@/lib/i18n";

export type NavItem = { href: string; label: string; hint: string };
export type NavGroup = { title: string; items: NavItem[] };

type Text = Record<Locale, string>;
type Entry = { href: string; label: Text; hint: Text };

// One list for every locale, so a page can never exist in one language's
// navigation and be missing from the other's.
const TREE: { title: Text; items: Entry[] }[] = [
  {
    title: { vi: "Bắt đầu", en: "Getting started" },
    items: [
      {
        href: "/",
        label: { vi: "Tổng quan", en: "Overview" },
        hint: { vi: "đọc tài liệu này thế nào", en: "how to read this guide" },
      },
      {
        href: "/boot",
        label: { vi: "Khởi động", en: "Startup" },
        hint: { vi: "thứ tự init", en: "init order" },
      },
    ],
  },
  {
    title: { vi: "IAA · Quảng cáo", en: "IAA · Ads" },
    items: [
      {
        href: "/iaa",
        label: { vi: "Format & vòng đời", en: "Formats & lifecycle" },
        hint: { vi: "năm format, bốn trạng thái", en: "five formats, four states" },
      },
      {
        href: "/iaa/load",
        label: { vi: "Load, thử lại, làm mới", en: "Load, retry, refresh" },
        hint: { vi: "cổng giãn cách, hết hạn", en: "spacing gate, expiry" },
      },
    ],
  },
  {
    title: { vi: "IAP · Mua hàng", en: "IAP · Purchases" },
    items: [
      {
        href: "/iap",
        label: { vi: "Luồng mua", en: "Purchase flow" },
        hint: { vi: "catalog, mua, verify", en: "catalog, purchase, verify" },
      },
      {
        href: "/iap/subscription",
        label: { vi: "Subscription", en: "Subscription" },
        hint: { vi: "trạng thái, restore, hoàn tiền", en: "states, restore, refunds" },
      },
    ],
  },
  {
    title: { vi: "Vận hành", en: "Operations" },
    items: [
      {
        href: "/remote-config",
        label: { vi: "Remote Config", en: "Remote Config" },
        hint: { vi: "điều khiển từ xa", en: "remote control" },
      },
      {
        href: "/tracking",
        label: { vi: "Tracking", en: "Tracking" },
        hint: { vi: "event, attribution, doanh thu", en: "events, attribution, revenue" },
      },
    ],
  },
  {
    title: { vi: "UA & Tăng trưởng", en: "UA & Growth" },
    items: [
      {
        href: "/ua",
        label: { vi: "Bản đồ chỉ số", en: "Metrics map" },
        hint: { vi: "chỉ số cần dữ liệu gì", en: "what data each metric needs" },
      },
      {
        href: "/ua/ltv",
        label: { vi: "LTV & cohort", en: "LTV & cohorts" },
        hint: { vi: "giá trị vòng đời", en: "lifetime value" },
      },
      {
        href: "/ua/cpi",
        label: { vi: "CPI · ROAS", en: "CPI · ROAS" },
        hint: { vi: "trả bao nhiêu là đủ", en: "how much is enough to pay" },
      },
      {
        href: "/ua/launch",
        label: { vi: "Các giai đoạn launch", en: "Launch stages" },
        hint: { vi: "technical → global", en: "technical → global" },
      },
      {
        href: "/ua/creative",
        label: { vi: "Ad creative", en: "Ad creative" },
        hint: { vi: "làm và đo", en: "making and measuring" },
      },
      {
        href: "/ua/diagnose",
        label: { vi: "Chẩn đoán chỉ số", en: "Diagnosing metrics" },
        hint: { vi: "5 tổ hợp", en: "5 combinations" },
      },
      {
        href: "/ua/instrumentation",
        label: { vi: "Kế hoạch đo", en: "Measurement plan" },
        hint: { vi: "dựng đo lường theo thứ tự", en: "build measurement in order" },
      },
      {
        href: "/ua/glossary",
        label: { vi: "Thuật ngữ", en: "Glossary" },
        hint: { vi: "ARPU, IPM, eCPM…", en: "ARPU, IPM, eCPM…" },
      },
    ],
  },
  {
    title: { vi: "Chuyên sâu", en: "Deep dives" },
    items: [
      {
        href: "/deep/preload",
        label: { vi: "Load rồi không hiện", en: "Loaded but never shown" },
        hint: { vi: "show rate, ad hết hạn", en: "show rate, expired ads" },
      },
      {
        href: "/deep/match-rate",
        label: { vi: "Match rate thấp", en: "Low match rate" },
        hint: { vi: "khi nào thấp là đúng", en: "when low is correct" },
      },
      {
        href: "/deep/ecpm-day",
        label: { vi: "eCPM giảm trong ngày", en: "eCPM drops during the day" },
        hint: { vi: "thành phần hay thị trường", en: "mix or market" },
      },
      {
        href: "/deep/bidding",
        label: { vi: "Bidding vs waterfall", en: "Bidding vs waterfall" },
        hint: { vi: "latency, doanh thu", en: "latency, revenue" },
      },
      {
        href: "/deep/revenue-gap",
        label: { vi: "AdMob lệch MMP", en: "AdMob vs MMP gap" },
        hint: { vi: "ước tính, múi giờ, tỷ giá", en: "estimates, time zones, exchange rates" },
      },
    ],
  },
  {
    title: { vi: "Tham chiếu", en: "Reference" },
    items: [
      {
        href: "/platforms",
        label: { vi: "Flutter ↔ SwiftUI", en: "Flutter ↔ SwiftUI" },
        hint: { vi: "khái niệm map sang API nào", en: "which API each concept maps to" },
      },
      {
        href: "/lessons",
        label: { vi: "Lỗi hay gặp", en: "Common mistakes" },
        hint: { vi: "bài học & checklist", en: "lessons & checklist" },
      },
    ],
  },
];

/** Navigation in one language. hrefs stay locale-free; links add the prefix. */
export function navGroups(locale: Locale): NavGroup[] {
  return TREE.map((g) => ({
    title: g.title[locale],
    items: g.items.map((i) => ({ href: i.href, label: i.label[locale], hint: i.hint[locale] })),
  }));
}

/** Page paths in reading order. */
export const PATHS: string[] = TREE.flatMap((g) => g.items.map((i) => i.href));
