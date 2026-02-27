import type { WebsiteSettings, TimelineEntry } from "@/types/wedding";

export interface PublicWeddingData {
  couple: {
    bride: string;
    groom: string;
    date: string;
  };
  theme: string;
  websiteSettings: WebsiteSettings;
  rsvpSettings: {
    venue: string;
    venueAddress: string;
    venueMapLink: string;
    coupleStory: string;
  };
  timelineEntries: TimelineEntry[];
  photos: { url: string; tag: string }[];
  lang: string;
}

/** Fetch public wedding data by slug from the API. Returns null if not found. */
export async function fetchPublicWedding(slug: string): Promise<PublicWeddingData | null> {
  try {
    const res = await fetch(`/api/website?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const json = await res.json() as { found: boolean; data?: PublicWeddingData };
    if (!json.found || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
}
