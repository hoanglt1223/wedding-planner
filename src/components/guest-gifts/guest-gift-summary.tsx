import { formatMoney } from "@/lib/format";
import type { GuestGift } from "@/types/wedding";

interface GuestGiftSummaryProps {
  gifts: GuestGift[];
  lang?: string;
}

export function GuestGiftSummary({ gifts, lang = "vi" }: GuestGiftSummaryProps) {
  const en = lang === "en";

  const totalGifts = gifts.length;
  const totalCost = gifts.reduce((sum, g) => sum + g.costPerUnit * g.totalQuantity, 0);
  const pendingItems = gifts.filter((g) => g.status === "pending").length;
  const distributedItems = gifts.filter((g) => g.status === "distributed").length;

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl"
      style={{ backgroundColor: "var(--theme-surface)", border: "1px solid var(--theme-border)" }}
    >
      <div className="text-center">
        <div className="text-2xl font-bold" style={{ color: "var(--theme-primary)" }}>
          {totalGifts}
        </div>
        <div className="text-xs text-muted-foreground">
          {en ? "Total Types" : "Tổng Loại"}
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">
          {formatMoney(totalCost, lang)}
        </div>
        <div className="text-xs text-muted-foreground">
          {en ? "Total Cost" : "Tổng Chi Phí"}
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">
          {distributedItems}
        </div>
        <div className="text-xs text-muted-foreground">
          {en ? "Distributed" : "Đã Phát"}
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600">
          {pendingItems}
        </div>
        <div className="text-xs text-muted-foreground">
          {en ? "Pending" : "Chuẩn Bị"}
        </div>
      </div>
    </div>
  );
}
