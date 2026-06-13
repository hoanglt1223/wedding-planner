import { useState } from "react";
import { t } from "@/lib/i18n";
import type { GuestBookEntry, GuestBookMood } from "@/types/wedding";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { GuestBookEntryList } from "@/components/guest-book/guest-book-entry-list";
import { GuestBookEntryForm } from "@/components/guest-book/guest-book-entry-form";

type FilterKey = GuestBookMood | "all" | "favorites";

export default function GuestBookPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [editing, setEditing] = useState<GuestBookEntry | null | undefined>(undefined);
  const lang = state.lang;
  const en = lang === "en";

  const entries = state.guestBookEntries ?? [];
  const guests = state.guests ?? [];
  const favoritesCount = entries.filter((e) => e.isFavorite).length;

  function handleAdd() {
    setEditing(null);
  }

  function handleEdit(entry: GuestBookEntry) {
    setEditing(entry);
  }

  function handleClose() {
    setEditing(undefined);
  }

  function handleSave(data: Omit<GuestBookEntry, "id" | "createdAt">) {
    if (editing) {
      store.updateGuestBookEntry(editing.id, data);
    } else {
      store.addGuestBookEntry(data);
    }
    setEditing(undefined);
  }

  function handleDelete(id: number) {
    if (window.confirm(lang === "en" ? "Delete this message?" : "Xóa lời chúc này?")) {
      store.removeGuestBookEntry(id);
    }
  }

  function handleToggleFavorite(id: number) {
    store.toggleGuestBookFavorite(id);
  }

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="font-semibold text-base">{t("📝 Sổ Lưu Bút", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {en ? "Guest wishes and memories" : "Lời chúc và kỷ niệm của khách mời"}
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {favoritesCount > 0 && (
            <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded">
              ⭐ {favoritesCount}
            </span>
          )}
          <button
            onClick={handleAdd}
            className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            + {t("Viết lời chúc", lang)}
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("🔍 Tìm kiếm lời chúc...", lang)}
        className="w-full border rounded px-3 py-2 text-sm bg-background"
      />

      {/* List */}
      <GuestBookEntryList
        entries={entries}
        search={search}
        filter={filter}
        lang={lang}
        onFilterChange={setFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Add/Edit modal */}
      {editing !== undefined && (
        <GuestBookEntryForm
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
