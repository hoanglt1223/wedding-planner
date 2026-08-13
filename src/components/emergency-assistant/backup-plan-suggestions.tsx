import { Cloud, CloudRain, Sun, Umbrella, MapPin, Phone } from "lucide-react";
import { useState } from "react";

interface BackupPlan {
  id: string;
  condition: string;
  originalPlan: string;
  backupOption: string;
  location?: string;
  contact?: string;
  estimatedCost?: number;
  priority: "essential" | "recommended" | "optional";
}

interface BackupPlanSuggestionsProps {
  plans: BackupPlan[];
  currentWeather?: "sunny" | "cloudy" | "rainy" | "storm";
  lang?: string;
  onSelectPlan?: (planId: string) => void;
}

const t = {
  vi: {
    backupPlans: "Kế Hoách Dự Phòng",
    weatherBased: "Dựa Trên Thời Tiết",
    currentConditions: "Điều Kiện Hiện Tại",
    activateBackup: "Kích Hoạt Dự Phòng",
    viewDetails: "Xem Chi Tiết",
    estimatedCost: "Chi Phí Ước Tính",
    priority: "Ưu Tiên",
    essential: "Bắt Buộc",
    recommended: "Khuyến Nghị",
    optional: "Tùy Chọn",
    noBackupPlans: "Chưa có kế hoạch dự phòng",
    backupActivated: "Đã Kích Hoạt",
  },
  en: {
    backupPlans: "Backup Plans",
    weatherBased: "Weather-Based",
    currentConditions: "Current Conditions",
    activateBackup: "Activate Backup",
    viewDetails: "View Details",
    estimatedCost: "Estimated Cost",
    priority: "Priority",
    essential: "Essential",
    recommended: "Recommended",
    optional: "Optional",
    noBackupPlans: "No backup plans set",
    backupActivated: "Activated",
  },
};

export function BackupPlanSuggestions({
  plans,
  currentWeather = "sunny",
  lang = "vi",
  onSelectPlan
}: BackupPlanSuggestionsProps) {
  const labels = t[lang as keyof typeof t] || t.vi;
  const [activatedPlans, setActivatedPlans] = useState<Set<string>>(new Set());

  const handleActivate = (planId: string) => {
    setActivatedPlans(prev => new Set(prev).add(planId));
    onSelectPlan?.(planId);
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "storm":
        return <CloudRain className="text-red-500" size={24} />;
      case "rainy":
        return <CloudRain className="text-blue-500" size={24} />;
      case "cloudy":
        return <Cloud className="text-gray-500" size={24} />;
      default:
        return <Sun className="text-yellow-500" size={24} />;
    }
  };

  const getWeatherLabel = (weather: string) => {
    const weatherLabels = {
      vi: { sunny: "Nắng đẹp", cloudy: "Nhiều mây", rainy: "Có mưa", storm: "Giông bão" },
      en: { sunny: "Sunny", cloudy: "Cloudy", rainy: "Rainy", storm: "Stormy" }
    };
    return weatherLabels[lang as keyof typeof weatherLabels]?.[weather as keyof typeof weatherLabels.vi] || weather;
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "essential":
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      case "recommended":
        return "border-orange-500 bg-orange-50 dark:bg-orange-900/20";
      default:
        return "border-gray-500 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "essential": return labels.essential;
      case "recommended": return labels.recommended;
      default: return labels.optional;
    }
  };

  const formatCurrency = (amount: number) => {
    return lang === "vi"
      ? `${amount.toLocaleString('vi-VN')}đ`
      : `$${amount.toLocaleString('en-US')}`;
  };

  // Auto-suggest plans based on current weather
  const recommendedPlans = plans.filter(plan => {
    if (currentWeather === "storm" || currentWeather === "rainy") {
      return plan.condition === "rain" || plan.priority === "essential";
    }
    return plan.priority === "essential";
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getWeatherIcon(currentWeather)}
          <div>
            <h3 className="text-lg font-semibold">{labels.backupPlans}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {labels.currentConditions}: {getWeatherLabel(currentWeather)}
            </p>
          </div>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-8">
          <Umbrella size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">{labels.noBackupPlans}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendedPlans.map((plan) => {
            const isActivated = activatedPlans.has(plan.id);
            return (
              <div
                key={plan.id}
                className={`border-l-4 rounded-lg p-4 ${getPriorityStyle(plan.priority)} ${
                  isActivated ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{plan.originalPlan}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700">
                        {getPriorityLabel(plan.priority)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {plan.backupOption}
                    </p>
                  </div>
                  {isActivated && (
                    <span className="text-xs px-2 py-1 bg-green-500 text-white rounded">
                      {labels.backupActivated}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mb-3 text-sm">
                  {plan.location && (
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <MapPin size={16} />
                      <span>{plan.location}</span>
                    </div>
                  )}
                  {plan.contact && (
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <Phone size={16} />
                      <span>{plan.contact}</span>
                    </div>
                  )}
                  {plan.estimatedCost && (
                    <div className="text-gray-600 dark:text-gray-300">
                      {labels.estimatedCost}: {formatCurrency(plan.estimatedCost)}
                    </div>
                  )}
                </div>

                {!isActivated && (
                  <button
                    onClick={() => handleActivate(plan.id)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {labels.activateBackup}
                  </button>
                )}
              </div>
            );
          })}

          {plans.length > recommendedPlans.length && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
                {labels.viewDetails} ({plans.length - recommendedPlans.length} more)
              </summary>
              <div className="mt-2 space-y-2">
                {plans
                  .filter(plan => !recommendedPlans.includes(plan))
                  .map(plan => (
                    <div
                      key={plan.id}
                      className={`border-l-4 rounded-lg p-3 ${getPriorityStyle(plan.priority)} opacity-70`}
                    >
                      <h5 className="font-medium text-sm">{plan.originalPlan}</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {plan.backupOption}
                      </p>
                    </div>
                  ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}