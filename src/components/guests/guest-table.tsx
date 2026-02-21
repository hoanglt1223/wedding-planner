import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Guest } from "@/types/wedding";

interface GuestTableProps {
  guests: Guest[];
  onDelete: (id: number) => void;
}

export function GuestTable({ guests, onDelete }: GuestTableProps) {
  return (
    <ScrollArea className="max-h-[350px] rounded border">
      <div className="overflow-x-auto">
        <Table className="min-w-[420px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 text-xs">#</TableHead>
              <TableHead className="text-xs">Tên</TableHead>
              <TableHead className="text-xs hidden sm:table-cell">SĐT</TableHead>
              <TableHead className="text-xs">Bên</TableHead>
              <TableHead className="text-xs">Nhóm</TableHead>
              <TableHead className="w-6 text-xs text-center">✕</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((g, i) => (
              <TableRow key={g.id}>
                <TableCell className="text-xs py-1">{i + 1}</TableCell>
                <TableCell className="text-xs py-1">
                  <div>{g.name}</div>
                  {g.phone && <div className="text-[0.6rem] text-gray-400 sm:hidden">{g.phone}</div>}
                </TableCell>
                <TableCell className="text-xs py-1 hidden sm:table-cell">{g.phone || ""}</TableCell>
                <TableCell className="text-xs py-1">
                  {g.side === "trai" ? "Trai" : "Gái"}
                </TableCell>
                <TableCell className="text-xs py-1">{g.tableGroup || ""}</TableCell>
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
