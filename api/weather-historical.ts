import type { VercelRequest, VercelResponse } from "@vercel/node";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const lat = parseFloat(Array.isArray(req.query.lat) ? req.query.lat[0] : (req.query.lat as string) ?? "");
  const lon = parseFloat(Array.isArray(req.query.lon) ? req.query.lon[0] : (req.query.lon as string) ?? "");
  const month = parseInt(Array.isArray(req.query.month) ? req.query.month[0] : (req.query.month as string) ?? "", 10);
  const lang = (Array.isArray(req.query.lang) ? req.query.lang[0] : (req.query.lang as string)) ?? "vi";

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: "Missing or invalid lat/lon" });
  }

  if (isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: "Invalid month. Must be 1-12" });
  }

  const currentYear = new Date().getFullYear();
  const yearsToAnalyze = 5;
  const startYear = currentYear - yearsToAnalyze;

  // Calculate date ranges for each year
  const yearRanges: string[] = [];
  for (let year = startYear; year < currentYear; year++) {
    const monthStr = month.toString().padStart(2, "0");
    yearRanges.push(`${year}-${monthStr}-01`);
  }

  try {
    // Fetch historical data for the past 5 years for this month
    const allData: Array<{
      year: number;
      avgTempMax: number;
      avgTempMin: number;
      avgPrecipitationSum: number;
      maxPrecipitationDay: number;
      rainyDays: number;
      avgWindSpeed: number;
    }> = [];

    for (const year of yearRanges) {
      const [yr, mo] = year.split("-");
      const lastDay = new Date(parseInt(yr), parseInt(mo), 0).getDate();
      const startDate = `${yr}-${mo}-01`;
      const endDate = `${yr}-${mo}-${lastDay.toString().padStart(2, "0")}`;

      const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        start_date: startDate,
        end_date: endDate,
        daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max",
        timezone: "auto",
      });

      const response = await fetch(`https://archive-api.open-meteo.com/v1/archive?${params}`);
      if (!response.ok) continue;

      const data = (await response.json()) as { daily?: Record<string, (number | null)[] | undefined> };
      const daily = data.daily;

      if (!daily || !daily.time || daily.time.length === 0) continue;

      const daysWithData = daily.time.length;
      const tempMaxValues = daily.temperature_2m_max?.filter((v): v is number => v !== null) ?? [];
      const tempMinValues = daily.temperature_2m_min?.filter((v): v is number => v !== null) ?? [];
      const precipValues = daily.precipitation_sum?.filter((v): v is number => v !== null) ?? [];
      const windValues = daily.windspeed_10m_max?.filter((v): v is number => v !== null) ?? [];

      const avgTempMax = tempMaxValues.length > 0
        ? tempMaxValues.reduce((a, b) => a + b, 0) / tempMaxValues.length
        : 0;
      const avgTempMin = tempMinValues.length > 0
        ? tempMinValues.reduce((a, b) => a + b, 0) / tempMinValues.length
        : 0;
      const avgPrecipitationSum = precipValues.length > 0
        ? precipValues.reduce((a, b) => a + b, 0) / daysWithData
        : 0;
      const maxPrecipitationDay = precipValues.length > 0
        ? Math.max(...precipValues)
        : 0;
      const rainyDays = precipValues.filter((v) => v > 0).length;
      const avgWindSpeed = windValues.length > 0
        ? windValues.reduce((a, b) => a + b, 0) / windValues.length
        : 0;

      allData.push({
        year: parseInt(yr),
        avgTempMax: Math.round(avgTempMax * 10) / 10,
        avgTempMin: Math.round(avgTempMin * 10) / 10,
        avgPrecipitationSum: Math.round(avgPrecipitationSum * 10) / 10,
        maxPrecipitationDay: Math.round(maxPrecipitationDay * 10) / 10,
        rainyDays,
        avgWindSpeed: Math.round(avgWindSpeed * 10) / 10,
      });
    }

    if (allData.length === 0) {
      return res.status(404).json({ error: "no_data", message: "No historical data available" });
    }

    // Calculate averages across all years
    const summary = {
      month,
      yearsAnalyzed: allData.length,
      avgTempMax: Math.round((allData.reduce((sum, d) => sum + d.avgTempMax, 0) / allData.length) * 10) / 10,
      avgTempMin: Math.round((allData.reduce((sum, d) => sum + d.avgTempMin, 0) / allData.length) * 10) / 10,
      avgPrecipitationSum: Math.round((allData.reduce((sum, d) => sum + d.avgPrecipitationSum, 0) / allData.length) * 10) / 10,
      maxPrecipitationDay: Math.round(Math.max(...allData.map((d) => d.maxPrecipitationDay)) * 10) / 10,
      avgRainyDays: Math.round((allData.reduce((sum, d) => sum + d.rainyDays, 0) / allData.length) * 10) / 10,
      avgWindSpeed: Math.round((allData.reduce((sum, d) => sum + d.avgWindSpeed, 0) / allData.length) * 10) / 10,
      yearlyData: allData,
    };

    return res.status(200).json(summary);
  } catch (err) {
    console.error("Weather historical API error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}
