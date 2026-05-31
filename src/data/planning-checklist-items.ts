// Wedding planning checklist items organized by time periods
// Each period is identified by a slug and has a label in vi/en
// Items within each period have unique IDs for persistence

export interface ChecklistPeriod {
  id: string;
  labelVi: string;
  labelEn: string;
  icon: string;
  /** Number of days before wedding — items appear when daysRemaining <= this value */
  daysBefore: number;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  textVi: string;
  textEn: string;
  icon: string;
  category: "planning" | "budget" | "guests" | "tradition" | "logistics" | "beauty" | "general";
}

export const PLANNING_CHECKLIST_PERIODS: ChecklistPeriod[] = [
  {
    id: "p-12m",
    labelVi: "12+ tháng trước",
    labelEn: "12+ months before",
    icon: "📅",
    daysBefore: 365,
    items: [
      { id: "12m-1", textVi: "Thống nhất ngân sách tổng thể", textEn: "Agree on total budget", icon: "💰", category: "budget" },
      { id: "12m-2", textVi: "Chốt ngày cưới", textEn: "Set wedding date", icon: "📅", category: "planning" },
      { id: "12m-3", textVi: "Bàn với hai bên gia đình về ngày và địa điểm", textEn: "Discuss date and venue with both families", icon: "👨‍👩‍👧‍👦", category: "planning" },
      { id: "12m-4", textVi: "Khảo sát nhà hàng / địa điểm tiệc", textEn: "Research venues / restaurants", icon: "🏛️", category: "logistics" },
      { id: "12m-5", textVi: "Lập danh sách khách mời sơ bộ", textEn: "Create preliminary guest list", icon: "👥", category: "guests" },
      { id: "12m-6", textVi: "Bắt đầu tìm hiểu nhiếp ảnh gia / videographer", textEn: "Start researching photographers / videographers", icon: "📸", category: "logistics" },
    ],
  },
  {
    id: "p-9m",
    labelVi: "9-12 tháng trước",
    labelEn: "9–12 months before",
    icon: "🗓️",
    daysBefore: 270,
    items: [
      { id: "9m-1", textVi: "Đặt cọc nhà hàng / địa điểm tiệc", textEn: "Book venue / restaurant deposit", icon: "🏛️", category: "budget" },
      { id: "9m-2", textVi: "Chốt nhiếp ảnh gia và videographer", textEn: "Confirm photographer and videographer", icon: "📸", category: "logistics" },
      { id: "9m-3", textVi: "Lên kế hoạch tuần trăng mật", textEn: "Plan honeymoon", icon: "✈️", category: "planning" },
      { id: "9m-4", textVi: "Chọn wedding planner (nếu cần)", textEn: "Choose wedding planner (if needed)", icon: "📋", category: "planning" },
      { id: "9m-5", textVi: "Mở tài khoản tiết kiệm chi phí cưới", textEn: "Open wedding savings account", icon: "🏦", category: "budget" },
    ],
  },
  {
    id: "p-6m",
    labelVi: "6-9 tháng trước",
    labelEn: "6–9 months before",
    icon: "📋",
    daysBefore: 180,
    items: [
      { id: "6m-1", textVi: "Chọn và đặt MC", textEn: "Choose and book MC", icon: "🎤", category: "logistics" },
      { id: "6m-2", textVi: "Chọn ban nhạc / DJ", textEn: "Choose band / DJ", icon: "🎵", category: "logistics" },
      { id: "6m-3", textVi: "Đặt xe hoa", textEn: "Book wedding car", icon: "🚗", category: "logistics" },
      { id: "6m-4", textVi: "Thử váy cưới / áo dài cô dâu", textEn: "Try wedding dress / traditional ao dai", icon: "👗", category: "beauty" },
      { id: "6m-5", textVi: "Chọn váy cưới phù dâu", textEn: "Choose bridesmaid dresses", icon: "👗", category: "beauty" },
      { id: "6m-6", textVi: "Đặt trang trí tiệc (hoa, cổng hoa, backdrop)", textEn: "Book decoration (flowers, arch, backdrop)", icon: "🌸", category: "logistics" },
      { id: "6m-7", textVi: "Bắt đầu chuẩn bị thiệp mời", textEn: "Start preparing invitations", icon: "💌", category: "guests" },
    ],
  },
  {
    id: "p-3m",
    labelVi: "3-6 tháng trước",
    labelEn: "3–6 months before",
    icon: "⏰",
    daysBefore: 90,
    items: [
      { id: "3m-1", textVi: "Chốt menu tiệc cưới", textEn: "Finalize wedding menu", icon: "🍽️", category: "logistics" },
      { id: "3m-2", textVi: "Thử makeup và làm tóc cô dâu", textEn: "Trial makeup and hair styling", icon: "💄", category: "beauty" },
      { id: "3m-3", textVi: "Đặt bánh cưới", textEn: "Order wedding cake", icon: "🍰", category: "logistics" },
      { id: "3m-4", textVi: "Xác nhận danh sách khách mời cuối cùng", textEn: "Finalize guest list", icon: "👥", category: "guests" },
      { id: "3m-5", textVi: "Gửi thiệp mời", textEn: "Send out invitations", icon: "💌", category: "guests" },
      { id: "3m-6", textVi: "Lên sơ đồ bàn tiệc (seating chart)", textEn: "Create seating chart", icon: "🪑", category: "logistics" },
      { id: "3m-7", textVi: "Chuẩn bị lễ vật đám hỏi", textEn: "Prepare betrothal gifts", icon: "🎁", category: "tradition" },
      { id: "3m-8", textVi: "Đặt thời trang chú rể (vest/áo dài)", textEn: "Order groom attire (vest / ao dai)", icon: "🤵", category: "beauty" },
    ],
  },
  {
    id: "p-1m",
    labelVi: "1-3 tháng trước",
    labelEn: "1–3 months before",
    icon: "🔔",
    daysBefore: 30,
    items: [
      { id: "1m-1", textVi: "Xác nhận lại tất cả vendor", textEn: "Confirm all vendors", icon: "✅", category: "logistics" },
      { id: "1m-2", textVi: "Thử lại váy cưới và chỉnh sửa nếu cần", textEn: "Final dress fitting and alterations", icon: "👗", category: "beauty" },
      { id: "1m-3", textVi: "Viết lời phát biểu cho hai bên gia đình", textEn: "Write speeches for both families", icon: "📝", category: "tradition" },
      { id: "1m-4", textVi: "Chuẩn bị quà tặng khách dự tiệc (door gift)", textEn: "Prepare door gifts for guests", icon: "🎀", category: "tradition" },
      { id: "1m-5", textVi: "Đặt phòng khách sạn cho khách xa", textEn: "Book hotel rooms for out-of-town guests", icon: "🏨", category: "logistics" },
      { id: "1m-6", textVi: "Thuê pháo hoa (xin phép địa phương nếu cần)", textEn: "Book fireworks (get permit if needed)", icon: "🎆", category: "logistics" },
      { id: "1m-7", textVi: "Lên lịch trình chi tiết ngày cưới", textEn: "Create detailed wedding-day timeline", icon: "⏱️", category: "planning" },
      { id: "1m-8", textVi: "Bố trí người đón khách, ghi sổ phong bì", textEn: "Assign reception duties (greeters, gift table)", icon: "📋", category: "guests" },
    ],
  },
  {
    id: "p-2w",
    labelVi: "1-2 tuần trước",
    labelEn: "1–2 weeks before",
    icon: "⏳",
    daysBefore: 14,
    items: [
      { id: "2w-1", textVi: "Gửi tin nhắn xác nhận khách mời", textEn: "Send RSVP confirmation messages", icon: "📱", category: "guests" },
      { id: "2w-2", textVi: "Xác nhận số lượng khách với nhà hàng", textEn: "Confirm guest count with venue", icon: "🏛️", category: "logistics" },
      { id: "2w-3", textVi: "Phân công vai trò cho ngày cưới (hoa, xe, nhạc…)", textEn: "Assign day-of roles (flowers, car, music…)", icon: "📋", category: "planning" },
      { id: "2w-4", textVi: "Kiểm tra mic, âm thanh với nhà hàng/MC", textEn: "Test mic and sound system", icon: "🎤", category: "logistics" },
      { id: "2w-5", textVi: "Kiểm tra nhẫn cưới", textEn: "Check wedding rings", icon: "💍", category: "general" },
      { id: "2w-6", textVi: "Chuẩn bị phong bì lì xì cho gia đình hai bên", textEn: "Prepare red envelopes for both families", icon: "🧧", category: "tradition" },
    ],
  },
  {
    id: "p-1w",
    labelVi: "1 tuần trước",
    labelEn: "1 week before",
    icon: "🚨",
    daysBefore: 7,
    items: [
      { id: "1w-1", textVi: "Tổng duyệt toàn bộ với wedding planner / MC", textEn: "Final walkthrough with planner / MC", icon: "📋", category: "planning" },
      { id: "1w-2", textVi: "Chuẩn bị emergency kit (kim chỉ, băng keo, bông tẩy…)", textEn: "Prepare emergency kit (pins, tape, stain remover…)", icon: "🎒", category: "general" },
      { id: "1w-3", textVi: "Thu xếp hành lý tuần trăng mật", textEn: "Pack honeymoon luggage", icon: "🧳", category: "general" },
      { id: "1w-4", textVi: "Đistribute danh sách liên hệ & sơ đồ cho người hỗ trợ", textEn: "Share contact list & layout with helpers", icon: "📱", category: "planning" },
      { id: "1w-5", textVi: "Chuẩn bị trang trí nhà cho đám rước dâu", textEn: "Prepare home decoration for procession", icon: "🏠", category: "tradition" },
      { id: "1w-6", textVi: "Thử makeup lần cuối", textEn: "Final makeup trial", icon: "💄", category: "beauty" },
    ],
  },
  {
    id: "p-day",
    labelVi: "Ngày cưới",
    labelEn: "Wedding day",
    icon: "💒",
    daysBefore: 1,
    items: [
      { id: "day-1", textVi: "Sáng sớm: Kiểm tra trang trí, hoa tươi", textEn: "Early AM: Check decoration and fresh flowers", icon: "🌸", category: "logistics" },
      { id: "day-2", textVi: "Ăn nhẹ, uống nước — giữ năng lượng!", textEn: "Eat light, stay hydrated — keep your energy!", icon: "🥤", category: "general" },
      { id: "day-3", textVi: "Makeup & làm tóc theo lịch trình", textEn: "Makeup & hair on schedule", icon: "💄", category: "beauty" },
      { id: "day-4", textVi: "Chụp ảnh trước giờ lễ", textEn: "Pre-ceremony photoshoot", icon: "📸", category: "logistics" },
      { id: "day-5", textVi: "Thưởng thức khoảnh khắc — mọi thứ đã sẵn sàng!", textEn: "Enjoy the moment — everything is ready!", icon: "💕", category: "general" },
    ],
  },
  {
    id: "p-post",
    labelVi: "Sau ngày cưới",
    labelEn: "After the wedding",
    icon: "🎉",
    daysBefore: 0,
    items: [
      { id: "post-1", textVi: "Gửi thiệp cảm ơn khách mời", textEn: "Send thank-you notes to guests", icon: "💝", category: "guests" },
      { id: "post-2", textVi: "Tổng kết chi phí cưới", textEn: "Finalize wedding expenses", icon: "📊", category: "budget" },
      { id: "post-3", textVi: "Chọn và chỉnh sửa ảnh cưới", textEn: "Select and edit wedding photos", icon: "📸", category: "general" },
      { id: "post-4", textVi: "Giữ hợp đồng, hóa đơn để lưu trữ", textEn: "Keep contracts and receipts for records", icon: "📁", category: "budget" },
    ],
  },
];

/** Get total number of checklist items across all periods */
export function getTotalChecklistItems(): number {
  return PLANNING_CHECKLIST_PERIODS.reduce((sum, p) => sum + p.items.length, 0);
}
