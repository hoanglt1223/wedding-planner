export interface PageDef {
  id: string;
  label: string;
}

export const PAGES: PageDef[] = [
  { id: "kehoach", label: "💒 Kế Hoạch" },
  { id: "thiep", label: "🖼️ Thiệp" },
  { id: "ai", label: "🤖 AI" },
  { id: "sotay", label: "📖 Sổ Tay" },
  { id: "ytuong", label: "💡 Ý Tưởng" },
];

export const DEFAULT_PAGE = "kehoach";
