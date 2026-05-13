import { useNavigate } from "@tanstack/react-router";
import { NAV_SECTIONS, PAGE_TO_SECTION } from "@/data/nav-sections";

interface BottomNavProps {
  activePage: string;
  onMenuOpen: () => void;
  lang?: string;
}

export function BottomNav({ activePage, onMenuOpen, lang = "vi" }: BottomNavProps) {
  const navigate = useNavigate();
  const activeSection = PAGE_TO_SECTION[activePage] ?? "menu";

  return (
    <nav
      className="shrink-0 z-40 md:hidden border-t bg-[var(--theme-surface)]/95 backdrop-blur-sm"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch h-16">
        {NAV_SECTIONS.map((section) => {
          const isActive = section.id === activeSection;
          return (
            <button
              key={section.id}
              onClick={() => {
                if (section.type === "drawer") {
                  onMenuOpen();
                } else if (section.defaultPage) {
                  void navigate({ to: `/app/${section.defaultPage}` as never });
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors ${
                isActive
                  ? "text-[var(--theme-primary)] font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <span className="text-lg leading-none">{section.icon}</span>
              <span className="text-2xs leading-tight">
                {lang === "en" ? section.labelEn : section.labelVi}
              </span>
              {isActive && (
                <div
                  className="absolute top-0 h-0.5 w-8 rounded-full"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
