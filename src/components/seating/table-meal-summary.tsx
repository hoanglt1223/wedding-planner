import type { Guest, SeatingTable } from "@/types/wedding";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface TableMealSummaryProps {
  tables: SeatingTable[];
  guests: Guest[];
  lang?: string;
}

interface TableMealStats {
  tableId: number;
  tableName: string;
  capacity: number;
  assigned: number;
  meals: {
    standard: number;
    vegetarian: number;
    halal: number;
    kids: number;
    other: number;
    otherDetails: string[];
  };
}

const DIETARY_KEYWORDS = {
  vegetarian: ["chay", "vegetarian", "veg", "thực vật"],
  halal: ["halal", "halaal"],
  kids: ["kids", "children", "tre", "em bé", "kids-meal"],
};

function classifyMeal(dietary: string | undefined): { type: string; detail: string } {
  if (!dietary?.trim()) return { type: "standard", detail: "" };

  const lower = dietary.toLowerCase();

  for (const [key, keywords] of Object.entries(DIETARY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return { type: key, detail: dietary };
    }
  }

  return { type: "other", detail: dietary };
}

export function TableMealSummary({ tables, guests, lang = "vi" }: TableMealSummaryProps) {
  const en = lang === "en";

  // Build guest lookup map
  const guestMap = new Map<number, Guest>();
  guests.forEach((g) => guestMap.set(g.id, g));

  // Calculate meal stats per table
  const tableStats: TableMealStats[] = tables.map((table) => {
    const stats: TableMealStats["meals"] = {
      standard: 0,
      vegetarian: 0,
      halal: 0,
      kids: 0,
      other: 0,
      otherDetails: [],
    };

    const tableGuests = table.guestIds
      .map((id) => guestMap.get(id))
      .filter(Boolean) as Guest[];

    tableGuests.forEach((guest) => {
      const meal = classifyMeal(guest.dietary);
      stats[meal.type as keyof typeof stats]++;
      if (meal.type === "other" && guest.dietary) {
        stats.otherDetails.push(`${guest.name}: ${guest.dietary}`);
      }
    });

    return {
      tableId: table.id,
      tableName: table.name,
      capacity: table.capacity,
      assigned: table.guestIds.length,
      meals: stats,
    };
  });

  // Totals
  const totals = tableStats.reduce(
    (acc, stat) => ({
      standard: acc.standard + stat.meals.standard,
      vegetarian: acc.vegetarian + stat.meals.vegetarian,
      halal: acc.halal + stat.meals.halal,
      kids: acc.kids + stat.meals.kids,
      other: acc.other + stat.meals.other,
    }),
    { standard: 0, vegetarian: 0, halal: 0, kids: 0, other: 0 }
  );

  const totalGuests = totals.standard + totals.vegetarian + totals.halal + totals.kids + totals.other;

  function exportToCSV() {
    const headers = [
      en ? "Table Name" : "Tên bàn",
      en ? "Capacity" : "Sức chứa",
      en ? "Assigned" : "Đã xếp",
      en ? "Standard Meals" : "Món thường",
      en ? "Vegetarian" : "Chay",
      en ? "Halal" : "Halal",
      en ? "Kids Meals" : "Món trẻ em",
      en ? "Special Dietary" : "Ăn kiêng khác",
      en ? "Special Details" : "Chi tiết đặc biệt",
    ];

    const rows = tableStats.map((stat) => [
      stat.tableName,
      stat.capacity.toString(),
      stat.assigned.toString(),
      stat.meals.standard.toString(),
      stat.meals.vegetarian.toString(),
      stat.meals.halal.toString(),
      stat.meals.kids.toString(),
      stat.meals.other.toString(),
      stat.meals.otherDetails.join(" | "),
    ]);

    const totalRow = [
      en ? "TOTAL" : "TỔNG CỘNG",
      "",
      totalGuests.toString(),
      totals.standard.toString(),
      totals.vegetarian.toString(),
      totals.halal.toString(),
      totals.kids.toString(),
      totals.other.toString(),
      tableStats.map((s) => s.meals.otherDetails.join(" | ")).filter(Boolean).join(" | "),
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      totalRow.map((cell) => `"${cell}"`).join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `wedding-meal-plan-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const MEAL_COLORS = {
    standard: "bg-gray-100 text-gray-700",
    vegetarian: "bg-green-100 text-green-700",
    halal: "bg-purple-100 text-purple-700",
    kids: "bg-blue-100 text-blue-700",
    other: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-semibold text-base">
            {en ? "🍽️ Meal Planning by Table" : "🍽️ Kế Hoạch Ăn Uống Theo Bàn"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {en
              ? "Dietary requirements summary for caterers"
              : "Tóm tắt yêu cầu ăn uống cho nhà cung cấp"}
          </p>
        </div>
        <Button size="sm" onClick={exportToCSV} className="h-8 px-3 gap-2">
          <Download className="w-3 h-3" />
          {en ? "Export CSV" : "Xuất CSV"}
        </Button>
      </div>

      {tables.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <span className="text-4xl mb-2">🍽️</span>
          <p className="text-sm text-muted-foreground">
            {en ? "Create tables first to plan meals" : "Tạo bàn trước để lập kế hoạch ăn uống"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className={`rounded-lg p-3 text-center ${MEAL_COLORS.standard}`}>
              <p className="text-lg font-bold">{totals.standard}</p>
              <p className="text-xs">{en ? "Standard" : "Thường"}</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${MEAL_COLORS.vegetarian}`}>
              <p className="text-lg font-bold">{totals.vegetarian}</p>
              <p className="text-xs">{en ? "Vegetarian" : "Chay"}</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${MEAL_COLORS.halal}`}>
              <p className="text-lg font-bold">{totals.halal}</p>
              <p className="text-xs">Halal</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${MEAL_COLORS.kids}`}>
              <p className="text-lg font-bold">{totals.kids}</p>
              <p className="text-xs">{en ? "Kids" : "Trẻ em"}</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${MEAL_COLORS.other}`}>
              <p className="text-lg font-bold">{totals.other}</p>
              <p className="text-xs">{en ? "Other" : "Khác"}</p>
            </div>
          </div>

          <div className="space-y-2">
            {tableStats.map((stat) => (
              <div
                key={stat.tableId}
                className="rounded-lg bg-[var(--theme-surface-muted)] border border-[var(--theme-border)] p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{stat.tableName}</span>
                    <span className="text-xs text-muted-foreground">
                      {stat.assigned}/{stat.capacity}
                    </span>
                  </div>
                  {stat.assigned > 0 && (
                    <div className="flex gap-1.5">
                      {stat.meals.standard > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded ${MEAL_COLORS.standard}`}>
                          {stat.meals.standard}
                        </span>
                      )}
                      {stat.meals.vegetarian > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded ${MEAL_COLORS.vegetarian}`}>
                          {stat.meals.vegetarian} 🌱
                        </span>
                      )}
                      {stat.meals.halal > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded ${MEAL_COLORS.halal}`}>
                          {stat.meals.halal} 🕋
                        </span>
                      )}
                      {stat.meals.kids > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded ${MEAL_COLORS.kids}`}>
                          {stat.meals.kids} 👶
                        </span>
                      )}
                      {stat.meals.other > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded ${MEAL_COLORS.other}`}>
                          {stat.meals.other} ⚠️
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {stat.meals.otherDetails.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[var(--theme-border)]">
                    <p className="text-xs font-medium text-amber-700 mb-1">
                      {en ? "Special dietary notes:" : "Ghi chú ăn uống đặc biệt:"}
                    </p>
                    <div className="space-y-0.5">
                      {stat.meals.otherDetails.map((detail, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">
                          • {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
