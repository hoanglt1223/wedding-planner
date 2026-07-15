// Contract Requirement Templates for Wedding Vendors

import type { ContractRequirementTemplate } from "@/types/contracts";

export const CONTRACT_REQUIREMENTS: ContractRequirementTemplate[] = [
  // === VENUE ===
  {
    id: "venue-datetime",
    category: "venue",
    textVi: "Xác nhận ngày giờ tổ chức tiệc",
    textEn: "Confirm wedding date and time",
    priority: "required"
  },
  {
    id: "venue-capacity",
    category: "venue",
    textVi: "Sức chứa phòng tiệc phù hợp số khách",
    textEn: "Venue capacity matches guest count",
    priority: "required"
  },
  {
    id: "venue-decor",
    category: "venue",
    textVi: "Gói trang trí bàn ghế cơ bản",
    textEn: "Basic table and chair decoration included",
    priority: "required"
  },
  {
    id: "venue-sound",
    category: "venue",
    textVi: "Hệ thống âm thanh và máy chiếu",
    textEn: "Sound system and projector provided",
    priority: "recommended"
  },
  {
    id: "venue-parking",
    category: "venue",
    textVi: "Bãi đậu xe miễn phí cho khách",
    textEn: "Free parking for guests",
    priority: "recommended"
  },
  {
    id: "venue-catering",
    category: "venue",
    textVi: "Cho phép mang đồ ăn/tiệc ngoài",
    textEn: "Outside catering allowed",
    priority: "optional"
  },

  // === PHOTOGRAPHY ===
  {
    id: "photo-hours",
    category: "photography",
    textVi: "Số giờ chụp ảnh cam kết",
    textEn: "Photography hours confirmed",
    priority: "required"
  },
  {
    id: "photo-raw",
    category: "photography",
    textVi: "Gửi toàn bộ file RAW gốc",
    textEn: "All original RAW files provided",
    priority: "required"
  },
  {
    id: "photo-edited",
    category: "photography",
    textVi: "Số lượng ảnh chỉnh sửa cam kết",
    textEn: "Number of edited photos guaranteed",
    priority: "required"
  },
  {
    id: "photo-album",
    category: "photography",
    textVi: "Photo album hoặc photobook",
    textEn: "Photo album or photobook included",
    priority: "recommended"
  },
  {
    id: "photo-video",
    category: "photography",
    textVi: "Quay phim HD hoặc 4K",
    textEn: "HD or 4K videography included",
    priority: "recommended"
  },
  {
    id: "photo-drone",
    category: "photography",
    textVi: "Quay drone (nếu có)",
    textEn: "Drone footage (if applicable)",
    priority: "optional"
  },
  {
    id: "photo-lead-time",
    category: "photography",
    textVi: "Thời gian giao ảnh chỉnh sửa",
    textEn: "Turnaround time for edited photos",
    priority: "recommended"
  },

  // === MAKEUP ===
  {
    id: "makeup-trial",
    category: "makeup",
    textVi: "Test makeup (makeup thử)",
    textEn: "Makeup trial session included",
    priority: "required"
  },
  {
    id: "makeup-bride",
    category: "makeup",
    textVi: "Makeup cô dâu ngày cưới",
    textEn: "Bridal makeup on wedding day",
    priority: "required"
  },
  {
    id: "makeup-groom",
    category: "makeup",
    textVi: "Makeup chú rể (nếu cần)",
    textEn: "Groom makeup (if needed)",
    priority: "recommended"
  },
  {
    id: "makeup-family",
    category: "makeup",
    textVi: "Makeup cho mẹ và phụ nữ",
    textEn: "Makeup for mothers and bridesmaids",
    priority: "recommended"
  },
  {
    id: "makeup-travel",
    category: "makeup",
    textVi: "Phụ phí đi tỉnh (nếu có)",
    textEn: "Travel fee for out-of-town (if any)",
    priority: "optional"
  },

  // === CATERING ===
  {
    id: "catering-menu",
    category: "catering",
    textVi: "Thực đơn cam kết (menu cố định)",
    textEn: "Menu confirmed (fixed menu)",
    priority: "required"
  },
  {
    id: "catering-tasting",
    category: "catering",
    textVi: "Test đồ ăn (food tasting)",
    textEn: "Food tasting session included",
    priority: "recommended"
  },
  {
    id: "catering-dietary",
    category: "catering",
    textVi: "Hỗ trợ ăn chay/dị ứng",
    textEn: "Vegetarian/allergy accommodation",
    priority: "recommended"
  },
  {
    id: "catering-setup",
    category: "catering",
    textVi: "Thời gian bày trí món ăn",
    textEn: "Food setup and service time",
    priority: "required"
  },
  {
    id: "catering-staff",
    category: "catering",
    textVi: "Nhân viên phục vụ bao nhiêu người",
    textEn: "Number of serving staff provided",
    priority: "recommended"
  },
  {
    id: "catering-cleanup",
    category: "catering",
    textVi: "Dọn dẹp sau tiệc",
    textEn: "Post-event cleanup included",
    priority: "recommended"
  },

  // === FLOWERS ===
  {
    id: "flowers-bridal-bouquet",
    category: "flowers",
    textVi: "Bó hoa cô dâu (bridal bouquet)",
    textEn: "Bridal bouquet included",
    priority: "required"
  },
  {
    id: "flowers-boutonnieres",
    category: "flowers",
    textVi: "Hoa cài áo chú rể và gia đình",
    textEn: "Boutonnieres for groom and family",
    priority: "required"
  },
  {
    id: "flowers-table",
    category: "flowers",
    textVi: "Hoa bàn tiệc (bao nhiêu bàn)",
    textEn: "Table flowers (number of tables)",
    priority: "required"
  },
  {
    id: "flowers-backdrop",
    category: "flowers",
    textVi: "Hoa backdrop sân khấu",
    textEn: "Stage backdrop flowers",
    priority: "recommended"
  },
  {
    id: "flowers-gate",
    category: "flowers",
    textVi: "Cổng hoa (gate flowers)",
    textEn: "Wedding gate flowers",
    priority: "recommended"
  },

  // === MC ===
  {
    id: "mc-hours",
    category: "mc",
    textVi: "Số giờ dẫn chương trình",
    textEn: "MC hours confirmed",
    priority: "required"
  },
  {
    id: "mc-program",
    category: "mc",
    textVi: "Kịch bản chương trình chi tiết",
    textEn: "Detailed program script",
    priority: "required"
  },
  {
    id: "mc-music",
    category: "mc",
    textVi: "Âm nhạc và DJ (nếu có)",
    textEn: "Music and DJ (if included)",
    priority: "recommended"
  },
  {
    id: "mc-games",
    category: "mc",
    textVi: "Giải trí và mini-games",
    textEn: "Entertainment and mini-games",
    priority: "optional"
  },

  // === WEDDING RINGS ===
  {
    id: "rings-size",
    category: "jewelry",
    textVi: "Kích thước nhẫn cam kết",
    textEn: "Ring sizes confirmed",
    priority: "required"
  },
  {
    id: "rings-material",
    category: "jewelry",
    textVi: "Chất liệu (vàng, bạch kim, etc.)",
    textEn: "Material (gold, platinum, etc.)",
    priority: "required"
  },
  {
    id: "rings-engraving",
    category: "jewelry",
    textVi: "Khắc tên lên nhẫn",
    textEn: "Name engraving on rings",
    priority: "recommended"
  },
  {
    id: "rings-warranty",
    category: "jewelry",
    textVi: "Bảo hành và bảo dưỡng",
    textEn: "Warranty and maintenance",
    priority: "recommended"
  },

  // === WEDDING DRESS ===
  {
    id: "dress-fitting",
    category: "attire",
    textVi: "Lên mẫu và thử váy (fittings)",
    textEn: "Measurements and dress fittings",
    priority: "required"
  },
  {
    id: "dress-alterations",
    category: "attire",
    textVi: "Sửa váy miễn phí (alterations)",
    textEn: "Free alterations included",
    priority: "recommended"
  },
  {
    id: "dress-preservation",
    category: "attire",
    textVi: "Giặt và bảo quản váy sau cưới",
    textEn: "Post-wedding cleaning and preservation",
    priority: "optional"
  },

  // === TRANSPORTATION ===
  {
    id: "transport-vehicle",
    category: "transportation",
    textVi: "Loại xe và số lượng xe",
    textEn: "Vehicle type and quantity",
    priority: "required"
  },
  {
    id: "transport-route",
    category: "transportation",
    textVi: "Lộ trình đón dàn xe",
    textEn: "Pickup route and schedule",
    priority: "required"
  },
  {
    id: "transport-decor",
    category: "transportation",
    textVi: "Trang trí xe cưới",
    textEn: "Wedding car decoration",
    priority: "recommended"
  },
  {
    id: "transport-driver",
    category: "transportation",
    textVi: "Thông tin tài xế và liên hệ",
    textEn: "Driver contact information",
    priority: "required"
  },

  // === WEDDING CAKE ===
  {
    id: "cake-size",
    category: "cake",
    textVi: "Kích thước bánh (số tầng)",
    textEn: "Cake size (number of tiers)",
    priority: "required"
  },
  {
    id: "cake-flavor",
    category: "cake",
    textVi: "Hương vị và thiết kế",
    textEn: "Flavor and design confirmed",
    priority: "required"
  },
  {
    id: "cake-delivery",
    category: "cake",
    textVi: "Giao hàng và thiết kế tại chỗ",
    textEn: "Delivery and on-site setup",
    priority: "required"
  },
  {
    id: "cake-topper",
    category: "cake",
    textVi: "Topping trang trí (nếu có)",
    textEn: "Cake topper decoration (if any)",
    priority: "optional"
  }
];

export function getContractRequirements(category: string): ContractRequirementTemplate[] {
  return CONTRACT_REQUIREMENTS.filter(req => req.category === category);
}

export function getContractRequirementById(id: string): ContractRequirementTemplate | undefined {
  return CONTRACT_REQUIREMENTS.find(req => req.id === id);
}
