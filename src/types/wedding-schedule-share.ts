/**
 * Wedding Schedule Share Types
 * Shareable wedding day timeline for vendors and family
 */

export interface ScheduleShareSettings {
  enabled: boolean;
  shareToken: string;
  password?: string;           // Optional password protection
  expiryDate?: string;         // Optional expiry date
  showContactInfo: boolean;    // Show contact information
  showVendorNotes: boolean;    // Show vendor-specific notes
  allowDownload: boolean;      // Allow PDF download
  customMessage?: string;      // Custom message for recipients
  lastUpdated: string;         // ISO timestamp
}

export interface ScheduleShareView {
  scheduleId: string;
  weddingDate: string;
  coupleNames: string;
  timeline: TimelineEntry[];
  contacts: ScheduleContact[];
  venues: ScheduleVenue[];
  notes?: string;
  lang: "vi" | "en";
}

export interface ScheduleContact {
  role: string;
  name: string;
  phone: string;
  email?: string;
}

export interface ScheduleVenue {
  name: string;
  address: string;
  time: string;
  coordinates?: string;        // For map links
}

export interface TimelineEntry {
  id: number;
  time: string;
  title: string;
  location?: string;
  responsible?: string;
  notes?: string;
  category: "ceremony" | "reception" | "prep" | "other";
}