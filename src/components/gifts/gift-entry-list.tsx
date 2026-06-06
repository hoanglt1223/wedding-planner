import { useState } from "react";
import { formatMoney, getCurrencySymbol } from "@/lib/format";
import type { GiftEntry, Guest } from "@/types/wedding";

type FilterKey = "all" | "cash" | "gift" | "notThanked";

interface GiftEntryListProps {
  gifts: GiftEntry[];
  guests: Guest[];
  search: string;
  filter: FilterKey;
  onFilterChange: (f: FilterKey) => void;
  onEdit: (gift: GiftEntry) => void;
  onDelete: (id: number) => void;
  onToggleThankYou: (id: number) => void;
  lang: string;
}

const FILTERS: { key: FilterKey; vi: string; en: string }[] = [
  { key: "all", vi: "Tất cả", en: "All" },
  { key: "cash", vi: "💰 Tiền mặt", en: "💰 Cash" },
  { key: "gift", vi: "🎁 Quà", en: "🎁 Gift" },
  { key: "notThanked", vi: "💌 Chưa cảm ơn", en: "💌 Not thanked" },
];

export function GiftEntryList({
  gifts, search, filter, onFilterChange, onEdit, onDelete, onToggleThankYou, lang,
}: GiftEntryListProps) {
  const cur = getCurrencySymbol(lang);
  const en = lang === "en";
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = gifts.filter((g) => {
    if (filter === "cash" && g.type !== "cash") return false;
    if (filter === "gift" && g.type !== "gift") return false;
    if (filter === "notThanked" && g.thankYouSent) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        g.guestName.toLowerCase().includes(q) ||
        (g.description ?? "").toLowerCase().includes(q) ||
        (g.side ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    // Thanked items go to bottom
    if (a.thankYouSent !== b.thankYouSent) return a.thankYouSent ? 1 : -1;
    return b.id - a.id; // newest first
  });

  return (
    <div className="space-y-2">
      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
              filter === f.key
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
          {search ? (en ? "No results" : "Không tìm thấy") : (en ? "No gifts yet" : "Chưa có phong bì nào")}
        </div>
      ) : (
        <div className="space-y-1.5">
          {sorted.map((gift) => {
            const isExpanded = expandedId === gift.id;
            return (
              <div
                key={gift.id}
                className={`border rounded-lg p-2.5 transition-colors ${
                  gift.thankYouSent ? "bg-green-50/50 border-green-200" : "bg-background"
                }`}
              >
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : gift.id)}
                >
                  {/* Type icon */}
                  <span className="text-lg shrink-0">
                    {gift.type === "cash" ? "💰" : "🎁"}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium truncate">{gift.guestName}</span>
                      {gift.thankYouSent && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {gift.type === "cash" && gift.amount ? (
                        <span className="font-medium text-green-700">
                          {formatMoney(gift.amount, lang)}{cur}
                        </span>
                      ) : (
                        <span>{gift.description || (en ? "Physical gift" : "Quà tặng")}</span>
                      )}
                      {gift.side && (
                        <span className="px-1.5 py-0.5 bg-muted rounded text-[10px]">
                          {gift.side === "groom" ? (en ? "Groom" : "Nhà trai") :
                           gift.side === "bride" ? (en ? "Bride" : "Nhà gái") : (en ? "Other" : "Khác")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expand arrow */}
                  <span className={`text-xs text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>

                {/* Expanded actions */}
                {isExpanded && (
                  <div className="flex gap-2 mt-2 pt-2 border-t">
                    <button
                      onClick={() => onToggleThankYou(gift.id)}
                      className={`text-xs px-2.5 py-1 rounded transition-colors ${
                        gift.thankYouSent
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {gift.thankYouSent ? (en ? "Undo thank you" : "Bỏ cảm ơn") : (en ? "Mark thanked" : "Đã cảm ơn")}
                    </button>
                    <button
                      onClick={() => onEdit(gift)}
                      className="text-xs px-2.5 py-1 rounded bg-muted hover:bg-muted/80"
                    >
                      {en ? "Edit" : "Sửa"}
                    </button>
                    <button
                      onClick={() => onDelete(gift.id)}
                      className="text-xs px-2.5 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      {en ? "Delete" : "Xóa"}
                    </button>
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
