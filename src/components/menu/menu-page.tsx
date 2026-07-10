import { useState } from "react";
import { t } from "@/lib/i18n";
import type { MenuItem, MenuCourseType, DietaryType } from "@/types/wedding";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { MenuSummaryBar } from "./menu-summary-bar";
import { MenuEntryList } from "./menu-entry-list";
import { MenuEntryForm } from "./menu-entry-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FilterCourse = "all" | MenuCourseType;
type FilterDietary = "all" | DietaryType;

export function MenuPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState<FilterCourse>("all");
  const [filterDietary, setFilterDietary] = useState<FilterDietary>("all");
  const [editing, setEditing] = useState<MenuItem | null | undefined>(undefined);
  const [showSettings, setShowSettings] = useState(false);
  const lang = (state.lang === "en" ? "en" : "vi") as "vi" | "en";

  const menuItems = state.menuItems ?? [];
  const menuSettings = state.menuSettings ?? {
    enabled: false,
    budgetPerTable: 5_000_000,
    guestCount: state.guests.length || 100,
    specialRequests: "",
    servingStyle: "banquet",
    includeCutlery: true,
    includeDrinks: false,
    notes: "",
  };

  function handleAdd() {
    setEditing(null);
  }

  function handleEdit(item: MenuItem) {
    setEditing(item);
  }

  function handleClose() {
    setEditing(undefined);
  }

  function handleSave(data: Omit<MenuItem, "id">) {
    if (editing && editing.id > 0) {
      store.updateMenuItem(editing.id, data);
    } else {
      store.addMenuItem(data);
    }
    setEditing(undefined);
  }

  function handleDelete(id: number) {
    if (window.confirm(lang === "en" ? "Delete this dish?" : "Xóa món này?")) {
      store.removeMenuItem(id);
    }
  }

  function handleToggleFavorite(id: number) {
    const item = menuItems.find((i) => i.id === id);
    if (item) store.toggleMenuItemFavorite(id);
  }

  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    store.updateMenuSettings({
      budgetPerTable: Number(formData.get("budgetPerTable")) || 0,
      guestCount: Number(formData.get("guestCount")) || 0,
      specialRequests: formData.get("specialRequests") as string,
      servingStyle: formData.get("servingStyle") as "banquet" | "buffet" | "family-style" | "plated",
      includeCutlery: formData.get("includeCutlery") === "true",
      includeDrinks: formData.get("includeDrinks") === "true",
      notes: formData.get("notes") as string,
      enabled: true,
    });
    setShowSettings(false);
  }

  const courseOptions: Array<{ value: FilterCourse; labelVi: string; labelEn: string }> = [
    { value: "all", labelVi: "Tất cả", labelEn: "All" },
    { value: "appetizer", labelVi: "Khai vị", labelEn: "Appetizer" },
    { value: "soup", labelVi: "Súp", labelEn: "Soup" },
    { value: "main", labelVi: "Món chính", labelEn: "Main" },
    { value: "side", labelVi: "Món phụ", labelEn: "Side" },
    { value: "dessert", labelVi: "Tráng miệng", labelEn: "Dessert" },
    { value: "drink", labelVi: "Đồ uống", labelEn: "Drinks" },
    { value: "other", labelVi: "Khác", labelEn: "Other" },
  ];

  const dietaryOptions: Array<{ value: FilterDietary; labelVi: string; labelEn: string }> = [
    { value: "all", labelVi: "Tất cả", labelEn: "All" },
    { value: "none", labelVi: "Bình thường", labelEn: "Regular" },
    { value: "vegetarian", labelVi: "Chay", labelEn: "Vegetarian" },
    { value: "vegan", labelVi: "Thuần chay", labelEn: "Vegan" },
    { value: "halal", labelVi: "Halal", labelEn: "Halal" },
    { value: "gluten-free", labelVi: "Không gluten", labelEn: "Gluten-free" },
    { value: "nut-free", labelVi: "Không hạt", labelEn: "Nut-free" },
    { value: "low-sugar", labelVi: "Ít đường", labelEn: "Low-sugar" },
  ];

  if (editing !== undefined) {
    return (
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-base">
              {editing ? t("Cập nhật món ăn", lang) : t("Thêm món mới", lang)}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("Quản lý thông tin món ăn", lang)}
            </p>
          </div>
        </div>
        <MenuEntryForm item={editing} onSave={handleSave} onCancel={handleClose} lang={lang} />
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="font-semibold text-base">🍽️ {t("Thực Đơn Tiệc Cưới", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {t("Quản lý menu và chi phí ẩm thực", lang)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs"
          >
            ⚙️ {t("Cài đặt", lang)}
          </Button>
          <Button size="sm" onClick={handleAdd} className="text-xs">
            + {t("Thêm món", lang)}
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="p-4">
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <h3 className="font-semibold text-sm">{t("Cài đặt menu", lang)}</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="budgetPerTable">{t("Ngân sách/bàn (10 người, VND)", lang)}</Label>
                <Input
                  id="budgetPerTable"
                  name="budgetPerTable"
                  type="number"
                  defaultValue={menuSettings.budgetPerTable}
                  placeholder="5000000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="guestCount">{t("Số khách", lang)}</Label>
                <Input
                  id="guestCount"
                  name="guestCount"
                  type="number"
                  defaultValue={menuSettings.guestCount}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="servingStyle">{t("Phục vụ", lang)}</Label>
              <select
                id="servingStyle"
                name="servingStyle"
                defaultValue={menuSettings.servingStyle}
                className="w-full mt-1 border rounded px-3 py-2 text-sm bg-background"
              >
                <option value="banquet">{lang === "en" ? "Banquet (Mâm)" : "Tiệc mâm"}</option>
                <option value="buffet">{lang === "en" ? "Buffet" : "Tự chọn"}</option>
                <option value="family-style">{lang === "en" ? "Family Style" : "Phong cách gia đình"}</option>
                <option value="plated">{lang === "en" ? "Plated (Individual)" : "Phần riêng"}</option>
              </select>
            </div>

            <div>
              <Label htmlFor="specialRequests">{t("Yêu cầu đặc biệt", lang)}</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                defaultValue={menuSettings.specialRequests}
                placeholder={lang === "en" ? "Dietary requirements, allergies..." : "Yêu cầu ăn uống, dị ứng..."}
                rows={2}
                className="mt-1"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="includeCutlery"
                  defaultChecked={menuSettings.includeCutlery}
                  className="rounded"
                />
                {t("Bao gồm dao nĩa đĩa", lang)}
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="includeDrinks"
                  defaultChecked={menuSettings.includeDrinks}
                  className="rounded"
                />
                {t("Bao gồm đồ uống", lang)}
              </label>
            </div>

            <div>
              <Label htmlFor="settingsNotes">{t("Ghi chú", lang)}</Label>
              <Textarea
                id="settingsNotes"
                name="notes"
                defaultValue={menuSettings.notes}
                placeholder={lang === "en" ? "Additional notes..." : "Ghi chú thêm..."}
                rows={2}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">{t("Lưu", lang)}</Button>
              <Button type="button" variant="outline" onClick={() => setShowSettings(false)}>
                {t("Hủy", lang)}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Summary */}
      <MenuSummaryBar items={menuItems} settings={menuSettings} lang={lang} />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value as FilterCourse)}
          className="border rounded px-3 py-1.5 text-sm bg-background"
        >
          {courseOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {lang === "vi" ? opt.labelVi : opt.labelEn}
            </option>
          ))}
        </select>

        <select
          value={filterDietary}
          onChange={(e) => setFilterDietary(e.target.value as FilterDietary)}
          className="border rounded px-3 py-1.5 text-sm bg-background"
        >
          {dietaryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {lang === "vi" ? opt.labelVi : opt.labelEn}
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      <Input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("🔍 Tìm kiếm món ăn...", lang)}
        className="w-full"
      />

      {/* Menu Items List */}
      <MenuEntryList
        items={menuItems}
        search={search}
        filterCourse={filterCourse}
        filterDietary={filterDietary}
        lang={lang}
        onEdit={handleEdit}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDelete}
      />
    </div>
  );
}