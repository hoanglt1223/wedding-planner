import { ItineraryControls } from "./itinerary-controls";
import { ItineraryTimeline } from "./itinerary-timeline";
import { CalendarExportButton } from "./calendar-export-button";
import type { ItineraryItem } from "@/data/wedding-itinerary";
import type { AppTheme } from "@/data/themes";

interface ItineraryPageProps {
  items: ItineraryItem[];
  lang?: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  theme: AppTheme;
  onUpdateItems: (items: ItineraryItem[]) => void;
}

export function ItineraryPage({
  items,
  lang = "vi",
  brideName,
  groomName,
  weddingDate,
  theme,
  onUpdateItems,
}: ItineraryPageProps) {
  // Reserved for future edit functionality
  // const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);

  const handleGenerate = (newItems: ItineraryItem[]) => {
    onUpdateItems(newItems);
  };

  const handleClear = () => {
    if (window.confirm(lang === "en" ? "Clear all itinerary items?" : "Xóa toàn bộ lịch trình?")) {
      onUpdateItems([]);
    }
  };

  const handleEdit = (item: ItineraryItem) => {
    // Reserved for future edit functionality
    console.log("Edit item:", item);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(lang === "en" ? "Delete this item?" : "Xóa mục này?")) {
      onUpdateItems(items.filter((i) => i.id !== id));
    }
  };

  const handleReorder = (itemId: string, direction: "up" | "down") => {
    const sortedItems = [...items].sort((a, b) => a.startTime.localeCompare(b.startTime));
    const index = sortedItems.findIndex((i) => i.id === itemId);

    if (direction === "up" && index > 0) {
      const temp = sortedItems[index];
      sortedItems[index] = sortedItems[index - 1];
      sortedItems[index - 1] = temp;
      onUpdateItems(sortedItems);
    } else if (direction === "down" && index < sortedItems.length - 1) {
      const temp = sortedItems[index];
      sortedItems[index] = sortedItems[index + 1];
      sortedItems[index + 1] = temp;
      onUpdateItems(sortedItems);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base">
          {lang === "en" ? "📋 Wedding Day Itinerary" : "📋 Lịch Trình Ngày Cưới"}
        </h2>
      </div>

      <ItineraryControls
        lang={lang}
        onGenerate={handleGenerate}
        onClear={handleClear}
        existingItems={items}
        brideName={brideName}
        groomName={groomName}
        weddingDate={weddingDate}
        theme={theme}
      />

      {items.length > 0 && (
        <CalendarExportButton
          items={items}
          brideName={brideName}
          groomName={groomName}
          weddingDate={weddingDate}
          lang={lang as "en" | "vi"}
        />
      )}

      <ItineraryTimeline
        items={items}
        lang={lang}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />

      {items.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {lang === "en"
            ? `${items.length} activities scheduled`
            : `${items.length} hoạt động đã được lên lịch`}
        </div>
      )}
    </div>
  );
}
