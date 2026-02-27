import { useState } from "react";
import { t } from "@/lib/i18n";
import type { TimelineEntry } from "@/types/wedding";
import { TimelineEntryCard } from "./timeline-entry-card";

type Category = "all" | TimelineEntry["category"];

const FILTER_TABS: { key: Category; labelVi: string; labelEn: string }[] = [
  { key: "all", labelVi: "Tất cả", labelEn: "All" },
  { key: "ceremony", labelVi: "Nghi lễ", labelEn: "Ceremony" },
  { key: "reception", labelVi: "Tiệc", labelEn: "Reception" },
  { key: "prep", labelVi: "Chuẩn bị", labelEn: "Prep" },
  { key: "other", labelVi: "Khác", labelEn: "Other" },
];

interface TimelineEntryListProps {
  entries: TimelineEntry[];
  lang: string;
  onEdit: (entry: TimelineEntry) => void;
  onDelete: (id: number) => void;
}

export function TimelineEntryList({ entries, lang, onEdit, onDelete }: TimelineEntryListProps) {
  const [filter, setFilter] = useState<Category>("all");

  const filtered = filter === "all"
    ? entries
    : entries.filter((e) => e.category === filter);

  return (
    <div className="flex flex-col gap-3">
      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {FILTER_TABS.map((tab) => {
          const label = lang === "en" ? tab.labelEn : tab.labelVi;
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border
                ${isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary"
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Entry list */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          <p className="text-2xl mb-2">🗓️</p>
          <p>{t("Chưa có lịch trình", lang)}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((entry) => (
            <TimelineEntryCard
              key={entry.id}
              entry={entry}
              lang={lang}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
