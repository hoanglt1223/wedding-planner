/**
 * Generate and download an .ics calendar file from wedding timeline data.
 *
 * ICS spec: https://www.rfc-editor.org/rfc/rfc5545
 * We use VEVENT with DTSTART/DTEND in local time (no TZID — floating).
 */

import type { TimelineEntry, CoupleInfo } from "@/types/wedding";

/** Escape special chars per RFC 5545 text value rules */
function esc(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/** "HH:mm" + date → "YYYYMMDDTHHmmss" */
function toICSDateTime(date: string, time: string): string {
  const [y, m, d] = date.split("-");
  const [hh, mm] = time.split(":");
  return `${y}${m}${d}T${hh}${mm}00`;
}

/** "YYYY-MM-DD" → "YYYYMMDD" (all-day event) */
function toICSDate(date: string): string {
  return date.replace(/-/g, "");
}

/** Generate a UID for each event (stable across exports) */
function makeUID(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return `wp-${Math.abs(hash).toString(36)}@wedding-planner`;
}

interface CalendarEvent {
  summary: string;
  description?: string;
  location?: string;
  dtStart: string; // "YYYYMMDDTHHmmss" or "YYYYMMDD"
  dtEnd?: string;
  allDay?: boolean;
  category?: string;
}

function buildEvent(e: CalendarEvent): string {
  const lines: string[] = [
    "BEGIN:VEVENT",
    `UID:${makeUID(e.dtStart + e.summary)}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
  ];

  if (e.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${e.dtStart}`);
    if (e.dtEnd) lines.push(`DTEND;VALUE=DATE:${e.dtEnd}`);
  } else {
    lines.push(`DTSTART:${e.dtStart}`);
    if (e.dtEnd) lines.push(`DTEND:${e.dtEnd}`);
  }

  lines.push(`SUMMARY:${esc(e.summary)}`);
  if (e.description) lines.push(`DESCRIPTION:${esc(e.description)}`);
  if (e.location) lines.push(`LOCATION:${esc(e.location)}`);
  if (e.category) lines.push(`CATEGORIES:${esc(e.category)}`);

  lines.push("END:VEVENT");
  return lines.join("\r\n");
}

/** Add 1 hour to an "HH:mm" time string */
function addOneHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const newH = (h + 1) % 24;
  return `${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Add 1 day to a "YYYYMMDD" date string */
function addOneDay(icsDate: string): string {
  const y = Number(icsDate.slice(0, 4));
  const m = Number(icsDate.slice(4, 6)) - 1;
  const d = Number(icsDate.slice(6, 8));
  const dt = new Date(y, m, d + 1);
  const yy = String(dt.getFullYear());
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

/** Build a category label for timeline entry categories */
function categoryLabel(cat: string, lang: string): string {
  const labels: Record<string, Record<string, string>> = {
    ceremony: { vi: "Lễ cưới", en: "Ceremony" },
    reception: { vi: "Tiệc cưới", en: "Reception" },
    prep: { vi: "Chuẩn bị", en: "Preparation" },
    other: { vi: "Khác", en: "Other" },
  };
  return labels[cat]?.[lang] ?? cat;
}

/**
 * Export wedding schedule as .ics file and trigger download.
 *
 * Includes:
 * - Wedding day as an all-day event
 * - Each timeline entry as a timed event
 * - Engagement / betrothal dates if set
 */
export function exportWeddingCalendar(
  info: CoupleInfo,
  timelineEntries: TimelineEntry[],
  lang: string,
): void {
  const events: CalendarEvent[] = [];
  const coupleName =
    info.groom && info.bride
      ? `${info.groom} & ${info.bride}`
      : lang === "en"
        ? "Wedding Day"
        : "Ngày cưới";

  // 1. Wedding day — all-day event
  if (info.date) {
    events.push({
      summary: lang === "en" ? `💍 ${coupleName}'s Wedding Day` : `💍 Ngày cưới ${coupleName}`,
      description:
        lang === "en"
          ? "The big day! Check the wedding planner app for the full schedule."
          : "Ngày trọng đại! Xem ứng dụng để biết lịch trình chi tiết.",
      dtStart: toICSDate(info.date),
      dtEnd: addOneDay(toICSDate(info.date)),
      allDay: true,
    });
  }

  // 2. Engagement ceremony
  if (info.engagementDate) {
    events.push({
      summary: lang === "en" ? "💍 Engagement Ceremony" : "💍 Lễ ăn hỏi",
      dtStart: toICSDate(info.engagementDate),
      dtEnd: addOneDay(toICSDate(info.engagementDate)),
      allDay: true,
      category: lang === "en" ? "Ceremony" : "Lễ cưới",
    });
  }

  // 3. Betrothal ceremony
  if (info.betrothalDate) {
    events.push({
      summary: lang === "en" ? "🎁 Betrothal Ceremony" : "🎁 Lễ đính hôn",
      dtStart: toICSDate(info.betrothalDate),
      dtEnd: addOneDay(toICSDate(info.betrothalDate)),
      allDay: true,
      category: lang === "en" ? "Ceremony" : "Lễ cưới",
    });
  }

  // 4. Timeline entries (wedding day schedule)
  const weddingDate = info.date || new Date().toISOString().slice(0, 10);
  for (const entry of timelineEntries) {
    const catLabel = categoryLabel(entry.category, lang);
    const descParts: string[] = [];
    if (entry.location) descParts.push(`${lang === "en" ? "Location" : "Địa điểm"}: ${entry.location}`);
    if (entry.responsible) descParts.push(`${lang === "en" ? "Responsible" : "Phụ trách"}: ${entry.responsible}`);
    if (entry.notes) descParts.push(entry.notes);

    events.push({
      summary: `${entry.title}`,
      description: descParts.length > 0 ? descParts.join("\n") : undefined,
      location: entry.location,
      dtStart: toICSDateTime(weddingDate, entry.time),
      dtEnd: toICSDateTime(weddingDate, addOneHour(entry.time)),
      category: catLabel,
    });
  }

  // Build .ics content
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(coupleName + (lang === "en" ? " Wedding" : " Đám cưới"))}`,
    ...events.map(buildEvent),
    "END:VCALENDAR",
  ].join("\r\n");

  // Trigger download
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wedding-schedule.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
