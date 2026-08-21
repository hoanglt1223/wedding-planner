import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Cloud, Umbrella, Sun, Wind, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoricalData {
  month: number;
  yearsAnalyzed: number;
  avgTempMax: number;
  avgTempMin: number;
  avgPrecipitationSum: number;
  maxPrecipitationDay: number;
  avgRainyDays: number;
  avgWindSpeed: number;
  yearlyData: Array<{
    year: number;
    avgTempMax: number;
    avgTempMin: number;
    avgPrecipitationSum: number;
    maxPrecipitationDay: number;
    rainyDays: number;
    avgWindSpeed: number;
  }>;
}

interface WeatherRiskDashboardProps {
  lat: number;
  lon: number;
  weddingMonth: number;
  currentForecast?: {
    tempMax: number | null;
    tempMin: number | null;
    precipitationProbability: number;
    windSpeedMax: number;
  };
  lang: "vi" | "en";
}

export function WeatherRiskDashboard({ lat, lon, weddingMonth, currentForecast, lang }: WeatherRiskDashboardProps) {
  const en = lang === "en";
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistorical = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          lat: lat.toString(),
          lon: lon.toString(),
          month: weddingMonth.toString(),
          lang,
        });

        const response = await fetch(`/api/weather-historical?${params}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch historical data");
        }

        const data = await response.json();
        setHistoricalData(data);
      } catch (err) {
        console.error("Historical data fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchHistorical();
  }, [lat, lon, weddingMonth]);

  const getMonthName = (month: number) => {
    const date = new Date();
    date.setMonth(month - 1);
    return date.toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", { month: "long" });
  };

  const getTemperatureRisk = () => {
    if (!historicalData || !currentForecast?.tempMax) return "moderate";

    const avgHigh = historicalData.avgTempMax;
    const forecastHigh = currentForecast.tempMax;

    if (forecastHigh > 35) return "extreme";
    if (forecastHigh > avgHigh + 5) return "high";
    if (forecastHigh < avgHigh - 5) return "low";
    return "moderate";
  };

  const getPrecipitationRisk = () => {
    if (!currentForecast) return "moderate";

    const { precipitationProbability } = currentForecast;

    if (precipitationProbability > 70) return "high";
    if (precipitationProbability > 40) return "moderate";
    return "low";
  };

  const getWindRisk = () => {
    if (!currentForecast) return "moderate";

    const { windSpeedMax } = currentForecast;

    if (windSpeedMax > 40) return "high";
    if (windSpeedMax > 25) return "moderate";
    return "low";
  };

  const getOverallRisk = () => {
    const tempRisk = getTemperatureRisk();
    const precipRisk = getPrecipitationRisk();
    const windRisk = getWindRisk();

    const highCount = [tempRisk, precipRisk, windRisk].filter((r) => r === "high").length;
    const extremeCount = [tempRisk, precipRisk, windRisk].filter((r) => r === "extreme").length;

    if (extremeCount > 0) return "extreme";
    if (highCount >= 2) return "high";
    if (highCount >= 1) return "moderate";
    return "low";
  };

  const getRecommendations = () => {
    const recommendations: string[] = [];
    const tempRisk = getTemperatureRisk();
    const precipRisk = getPrecipitationRisk();
    const windRisk = getWindRisk();

    if (tempRisk === "extreme" || tempRisk === "high") {
      recommendations.push(en
        ? "Provide shaded areas, ample water, and cooling stations for guests"
        : "Cung cấp khu vực bóng mát, nước uống đầy đủ và trạm làm mát cho khách mời");
    }

    if (precipRisk === "high") {
      recommendations.push(en
        ? "Secure indoor backup venue and ensure adequate covered areas"
        : "Chuẩn bị địa điểm dự phòng trong nhà và đảm bảo khu vực che phủ đủ lớn");
    }

    if (windRisk === "high") {
      recommendations.push(en
        ? "Secure all decorations and consider wind-resistant setups"
        : "Ghim chặt trang trí và cân nhắc thiết kế chống gió");
    }

    if (tempRisk === "low") {
      recommendations.push(en
        ? "Consider heating options if ceremony will be outdoors"
        : "Cân nhắc tùy chọn sưởi ấm nếu lễ ngoài trời");
    }

    if (recommendations.length === 0) {
      recommendations.push(en
        ? "Weather conditions look favorable for your wedding day"
        : "Điều kiện thời tiết có vẻ thuận lợi cho ngày cưới của bạn");
    }

    return recommendations;
  };

  const getRiskBadge = (risk: string) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-bold";

    switch (risk) {
      case "extreme":
        return cn(baseClass, "bg-red-600 text-white");
      case "high":
        return cn(baseClass, "bg-red-100 text-red-700 border border-red-300");
      case "moderate":
        return cn(baseClass, "bg-yellow-100 text-yellow-700 border border-yellow-300");
      case "low":
        return cn(baseClass, "bg-green-100 text-green-700 border border-green-300");
      default:
        return cn(baseClass, "bg-gray-100 text-gray-700");
    }
  };

  const overallRisk = getOverallRisk();

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          {en ? "Wedding Weather Risk Assessment" : "Đánh Giá Rủi Ro Thời Tiết Ngày Cưới"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {en
            ? "Historical analysis and contingency planning recommendations"
            : "Phân tích lịch sử và đề xuất lập kế hoạch dự phòng"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Risk Badge */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              {en ? "Overall Weather Risk" : "Rủi Ro Thời Tiết Tổng Quan"}
            </div>
            <div className="text-2xl font-bold">
              {overallRisk === "extreme" && (en ? "EXTREME CAUTION" : "CẢNH BÁO CAO")}
              {overallRisk === "high" && (en ? "HIGH RISK" : "RỦI RO CAO")}
              {overallRisk === "moderate" && (en ? "MODERATE" : "TRUNG BÌNH")}
              {overallRisk === "low" && (en ? "FAVORABLE" : "THUẬN LỢI")}
            </div>
          </div>
          <span className={getRiskBadge(overallRisk)}>
            {overallRisk === "extreme" && "⚠️"}
            {overallRisk === "high" && "🔴"}
            {overallRisk === "moderate" && "🟡"}
            {overallRisk === "low" && "🟢"}
          </span>
        </div>

        {loading && (
          <div className="text-center text-muted-foreground py-4">
            <Cloud className="h-6 w-6 mx-auto mb-2 animate-pulse" />
            <p className="text-sm">{en ? "Loading historical data..." : "Đang tải dữ liệu lịch sử..."}</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {!loading && historicalData && (
          <>
            {/* Historical Context */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Info className="h-4 w-4 text-primary" />
                {en ? "Historical Context for" : "Bối cảnh lịch sử cho"} {getMonthName(weddingMonth)}
                <span className="text-muted-foreground font-normal">
                  ({historicalData.yearsAnalyzed} {en ? "years" : "năm"})
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">
                    {en ? "Avg High Temp" : "Nhiệt Độ TB Cao"}
                  </div>
                  <div className="text-lg font-bold">
                    {Math.round(historicalData.avgTempMax)}°C
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">
                    {en ? "Avg Low Temp" : "Nhiệt Độ TB Thấp"}
                  </div>
                  <div className="text-lg font-bold">
                    {Math.round(historicalData.avgTempMin)}°C
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">
                    {en ? "Avg Rainy Days" : "Ngày Mưa TB"}
                  </div>
                  <div className="text-lg font-bold">
                    {Math.round(historicalData.avgRainyDays)}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">
                    {en ? "Max Rainfall Day" : "Ngày Mưa Nhiều"}
                  </div>
                  <div className="text-lg font-bold">
                    {Math.round(historicalData.maxPrecipitationDay)}mm
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Breakdown */}
            <div className="space-y-3">
              <div className="text-sm font-medium">
                {en ? "Risk Breakdown:" : "Phân Tích Rủi Ro:"}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{en ? "Temperature" : "Nhiệt Độ"}</span>
                  </div>
                  <span className={getRiskBadge(getTemperatureRisk())}>
                    {en ? getTemperatureRisk() : getTemperatureRisk() === "extreme" ? "Cao" : getTemperatureRisk() === "high" ? "Cao" : getTemperatureRisk() === "moderate" ? "Trung Bình" : "Thấp"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Umbrella className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{en ? "Precipitation" : "Lượng Mưa"}</span>
                  </div>
                  <span className={getRiskBadge(getPrecipitationRisk())}>
                    {en ? getPrecipitationRisk() : getPrecipitationRisk() === "high" ? "Cao" : getPrecipitationRisk() === "moderate" ? "Trung Bình" : "Thấp"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{en ? "Wind" : "Gió"}</span>
                  </div>
                  <span className={getRiskBadge(getWindRisk())}>
                    {en ? getWindRisk() : getWindRisk() === "high" ? "Cao" : getWindRisk() === "moderate" ? "Trung Bình" : "Thấp"}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <div className="text-sm font-medium">
                {en ? "Contingency Planning:" : "Lập Kế Hoạch Dự Phòng:"}
              </div>
              <ul className="space-y-2">
                {getRecommendations().map((rec, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
