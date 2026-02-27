interface Props {
  venue: string;
  venueAddress: string;
  venueMapLink: string;
  lang: string;
  primary: string;
}

export function WebsiteVenue({ venue, venueAddress, venueMapLink, lang, primary }: Props) {
  if (!venue && !venueAddress) return null;

  const safeMapLink = venueMapLink && /^https?:\/\//i.test(venueMapLink)
    ? encodeURI(venueMapLink)
    : null;

  return (
    <section className="px-6 py-12 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-6" style={{ color: primary }}>
        {lang === "en" ? "Venue" : "Địa Điểm & Bản Đồ"}
      </h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 inline-block w-full max-w-md mx-auto">
        {venue && (
          <p className="text-lg font-semibold text-gray-900 mb-2">🏛️ {venue}</p>
        )}
        {venueAddress && (
          <p className="text-sm text-gray-600 mb-4">📍 {venueAddress}</p>
        )}
        {safeMapLink && (
          <a
            href={safeMapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: primary }}
          >
            🗺️ {lang === "en" ? "View on Map" : "Xem Bản Đồ"}
          </a>
        )}
      </div>
    </section>
  );
}
