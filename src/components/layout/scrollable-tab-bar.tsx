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

  const checkArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkArrows();
    el.addEventListener("scroll", checkArrows, { passive: true });
    const ro = new ResizeObserver(checkArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkArrows);
      ro.disconnect();
    };
  }, [checkArrows, tabs.length]);

  // Scroll active tab into view on mount / tab change
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const btn = el.children[activeIndex] as HTMLElement | undefined;
    if (btn) {
      btn.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }
  }, [activeIndex]);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 160, behavior: "smooth" });
  };

  const isPill = variant === "pill";

  const activeClass = isPill
    ? "bg-red-700 text-white"
    : "bg-red-700 text-white border-red-700";
  const inactiveClass = isPill
    ? "bg-white text-gray-600 hover:bg-red-50 shadow-sm"
    : "bg-white border-amber-200 hover:border-red-300";
  const baseClass = isPill
    ? "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap"
    : "shrink-0 px-3 py-2 rounded-lg border-2 text-xs font-semibold transition-colors whitespace-nowrap";

  return (
    <div className="relative flex items-center">
      {/* Left arrow */}
      {showLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-500 hover:text-red-700 hover:bg-white transition-colors -ml-1"
          aria-label="Scroll left"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      )}

      <div
        ref={scrollRef}
        className={`flex gap-1${isPill ? ".5" : ""} overflow-x-auto pb-1 ${isPill ? "" : "pb-2 mb-2"} no-scrollbar scrollbar-hide flex-1 ${showLeft ? "ml-6" : ""} ${showRight ? "mr-6" : ""}`}
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => onTabChange(i)}
            className={`${baseClass} ${i === activeIndex ? activeClass : inactiveClass}`}
          >
            {tab.label}
            {tab.suffix && (
              <span className="ml-1 text-[0.6rem] opacity-70">{tab.suffix}</span>
            )}
          </button>
        ))}
      </div>

      {/* Right arrow */}
      {showRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-500 hover:text-red-700 hover:bg-white transition-colors -mr-1"
          aria-label="Scroll right"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}
    </div>
  );
}
