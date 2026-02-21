import { ThemePicker } from "./theme-picker";
import { getLangLabel } from "@/lib/i18n";

interface FooterProps {
  activeTheme: string;
  onSelectTheme: (id: string) => void;
  lang?: string;
  onSetLang?: (lang: string) => void;
}

export function Footer({ activeTheme, onSelectTheme, lang, onSetLang }: FooterProps) {
  return (
    <footer className="mt-4 border-t border-amber-100">
      <div className="container mx-auto flex h-12 items-center justify-between px-4">
        <p className="text-xs text-muted-foreground">
          Wedding Planner &copy; {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-3">
          {onSetLang && (
            <button
              onClick={() => onSetLang(lang === "vi" ? "en" : "vi")}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {getLangLabel(lang || "vi")}
            </button>
          )}
          <ThemePicker activeTheme={activeTheme} onSelectTheme={onSelectTheme} />
        </div>
      </div>
    </footer>
  );
}
