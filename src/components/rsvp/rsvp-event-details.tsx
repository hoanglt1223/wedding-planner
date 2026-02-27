import { t } from "@/lib/i18n";

interface RsvpEventDetailsProps {
  venue: string;
  venueAddress: string;
  venueMapLink: string;
  lang: string;
}

export function RsvpEventDetails({ venue, venueAddress, venueMapLink, lang }: RsvpEventDetailsProps) {
  if (!venue && !venueAddress) return null;

  return (
    <div className="rounded-xl border border-[#e8ddd0] bg-white/80 p-4 space-y-2">
      <h2 className="text-sm font-semibold text-[#2c1810] flex items-center gap-2">
        📍 {t("Địa điểm", lang)}
      </h2>
      {venue && <p className="text-sm font-medium text-[#3a2a1a]">{venue}</p>}
      {venueAddress && <p className="text-xs text-[#8a7060]">{venueAddress}</p>}
      {venueMapLink && /^https?:\/\//i.test(venueMapLink) && (
        <a
          href={venueMapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          🗺️ {t("Xem bản đồ", lang)}
        </a>
      )}
    </div>
  );
}
