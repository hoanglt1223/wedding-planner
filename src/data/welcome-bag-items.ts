// Welcome Bag predefined items — categorized essentials for out-of-town guests

import type { WelcomeBagCategory } from "../types/wedding";

export interface WelcomeBagTemplate {
  id: string;
  nameVi: string;
  nameEn: string;
  category: WelcomeBagCategory;
  descriptionVi: string;
  descriptionEn: string;
  quantityPerBag: number;
  estimatedCost: number;
  icon: string;
}

export const WELCOME_BAG_TEMPLATES: WelcomeBagTemplate[] = [
  // Essentials
  {
    id: "wb-ess-001",
    nameVi: "Chào mừng khách",
    nameEn: "Welcome note",
    category: "essentials",
    descriptionVi: "Thiệp chào mừng với thông tin liên hệ",
    descriptionEn: "Welcome card with contact info",
    quantityPerBag: 1,
    estimatedCost: 5000,
    icon: "👋"
  },
  {
    id: "wb-ess-002",
    nameVi: "Lịch trình weekend",
    nameEn: "Weekend itinerary",
    category: "essentials",
    descriptionVi: "Lịch trình chi tiết các sự kiện cưới",
    descriptionEn: "Detailed wedding weekend schedule",
    quantityPerBag: 1,
    estimatedCost: 3000,
    icon: "📅"
  },
  {
    id: "wb-ess-003",
    nameVi: "Bản đồ địa phương",
    nameEn: "Local area map",
    category: "essentials",
    descriptionVi: "Bản đồ khu vực với địa điểm quan trọng",
    descriptionEn: "Area map with key locations",
    quantityPerBag: 1,
    estimatedCost: 2000,
    icon: "🗺️"
  },
  {
    id: "wb-ess-004",
    nameVi: "Danh sách khẩn cấp",
    nameEn: "Emergency contacts",
    category: "essentials",
    descriptionVi: "Số điện thoại liên hệ khẩn cấp",
    descriptionEn: "Emergency contact numbers",
    quantityPerBag: 1,
    estimatedCost: 0,
    icon: "📞"
  },
  {
    id: "wb-ess-005",
    nameVi: "Thẻ phòng khách sạn",
    nameEn: "Hotel key card",
    category: "essentials",
    descriptionVi: "Thẻ phòng (nếu cô dâu chú rể đặt)",
    descriptionEn: "Room key (if couple arranged)",
    quantityPerBag: 1,
    estimatedCost: 0,
    icon: "🔑"
  },

  // Snacks
  {
    id: "wb-snk-001",
    nameVi: "Nước uống",
    nameEn: "Bottled water",
    category: "snacks",
    descriptionVi: "Nước suối hoặc nước ngọt",
    descriptionEn: "Mineral water or soft drinks",
    quantityPerBag: 2,
    estimatedCost: 10000,
    icon: "💧"
  },
  {
    id: "wb-snk-002",
    nameVi: "Đồ ăn vặt",
    nameEn: "Local snacks",
    category: "snacks",
    descriptionVi: "Đặc sản địa phương hoặc bánh kẹo",
    descriptionEn: "Local treats or candy",
    quantityPerBag: 3,
    estimatedCost: 30000,
    icon: "🍬"
  },
  {
    id: "wb-snk-003",
    nameVi: "Hạt",
    nameEn: "Nuts",
    category: "snacks",
    descriptionVi: "Hạt điều, hạt dẻ...",
    descriptionEn: "Cashews, chestnuts...",
    quantityPerBag: 1,
    estimatedCost: 25000,
    icon: "🥜"
  },
  {
    id: "wb-snk-004",
    nameVi: "Trái cây sấy",
    nameEn: "Dried fruit",
    category: "snacks",
    descriptionVi: "Mít sấy, chuối sấy...",
    descriptionEn: "Dried jackfruit, banana...",
    quantityPerBag: 1,
    estimatedCost: 20000,
    icon: "🍌"
  },

  // Info
  {
    id: "wb-info-001",
    nameVi: "Thời gian địa điểm",
    nameEn: "Time & location info",
    category: "info",
    descriptionVi: "Chi tiết thời gian và địa điểm các lễ",
    descriptionEn: "Detailed time and location info",
    quantityPerBag: 1,
    estimatedCost: 0,
    icon: "⏰"
  },
  {
    id: "wb-info-002",
    nameVi: "Quy định trang phục",
    nameEn: "Dress code",
    category: "info",
    descriptionVi: "Hướng dẫn trang phục phù hợp",
    descriptionEn: "Appropriate dress guidelines",
    quantityPerBag: 1,
    estimatedCost: 0,
    icon: "👔"
  },
  {
    id: "wb-info-003",
    nameVi: "Địa điểm ăn uống",
    nameEn: "Dining recommendations",
    category: "info",
    descriptionVi: "Gợi ý quán ăn địa phương",
    descriptionEn: "Local restaurant recommendations",
    quantityPerBag: 1,
    estimatedCost: 0,
    icon: "🍽️"
  },
  {
    id: "wb-info-004",
    nameVi: "Địa điểm tham quan",
    nameEn: "Attractions guide",
    category: "info",
    descriptionVi: "Địa điểm tham quan nổi tiếng",
    descriptionEn: "Popular tourist attractions",
    quantityPerBag: 1,
    estimatedCost: 0,
    icon: "🏛️"
  },

  // Personal
  {
    id: "wb-prs-001",
    nameVi: "Khăn ướp",
    nameEn: "Wet wipes",
    category: "personal",
    descriptionVi: "Khăn ướt tiện dụng",
    descriptionEn: "Convenient wet wipes",
    quantityPerBag: 2,
    estimatedCost: 8000,
    icon: "🧻"
  },
  {
    id: "wb-prs-002",
    nameVi: "Kem chống nắng",
    nameEn: "Sunscreen",
    category: "personal",
    descriptionVi: "Kem chống nắng mẫu nhỏ",
    descriptionEn: "Travel-size sunscreen",
    quantityPerBag: 1,
    estimatedCost: 15000,
    icon: "🧴"
  },
  {
    id: "wb-prs-003",
    nameVi: "Thuốc đau đầu",
    nameEn: "Headache relief",
    category: "personal",
    descriptionVi: "Thuốc giảm đau (paracetamol)",
    descriptionEn: "Pain reliever (paracetamol)",
    quantityPerBag: 2,
    estimatedCost: 3000,
    icon: "💊"
  },
  {
    id: "wb-prs-004",
    nameVi: "Băng cá nhân",
    nameEn: "Band-aids",
    category: "personal",
    descriptionVi: "Băng dán cá nhân",
    descriptionEn: "Adhesive bandages",
    quantityPerBag: 3,
    estimatedCost: 5000,
    icon: "🩹"
  },

  // Local
  {
    id: "wb-loc-001",
    nameVi: "Đặc sản địa phương",
    nameEn: "Local specialty",
    category: "local",
    descriptionVi: "Đặc sản nổi tiếng của địa phương",
    descriptionEn: "Famous local specialty",
    quantityPerBag: 1,
    estimatedCost: 40000,
    icon: "🎁"
  },
  {
    id: "wb-loc-002",
    nameVi: "Bản đồ du lịch",
    nameEn: "Tourist map",
    category: "local",
    descriptionVi: "Bản đồ điểm du lịch địa phương",
    descriptionEn: "Local tourist map",
    quantityPerBag: 1,
    estimatedCost: 5000,
    icon: "🗺️"
  },
  {
    id: "wb-loc-003",
    nameVi: "Voucher giảm giá",
    nameEn: "Discount vouchers",
    category: "local",
    descriptionVi: "Voucher giảm giá tại quán ăn địa phương",
    descriptionEn: "Discount vouchers for local restaurants",
    quantityPerBag: 1,
    estimatedCost: 10000,
    icon: "🎫"
  },
];

export const WELCOME_BAG_CATEGORIES = [
  { id: "essentials" as WelcomeBagCategory, labelVi: "Thiết yếu", labelEn: "Essentials", icon: "🎯" },
  { id: "snacks" as WelcomeBagCategory, labelVi: "Đồ ăn", labelEn: "Snacks", icon: "🍿" },
  { id: "info" as WelcomeBagCategory, labelVi: "Thông tin", labelEn: "Info", icon: "ℹ️" },
  { id: "personal" as WelcomeBagCategory, labelVi: "Cá nhân", labelEn: "Personal", icon: "🧼" },
  { id: "local" as WelcomeBagCategory, labelVi: "Địa phương", labelEn: "Local", icon: "🏘️" },
  { id: "other" as WelcomeBagCategory, labelVi: "Khác", labelEn: "Other", icon: "📦" },
];

export function getTotalWelcomeBagTemplates(): number {
  return WELCOME_BAG_TEMPLATES.length;
}

export function getWelcomeBagTemplatesByCategory(categoryId: string): WelcomeBagTemplate[] {
  return WELCOME_BAG_TEMPLATES.filter((t) => t.category === categoryId);
}
