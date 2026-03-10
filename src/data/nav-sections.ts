export interface NavSection {
  id: string;
  icon: string;
  labelVi: string;
  labelEn: string;
  type: "page" | "drawer";
  defaultPage?: string;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: "home", icon: "🏠", labelVi: "Trang chủ", labelEn: "Home", type: "page", defaultPage: "home" },
  { id: "planning", icon: "💒", labelVi: "Kế hoạch", labelEn: "Plan", type: "page", defaultPage: "planning" },
  { id: "guests", icon: "👥", labelVi: "Khách mời", labelEn: "Guests", type: "page", defaultPage: "guests" },
  { id: "ai", icon: "🤖", labelVi: "AI", labelEn: "AI", type: "page", defaultPage: "ai" },
  { id: "menu", icon: "☰", labelVi: "Menu", labelEn: "Menu", type: "drawer" },
];

export const PAGE_TO_SECTION: Record<string, string> = {
  home: "home",
  planning: "planning",
  guests: "guests",
  astrology: "menu",
  numerology: "menu",
  lunar: "menu",
  ai: "ai",
  tasks: "menu",
  cards: "menu",
  handbook: "menu",
  website: "menu",
};

export const MENU_ITEMS = [
  { pageId: "website", icon: "🌐", labelVi: "Website", labelEn: "Website" },
  { pageId: "cards", icon: "🖼️", labelVi: "Thiệp", labelEn: "Cards" },
  { pageId: "handbook", icon: "📖", labelVi: "Sổ Tay", labelEn: "Handbook" },
  { pageId: "astrology", icon: "🔮", labelVi: "Tử Vi", labelEn: "Fortune" },
  { pageId: "numerology", icon: "🔢", labelVi: "Thần Số Học", labelEn: "Numerology" },
  { pageId: "lunar", icon: "🌙", labelVi: "Lịch Âm", labelEn: "Lunar Calendar" },
  { pageId: "tasks", icon: "📋", labelVi: "Công Việc", labelEn: "Tasks" },
];
