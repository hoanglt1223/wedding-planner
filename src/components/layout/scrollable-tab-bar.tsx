import { useRef, useState, useEffect, useCallback } from "react";

interface Tab {
  label: string;
  suffix?: string;
}

interface ScrollableTabBarProps {
  tabs: Tab[];
  activeIndex: number;
  onTabChange: (index: number) => void;
  variant?: "pill" | "box";
}

export function ScrollableTabBar({
  tabs,
  activeIndex,
  onTabChange,
  variant = "box",
}: ScrollableTabBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkOverflow = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkOverflow();
    el.addEventListener("scroll", checkOverflow, { passive: true });
    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkOverflow);
      ro.disconnect();
    };
  }, [checkOverflow, tabs.length]);

  // Scroll active tab into view on mount / tab change
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const btn = el.children[activeIndex] as HTMLElement | undefined;
    if (btn) {
      btn.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }
  }, [activeIndex]);

  const isPill = variant === "pill";

  const activeClass = isPill
    ? "bg-white shadow-sm text-foreground font-semibold"
    : "bg-primary text-primary-foreground border-primary";
  const inactiveClass = isPill
    ? "text-muted-foreground hover:text-foreground hover:bg-muted"
    : "bg-[var(--theme-surface)] border-[var(--theme-border)] hover:border-primary/50";
  const baseClass = isPill
    ? "flex-shrink-0 snap-start px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap"
    : "shrink-0 snap-start px-3 py-2 rounded-lg border-2 text-xs font-semibold transition-colors whitespace-nowrap";

  const scrollContainer = (
    <div
      ref={scrollRef}
      className={`flex gap-1 overflow-x-auto no-scrollbar scrollbar-hide ${isPill ? "snap-x snap-mandatory p-1" : "pb-2 mb-2"}`}
    >
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => onTabChange(i)}
          className={`${baseClass} ${i === activeIndex ? activeClass : inactiveClass}`}
        >
          {tab.label}
          {tab.suffix && (
            <span className="ml-1 text-2xs opacity-70">{tab.suffix}</span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative">
      {isPill ? (
        <div className="bg-muted/50 rounded-lg">
          {scrollContainer}
          {showLeft && (
            <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent rounded-l-lg" />
          )}
          {showRight && (
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent rounded-r-lg" />
          )}
        </div>
      ) : (
        <>
          {scrollContainer}
          {showLeft && (
            <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent" />
          )}
          {showRight && (
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
          )}
        </>
      )}
    </div>
  );
}
