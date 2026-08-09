/**
 * Calendar Export Utilities
 * Generate iCalendar (.ics) files from wedding itinerary data
 */

export interface ItineraryEvent {
  id: string;
  title: string;
  titleEn?: string;
  startTime: string; // ISO date string
  endTime?: string;  // ISO date string (optional)
  location?: string;
  locationEn?: string;
  description?: string;
  descriptionEn?: string;
  category?: string;
}

/**
 * Convert HH:MM time format and date to ISO datetime string
 */
export function timeToISODate(time: string, date: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const dateObj = date ? new Date(date) : new Date();
  dateObj.setUTCHours(hours, minutes, 0, 0);
  return dateObj.toISOString();
}

/**
 * Convert an ISO date string to iCalendar datetime format
 * Format: YYYYMMDDTHHmmssZ
 */
function toICSDateTime(isoString: string): string {
  const date = new Date(isoString);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Escape special characters for iCalendar format
 */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/"/g, '\\"');
}

/**
 * Generate iCalendar content from itinerary events
 */
export function generateICSContent(
  events: ItineraryEvent[],
  metadata: {
    weddingTitle?: string;
    brideName?: string;
    groomName?: string;
    weddingDate?: string;
    lang?: 'en' | 'vi';
  }
): string {
  const { weddingTitle, brideName, groomName, lang = 'en' } = metadata;

  const isVi = lang === 'vi';
  const title = weddingTitle || (isVi
    ? `Đám Cưới Của ${brideName} & ${groomName}`
    : `Wedding of ${brideName} & ${groomName}`
  );

  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WeddingPlanner//Wedding Itinerary//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${escapeICS(title)}
X-WR-TIMEZONE:UTC
X-WR-CALDESC:${escapeICS(isVi ? 'Lịch trình ngày cưới' : 'Wedding Day Itinerary')}
`;

  // Add each event as a VEVENT
  events.forEach((event) => {
    const start = toICSDateTime(event.startTime);
    const end = event.endTime ? toICSDateTime(event.endTime) : start;

    // Use appropriate title based on language
    const displayTitle = isVi && event.title ? event.title : (event.titleEn || event.title);

    ics += `BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
DTSTAMP:${toICSDateTime(new Date().toISOString())}
UID:${event.id}@weddingplanner
SUMMARY:${escapeICS(displayTitle)}
`;

    // Use appropriate location based on language
    if (event.location && (isVi ? event.location : event.locationEn)) {
      const displayLocation = isVi ? event.location : (event.locationEn || event.location);
      ics += `LOCATION:${escapeICS(displayLocation)}\n`;
    }

    // Use appropriate description based on language
    if (event.description && (isVi ? event.description : event.descriptionEn)) {
      const displayDescription = isVi ? event.description : (event.descriptionEn || event.description);
      ics += `DESCRIPTION:${escapeICS(displayDescription)}\n`;
    }

    if (event.category) {
      ics += `CATEGORIES:${escapeICS(event.category)}\n`;
    }

    ics += `STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
  });

  ics += `END:VCALENDAR`;

  return ics;
}

/**
 * Trigger download of .ics file
 */
export function downloadICSFile(
  content: string,
  filename: string
): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Generate filename for the calendar export
 */
export function generateCalendarFilename(
  brideName: string,
  groomName: string,
  weddingDate: string
): string {
  const date = weddingDate ? new Date(weddingDate) : new Date();
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format

  const names = [brideName, groomName]
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  return `wedding-itinerary-${names}-${dateStr}.ics`;
}