import { t } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import type { GiftEntry } from "@/types/wedding";

interface Props {
  gifts: GiftEntry[];
  lang: string;
}

export function GiftSummaryBar({ gifts, lang }: Props) {
  const cashGifts = gifts.filter((g) => g.type === "cash");
  const giftItems = gifts.filter((g) => g.type === "gift");

  const totalCash = cashGifts.reduce((sum, g) => sum + (g.amount ?? 0), 0);
  const groomCash = cashGifts
    .filter((g) => g.side === "groom")
    .reduce((sum, g) => sum + (g.amount ?? 0), 0);
  const brideCash = cashGifts
    .filter((g) => g.side === "bride")
    .reduce((sum, g) => sum + (g.amount ?? 0), 0);
  const otherCash = cashGifts
    .filter((g) => g.side === "other")
    .reduce((sum, g) => sum + (g.amount ?? 0), 0);

  const thanked = gifts.filter((g) => g.thankYouSent).length;
  const total = gifts.length;

  const sideLabel = (side: string) => {
    if (lang === "en") {
      return side === "groom" ? "Groom" : side === "bride" ? "Bride" : "Other";
    }
    return side === "groom" ? "Nhà trai" : side === "bride" ? "Nhà gái" : "Khác";
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-muted/30 rounded-lg mb-3">
      <div className="col-span-2 sm:col-span-1">
        <div className="text-xs text-muted-foreground">{t("Tổng tiền mặt", lang)}</div>
        <div className="font-bold text-green-600 text-sm">
          {formatMoney(totalCash, lang)}đ
        </div>
        <div className="text-xs text-muted-foreground">
          {cashGifts.length} {t("Tiền mặt", lang).toLowerCase()} · {giftItems.length} {t("Quà tặng", lang).toLowerCase()}
        </div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground">{sideLabel("groom")}</div>
        <div className="font-semibold text-sm">{formatMoney(groomCash, lang)}đ</div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground">{sideLabel("bride")}</div>
        <div className="font-semibold text-sm">{formatMoney(brideCash, lang)}đ</div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground">
          {lang === "en" ? "Other / Thank-you" : "Khác / Cảm ơn"}
        </div>
        <div className="font-semibold text-sm">{formatMoney(otherCash, lang)}đ</div>
        <div className="text-xs text-muted-foreground">
          {t("Đã cảm ơn", lang)} {thanked}/{total}
        </div>
      </div>
    </div>
  );
}
