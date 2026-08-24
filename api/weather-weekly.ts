import type { VercelRequest, VercelResponse } from "@vercel/node";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// WMO Weather interpretation codes (same as weather.ts)
const WMO_CODES: Record<number, { vi: string; en: string; icon: string }> = {
  0: { vi: "Trời quang", en: "Clear sky", icon: "☀️" },
  1: { vi: "Ít mây", en: "Mainly clear", icon: "🌤️" },
  2: { vi: "Có mây", en: "Partly cloudy", icon: "⛅" },
  3: { vi: "Nhiều mây", en: "Overcast", icon: "☁️" },
  45: { vi: "Sương mù", en: "Foggy", icon: "🌫️" },
  48: { vi: "Sương mù đóng băng", en: "Depositing rime fog", icon: "🌫️" },
  51: { vi: "Mưa phùn nhẹ", en: "Light drizzle", icon: "🌦️" },
  53: { vi: "Mưa phùn", en: "Moderate drizzle", icon: "🌦️" },
  55: { vi: "Mưa phùn nặng", en: "Dense drizzle", icon: "🌧️" },
  61: { vi: "Mưa nhẹ", en: "Slight rain", icon: "🌦️" },
  63: { vi: "Mưa vừa", en: "Moderate rain", icon: "🌧️" },
  65: { vi: "Mưa to", en: "Heavy rain", icon: "🌧️" },
  80: { vi: "Mưa rào nhẹ", en: "Slight rain showers", icon: "🌦️" },
  81: { vi: "Mưa rào vừa", en: "Moderate rain showers", icon: "🌧️" },
  82: { vi: "Mưa rào dữ dội", en: "Violent rain showers", icon: "⛈️" },
  95: { vi: "Giông bão", en: "Thunderstorm", icon: "⛈️" },
  96: { vi: "Giông bão mưa đá nhẹ", en: "Thunderstorm with slight hail", icon: "⛈️" },
  99: { vi: "Giông bão mưa đá nặng", en: "Thunderstorm with heavy hail", icon: "⛈️" },
};

function getWeatherInfo(code: number, lang: string) {
  const info = WMO_CODES[code] ?? { vi: "Không rõ", en: "Unknown", icon: "❓" };
  return {
    description: lang === "en" ? info.en : info.vi,
    icon: info.icon,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const lat = parseFloat(Array.isArray(req.query.lat) ? req.query.lat[0] : (req.query.lat as string) ?? "");
  const lon = parseFloat(Array.isArray(req.query.lon) ? req.query.lon[0] : (req.query.lon as string) ?? "");
  const startDate = Array.isArray(req.query.startDate) ? req.query.startDate[0] : (req.query.startDate as string) ?? "";
  const lang = (Array.isArray(req.query.lang) ? req.query.lang[0] : (req.query.lang as string)) ?? "vi";

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: "Missing or invalid lat/lon" });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return res.status(400).json({ error: "Invalid startDate format. Use YYYY-MM-DD" });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const requestDate = new Date(startDate + "T00:00:00");
  const diffDays = Math.ceil((requestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Ensure we don't request past data more than 7 days back
  if (diffDays < -7) {
    return res.status(400).json({ error: "Date too far in the past" });
  }

  // Limit to 16 days ahead for forecast
  if (diffDays > 16) {
    return res.status(400).json({ error: "Forecast only available up to 16 days ahead" });
  }

  // Calculate end date (7 days from start)
  const endDateObj = new Date(requestDate);
  endDateObj.setDate(endDateObj.getDate() + 6); // 7 days total
  const endDate = endDateObj.toISOString().slice(0, 10);

  try {
    const isPast = diffDays < 0;
    const baseUrl = isPast
      ? "https://archive-api.open-meteo.com/v1/archive"
      : "https://api.open-meteo.com/v1/forecast";

    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      start_date: startDate,
      end_date: endDate,
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max,weathercode",
      timezone: "auto",
    });

    const response = await fetch(`${baseUrl}?${params}`);
    if (!response.ok) {
      return res.status(502).json({ error: "weather_api_error" });
    }

    const data = (await response.json()) as { daily?: Record<string, (number | null)[] | undefined> };
    const daily = data.daily;

    if (!daily || !daily.time || daily.time.length === 0) {
      return res.status(404).json({ error: "no_data" });
    }

    // Build array of daily forecasts
    const forecasts = (daily.time || []).map((date: string | number | null, i: number) => {
      const dateString = typeof date === 'number' ? new Date(date * 1000).toISOString().slice(0, 10) : String(date);
      const weatherCode = daily.weathercode?.[i] ?? 0;
      const weatherInfo = getWeatherInfo(weatherCode, lang);

      return {
        date: dateString,
        tempMax: daily.temperature_2m_max?.[i] ?? null,
        tempMin: daily.temperature_2m_min?.[i] ?? null,
        precipitationSum: daily.precipitation_sum?.[i] ?? 0,
        precipitationProbability: daily.precipitation_probability_max?.[i] ?? 0,
        windSpeedMax: daily.windspeed_10m_max?.[i] ?? 0,
        weatherCode,
        description: weatherInfo.description,
        icon: weatherInfo.icon,
        isPast,
      };
    });

    return res.status(200).json({ forecasts });
  } catch (err) {
    console.error("Weather weekly API error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}
