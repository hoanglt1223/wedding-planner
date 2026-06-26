import type { RegistryItem, RegistryCategory } from "@/types/wedding";
import { formatMoney, getCurrencySymbol } from "@/lib/format";

const CATEGORY_ICONS: Record<RegistryCategory, string> = {
  home: "🏠",
  kitchen: "🍳",
  bedroom: "🛏️",
  experience: "✨",
  travel: "✈️",
  electronics: "📱",
  other: "📦",
};

const CATEGORY_LABELS: Record<RegistryCategory, { vi: string; en: string }> = {
  home: { vi: "Gia dụng", en: "Home" },
  kitchen: { vi: "Nhà bếp", en: "Kitchen" },
  bedroom: { vi: "Phòng ngủ", en: "Bedroom" },
  experience: { vi: "Trải nghiệm", en: "Experience" },
  travel: { vi: "Du lịch", en: "Travel" },
  electronics: { vi: "Điện tử", en: "Electronics" },
  other: { vi: "Khác", en: "Other" },
};

const PRIORITY_STYLES: Record<RegistryItem["priority"], string> = {
  "must-have": "bg-red-100 text-red-700 border-red-200",
  "nice-to-have": "bg-blue-100 text-blue-700 border-blue-200",
  optional: "bg-gray-100 text-gray-600 border-gray-200",
};

const PRIORITY_LABELS: Record<RegistryItem["priority"], { vi: string; en: string }> = {
  "must-have": { vi: "Cần thiết", en: "Must have" },
  "nice-to-have": { vi: "Nên có", en: "Nice to have" },
  optional: { vi: "Tùy chọn", en: "Optional" },
};

interface RegistryItemCardProps {
  item: RegistryItem;
  lang: string;
  onEdit: (item: RegistryItem) => void;
  onDelete: (id: number) => void;
  onToggleFulfilled: (id: number) => void;
}

export function RegistryItemCard({ item, lang, onEdit, onDelete, onToggleFulfilled }: RegistryItemCardProps) {
  const en = lang === "en";
  const cur = getCurrencySymbol(lang);
  const catIcon = CATEGORY_ICONS[item.category] || "📦";
  const catLabel = CATEGORY_LABELS[item.category]?.[lang as "vi" | "en"] || item.category;
  const priorityStyle = PRIORITY_STYLES[item.priority];
  const priorityLabel = PRIORITY_LABELS[item.priority]?.[lang as "vi" | "en"] || item.priority;

  return (
    <div
      className={`rounded-xl border p-3 transition-all ${
        item.fulfilled
          ? "border-green-200 bg-green-50/50 opacity-80"
          : "border-[var(--theme-border)] bg-[var(--theme-surface)]"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleFulfilled(item.id)}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            item.fulfilled
              ? "bg-green-500 border-green-500 text-white"
              : "border-muted-foreground hover:border-[var(--theme-primary)]"
          }`}
        >
          {item.fulfilled && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className={`text-sm font-medium leading-tight ${item.fulfilled ? "line-through text-muted-foreground" : ""}`}>
                {catIcon} {item.name}
              </h4>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
              )}
            </div>
            {item.price > 0 && (
              <span className="text-sm font-semibold shrink-0" style={{ color: "var(--theme-primary)" }}>
                {formatMoney(item.price, lang)}{cur}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {catLabel}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${priorityStyle}`}>
              {priorityLabel}
            </span>
            {item.fulfilled && item.fulfilledBy && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 border border-green-200">
                🎁 {item.fulfilledBy}
              </span>
            )}
          </div>

          {/* Link */}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-500 hover:underline mt-1 inline-block truncate max-w-full"
            >
              🔗 {en ? "View product" : "Xem sản phẩm"}
            </a>
          )}

          {/* Notes */}
          {item.notes && (
            <p className="text-[11px] text-muted-foreground mt-1 italic">{item.notes}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={() => onEdit(item)}
            className="text-xs px-2 py-1 rounded hover:bg-muted text-muted-foreground transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-xs px-2 py-1 rounded hover:bg-red-50 text-red-400 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
