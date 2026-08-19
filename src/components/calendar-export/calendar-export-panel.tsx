/**
 * Calendar Export Panel
 * Allows users to export wedding events to external calendar systems
 */

import { useState } from "react";
import {
  generateICalContent,
  createTimelineEvents,
  createPaymentEvents,
  createMilestoneEvents,
  downloadICalFile
} from "@/lib/ical-generator";
import type { TimelineEntry, VendorPayment } from "@/types/wedding";

interface CalendarExportPanelProps {
  weddingDate: string;
  timeline?: TimelineEntry[];
  payments?: VendorPayment[];
  lang: "vi" | "en";
}

type ExportCategory = "milestones" | "timeline" | "payments" | "all";

export function CalendarExportPanel({
  weddingDate,
  timeline = [],
  payments = [],
  lang
}: CalendarExportPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<ExportCategory>("all");
  const [isExporting, setIsExporting] = useState(false);

  const labels = {
    title: lang === "vi" ? "📅 Xuất Lịch" : "📅 Export Calendar",
    description: lang === "vi"
      ? "Xuất sự kiện đám cưới của bạn vào Google Calendar, Apple Calendar, hoặc Outlook"
      : "Export your wedding events to Google Calendar, Apple Calendar, or Outlook",
    categories: {
      milestones: lang === "vi" ? "Ngày quan trọng" : "Key Milestones",
      timeline: lang === "vi" ? "Lịch trình ngày cưới" : "Wedding Timeline",
      payments: lang === "vi" ? "Lịch thanh toán" : "Payment Schedule",
      all: lang === "vi" ? "Tất cả sự kiện" : "All Events"
    },
    exportButton: lang === "vi" ? "Tải xuống .ics" : "Download .ics",
    exporting: lang === "vi" ? "Đang xuất..." : "Exporting...",
    eventsCount: lang === "vi" ? "sự kiện" : "events",
    noEvents: lang === "vi" ? "Chưa có sự kiện" : "No events",
    successMessage: lang === "vi" ? "Đã tải xuống file lịch!" : "Calendar file downloaded!"
  };

  function getEventCount(category: ExportCategory): number {
    switch (category) {
      case "milestones":
        // Wedding day + 6 pre-wedding reminders
        return 1 + 6;
      case "timeline":
        return timeline.length;
      case "payments":
        return payments.length;
      case "all":
        return (1 + 6) + timeline.length + payments.length;
      default:
        return 0;
    }
  }

  async function handleExport() {
    if (!weddingDate) {
      alert(lang === "vi" ? "Vui lòng nhập ngày cưới" : "Please enter wedding date");
      return;
    }

    setIsExporting(true);

    try {
      let allEvents: any[] = [];

      // Add events based on selected category
      if (selectedCategory === "milestones" || selectedCategory === "all") {
        allEvents = [...allEvents, ...createMilestoneEvents(weddingDate, lang)];
      }

      if (selectedCategory === "timeline" || selectedCategory === "all") {
        allEvents = [...allEvents, ...createTimelineEvents(timeline, weddingDate, lang)];
      }

      if (selectedCategory === "payments" || selectedCategory === "all") {
        allEvents = [...allEvents, ...createPaymentEvents(payments, lang)];
      }

      if (allEvents.length === 0) {
        alert(labels.noEvents);
        setIsExporting(false);
        return;
      }

      // Generate iCal content
      const icalContent = generateICalContent(
        allEvents,
        lang === "vi" ? "Đám Cưới" : "Wedding"
      );

      // Download file
      const filename = `wedding-${new Date().toISOString().split('T')[0]}.ics`;
      downloadICalFile(icalContent, filename);

      // Show success message
      alert(labels.successMessage);
    } catch (error) {
      console.error("Export error:", error);
      alert(lang === "vi" ? "Lỗi khi xuất lịch" : "Error exporting calendar");
    } finally {
      setIsExporting(false);
    }
  }

  const eventCount = getEventCount(selectedCategory);

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-lg">{labels.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{labels.description}</p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(labels.categories).map(([key, label]) => {
          const count = getEventCount(key as ExportCategory);
          const isSelected = selectedCategory === key;

          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as ExportCategory)}
              disabled={count === 0}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              } ${count === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {count} {labels.eventsCount}
              </div>
            </button>
          );
        })}
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting || eventCount === 0}
        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isExporting ? labels.exporting : labels.exportButton}
      </button>

      {/* Help Text */}
      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
        <p className="font-medium mb-1">
          {lang === "vi" ? "📖 Hướng dẫn:" : "📖 Guide:"}
        </p>
        <ul className="space-y-1 list-disc pl-4">
          <li>
            {lang === "vi"
              ? "Google Calendar: Mwon Calendar > Nhập (một bên trái) > Nhập từ URL"
              : "Google Calendar: Settings > Import & export > Import from ICS file"}
          </li>
          <li>
            {lang === "vi"
              ? "Apple Calendar: Nhấp đúp vào file .ics"
              : "Apple Calendar: Double-click the .ics file"}
          </li>
          <li>
            {lang === "vi"
              ? "Outlook: File > Open & Export > Open Calendar"
              : "Outlook: File > Open & Export > Open Calendar"}
          </li>
        </ul>
      </div>
    </div>
  );
}
