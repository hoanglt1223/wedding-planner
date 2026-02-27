import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import type { GiftEntry } from "@/types/wedding";

interface Props {
  gift: GiftEntry;
  lang: string;
  onEdit: (gift: GiftEntry) => void;
  onDelete: (id: number) => void;
  onToggleThankYou: (id: number) => void;
}

function sideBadge(side: string, lang: string) {
  const label =
    side === "groom"
      ? lang === "en" ? "Groom" : "Nhà trai"
      : side === "bride"
      ? lang === "en" ? "Bride" : "Nhà gái"
      : t("Khác", lang);
  return (
    <Badge variant="outline" className="text-xs px-1 py-0">
      {label}
    </Badge>
  );
}

export function GiftEntryRow({ gift, lang, onEdit, onDelete, onToggleThankYou }: Props) {
  return (
    <div className="flex items-center gap-2 py-2 px-3 border-b last:border-0 text-sm hover:bg-muted/20">
      <input
        type="checkbox"
        checked={gift.thankYouSent}
        onChange={() => onToggleThankYou(gift.id)}
        title={t("Đã cảm ơn", lang)}
        className="shrink-0 accent-green-600 cursor-pointer"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-medium truncate">{gift.guestName}</span>
          <Badge
            className={`text-xs px-1 py-0 ${
              gift.type === "cash"
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-blue-100 text-blue-800 border-blue-300"
            }`}
            variant="outline"
          >
            {gift.type === "cash" ? t("Tiền mặt", lang) : t("Quà tặng", lang)}
          </Badge>
          {sideBadge(gift.side, lang)}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {gift.type === "cash" && gift.amount != null && (
            <span className="text-green-700 font-semibold mr-2">
              {formatMoney(gift.amount, lang)}đ
            </span>
          )}
          {gift.description && <span>{gift.description}</span>}
          {gift.tableGroup && (
            <span className="ml-2 text-muted-foreground">· {gift.tableGroup}</span>
          )}
        </div>
      </div>

      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => onEdit(gift)}
          className="text-xs px-2 py-1 rounded bg-muted hover:bg-accent transition-colors"
          title={lang === "en" ? "Edit" : "Sửa"}
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(gift.id)}
          className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
          title={t("Xóa", lang)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
