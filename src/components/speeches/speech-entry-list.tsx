import type { SpeechEntry, SpeechCategory } from "@/types/wedding";

type FilterCategory = "all" | SpeechCategory;

const CATEGORY_META: Record<SpeechCategory, { vi: string; en: string; icon: string; color: string }> = {
  vow: { vi: "Lời thề", en: "Vow", icon: "💍", color: "bg-rose-50 text-rose-700 border-rose-200" },
  toast: { vi: "Nâng ly", en: "Toast", icon: "🥂", color: "bg-amber-50 text-amber-700 border-amber-200" },
  reading: { vi: "Đọc", en: "Reading", icon: "📖", color: "bg-blue-50 text-blue-700 border-blue-200" },
  prayer: { vi: "Cầu nguyện", en: "Prayer", icon: "🙏", color: "bg-purple-50 text-purple-700 border-purple-200" },
  other: { vi: "Khác", en: "Other", icon: "📝", color: "bg-gray-50 text-gray-600 border-gray-200" },
};

interface SpeechEntryListProps {
  speeches: SpeechEntry[];
  search: string;
  filterCategory: FilterCategory;
  onFilterCategoryChange: (cat: FilterCategory) => void;
  onEdit: (speech: SpeechEntry) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onEnhanceWithAi?: (speech: SpeechEntry) => void;
  lang: string;
}

export function SpeechEntryList({
  speeches, search, filterCategory, onFilterCategoryChange,
  onEdit, onDelete, onToggleFavorite, onEnhanceWithAi, lang,
}: SpeechEntryListProps) {
  const en = lang === "en";

  const filtered = speeches.filter((s) => {
    const matchesCategory = filterCategory === "all" || s.category === filterCategory;
    const q = search.toLowerCase();
    const matchesSearch = !q || s.title.toLowerCase().includes(q) || s.speaker.toLowerCase().includes(q) || s.content.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Sort: favorites first, then by id descending (newest first)
  const sorted = [...filtered].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return b.id - a.id;
  });

  const categories: { key: FilterCategory; label: string }[] = [
    { key: "all", label: en ? "All" : "Tất cả" },
    ...Object.entries(CATEGORY_META).map(([key, meta]) => ({
      key: key as FilterCategory,
      label: en ? meta.en : meta.vi,
    })),
  ];

  return (
    <div className="space-y-3">
      {/* Category filter pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onFilterCategoryChange(cat.key)}
            className={`shrink-0 px-2.5 py-1 text-xs rounded-full border transition-colors ${
              filterCategory === cat.key
                ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] border-[var(--theme-primary)]"
                : "bg-background border-muted-foreground/20"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Speech cards */}
      {sorted.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          {search || filterCategory !== "all"
            ? (en ? "No matching speeches found" : "Không tìm thấy bài phát biểu phù hợp")
            : (en ? "No speeches yet. Add your first one!" : "Chưa có bài phát biểu. Hãy thêm bài đầu tiên!")}
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((speech) => {
            const meta = CATEGORY_META[speech.category];
            return (
              <div
                key={speech.id}
                className="rounded-lg border bg-card p-3 space-y-2"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg shrink-0">{meta.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-sm truncate">{speech.title}</span>
                        <span className={`shrink-0 text-2xs px-1.5 py-0.5 rounded-full border ${meta.color}`}>
                          {en ? meta.en : meta.vi}
                        </span>
                      </div>
                      {speech.speaker && (
                        <p className="text-xs text-muted-foreground truncate">{speech.speaker}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onToggleFavorite(speech.id)}
                      className="text-sm hover:scale-110 transition-transform"
                      title={en ? "Toggle favorite" : "Đánh dấu yêu thích"}
                    >
                      {speech.isFavorite ? "⭐" : "☆"}
                    </button>
                    {onEnhanceWithAi && (
                      <button
                        onClick={() => onEnhanceWithAi(speech)}
                        className="text-xs text-muted-foreground hover:text-foreground px-1.5 py-1"
                        title={en ? "Enhance with AI" : "Cải thiện với AI"}
                      >
                        ✨
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(speech)}
                      className="text-xs text-muted-foreground hover:text-foreground px-1.5 py-1"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(speech.id)}
                      className="text-xs text-muted-foreground hover:text-red-500 px-1.5 py-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Content preview */}
                {speech.content && (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-4">
                    {speech.content}
                  </p>
                )}

                {/* Notes */}
                {speech.notes && (
                  <p className="text-xs text-muted-foreground italic border-t border-dashed pt-1.5 mt-1">
                    💡 {speech.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
