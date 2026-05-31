import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { t } from "@/lib/i18n";
import type { Guest } from "@/types/wedding";

interface GuestTableProps {
  guests: Guest[];
  onDelete: (id: number) => void;
  onEditGuest?: (id: number, updates: Partial<Guest>) => void;
  lang?: string;
}

export function GuestTable({ guests, onDelete, onEditGuest, lang = "vi" }: GuestTableProps) {
  const en = lang === "en";

  function handleDietaryChange(id: number, value: string) {
    onEditGuest?.(id, { dietary: value || undefined });
  }

  function handlePlusOneChange(id: number, value: string) {
    onEditGuest?.(id, { plusOneName: value || undefined });
  }

  return (
    <ScrollArea className="max-h-[350px] rounded border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 text-xs">#</TableHead>
              <TableHead className="text-xs">{t("Tên", lang)}</TableHead>
              <TableHead className="text-xs hidden sm:table-cell">{t("SĐT", lang)}</TableHead>
              <TableHead className="text-xs">{en ? "Side" : "Bên"}</TableHead>
              <TableHead className="text-xs hidden sm:table-cell">{en ? "Group" : "Nhóm"}</TableHead>
              <TableHead className="text-xs hidden md:table-cell">{en ? "Dietary" : "Chế độ ăn"}</TableHead>
              <TableHead className="text-xs hidden md:table-cell">{en ? "+1" : "Đi kèm"}</TableHead>
              <TableHead className="w-6 text-xs text-center">✕</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((g, i) => (
              <TableRow key={g.id}>
                <TableCell className="text-xs py-1">{i + 1}</TableCell>
                <TableCell className="text-xs py-1">
                  <div>{g.name}</div>
                  {g.phone && <div className="text-2xs text-gray-400 sm:hidden">{g.phone}</div>}
                  {g.plusOneName && <div className="text-2xs text-purple-500 md:hidden">+1 {g.plusOneName}</div>}
                  {g.dietary && <div className="text-2xs text-amber-500 md:hidden">🥬 {g.dietary}</div>}
                </TableCell>
                <TableCell className="text-xs py-1 hidden sm:table-cell">{g.phone || ""}</TableCell>
                <TableCell className="text-xs py-1">
                  {g.side === "trai" ? (en ? "Groom" : "Trai") : (en ? "Bride" : "Gái")}
                </TableCell>
                <TableCell className="text-xs py-1 hidden sm:table-cell">{g.tableGroup || ""}</TableCell>
                <TableCell className="text-xs py-1 hidden md:table-cell">
                  {onEditGuest ? (
                    <input
                      type="text"
                      className="w-20 h-6 text-xs border rounded px-1 bg-transparent focus:bg-white"
                      placeholder={en ? "None" : "Không"}
                      value={g.dietary || ""}
                      onChange={(e) => handleDietaryChange(g.id, e.target.value)}
                    />
                  ) : (
                    <span className={g.dietary ? "text-amber-600" : "text-gray-300"}>
                      {g.dietary || "-"}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-xs py-1 hidden md:table-cell">
                  {onEditGuest ? (
                    <input
                      type="text"
                      className="w-20 h-6 text-xs border rounded px-1 bg-transparent focus:bg-white"
                      placeholder={en ? "None" : "Không"}
                      value={g.plusOneName || ""}
                      onChange={(e) => handlePlusOneChange(g.id, e.target.value)}
                    />
                  ) : (
                    <span className={g.plusOneName ? "text-purple-600" : "text-gray-300"}>
                      {g.plusOneName || "-"}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-xs py-1 text-center">
                  <span
                    className="cursor-pointer text-red-500 hover:text-red-700 font-bold"
                    onClick={() => onDelete(g.id)}
                  >
                    ✕
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}
