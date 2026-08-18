import { useState } from "react";
import { SeatingChartPanel } from "./seating-chart-panel";
import { TableMealSummary } from "./table-meal-summary";
import type { AppTheme } from "@/data/themes";
import type { Guest, SeatingTable } from "@/types/wedding";

type MealTab = "seating" | "meals";

interface SeatingMealPlannerProps {
  tables: SeatingTable[];
  guests: Guest[];
  onAddTable: (table: Omit<SeatingTable, "id" | "guestIds">) => void;
  onUpdateTable: (id: number, updates: Partial<Omit<SeatingTable, "id">>) => void;
  onRemoveTable: (id: number) => void;
  onAssignGuest: (guestId: number, tableId: number) => void;
  onUnassignGuest: (guestId: number) => void;
  lang?: string;
  theme?: AppTheme;
}

export function SeatingMealPlanner({
  tables,
  guests,
  onAddTable,
  onUpdateTable,
  onRemoveTable,
  onAssignGuest,
  onUnassignGuest,
  lang = "vi",
  theme,
}: SeatingMealPlannerProps) {
  const [activeTab, setActiveTab] = useState<MealTab>("seating");
  const en = lang === "en";

  const assignedCount = tables.reduce((sum, t) => sum + t.guestIds.length, 0);
  const totalGuests = guests.length;
  const hasUnassigned = totalGuests > assignedCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-lg">{en ? "🪑 Seating & Meals" : "🪑 Chỗ Ngồi & Ăn Uống"}</h2>
          <p className="text-xs text-muted-foreground">
            {en
              ? `${tables.length} tables · ${assignedCount}/${totalGuests} guests assigned`
              : `${tables.length} bàn · ${assignedCount}/${totalGuests} khách đã xếp`}
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("seating")}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "seating"
              ? "text-[var(--theme-primary)] border-b-2 border-[var(--theme-primary)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          🪑 {en ? "Seating Chart" : "Sơ Đồ Ngồi"}
        </button>
        <button
          onClick={() => setActiveTab("meals")}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "meals"
              ? "text-[var(--theme-primary)] border-b-2 border-[var(--theme-primary)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          🍽️ {en ? "Meal Planning" : "Kế Hoạch Ăn"}
        </button>
      </div>

      {activeTab === "seating" && (
        <SeatingChartPanel
          tables={tables}
          guests={guests}
          onAddTable={onAddTable}
          onUpdateTable={onUpdateTable}
          onRemoveTable={onRemoveTable}
          onAssignGuest={onAssignGuest}
          onUnassignGuest={onUnassignGuest}
          lang={lang}
          theme={theme}
        />
      )}

      {activeTab === "meals" && (
        <TableMealSummary tables={tables} guests={guests} lang={lang} />
      )}

      {hasUnassigned && activeTab === "meals" && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">💡 {en ? "Tip:" : "Mẹo:"}</span>{" "}
            {en
              ? `${totalGuests - assignedCount} guests not yet assigned to tables. Go to "Seating Chart" to assign them first.`
              : `${totalGuests - assignedCount} khách chưa được xếp bàn. Vào "Sơ Đồ Ngồi" để xếp họ trước.`}
          </p>
        </div>
      )}
    </div>
  );
}
