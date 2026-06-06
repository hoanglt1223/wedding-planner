import { formatMoney, getCurrencySymbol } from "@/lib/format";
import { t } from "@/lib/i18n";
import type { GiftEntry } from "@/types/wedding";

interface GiftSummaryBarProps {
  gifts: GiftEntry[];
  lang: string;
}

export function GiftSummaryBar({ gifts, lang }: GiftSummaryBarProps) {
  const cur = getCurrencySymbol(lang);
  const cashGifts = gifts.filter((g) => g.type === "cash");
  const physicalGifts = gifts.filter((g) => g.type === "gift");
  const totalCash = cashGifts.reduce((sum, g) => sum + (g.amount ?? 0), 0);
  const thankedCount = gifts.filter((g) => g.thankYouSent).length;

  const cards = [
    {
      label: t("Tổng tiền mặt", lang),
      value: `${formatMoney(totalCash, lang)}${cur}`,
      icon: "💰",
      color: "text-green-700",
      bg: "bg-green-50",
    },
    {
      label: t("Tổng quà", lang),
      value: String(physicalGifts.length),
      icon: "🎁",
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      label: t("Đã cảm ơn", lang),
      value: `${thankedCount}/${gifts.length}`,
      icon: "💌",
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {cards.map((card) => (
        <div key={card.label} className={`${card.bg} rounded-lg p-2.5 text-center`}>
          <div className="text-base mb-0.5">{card.icon}</div>
          <div className={`text-sm font-bold ${card.color}`}>{card.value}</div>
          <div className="text-[10px] text-muted-foreground leading-tight">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
