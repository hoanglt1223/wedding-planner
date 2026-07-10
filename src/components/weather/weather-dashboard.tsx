import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Cloud, RefreshCw, AlertCircle } from "lucide-react";
import { WeatherCard } from "./weather-card";

interface WeatherDashboardProps {
  weddingDate?: string;
  engagementDate?: string;
  betrothalDate?: string;
  lang: "vi" | "en";
}

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

const DEFAULT_LOCATION = {
  lat: 21.0278, // Hanoi
  lon: 105.8342,
  name: "Hà Nội",
};

export function WeatherDashboard({ weddingDate, engagementDate, betrothalDate, lang }: WeatherDashboardProps) {
  const en = lang === "en";
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const datesToCheck = [
    { key: "wedding", date: weddingDate, title: en ? "Wedding Day" : "Ngày Cưới" },
    { key: "engagement", date: engagementDate, title: en ? "Engagement Day" : "Lễ Đính Hôn" },
    { key: "betrothal", date: betrothalDate, title: en ? "Betrothal Day" : "Lễ Ăn Hỏi" },
  ].filter((d) => d.date);

  const fetchWeather = async (date: string) => {
    try {
      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lon: location.lon.toString(),
        date,
        lang,
      });

      const response = await fetch(`/api/weather?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch weather");
      }

      const data = await response.json();

      setWeatherData((prev) => ({
        ...prev,
        [date]: { ...data, loading: false },
      }));

      setError(null);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setWeatherData((prev) => ({
        ...prev,
        [date]: {
          date,
          tempMax: null,
          tempMin: null,
          precipitationSum: 0,
          precipitationProbability: 0,
          windSpeedMax: 0,
          weatherCode: 0,
          description: "",
          icon: "❓",
          isPast: false,
          error: err instanceof Error ? err.message : "Unknown error",
        },
      }));
    }
  };

  const fetchAllWeather = async () => {
    setLoading(true);
    setError(null);

    // Initialize loading state
    const loadingState: Record<string, WeatherData> = {};
    for (const { date } of datesToCheck) {
      if (date) {
        loadingState[date] = {
          date,
          tempMax: null,
          tempMin: null,
          precipitationSum: 0,
          precipitationProbability: 0,
          windSpeedMax: 0,
          weatherCode: 0,
          description: "",
          icon: "🌡️",
          isPast: false,
          loading: true,
        };
      }
    }
    setWeatherData(loadingState);

    // Fetch all in parallel
    const promises = datesToCheck.map((d) => d.date && fetchWeather(d.date));
    await Promise.all(promises);

    setLoading(false);
  };

  useEffect(() => {
    if (datesToCheck.length > 0) {
      fetchAllWeather();
    }
  }, [weddingDate, engagementDate, betrothalDate, location.lat, location.lon]);

  const majorCities = {
    "Hà Nội": { lat: 21.0278, lon: 105.8342 },
    "HCM": { lat: 10.8231, lon: 106.6297 },
    "Đà Nẵng": { lat: 16.0544, lon: 108.2022 },
    "Hải Phòng": { lat: 20.8449, lon: 106.6881 },
    "Cần Thơ": { lat: 10.0452, lon: 105.7467 },
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">
          {en ? "Weather Forecast" : "Dự Báo Thời Tiết"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {en ? "Check weather for your important dates" : "Kiểm tra thời tiết cho ngày quan trọng của bạn"}
        </p>
      </div>

      {/* Location selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {en ? "Location" : "Địa điểm"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {Object.entries(majorCities).map(([city, coords]) => (
              <Button
                key={city}
                size="sm"
                variant={
                  location.lat === coords.lat && location.lon === coords.lon
                    ? "default"
                    : "outline"
                }
                onClick={() => setLocation({ ...coords, name: city })}
              >
                {city}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="lat">{en ? "Latitude" : "Vĩ độ"}</Label>
              <Input
                id="lat"
                type="number"
                step="0.0001"
                value={location.lat}
                onChange={(e) =>
                  setLocation((prev) => ({
                    ...prev,
                    lat: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="lon">{en ? "Longitude" : "Kinh độ"}</Label>
              <Input
                id="lon"
                type="number"
                step="0.0001"
                value={location.lon}
                onChange={(e) =>
                  setLocation((prev) => ({
                    ...prev,
                    lon: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refresh button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <MapPin className="inline h-3 w-3 mr-1" />
          {location.name} ({location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°)
        </div>
        <Button
          size="sm"
          onClick={fetchAllWeather}
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {en ? "Refresh" : "Làm mới"}
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {datesToCheck.map((event) => (
          <WeatherCard
            key={event.key}
            title={event.title}
            date={event.date}
            weather={weatherData[event.date || ""] || null}
            lang={lang}
          />
        ))}
      </div>

      {/* Info card */}
      {datesToCheck.length === 0 && (
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Cloud className="h-5 w-5" />
              <div className="text-sm">
                {en
                  ? "Set your wedding dates to see weather forecasts"
                  : "Đặt ngày cưới của bạn để xem dự báo thời tiết"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips card */}
      {datesToCheck.length > 0 && (
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">
                {en ? "Tips:" : "Mẹo:"}
              </p>
              <ul className="space-y-1 text-xs">
                <li>• {en ? "Forecast available up to 16 days ahead" : "Dự báo có sẵn đến 16 ngày trước"}</li>
                <li>• {en ? "Historical data available for past 7 days" : "Dữ liệu lịch sử có sẵn cho 7 ngày qua"}</li>
                <li>• {en ? "Plan indoor backup for high precipitation" : "Lên kế hoạch dự phòng trong nhà khi mưa nhiều"}</li>
                <li>• {en ? "Consider wind for outdoor decorations" : "Cân nhắc gió cho trang trí ngoài trời"}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
