import { Property } from "./types";

const CATEGORY_LABELS: Record<Property["category"], string> = {
  MAT_TIEN: "Mặt tiền",
  HEM: "Đường Hẻm",
  CAN_HO: "Căn hộ",
  DAT_NEN: "Đất nền",
};

export function categoryLabel(category: Property["category"]): string {
  return CATEGORY_LABELS[category];
}

export function formatPrice(price: number): string {
  const ty = price / 1_000_000_000;
  return ty.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + " tỷ";
}

export function formatVnd(n: number): string {
  return Math.round(n).toLocaleString("vi-VN") + " VND";
}
