import type { MenuItem, MenuSettings } from "@/types/wedding";

interface MenuSummaryBarProps {
  items: MenuItem[];
  settings: MenuSettings;
  lang: "vi" | "en";
}

export function MenuSummaryBar({ items, settings, lang }: MenuSummaryBarProps) {
  const totalCostPerTable = items.reduce((sum, item) => {
    return sum + (item.costPerServing * (item.serves || 10));
  }, 0);

  const estimatedTotalCost = settings.guestCount > 0
    ? Math.round((totalCostPerTable * (settings.guestCount / 10)))
    : 0;

  const dietaryCounts = items.reduce((acc, item) => {
    item.dietary.forEach((type) => {
      if (type !== "none") {
        acc[type] = (acc[type] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-card rounded-lg border">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">
          {items.length}
        </div>
        <div className="text-xs text-muted-foreground">
          {lang === "en" ? "Total Dishes" : "Tổng số món"}
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-primary">
          {totalCostPerTable > 0 ? (totalCostPerTable / 1_000_000).toFixed(2) : "0.00"}M
        </div>
        <div className="text-xs text-muted-foreground">
          {lang === "en" ? "Cost/Table (10 people)" : "Chi phí/bàn (10 người)"}
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-primary">
          {estimatedTotalCost > 0 ? (estimatedTotalCost / 1_000_000).toFixed(1) : "0.0"}M
        </div>
        <div className="text-xs text-muted-foreground">
          {lang === "en" ? `Est. Total (${settings.guestCount} guests)` : `Tổng ước tính (${settings.guestCount} khách)`}
        </div>
      </div>

      {Object.keys(dietaryCounts).length > 0 && (
        <div className="col-span-1 md:col-span-3 pt-2 border-t mt-2">
          <div className="text-xs text-muted-foreground mb-1">
            {lang === "en" ? "Dietary Options:" : "Lựa chọn ăn uống:"}
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(dietaryCounts).map(([type, count]) => (
              <span key={type} className="text-xs px-2 py-1 bg-secondary rounded">
                {type}: {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}