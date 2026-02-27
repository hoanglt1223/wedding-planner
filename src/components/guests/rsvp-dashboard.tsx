import { useEffect, useState, useCallback } from "react";
import { fetchRsvpList, type RsvpInvitation } from "@/lib/rsvp-api";
import type { Guest, RsvpSettings } from "@/types/wedding";
import { RsvpSettingsForm } from "./rsvp-settings-form";
import { RsvpGenerateLinks } from "./rsvp-generate-links";
import { RsvpStatsBar } from "./rsvp-stats-bar";
import { RsvpResponseTable } from "./rsvp-response-table";
import { RsvpExportActions } from "./rsvp-export-actions";

interface RsvpDashboardProps {
  guests: Guest[];
  userId: string;
  rsvpSettings: RsvpSettings;
  onSetRsvpSettings: (partial: Partial<RsvpSettings>) => void;
  onUpdateGuestRsvpToken: (guestId: number, token: string) => void;
  themeId: string;
  lang: string;
}

export function RsvpDashboard({
  guests, userId, rsvpSettings, onSetRsvpSettings,
  onUpdateGuestRsvpToken, themeId, lang,
}: RsvpDashboardProps) {
  const [invitations, setInvitations] = useState<RsvpInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRsvpList(userId);
      setInvitations(data);
    } catch { /* ignore */ }
    setLoading(false);
  }, [userId]);

  useEffect(() => { loadInvitations(); }, [loadInvitations]); // eslint-disable-line react-hooks/set-state-in-effect

  return (
    <div className="space-y-3">
      <RsvpSettingsForm settings={rsvpSettings} onChange={onSetRsvpSettings} lang={lang} />

      <RsvpGenerateLinks
        guests={guests}
        userId={userId}
        themeId={themeId}
        lang={lang}
        onUpdateGuestRsvpToken={onUpdateGuestRsvpToken}
        onRefresh={loadInvitations}
      />

      {loading && (
        <div className="text-xs text-gray-400 py-2">{lang === "en" ? "Loading responses..." : "Đang tải phản hồi..."}</div>
      )}

      {!loading && invitations.length > 0 && (
        <>
          <RsvpStatsBar invitations={invitations} lang={lang} />
          <RsvpResponseTable invitations={invitations} lang={lang} />
          <RsvpExportActions invitations={invitations} lang={lang} />
        </>
      )}

      {!loading && invitations.length === 0 && guests.length > 0 && (
        <p className="text-xs text-gray-400 py-2">
          {lang === "en" ? "No RSVP links generated yet. Click \"Generate RSVP Links\" above." : "Chưa có link RSVP. Nhấn \"Tạo link RSVP\" ở trên."}
        </p>
      )}
    </div>
  );
}
