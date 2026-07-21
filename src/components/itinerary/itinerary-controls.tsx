import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WEDDING_TYPES, generateItineraryItems } from "@/data/wedding-itinerary";
import type { ItineraryItem } from "@/data/wedding-itinerary";
import type { AppTheme } from "@/data/themes";
import { ExportButtons } from "./export-buttons";

interface ItineraryControlsProps {
  lang?: string;
  onGenerate: (items: ItineraryItem[]) => void;
  onClear: () => void;
  existingItems: ItineraryItem[];
  brideName: string;
  groomName: string;
  weddingDate: string;
  theme: AppTheme;
}

export function ItineraryControls({
  lang = "vi",
  onGenerate,
  onClear,
  existingItems,
  brideName,
  groomName,
  weddingDate,
  theme,
}: ItineraryControlsProps) {
  const en = lang === "en";
  const [selectedType, setSelectedType] = useState<string>("standard");
  const [startTime, setStartTime] = useState("06:00");

  const handleGenerate = () => {
    const items = generateItineraryItems(selectedType, startTime);
    onGenerate(items);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{en ? "Type:" : "Loại:"}</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-8 px-2 rounded border border-[var(--theme-border)] bg-[var(--theme-surface)] text-sm"
          >
            {Object.entries(WEDDING_TYPES).map(([key, { nameVi, nameEn }]) => (
              <option key={key} value={key}>
                {en ? nameEn : nameVi}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{en ? "Start:" : "Bắt đầu:"}</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="h-8 px-2 rounded border border-[var(--theme-border)] bg-[var(--theme-surface)] text-sm"
          />
        </div>

        <Button size="sm" className="h-8" onClick={handleGenerate}>
          🎯 {en ? "Generate" : "Tạo lịch"}
        </Button>

        {existingItems.length > 0 && (
          <>
            <ExportButtons
              items={existingItems}
              brideName={brideName}
              groomName={groomName}
              weddingDate={weddingDate}
              lang={lang as "vi" | "en"}
              theme={theme}
            />
            <Button size="sm" variant="outline" className="h-8 text-red-500" onClick={onClear}>
              🗑️ {en ? "Clear" : "Xóa"}
            </Button>
          </>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        {en
          ? `Selected: ${WEDDING_TYPES[selectedType].nameEn} - ${WEDDING_TYPES[selectedType].descriptionEn}`
          : `Đã chọn: ${WEDDING_TYPES[selectedType].nameVi} - ${WEDDING_TYPES[selectedType].descriptionVi}`}
      </div>
    </div>
  );
}
