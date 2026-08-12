import { useState } from "react";
import { t } from "@/lib/i18n";
import type { SpeechEntry, SpeechCategory } from "@/types/wedding";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { SpeechEntryList } from "./speech-entry-list";
import { SpeechEntryForm } from "./speech-entry-form";
import { VowBuilder } from "./vow-builder";
import { AiEnhancementCard } from "./ai-enhancement-card";

type FilterCategory = "all" | SpeechCategory;

export function SpeechListPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [editing, setEditing] = useState<SpeechEntry | null | undefined>(undefined);
  const [showVowBuilder, setShowVowBuilder] = useState(false);
  const [enhancingSpeech, setEnhancingSpeech] = useState<SpeechEntry | null>(null);
  const lang = state.lang;

  const speeches = state.speeches ?? [];

  function handleAdd() {
    setEditing(null);
  }

  function handleEdit(speech: SpeechEntry) {
    setEditing(speech);
  }

  function handleClose() {
    setEditing(undefined);
  }

  function handleSave(data: Omit<SpeechEntry, "id">) {
    if (editing) {
      store.updateSpeech(editing.id, data);
    } else {
      store.addSpeech(data);
    }
    setEditing(undefined);
  }

  function handleDelete(id: number) {
    if (window.confirm(lang === "en" ? "Delete this speech?" : "Xóa bài phát biểu này?")) {
      store.removeSpeech(id);
    }
  }

  function handleToggleFavorite(id: number) {
    const speech = speeches.find((s) => s.id === id);
    if (speech) store.updateSpeech(id, { isFavorite: !speech.isFavorite });
  }

  function handleEnhanceWithAi(speech: SpeechEntry) {
    setEnhancingSpeech(speech);
  }

  function handleApplyEnhancement(enhancedText: string) {
    if (enhancingSpeech) {
      store.updateSpeech(enhancingSpeech.id, { content: enhancedText });
    }
  }

  // Summary counts
  const counts = speeches.reduce(
    (acc, s) => {
      acc.total++;
      acc[s.category] = (acc[s.category] || 0) + 1;
      if (s.isFavorite) acc.favorites++;
      return acc;
    },
    { total: 0, favorites: 0, vow: 0, toast: 0, reading: 0, prayer: 0, other: 0 } as Record<string, number>,
  );

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="font-semibold text-base">{t("✍️ Lời Thề & Diễn Văn", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {t("Quản lý lời thề, bài phát biểu, nâng ly", lang)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowVowBuilder(true)}
            className="text-xs px-3 py-1.5 rounded hover:opacity-90 transition-opacity border"
            style={{ borderColor: "var(--theme-primary)", color: "var(--theme-primary)" }}
          >
            ✨ {lang === "en" ? "Vow Builder" : "Viết lời thề"}
          </button>
          <button
            onClick={handleAdd}
            className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            + {t("Thêm", lang)}
          </button>
        </div>
      </div>

      {/* Summary bar */}
      {speeches.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <SummaryChip label={lang === "en" ? "Total" : "Tổng"} count={counts.total} />
          {counts.favorites > 0 && <SummaryChip label="⭐" count={counts.favorites} />}
          {counts.vow > 0 && <SummaryChip label="💍" count={counts.vow} />}
          {counts.toast > 0 && <SummaryChip label="🥂" count={counts.toast} />}
          {counts.reading > 0 && <SummaryChip label="📖" count={counts.reading} />}
          {counts.prayer > 0 && <SummaryChip label="🙏" count={counts.prayer} />}
          {counts.other > 0 && <SummaryChip label="📝" count={counts.other} />}
        </div>
      )}

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("🔍 Tìm kiếm bài phát biểu...", lang)}
        className="w-full border rounded px-3 py-2 text-sm bg-background"
      />

      {/* List */}
      <SpeechEntryList
        speeches={speeches}
        search={search}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
        onEnhanceWithAi={handleEnhanceWithAi}
        lang={lang}
      />

      {/* Add/Edit modal */}
      {editing !== undefined && (
        <SpeechEntryForm
          initial={editing}
          lang={lang}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}

      {/* Vow Builder */}
      {showVowBuilder && (
        <VowBuilder
          lang={lang}
          onSave={(data) => store.addSpeech(data)}
          onClose={() => setShowVowBuilder(false)}
        />
      )}

      {/* AI Enhancement */}
      {enhancingSpeech && (
        <AiEnhancementCard
          speech={enhancingSpeech}
          lang={lang as "vi" | "en"}
          onApplyEnhancement={handleApplyEnhancement}
          onClose={() => setEnhancingSpeech(null)}
        />
      )}
    </div>
  );
}

function SummaryChip({ label, count }: { label: string; count: number }) {
  return (
    <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
      {label} {count}
    </span>
  );
}
