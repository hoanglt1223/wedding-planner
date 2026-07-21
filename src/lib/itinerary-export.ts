/**
 * Itinerary Export Utilities
 * Export wedding day itinerary to PDF and ICS formats
 */

import type { ItineraryItem } from "@/data/wedding-itinerary";
import type { AppTheme } from "@/data/themes";

interface ExportContext {
  brideName: string;
  groomName: string;
  weddingDate: string;
  lang: "vi" | "en";
  theme: AppTheme;
}

/**
 * Generate ICS (iCalendar) file content from itinerary items
 */
export function generateICSContent(
  items: ItineraryItem[],
  ctx: ExportContext
): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WeddingPlanner//Wedding Itinerary//VN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  const sortedItems = [...items].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  sortedItems.forEach((item) => {
    const activity = ctx.lang === "en" ? item.activityEn : item.activity;
    const location = ctx.lang === "en" ? item.locationEn : item.location;
    const notes = ctx.lang === "en" ? item.notesEn : item.notes;

    // Parse start time (HH:MM format)
    const [startHour, startMin] = item.startTime.split(":").map(Number);

    // Calculate end time (default 1 hour duration if not specified)
    const endHour = startHour + 1;

    // Format date for ICS (YYYYMMDD)
    const dateObj = new Date(ctx.weddingDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    const startDate = `${year}${month}${day}`;
    const startTime = String(startHour).padStart(2, "0") + String(startMin).padStart(2, "0");
    const endTime = String(endHour).padStart(2, "0") + String(startMin).padStart(2, "0");

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${item.id}@weddingplanner`);
    lines.push(`DTSTART:${startDate}T${startTime}00`);
    lines.push(`DTEND:${startDate}T${endTime}00`);
    lines.push(`SUMMARY:${escapeICS(activity)}`);

    if (location) {
      lines.push(`LOCATION:${escapeICS(location)}`);
    }

    const description = notes ? `${escapeICS(notes)}` : "";
    if (description) {
      lines.push(`DESCRIPTION:${description}`);
    }

    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/**
 * Escape special characters for ICS format
 */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .substring(0, 60); // Limit length for ICS compatibility
}

/**
 * Download ICS file
 */
export function downloadICS(items: ItineraryItem[], ctx: ExportContext): void {
  const content = generateICSContent(items, ctx);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wedding-itinerary-${ctx.weddingDate}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Generate HTML content for PDF export
 */
export function generatePDFHTML(
  items: ItineraryItem[],
  ctx: ExportContext
): string {
  const en = ctx.lang === "en";
  const sortedItems = [...items].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  const primaryColor = ctx.theme.primary || "#d4af37";
  const surfaceColor = ctx.theme.surface || "#ffffff";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${en ? "Wedding Day Itinerary" : "Lịch Trình Ngày Cưới"}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: ${surfaceColor};
          color: #333;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          padding: 40px 20px;
          background: ${primaryColor};
          color: white;
        }
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
        }
        .header .couple {
          font-size: 24px;
          margin: 20px 0;
        }
        .header .date {
          font-size: 18px;
          opacity: 0.9;
        }
        .content {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px 20px;
        }
        .item {
          background: white;
          border-left: 4px solid ${primaryColor};
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .item-time {
          font-size: 20px;
          font-weight: bold;
          color: ${primaryColor};
        }
        .item-activity {
          font-size: 18px;
          font-weight: 600;
          margin: 8px 0;
        }
        .item-location {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }
        .item-responsible {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }
        .item-notes {
          font-size: 14px;
          color: #888;
          margin: 8px 0;
          font-style: italic;
        }
        .footer {
          text-align: center;
          padding: 30px;
          color: #666;
          font-size: 14px;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${en ? "Wedding Day Itinerary" : "Lịch Trình Ngày Cưới"}</h1>
        <div class="couple">${ctx.brideName} & ${ctx.groomName}</div>
        <div class="date">${formatWeddingDate(ctx.weddingDate, ctx.lang)}</div>
      </div>

      <div class="content">
        ${sortedItems.map((item) => {
          const activity = en ? item.activityEn : item.activity;
          const location = en ? item.locationEn : item.location;
          const notes = en ? item.notesEn : item.notes;

          return `
            <div class="item">
              <div class="item-time">${item.startTime}</div>
              <div class="item-activity">${activity}</div>
              ${location ? `<div class="item-location">📍 ${location}</div>` : ""}
              ${item.responsible?.length ? `<div class="item-responsible">👥 ${item.responsible.join(", ")}</div>` : ""}
              ${notes ? `<div class="item-notes">📝 ${notes}</div>` : ""}
            </div>
          `;
        }).join("\n        ")}
      </div>

      <div class="footer">
        ${en ? "Generated by Wedding Planner" : "Được tạo bởi Wedding Planner"}
      </div>
    </body>
    </html>
  `;
}

/**
 * Format wedding date for display
 */
function formatWeddingDate(dateStr: string, lang: "vi" | "en"): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", options);
}

/**
 * Download itinerary as PDF
 */
export async function downloadPDF(
  items: ItineraryItem[],
  ctx: ExportContext
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const html2canvas = await import("html2canvas-pro");

  // Create a temporary container
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "210mm"; // A4 width
  document.body.appendChild(container);

  try {
    // Generate HTML content
    container.innerHTML = generatePDFHTML(items, ctx);

    // Convert to canvas
    const canvas = await html2canvas.default(container.firstChild as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`wedding-itinerary-${ctx.weddingDate}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
