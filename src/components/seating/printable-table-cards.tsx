import type { Guest, SeatingTable } from "@/types/wedding";

interface DietaryBadge {
  type: string;
  labelVi: string;
  labelEn: string;
  color: string;
}

const DIETARY_BADGES: DietaryBadge[] = [
  { type: "chay", labelVi: "Chay", labelEn: "Veg", color: "bg-green-100 text-green-700" },
  { type: "halal", labelVi: "Halal", labelEn: "Halal", color: "bg-purple-100 text-purple-700" },
  { type: "không gluten", labelVi: "Không gluten", labelEn: "GF", color: "bg-yellow-100 text-yellow-700" },
];

interface PrintableTableCardsProps {
  tables: SeatingTable[];
  guests: Guest[];
  lang: "vi" | "en";
  themeColors: {
    primary: string;
    accent: string;
    surface: string;
    themeBorder: string;
  };
}

export function PrintableTableCards({ tables, guests, lang, themeColors }: PrintableTableCardsProps) {
  const en = lang === "en";

  // Create guest lookup map
  const guestMap = new Map<number, Guest>();
  guests.forEach((g) => guestMap.set(g.id, g));

  // Filter tables that have guests assigned
  const populatedTables = tables.filter((t) => t.guestIds.length > 0);

  return (
    <div className="printable-table-cards">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-table-cards, .printable-table-cards * {
            visibility: visible;
          }
          .printable-table-cards {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .table-card {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
        @page {
          size: A4 landscape;
          margin: 10mm;
        }
      `}</style>

      <div className="grid grid-cols-2 gap-4 p-4">
        {populatedTables.map((table, idx) => {
          const tableGuests = table.guestIds
            .map((id) => guestMap.get(id))
            .filter(Boolean) as Guest[];

          return (
            <div
              key={table.id}
              className="table-card rounded-lg border-2 p-4"
              style={{
                borderColor: themeColors.themeBorder,
                backgroundColor: themeColors.surface,
                minHeight: "350px",
              }}
            >
              {/* Table Header */}
              <div className="text-center mb-3 pb-2 border-b-2" style={{ borderColor: themeColors.primary }}>
                <h2 className="text-xl font-bold mb-1" style={{ color: themeColors.primary }}>
                  {table.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {en ? `Table ${idx + 1}` : `Bàn ${idx + 1}`} · {table.guestIds.length}/{table.capacity} {en ? "guests" : "khách"}
                </p>
              </div>

              {/* Guest List */}
              <div className="space-y-1.5">
                {tableGuests.map((guest) => (
                  <div key={guest.id} className="flex items-start gap-2 text-sm">
                    <span className="font-medium">{guest.name}</span>
                    {guest.dietary && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium">
                        {en ? "Dietary" : "Ăn kiêng"}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-3 pt-2 border-t text-center text-xs text-muted-foreground" style={{ borderColor: themeColors.themeBorder }}>
                {en ? "Wedding Seating Card" : "Thẻ Chỗ Ngồi Tiệc Cưới"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
