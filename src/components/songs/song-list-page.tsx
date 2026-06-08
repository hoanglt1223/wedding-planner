import { useState } from "react";
import { t } from "@/lib/i18n";
import type { SongItem, SongSection, SongPriority } from "@/types/wedding";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { SongSummaryBar } from "./song-summary-bar";
import { SongEntryList } from "./song-entry-list";
import { SongEntryForm } from "./song-entry-form";

type FilterSection = "all" | SongSection;
type FilterPriority = "all" | SongPriority;

export function SongListPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const [search, setSearch] = useState("");
  const [filterSection, setFilterSection] = useState<FilterSection>("all");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [editing, setEditing] = useState<SongItem | null | undefined>(undefined);
  const lang = state.lang;

  const songs = state.songs ?? [];

  function handleAdd() {
    setEditing(null);
  }

  function handleEdit(song: SongItem) {
    setEditing(song);
  }

  function handleClose() {
    setEditing(undefined);
  }

  function handleSave(data: Omit<SongItem, "id">) {
    if (editing) {
      store.updateSong(editing.id, data);
    } else {
      store.addSong(data);
    }
    setEditing(undefined);
  }

  function handleDelete(id: number) {
    if (window.confirm(lang === "en" ? "Delete this song?" : "Xóa bài hát này?")) {
      store.removeSong(id);
    }
  }

  function handleToggleConfirmed(id: number) {
    const song = songs.find((s) => s.id === id);
    if (song) store.updateSong(id, { confirmed: !song.confirmed });
  }

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="font-semibold text-base">{t("🎵 Danh Sách Nhạc", lang)}</h2>
          <p className="text-xs text-muted-foreground">{t("Quản lý nhạc đám cưới", lang)}</p>
        </div>
        <button
          onClick={handleAdd}
          className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
        >
          + {t("Thêm", lang)}
        </button>
      </div>

      {/* Summary */}
      <SongSummaryBar songs={songs} lang={lang} />

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("🔍 Tìm kiếm bài hát...", lang)}
        className="w-full border rounded px-3 py-2 text-sm bg-background"
      />

      {/* List */}
      <SongEntryList
        songs={songs}
        search={search}
        filterSection={filterSection}
        filterPriority={filterPriority}
        onFilterSectionChange={setFilterSection}
        onFilterPriorityChange={setFilterPriority}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleConfirmed={handleToggleConfirmed}
        lang={lang}
      />

      {/* Add/Edit modal */}
      {editing !== undefined && (
        <SongEntryForm
          initial={editing}
          lang={lang}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
