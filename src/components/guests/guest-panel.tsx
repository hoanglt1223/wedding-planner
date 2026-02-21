import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  downloadSampleCsv,
  exportGuestsCsv,
  parseCsvToGuests,
  readFileAsText,
} from "@/lib/csv";
import type { Guest } from "@/types/wedding";
import { GuestTable } from "./guest-table";
import { SeatingChart } from "./seating-chart";

interface GuestPanelProps {
  guests: Guest[];
  onAddGuest: (guest: Omit<Guest, "id">) => void;
  onRemoveGuest: (id: number) => void;
  onClearGuests: () => void;
  onImportGuests: (guests: Omit<Guest, "id">[]) => void;
}

export function GuestPanel({
  guests,
  onAddGuest,
  onRemoveGuest,
  onClearGuests,
  onImportGuests,
}: GuestPanelProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [side, setSide] = useState<"trai" | "gai">("trai");
  const [group, setGroup] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "chart">("list");
  const fileRef = useRef<HTMLInputElement>(null);

  const traiCount = guests.filter((g) => g.side === "trai").length;
  const gaiCount = guests.filter((g) => g.side === "gai").length;
  const tableCount = Math.ceil(guests.length / 10);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAddGuest({ name: name.trim(), phone: phone.trim(), side: side, tableGroup: group.trim() });
    setName("");
    setPhone("");
    setSide("trai");
    setGroup("");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await readFileAsText(file);
    const newGuests = parseCsvToGuests(text);
    onImportGuests(newGuests);
    e.target.value = "";
  };

  const handleClear = () => {
    if (window.confirm("Xóa tất cả?")) onClearGuests();
  };

  const filteredGuests = search
    ? guests.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    : guests;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">👥 Khách Mời ({guests.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {guests.length > 0 && (
          <div className="text-sm bg-blue-50 text-blue-800 rounded px-3 py-1">
            Trai: <b>{traiCount}</b> | Gái: <b>{gaiCount}</b> | Bàn ≈ <b>{tableCount}</b>
          </div>
        )}

        <div className="grid grid-cols-2 gap-1 sm:grid-cols-[2fr_1fr_auto_1fr_auto]">
          <Input
            className="col-span-2 sm:col-span-1 h-8 text-sm"
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Input
            className="h-8 text-sm"
            placeholder="SĐT"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <select
            className="h-8 text-sm border border-gray-300 rounded px-1"
            value={side}
            onChange={(e) => setSide(e.target.value as "trai" | "gai")}
          >
            <option value="trai">Trai</option>
            <option value="gai">Gái</option>
          </select>
          <Input
            className="h-8 text-sm"
            placeholder="Nhóm/Bàn"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
          <Button size="sm" className="h-8 px-3 col-span-2 sm:col-span-1" onClick={handleAdd}>+ Thêm</Button>
        </div>

        <div className="flex gap-1 flex-wrap">
          <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={downloadSampleCsv}>
            📥 CSV mẫu
          </Button>
          <label className="cursor-pointer">
            <span className="inline-flex items-center h-7 px-3 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 border border-green-300">
              📤 Import
            </span>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImport}
            />
          </label>
          {guests.length > 0 && (
            <>
              <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => exportGuestsCsv(guests)}>
                📤 Export
              </Button>
              <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={handleClear}>
                🗑️ Xóa tất cả
              </Button>
            </>
          )}
        </div>

        {guests.length > 0 && (
          <div className="flex gap-1 border-b border-gray-100 pb-1">
            <button
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                view === "list"
                  ? "bg-red-700 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setView("list")}
            >
              📋 Danh sách
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                view === "chart"
                  ? "bg-red-700 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setView("chart")}
            >
              🪑 Sơ đồ bàn
            </button>
          </div>
        )}

        {guests.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-base font-semibold mb-1">Thêm khách mời đầu tiên</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Nhập tên khách ở form bên trên để bắt đầu danh sách mời
            </p>
          </div>
        )}

        {guests.length > 0 && view === "list" && (
          <>
            <Input
              className="h-8 text-sm"
              placeholder="🔍 Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <GuestTable guests={filteredGuests} onDelete={onRemoveGuest} />
          </>
        )}
        {guests.length > 0 && view === "chart" && (
          <SeatingChart guests={guests} />
        )}
      </CardContent>
    </Card>
  );
}
