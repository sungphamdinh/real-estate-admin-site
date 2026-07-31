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

const STATUS_LABELS: Record<Property["status"], string> = {
  DANG_BAN: "Đang bán",
  DANG_GIAO_DICH: "Đang giao dịch",
  DA_COC: "Đã cọc",
  DA_BAN: "Đã bán",
};

export function statusLabel(status: Property["status"]): string {
  return STATUS_LABELS[status];
}

const STATUS_COLORS: Record<Property["status"], { bg: string; fg: string }> = {
  DANG_BAN: { bg: "#dcfce7", fg: "#16a34a" },
  DANG_GIAO_DICH: { bg: "#fef3c7", fg: "#d97706" },
  DA_COC: { bg: "#ffedd5", fg: "#ea580c" },
  DA_BAN: { bg: "#e5e7eb", fg: "#4b5563" },
};

export function statusColor(status: Property["status"]): { bg: string; fg: string } {
  return STATUS_COLORS[status];
}

export function formatPrice(price: number): string {
  const ty = price / 1_000_000_000;
  return ty.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + " tỷ";
}

export function formatVnd(n: number): string {
  return Math.round(n).toLocaleString("vi-VN") + " VND";
}
