import { useState } from "react";
import type { BackgroundStyle } from "@/types/wedding";

interface BackgroundGridProps {
  eventName: string;
  date: string;
  groom: string;
  bride: string;
  groomFamily: string;
  brideFamily: string;
  backgrounds: BackgroundStyle[];
}

export function BackgroundGrid({
  eventName,
  date,
  groom,
  bride,
  groomFamily,
  brideFamily,
  backgrounds,
}: BackgroundGridProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? backgrounds : backgrounds.slice(0, 4);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
        {visible.map((bg, i) => (
          <div
            key={i}
            className="relative rounded-lg p-3 text-center"
            style={{ background: bg.background, fontFamily: bg.fontFamily, minHeight: "130px" }}
          >
            {i === 8 && (
              <div
                className="pointer-events-none absolute inset-2 rounded-lg opacity-30"
                style={{ border: `1px solid ${bg.accentColor}` }}
              />
            )}
            <div
              className="text-[0.6rem] uppercase tracking-widest opacity-80"
              style={{ color: bg.accentColor }}
            >
              — {eventName} —
            </div>
            <div
              className="my-1.5 text-xl font-bold leading-tight"
              style={{ color: bg.textColor }}
            >
              {groom}{" "}
              <span className="text-base font-normal opacity-40">&</span>{" "}
              {bride}
            </div>
            <div className="text-[0.75rem]" style={{ color: bg.accentColor }}>
              📅 {date}
            </div>
            <div
              className="mt-1.5 text-[0.6rem] opacity-50"
              style={{ color: bg.textColor }}
            >
              {groomFamily} ♥ {brideFamily}
            </div>
          </div>
        ))}
      </div>
      {backgrounds.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 w-full py-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {expanded ? "Thu gọn ↑" : `Xem thêm ${backgrounds.length - 4} mẫu nữa ↓`}
        </button>
      )}
    </div>
  );
}
