/**
 * iCalendar (.ics) File Generator
 * Creates iCal format files for wedding calendar export
 */

import type { TimelineEntry, VendorPayment } from "@/types/wedding";

interface ICalEvent {
  startDate: Date;
  endDate?: Date;
  title: string;
  description?: string;
  location?: string;
  url?: string;
  reminders?: number[]; // Minutes before event (e.g., [1440, 60, 10] for 1 day, 1 hour, 10 min)
}

/**
 * Format date for iCal format (YYYYMMDDTHHmmssZ)
 */
function formatDateToICal(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Escape text for iCal format
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/"/g, '\\"');
}

/**
 * Generate a single VEVENT block
 */
function generateEvent(event: ICalEvent): string {
  const start = formatDateToICal(event.startDate);
  const end = event.endDate ? formatDateToICal(event.endDate) : start;
  const timestamp = formatDateToICal(new Date());

  let eventBlock = [
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `DTSTAMP:${timestamp}`,
    `UID:${Date.now()}-${Math.random().toString(36).substr(2, 9)}@weddingplanner.com`,
    `SUMMARY:${escapeICalText(event.title)}`,
  ];

  if (event.description) {
    eventBlock.push(`DESCRIPTION:${escapeICalText(event.description)}`);
  }

  if (event.location) {
    eventBlock.push(`LOCATION:${escapeICalText(event.location)}`);
  }

  if (event.url) {
    eventBlock.push(`URL:${event.url}`);
  }

  // Add reminders
  if (event.reminders && event.reminders.length > 0) {
    event.reminders.forEach(minutes => {
      eventBlock.push(
        'BEGIN:VALARM',
        `ACTION:DISPLAY`,
        `TRIGGER:-PT${minutes}M`,
        `DESCRIPTION:Reminder`,
        'END:VALARM'
      );
    });
  }

  eventBlock.push('END:VEVENT');

  return eventBlock.join('\r\n');
}

/**
 * Generate complete iCal file content
 */
export function generateICalContent(
  events: ICalEvent[],
  calendarName: string = "Wedding Planner"
): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WeddingPlanner//Wedding Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICalText(calendarName)}`,
    `X-WR-TIMEZONE:${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
    ...events.map(event => generateEvent(event)),
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Create iCal events from wedding timeline
 */
export function createTimelineEvents(
  timeline: TimelineEntry[],
  weddingDate: string,
  lang: string
): ICalEvent[] {
  const weddingDateObj = new Date(weddingDate);

  return timeline.map(entry => {
    // Parse time (format: "14:30" or "2:30 PM")
    const [hours, minutes] = entry.time.split(':').map(s => parseInt(s.trim()));
    const eventDate = new Date(weddingDateObj);
    eventDate.setHours(hours, minutes, 0, 0);

    return {
      startDate: eventDate,
      title: entry.title,
      description: entry.notes ? entry.notes : undefined,
      location: entry.location,
      reminders: [1440, 60] // 1 day and 1 hour before
    };
  });
}

/**
 * Create iCal events from payment schedule
 */
export function createPaymentEvents(
  payments: VendorPayment[],
  lang: string
): ICalEvent[] {
  return payments.map(payment => {
    const labels = lang === "vi" ? {
      title: `Thanh toán: ${payment.vendorName}`,
      description: `Số tiền: ${payment.amount.toLocaleString('vi-VN')} đ\nGhi chú: ${payment.note || 'Không có'}`
    } : {
      title: `Payment: ${payment.vendorName}`,
      description: `Amount: ${payment.amount.toLocaleString('en-US')}\nNotes: ${payment.note || 'None'}`
    };

    return {
      startDate: new Date(payment.dueDate),
      title: labels.title,
      description: labels.description,
      reminders: [10080, 1440, 60] // 1 week, 1 day, 1 hour before
    };
  });
}

/**
 * Create milestone events (wedding day, RSVP deadlines, etc)
 */
export function createMilestoneEvents(
  weddingDate: string,
  lang: string
): ICalEvent[] {
  const events: ICalEvent[] = [];
  const weddingDateObj = new Date(weddingDate);

  // Wedding day event (all day)
  events.push({
    startDate: weddingDateObj,
    title: lang === "vi" ? "💒 Ngày cưới" : "💒 Wedding Day",
    description: lang === "vi" ? "Ngày trọng đại của hai bạn!" : "Your big day!",
    reminders: [43200, 10080, 1440, 60] // 30 days, 1 week, 1 day, 1 hour
  });

  // Pre-wedding reminders
  const reminderDates = [
    { days: 90, labelVi: "90 ngày", labelEn: "90 days" },
    { days: 60, labelVi: "60 ngày", labelEn: "60 days" },
    { days: 30, labelVi: "30 ngày", labelEn: "30 days" },
    { days: 14, labelVi: "2 tuần", labelEn: "2 weeks" },
    { days: 7, labelVi: "1 tuần", labelEn: "1 week" },
    { days: 1, labelVi: "1 ngày", labelEn: "1 day" }
  ];

  reminderDates.forEach(({ days, labelVi, labelEn }) => {
    const reminderDate = new Date(weddingDateObj);
    reminderDate.setDate(reminderDate.getDate() - days);

    events.push({
      startDate: reminderDate,
      title: lang === "vi" ? `💒 Còn ${labelVi} nữa!` : `💒 ${labelEn} to go!`,
      description: lang === "vi"
        ? `Kiểm tra lại mọi thứ đã sẵn sàng chưa?`
        : `Check if everything is ready!`,
      reminders: [1440] // 1 day before the reminder
    });
  });

  return events;
}

/**
 * Download iCal file
 */
export function downloadICalFile(content: string, filename: string = "wedding-calendar.ics"): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
