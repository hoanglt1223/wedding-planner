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
  { id: "tools", icon: "🔧", labelVi: "Công cụ", labelEn: "Tools", type: "page", defaultPage: "tools" },
  { id: "menu", icon: "☰", labelVi: "Menu", labelEn: "Menu", type: "drawer" },
];

export const PAGE_TO_SECTION: Record<string, string> = {
  home: "home",
  planning: "planning",
  guests: "guests",
  tools: "tools",
  astrology: "tools",
  ai: "tools",
  tasks: "tools",
  cards: "menu",
  handbook: "menu",
  ideas: "menu",
  website: "menu",
};

export const MENU_ITEMS = [
  { pageId: "website", icon: "🌐", labelVi: "Website", labelEn: "Website" },
  { pageId: "cards", icon: "🖼️", labelVi: "Thiệp", labelEn: "Cards" },
  { pageId: "handbook", icon: "📖", labelVi: "Sổ Tay", labelEn: "Handbook" },
  { pageId: "ideas", icon: "💡", labelVi: "Ý Tưởng", labelEn: "Ideas" },
];
