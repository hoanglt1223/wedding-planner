// Guest Gift Data — Common Vietnamese wedding gifts for guests

import type { GuestGiftCategory } from "@/types/wedding";

export interface GiftSuggestion {
  id: string;
  nameVi: string;
  nameEn: string;
  category: GuestGiftCategory;
  defaultCost: number;
  descriptionVi: string;
  descriptionEn: string;
}

export const GIFT_CATEGORIES = {
  tea: { labelVi: "Trà", labelEn: "Tea", icon: "🍵" },
  cake: { labelVi: "Bánh Kẹo", labelEn: "Cake", icon: "🍰" },
  souvenir: { labelVi: "Đồ Kỷ Niệm", labelEn: "Souvenir", icon: "🎁" },
  home: { labelVi: "Đồn Gia Dụng", labelEn: "Home", icon: "🏠" },
  food: { labelVi: "Thực Phẩm", labelEn: "Food", icon: "🍬" },
  other: { labelVi: "Khác", labelEn: "Other", icon: "📦" },
};

export const GIFT_SUGGESTIONS: GiftSuggestion[] = [
  {
    id: "s-1",
    nameVi: "Bộ trà nhựa",
    nameEn: "Plastic tea set",
    category: "tea",
    defaultCost: 15000,
    descriptionVi: "Bộ trà nhựa 4-6 chiếc, hộp giấy",
    descriptionEn: "Plastic tea set 4-6 pieces, paper box",
  },
  {
    id: "s-2",
    nameVi: "Bộ trà sứ",
    nameEn: "Ceramic tea set",
    category: "tea",
    defaultCost: 45000,
    descriptionVi: "Bộ trà sứ 4 chiếc, hộp quà sang trọng",
    descriptionEn: "Ceramic tea set 4 pieces, premium gift box",
  },
  {
    id: "s-3",
    nameVi: "Hộp bánh cookies",
    nameEn: "Cookie box",
    category: "cake",
    defaultCost: 25000,
    descriptionVi: "Hộp bánh cookies 200g, ribbon nơ",
    descriptionEn: "200g cookie box, ribbon bow",
  },
  {
    id: "s-4",
    nameVi: "Bánh mứt viên",
    nameEn: "Assorted candy box",
    category: "cake",
    defaultCost: 35000,
    descriptionVi: "Hộp bánh mứt 300g, mixed fruits",
    descriptionEn: "300g assorted candy box, mixed fruits",
  },
  {
    id: "s-5",
    nameVi: "Bật lửa khắc tên",
    nameEn: "Engraved lighter",
    category: "souvenir",
    defaultCost: 30000,
    descriptionVi: "Bật lửa khắc tên cô dâu chú rể",
    descriptionEn: "Lighter engraved with couple names",
  },
  {
    id: "s-6",
    nameVi: "Khăn tay khăn tóc",
    nameEn: "Handkerchief set",
    category: "souvenir",
    defaultCost: 40000,
    descriptionVi: "Set khăn tay + khăn tóc, hộp giấy",
    descriptionEn: "Handkerchief + hair towel set, paper box",
  },
  {
    id: "s-7",
    nameVi: "Sổ tay + bút",
    nameEn: "Notebook + pen set",
    category: "souvenir",
    defaultCost: 35000,
    descriptionVi: "Sổ tay bìa cứng + bút ghi thương hiệu",
    descriptionEn: "Hardcover notebook + branded pen",
  },
  {
    id: "s-8",
    nameVi: "Chén bát sứ",
    nameEn: "Ceramic bowl set",
    category: "home",
    defaultCost: 50000,
    descriptionVi: "Set chén bát sứ 4 chiếc, hộp quà",
    descriptionEn: "Ceramic bowl set 4 pieces, gift box",
  },
  {
    id: "s-9",
    nameVi: "Cốc thủy tinh",
    nameEn: "Glass cup set",
    category: "home",
    defaultCost: 40000,
    descriptionVi: "Set cốc thủy tinh 4 chiếc, hộp giấy",
    descriptionEn: "Glass cup set 4 pieces, paper box",
  },
  {
    id: "s-10",
    nameVi: "Mật ong",
    nameEn: "Honey jar",
    category: "food",
    defaultCost: 60000,
    descriptionVi: "Hũ mật ong 250ml, nhãn thương hiệu",
    descriptionEn: "250ml honey jar, branded label",
  },
  {
    id: "s-11",
    nameVi: "Lạp xưởng",
    nameEn: "Vietnamese sausage",
    category: "food",
    defaultCost: 45000,
    descriptionVi: "Hộp lạp xưởng 500gr, đóng gói quà tặng",
    descriptionEn: "500g Vietnamese sausage, gift packaging",
  },
  {
    id: "s-12",
    nameVi: "Hộp quà tùy chỉnh",
    nameEn: "Custom gift box",
    category: "other",
    defaultCost: 50000,
    descriptionVi: "Hộp quà tùy chỉnh theo nhu cầu",
    descriptionEn: "Custom gift box as needed",
  },
];

export const RECIPIENT_TYPES = {
  all: { labelVi: "Tất cả khách", labelEn: "All Guests", icon: "👥" },
  family: { labelVi: "Gia đình", labelEn: "Family", icon: "👨‍👩‍👧‍👦" },
  vip: { labelVi: "VIP", labelEn: "VIP", icon: "⭐" },
  regular: { labelVi: "Khách thường", labelEn: "Regular Guests", icon: "👤" },
};

export const STATUS_LABELS = {
  pending: { labelVi: "Chuẩn bị", labelEn: "Pending", icon: "📋" },
  prepared: { labelVi: "Đã chuẩn bị", labelEn: "Prepared", icon: "✅" },
  distributed: { labelVi: "Đã phát", labelEn: "Distributed", icon: "🎁" },
};
