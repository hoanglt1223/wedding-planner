import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import type { WeddingContract, ContractStatus } from "@/types/contracts";

// Simple date formatter
function formatDate(dateStr: string, lang: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

interface ContractListProps {
  contracts: WeddingContract[];
  search: string;
  filterStatus: ContractStatus | "all";
  lang?: string;
  onEdit: (contract: WeddingContract) => void;
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void;
}

const STATUS_LABELS: Record<ContractStatus, { vi: string; en: string; color: string }> = {
  draft: { vi: "Nháp", en: "Draft", color: "bg-gray-100 text-gray-700" },
  sent: { vi: "Đã gửi", en: "Sent", color: "bg-blue-100 text-blue-700" },
  negotiating: { vi: "Đang thương lượng", en: "Negotiating", color: "bg-amber-100 text-amber-700" },
  signed: { vi: "Đã ký", en: "Signed", color: "bg-green-100 text-green-700" },
  completed: { vi: "Hoàn thành", en: "Completed", color: "bg-emerald-100 text-emerald-700" },
  cancelled: { vi: "Đã hủy", en: "Cancelled", color: "bg-red-100 text-red-700" },
};

export function ContractList({
  contracts,
  search,
  filterStatus,
  lang = "vi",
  onEdit,
  onDelete,
}: ContractListProps) {
  const en = lang === "en";

  // Filter contracts
  const filtered = contracts.filter((contract) => {
    const matchesSearch =
      search === "" ||
      contract.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      contract.vendorCategory.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || contract.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate payment progress
  const getPaymentProgress = (contract: WeddingContract) => {
    if (contract.totalAmount === 0) return 0;
    return (contract.totalPaid / contract.totalAmount) * 100;
  };

  // Check for upcoming payments
  const getUpcomingPayment = (contract: WeddingContract) => {
    const upcoming = contract.paymentMilestones
      .filter((m) => m.status === "pending")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    return upcoming;
  };

  if (filtered.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">📄</span>
        </div>
        <p className="text-sm font-medium mb-1">
          {en ? "Không tìm thấy hợp đồng" : "Không tìm thấy hợp đồng"}
        </p>
        <p className="text-xs text-muted-foreground">
          {search || filterStatus !== "all"
            ? en
              ? "Thử thay đổi bộ lọc tìm kiếm"
              : "Thử thay đổi bộ lọc tìm kiếm"
            : en
              ? "Thêm hợp đồng đầu tiên của bạn"
              : "Thêm hợp đồng đầu tiên của bạn"}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((contract) => {
        const statusLabel = STATUS_LABELS[contract.status];
        const paymentProgress = getPaymentProgress(contract);
        const upcomingPayment = getUpcomingPayment(contract);
        const daysUntilDue = upcomingPayment
          ? Math.ceil((new Date(upcomingPayment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : null;

        return (
          <Card
            key={contract.id}
            className="p-4 hover:border-[var(--theme-primary)] transition-colors cursor-pointer"
            onClick={() => onEdit(contract)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{contract.vendorName}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusLabel.color}`}>
                    {en ? statusLabel.en : statusLabel.vi}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{contract.vendorCategory}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(en ? "Delete this contract?" : "Xóa hợp đồng này?")) {
                    onDelete(contract.id);
                  }
                }}
                className="text-muted-foreground hover:text-red-600 transition-colors p-1"
              >
                🗑️
              </button>
            </div>

            {/* Contract details */}
            <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
              <div>
                <p className="text-muted-foreground">{en ? "Giá trị" : "Giá trị"}</p>
                <p className="font-medium">{formatMoney(contract.totalAmount, lang)}₫</p>
              </div>
              <div>
                <p className="text-muted-foreground">{en ? "Đã trả" : "Đã trả"}</p>
                <p className="font-medium text-green-600">{formatMoney(contract.totalPaid, lang)}₫</p>
              </div>
              <div>
                <p className="text-muted-foreground">{en ? "Thời gian" : "Thời gian"}</p>
                <p className="font-medium">
                  {formatDate(contract.startDate, lang)} - {formatDate(contract.endDate, lang)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{en ? "Thanh toán" : "Thanh toán"}</p>
                <p className="font-medium">{paymentProgress.toFixed(0)}%</p>
              </div>
            </div>

            {/* Payment progress bar */}
            <div className="mb-3">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-[var(--theme-primary)] h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(paymentProgress, 100)}%` }}
                />
              </div>
            </div>

            {/* Upcoming payment warning */}
            {upcomingPayment && daysUntilDue !== null && (
              <div
                className={`text-[10px] px-2 py-1 rounded ${
                  daysUntilDue < 0
                    ? "bg-red-50 text-red-700"
                    : daysUntilDue <= 7
                      ? "bg-amber-50 text-amber-700"
                      : "bg-blue-50 text-blue-700"
                }`}
              >
                {daysUntilDue < 0
                  ? en
                    ? `⚠️ Overdue: ${upcomingPayment.title}`
                    : `⚠️ Quá hạn: ${upcomingPayment.title}`
                  : en
                    ? `📅 Due in ${daysUntilDue}d: ${upcomingPayment.title}`
                    : `📅 Còn ${daysUntilDue} ngày: ${upcomingPayment.title}`}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
