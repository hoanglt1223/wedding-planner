export interface PageDef {
  id: string;
  label: string;
  icon?: string;
  shortLabel?: string;
}

export const PAGES: PageDef[] = [
  { id: "home", label: "🏠 Trang Chủ", icon: "🏠", shortLabel: "Trang chủ" },
  { id: "planning", label: "💒 Kế Hoạch", icon: "💒", shortLabel: "Kế hoạch" },
  { id: "astrology", label: "🔮 Tử Vi", icon: "🔮" },
  { id: "numerology", label: "🔢 Thần Số Học", icon: "🔢" },
  { id: "lunar", label: "🌙 Lịch Âm", icon: "🌙" },
  { id: "cards", label: "🖼️ Thiệp", icon: "🖼️" },
  { id: "ai", label: "🤖 AI", icon: "🤖" },
  { id: "handbook", label: "📖 Sổ Tay", icon: "📖" },
  { id: "tasks", label: "📋 Công Việc", icon: "📋" },
  { id: "website", label: "🌐 Website", icon: "🌐" },
  { id: "guests", label: "👥 Khách Mời", icon: "👥", shortLabel: "Khách mời" },
  { id: "checklist", label: "📋 Lịch Trình", icon: "📋", shortLabel: "Lịch trình" },
  { id: "gifts", label: "🎁 Phong Bì", icon: "🎁", shortLabel: "Phong bì" },
  { id: "seating", label: "🪑 Sơ Đồ Chỗ Ngồi", icon: "🪑", shortLabel: "Chỗ ngồi" },
  { id: "songs", label: "🎵 Danh Sách Nhạc", icon: "🎵", shortLabel: "Nhạc" },
  { id: "speeches", label: "✍️ Lời Thề & Diễn Văn", icon: "✍️", shortLabel: "Lời thề" },
];

export const DEFAULT_PAGE = "home";
