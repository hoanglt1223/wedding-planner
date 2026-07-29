import type { MenuItem, AppTheme } from "@/types/wedding";
import { t } from "@/lib/i18n";

interface MenuCardPreviewProps {
  items: MenuItem[];
  theme: AppTheme;
  lang: "vi" | "en";
  tableName?: string;
  showTableName: boolean;
  showDietary: boolean;
  title?: string;
}

export function MenuCardPreview({
  items,
  theme,
  lang,
  tableName,
  showTableName,
  showDietary,
  title,
}: MenuCardPreviewProps) {
  const courseGroups = items.reduce((acc, item) => {
    if (!acc[item.courseType]) {
      acc[item.courseType] = [];
    }
    acc[item.courseType].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const courseOrder: Array<{ key: string; labelVi: string; labelEn: string }> = [
    { key: "appetizer", labelVi: "Khai vị", labelEn: "Appetizer" },
    { key: "soup", labelVi: "Súp", labelEn: "Soup" },
    { key: "main", labelVi: "Món chính", labelEn: "Main Course" },
    { key: "side", labelVi: "Món phụ", labelEn: "Side Dish" },
    { key: "dessert", labelVi: "Tráng miệng", labelEn: "Dessert" },
    { key: "drink", labelVi: "Đồ uống", labelEn: "Beverage" },
    { key: "other", labelVi: "Khác", labelEn: "Other" },
  ];

  const dietaryLabels: Record<string, string> = {
    vegetarian: lang === "en" ? "V" : "C",
    vegan: lang === "en" ? "VG" : "TC",
    halal: lang === "en" ? "H" : "H",
    "gluten-free": lang === "en" ? "GF" : "KH",
    "nut-free": lang === "en" ? "NF" : "KHẬT",
  };

  const dietaryColors: Record<string, string> = {
    vegetarian: "#22c55e",
    vegan: "#16a34a",
    halal: "#0891b2",
    "gluten-free": "#7c3aed",
    "nut-free": "#ea580c",
  };

  return (
    <div
      className="menu-card border-4 p-6 rounded-lg shadow-lg bg-white max-w-2xl mx-auto"
      style={{
        borderColor: theme.primary,
        fontFamily: lang === "en" ? "Georgia, serif" : "'Times New Roman', serif",
      }}
    >
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: theme.primary }}>
        {title && <h3 className="text-2xl font-bold mb-1" style={{ color: theme.primary }}>{title}</h3>}
        {showTableName && tableName && (
          <p className="text-sm font-medium uppercase tracking-wide" style={{ color: theme.primary }}>
            {lang === "en" ? "Table" : "Bàn"} {tableName}
          </p>
        )}
        <div className="w-16 h-1 mx-auto mt-2" style={{ backgroundColor: theme.primary }} />
      </div>

      {/* Menu Items by Course */}
      <div className="space-y-4">
        {courseOrder
          .filter(({ key }) => courseGroups[key] && courseGroups[key].length > 0)
          .map(({ key, labelVi, labelEn }) => (
            <div key={key}>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: theme.primary }}>
                {lang === "vi" ? labelVi : labelEn}
              </h4>
              <div className="space-y-2">
                {courseGroups[key]
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{lang === "en" && item.nameEn ? item.nameEn : item.name}</p>
                        {item.description && (
                          <p className="text-xs text-gray-600 mt-0.5">
                            {lang === "en" && item.descriptionEn ? item.descriptionEn : item.description}
                          </p>
                        )}
                      </div>
                      {showDietary && item.dietary && item.dietary.length > 0 && (
                        <div className="flex gap-1 flex-shrink-0">
                          {item.dietary.map((d) => (
                            <span
                              key={d}
                              className="px-1.5 py-0.5 rounded text-xs font-bold text-white"
                              style={{ backgroundColor: dietaryColors[d] || "#6b7280" }}
                              title={d}
                            >
                              {dietaryLabels[d] || d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-6 pt-4 border-t-2" style={{ borderColor: theme.primary }}>
        <p className="text-xs italic" style={{ color: theme.primary }}>
          {lang === "en" ? "Bon Appétit" : "Mời quý khách thưởng thức"}
        </p>
      </div>
    </div>
  );
}