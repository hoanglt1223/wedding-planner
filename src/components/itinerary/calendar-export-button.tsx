/**
 * Calendar Export Button Component
 * Allows users to export wedding itinerary as .ics file
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Loader2 } from "lucide-react";
import {
  generateICSContent,
  downloadICSFile,
  generateCalendarFilename,
  timeToISODate,
  type ItineraryEvent,
} from "@/lib/calendar-export";
import type { ItineraryItem } from "@/data/wedding-itinerary";
import { calculateEndTime } from "@/data/wedding-itinerary";

interface CalendarExportButtonProps {
  items: ItineraryItem[];
  brideName: string;
  groomName: string;
  weddingDate: string;
  lang?: "en" | "vi";
  disabled?: boolean;
}

export function CalendarExportButton({
  items,
  brideName,
  groomName,
  weddingDate,
  lang = "vi",
  disabled = false,
}: CalendarExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = () => {
    if (items.length === 0) return;

    setIsExporting(true);

    try {
      // Convert ItineraryItem to ItineraryEvent format
      const events: ItineraryEvent[] = items.map((item) => {
        // Convert HH:MM time format to ISO datetime
        const startTime = timeToISODate(item.startTime, weddingDate);
        const endTimeStr = calculateEndTime(item.startTime, item.duration);
        const endTime = timeToISODate(endTimeStr, weddingDate);

        return {
          id: item.id,
          title: item.activity,
          titleEn: item.activityEn,
          startTime,
          endTime,
          location: item.location,
          locationEn: item.locationEn,
          description: item.notes,
          descriptionEn: item.notesEn,
          category: item.category,
        };
      });

      // Generate iCalendar content
      const icsContent = generateICSContent(events, {
        brideName,
        groomName,
        weddingDate,
        lang,
      });

      // Generate filename and trigger download
      const filename = generateCalendarFilename(
        brideName || "bride",
        groomName || "groom",
        weddingDate
      );

      downloadICSFile(icsContent, filename);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to export calendar:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const text = {
    en: {
      buttonText: "Export to Calendar",
      buttonLoading: "Exporting...",
      successMessage: "Calendar file downloaded!",
      noItems: "No items to export",
      tooltip: "Download as .ics file for Google Calendar, Apple Calendar, Outlook",
    },
    vi: {
      buttonText: "Xuất Lịch ra Calendar",
      buttonLoading: "Đang xuất...",
      successMessage: "Đã tải file lịch!",
      noItems: "Không có mục nào để xuất",
      tooltip: "Tải xuống định dạng .ics cho Google Calendar, Apple Calendar, Outlook",
    },
  };

  const t = text[lang];

  if (items.length === 0) {
    return (
      <Button variant="outline" disabled className="w-full">
        <Calendar className="mr-2 h-4 w-4" />
        {t.noItems}
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={handleExport}
        disabled={disabled || isExporting}
        variant="default"
        className="w-full"
        title={t.tooltip}
      >
        {isExporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        {isExporting ? t.buttonLoading : t.buttonText}
      </Button>

      {showSuccess && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-lg text-sm whitespace-nowrap animate-in slide-in-from-bottom-2 fade-in-0 zoom-in-95">
          {t.successMessage}
        </div>
      )}
    </div>
  );
}
