import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WEDDING_DAY_KIT, getTotalKitItems } from "@/data/wedding-day-kit";

interface WeddingDayKitProps {
  checkedItems: Record<string, boolean>;
  customItems: { id: string; categoryId: string; textVi: string; textEn: string; icon: string }[];
  onToggle: (id: string) => void;
  onAddCustom: (categoryId: string, textVi: string, textEn: string) => void;
  onRemoveCustom: (id: string) => void;
  lang?: string;
}

export function WeddingDayKit({
  checkedItems,
  customItems,
  onToggle,
  onAddCustom,
  onRemoveCustom,
  lang = "vi",
}: WeddingDayKitProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState(WEDDING_DAY_KIT[0].id);
  const [customText, setCustomText] = useState("");
  const en = lang === "en";

  const totalBuiltIn = getTotalKitItems();
  const totalCustom = customItems.length;
  const totalItems = totalBuiltIn + totalCustom;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const pct = totalItems ? Math.round((checkedCount / totalItems) * 100) : 0;

  const activeCat = WEDDING_DAY_KIT.find((c) => c.id === activeCategory) ?? WEDDING_DAY_KIT[0];
  const catCustomItems = customItems.filter((i) => i.categoryId === activeCategory);
  const catAllItems = [...activeCat.items, ...catCustomItems];
  const catChecked = catAllItems.filter((i) => checkedItems[i.id]).length;

  const handleAddCustom = () => {
    const text = customText.trim();
    if (!text) return;
    onAddCustom(activeCategory, text, text);
    setCustomText("");
  };

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--theme-surface)",
        borderColor: "var(--theme-border)",
      }}
    >
      {/* Header — always visible */}
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎒</span>
          <div>
            <h3 className="text-sm font-semibold">
              {en ? "Wedding Day Kit" : "Túi Đồ Ngày Cưới"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {en
                ? `${checkedCount}/${totalItems} items packed`
                : `${checkedCount}/${totalItems} vật dụng đã chuẩn bị`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${pct}%`,
                backgroundColor: pct === 100 ? "#22c55e" : "var(--theme-primary)",
              }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
          <span className="text-muted-foreground">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Category tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
            {WEDDING_DAY_KIT.map((cat) => {
              const catItems = [...cat.items, ...customItems.filter((i) => i.categoryId === cat.id)];
              const catDone = catItems.filter((i) => checkedItems[i.id]).length;
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                  style={isActive ? { backgroundColor: "var(--theme-primary)" } : {}}
                >
                  <span>{cat.icon}</span>
                  <span>{en ? cat.labelEn : cat.labelVi}</span>
                  {catDone > 0 && (
                    <span
                      className={`ml-0.5 text-2xs px-1 rounded-full ${
                        isActive ? "bg-white/20" : "bg-muted"
                      }`}
                    >
                      {catDone}/{catItems.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Category description */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{activeCat.icon}</span>
            <span>
              {en ? activeCat.labelEn : activeCat.labelVi} — {catChecked}/{catAllItems.length}{" "}
              {en ? "done" : "hoàn thành"}
            </span>
          </div>

          {/* Items list */}
          <div className="space-y-1">
            {activeCat.items.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!checkedItems[item.id]}
                  onChange={() => onToggle(item.id)}
                  className="h-4 w-4 rounded border-gray-300 shrink-0 accent-[var(--theme-primary)]"
                />
                <span className="text-sm">{item.icon}</span>
                <span
                  className={`text-sm ${
                    checkedItems[item.id] ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {en ? item.textEn : item.textVi}
                </span>
              </label>
            ))}

            {/* Custom items for this category */}
            {catCustomItems.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors group"
              >
                <input
                  type="checkbox"
                  checked={!!checkedItems[item.id]}
                  onChange={() => onToggle(item.id)}
                  className="h-4 w-4 rounded border-gray-300 shrink-0 accent-[var(--theme-primary)]"
                />
                <span className="text-sm">{item.icon}</span>
                <span
                  className={`text-sm flex-1 ${
                    checkedItems[item.id] ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {en ? item.textEn : item.textVi}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveCustom(item.id);
                  }}
                  className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </label>
            ))}
          </div>

          {/* Add custom item */}
          <div className="flex gap-2 pt-1">
            <Input
              className="h-8 text-sm flex-1"
              placeholder={en ? "Add custom item..." : "Thêm vật dụng..."}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
            />
            <Button
              size="sm"
              className="h-8 px-3 shrink-0"
              onClick={handleAddCustom}
              disabled={!customText.trim()}
            >
              +
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
