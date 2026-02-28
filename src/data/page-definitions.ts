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
  { id: "cards", label: "🖼️ Thiệp", icon: "🖼️" },
  { id: "ai", label: "🤖 AI", icon: "🤖" },
  { id: "handbook", label: "📖 Sổ Tay", icon: "📖" },
  { id: "tasks", label: "📋 Công Việc", icon: "📋" },
  { id: "website", label: "🌐 Website", icon: "🌐" },
  { id: "guests", label: "👥 Khách Mời", icon: "👥", shortLabel: "Khách mời" },
];

export const DEFAULT_PAGE = "home";
