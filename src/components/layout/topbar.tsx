import { PAGES } from "@/data/page-definitions";
import { t } from "@/lib/i18n";

interface TopbarProps {
  activePage: string;
  onPageChange: (pageId: string) => void;
  lang?: string;
}

export function Topbar({ activePage, onPageChange, lang }: TopbarProps) {
  const actualLang = lang || "vi";
  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
      <div className="max-w-[920px] mx-auto px-2">
        <div className="flex gap-1 overflow-x-auto py-2 no-scrollbar scrollbar-hide">
          {PAGES.map((page) => (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                page.id === activePage
                  ? "bg-red-700 text-white shadow-sm"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-700"
              }`}
            >
              {t(page.label, actualLang)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
