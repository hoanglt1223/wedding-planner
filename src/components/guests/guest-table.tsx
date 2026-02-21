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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 text-xs">#</TableHead>
            <TableHead className="text-xs">Tên</TableHead>
            <TableHead className="text-xs">SĐT</TableHead>
            <TableHead className="text-xs">Bên</TableHead>
            <TableHead className="text-xs">Nhóm</TableHead>
            <TableHead className="w-6 text-xs text-center">✕</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((g, i) => (
            <TableRow key={g.id}>
              <TableCell className="text-xs py-1">{i + 1}</TableCell>
              <TableCell className="text-xs py-1">{g.n}</TableCell>
              <TableCell className="text-xs py-1">{g.p || ""}</TableCell>
              <TableCell className="text-xs py-1">
                {g.s === "trai" ? "Trai" : "Gái"}
              </TableCell>
              <TableCell className="text-xs py-1">{g.g || ""}</TableCell>
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
    </ScrollArea>
  );
}
