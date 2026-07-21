/**
 * Export Buttons Component
 * Button group for exporting itinerary to different formats
 */

import { FileText, Calendar, Download } from "lucide-react";
import { downloadPDF, downloadICS } from "@/lib/itinerary-export";
import type { ItineraryItem } from "@/data/wedding-itinerary";
import type { AppTheme } from "@/data/themes";

interface ExportButtonsProps {
  items: ItineraryItem[];
  brideName: string;
  groomName: string;
  weddingDate: string;
  lang: "vi" | "en";
  theme: AppTheme;
  disabled?: boolean;
}

export function ExportButtons({
  items,
  brideName,
  groomName,
  weddingDate,
  lang,
  theme,
  disabled = false,
}: ExportButtonsProps) {
  const en = lang === "en";

  const handlePDFExport = async () => {
    if (items.length === 0) {
      alert(en ? "No items to export" : "Không có mục nào để xuất");
      return;
    }

    try {
      await downloadPDF(items, { brideName, groomName, weddingDate, lang, theme });
    } catch (error) {
      console.error("PDF export failed:", error);
      alert(en ? "Failed to export PDF" : "Xuất PDF thất bại");
    }
  };

  const handleICSExport = () => {
    if (items.length === 0) {
      alert(en ? "No items to export" : "Không có mục nào để xuất");
      return;
    }

    try {
      downloadICS(items, { brideName, groomName, weddingDate, lang, theme });
    } catch (error) {
      console.error("ICS export failed:", error);
      alert(en ? "Failed to export calendar" : "Xuất lịch thất bại");
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={handlePDFExport}
        disabled={disabled || items.length === 0}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={en ? "Export as PDF document" : "Xuất tài liệu PDF"}
      >
        <FileText className="w-4 h-4" />
        <span>{en ? "PDF" : "PDF"}</span>
      </button>

      <button
        onClick={handleICSExport}
        disabled={disabled || items.length === 0}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={en ? "Export to calendar app" : "Xuất vào ứng dụng lịch"}
      >
        <Calendar className="w-4 h-4" />
        <span>{en ? "Calendar" : "Lịch"}</span>
      </button>

      <button
        onClick={() => {
          const sortedItems = [...items].sort((a, b) => a.startTime.localeCompare(b.startTime));
          let text = `${en ? "WEDDING DAY ITINERARY" : "LỊCH TRÌNH NGÀY CƯỚI"}\n`;
          text += `${"=".repeat(40)}\n\n`;
          text += `${brideName} & ${groomName}\n`;
          text += `${weddingDate}\n\n`;

          sortedItems.forEach((item) => {
            const activity = en ? item.activityEn : item.activity;
            const location = en ? item.locationEn : item.location;
            const notes = en ? item.notesEn : item.notes;

            text += `${item.startTime} - ${activity}\n`;
            if (location) text += `📍 ${location}\n`;
            if (item.responsible?.length) text += `👥 ${item.responsible.join(", ")}\n`;
            if (notes) text += `📝 ${notes}\n`;
            text += "\n";
          });

          const blob = new Blob([text], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `wedding-itinerary-${lang === "en" ? "en" : "vi"}.txt`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        disabled={disabled || items.length === 0}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={en ? "Export as text file" : "Xuất tệp văn bản"}
      >
        <Download className="w-4 h-4" />
        <span>{en ? "Text" : "Văn bản"}</span>
      </button>
    </div>
  );
}
