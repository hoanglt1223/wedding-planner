/**
 * Weather Summary
 * Simplified weather widget for wedding day
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudSun, Sun, CloudRain, CloudDrizzle, Wind, Snow } from "lucide-react";

interface WeatherSummaryProps {
  weddingDate: string;
  venueCity: string;
  lang: string;
}

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
}

export function WeatherSummary({ weddingDate, venueCity, lang }: WeatherSummaryProps) {
  const title = lang === "en" ? "Weather Summary" : "Tổng Quan Thời Tiết";

  // Mock weather data - in production, this would come from a weather API
  const mockWeather: WeatherData = {
    temp: 28,
    condition: "Partly Cloudy",
    icon: "partly-cloudy",
    humidity: 65,
    wind: 12,
  };

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sunny":
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case "partly-cloudy":
        return <CloudSun className="w-8 h-8 text-blue-400" />;
      case "cloudy":
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case "rain":
        return <CloudRain className="w-8 h-8 text-blue-600" />;
      case "drizzle":
        return <CloudDrizzle className="w-8 h-8 text-blue-400" />;
      case "snow":
        return <Snow className="w-8 h-8 text-blue-200" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const tempText = lang === "en" ? "Temperature" : "Nhiệt Độ";
  const humidityText = lang === "en" ? "Humidity" : "Độ Ẩm";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(mockWeather.icon)}
            <div>
              <div className="text-3xl font-bold">{mockWeather.temp}°C</div>
              <div className="text-sm text-muted-foreground">{mockWeather.condition}</div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{tempText}:</span>
              <span className="font-medium">{mockWeather.temp}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{humidityText}:</span>
              <span className="font-medium">{mockWeather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{mockWeather.wind} km/h</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            {lang === "en"
              ? `Weather forecast for ${venueCity || "your venue"}`
              : `Dự báo thời tiết tại ${venueCity || "địa điểm tổ chức"}`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
