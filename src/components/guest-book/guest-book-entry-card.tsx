import type { GuestBookEntry, GuestBookMood } from "@/types/wedding";

interface GuestBookEntryCardProps {
  entry: GuestBookEntry;
  lang: string;
  onEdit: (entry: GuestBookEntry) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

const MOOD_ICONS: Record<GuestBookMood, string> = {
  love: "❤️",
  joy: "🎉",
  wisdom: "💎",
  funny: "😄",
  other: "✨",
};

const MOOD_LABELS: Record<GuestBookMood, { vi: string; en: string }> = {
  love: { vi: "Yêu thương", en: "Love" },
  joy: { vi: "Vui vẻ", en: "Joy" },
  wisdom: { vi: "Khôn ngoan", en: "Wisdom" },
  funny: { vi: "Hài hước", en: "Funny" },
  other: { vi: "Khác", en: "Other" },
};

export function GuestBookEntryCard({ entry, lang, onEdit, onDelete, onToggleFavorite }: GuestBookEntryCardProps) {
  const en = lang === "en";
  const moodIcon = MOOD_ICONS[entry.mood] || "✨";
  const moodLabel = MOOD_LABELS[entry.mood]?.[lang === "en" ? "en" : "vi"] || "";

  const formattedDate = new Date(entry.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border rounded-lg p-3 bg-card hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium truncate">{entry.guestName}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {moodIcon} {moodLabel}
            </span>
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap break-words">{entry.message}</p>
          <p className="text-xs text-muted-foreground mt-2">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggleFavorite(entry.id)}
            className={`p-1 rounded hover:bg-muted transition-colors ${
              entry.isFavorite ? "text-yellow-500" : "text-muted-foreground"
            }`}
            title={en ? "Toggle favorite" : "Đánh dấu yêu thích"}
          >
            {entry.isFavorite ? "⭐" : "☆"}
          </button>
          <button
            onClick={() => onEdit(entry)}
            className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
            title={en ? "Edit" : "Sửa"}
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
            title={en ? "Delete" : "Xóa"}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
