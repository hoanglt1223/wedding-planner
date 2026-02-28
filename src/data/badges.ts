export interface BadgeDefinition {
  id: string;
  icon: string;
  name: string;
  description: string;
}

export const BADGES: BadgeDefinition[] = [
  { id: "date-set", icon: "📅", name: "Đặt Ngày", description: "Đã chọn ngày cưới" },
  { id: "guest-list", icon: "👥", name: "Danh Sách Khách", description: "Thêm 10+ khách mời" },
  { id: "budget-set", icon: "💰", name: "Ngân Sách", description: "Thiết lập ngân sách" },
  { id: "first-gift", icon: "🎁", name: "Phong Bì", description: "Ghi nhận phong bì đầu tiên" },
  { id: "website-live", icon: "🌐", name: "Trang Web", description: "Xuất bản website cưới" },
  { id: "countdown-100", icon: "💯", name: "100 Ngày", description: "Còn 100 ngày đến đám cưới" },
  { id: "complete", icon: "🏆", name: "Hoàn Thành", description: "Hoàn thành tất cả checklist" },
];
