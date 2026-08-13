import { Bell, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

interface TimelineAlert {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "info" | "warning" | "critical";
  acknowledged?: boolean;
}

interface EmergencyTimelineAlertsProps {
  alerts: TimelineAlert[];
  lang?: string;
  onAcknowledge?: (alertId: string) => void;
}

const t = {
  vi: {
    upcomingMilestones: "Cột Mốc Sắp Tới",
    acknowledged: "Đã Xác Nhận",
    acknowledge: "Xác Nhận",
    minutesRemaining: "còn lại",
    noAlerts: "Không có cảnh báo nào",
    getReady: "Chuẩn Bị Sẵn Sàng",
  },
  en: {
    upcomingMilestones: "Upcoming Milestones",
    acknowledged: "Acknowledged",
    acknowledge: "Acknowledge",
    minutesRemaining: "minutes remaining",
    noAlerts: "No alerts",
    getReady: "Get Ready",
  },
};

export function EmergencyTimelineAlerts({
  alerts,
  lang = "vi",
  onAcknowledge
}: EmergencyTimelineAlertsProps) {
  const labels = t[lang as keyof typeof t] || t.vi;
  const [localAlerts, setLocalAlerts] = useState(alerts);

  const handleAcknowledge = (alertId: string) => {
    setLocalAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    onAcknowledge?.(alertId);
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      case "warning":
        return "border-orange-500 bg-orange-50 dark:bg-orange-900/20";
      default:
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="text-red-600 dark:text-red-400" size={20} />;
      case "warning":
        return <Clock className="text-orange-600 dark:text-orange-400" size={20} />;
      default:
        return <Bell className="text-blue-600 dark:text-blue-400" size={20} />;
    }
  };

  const upcomingAlerts = localAlerts
    .filter(alert => !alert.acknowledged)
    .sort((a, b) => a.time.localeCompare(b.time));

  const acknowledgedAlerts = localAlerts.filter(alert => alert.acknowledged);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={20} className="text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold">{labels.upcomingMilestones}</h3>
      </div>

      {upcomingAlerts.length === 0 && acknowledgedAlerts.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">{labels.noAlerts}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 rounded-lg p-4 ${getAlertStyle(alert.type)}`}
            >
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{alert.title}</h4>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {alert.description}
                  </p>
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    {labels.acknowledge}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {acknowledgedAlerts.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
                {labels.acknowledged} ({acknowledgedAlerts.length})
              </summary>
              <div className="mt-2 space-y-2 opacity-60">
                {acknowledgedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`border-l-4 rounded-lg p-3 ${getAlertStyle(alert.type)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getAlertIcon(alert.type)}
                        <span className="text-sm font-medium">{alert.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
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