import { useEffect, useRef, useState } from "react";
import { PAGES } from "@/data/page-definitions";
import { t } from "@/lib/i18n";
import { getCountdown, type CountdownResult } from "@/lib/countdown";
import { RemindersBell } from "./reminders";
import type { CoupleInfo } from "@/types/wedding";

interface NavbarProps {
  activePage: string;
  onPageChange: (pageId: string) => void;
  lang?: string;
  progressPct: number;
  done: number;
  total: number;
  weddingDate: string;
  info: CoupleInfo;
}

export function Navbar({
  activePage,
  onPageChange,
  lang = "vi",
  progressPct,
  done,
  total,
  weddingDate,
  info,
}: NavbarProps) {
  const [countdown, setCountdown] = useState<CountdownResult | null>(() =>
    getCountdown(weddingDate)
  );
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCountdown(getCountdown(weddingDate));
    const id = setInterval(() => setCountdown(getCountdown(weddingDate)), 60000);
    return () => clearInterval(id);
  }, [weddingDate]);

  const updateFades = () => {
    const el = tabsRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 4);
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    updateFades();
    el.addEventListener("scroll", updateFades, { passive: true });
    const ro = new ResizeObserver(updateFades);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateFades);
      ro.disconnect();
    };
  }, []);

  const countdownLabel = countdown
    ? countdown.passed
      ? "Chúc mừng! 🎊"
      : countdown.days > 0
      ? `${countdown.days}d`
      : `${countdown.hours}h`
    : null;

  return (
    <header className="h-12 sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm flex items-center">
      <div className="max-w-[920px] mx-auto px-3 w-full flex items-center gap-2 h-full">
        {/* Title */}
        <span
          className="text-sm font-bold shrink-0 hidden sm:block"
          style={{ color: "var(--theme-primary)" }}
        >
          💒 Wedding
        </span>

        {/* Nav tabs with gradient fade */}
        <div className="relative flex-1 flex items-center overflow-hidden h-full">
          {showLeftFade && (
            <div className="absolute left-0 top-0 h-full w-6 z-10 pointer-events-none bg-gradient-to-r from-white/95 to-transparent" />
          )}
          <div
            ref={tabsRef}
            className="flex items-center gap-0.5 overflow-x-auto h-full scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {PAGES.map((page) => {
              const active = page.id === activePage;
              return (
                <button
                  key={page.id}
                  onClick={() => onPageChange(page.id)}
                  className={`shrink-0 h-full px-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    active
                      ? "border-[var(--theme-primary)] text-[var(--theme-primary)]"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                  }`}
                >
                  {t(page.label, lang)}
                </button>
              );
            })}
          </div>
          {showRightFade && (
            <div className="absolute right-0 top-0 h-full w-6 z-10 pointer-events-none bg-gradient-to-l from-white/95 to-transparent" />
          )}
        </div>

        {/* Progress + countdown */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: "var(--theme-primary)",
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {done}/{total}
            </span>
          </div>
          {countdownLabel && (
            <span
              className={`text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-full ${
                countdown?.passed
                  ? "bg-green-100 text-green-700"
                  : "bg-[var(--theme-primary-light)] text-[var(--theme-primary)]"
              }`}
            >
              {countdownLabel}
            </span>
          )}
        </div>

        {/* Reminders bell */}
        <RemindersBell info={info} />
      </div>
    </header>
  );
}

// Keep Header alias for any remaining references
export { Navbar as Header };
