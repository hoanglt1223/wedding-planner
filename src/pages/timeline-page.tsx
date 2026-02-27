import { useState } from "react";
import { t } from "@/lib/i18n";
import type { WeddingState, TimelineEntry } from "@/types/wedding";
import type { WeddingStore } from "@/hooks/use-wedding-store";
import { getWeddingSteps } from "@/data/resolve-data";
import { generateTimelineFromSteps } from "@/data/timeline-templates";
import { TimelineHeader } from "@/components/timeline/timeline-header";
import { TimelineEntryList } from "@/components/timeline/timeline-entry-list";
import { TimelineEntryForm } from "@/components/timeline/timeline-entry-form";

type EntryDraft = Omit<TimelineEntry, "id">;

interface TimelinePageProps {
  state: WeddingState;
  store: WeddingStore;
}

export default function TimelinePage({ state, store }: TimelinePageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TimelineEntry | null>(null);
  const { lang } = state;

  const sortedEntries = [...(state.timelineEntries ?? [])].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (entry: TimelineEntry) => {
    setEditing(entry);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSave = (data: EntryDraft) => {
    if (editing) {
      store.updateTimelineEntry(editing.id, data);
    } else {
      if ((state.timelineEntries ?? []).length >= 100) {
        alert(lang === "en" ? "Maximum 100 entries reached." : "Đã đạt tối đa 100 mục.");
        return;
      }
      store.addTimelineEntry(data);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    store.removeTimelineEntry(id);
  };

  const handleGenerate = () => {
    const existing = state.timelineEntries ?? [];
    if (existing.length > 0) {
      const msg = lang === "en"
        ? "This will replace all existing entries. Continue?"
        : "Thao tác này sẽ thay thế toàn bộ lịch trình hiện tại. Tiếp tục?";
      if (!window.confirm(msg)) return;
    }

    const steps = getWeddingSteps(lang);
    const generated = generateTimelineFromSteps(
      steps,
      state.enabledSteps ?? {},
      state.stepStartTimes ?? {},
      state.partyTime ?? "noon",
      lang,
    );
    store.setTimelineEntries(generated);
  };

  return (
    <div className="flex flex-col gap-4 p-1">
      <TimelineHeader
        lang={lang}
        entryCount={sortedEntries.length}
        onAdd={handleAdd}
        onGenerate={handleGenerate}
      />

      <TimelineEntryList
        entries={sortedEntries}
        lang={lang}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <TimelineEntryForm
          lang={lang}
          editing={editing}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}

      <p className="text-[10px] text-muted-foreground text-center">
        {t("Lịch trình ngày cưới", lang)} — {lang === "en" ? "max 100 entries" : "tối đa 100 mục"}
      </p>
    </div>
  );
}
