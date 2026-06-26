import { useState } from "react";
import type { RegistryItem, RegistryCategory } from "@/types/wedding";
import { t } from "@/lib/i18n";
import { RegistrySummary } from "./registry-summary";
import { RegistryItemCard } from "./registry-item-card";
import { RegistryItemForm } from "./registry-item-form";

type FilterKey = "all" | RegistryCategory | "fulfilled" | "pending";

const FILTER_OPTIONS: { key: FilterKey; vi: string; en: string }[] = [
  { key: "all", vi: "Tất cả", en: "All" },
  { key: "fulfilled", vi: "✅ Đã nhận", en: "✅ Fulfilled" },
  { key: "pending", vi: "⏳ Còn lại", en: "⏳ Pending" },
  { key: "home", vi: "🏠 Gia dụng", en: "🏠 Home" },
  { key: "kitchen", vi: "🍳 Bếp", en: "🍳 Kitchen" },
  { key: "bedroom", vi: "🛏️ Phòng ngủ", en: "🛏️ Bedroom" },
  { key: "experience", vi: "✨ Trải nghiệm", en: "✨ Experience" },
  { key: "travel", vi: "✈️ Du lịch", en: "✈️ Travel" },
  { key: "electronics", vi: "📱 Điện tử", en: "📱 Electronics" },
  { key: "other", vi: "📦 Khác", en: "📦 Other" },
];

const SORT_OPTIONS: { key: string; vi: string; en: string }[] = [
  { key: "newest", vi: "Mới nhất", en: "Newest" },
  { key: "priority", vi: "Ưu tiên", en: "Priority" },
  { key: "price-asc", vi: "Giá thấp → cao", en: "Price low → high" },
  { key: "price-desc", vi: "Giá cao → thấp", en: "Price high → low" },
  { key: "name", vi: "Tên A-Z", en: "Name A-Z" },
];

const PRIORITY_ORDER: Record<string, number> = { "must-have": 0, "nice-to-have": 1, optional: 2 };

function filterItems(items: RegistryItem[], filter: FilterKey): RegistryItem[] {
  if (filter === "all") return items;
  if (filter === "fulfilled") return items.filter((i) => i.fulfilled);
  if (filter === "pending") return items.filter((i) => !i.fulfilled);
  return items.filter((i) => i.category === filter);
}

function sortItems(items: RegistryItem[], sort: string): RegistryItem[] {
  const sorted = [...items];
  switch (sort) {
    case "priority":
      return sorted.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9));
    case "price-asc":
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    case "price-desc":
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
    default:
      return sorted.sort((a, b) => b.id - a.id);
  }
}

interface RegistryPanelProps {
  items: RegistryItem[];
  lang: string;
  onAdd: (item: Omit<RegistryItem, "id" | "createdAt">) => void;
  onUpdate: (id: number, updates: Partial<RegistryItem>) => void;
  onRemove: (id: number) => void;
  onToggleFulfilled: (id: number) => void;
}

export function RegistryPanel({ items, lang, onAdd, onUpdate, onRemove, onToggleFulfilled }: RegistryPanelProps) {
  const en = lang === "en";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<RegistryItem | null>(null);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (item: RegistryItem) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleSave = (data: Omit<RegistryItem, "id" | "createdAt">) => {
    if (editing) {
      onUpdate(editing.id, data);
    } else {
      onAdd(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    const msg = en ? "Delete this item?" : "Xóa mục này?";
    if (window.confirm(msg)) {
      onRemove(id);
    }
  };

  // Apply filters and search
  let displayed = filterItems(items, filter);
  if (search.trim()) {
    const q = search.toLowerCase();
    displayed = displayed.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.notes.toLowerCase().includes(q)
    );
  }
  displayed = sortItems(displayed, sort);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="font-semibold text-base">{t("🎀 Danh Sách Quà Tặng", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {en ? "Create a wishlist for your guests" : "Tạo danh sách quà tặng cho khách mời"}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="text-xs px-3 py-1.5 bg-[var(--theme-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          + {en ? "Add Item" : "Thêm mục"}
        </button>
      </div>

      {/* Summary */}
      <RegistrySummary items={items} lang={lang} />

      {/* Search + sort */}
      <div className="flex gap-2 items-center flex-wrap">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("🔍 Tìm kiếm...", lang)}
          className="flex-1 min-w-[150px] border rounded-lg px-3 py-2 text-sm bg-background"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-2 py-2 text-xs bg-background"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.key} value={s.key}>{en ? s.en : s.vi}</option>
          ))}
        </select>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${
              filter === f.key
                ? "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)]"
                : "border-[var(--theme-border)] text-muted-foreground hover:bg-muted"
            }`}
          >
            {en ? f.en : f.vi}
          </button>
        ))}
      </div>

      {/* Items list */}
      {displayed.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-3">
            <span className="text-3xl">🎀</span>
          </div>
          <h3 className="text-sm font-semibold mb-1">
            {items.length === 0
              ? (en ? "No items yet" : "Chưa có mục nào")
              : (en ? "No matching items" : "Không tìm thấy")}
          </h3>
          <p className="text-xs text-muted-foreground max-w-xs">
            {items.length === 0
              ? (en
                  ? "Add items you'd love to receive as gifts"
                  : "Thêm những món quà bạn muốn nhận")
              : (en
                  ? "Try a different search or filter"
                  : "Thử tìm kiếm hoặc lọc khác")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map((item) => (
            <RegistryItemCard
              key={item.id}
              item={item}
              lang={lang}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFulfilled={onToggleFulfilled}
            />
          ))}
        </div>
      )}

      {/* Footer count */}
      {items.length > 0 && (
        <p className="text-[10px] text-muted-foreground text-center">
          {displayed.length}/{items.length} {en ? "items shown" : "mục hiển thị"}
        </p>
      )}

      {/* Form modal */}
      {showForm && (
        <RegistryItemForm
          initial={editing}
          lang={lang}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
