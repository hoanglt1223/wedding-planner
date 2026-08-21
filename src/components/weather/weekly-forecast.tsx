import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Cloud, Droplets, Wind, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyForecast {
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

interface WeeklyForecastProps {
  lat: number;
  lon: number;
  startDate: string;
  lang: "vi" | "en";
}

export function WeeklyForecast({ lat, lon, startDate, lang }: WeeklyForecastProps) {
  const en = lang === "en";
  const [forecasts, setForecasts] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeeklyForecast = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        startDate,
        lang,
      });

      const response = await fetch(`/api/weather-weekly?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch weekly forecast");
      }

      const data = await response.json();
      setForecasts(data.forecasts || []);
    } catch (err) {
      console.error("Weekly forecast fetch error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyForecast();
  }, [lat, lon, startDate]);

  const getRiskLevel = (day: DailyForecast) => {
    if (day.precipitationProbability > 70) return "high";
    if (day.precipitationProbability > 40 || day.windSpeedMax > 30) return "medium";
    return "low";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {en ? "7-Day Forecast" : "Dự Báo 7 Ngày"}
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchWeeklyForecast}
            disabled={loading}
          >
            {loading ? (
              <span className="animate-pulse">{en ? "Loading..." : "Đang tải..."}</span>
            ) : (
              <span>{en ? "Refresh" : "Làm mới"}</span>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm mb-4">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {loading && forecasts.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Cloud className="h-8 w-8 mx-auto mb-2 animate-pulse" />
            <p className="text-sm">{en ? "Loading forecast..." : "Đang tải dự báo..."}</p>
          </div>
        )}

        {!loading && forecasts.length > 0 && (
          <div className="space-y-2">
            {forecasts.map((day, index) => {
              const riskLevel = getRiskLevel(day);
              const isWeddingDay = index === 0;

              return (
                <div
                  key={day.date}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-colors",
                    isWeddingDay && "border-primary/50 bg-primary/5",
                    day.isPast && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{day.icon}</span>
                    <div>
                      <div className="font-medium text-sm">
                        {isWeddingDay && (
                          <span className="text-primary font-bold mr-1">
                            {en ? "Wedding Day" : "Ngày Cưới"} •
                          </span>
                        )}
                        {formatDate(day.date)}
                      </div>
                      <div className="text-xs text-muted-foreground">{day.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {day.tempMax !== null && day.tempMin !== null && (
                      <div className="text-right">
                        <div className="font-medium">
                          {Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°
                        </div>
                      </div>
                    )}

                    {day.precipitationProbability > 0 && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Droplets className="h-3 w-3" />
                        <span className="text-xs">{day.precipitationProbability}%</span>
                      </div>
                    )}

                    {day.windSpeedMax > 15 && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Wind className="h-3 w-3" />
                        <span className="text-xs">{Math.round(day.windSpeedMax)} km/h</span>
                      </div>
                    )}

                    {riskLevel !== "low" && (
                      <div
                        className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          riskLevel === "high" && "bg-red-100 text-red-700",
                          riskLevel === "medium" && "bg-yellow-100 text-yellow-700"
                        )}
                      >
                        {riskLevel === "high" ? (en ? "High Risk" : "Risco Cao") : en ? "Moderate" : "Trung Bình"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">{en ? "Risk Levels:" : "Mức độ rủi ro:"}</p>
            <ul className="space-y-0.5 ml-4">
              <li>• <span className="text-red-600 font-medium">{en ? "High Risk" : "Risco Cao"}</span>: {en ? ">70% rain probability" : ">70% khả năng mưa"}</li>
              <li>• <span className="text-yellow-600 font-medium">{en ? "Moderate" : "Trung Bình"}</span>: {en ? ">40% rain or >30km/h wind" : ">40% mưa hoặc >30km/h gió"}</li>
              <li>• <span className="text-green-600 font-medium">{en ? "Low Risk" : "Risco Thấp"}</span>: {en ? "Favorable conditions" : "Điều kiện thuận lợi"}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
