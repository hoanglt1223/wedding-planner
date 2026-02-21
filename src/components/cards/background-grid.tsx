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
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
      {backgrounds.map((bg, i) => (
        <div
          key={i}
          className="relative rounded-lg p-3 text-center"
          style={{ background: bg.bg, fontFamily: bg.f, minHeight: "130px" }}
        >
          {i === 8 && (
            <div
              className="pointer-events-none absolute inset-2 rounded-lg opacity-30"
              style={{ border: `1px solid ${bg.sub}` }}
            />
          )}
          <div
            className="text-[0.6rem] uppercase tracking-widest opacity-80"
            style={{ color: bg.sub }}
          >
            — {eventName} —
          </div>
          <div
            className="my-1.5 text-xl font-bold leading-tight"
            style={{ color: bg.t }}
          >
            {groom}{" "}
            <span className="text-base font-normal opacity-40">&</span>{" "}
            {bride}
          </div>
          <div className="text-[0.75rem]" style={{ color: bg.sub }}>
            📅 {date}
          </div>
          <div
            className="mt-1.5 text-[0.6rem] opacity-50"
            style={{ color: bg.t }}
          >
            {groomFamily} ♥ {brideFamily}
          </div>
        </div>
      ))}
    </div>
  );
}
