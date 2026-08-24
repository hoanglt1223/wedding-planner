import { Card } from "@/components/ui/card";
import { getAlertColor, getAlertIcon } from "@/lib/budget-health";
import type { BudgetHealthAlert } from "@/lib/budget-health";
import { X } from "lucide-react";

interface BudgetHealthAlertsProps {
  alerts: BudgetHealthAlert[];
  onDismiss?: (alert: BudgetHealthAlert) => void;
  lang?: string;
}

export function BudgetHealthAlerts({ alerts, onDismiss, lang = "vi" }: BudgetHealthAlertsProps) {
  const en = lang === "en";

  if (alerts.length === 0) {
    return null;
  }

  // Sort by severity: critical > danger > warning
  const severityOrder = { critical: 0, danger: 1, warning: 2 };
  const sortedAlerts = [...alerts].sort((a, b) => severityOrder[a.level] - severityOrder[b.level]);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">
        {en ? "🚨 Budget Alerts" : "🚨 Cảnh Báo Ngân Sách"}
      </h3>
      {sortedAlerts.map((alert, index) => {
        const colorClass = getAlertColor(alert.level);
        const icon = getAlertIcon(alert.level);

        return (
          <Card
            key={index}
            className={`p-3 border ${colorClass} relative`}
          >
            <div className="flex items-start gap-2 pr-6">
              <span className="text-xl">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{alert.message}</p>
                {alert.overspent > 0 && (
                  <p className="text-xs mt-1 opacity-80">
                    {en
                      ? `Overspent: ${alert.overspent.toLocaleString()}₫`
                      : `Vượt chi: ${alert.overspent.toLocaleString()}₫`}
                  </p>
                )}
                {alert.category && (
                  <p className="text-xs mt-1 opacity-70">
                    {en ? "Category:" : "Danh mục:"} {alert.category}
                  </p>
                )}
              </div>
              {onDismiss && (
                <button
                  onClick={() => onDismiss(alert)}
                  className="absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity"
                  aria-label={en ? "Dismiss alert" : "Bỏ cảnh báo"}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
