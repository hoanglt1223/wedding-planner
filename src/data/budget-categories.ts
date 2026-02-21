import type { BudgetCategory } from "@/types/wedding";

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  { k: "ring",      l: "💍 Nhẫn",       p: 5,  cl: "#e74c3c" },
  { k: "levat",     l: "🎁 Lễ vật",      p: 8,  cl: "#e67e22" },
  { k: "venue",     l: "🏛️ Nhà hàng",    p: 15, cl: "#f39c12" },
  { k: "food",      l: "🍽️ Tiệc",        p: 25, cl: "#27ae60" },
  { k: "clothes",   l: "👗 Trang phục",  p: 7,  cl: "#2980b9" },
  { k: "photo",     l: "📸 Ảnh/Video",   p: 10, cl: "#8e44ad" },
  { k: "decor",     l: "🌸 Trang trí",   p: 7,  cl: "#e84393" },
  { k: "makeup",    l: "💄 Makeup",       p: 4,  cl: "#fd79a8" },
  { k: "music",     l: "🎵 Nhạc/MC",     p: 5,  cl: "#00b894" },
  { k: "transport", l: "🚗 Xe",          p: 3,  cl: "#6c5ce7" },
  { k: "jewelry",   l: "💎 Nữ trang",    p: 8,  cl: "#fdcb6e" },
  { k: "flower",    l: "💐 Hoa",         p: 1,  cl: "#ff6b6b" },
  { k: "other",     l: "📦 Khác",        p: 2,  cl: "#636e72" },
];
