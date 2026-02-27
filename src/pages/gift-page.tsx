import { useState } from "react";
import { t } from "@/lib/i18n";
import type { WeddingState, GiftEntry } from "@/types/wedding";
import type { WeddingStore } from "@/hooks/use-wedding-store";
import { GiftSummaryBar } from "@/components/gifts/gift-summary-bar";
import { GiftEntryList } from "@/components/gifts/gift-entry-list";
import { GiftEntryForm } from "@/components/gifts/gift-entry-form";
import { GiftCsvExport } from "@/components/gifts/gift-csv-export";

type FilterKey = "all" | "cash" | "gift" | "notThanked";

export default function GiftPage({ state, store }: { state: WeddingState; store: WeddingStore }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [editing, setEditing] = useState<GiftEntry | null | undefined>(undefined);
  const lang = state.lang;

  const gifts = state.gifts ?? [];
  const guests = state.guests ?? [];

  function handleAdd() {
    setEditing(null);
  }

  function handleEdit(gift: GiftEntry) {
    setEditing(gift);
  }

  function handleClose() {
    setEditing(undefined);
  }

  function handleSave(data: Omit<GiftEntry, "id">) {
    if (editing) {
      store.updateGift(editing.id, data);
    } else {
      store.addGift(data);
    }
    setEditing(undefined);
  }

  function handleDelete(id: number) {
    if (window.confirm(lang === "en" ? "Delete this entry?" : "Xóa phong bì này?")) {
      store.removeGift(id);
    }
  }

  function handleToggleThankYou(id: number) {
    const gift = gifts.find((g) => g.id === id);
    if (gift) store.updateGift(id, { thankYouSent: !gift.thankYouSent });
  }

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="font-semibold text-base">{t("🎁 Phong Bì", lang)}</h2>
          <p className="text-xs text-muted-foreground">{t("Quản lý phong bì", lang)}</p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <GiftCsvExport gifts={gifts} lang={lang} />
          <button
            onClick={handleAdd}
            className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            + {t("Thêm", lang)}
          </button>
        </div>
      </div>

      {/* Summary */}
      <GiftSummaryBar gifts={gifts} lang={lang} />

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("🔍 Tìm kiếm...", lang)}
        className="w-full border rounded px-3 py-2 text-sm bg-background"
      />

      {/* List */}
      <GiftEntryList
        gifts={gifts}
        guests={guests}
        search={search}
        filter={filter}
        onFilterChange={setFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleThankYou={handleToggleThankYou}
        lang={lang}
      />

      {/* Add/Edit modal */}
      {editing !== undefined && (
        <GiftEntryForm
          initial={editing}
          guests={guests}
          lang={lang}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
