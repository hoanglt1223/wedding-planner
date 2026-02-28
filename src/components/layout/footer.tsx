import { useState } from "react";
import { ThemePicker } from "./theme-picker";
import { t } from "@/lib/i18n";

interface FooterProps {
  activeTheme: string;
  onSelectTheme: (id: string) => void;
  lang?: string;
}

export function Footer({ activeTheme, onSelectTheme, lang = "vi" }: FooterProps) {
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    if (!confirming) { setConfirming(true); return; }
    localStorage.clear();
    window.location.reload();
  };

  return (
    <footer className="mt-4 mb-20 md:mb-0 border-t border-amber-100">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <p className="text-xs text-muted-foreground">
          Wedding Planner &copy; {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            onBlur={() => setConfirming(false)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              confirming
                ? "bg-destructive text-destructive-foreground"
                : "text-muted-foreground hover:text-destructive"
            }`}
          >
            {confirming ? t("Xác nhận xóa?", lang) : t("Xóa dữ liệu", lang)}
          </button>
          <ThemePicker activeTheme={activeTheme} onSelectTheme={onSelectTheme} />
        </div>
      </div>
    </footer>
  );
}
