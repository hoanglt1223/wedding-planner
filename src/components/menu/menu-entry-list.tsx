import type { MenuItem, MenuCourseType, DietaryType } from "@/types/wedding";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";

interface MenuEntryListProps {
  items: MenuItem[];
  search: string;
  filterCourse: MenuCourseType | "all";
  filterDietary: DietaryType | "all";
  lang: "vi" | "en";
  onEdit: (item: MenuItem) => void;
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void;
}

const COURSE_LABELS: Record<MenuCourseType | "all", { vi: string; en: string }> = {
  "all": { vi: "Tất cả", en: "All" },
  "appetizer": { vi: "Khai vị", en: "Appetizer" },
  "soup": { vi: "Súp", en: "Soup" },
  "main": { vi: "Món chính", en: "Main Course" },
  "side": { vi: "Món phụ", en: "Side Dish" },
  "dessert": { vi: "Tráng miệng", en: "Dessert" },
  "drink": { vi: "Đồ uống", en: "Drinks" },
  "other": { vi: "Khác", en: "Other" },
};

const DIETARY_LABELS: Record<DietaryType | "all", { vi: string; en: string }> = {
  "all": { vi: "Tất cả", en: "All" },
  "none": { vi: "Không", en: "None" },
  "vegetarian": { vi: "Chay", en: "Vegetarian" },
  "vegan": { vi: "Thuần chay", en: "Vegan" },
  "halal": { vi: "Halal", en: "Halal" },
  "gluten-free": { vi: "Không gluten", en: "Gluten-free" },
  "nut-free": { vi: "Không hạt", en: "Nut-free" },
};

const DIETARY_ICONS: Record<DietaryType, string> = {
  "none": "",
  "vegetarian": "🥬",
  "vegan": "🌱",
  "halal": "🕌",
  "gluten-free": "🌾",
  "nut-free": "🥜",
};

export function MenuEntryList({
  items,
  search,
  filterCourse,
  filterDietary,
  lang,
  onEdit,
  onToggleFavorite,
  onDelete,
}: MenuEntryListProps) {
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesCourse = filterCourse === "all" || item.courseType === filterCourse;
    const matchesDietary =
      filterDietary === "all" ||
      (filterDietary === "none" && item.dietary.length === 0) ||
      item.dietary.includes(filterDietary);

    return matchesSearch && matchesCourse && matchesDietary;
  });

  // Group by course type
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.courseType]) {
      acc[item.courseType] = [];
    }
    acc[item.courseType].push(item);
    return acc;
  }, {} as Record<MenuCourseType, MenuItem[]>);

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">
          {lang === "en" ? "No dishes found" : "Không tìm thấy món nào"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedItems).map(([courseType, courseItems]) => (
        <div key={courseType} className="space-y-2">
          <h3 className="text-sm font-semibold text-primary sticky top-0 bg-background py-1">
            {COURSE_LABELS[courseType as MenuCourseType][lang]}
          </h3>
          {courseItems.map((item) => (
            <Card key={item.id} className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className="text-lg hover:scale-110 transition-transform"
                    >
                      {item.isFavorite ? "⭐" : "☆"}
                    </button>
                    <h4 className="font-medium text-sm">{item.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {item.dietary.map((d) => (
                      <span key={d} className="text-xs px-2 py-0.5 bg-secondary rounded">
                        {DIETARY_ICONS[d]} {DIETARY_LABELS[d][lang]}
                      </span>
                    ))}
                    <span className="text-xs text-muted-foreground">
                      {item.serves} {lang === "en" ? "servings" : "phần"} ·{" "}
                      {(item.costPerServing / 1000).toFixed(0)}k VND
                    </span>
                    {item.vendorName && (
                      <span className="text-xs text-muted-foreground">
                        🏪 {item.vendorName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(item)}
                    className="text-xs"
                  >
                    {t("Sửa", lang)}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(item.id)}
                    className="text-xs text-destructive"
                  >
                    {t("Xóa", lang)}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}