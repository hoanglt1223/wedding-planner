import { Card, CardContent } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import type { WeddingContract, ContractSummary } from "@/types/contracts";
import type { ContractStatus } from "@/types/contracts";

interface ContractSummaryBarProps {
  contracts: WeddingContract[];
  lang?: string;
}

export function ContractSummaryBar({ contracts, lang = "vi" }: ContractSummaryBarProps) {
  const en = lang === "en";

  // Calculate summary statistics
  const summary: ContractSummary = contracts.reduce(
    (acc, contract) => {
      acc.totalContracts++;
      if (contract.status === "signed" || contract.status === "negotiating") {
        acc.activeContracts++;
      }
      acc.totalValue += contract.totalAmount;
      acc.totalPaid += contract.totalPaid;

      // Count payment milestones
      contract.paymentMilestones.forEach((milestone) => {
        const now = new Date();
        const dueDate = new Date(milestone.dueDate);
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (milestone.status === "pending") {
          acc.pendingPayments++;
          if (daysUntilDue <= 7 && daysUntilDue >= 0) {
            acc.upcomingDeadlines++;
          } else if (daysUntilDue < 0) {
            acc.overduePayments++;
          }
        }
      });

      return acc;
    },
    {
      totalContracts: 0,
      activeContracts: 0,
      totalValue: 0,
      totalPaid: 0,
      pendingPayments: 0,
      overduePayments: 0,
      upcomingDeadlines: 0,
    } as ContractSummary
  );

  // Status badges
  const statusBadges: { status: ContractStatus; labelVi: string; labelEn: string; color: string }[] = [
    { status: "draft", labelVi: "Nháp", labelEn: "Draft", color: "bg-gray-100 text-gray-700" },
    { status: "sent", labelVi: "Đã gửi", labelEn: "Sent", color: "bg-blue-100 text-blue-700" },
    { status: "negotiating", labelVi: "Đang thương lượng", labelEn: "Negotiating", color: "bg-amber-100 text-amber-700" },
    { status: "signed", labelVi: "Đã ký", labelEn: "Signed", color: "bg-green-100 text-green-700" },
    { status: "completed", labelVi: "Hoàn thành", labelEn: "Completed", color: "bg-emerald-100 text-emerald-700" },
    { status: "cancelled", labelVi: "Đã hủy", labelEn: "Cancelled", color: "bg-red-100 text-red-700" },
  ];

  // Count contracts by status
  const statusCounts = contracts.reduce(
    (acc, contract) => {
      acc[contract.status] = (acc[contract.status] || 0) + 1;
      return acc;
    },
    {} as Record<ContractStatus, number>
  );

  return (
    <Card className="border-[var(--theme-border)]">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total contracts */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{en ? "Tổng hợp đồng" : "Tổng hợp đồng"}</p>
            <p className="text-2xl font-bold">{summary.totalContracts}</p>
            <div className="flex gap-1 flex-wrap">
              {statusBadges.map(({ status, labelVi, labelEn, color }) => {
                const count = statusCounts[status] || 0;
                if (count === 0) return null;
                return (
                  <span key={status} className={`text-[10px] px-1.5 py-0.5 rounded-full ${color}`}>
                    {en ? labelEn : labelVi}: {count}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Active contracts */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{en ? "Đang hoạt động" : "Đang hoạt động"}</p>
            <p className="text-2xl font-bold text-[var(--theme-primary)]">{summary.activeContracts}</p>
            <p className="text-xs text-muted-foreground">
              {en ? "hợp đồng" : "hợp đồng"}
            </p>
          </div>

          {/* Total value */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{en ? "Tổng giá trị" : "Tổng giá trị"}</p>
            <p className="text-lg font-bold">{formatMoney(summary.totalValue, lang)}₫</p>
            <p className="text-xs text-muted-foreground">
              {en ? "Đã trả: " : "Đã trả: "}
              {formatMoney(summary.totalPaid, lang)}₫
            </p>
          </div>

          {/* Payment alerts */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{en ? "Thanh toán" : "Thanh toán"}</p>
            <div className="flex gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-amber-600">{summary.upcomingDeadlines}</p>
                <p className="text-[10px] text-muted-foreground">{en ? "sắp tới" : "sắp tới"}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-600">{summary.overduePayments}</p>
                <p className="text-[10px] text-muted-foreground">{en ? "quá hạn" : "quá hạn"}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {en ? `${summary.pendingPayments} chờ` : `${summary.pendingPayments} chờ`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
