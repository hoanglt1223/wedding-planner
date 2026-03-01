import { useState } from "react";
import { t } from "@/lib/i18n";

interface FooterProps {
  lang?: string;
}

export function Footer({ lang = "vi" }: FooterProps) {
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    if (!confirming) { setConfirming(true); return; }
    localStorage.clear();
    window.location.reload();
  };

  return (
    <footer className="mt-4 border-t border-[var(--theme-border)]">
      <div className="w-full flex h-12 items-center justify-between px-4">
        <p className="text-xs text-muted-foreground">
          Wedding Planner &copy; {new Date().getFullYear()}
        </p>
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
      </div>
    </footer>
  );
}
