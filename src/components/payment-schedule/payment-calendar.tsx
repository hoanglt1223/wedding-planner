import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VendorPayment } from "@/types/wedding";

interface PaymentCalendarProps {
  payments: VendorPayment[];
  month?: Date;
  lang: string;
}

export function PaymentCalendar({ payments, month = new Date(), lang }: PaymentCalendarProps) {
  const en = lang === "en";

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + "₫";
  };

  // Get calendar data for the month
  const getCalendarData = () => {
    const year = month.getFullYear();
    const monthNum = month.getMonth();
    const firstDay = new Date(year, monthNum, 1);
    const lastDay = new Date(year, monthNum + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    // Filter payments for this month
    const monthlyPayments = payments.filter(p => {
      const paymentDate = new Date(p.dueDate);
      return paymentDate.getMonth() === monthNum && paymentDate.getFullYear() === year;
    });

    return { daysInMonth, startDayOfWeek, monthlyPayments };
  };

  const { daysInMonth, startDayOfWeek, monthlyPayments } = getCalendarData();

  // Group payments by day
  const paymentsByDay: Record<number, VendorPayment[]> = {};
  monthlyPayments.forEach(payment => {
    const day = new Date(payment.dueDate).getDate();
    if (!paymentsByDay[day]) {
      paymentsByDay[day] = [];
    }
    paymentsByDay[day].push(payment);
  });

  const weekDays = en
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const monthNames = en
    ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    : ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  // Calculate monthly total
  const monthlyTotal = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {monthNames[month.getMonth()]} {month.getFullYear()}
        </h3>
        <div className="text-sm text-muted-foreground">
          {en ? "Total: " : "Tổng: "}
          <span className="font-bold text-[var(--theme-primary)]">
            {formatCurrency(monthlyTotal)}
          </span>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first of the month */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayPayments = paymentsByDay[day] || [];
              const hasPayment = dayPayments.length > 0;
              const hasPaidPayment = dayPayments.some(p => p.paid);
              const hasUnpaidPayment = dayPayments.some(p => !p.paid);

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-1 text-center relative ${
                    hasPayment ? "border-[var(--theme-primary)] bg-[var(--theme-surface)]" : "border-border"
                  }`}
                >
                  <div className="text-sm font-medium">{day}</div>
                  {hasPayment && (
                    <div className="mt-1 space-y-0.5">
                      {hasUnpaidPayment && (
                        <div className="w-2 h-2 rounded-full bg-red-500 mx-auto" />
                      )}
                      {hasPaidPayment && hasUnpaidPayment && (
                        <div className="w-2 h-2 rounded-full bg-green-500 mx-auto" />
                      )}
                      {hasPaidPayment && !hasUnpaidPayment && (
                        <div className="w-2 h-2 rounded-full bg-green-500 mx-auto" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">{en ? "Unpaid" : "Chưa trả"}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">{en ? "Paid" : "Đã trả"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly payment details */}
      {monthlyPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {en ? "💳 Payment Details" : "💳 Chi Tiết Thanh Toán"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {monthlyPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between text-sm py-2 border-b last:border-b-0">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{payment.vendorName}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(payment.dueDate).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
                      month: "short",
                      day: "numeric"
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--theme-primary)]">
                    {formatCurrency(payment.amount)}
                  </span>
                  {payment.paid ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      ✓
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      !
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}