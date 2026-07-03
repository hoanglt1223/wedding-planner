import { formatMoney } from "@/lib/format";
import { GIFT_CATEGORIES, RECIPIENT_TYPES, STATUS_LABELS } from "@/data/guest-gift-data";
import type { GuestGift, GuestGiftCategory, GuestGiftStatus } from "@/types/wedding";

interface GuestGiftListProps {
  gifts: GuestGift[];
  search: string;
  filterCategory: string;
  filterStatus: string;
  onFilterCategoryChange: (filter: string) => void;
  onFilterStatusChange: (filter: string) => void;
  onEdit: (gift: GuestGift) => void;
  onDelete: (id: number) => void;
  onToggleDistributed: (id: number) => void;
  lang?: string;
}

export function GuestGiftList({
  gifts,
  search,
  filterCategory,
  filterStatus,
  onFilterCategoryChange,
  onFilterStatusChange,
  onEdit,
  onDelete,
  onToggleDistributed,
  lang = "vi",
}: GuestGiftListProps) {
  const en = lang === "en";

  const filteredGifts = gifts.filter((gift) => {
    const matchesSearch =
      search === "" ||
      gift.giftName.toLowerCase().includes(search.toLowerCase()) ||
      gift.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = filterCategory === "all" || gift.category === filterCategory;
    const matchesStatus = filterStatus === "all" || gift.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={filterCategory}
          onChange={(e) => onFilterCategoryChange(e.target.value)}
          className="text-xs px-2 py-1.5 border rounded bg-background"
        >
          <option value="all">{en ? "All Categories" : "Tất cả danh mục"}</option>
          {Object.entries(GIFT_CATEGORIES).map(([key, cat]) => (
            <option key={key} value={key}>
              {cat.icon} {en ? cat.labelEn : cat.labelVi}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value)}
          className="text-xs px-2 py-1.5 border rounded bg-background"
        >
          <option value="all">{en ? "All Status" : "Tất cả trạng thái"}</option>
          {Object.entries(STATUS_LABELS).map(([key, status]) => (
            <option key={key} value={key}>
              {status.icon} {en ? status.labelEn : status.labelVi}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {filteredGifts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          {en ? "No guest gifts found" : "Không tìm thấy quà tặng nào"}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredGifts.map((gift) => {
            const cat = GIFT_CATEGORIES[gift.category as GuestGiftCategory];
            const recipient = RECIPIENT_TYPES[gift.recipientType as keyof typeof RECIPIENT_TYPES];
            const status = STATUS_LABELS[gift.status as GuestGiftStatus];
            const progress = gift.totalQuantity > 0 ? (gift.distributedQuantity / gift.totalQuantity) * 100 : 0;

            return (
              <div
                key={gift.id}
                className="p-3 rounded-lg border hover:border-primary/50 transition-colors"
                style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{cat.icon}</span>
                      <h4 className="font-medium text-sm truncate">{gift.giftName}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                        {status.icon} {en ? status.labelEn : status.labelVi}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{gift.description}</p>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        {en ? "Category" : "Danh mục"}: {en ? cat.labelEn : cat.labelVi}
                      </span>
                      <span>
                        {recipient.icon} {en ? recipient.labelEn : recipient.labelVi}
                      </span>
                      <span className="font-medium text-foreground">
                        {formatMoney(gift.costPerUnit, lang)} × {gift.totalQuantity}
                      </span>
                      <span className="font-medium text-green-600">
                        {en ? "Total" : "Tổng"}: {formatMoney(gift.costPerUnit * gift.totalQuantity, lang)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          {en ? "Distributed" : "Đã phát"}: {gift.distributedQuantity} / {gift.totalQuantity}
                        </span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: progress === 100 ? "#22c55e" : "var(--theme-primary)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onToggleDistributed(gift.id)}
                      className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                      title={en ? "Mark as distributed" : "Đánh dấu đã phát"}
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => onEdit(gift)}
                      className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      ✏
                    </button>
                    <button
                      onClick={() => onDelete(gift.id)}
                      className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
