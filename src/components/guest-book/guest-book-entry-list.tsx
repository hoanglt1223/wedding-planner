import type { GuestBookEntry, GuestBookMood } from "@/types/wedding";
import { GuestBookEntryCard } from "./guest-book-entry-card";

interface GuestBookEntryListProps {
  entries: GuestBookEntry[];
  search: string;
  filter: GuestBookMood | "all" | "favorites";
  lang: string;
  onFilterChange: (filter: GuestBookMood | "all" | "favorites") => void;
  onEdit: (entry: GuestBookEntry) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

const FILTER_OPTIONS: { key: GuestBookMood | "all" | "favorites"; icon: string; vi: string; en: string }[] = [
  { key: "all", icon: "📋", vi: "Tất cả", en: "All" },
  { key: "favorites", icon: "⭐", vi: "Yêu thích", en: "Favorites" },
  { key: "love", icon: "❤️", vi: "Yêu thương", en: "Love" },
  { key: "joy", icon: "🎉", vi: "Vui vẻ", en: "Joy" },
  { key: "wisdom", icon: "💎", vi: "Khôn ngoan", en: "Wisdom" },
  { key: "funny", icon: "😄", vi: "Hài hước", en: "Funny" },
  { key: "other", icon: "✨", vi: "Khác", en: "Other" },
];

export function GuestBookEntryList({
  entries,
  search,
  filter,
  lang,
  onFilterChange,
  onEdit,
  onDelete,
  onToggleFavorite,
}: GuestBookEntryListProps) {
  const en = lang === "en";

  // Filter entries
  const filtered = entries.filter((entry) => {
    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const matchesSearch =
        entry.guestName.toLowerCase().includes(q) ||
        entry.message.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Mood/favorite filter
    if (filter === "favorites") return entry.isFavorite;
    if (filter !== "all") return entry.mood === filter;
    return true;
  });

  // Sort: favorites first, then by date (newest first)
  const sorted = [...filtered].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-3">
      {/* Filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onFilterChange(opt.key)}
            className={`px-2.5 py-1 text-xs rounded-full border whitespace-nowrap transition-colors ${
              filter === opt.key
                ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] border-[var(--theme-primary)]"
                : "bg-background border-muted-foreground/20 hover:bg-muted"
            }`}
          >
            {opt.icon} {en ? opt.en : opt.vi}
          </button>
        ))}
      </div>

      {/* Entry list */}
      {sorted.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-3xl mb-2">📝</p>
          <p className="text-sm">
            {search || filter !== "all"
              ? en ? "No messages match your filter" : "Không có lời chúc phù hợp"
              : en ? "No messages yet. Be the first to write!" : "Chưa có lời chúc nào. Hãy là người đầu tiên!"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((entry) => (
            <GuestBookEntryCard
              key={entry.id}
              entry={entry}
              lang={lang}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Count */}
      {sorted.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {en ? `${sorted.length} message${sorted.length !== 1 ? "s" : ""}` : `${sorted.length} lời chúc`}
        </p>
      )}
    </div>
  );
}
