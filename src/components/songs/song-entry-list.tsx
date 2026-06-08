import { useState } from "react";
import type { SongItem, SongSection, SongPriority } from "@/types/wedding";

type FilterSection = "all" | SongSection;
type FilterPriority = "all" | SongPriority;

interface SongEntryListProps {
  songs: SongItem[];
  search: string;
  filterSection: FilterSection;
  filterPriority: FilterPriority;
  onFilterSectionChange: (f: FilterSection) => void;
  onFilterPriorityChange: (f: FilterPriority) => void;
  onEdit: (song: SongItem) => void;
  onDelete: (id: number) => void;
  onToggleConfirmed: (id: number) => void;
  lang: string;
}

const SECTION_FILTERS: { key: FilterSection; vi: string; en: string; icon: string }[] = [
  { key: "all", vi: "Tất cả", en: "All", icon: "🎵" },
  { key: "ceremony", vi: "Lễ cưới", en: "Ceremony", icon: "💒" },
  { key: "cocktail", vi: "Cocktail", en: "Cocktail", icon: "🥂" },
  { key: "reception", vi: "Tiệc", en: "Reception", icon: "🍽️" },
  { key: "first-dance", vi: "Nhảy đầu", en: "First Dance", icon: "💃" },
  { key: "party", vi: "Vui chơi", en: "Party", icon: "🎉" },
  { key: "other", vi: "Khác", en: "Other", icon: "🎶" },
];

const PRIORITY_FILTERS: { key: FilterPriority; vi: string; en: string }[] = [
  { key: "all", vi: "Tất cả", en: "All" },
  { key: "must-play", vi: "🟢 Phải phát", en: "🟢 Must play" },
  { key: "nice-to-have", vi: "🟡 Nên phát", en: "🟡 Nice to have" },
  { key: "do-not-play", vi: "🔴 Không phát", en: "🔴 Do not play" },
];

const PRIORITY_BADGE: Record<SongPriority, { vi: string; en: string; color: string; bg: string }> = {
  "must-play": { vi: "Phải phát", en: "Must play", color: "#16a34a", bg: "#dcfce7" },
  "nice-to-have": { vi: "Nên phát", en: "Nice to have", color: "#d97706", bg: "#fef3c7" },
  "do-not-play": { vi: "Không phát", en: "Do not play", color: "#dc2626", bg: "#fee2e2" },
};

const SECTION_ICONS: Record<SongSection, string> = {
  ceremony: "💒",
  cocktail: "🥂",
  reception: "🍽️",
  "first-dance": "💃",
  party: "🎉",
  other: "🎶",
};

export function SongEntryList({
  songs, search, filterSection, filterPriority,
  onFilterSectionChange, onFilterPriorityChange,
  onEdit, onDelete, onToggleConfirmed, lang,
}: SongEntryListProps) {
  const en = lang === "en";
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = songs.filter((s) => {
    if (filterSection !== "all" && s.section !== filterSection) return false;
    if (filterPriority !== "all" && s.priority !== filterPriority) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.requestedBy ?? "").toLowerCase().includes(q) ||
        (s.notes ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    // Confirmed go to bottom
    if (a.confirmed !== b.confirmed) return a.confirmed ? 1 : -1;
    // Must-play first
    const priorityOrder = { "must-play": 0, "nice-to-have": 1, "do-not-play": 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.id - a.id; // newest first
  });

  return (
    <div className="space-y-2">
      {/* Section filters */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {SECTION_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterSectionChange(f.key)}
            className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
              filterSection === f.key
                ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)]"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.icon} {en ? f.en : f.vi}
          </button>
        ))}
      </div>

      {/* Priority filters */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {PRIORITY_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterPriorityChange(f.key)}
            className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
              filterPriority === f.key
                ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)]"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {en ? f.en : f.vi}
          </button>
        ))}
      </div>

      {/* List */}
      {sorted.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          {search
            ? (en ? "No results" : "Không tìm thấy")
            : (en ? "No songs yet" : "Chưa có bài hát nào")}
        </div>
      ) : (
        <div className="space-y-1.5">
          {sorted.map((song) => {
            const isExpanded = expandedId === song.id;
            const badge = PRIORITY_BADGE[song.priority];
            return (
              <div
                key={song.id}
                className={`border rounded-lg p-2.5 transition-colors ${
                  song.confirmed ? "bg-blue-50/50 border-blue-200" : "bg-background"
                }`}
              >
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : song.id)}
                >
                  {/* Section icon */}
                  <span className="text-lg shrink-0">{SECTION_ICONS[song.section]}</span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium truncate">{song.title}</span>
                      {song.confirmed && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{song.artist || (en ? "Unknown artist" : "Chưa rõ")}</span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] shrink-0"
                        style={{ color: badge.color, backgroundColor: badge.bg }}
                      >
                        {en ? badge.en : badge.vi}
                      </span>
                    </div>
                  </div>

                  {/* Expand arrow */}
                  <span className={`text-xs text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>

                {/* Expanded actions */}
                {isExpanded && (
                  <div className="mt-2 pt-2 border-t space-y-2">
                    {(song.notes || song.requestedBy) && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        {song.requestedBy && (
                          <p>👤 {en ? "Requested by" : "Đề xuất bởi"}: {song.requestedBy}</p>
                        )}
                        {song.notes && <p>📝 {song.notes}</p>}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onToggleConfirmed(song.id)}
                        className={`text-xs px-2.5 py-1 rounded transition-colors ${
                          song.confirmed
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        {song.confirmed ? (en ? "Unconfirm" : "Bỏ xác nhận") : (en ? "Confirm" : "Xác nhận")}
                      </button>
                      <button
                        onClick={() => onEdit(song)}
                        className="text-xs px-2.5 py-1 rounded bg-muted hover:bg-muted/80"
                      >
                        {en ? "Edit" : "Sửa"}
                      </button>
                      <button
                        onClick={() => onDelete(song.id)}
                        className="text-xs px-2.5 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        {en ? "Delete" : "Xóa"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
