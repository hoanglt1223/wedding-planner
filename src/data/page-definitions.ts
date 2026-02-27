export interface PageDef {
  id: string;
  label: string;
}

export const PAGES: PageDef[] = [
  { id: "planning", label: "💒 Kế Hoạch" },
  { id: "astrology", label: "🔮 Tử Vi" },
  { id: "cards", label: "🖼️ Thiệp" },
  { id: "ai", label: "🤖 AI" },
  { id: "handbook", label: "📖 Sổ Tay" },
  { id: "ideas", label: "💡 Ý Tưởng" },
  { id: "tasks", label: "📋 Công Việc" },
  { id: "website", label: "🌐 Website" },
];

export const DEFAULT_PAGE = "planning";
