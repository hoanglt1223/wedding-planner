import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import type { VendorPayment } from "@/types/wedding";

interface PaymentTimelineProps {
  payments: VendorPayment[];
  onViewDetails?: (paymentId: number) => void;
  lang: string;
}

export function PaymentTimeline({ payments, onViewDetails, lang }: PaymentTimelineProps) {
  const en = lang === "en";

  // Sort payments by due date
  const sortedPayments = [...payments].sort((a, b) =>
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Group payments by time period
  const now = new Date();
  const next7Days = sortedPayments.filter(p => {
    const dueDate = new Date(p.dueDate);
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  const next30Days = sortedPayments.filter(p => {
    const dueDate = new Date(p.dueDate);
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / 1000 * 60 * 60 * 24);
    return diffDays > 7 && diffDays <= 30;
  });

  const next90Days = sortedPayments.filter(p => {
    const dueDate = new Date(p.dueDate);
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / 1000 * 60 * 60 * 24);
    return diffDays > 30 && diffDays <= 90;
  });

  const overdue = sortedPayments.filter(p => {
    const dueDate = new Date(p.dueDate);
    return dueDate < now && !p.paid;
  });

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + "₫";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getDaysUntil = (dateStr: string) => {
    const now = new Date();
    const dueDate = new Date(dateStr);
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days: number) => {
    if (days < 0) return "text-red-600";
    if (days <= 7) return "text-orange-600";
    if (days <= 30) return "text-yellow-600";
    return "text-green-600";
  };

  const renderPaymentCard = (payment: VendorPayment) => {
    const daysUntil = getDaysUntil(payment.dueDate);
    const isOverdue = daysUntil < 0 && !payment.paid;
    const isUrgent = daysUntil <= 7 && daysUntil >= 0;

    return (
      <Card key={payment.id} className={`border-l-4 ${isOverdue ? 'border-l-red-500' : isUrgent ? 'border-l-orange-500' : 'border-l-green-500'}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold truncate">{payment.vendorName}</h3>
                {payment.paid ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {en ? "Paid" : "Đã trả"}
                  </Badge>
                ) : isOverdue ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {en ? "Overdue" : "Quá hạn"}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Clock className="w-3 h-3 mr-1" />
                    {en ? "Pending" : "Chờ trả"}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-[var(--theme-primary)]">
                  {formatCurrency(payment.amount)}
                </span>
                <span>•</span>
                <span>{payment.description || en ? "Payment" : "Thanh toán"}</span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className={`text-sm font-medium ${getUrgencyColor(daysUntil)}`}>
                  {formatDate(payment.dueDate)}
                </span>
                {!payment.paid && (
                  <span className={`text-xs ${getUrgencyColor(daysUntil)}`}>
                    ({daysUntil < 0
                      ? `${Math.abs(daysUntil)} ${en ? "days ago" : "ngày trước"}`
                      : daysUntil === 0
                      ? en ? "Today" : "Hôm nay"
                      : `${daysUntil} ${en ? "days left" : "ngày nữa"}`})
                  </span>
                )}
              </div>
            </div>

            {onViewDetails && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewDetails(payment.id)}
                className="shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overdue Payments */}
      {overdue.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-red-600">
            {en ? "🚨 Overdue Payments" : "🚨 Thanh Toán Quá Hạn"}
          </h3>
          <div className="space-y-2">
            {overdue.map(renderPaymentCard)}
          </div>
        </div>
      )}

      {/* Next 7 Days */}
      {next7Days.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-orange-600">
            {en ? "⚡ Next 7 Days" : "⚡ 7 Ngày Tới"}
          </h3>
          <div className="space-y-2">
            {next7Days.map(renderPaymentCard)}
          </div>
        </div>
      )}

      {/* Next 30 Days */}
      {next30Days.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-600">
            {en ? "📅 Next 30 Days" : "📅 30 Ngày Tới"}
          </h3>
          <div className="space-y-2">
            {next30Days.map(renderPaymentCard)}
          </div>
        </div>
      )}

      {/* Next 90 Days */}
      {next90Days.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-green-600">
            {en ? "📆 Next 90 Days" : "📆 90 Ngày Tới"}
          </h3>
          <div className="space-y-2">
            {next90Days.map(renderPaymentCard)}
          </div>
        </div>
      )}

      {/* No Payments */}
      {sortedPayments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">
              {en
                ? "No upcoming payments scheduled."
                : "Chưa có thanh toán nào được lên lịch."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}