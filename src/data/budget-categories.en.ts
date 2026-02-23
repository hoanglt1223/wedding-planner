import type { BudgetCategory } from "@/types/wedding";

export const BUDGET_CATEGORIES_EN: BudgetCategory[] = [
  { key: "ring",             label: "💍 Rings",             percentage: 5,  color: "#e74c3c" },
  { key: "ceremonial-gifts", label: "🎁 Ceremonial Gifts",  percentage: 8,  color: "#e67e22" },
  { key: "venue",            label: "🏛️ Venue",             percentage: 15, color: "#f39c12" },
  { key: "food",             label: "🍽️ Banquet",           percentage: 25, color: "#27ae60" },
  { key: "clothes",          label: "👗 Attire",            percentage: 7,  color: "#2980b9" },
  { key: "photo",            label: "📸 Photo/Video",       percentage: 10, color: "#8e44ad" },
  { key: "decor",            label: "🌸 Decoration",        percentage: 7,  color: "#e84393" },
  { key: "makeup",           label: "💄 Makeup",            percentage: 4,  color: "#fd79a8" },
  { key: "music",            label: "🎵 Music/MC",          percentage: 5,  color: "#00b894" },
  { key: "transport",        label: "🚗 Transport",         percentage: 3,  color: "#6c5ce7" },
  { key: "jewelry",          label: "💎 Jewelry",           percentage: 8,  color: "#fdcb6e" },
  { key: "flower",           label: "💐 Flowers",           percentage: 1,  color: "#ff6b6b" },
  { key: "other",            label: "📦 Other",             percentage: 2,  color: "#636e72" },
];
