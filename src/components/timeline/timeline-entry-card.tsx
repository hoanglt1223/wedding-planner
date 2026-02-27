import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import type { TimelineEntry } from "@/types/wedding";

const CATEGORY_COLORS: Record<TimelineEntry["category"], string> = {
  ceremony: "bg-red-100 text-red-800 border-red-200",
  reception: "bg-blue-100 text-blue-800 border-blue-200",
  prep: "bg-yellow-100 text-yellow-800 border-yellow-200",
  other: "bg-gray-100 text-gray-700 border-gray-200",
};

const CATEGORY_BADGE: Record<TimelineEntry["category"], string> = {
  ceremony: "bg-red-500 text-white",
  reception: "bg-blue-500 text-white",
  prep: "bg-yellow-500 text-white",
  other: "bg-gray-400 text-white",
};

interface TimelineEntryCardProps {
  entry: TimelineEntry;
  lang: string;
  onEdit: (entry: TimelineEntry) => void;
  onDelete: (id: number) => void;
}

function getCategoryLabel(category: TimelineEntry["category"], lang: string): string {
  const map: Record<TimelineEntry["category"], string> = {
    ceremony: t("Nghi lễ", lang),
    reception: t("Tiệc", lang),
    prep: t("Chuẩn bị", lang),
    other: t("Khác", lang),
  };
  return map[category];
}

export function TimelineEntryCard({ entry, lang, onEdit, onDelete }: TimelineEntryCardProps) {
  const handleDelete = () => {
    const msg = lang === "en"
      ? "Delete this timeline entry?"
      : "Xóa mục lịch trình này?";
    if (window.confirm(msg)) onDelete(entry.id);
  };

  return (
    <div className={`rounded-lg border p-3 flex gap-3 items-start ${CATEGORY_COLORS[entry.category]}`}>
      <div className="flex flex-col items-center gap-1 min-w-[56px]">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${CATEGORY_BADGE[entry.category]}`}>
          {entry.time}
        </span>
        <span className="text-[10px] opacity-70">{getCategoryLabel(entry.category, lang)}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm leading-tight">{entry.title}</p>
        {entry.location && (
          <p className="text-xs opacity-75 mt-0.5">📍 {entry.location}</p>
        )}
        {entry.responsible && (
          <p className="text-xs opacity-75">👤 {entry.responsible}</p>
        )}
        {entry.notes && (
          <p className="text-xs opacity-60 italic mt-0.5 truncate">{entry.notes}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => onEdit(entry)}
        >
          ✏️
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-destructive hover:text-destructive"
          onClick={handleDelete}
        >
          🗑️
        </Button>
      </div>
    </div>
  );
}
