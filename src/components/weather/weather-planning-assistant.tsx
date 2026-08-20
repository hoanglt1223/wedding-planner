import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Umbrella,
  Sun,
  Wind,
  Thermometer,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb
} from "lucide-react";

interface WeatherData {
  tempMax: number | null;
  tempMin: number | null;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  weatherCode: number;
  description: string;
}

interface WeatherPlanningAssistantProps {
  weather: WeatherData;
  lang: "vi" | "en";
}

interface Recommendation {
  icon: React.ReactNode;
  titleVi: string;
  titleEn: string;
  items: string[];
  severity: "critical" | "warning" | "info" | "success";
}

function getRecommendations(
  weather: WeatherData,
  lang: "vi" | "en"
): Recommendation[] {
  const en = lang === "en";
  const recommendations: Recommendation[] = [];

  // Precipitation analysis
  if (weather.precipitationProbability >= 70 || weather.precipitationSum >= 10) {
    recommendations.push({
      icon: <Umbrella className="h-5 w-5" />,
      titleVi: "Nguy cơ mưa nặng - Kế hoạch dự phòng bắt buộc",
      titleEn: "Heavy Rain Risk - Backup Plan Required",
      severity: "critical",
      items: en ? [
        "Move ceremony indoors or rent tent/marquee",
        "Prepare umbrellas for guests (1 per 2 guests)",
        "Use waterproof makeup and hair products",
        "Protect sound equipment and electronics",
        "Plan covered walkway from parking to venue",
        "Have towels ready for wet guests",
        "Consider photo booth indoors as backup"
      ] : [
        "Chuyển lễ cưới vào nhà hoặc thuê lều/dù",
        "Chuẩn bị ô cho khách (1 ô cho 2 khách)",
        "Dùng trang điểm và sản phẩm tóc chống nước",
        "Bảo vệ âm thanh và thiết bị điện tử",
        "Lên kế hoạch lối đi có mái từ bãi xe",
        "Chuẩn bị khăn cho khách ướt",
        "Cân nhắc chụp hình trong nhà dự phòng"
      ]
    });
  } else if (weather.precipitationProbability >= 40) {
    recommendations.push({
      icon: <Umbrella className="h-5 w-5" />,
      titleVi: "Có thể mưa - Chuẩn bị dự phòng",
      titleEn: "Light Rain Possible - Prepare Backup",
      severity: "warning",
      items: en ? [
        "Reserve indoor venue option",
        "Have umbrellas available",
        "Plan covered photo locations",
        "Consider moving outdoor activities under cover"
      ] : [
        "Giữ chỗ dự phòng trong nhà",
        "Chuẩn bị ô sẵn",
        "Lên kế hoạch địa điểm chụp ảnh có mái",
        "Cân nh chuyển hoạt động ngoài trời lên nơi có mái"
      ]
    });
  }

  // Temperature analysis - Hot
  if (weather.tempMax && weather.tempMax >= 35) {
    recommendations.push({
      icon: <Thermometer className="h-5 w-5 text-orange-500" />,
      titleVi: "Nóng cực đoan - Biện pháp làm mát bắt buộc",
      titleEn: "Extreme Heat - Cooling Measures Required",
      severity: "critical",
      items: en ? [
        "Ensure AC or powerful fans in venue",
        "Provide cold water stations (1 per 20 guests)",
        "Schedule outdoor activities before 10am or after 4pm",
        "Choose lightweight, breathable attire",
        "Have sunscreen and insect repellent available",
        "Consider misting fans for outdoor areas",
        "Prepare ice packs for emergency cooling",
        "Advise guests to dress lightly and hydrate"
      ] : [
        "Đảm bảo điều hòa hoặc quạt mạnh tại địa điểm",
        "Chuẩn bị nước lạnh (1 trạm cho 20 khách)",
        "Lên lịch hoạt động ngoài trời trước 10h hoặc sau 4h",
        "Chọn trang phục mỏng, thoáng khí",
        "Chuẩn bị kem chống nắng và xịt đuổi muỗi",
        "Cân nhắc quạt phun sương cho khu vực ngoài trời",
        "Chuẩn bị túi lạnh làm mát khẩn cấp",
        "Khuyên khách mặc thoáng và uống đủ nước"
      ]
    });
  } else if (weather.tempMax && weather.tempMax >= 30) {
    recommendations.push({
      icon: <Sun className="h-5 w-5 text-amber-500" />,
      titleVi: "Nóng - Cần làm mát",
      titleEn: "Hot Weather - Cooling Needed",
      severity: "warning",
      items: en ? [
        "Provide fans and cold drinks",
        "Schedule outdoor events in shaded areas",
        "Consider earlier/later ceremony time",
        "Ensure indoor venue has AC"
      ] : [
        "Chuẩn bị quạt và đồ uống lạnh",
        "Lên lịch sự kiện ngoài trời ở nơi râm mát",
        "Cân nhắc tổ chức lễ cưới sớm hơn hoặc muộn hơn",
        "Đảm bảo địa điểm trong nhà có điều hòa"
      ]
    });
  }

  // Temperature analysis - Cold
  if (weather.tempMax && weather.tempMax <= 15) {
    recommendations.push({
      icon: <Thermometer className="h-5 w-5 text-blue-500" />,
      titleVi: "Lạnh - Cần sưởi ấm",
      titleEn: "Cold Weather - Heating Required",
      severity: "warning",
      items: en ? [
        "Choose indoor heated venue",
        "Provide blankets or heaters for outdoor areas",
        "Advise guests to wear warm clothing",
        "Serve warm beverages (tea, coffee)",
        "Consider shorter outdoor ceremony",
        "Prepare indoor photo locations"
      ] : [
        "Chọn địa điểm trong nhà có sưởi",
        "Chuẩn bị chăn hoặc sưởi cho khu vực ngoài trời",
        "Khuyên khách mặc ấm",
        "Phục vụ đồ uống nóng (trà, cà phê)",
        "Cân nhắc lễ cưới ngoài trời ngắn hơn",
        "Chuẩn bị nơi chụp ảnh trong nhà"
      ]
    });
  }

  // Wind analysis
  if (weather.windSpeedMax >= 30) {
    recommendations.push({
      icon: <Wind className="h-5 w-5 text-gray-600" />,
      titleVi: "Gió mạnh - Cố định trang trí",
      titleEn: "Strong Winds - Secure Decorations",
      severity: "warning",
      items: en ? [
        "Avoid light decorations (ribbons, light fabrics)",
        "Use weighted centerpieces and tablecloths",
        "Secure all signage and guest book stands",
        "Avoid open flames (candles, lanterns)",
        "Consider wind barriers for outdoor areas",
        "Test microphone sound in wind conditions",
        "Use heavier gift card holders"
      ]: [
        "Tránh trang trí nhẹ (dải ruy băng, vải mỏng)",
        "Dùng tâm bàn và khăn bàn có trọng lượng",
        "Cố định biển và giá để sổ lưu bút",
        "Tránh lửa trần (nến, đèn lồng)",
        "Cân nhắc chắn gió cho khu vực ngoài trời",
        "Test âm thanh micro trong điều kiện gió",
        "Dùng giá thẻ quà nặng hơn"
      ]
    });
  }

  // Perfect weather condition
  if (
    weather.precipitationProbability < 30 &&
    weather.tempMax &&
    weather.tempMax >= 20 &&
    weather.tempMax <= 28 &&
    weather.windSpeedMax < 20
  ) {
    recommendations.push({
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      titleVi: "Thời tiết lý tưởng - Tận hưởng trọn vẹn!",
      titleEn: "Perfect Weather - Enjoy Fully!",
      severity: "success",
      items: en ? [
        "Great for outdoor ceremony and reception",
        "Take advantage of natural lighting for photos",
        "Consider garden ceremony or beach venue",
        "Plan outdoor activities and games",
        "Minimal weather concerns - focus on celebration!"
      ] : [
        "Tuyệt vời cho lễ cưới và tiệc ngoài trời",
        "Tận dụng ánh sáng tự nhiên cho ảnh",
        "Cân nhăng lễ cưới vườn hoặc biển",
        "Lên kế hoạch hoạt động và trò chơi ngoài trời",
        "Ít lo ngại thời tiết - tập trung vào lễ hội!"
      ]
    });
  }

  // General timeline suggestions
  recommendations.push({
    icon: <Clock className="h-5 w-5" />,
    titleVi: "Đề xuất thời gian",
    titleEn: "Timeline Suggestions",
    severity: "info",
    items: en ? [
      weather.precipitationProbability >= 40
        ? "Schedule main ceremony between 10am-2pm (typically less rain)"
        : weather.tempMax && weather.tempMax >= 30
        ? "Plan outdoor photos before 10am or after 4pm"
        : weather.tempMax && weather.tempMax <= 15
        ? "Schedule outdoor activities for warmest part of day (11am-2pm)"
        : "Standard timeline works well with these conditions"
    ]: [
      weather.precipitationProbability >= 40
        ? "Lên lịch lễ chính giữa 10h-14h (thường ít mưa)"
        : weather.tempMax && weather.tempMax >= 30
        ? "Lên lịch chụp ảnh ngoài trời trước 10h hoặc sau 4h"
        : weather.tempMax && weather.tempMax <= 15
        ? "Lên lịch hoạt động ngoài trời vào thời điểm ấm nhất (11h-14h)"
        : "Lịch trình tiêu chuẩn hoạt động tốt với điều kiện này"
    ]
  });

  return recommendations;
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical":
      return "text-red-600 bg-red-50 border-red-200";
    case "warning":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "success":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-blue-600 bg-blue-50 border-blue-200";
  }
}

