import type { GiftItem } from "@/types/wedding";
import { formatMoney, getCurrencySymbol } from "@/lib/format";
import { t } from "@/lib/i18n";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GiftsTableProps {
  gifts: GiftItem[];
  lang?: string;
}

export function GiftsTable({ gifts, lang = "vi" }: GiftsTableProps) {
  const total = gifts.reduce((sum, g) => sum + g.cost, 0);
  const cur = getCurrencySymbol(lang);

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl p-3 shadow-sm border border-[var(--theme-border)] mb-2">
      <h2 className="text-sm font-bold text-primary mb-2">{t("🎁 Lễ Vật", lang)}</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2 text-sm font-semibold text-amber-900">
        {t("Tổng:", lang)} <span className="text-primary font-bold">{formatMoney(total, lang)}{cur}</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="text-xs">
            <TableHead className="text-gray-700 font-bold">{t("Tên", lang)}</TableHead>
            <TableHead className="text-gray-700 font-bold text-center">{t("SL", lang)}</TableHead>
            <TableHead className="text-gray-700 font-bold text-right">{t("Giá", lang)}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gifts.map((gift, i) => (
            <TableRow key={i} className="text-xs">
              <TableCell className="font-semibold text-gray-800">{gift.name}</TableCell>
              <TableCell className="text-center text-gray-600">{gift.quantity}</TableCell>
              <TableCell className="text-right text-primary font-semibold">
                {gift.cost ? `${formatMoney(gift.cost, lang)}${cur}` : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
