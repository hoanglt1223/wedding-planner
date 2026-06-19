import type { VercelRequest, VercelResponse } from "@vercel/node";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// WMO Weather interpretation codes
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
  56: { vi: "Mưa phùn đóng băng nhẹ", en: "Light freezing drizzle", icon: "🌧️" },
  57: { vi: "Mưa phùn đóng băng", en: "Dense freezing drizzle", icon: "🌧️" },
  61: { vi: "Mưa nhẹ", en: "Slight rain", icon: "🌦️" },
  63: { vi: "Mưa vừa", en: "Moderate rain", icon: "🌧️" },
  65: { vi: "Mưa to", en: "Heavy rain", icon: "🌧️" },
  66: { vi: "Mưa đóng băng nhẹ", en: "Light freezing rain", icon: "🌧️" },
  67: { vi: "Mưa đóng băng nặng", en: "Heavy freezing rain", icon: "🌧️" },
  71: { vi: "Tuyết nhẹ", en: "Slight snowfall", icon: "🌨️" },
  73: { vi: "Tuyết vừa", en: "Moderate snowfall", icon: "🌨️" },
  75: { vi: "Tuyết nặng", en: "Heavy snowfall", icon: "❄️" },
  77: { vi: "Hạt tuyết", en: "Snow grains", icon: "❄️" },
  80: { vi: "Mưa rào nhẹ", en: "Slight rain showers", icon: "🌦️" },
  81: { vi: "Mưa rào vừa", en: "Moderate rain showers", icon: "🌧️" },
  82: { vi: "Mưa rào dữ dội", en: "Violent rain showers", icon: "⛈️" },
  85: { vi: "Mưa tuyết rào nhẹ", en: "Slight snow showers", icon: "🌨️" },
  86: { vi: "Mưa tuyết rào nặng", en: "Heavy snow showers", icon: "🌨️" },
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
  const date = Array.isArray(req.query.date) ? req.query.date[0] : (req.query.date as string) ?? "";
  const lang = (Array.isArray(req.query.lang) ? req.query.lang[0] : (req.query.lang as string)) ?? "vi";

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: "Missing or invalid lat/lon" });
  }

  // Validate date format (YYYY-MM-DD) — optional, defaults to today
  const targetDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().slice(0, 10);

  // Check if date is within Open-Meteo's 16-day forecast range
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const requestDate = new Date(targetDate + "T00:00:00");
  const diffDays = Math.ceil((requestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < -7) {
    return res.status(400).json({ error: "date_too_far_past", message: "Date must be within the last 7 days" });
  }

  if (diffDays > 16) {
    return res.status(400).json({
      error: "date_too_far_future",
      message: "Forecast only available up to 16 days ahead",
    });
  }

  try {
    // Use forecast API for future dates, historical API for past dates
    const isPast = diffDays < 0;
    const baseUrl = isPast
      ? "https://archive-api.open-meteo.com/v1/archive"
      : "https://api.open-meteo.com/v1/forecast";

    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      start_date: targetDate,
      end_date: targetDate,
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max,weathercode",
      timezone: "auto",
    });

    const response = await fetch(`${baseUrl}?${params}`);
    if (!response.ok) {
      return res.status(502).json({ error: "weather_api_error", message: "Failed to fetch weather data" });
    }

    const data = (await response.json()) as { daily?: Record<string, (number | null)[] | undefined> };
    const daily = data.daily;

    if (!daily || !daily.time || daily.time.length === 0) {
      return res.status(404).json({ error: "no_data", message: "No weather data available for this date" });
    }

    const weatherCode = daily.weathercode?.[0] ?? 0;
    const weatherInfo = getWeatherInfo(weatherCode, lang);

    return res.status(200).json({
      date: daily.time[0],
      tempMax: daily.temperature_2m_max?.[0] ?? null,
      tempMin: daily.temperature_2m_min?.[0] ?? null,
      precipitationSum: daily.precipitation_sum?.[0] ?? 0,
      precipitationProbability: daily.precipitation_probability_max?.[0] ?? 0,
      windSpeedMax: daily.windspeed_10m_max?.[0] ?? 0,
      weatherCode,
      description: weatherInfo.description,
      icon: weatherInfo.icon,
      isPast,
    });
  } catch (err) {
    console.error("Weather API error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}
