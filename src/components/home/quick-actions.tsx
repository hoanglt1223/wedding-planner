interface QuickActionsProps {
  onNavigate: (page: string) => void;
  lang?: string;
}

const ACTIONS = [
  { page: "guests", icon: "👥", vi: "Khách mời", en: "Guests" },
  { page: "planning", icon: "💒", vi: "Kế hoạch", en: "Planning" },
  { page: "ai", icon: "🤖", vi: "AI Chat", en: "AI Chat" },
  { page: "website", icon: "🌐", vi: "Website", en: "Website" },
];

export function QuickActions({ onNavigate, lang = "vi" }: QuickActionsProps) {
  const en = lang === "en";
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--theme-primary)" }}>
        {en ? "Quick Actions" : "Truy cập nhanh"}
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.page}
            onClick={() => onNavigate(a.page)}
            className="flex flex-col items-center gap-1 p-3 rounded-xl min-h-[44px] transition-colors hover:bg-[var(--theme-primary-light)]"
            style={{ backgroundColor: "var(--theme-surface)" }}
          >
            <span className="text-xl">{a.icon}</span>
            <span className="text-2xs font-medium">{en ? a.en : a.vi}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
