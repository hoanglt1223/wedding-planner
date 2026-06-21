import type { MoodBoardItem, MoodBoardCategory } from "@/types/wedding";

const CATEGORY_COLORS: Record<MoodBoardCategory, { bg: string; text: string }> = {
  decor: { bg: "bg-pink-100", text: "text-pink-700" },
  flowers: { bg: "bg-rose-100", text: "text-rose-700" },
  attire: { bg: "bg-purple-100", text: "text-purple-700" },
  cake: { bg: "bg-amber-100", text: "text-amber-700" },
  food: { bg: "bg-orange-100", text: "text-orange-700" },
  venue: { bg: "bg-blue-100", text: "text-blue-700" },
  photography: { bg: "bg-cyan-100", text: "text-cyan-700" },
  other: { bg: "bg-gray-100", text: "text-gray-700" },
};

const CATEGORY_LABELS: Record<MoodBoardCategory, { vi: string; en: string }> = {
  decor: { vi: "Trang trí", en: "Decor" },
  flowers: { vi: "Hoa", en: "Flowers" },
  attire: { vi: "Trang phục", en: "Attire" },
  cake: { vi: "Bánh", en: "Cake" },
  food: { vi: "Ẩm thực", en: "Food" },
  venue: { vi: "Địa điểm", en: "Venue" },
  photography: { vi: "Nhiếp ảnh", en: "Photography" },
  other: { vi: "Khác", en: "Other" },
};

interface MoodBoardGridProps {
  items: MoodBoardItem[];
  lang?: string;
  onEdit: (item: MoodBoardItem) => void;
  onRemove: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export function MoodBoardGrid({
  items,
  lang = "vi",
  onEdit,
  onRemove,
  onToggleFavorite,
}: MoodBoardGridProps) {
  const en = lang === "en";

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
          <span className="text-4xl">🎨</span>
        </div>
        <h3 className="text-base font-semibold mb-1">
          {en ? "Start Your Mood Board" : "Bắt đầu bảng cảm hứng"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {en
            ? "Collect images and ideas that inspire your dream wedding"
            : "Thu thập hình ảnh và ý tưởng cho đám cưới trong mơ của bạn"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item) => {
        const catColors = CATEGORY_COLORS[item.category];
        const catLabel = CATEGORY_LABELS[item.category];

        return (
          <div
            key={item.id}
            className="group relative rounded-xl overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                  🖼️
                </div>
              )}

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => onEdit(item)}
                  className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm hover:bg-white transition-colors"
                  title={en ? "Edit" : "Chỉnh sửa"}
                >
                  ✏️
                </button>
                <button
                  onClick={() => onRemove(item.id)}
                  className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm hover:bg-white transition-colors"
                  title={en ? "Delete" : "Xóa"}
                >
                  🗑️
                </button>
              </div>

              {/* Favorite button */}
              <button
                onClick={() => onToggleFavorite(item.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-sm hover:bg-white transition-colors"
              >
                {item.isFavorite ? "❤️" : "🤍"}
              </button>
            </div>

            {/* Info */}
            <div className="p-2.5">
              <h4 className="text-sm font-medium truncate">{item.title}</h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${catColors.bg} ${catColors.text}`}
                >
                  {en ? catLabel.en : catLabel.vi}
                </span>
              </div>
              {item.notes && (
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                  {item.notes}
                </p>
              )}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {item.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--theme-surface-muted)] text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