function getSeverityIcon(severity: string): React.ReactNode {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-4 w-4" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4" />;
    case "success":
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return <Lightbulb className="h-4 w-4" />;
  }
}

export function WeatherPlanningAssistant({
  weather,
  lang,
}: WeatherPlanningAssistantProps) {
  const en = lang === "en";
  const recommendations = getRecommendations(weather, lang);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">
          {en ? "Planning Recommendations" : "Đề Xuất Lập Kế Hoạch"}
        </h3>
      </div>

      {recommendations.length === 0 ? (
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground text-center">
              {en
                ? "Set your wedding date to see planning recommendations"
                : "Đặt ngày cưới để xem đề xuất lập kế hoạch"}
            </div>
          </CardContent>
        </Card>
      ) : (
        recommendations.map((rec, index) => (
          <Card
            key={index}
            className={`border ${getSeverityColor(rec.severity)}`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {rec.icon}
                {en ? rec.titleEn : rec.titleVi}
                <Badge
                  variant="outline"
                  className={`ml-auto ${
                    rec.severity === "critical"
                      ? "border-red-300 text-red-600"
                      : rec.severity === "warning"
                      ? "border-amber-300 text-amber-600"
                      : rec.severity === "success"
                      ? "border-green-300 text-green-600"
                      : "border-blue-300 text-blue-600"
                  }`}
                >
                  {getSeverityIcon(rec.severity)}
                  <span className="ml-1">
                    {en
                      ? rec.severity.charAt(0).toUpperCase() + rec.severity.slice(1)
                      : rec.severity === "critical"
                      ? "Cần Làm Ngay"
                      : rec.severity === "warning"
                      ? "Cần Chú Ý"
                      : rec.severity === "success"
                      ? "Tốt"
                      : "Thông Tin"}
                  </span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {rec.items.map((item, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="flex-shrink-0 mt-0.5">
                      {rec.severity === "critical" ? (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      ) : rec.severity === "success" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-current mt-1.5" />
                      )}
                    </span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
