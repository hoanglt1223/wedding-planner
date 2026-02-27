interface Props {
  venue: string;
  date: string;
  lang: string;
  primary: string;
  primaryLight: string;
}

function formatDate(dateStr: string, lang: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export function WebsiteRsvpCta({ venue, date, lang, primary, primaryLight }: Props) {
  return (
    <section
      className="px-6 py-16 text-center"
      style={{ background: `linear-gradient(to bottom, ${primaryLight}, white)` }}
    >
      <h2 className="text-2xl font-bold mb-3" style={{ color: primary }}>
        {lang === "en" ? "RSVP" : "Xác Nhận Tham Dự"}
      </h2>
      <p className="text-gray-600 text-sm mb-4 max-w-sm mx-auto">
        {lang === "en"
          ? "We look forward to celebrating with you. Please confirm your attendance."
          : "Chúng tôi rất mong được đón tiếp quý vị trong ngày trọng đại này."}
      </p>
      {(venue || date) && (
        <div className="text-xs text-gray-500 space-y-1">
          {venue && <p>🏛️ {venue}</p>}
          {date && <p>📅 {formatDate(date, lang)}</p>}
        </div>
      )}
    </section>
  );
}
