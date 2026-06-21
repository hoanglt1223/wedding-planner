import { useState } from "react";
import { t } from "@/lib/i18n";
import type { MoodBoardItem, MoodBoardCategory, ColorPalette } from "@/types/wedding";
import { MoodBoardGrid } from "./mood-board-grid";
import { MoodBoardForm } from "./mood-board-form";
import { ColorPaletteSection } from "./color-palette-section";

const CATEGORY_OPTIONS: { value: MoodBoardCategory; labelVi: string; labelEn: string; icon: string }[] = [
  { value: "decor", labelVi: "Trang trí", labelEn: "Decor", icon: "🎀" },
  { value: "flowers", labelVi: "Hoa", labelEn: "Flowers", icon: "💐" },
  { value: "attire", labelVi: "Trang phục", labelEn: "Attire", icon: "👗" },
  { value: "cake", labelVi: "Bánh", labelEn: "Cake", icon: "🎂" },
  { value: "food", labelVi: "Ẩm thực", labelEn: "Food", icon: "🍽️" },
  { value: "venue", labelVi: "Địa điểm", labelEn: "Venue", icon: "🏛️" },
  { value: "photography", labelVi: "Nhiếp ảnh", labelEn: "Photography", icon: "📸" },
  { value: "other", labelVi: "Khác", labelEn: "Other", icon: "✨" },
];

interface MoodBoardPanelProps {
  items: MoodBoardItem[];
  colorPalettes: ColorPalette[];
  onAddItem: (item: Omit<MoodBoardItem, "id" | "createdAt">) => void;
  onUpdateItem: (id: number, updates: Partial<MoodBoardItem>) => void;
  onRemoveItem: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onAddPalette: (palette: Omit<ColorPalette, "id">) => void;
  onUpdatePalette: (id: number, updates: Partial<ColorPalette>) => void;
  onRemovePalette: (id: number) => void;
  lang?: string;
}

export function MoodBoardPanel({
  items,
  colorPalettes,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onToggleFavorite,
  onAddPalette,
  onUpdatePalette,
  onRemovePalette,
  lang = "vi",
}: MoodBoardPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MoodBoardItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<MoodBoardCategory | "all">("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const en = lang === "en";

  const filteredItems = items.filter((item) => {
    if (activeCategory !== "all" && item.category !== activeCategory) return false;
    if (showFavoritesOnly && !item.isFavorite) return false;
    return true;
  });

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (item: MoodBoardItem) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSave = (data: Omit<MoodBoardItem, "id" | "createdAt">) => {
    if (editing) {
      onUpdateItem(editing.id, data);
    } else {
      onAddItem(data);
    }
    handleClose();
  };

  const categoryCounts = items.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🎨 {t("Bảng Cảm Hứng", lang)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {en ? "Collect wedding inspiration" : "Thu thập cảm hứng cưới"}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 bg-[var(--theme-primary)] text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          + {en ? "Add" : "Thêm"}
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
            activeCategory === "all"
              ? "bg-[var(--theme-primary)] text-white"
              : "bg-[var(--theme-surface-muted)] text-muted-foreground hover:bg-[var(--theme-surface)]"
          }`}
        >
          {en ? "All" : "Tất cả"} ({items.length})
        </button>
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
              activeCategory === cat.value
                ? "bg-[var(--theme-primary)] text-white"
                : "bg-[var(--theme-surface-muted)] text-muted-foreground hover:bg-[var(--theme-surface)]"
            }`}
          >
            {cat.icon} {en ? cat.labelEn : cat.labelVi}
            {categoryCounts[cat.value] ? ` (${categoryCounts[cat.value]})` : ""}
          </button>
        ))}
      </div>

      {/* Favorites toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
            showFavoritesOnly
              ? "bg-red-100 text-red-600"
              : "bg-[var(--theme-surface-muted)] text-muted-foreground"
          }`}
        >
          {showFavoritesOnly ? "❤️" : "🤍"} {en ? "Favorites" : "Yêu thích"}
        </button>
      </div>

      {/* Color Palettes */}
      <ColorPaletteSection
        palettes={colorPalettes}
        onAdd={onAddPalette}
        onUpdate={onUpdatePalette}
        onRemove={onRemovePalette}
        lang={lang}
      />

      {/* Mood Board Grid */}
      <MoodBoardGrid
        items={filteredItems}
        lang={lang}
        onEdit={handleEdit}
        onRemove={onRemoveItem}
        onToggleFavorite={onToggleFavorite}
      />

      {/* Form Modal */}
      {showForm && (
        <MoodBoardForm
          lang={lang}
          editing={editing}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
