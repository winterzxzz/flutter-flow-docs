import type { Locale } from "@/lib/i18n";

/** Every fixed label the components print, in each language. */
const vi = {
  tagline: "IAA & IAP",
  description:
    "Tài liệu nghiên cứu IAA (quảng cáo) và IAP (mua hàng) cho app Flutter và SwiftUI, kèm UA.",
  source: "Nguồn",
  usecase: "Usecase",
  situation: "Tình huống",
  inside: "Bên trong",
  mechanism: "Cơ chế · nếu làm sai",
  lesson: "Bài học",
  assumed: "số liệu giả định",
  onThisPage: "Trên trang này",
  prev: "Trang trước",
  next: "Trang sau",
  pager: "Trang trước và trang sau",
  openMenu: "Mở danh sách trang",
  openOutline: "Mở mục lục của trang",
  close: "Đóng",
  theme: "Đổi giao diện sáng / tối",
  language: "Ngôn ngữ",
  search: "Tìm trang, mục…",
  searchTitle: "Tìm trong tài liệu",
  searchEmpty: "Không có trang hay mục nào khớp.",
  copy: "Sao chép",
  copied: "Đã chép",
};

const en: typeof vi = {
  tagline: "IAA & IAP",
  description:
    "Study notes on IAA (in-app advertising) and IAP (in-app purchases) for Flutter and SwiftUI apps, with UA.",
  source: "Source",
  usecase: "Use case",
  situation: "Situation",
  inside: "Inside",
  mechanism: "Mechanism · if done wrong",
  lesson: "Lesson",
  assumed: "assumed figures",
  onThisPage: "On this page",
  prev: "Previous",
  next: "Next",
  pager: "Previous and next page",
  openMenu: "Open the page list",
  openOutline: "Open this page's outline",
  close: "Close",
  theme: "Switch between light and dark",
  language: "Language",
  search: "Search pages, sections…",
  searchTitle: "Search the docs",
  searchEmpty: "No page or section matches.",
  copy: "Copy",
  copied: "Copied",
};

export type UiKey = keyof typeof vi;
export const UI: Record<Locale, typeof vi> = { vi, en };
