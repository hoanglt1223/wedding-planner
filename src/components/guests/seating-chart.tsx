import type { Guest } from "@/types/wedding";
import { t } from "@/lib/i18n";

interface SeatingChartProps {
  guests: Guest[];
  lang?: string;
}

export function SeatingChart({ guests, lang = "vi" }: SeatingChartProps) {
  // Group guests by their g (group/table) field
  const tables = new Map<string, Guest[]>();
  const ungrouped: Guest[] = [];

  guests.forEach((g) => {
    const table = g.tableGroup?.trim();
    if (!table) {
      ungrouped.push(g);
    } else {
      if (!tables.has(table)) tables.set(table, []);
      tables.get(table)!.push(g);
    }
  });

  const sortedTables = Array.from(tables.entries()).sort((a, b) =>
    a[0].localeCompare(b[0], "vi")
  );

  if (guests.length === 0) {
    return (
      <div className="text-center text-sm text-gray-400 py-8">
        {lang === "en" ? "No guests yet. Add guests above to see seating chart." : "Chưa có khách mời. Thêm khách ở trên để xem sơ đồ bàn tiệc."}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-500">
        {sortedTables.length} {t("bàn/nhóm", lang)} · {guests.length} {t("khách", lang)}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {sortedTables.map(([tableName, tableGuests]) => (
          <div
            key={tableName}
            className="rounded-xl border border-amber-200 bg-amber-50/50 p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-amber-800">
                🪑 {tableName}
              </span>
              <span className="text-2xs bg-amber-200/60 text-amber-700 rounded-full px-2 py-0.5">
                {tableGuests.length} {t("người", lang)}
              </span>
            </div>
            <div className="space-y-0.5">
              {tableGuests.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <span className={g.side === "trai" ? "text-blue-500" : "text-pink-500"}>
                    {g.side === "trai" ? "♂" : "♀"}
                  </span>
                  <span className="text-gray-700 truncate">{g.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {ungrouped.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-600">
              {t("❓ Chưa xếp bàn", lang)}
            </span>
            <span className="text-2xs bg-gray-200/60 text-gray-600 rounded-full px-2 py-0.5">
              {ungrouped.length} {t("người", lang)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-2">
            {ungrouped.map((g) => (
              <div
                key={g.id}
                className="flex items-center gap-1.5 text-xs"
              >
                <span className={g.side === "trai" ? "text-blue-500" : "text-pink-500"}>
                  {g.side === "trai" ? "♂" : "♀"}
                </span>
                <span className="text-gray-500 truncate">{g.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
