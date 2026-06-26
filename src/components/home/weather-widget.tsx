import { useState, useEffect } from "react";
import { getVenueCityOrDefault, type VenueCity } from "@/data/venue-cities";

interface WeatherData {
  date: string;
  tempMax: number | null;
  tempMin: number | null;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  weatherCode: number;
  description: string;
  icon: string;
  isPast: boolean;
}

interface WeatherWidgetProps {
  weddingDate: string; // "YYYY-MM-DD" or ""
  venueCityId?: string;
  lang?: string;
}

export function WeatherWidget({ weddingDate, venueCityId, lang = "vi" }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const city: VenueCity = getVenueCityOrDefault(venueCityId ?? "hcmc");

  useEffect(() => {
    if (!weddingDate) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          lat: city.lat.toString(),
          lon: city.lon.toString(),
          date: weddingDate,
          lang,
        });
        const res = await fetch(`/api/weather?${params}`);
        if (!res.ok) {
          const data = await res.json();
          if (data.error === "date_too_far_future") {
            setError("too_far");
          } else {
            setError("fetch_error");
          }
          return;
        }
        const data: WeatherData = await res.json();
        setWeather(data);
      } catch {
        setError("fetch_error");
      } finally {
        setLoading(false);
      }
    };

    void fetchWeather();
  }, [weddingDate, lang, city.lat, city.lon]);

  if (!weddingDate) return null;

  const en = lang === "en";

  // Calculate days until wedding
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const wedding = new Date(weddingDate + "T00:00:00");
  const daysUntil = Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Don't show for very far future dates
  if (daysUntil > 16) {
    return (
      <div
        className="rounded-xl p-3 text-center"
        style={{ backgroundColor: "var(--theme-surface)", border: "1px solid var(--theme-border)" }}
      >
        <p className="text-sm" style={{ color: "var(--theme-note-text)" }}>
          {en
            ? `Weather forecast available 16 days before the wedding (${daysUntil} days to go)`
            : `Dự báo thời tiết khả dụng 16 ngày trước ngày cưới (còn ${daysUntil} ngày)`}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="rounded-xl p-3 flex items-center justify-center gap-2"
        style={{ backgroundColor: "var(--theme-surface)", border: "1px solid var(--theme-border)" }}
      >
        <span className="animate-pulse">⏳</span>
        <span className="text-sm" style={{ color: "var(--theme-note-text)" }}>
          {en ? "Loading weather..." : "Đang tải thời tiết..."}
        </span>
      </div>
    );
  }

  if (error || !weather) {
    return null; // Silently hide on error
  }

  const isToday = daysUntil === 0;
  const isTomorrow = daysUntil === 1;

  const dateLabel = isToday
    ? en ? "Today" : "Hôm nay"
    : isTomorrow
      ? en ? "Tomorrow" : "Ngày mai"
      : en
        ? `In ${daysUntil} days`
        : `Còn ${daysUntil} ngày`;

  return (
    <div
      className="rounded-xl p-3"
      style={{ backgroundColor: "var(--theme-surface)", border: "1px solid var(--theme-border)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold" style={{ color: "var(--theme-primary)" }}>
          🌤️ {en ? "Wedding Day Weather" : "Thời Tiết Ngày Cưới"}
          <span className="text-xs font-normal text-muted-foreground ml-1.5">
            📍 {en ? city.nameEn : city.nameVi}
          </span>
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--theme-primary-light)", color: "var(--theme-primary)" }}>
          {dateLabel}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Weather icon + description */}
        <div className="text-center">
          <span className="text-3xl">{weather.icon}</span>
          <p className="text-xs mt-0.5" style={{ color: "var(--theme-note-text)" }}>
            {weather.description}
          </p>
        </div>

        {/* Temperature */}
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold" style={{ color: "var(--theme-primary)" }}>
              {weather.tempMax != null ? Math.round(weather.tempMax) : "--"}°
            </span>
            <span className="text-sm" style={{ color: "var(--theme-note-text)" }}>
              / {weather.tempMin != null ? Math.round(weather.tempMin) : "--"}°
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
            {en ? "High / Low" : "Cao / Thấp"}
          </p>
        </div>

        {/* Details */}
        <div className="text-right space-y-1">
          <div className="flex items-center justify-end gap-1">
            <span className="text-xs" style={{ color: "var(--theme-note-text)" }}>
              💧 {weather.precipitationProbability}%
            </span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <span className="text-xs" style={{ color: "var(--theme-note-text)" }}>
              🌬️ {Math.round(weather.windSpeedMax)} km/h
            </span>
          </div>
          {weather.precipitationSum > 0 && (
            <div className="flex items-center justify-end gap-1">
              <span className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                🌧️ {weather.precipitationSum} mm
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Weather advice */}
      {weather.precipitationProbability > 50 && (
        <div
          className="mt-2 px-2 py-1.5 rounded-lg text-xs"
          style={{ backgroundColor: "var(--theme-note-bg)", color: "var(--theme-note-text)" }}
        >
          {en
            ? "☔ High chance of rain — consider indoor backup plans!"
            : "☔ Khả năng mưa cao — nên chuẩn bị phương án trong nhà!"}
        </div>
      )}
      {weather.tempMax != null && weather.tempMax > 35 && (
        <div
          className="mt-2 px-2 py-1.5 rounded-lg text-xs"
          style={{ backgroundColor: "var(--theme-note-bg)", color: "var(--theme-note-text)" }}
        >
          {en
            ? "🌡️ Hot day expected — prepare fans, cold drinks, and shaded areas!"
            : "🌡️ Dự báo nắng nóng — chuẩn bị quạt, nước mát và chỗ có bóng râm!"}
        </div>
      )}
    </div>
  );
}
