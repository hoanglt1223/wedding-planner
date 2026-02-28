export interface ExpenseCategoryDef {
  key: string;
  label: string;
  icon: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategoryDef[] = [
  { key: "venue", label: "Nhà hàng / Địa điểm", icon: "🏛️" },
  { key: "food", label: "Tiệc / Đồ ăn", icon: "🍽️" },
  { key: "photo", label: "Chụp ảnh / Quay phim", icon: "📸" },
  { key: "clothes", label: "Áo dài / Trang phục", icon: "👗" },
  { key: "decor", label: "Trang trí / Hoa", icon: "💐" },
  { key: "ceremonial-gifts", label: "Lễ vật / Sính lễ", icon: "🎁" },
  { key: "ring", label: "Nhẫn cưới", icon: "💍" },
  { key: "makeup", label: "Makeup", icon: "💄" },
  { key: "music", label: "Âm nhạc / MC", icon: "🎵" },
  { key: "transport", label: "Xe hoa / Di chuyển", icon: "🚗" },
  { key: "jewelry", label: "Nữ trang", icon: "💎" },
  { key: "flower", label: "Hoa", icon: "🌸" },
  { key: "other", label: "Khác", icon: "📦" },
];
