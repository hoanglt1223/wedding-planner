import { useState } from "react";
import type { Guest, SeatingTable } from "@/types/wedding";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { PrintableTableCards } from "./printable-table-cards";

interface TableCardGeneratorProps {
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

export function TableCardGenerator({ tables, guests, lang, themeColors }: TableCardGeneratorProps) {
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const en = lang === "en";

  // Filter tables that have guests assigned
  const populatedTables = tables.filter((t) => t.guestIds.length > 0);

  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    // Create a simple text-based backup
    const content = populatedTables
      .map((table, idx) => {
        const tableGuests = table.guestIds
          .map((id) => guests.find((g) => g.id === id)?.name)
          .filter(Boolean);
        return `${table.name} (${table.guestIds.length}/${table.capacity}):\n${tableGuests.map((name) => `  - ${name}`).join("\n")}`;
      })
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seating-cards-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (showPrintPreview) {
    return (
      <div className="space-y-3">
        {/* Print controls */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg no-print">
          <div>
            <h3 className="font-semibold text-sm">{t("Xem trước bàn in", lang)}</h3>
            <p className="text-xs text-muted-foreground">
              {en ? `${populatedTables.length} ${t("bàn sẵn sàng in", "en")}` : `${populatedTables.length} ${t("bàn sẵn sàng in", "vi")}`}
            </p>
          </div>
          <div className="flex gap-2 no-print">
            <Button size="sm" variant="outline" onClick={() => setShowPrintPreview(false)}>
              {t("Quay lại", lang)}
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownload}>
              📥 {en ? "Download TXT" : "Tải TXT"}
            </Button>
            <Button size="sm" onClick={handlePrint}>
              🖨️ {t("In", lang)}
            </Button>
          </div>
        </div>

        {/* Printable cards */}
        <PrintableTableCards
          tables={populatedTables}
          guests={guests}
          lang={lang}
          themeColors={themeColors}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border-2 border-dashed">
      <div>
        <h3 className="font-semibold text-sm">{t("🖨️ In thẻ bàn", lang)}</h3>
        <p className="text-xs text-muted-foreground">
          {en
            ? `${populatedTables.length} tables · ${populatedTables.reduce((sum, t) => sum + t.guestIds.length, 0)} guests`
            : `${populatedTables.length} bàn · ${populatedTables.reduce((sum, t) => sum + t.guestIds.length, 0)} khách`}
        </p>
      </div>
      <Button
        size="sm"
        onClick={() => setShowPrintPreview(true)}
        disabled={populatedTables.length === 0}
      >
        {t("In thẻ bàn", lang)}
      </Button>
    </div>
  );
}
