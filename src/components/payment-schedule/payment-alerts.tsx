import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, CheckCircle, X } from "lucide-react";
import type { VendorPayment } from "@/types/wedding";

interface PaymentAlertsProps {
  payments: VendorPayment[];
  onDismiss?: () => void;
  onViewDetails?: (paymentId: number) => void;
  lang: string;
}

export function PaymentAlerts({ payments, onDismiss, onViewDetails, lang }: PaymentAlertsProps) {
  const en = lang === "en";

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + "₫";
  };

  const now = new Date();

  // Categorize alerts
  const overduePayments = payments.filter(p => {
    const dueDate = new Date(p.dueDate);
    return dueDate < now && !p.paid;
  });

  const urgentPayments = payments.filter(p => {
    if (p.paid) return false;
    const dueDate = new Date(p.dueDate);
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  const upcomingPayments = payments.filter(p => {
    if (p.paid) return false;
    const dueDate = new Date(p.dueDate);
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 7 && diffDays <= 30;
  });

  const totalAlerts = overduePayments.length + urgentPayments.length + upcomingPayments.length;

  if (totalAlerts === 0) {
    return null;
  }

  const getAlertIcon = (type: "overdue" | "urgent" | "upcoming") => {
    switch (type) {
      case "overdue":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "urgent":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "upcoming":
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getAlertColor = (type: "overdue" | "urgent" | "upcoming") => {
    switch (type) {
      case "overdue":
        return "border-l-red-500 bg-red-50";
      case "urgent":
        return "border-l-orange-500 bg-orange-50";
      case "upcoming":
        return "border-l-yellow-500 bg-yellow-50";
    }
  };

  const getAlertTitle = (type: "overdue" | "urgent" | "upcoming", count: number) => {
    if (type === "overdue") {
      return en
        ? `${count} overdue payment${count > 1 ? "s" : ""}`
        : `${count} thanh toán quá hạn`;
    }
    if (type === "urgent") {
      return en
        ? `${count} urgent payment${count > 1 ? "s" : ""} (7 days)`
        : `${count} thanh toán khẩn cấp (7 ngày)`;
    }
    return en
      ? `${count} upcoming payment${count > 1 ? "s" : ""} (30 days)`
      : `${count} thanh toán sắp tới (30 ngày)`;
  };

  const renderAlert = (
    type: "overdue" | "urgent" | "upcoming",
    alertPayments: VendorPayment[]
  ) => {
    if (alertPayments.length === 0) return null;

    const totalAmount = alertPayments.reduce((sum, p) => sum + p.amount, 0);
    const maxAmountPayment = alertPayments.reduce((max, p) =>
      p.amount > max.amount ? p : max, alertPayments[0]
    );

    return (
      <Card key={type} className={`border-l-4 ${getAlertColor(type)}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              {getAlertIcon(type)}
              <div className="flex-1">
                <h4 className="font-semibold mb-1">
                  {getAlertTitle(type, alertPayments.length)}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {en ? "Total: " : "Tổng: "}
                  <span className="font-bold text-[var(--theme-primary)]">
                    {formatCurrency(totalAmount)}
                  </span>
                </p>

                {/* Show most expensive/urgent payment */}
                <div className="text-xs bg-white rounded p-2 border border-gray-200">
                  <div className="font-medium">{maxAmountPayment.vendorName}</div>
                  <div className="text-muted-foreground">
                    {new Date(maxAmountPayment.dueDate).toLocaleDateString(
                      lang === "vi" ? "vi-VN" : "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                    {" • "}
                    {formatCurrency(maxAmountPayment.amount)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {onViewDetails && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(maxAmountPayment.id)}
                  className="text-xs"
                >
                  {en ? "View" : "Xem"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {en ? "🔔 Payment Alerts" : "🔔 Cảnh Báo Thanh Toán"}
        </h3>
        {totalAlerts > 0 && onDismiss && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onDismiss}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {overduePayments.length > 0 && renderAlert("overdue", overduePayments)}
      {urgentPayments.length > 0 && renderAlert("urgent", urgentPayments)}
      {upcomingPayments.length > 0 && renderAlert("upcoming", upcomingPayments)}

      {/* Summary badge */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="w-4 h-4 text-green-600" />
        {en
          ? `${totalAlerts} payment${totalAlerts > 1 ? "s" : ""} need${totalAlerts === 1 ? "s" : ""} attention`
          : `${totalAlerts} thanh toán cần chú ý`}
      </div>
    </div>
  );
}