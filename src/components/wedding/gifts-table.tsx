import type { GiftItem } from "@/types/wedding";
import { formatMoney } from "@/lib/format";
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
}

export function GiftsTable({ gifts }: GiftsTableProps) {
  const total = gifts.reduce((sum, g) => sum + g.c, 0);

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm mb-2">
      <h2 className="text-sm font-bold text-red-800 mb-2">🎁 Lễ Vật</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2 text-sm font-semibold text-amber-900">
        Tổng: <span className="text-red-700 font-bold">{formatMoney(total)}đ</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="text-xs">
            <TableHead className="text-gray-700 font-bold">Tên</TableHead>
            <TableHead className="text-gray-700 font-bold text-center">SL</TableHead>
            <TableHead className="text-gray-700 font-bold text-right">Giá</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gifts.map((gift, i) => (
            <TableRow key={i} className="text-xs">
              <TableCell className="font-semibold text-gray-800">{gift.n}</TableCell>
              <TableCell className="text-center text-gray-600">{gift.q}</TableCell>
              <TableCell className="text-right text-red-700 font-semibold">
                {gift.c ? `${formatMoney(gift.c)}đ` : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
