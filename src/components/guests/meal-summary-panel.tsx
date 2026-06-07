import { useState } from "react";
import type { Guest } from "@/types/wedding";

/** Common dietary labels for Vietnamese weddings */
const DIETARY_LABELS: Record<string, Record<string, string>> = {
  chay: { vi: "Chay", en: "Vegetarian" },
  halal: { vi: "Halal", en: "Halal" },
  vegan: { vi: "Vegan", en: "Vegan" },
};

function getDietaryLabel(dietary: string, lang: string): string {
  const lower = (dietary || "").toLowerCase().trim();
  return DIETARY_LABELS[lower]?.[lang] ?? dietary;
}

interface DietaryGroup {
  key: string;
  label: string;
  guests: { name: string; plusOne?: string; side: string; tableGroup?: string }[];
  mealCount: number;
}

function groupByDietary(guests: Guest[], lang: string): DietaryGroup[] {
  const en = lang === "en";
  const map = new Map<string, DietaryGroup>();

  for (const g of guests) {
    const rawKey = (g.dietary || "").toLowerCase().trim();
    const key = rawKey || "__standard__";
    const label = rawKey
      ? getDietaryLabel(g.dietary || "", lang)
      : en ? "Standard" : "Tiêu chuẩn";

    if (!map.has(key)) {
      map.set(key, { key, label, guests: [], mealCount: 0 });
    }
    const group = map.get(key)!;
    group.guests.push({
      name: g.name,
      plusOne: g.plusOneName,
      side: g.side === "trai" ? (en ? "Groom" : "Trai") : (en ? "Bride" : "Gái"),
      tableGroup: g.tableGroup,
    });
    group.mealCount += 1 + (g.plusOneName ? 1 : 0);
  }

  // Sort: standard last, others alphabetical
  return [...map.values()].sort((a, b) => {
    if (a.key === "__standard__") return 1;
    if (b.key === "__standard__") return -1;
    return a.label.localeCompare(b.label);
  });
}

function downloadMealCsv(groups: DietaryGroup[], lang: string) {
  const en = lang === "en";
  const rows: string[] = [];
  rows.push(
    en
      ? "Dietary Preference,Guest Name,+1,Side,Table Group"
      : "Chế độ ăn,Tên khách,Đi kèm,Bên,Nhóm/Bàn"
  );

  for (const group of groups) {
    for (const g of group.guests) {
      rows.push(
        [group.label, g.name, g.plusOne || "", g.side, g.tableGroup || ""]
          .map((v) => `"${v.replace(/"/g, '""')}"`)
          .join(",")
      );
    }
  }

  // Add summary rows
  rows.push("");
  rows.push(en ? "Summary" : "Tóm tắt");
  for (const group of groups) {
    rows.push(`"${group.label}",${group.mealCount} ${en ? "meals" : "suất"},,,`);
  }

  const blob = new Blob(["﻿" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = en ? "meal-preferences.csv" : "suat-an.csv";
  a.click();
  URL.revokeObjectURL(url);
}

interface MealSummaryPanelProps {
  guests: Guest[];
  lang?: string;
}

export function MealSummaryPanel({ guests, lang = "vi" }: MealSummaryPanelProps) {
  const en = lang === "en";
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const groups = groupByDietary(guests, lang);
  const totalMeals = groups.reduce((s, g) => s + g.mealCount, 0);
  const totalGuests = guests.length;
  const plusOnes = guests.filter((g) => g.plusOneName).length;
  const specialMeals = groups
    .filter((g) => g.key !== "__standard__")
    .reduce((s, g) => s + g.mealCount, 0);

  if (totalGuests === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
          <span className="text-3xl">🍽️</span>
        </div>
        <h3 className="text-base font-semibold mb-1">
          {en ? "No guests yet" : "Chưa có khách mời"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {en
            ? "Add guests first to see meal preference summary"
            : "Thêm khách mời trước để xem tóm tắt suất ăn"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--theme-primary)" }}>
            {en ? "🍽️ Meal Preference Summary" : "🍽️ Tóm Tắt Suất Ăn"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {en
              ? `${totalGuests} guests, ${totalMeals} total meals`
              : `${totalGuests} khách, ${totalMeals} suất ăn`}
          </p>
        </div>
        <button
          onClick={() => downloadMealCsv(groups, lang)}
          className="text-xs px-3 py-1.5 bg-green-100 text-green-800 rounded hover:bg-green-200 border border-green-300 transition-colors"
        >
          📤 {en ? "Export for Caterer" : "Xuất cho Nhà hàng"}
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-blue-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold text-blue-600">{totalGuests}</div>
          <div className="text-[10px] text-blue-500">{en ? "Guests" : "Khách mời"}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold text-purple-600">{plusOnes}</div>
          <div className="text-[10px] text-purple-500">{en ? "+1s" : "Đi kèm"}</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold text-amber-600">{specialMeals}</div>
          <div className="text-[10px] text-amber-500">{en ? "Special meals" : "Suất đặc biệt"}</div>
        </div>
      </div>

      {/* Dietary breakdown */}
      <div className="space-y-2">
        {groups.map((group) => {
          const isExpanded = expandedGroup === group.key;
          const isSpecial = group.key !== "__standard__";

          return (
            <div
              key={group.key}
              className={`rounded-xl border p-3 transition-colors ${
                isSpecial
                  ? "border-amber-200 bg-amber-50/50"
                  : "border-[var(--theme-border)] bg-[var(--theme-surface)]"
              }`}
            >
              {/* Group header */}
              <button
                onClick={() => setExpandedGroup(isExpanded ? null : group.key)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isSpecial
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {isSpecial ? "🥬" : "🍖"} {group.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {group.guests.length} {en ? "guests" : "khách"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: "var(--theme-primary)" }}>
                    {group.mealCount}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {en ? "meals" : "suất"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {/* Expanded guest list */}
              {isExpanded && (
                <div className="mt-2 pt-2 border-t border-dashed border-gray-200 space-y-1">
                  {group.guests.map((g, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-0.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-muted-foreground w-5 text-right shrink-0">{i + 1}.</span>
                        <span className="truncate">{g.name}</span>
                        {g.plusOne && (
                          <span className="text-purple-500 shrink-0">+1 {g.plusOne}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-muted-foreground">
                        <span>{g.side}</span>
                        {g.tableGroup && <span>· {g.tableGroup}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary bar for caterer */}
      <div className="rounded-lg bg-[var(--theme-surface-muted)] border border-[var(--theme-border)] p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {en ? "📋 Summary for Caterer" : "📋 Tóm tắt cho Nhà hàng"}
        </p>
        <div className="space-y-1">
          {groups.map((group) => (
            <div key={group.key} className="flex items-center justify-between text-sm">
              <span>{group.label}</span>
              <span className="font-semibold">{group.mealCount} {en ? "meals" : "suất"}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm font-bold pt-1 border-t">
            <span>{en ? "Total" : "Tổng cộng"}</span>
            <span style={{ color: "var(--theme-primary)" }}>{totalMeals} {en ? "meals" : "suất"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
