import { useEffect, useState } from "react";
import { Menu, Settings } from "lucide-react";
import { t } from "@/lib/i18n";
import { getCountdown, type CountdownResult } from "@/lib/countdown";
import { createShareLink } from "@/lib/share";
import type { WeddingState } from "@/types/wedding";

interface NavbarProps {
  activePage: string;
  lang?: string;
  weddingDate: string;
  state?: WeddingState;
  isOnline?: boolean;
  onLeftSidebarOpen: () => void;
  onRightSidebarOpen: () => void;
}

export function Navbar({
  activePage,
  lang = "vi",
  weddingDate,
  state,
  isOnline,
  onLeftSidebarOpen,
  onRightSidebarOpen,
}: NavbarProps) {
  const [countdown, setCountdown] = useState<CountdownResult | null>(() =>
    getCountdown(weddingDate)
  );

  useEffect(() => {
    setCountdown(getCountdown(weddingDate));
    const id = setInterval(() => setCountdown(getCountdown(weddingDate)), 60000);
    return () => clearInterval(id);
  }, [weddingDate]);

  const countdownLabel = countdown
    ? countdown.passed
      ? t("Chúc mừng! 🎊", lang)
      : countdown.days > 0
      ? `${countdown.days}d`
      : `${countdown.hours}h`
    : null;

  // Current page label for breadcrumb display
  const PAGE_LABELS: Record<string, string> = {
    home: "Trang Chủ",
    planning: "Kế Hoạch",
    astrology: "Tử Vi",
    cards: "Thiệp",
    ai: "AI",
    handbook: "Sổ Tay",
    tasks: "Công Việc",
    website: "Website",
    guests: "Khách Mời",
  };

  return (
    <header className="h-12 sticky top-0 z-50 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]/95 backdrop-blur-sm flex items-center">
      <div className="w-full px-4 flex items-center gap-3 h-full">
        {/* Mobile: hamburger */}
        <button
          onClick={onLeftSidebarOpen}
          className="md:hidden h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <span
          className="text-sm font-bold shrink-0"
          style={{ color: "var(--theme-primary)" }}
        >
          Wedding Planner
        </span>

        {/* Current page breadcrumb (desktop) */}
        <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>/</span>
          <span className="font-medium text-foreground">
            {t(PAGE_LABELS[activePage] || activePage, lang)}
          </span>
        </div>

        <div className="flex-1" />

        {/* Status badges */}
        {isOnline === false && (
          <span className="offline-badge text-2xs font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
            Offline
          </span>
        )}
        {countdownLabel && (
          <span
            className={`text-2xs font-semibold px-1.5 py-0.5 rounded-full ${
              countdown?.passed
                ? "bg-green-100 text-green-700"
                : "bg-[var(--theme-primary-light)] text-[var(--theme-primary)]"
            }`}
          >
            {countdownLabel}
          </span>
        )}

        {/* Share (desktop) */}
        {state && (
          <div className="hidden md:block">
            <ShareButton state={state} />
          </div>
        )}

        {/* Mobile: settings toggle */}
        <button
          onClick={onRightSidebarOpen}
          className="md:hidden h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function ShareButton({ state }: { state: WeddingState }) {
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      const url = await createShareLink(state);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* share requires server */
    } finally {
      setSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={sharing}
      className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-sm hover:bg-muted transition-colors"
      title={t("Chia sẻ", state.lang)}
    >
      {copied ? "✓" : sharing ? "…" : "↗"}
    </button>
  );
}

export { Navbar as Header };
