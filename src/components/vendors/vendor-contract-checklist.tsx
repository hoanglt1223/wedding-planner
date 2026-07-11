import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CONTRACT_CATEGORIES, CONTRACT_ITEMS, getItemsForVendor, getItemsByCategory } from "@/data/contract-checklist";
import { t } from "@/lib/i18n";

const VENDOR_CATEGORIES = [
  "🏛️ Nhà hàng",
  "📸 Ảnh/Video",
  "🌸 Trang trí",
  "💄 Makeup",
  "🎵 MC/Nhạc",
  "🚗 Xe",
  "💐 Hoa",
  "👗 Trang phục",
  "📦 Khác",
];

const PRIORITY_CONFIG = {
  high: { color: "text-red-600", bg: "bg-red-50", icon: "🔴" },
  medium: { color: "text-amber-600", bg: "bg-amber-50", icon: "🟡" },
  low: { color: "text-green-600", bg: "bg-green-50", icon: "🟢" },
};

interface VendorContractChecklistProps {
  checkedItems: Record<string, boolean>;
  onToggle: (itemId: string) => void;
  onClear: () => void;
  lang?: string;
}

export function VendorContractChecklist({
  checkedItems,
  onToggle,
  onClear,
  lang = "vi",
}: VendorContractChecklistProps) {
  const en = lang === "en";
  const [selectedVendorType, setSelectedVendorType] = useState<string>("*");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(CONTRACT_CATEGORIES.map(c => c.id)));

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  // Get items filtered by selected vendor type
  const filteredItems = useMemo(() => {
    if (selectedVendorType === "*") {
      return CONTRACT_ITEMS;
    }
    return getItemsForVendor(selectedVendorType);
  }, [selectedVendorType]);

  // Group filtered items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, typeof CONTRACT_ITEMS> = {};
    filteredItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [filteredItems]);

  // Calculate progress
  const total = filteredItems.length;
  const checked = filteredItems.filter(item => checkedItems[item.id]).length;
  const percentage = total ? Math.round((checked / total) * 100) : 0;

  const handleReset = () => {
    if (confirm(en ? "Reset all checklist items?" : "Đặt lại tất cả mục checklist?")) {
      onClear();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with progress */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold">{checked}/{total}</div>
            <div className="text-xs text-muted-foreground">
              {en ? "checked" : "đã kiểm"}
            </div>
          </div>
          <div className="flex-1">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {percentage}% {en ? "complete" : "hoàn thành"}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          {en ? "Reset" : "Đặt lại"}
        </Button>
      </div>

      {/* Vendor type filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedVendorType("*")}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            selectedVendorType === "*"
              ? "bg-[var(--theme-primary)] text-white"
              : "bg-muted hover:bg-muted/70"
          }`}
        >
          {en ? "All Types" : "Tất cả"}
        </button>
        {VENDOR_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedVendorType(cat)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              selectedVendorType === cat
                ? "bg-[var(--theme-primary)] text-white"
                : "bg-muted hover:bg-muted/70"
            }`}
          >
            {cat.replace(/[^\s]/g, "").slice(0, 2)}{cat.slice(3)}
          </button>
        ))}
      </div>

      {/* Checklist content */}
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4 pr-4">
          {CONTRACT_CATEGORIES.map(category => {
            const categoryItems = itemsByCategory[category.id];
            if (!categoryItems || categoryItems.length === 0) return null;

            const isExpanded = expandedCategories.has(category.id);
            const categoryChecked = categoryItems.filter(item => checkedItems[item.id]).length;
            const categoryTotal = categoryItems.length;
            const categoryPct = categoryTotal ? Math.round((categoryChecked / categoryTotal) * 100) : 0;

            return (
              <div key={category.id} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.labelVi.split(" ")[0]}</span>
                    <div>
                      <div className="font-medium text-sm">
                        {en ? category.labelEn : category.labelVi.slice(3)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {en ? category.descriptionEn : category.descriptionVi}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {categoryChecked}/{categoryTotal} ({categoryPct}%)
                    </span>
                    <span className="text-muted-foreground">
                      {isExpanded ? "▼" : "▶"}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t">
                    {categoryItems.map(item => {
                      const isChecked = checkedItems[item.id];
                      const priority = PRIORITY_CONFIG[item.priority];
                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-3 hover:bg-muted/30 transition-colors border-b last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggle(item.id)}
                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs" title={en ? `Priority: ${item.priority}` : `Ưu tiên: ${item.priority}`}>
                                {priority.icon}
                              </span>
                              <p className={`text-sm ${isChecked ? "line-through text-muted-foreground" : ""}`}>
                                {en ? item.textEn : item.textVi}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.vendorTypes.includes("*") ? (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                  {en ? "All vendors" : "Tất cả"}
                                </span>
                              ) : (
                                item.vendorTypes.map(vt => (
                                  <span key={vt} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                    {vt.replace(/[^\s]/g, "").slice(0, 2)}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {en ? "No items for this vendor type" : "Không có mục nào cho loại nhà cung cấp này"}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
