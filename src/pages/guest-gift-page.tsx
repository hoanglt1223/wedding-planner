import { useState } from "react";
import { t } from "@/lib/i18n";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { GuestGiftSummary } from "@/components/guest-gifts/guest-gift-summary";
import { GuestGiftList } from "@/components/guest-gifts/guest-gift-list";
import { GuestGiftForm } from "@/components/guest-gifts/guest-gift-form";
import { GuestGiftExport } from "@/components/guest-gifts/guest-gift-export";
import type { GuestGift } from "@/types/wedding";

export default function GuestGiftPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editing, setEditing] = useState<GuestGift | null | undefined>(undefined);
  const lang = state.lang;

  const gifts = state.guestGifts ?? [];

  function handleAdd() {
    setEditing(null);
  }

  function handleEdit(gift: GuestGift) {
    setEditing(gift);
  }

  function handleClose() {
    setEditing(undefined);
  }

  function handleSave(data: Omit<GuestGift, "id" | "distributedQuantity" | "status" | "createdAt">) {
    if (editing) {
      store.updateGuestGift(editing.id, data);
    } else {
      store.addGuestGift(
        data.giftName,
        data.category,
        data.description,
        data.costPerUnit,
        data.totalQuantity,
        data.recipientType,
        data.notes
      );
    }
    setEditing(undefined);
  }

  function handleDelete(id: number) {
    if (window.confirm(lang === "en" ? "Delete this gift?" : "Xóa quà tặng này?")) {
      store.removeGuestGift(id);
    }
  }

  function handleToggleDistributed(id: number) {
    const gift = gifts.find((g) => g.id === id);
    if (gift && gift.distributedQuantity < gift.totalQuantity) {
      store.markGiftDistributed(id, 1);
    }
  }

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="font-semibold text-base">{t("🎁 Quà Tặng Cho Khách", lang)}</h2>
          <p className="text-xs text-muted-foreground">{t("Quản lý quà tặng cho khách mời", lang)}</p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <GuestGiftExport gifts={gifts} lang={lang} />
          <button
            onClick={handleAdd}
            className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            + {t("Thêm", lang)}
          </button>
        </div>
      </div>

      {/* Summary */}
      <GuestGiftSummary gifts={gifts} lang={lang} />

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("🔍 Tìm kiếm quà tặng...", lang)}
        className="w-full border rounded px-3 py-2 text-sm bg-background"
      />

      {/* List */}
      <GuestGiftList
        gifts={gifts}
        search={search}
        filterCategory={filterCategory}
        filterStatus={filterStatus}
        onFilterCategoryChange={setFilterCategory}
        onFilterStatusChange={setFilterStatus}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleDistributed={handleToggleDistributed}
        lang={lang}
      />

      {/* Add/Edit modal */}
      {editing !== undefined && (
        <GuestGiftForm initial={editing} lang={lang} onSave={handleSave} onClose={handleClose} />
      )}
    </div>
  );
}
