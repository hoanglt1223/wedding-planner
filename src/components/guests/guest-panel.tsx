import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  downloadSampleCsv,
  exportGuestsCsv,
  parseCsvToGuests,
  readFileAsText,
} from "@/lib/csv";
import type { Guest, RsvpSettings } from "@/types/wedding";
import { GuestTable } from "./guest-table";
import { SeatingChart } from "./seating-chart";
import { RsvpDashboard } from "./rsvp-dashboard";
import { t } from "@/lib/i18n";

interface GuestPanelProps {
  guests: Guest[];
  onAddGuest: (guest: Omit<Guest, "id">) => void;
  onRemoveGuest: (id: number) => void;
  onClearGuests: () => void;
  onImportGuests: (guests: Omit<Guest, "id">[]) => void;
  lang?: string;
  userId?: string;
  rsvpSettings?: RsvpSettings;
  onSetRsvpSettings?: (partial: Partial<RsvpSettings>) => void;
  onUpdateGuestRsvpToken?: (guestId: number, token: string) => void;
  themeId?: string;
}

export function GuestPanel({
  guests,
  onAddGuest,
  onRemoveGuest,
  onClearGuests,
  onImportGuests,
  lang = "vi",
  userId,
  rsvpSettings,
  onSetRsvpSettings,
  onUpdateGuestRsvpToken,
  themeId,
}: GuestPanelProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [side, setSide] = useState<"trai" | "gai">("trai");
  const [group, setGroup] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "chart" | "rsvp">("list");
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
    if (window.confirm(t("Xóa tất cả?", lang))) onClearGuests();
  };

  const filteredGuests = search
    ? guests.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    : guests;

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4">
      <div className="pb-2">
        <h2 className="text-base font-semibold">{t("👥 Khách Mời", lang)} ({guests.length})</h2>
      </div>
      <div className="space-y-2">
        {guests.length > 0 && (
          <div className="text-sm bg-blue-50 text-blue-800 rounded px-3 py-1">
            {t("Trai:", lang)} <b>{traiCount}</b> | {t("Gái:", lang)} <b>{gaiCount}</b> | {lang === "en" ? "Tables" : "Bàn"} ≈ <b>{tableCount}</b>
          </div>
        )}

        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[2fr_1fr_auto_1fr_auto]">
          <Input
            className="h-8 text-sm"
            placeholder={t("Họ tên", lang)}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Input
            className="h-8 text-sm"
            placeholder={t("SĐT", lang)}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <select
            className="h-8 text-sm border border-gray-300 rounded px-1"
            value={side}
            onChange={(e) => setSide(e.target.value as "trai" | "gai")}
          >
            <option value="trai">{lang === "en" ? "Groom" : "Trai"}</option>
            <option value="gai">{lang === "en" ? "Bride" : "Gái"}</option>
          </select>
          <Input
            className="h-8 text-sm"
            placeholder={t("Nhóm/Bàn", lang)}
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
          <Button size="sm" className="h-8 px-3" onClick={handleAdd}>+ {t("Thêm", lang)}</Button>
        </div>

        <div className="flex gap-1 flex-wrap">
          <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={downloadSampleCsv}>
            {lang === "en" ? "📥 Sample CSV" : "📥 CSV mẫu"}
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
                {lang === "en" ? "🗑️ Delete all" : "🗑️ Xóa tất cả"}
              </Button>
            </>
          )}
        </div>

        {(guests.length > 0 || view === "rsvp") && (
          <div className="flex gap-1 border-b border-gray-100 pb-1">
            <button
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                view === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setView("list")}
            >
              {t("📋 Danh sách", lang)}
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                view === "chart"
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setView("chart")}
            >
              {t("🪑 Sơ đồ bàn", lang)}
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                view === "rsvp"
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setView("rsvp")}
            >
              {t("📬 RSVP", lang)}
            </button>
          </div>
        )}

        {guests.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-base font-semibold mb-1">{lang === "en" ? "Add your first guest" : "Thêm khách mời đầu tiên"}</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {lang === "en" ? "Enter guest names above to start your guest list" : "Nhập tên khách ở form bên trên để bắt đầu danh sách mời"}
            </p>
          </div>
        )}

        {guests.length > 0 && view === "list" && (
          <>
            <Input
              className="h-8 text-sm"
              placeholder={t("🔍 Tìm kiếm...", lang)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <GuestTable guests={filteredGuests} onDelete={onRemoveGuest} lang={lang} />
          </>
        )}
        {guests.length > 0 && view === "chart" && (
          <SeatingChart guests={guests} lang={lang} />
        )}
        {view === "rsvp" && userId && rsvpSettings && onSetRsvpSettings && onUpdateGuestRsvpToken && (
          <RsvpDashboard
            guests={guests}
            userId={userId}
            rsvpSettings={rsvpSettings}
            onSetRsvpSettings={onSetRsvpSettings}
            onUpdateGuestRsvpToken={onUpdateGuestRsvpToken}
            themeId={themeId || "red"}
            lang={lang}
          />
        )}
      </div>
    </div>
  );
}
