import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createRsvpTokens } from "@/lib/rsvp-api";
import { t } from "@/lib/i18n";
import type { Guest } from "@/types/wedding";

interface RsvpGenerateLinksProps {
  guests: Guest[];
  userId: string;
  themeId: string;
  lang: string;
  onUpdateGuestRsvpToken: (guestId: number, token: string) => void;
  onRefresh: () => void;
}

export function RsvpGenerateLinks({ guests, userId, themeId, lang, onUpdateGuestRsvpToken, onRefresh }: RsvpGenerateLinksProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const guestsWithoutToken = guests.filter((g) => !g.rsvpToken);
  const count = guestsWithoutToken.length;

  const handleGenerate = async () => {
    if (count === 0 || loading) return;
    setLoading(true);
    setMessage("");
    try {
      const tokens = await createRsvpTokens(
        userId,
        guestsWithoutToken.map((g) => ({ name: g.name })),
        themeId,
        lang,
      );
      // Match returned tokens to guests by name
      for (const t of tokens) {
        const guest = guestsWithoutToken.find((g) => g.name === t.guestName && !g.rsvpToken);
        if (guest) {
          onUpdateGuestRsvpToken(guest.id, t.token);
          guest.rsvpToken = t.token; // mark matched to handle duplicate names
        }
      }
      setMessage(lang === "en" ? `Generated ${tokens.length} links` : `Đã tạo ${tokens.length} link`);
      onRefresh();
    } catch {
      setMessage(lang === "en" ? "Failed to generate links" : "Lỗi tạo link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        size="sm"
        className="h-8 text-xs"
        onClick={handleGenerate}
        disabled={count === 0 || loading || guests.length === 0}
      >
        {loading ? "..." : `🔗 ${t("Tạo link RSVP", lang)}`}
      </Button>
      {count > 0 && (
        <span className="text-xs text-gray-500">
          {count} {t("khách chưa có link", lang)}
        </span>
      )}
      {count === 0 && guests.length > 0 && (
        <span className="text-xs text-green-600">
          ✓ {lang === "en" ? "All guests have links" : "Tất cả đã có link"}
        </span>
      )}
      {message && <span className="text-xs text-blue-600">{message}</span>}
    </div>
  );
}
