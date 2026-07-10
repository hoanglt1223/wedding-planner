import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudDrizzle, Umbrella, Wind, Calendar } from "lucide-react";

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
  loading?: boolean;
  error?: string;
}

interface WeatherCardProps {
  title: string;
  date: string | undefined;
  weather: WeatherData | null;
  lang: "vi" | "en";
}

function getRecommendation(weather: WeatherData, lang: "vi" | "en"): string {
  const en = lang === "en";

  // Heavy rain or high precipitation probability
  if (weather.precipitationProbability >= 70 || weather.precipitationSum >= 10) {
    return en ? "Indoor venue recommended" : "Nên tổ chức trong nhà";
  }

  // Light rain
  if (weather.precipitationProbability >= 40 || weather.precipitationSum >= 2) {
    return en ? "Have indoor backup plan" : "Có phương án trong nhà";
  }

  // Very hot
  if (weather.tempMax && weather.tempMax >= 35) {
    return en ? "Provide shade and hydration" : "Cung cấp bóng mát và nước uống";
  }

  // Cold
  if (weather.tempMax && weather.tempMax <= 15) {
    return en ? "Consider indoor heated venue" : "Nên chọn nơi trong nhà có máy lạnh";
  }

  // Windy
  if (weather.windSpeedMax >= 30) {
    return en ? "Secure decorations, avoid open flames" : "Cố định trang trí, tránh lửa trần";
  }

  // Perfect weather
  return en ? "Great outdoor weather!" : "Thời tiết tuyệt vời cho ngoài trời!";
}

export function WeatherCard({ title, date, weather, lang }: WeatherCardProps) {
  const en = lang === "en";

  if (!date) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground text-sm">
            {en ? "Date not set" : "Chưa đặt ngày"}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground text-sm">
            {en ? "Loading weather data..." : "Đang tải dữ liệu..."}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (weather.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive text-sm">
            {en ? "Unable to load weather" : "Không thể tải dữ liệu"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recommendation = getRecommendation(weather, lang);

  return (
    <Card className={weather.isPast ? "opacity-60" : ""}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {new Date(date).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weather main display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{weather.icon}</span>
            <div>
              <div className="text-2xl font-bold">
                {weather.tempMax !== null ? `${Math.round(weather.tempMax)}°` : "--"}
              </div>
              <div className="text-sm text-muted-foreground">
                {weather.description}
              </div>
            </div>
          </div>
          <div className="text-right text-sm">
            {weather.tempMin !== null && (
              <div className="text-muted-foreground">
                {en ? "Low: " : "Thấp: "}{Math.round(weather.tempMin)}°
              </div>
            )}
          </div>
        </div>

        {/* Weather details */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Umbrella className="h-4 w-4 text-blue-500" />
            <div>
              <div className="font-medium">{weather.precipitationProbability}%</div>
              <div className="text-xs text-muted-foreground">{en ? "Rain" : "Mưa"}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-medium">{Math.round(weather.windSpeedMax)} km/h</div>
              <div className="text-xs text-muted-foreground">{en ? "Wind" : "Gió"}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <CloudDrizzle className="h-4 w-4 text-cyan-500" />
            <div>
              <div className="font-medium">{weather.precipitationSum} mm</div>
              <div className="text-xs text-muted-foreground">{en ? "Precip" : "Lượng"}</div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="pt-2 border-t">
          <div className={`text-xs font-medium ${
            recommendation.includes("Great") || recommendation.includes("tuyệt vời")
              ? "text-green-600"
              : "text-amber-600"
          }`}>
            💡 {recommendation}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
