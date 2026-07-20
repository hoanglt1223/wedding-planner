import type { ItineraryItem } from "@/data/wedding-itinerary";
import { calculateEndTime, getCategoryColor, getCategoryLabel } from "@/data/wedding-itinerary";

interface ItineraryTimelineProps {
  items: ItineraryItem[];
  lang?: string;
  onEdit?: (item: ItineraryItem) => void;
  onDelete?: (id: string) => void;
  onReorder?: (itemId: string, direction: "up" | "down") => void;
}

export function ItineraryTimeline({ items, lang = "vi", onEdit, onDelete, onReorder }: ItineraryTimelineProps) {
  const en = lang === "en";
  const sortedItems = [...items].sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (sortedItems.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
          <span className="text-3xl">📋</span>
        </div>
        <h3 className="text-base font-semibold mb-1">{en ? "No itinerary yet" : "Chưa có lịch trình"}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {en ? "Generate a wedding day itinerary to get started" : "Tạo lịch trình ngày cưới để bắt đầu"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedItems.map((item, index) => {
        const endTime = calculateEndTime(item.startTime, item.duration);
        const categoryColor = getCategoryColor(item.category);
        const categoryLabel = getCategoryLabel(item.category, lang);

        return (
          <div
            key={item.id}
            className="relative rounded-xl border-2 border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 hover:border-[var(--theme-primary)]/30 transition-all"
          >
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryColor }}
                />
                {index < sortedItems.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono font-semibold" style={{ color: categoryColor }}>
                        {item.startTime} - {endTime}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {item.duration}min
                      </span>
                      <span className="text-xs">{categoryLabel}</span>
                    </div>
                    <h4 className="font-semibold text-sm mt-1">
                      {en ? item.activityEn : item.activity}
                    </h4>
                    {(en ? item.locationEn : item.location) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        📍 {en ? item.locationEn : item.location}
                      </p>
                    )}
                    {item.responsible && item.responsible.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        👥 {item.responsible.join(", ")}
                      </p>
                    )}
                    {(en ? item.notesEn : item.notes) && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        {en ? item.notesEn : item.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1">
                    {onReorder && index > 0 && (
                      <button
                        onClick={() => onReorder(item.id, "up")}
                        className="text-xs text-muted-foreground hover:text-foreground p-1"
                        title="Move up"
                      >
                        ↑
                      </button>
                    )}
                    {onReorder && index < sortedItems.length - 1 && (
                      <button
                        onClick={() => onReorder(item.id, "down")}
                        className="text-xs text-muted-foreground hover:text-foreground p-1"
                        title="Move down"
                      >
                        ↓
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-xs text-muted-foreground hover:text-foreground p-1"
                        title="✏️"
                      >
                        ✏️
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-xs text-red-400 hover:text-red-600 p-1"
                        title="✕"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {item.isBuffer && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <span>⏱️</span>
                    <span>{en ? "Buffer time" : "Thời gian đệm"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
