/**
 * Wedding Day Emergency Kit data
 * Practical items for handling common wedding day emergencies
 */

export interface EmergencyKitItem {
  id: string;
  category: "clothing" | "beauty" | "health" | "misc" | "tech";
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  priority: "essential" | "recommended" | "optional";
  quantity?: string;
}

export const emergencyKitItems: EmergencyKitItem[] = [
  // CLOTHING REPAIRS
  {
    id: "sewing-kit",
    category: "clothing",
    name: "Bộ kim chỉ",
    nameEn: "Sewing kit",
    description: "Kim, chỉ đa màu, kim dập ghim để sửa quần áo gấp",
    descriptionEn: "Needles, thread colors, safety pins for clothing repairs",
    priority: "essential",
    quantity: "1 bộ"
  },
  {
    id: "scissors",
    category: "clothing",
    name: "Kéo nhỏ",
    nameEn: "Small scissors",
    description: "Kéomay ôm để cắt chỉ dư",
    descriptionEn: "Small sewing scissors for trimming loose threads",
    priority: "essential",
    quantity: "1-2 cái"
  },
  {
    id: "stain-remover",
    category: "clothing",
    name: "Bút xóa vết bẩn",
    nameEn: "Stain remover pen",
    description: "Bút xóa vết bẩn trên quần áo màu trắng",
    descriptionEn: "Stain remover pen for white clothing emergencies",
    priority: "recommended",
    quantity: "2-3 cây"
  },
  {
    id: "lint-roller",
    category: "clothing",
    name: "Băng dính lông",
    nameEn: "Lint roller",
    description: "Dọn lông, bụi trên trang phục",
    descriptionEn: "Remove lint and dust from formal wear",
    priority: "recommended",
    quantity: "1 cuộn"
  },
  {
    id: "fashion-tape",
    category: "clothing",
    name: "Băng dính thời trang",
    nameEn: "Fashion tape",
    description: "Giữ váy, áo không bị xê dịch",
    descriptionEn: "Keep dresses and shirts in place",
    priority: "recommended",
    quantity: "1 hộp"
  },
  {
    id: "extra-buttons",
    category: "clothing",
    name: "Nút dự phòng",
    nameEn: "Extra buttons",
    description: "Nút dự phòng cho áo vest/váy cưới",
    descriptionEn: "Spare buttons for suits and wedding dresses",
    priority: "optional",
    quantity: "tùy theo trang phục"
  },

  // BEAUTY & GROOMING
  {
    id: "hairspray",
    category: "beauty",
    name: "Xịt tóc giữ nếp",
    nameEn: "Hairspray",
    description: "Giữ tóc gọn gàng trong ngày",
    descriptionEn: "Keep hairstyle in place all day",
    priority: "essential",
    quantity: "1-2 chai nhỏ"
  },
  {
    id: "bobby-pins",
    category: "beauty",
    name: "Kẹp tóc",
    nameEn: "Bobby pins",
    description: "Kẹp tóc gọn khi cần",
    descriptionEn: "Secure loose strands quickly",
    priority: "essential",
    quantity: "10-15 cái"
  },
  {
    id: "lip-balm",
    category: "beauty",
    name: "Son dưỡng môi",
    nameEn: "Lip balm",
    description: "Dưỡng môi, phòng khô môi",
    descriptionEn: "Prevent dry lips throughout the day",
    priority: "essential",
    quantity: "2-3 tuýp"
  },
  {
    id: "blotting-paper",
    category: "beauty",
    name: "Giấy thấm dầu",
    nameEn: "Blotting paper",
    description: "Thấm dầu bóng mặt",
    descriptionEn: "Remove excess facial oil",
    priority: "recommended",
    quantity: "1 gói"
  },
  {
    id: "nail-polish",
    category: "beauty",
    name: "Sơn móng tay nhạt",
    nameEn: "Neutral nail polish",
    description: "Sơn móng trong suốt hoặc màu nhạt để sửa gãy",
    descriptionEn: "Clear or neutral polish for nail repairs",
    priority: "optional",
    quantity: "1 chai"
  },
  {
    id: "compact-mirror",
    category: "beauty",
    name: "Gương cầm tay",
    nameEn: "Compact mirror",
    description: "Kiểm tra外观 nhanh chóng",
    descriptionEn: "Quick appearance checks",
    priority: "recommended",
    quantity: "1-2 cái"
  },

  // HEALTH & SAFETY
  {
    id: "painkillers",
    category: "health",
    name: "Thuốc giảm đau",
    nameEn: "Pain relievers",
    description: "Paracetamol/ibuprofen cho headache",
    descriptionEn: "Paracetamol/ibuprofen for headaches",
    priority: "essential",
    quantity: "vỉ nhỏ"
  },
  {
    id: "bandaids",
    category: "health",
    name: "Băng cá nhân",
    nameEn: "Band-aids",
    description: "Băng bọ vết thương nhỏ",
    descriptionEn: "Cover minor cuts and blisters",
    priority: "essential",
    quantity: "5-10 miếng"
  },
  {
    id: "antacid",
    category: "health",
    name: "Thuốc dạ dày",
    nameEn: "Antacid tablets",
    description: "Chữa ợ nóng, khó tiêu",
    descriptionEn: "Treat heartburn and indigestion",
    priority: "recommended",
    quantity: "vỉ nhỏ"
  },
  {
    id: "allergy-meds",
    category: "health",
    name: "Thuốc chống dị ứng",
    nameEn: "Antihistamine",
    description: "Cho phản ứng dị ứng bất ngờ",
    descriptionEn: "For unexpected allergic reactions",
    priority: "recommended",
    quantity: "theo chỉ định"
  },
  {
    id: "tissues-wet-wipes",
    category: "health",
    name: "Khăn giấy khăn ướt",
    nameEn: "Tissues & wet wipes",
    description: "Khăn giấy và khăn ướt đa năng",
    descriptionEn: "Tissues and multi-purpose wet wipes",
    priority: "essential",
    quantity: "2-3 gói"
  },
  {
    id: "hand-sanitizer",
    category: "health",
    name: "Nước rửa tay",
    nameEn: "Hand sanitizer",
    description: "Nước rửa tay khô nhanh",
    descriptionEn: "Quick hand disinfection",
    priority: "essential",
    quantity: "1-2 chai nhỏ"
  },

  // MISC EMERGENCY ITEMS
  {
    id: "snacks",
    category: "misc",
    name: "Đồ ăn nhanh",
    nameEn: "Quick snacks",
    description: "Bánh quy, hạt, chocolate cho lúc đói",
    descriptionEn: "Cookies, nuts, chocolate for hunger",
    priority: "essential",
    quantity: "đủ cho 2-4 người"
  },
  {
    id: "water-bottles",
    category: "misc",
    name: "Bình nước",
    nameEn: "Water bottles",
    description: "Giữ nước trong ngày dài",
    descriptionEn: "Stay hydrated throughout the day",
    priority: "essential",
    quantity: "2-4 bình"
  },
  {
    id: "phone-charger",
    category: "misc",
    name: "Sạc dự phòng",
    nameEn: "Portable charger",
    description: "Sạc pin điện thoại di động",
    descriptionEn: "Charge mobile phones on the go",
    priority: "essential",
    quantity: "1-2 cái"
  },
  {
    id: "cash-emergency",
    category: "misc",
    name: "Tiền mặt",
    nameEn: "Emergency cash",
    description: "Tiền mặt cho tình huống khẩn cấp",
    descriptionEn: "Cash for emergency situations",
    priority: "recommended",
    quantity: "500k-1M VND"
  },
  {
    id: "safety-pins-heavy",
    category: "misc",
    name: "Kim ghim lớn",
    nameEn: "Heavy safety pins",
    description: "Kim ghim cỡ lớn cho các sửa chữa khẩn cấp",
    descriptionEn: "Large pins for emergency fixes",
    priority: "recommended",
    quantity: "5-10 cái"
  },
  {
    id: "pen-notebook",
    category: "misc",
    name: "Viết sổ tay",
    nameEn: "Pen & notebook",
    description: "Ghi chú thông tin quan trọng",
    descriptionEn: "Note down important information",
    priority: "optional",
    quantity: "1 bộ"
  },

  // TECH & COMMUNICATION
  {
    id: "power-bank",
    category: "tech",
    name: "Sạc pin dự phòng",
    nameEn: "Power bank",
    description: "Sạc dự phòng cho điện thoại và thiết bị",
    descriptionEn: "Backup power for phones and devices",
    priority: "essential",
    quantity: "1-2 cái"
  },
  {
    id: "cable-organizer",
    category: "tech",
    name: "Túi dây cáp",
    nameEn: "Cable organizer",
    description: "Dây sạc đa năng cho iPhone/Android",
    descriptionEn: "Multi-charging cables for iPhone/Android",
    priority: "recommended",
    quantity: "1 bộ"
  },
  {
    id: "bluetooth-speaker",
    category: "tech",
    name: "Loa Bluetooth mini",
    nameEn: "Mini Bluetooth speaker",
    description: "Nhạc nền khi chuẩn bị",
    descriptionEn: "Background music during prep",
    priority: "optional",
    quantity: "1 cái"
  }
];

