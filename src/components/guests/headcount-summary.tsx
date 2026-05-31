import type { Guest } from "@/types/wedding";

interface HeadcountSummaryProps {
  guests: Guest[];
  lang?: string;
}

/** Common dietary labels for Vietnamese weddings */
const DIETARY_LABELS: Record<string, Record<string, string>> = {
  chay: { vi: "Chay", en: "Vegetarian" },
  halal: { vi: "Halal", en: "Halal" },
  vegan: { vi: "Vegan", en: "Vegan" },
};

function getDietaryLabel(dietary: string, lang: string): string {
  const lower = (dietary || "").toLowerCase().trim();
  return DIETARY_LABELS[lower]?.[lang] ?? (dietary || "-");
}

/** Count meals per dietary category */
function countByDietary(guests: Guest[], lang: string): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const g of guests) {
    const key = (g.dietary || "").toLowerCase().trim() || "normal";
    map.set(key, (map.get(key) || 0) + 1);
    // Count +1 as additional meal with same dietary preference
    if (g.plusOneName) {
      map.set(key, (map.get(key) || 0) + 1);
    }
  }

  const result: { label: string; count: number }[] = [];
  const en = lang === "en";

  for (const [key, count] of map) {
    if (key === "normal") {
      result.push({ label: en ? "Standard" : "Tiêu chuẩn", count });
    } else {
      result.push({ label: getDietaryLabel(key, lang), count });
    }
  }

  return result;
}

export function HeadcountSummary({ guests, lang = "vi" }: HeadcountSummaryProps) {
  const en = lang === "en";

  // Base guest count (rows in guest list)
  const totalGuests = guests.length;
  // Plus-ones
  const plusOnes = guests.filter((g) => g.plusOneName).length;
  // Total meals (each guest = 1 meal, +1 = additional meal)
  const totalMeals = totalGuests + plusOnes;

  // Count by side
  const bySide = [
    { label: en ? "Groom's side" : "Nhà trai", count: guests.filter((g) => g.side === "trai").length },
    { label: en ? "Bride's side" : "Nhà gái", count: guests.filter((g) => g.side === "gai").length },
    { label: en ? "Other" : "Khác", count: guests.filter((g) => g.side !== "trai" && g.side !== "gai").length },
  ].filter((s) => s.count > 0);

  const dietaryBreakdown = countByDietary(guests, lang);

  if (totalGuests === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 space-y-3">
      <h3 className="text-sm font-semibold" style={{ color: "var(--theme-primary)" }}>
        {en ? "📊 Headcount Summary" : "📊 Tóm tắt số lượng"}
      </h3>

      {/* Main stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-blue-600">{totalGuests}</div>
          <div className="text-[10px] text-blue-500">{en ? "Guests" : "Khách mời"}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-purple-600">{plusOnes}</div>
          <div className="text-[10px] text-purple-500">{en ? "+1s" : "Người đi kèm"}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-green-600">{totalMeals}</div>
          <div className="text-[10px] text-green-500">{en ? "Total meals" : "Tổng suất ăn"}</div>
        </div>
      </div>

      {/* Side breakdown */}
      {bySide.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">
            {en ? "By side" : "Theo bên"}
          </p>
          <div className="flex gap-2 text-xs">
            {bySide.map((s) => (
              <span key={s.label} className="bg-muted px-2 py-0.5 rounded-full">
                {s.label}: <b>{s.count}</b>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dietary breakdown */}
      {dietaryBreakdown.length > 0 && dietaryBreakdown.some((d) => d.label !== (en ? "Standard" : "Tiêu chuẩn")) && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">
            {en ? "By dietary need" : "Theo chế độ ăn"}
          </p>
          <div className="space-y-1">
            {dietaryBreakdown.map((d) => (
              <div key={d.label} className="flex items-center justify-between text-xs">
                <span className={d.label === (en ? "Standard" : "Tiêu chuẩn") ? "text-muted-foreground" : "text-amber-600 font-medium"}>
                  {d.label}
                </span>
                <span className="font-semibold">{d.count} <span className="text-muted-foreground font-normal">{en ? "meals" : "suất"}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
