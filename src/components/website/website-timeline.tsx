import type { TimelineEntry } from "@/types/wedding";

interface Props {
  entries: TimelineEntry[];
  lang: string;
  primary: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  ceremony: "#b91c1c",
  reception: "#db2777",
  prep: "#1e40af",
  other: "#6b7280",
};

export function WebsiteTimeline({ entries, lang, primary }: Props) {
  if (!entries?.length) return null;

  const sorted = [...entries].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <section className="px-6 py-12 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: primary }}>
        {lang === "en" ? "Wedding Day Timeline" : "Lịch Trình Ngày Cưới"}
      </h2>
      <div className="relative">
        {sorted.map((entry, i) => (
          <div key={entry.id} className="flex gap-4 mb-6 relative">
            {/* Vertical line */}
            {i < sorted.length - 1 && (
              <div className="absolute left-[27px] top-10 w-0.5 h-full bg-gray-200" />
            )}
            {/* Time badge */}
            <div
              className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold text-white z-10"
              style={{ backgroundColor: CATEGORY_COLORS[entry.category] ?? CATEGORY_COLORS.other }}
            >
              {entry.time}
            </div>
            {/* Content */}
            <div className="pt-2 flex-1">
              <p className="font-semibold text-gray-900">{entry.title}</p>
              {entry.location && (
                <p className="text-sm text-gray-500 mt-0.5">📍 {entry.location}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
