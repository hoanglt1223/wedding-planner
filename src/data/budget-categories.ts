import type { BudgetCategory } from "@/types/wedding";

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  { key: "ring",      label: "💍 Nhẫn",       percentage: 5,  color: "#e74c3c" },
  { key: "ceremonial-gifts", label: "🎁 Lễ vật",      percentage: 8,  color: "#e67e22" },
  { key: "venue",     label: "🏛️ Nhà hàng",    percentage: 15, color: "#f39c12" },
  { key: "food",      label: "🍽️ Tiệc",        percentage: 25, color: "#27ae60" },
  { key: "clothes",   label: "👗 Trang phục",  percentage: 7,  color: "#2980b9" },
  { key: "photo",     label: "📸 Ảnh/Video",   percentage: 10, color: "#8e44ad" },
  { key: "decor",     label: "🌸 Trang trí",   percentage: 7,  color: "#e84393" },
  { key: "makeup",    label: "💄 Makeup",       percentage: 4,  color: "#fd79a8" },
  { key: "music",     label: "🎵 Nhạc/MC",     percentage: 5,  color: "#00b894" },
  { key: "transport", label: "🚗 Xe",          percentage: 3,  color: "#6c5ce7" },
  { key: "jewelry",   label: "💎 Nữ trang",    percentage: 8,  color: "#fdcb6e" },
  { key: "flower",    label: "💐 Hoa",         percentage: 1,  color: "#ff6b6b" },
  { key: "other",     label: "📦 Khác",        percentage: 2,  color: "#636e72" },
];
