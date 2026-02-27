import { t } from "@/lib/i18n";
import type { RsvpInvitation } from "@/lib/rsvp-api";

interface RsvpStatsBarProps {
  invitations: RsvpInvitation[];
  lang: string;
}

export function RsvpStatsBar({ invitations, lang }: RsvpStatsBarProps) {
  const accepted = invitations.filter((i) => i.status === "accepted");
  const declined = invitations.filter((i) => i.status === "declined");
  const pending = invitations.filter((i) => i.status === "pending");
  const totalPlusOnes = accepted.reduce((sum, i) => sum + (i.plusOnes || 0), 0);

  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
        ✓ {t("Đã nhận", lang)}: {accepted.length}{totalPlusOnes > 0 && ` (+${totalPlusOnes})`}
      </span>
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-600 font-semibold">
        ✗ {t("Từ chối tham dự", lang)}: {declined.length}
      </span>
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold">
        ⏳ {t("Chờ phản hồi", lang)}: {pending.length}
      </span>
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
        {lang === "en" ? "Total" : "Tổng"}: {invitations.length}
      </span>
    </div>
  );
}