export function getEmergencyKitItemsByCategory(category: EmergencyKitItem["category"]): EmergencyKitItem[] {
  return emergencyKitItems.filter(item => item.category === category);
}

export function getEmergencyKitItemsByPriority(priority: EmergencyKitItem["priority"]): EmergencyKitItem[] {
  return emergencyKitItems.filter(item => item.priority === priority);
}

const categoryInfo = {
  clothing: { name: "Trang phục", nameEn: "Clothing", icon: "👔", color: "bg-blue-50 text-blue-700" },
  beauty: { name: "Làm đẹp", nameEn: "Beauty", icon: "💄", color: "bg-pink-50 text-pink-700" },
  health: { name: "Sức khỏe", nameEn: "Health", icon: "💊", color: "bg-green-50 text-green-700" },
  misc: { name: "Khác", nameEn: "Misc", icon: "📦", color: "bg-orange-50 text-orange-700" },
  tech: { name: "Công nghệ", nameEn: "Tech", icon: "🔌", color: "bg-purple-50 text-purple-700" }
};

const priorityInfo = {
  essential: { name: "Bắt buộc", nameEn: "Essential", icon: "⭐", color: "text-red-600" },
  recommended: { name: "Khuyên dùng", nameEn: "Recommended", icon: "✓", color: "text-orange-600" },
  optional: { name: "Tùy chọn", nameEn: "Optional", icon: "○", color: "text-gray-600" }
};

export { categoryInfo, priorityInfo };
