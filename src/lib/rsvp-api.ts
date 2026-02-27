export interface RsvpInvitation {
  id: number;
  userId: string;
  guestName: string;
  token: string;
  status: string;
  plusOnes: number;
  dietary: string | null;
  message: string | null;
  respondedAt: string | null;
  createdAt: string;
}

export interface RsvpEventData {
  guestName: string;
  status: string;
  respondedAt: string | null;
  plusOnes: number;
  dietary: string | null;
  message: string | null;
  event: {
    bride: string;
    groom: string;
    date: string;
    welcomeMessage: string;
    venue: string;
    venueAddress: string;
    venueMapLink: string;
    coupleStory: string;
  };
  themeId: string;
  lang: string;
}

export async function createRsvpTokens(
  userId: string,
  guests: { name: string }[],
  themeId: string,
  lang: string,
): Promise<{ guestName: string; token: string }[]> {
  const res = await fetch("/api/rsvp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, guests, themeId, lang }),
  });
  if (!res.ok) throw new Error("Failed to create RSVP tokens");
  const data = await res.json() as { tokens: { guestName: string; token: string }[] };
  return data.tokens;
}

export async function fetchRsvpInvitation(token: string): Promise<RsvpEventData | null> {
  const res = await fetch(`/api/rsvp?token=${encodeURIComponent(token)}`);
  if (!res.ok) return null;
  return res.json() as Promise<RsvpEventData>;
}

export async function submitRsvpResponse(
  token: string,
  status: "accepted" | "declined",
  plusOnes: number,
  dietary: string,
  message: string,
): Promise<{ ok: boolean; respondedAt?: string; error?: string }> {
  const res = await fetch("/api/rsvp/respond", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, status, plusOnes, dietary, message }),
  });
  if (!res.ok) {
    try { return await res.json() as { ok: boolean; error?: string }; } catch { return { ok: false, error: "network_error" }; }
  }
  return res.json() as Promise<{ ok: boolean; respondedAt?: string; error?: string }>;
}

export async function fetchRsvpList(userId: string): Promise<RsvpInvitation[]> {
  const res = await fetch(`/api/rsvp/list?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) return [];
  const data = await res.json() as { invitations: RsvpInvitation[] };
  return data.invitations;
}
