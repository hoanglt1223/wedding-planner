import { useState, useMemo } from "react";
import { Users, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Guest } from "@/types/wedding";

interface TableAssignmentPanelProps {
  guests: Guest[];
  onUpdateGuest: (id: number, updates: Partial<Guest>) => void;
  lang?: string;
}

interface TableInfo {
  name: string;
  guests: Guest[];
}

export function TableAssignmentPanel({
  guests,
  onUpdateGuest,
  lang = "vi",
}: TableAssignmentPanelProps) {
  const [newTableName, setNewTableName] = useState("");
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const en = lang === "en";

  // Build tables from guest tableGroup values
  const tables = useMemo(() => {
    const map = new Map<string, Guest[]>();
    guests.forEach((g) => {
      const group = g.tableGroup || "";
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(g);
    });
    return Array.from(map.entries())
      .map(([name, g]) => ({ name, guests: g }))
      .sort((a, b) => {
        // Sort: unassigned ("") first, then alphabetically
        if (!a.name) return -1;
        if (!b.name) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [guests]);

  const unassigned = tables.find((t) => t.name === "")?.guests ?? [];
  const namedTables = tables.filter((t) => t.name !== "");
  const searchLower = search.toLowerCase();

  const filteredUnassigned = search
    ? unassigned.filter((g) => g.name.toLowerCase().includes(searchLower))
    : unassigned;

  const handleCreateTable = () => {
    const name = newTableName.trim();
    if (!name) return;
    if (tables.some((t) => t.name === name)) {
      alert(en ? "Table name already exists" : "Tên bàn đã tồn tại");
      return;
    }
    setNewTableName("");
  };

  const handleAssign = (guestId: number, tableName: string) => {
    onUpdateGuest(guestId, { tableGroup: tableName });
  };

  const handleUnassign = (guestId: number) => {
    onUpdateGuest(guestId, { tableGroup: "" });
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="font-semibold text-base">
            {t("🪑 Phân Bàn", lang)}
          </h2>
          <p className="text-xs text-muted-foreground">
            {en ? "Assign guests to tables" : "Phân loại khách theo bàn"}
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          {en
            ? `${unassigned.length} unassigned / ${guests.length} total`
            : `${unassigned.length} chưa xếp / ${guests.length} tổng`}
        </div>
      </div>

      {/* Create new table */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateTable()}
          placeholder={en ? "New table name (e.g. Table 1, Family...)" : "Tên bàn mới (VD: Bàn 1, Gia đình...)..."}
          className="flex-1 border rounded-lg px-3 py-2 text-sm bg-background"
        />
        <button
          onClick={handleCreateTable}
          disabled={!newTableName.trim()}
          className="flex items-center gap-1 px-3 py-2 bg-[var(--theme-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          {t("Thêm", lang)}
        </button>
      </div>

      {/* Tables grid */}
      {namedTables.length === 0 && unassigned.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          {en
            ? "Add guests first, then create tables to organize them."
            : "Thêm khách mời trước, sau đó tạo bàn để sắp xếp."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {namedTables.map((table) => {
            const isExpanded = expandedTable === table.name;
            return (
              <TableCard
                key={table.name}
                table={table}
                isExpanded={isExpanded}
                onToggle={() =>
                  setExpandedTable(isExpanded ? null : table.name)
                }
                onUnassign={handleUnassign}
                lang={lang}
              />
            );
          })}
        </div>
      )}

      {/* Unassigned guests */}
      {unassigned.length > 0 && (
        <div className="mt-3">
          <h3 className="text-sm font-semibold mb-2 text-amber-700">
            {en
              ? `Unassigned guests (${filteredUnassigned.length})`
              : `Khách chưa xếp bàn (${filteredUnassigned.length})`}
          </h3>

          {/* Search unassigned */}
          {unassigned.length > 5 && (
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={en ? "🔍 Search unassigned..." : "🔍 Tìm kiếm..."}
              className="w-full border rounded px-3 py-1.5 text-sm mb-2 bg-background"
            />
          )}

          <div className="space-y-1 max-h-60 overflow-y-auto">
            {filteredUnassigned.map((guest) => (
              <UnassignedGuestRow
                key={guest.id}
                guest={guest}
                tables={namedTables.map((t) => t.name)}
                onAssign={handleAssign}
                lang={lang}
              />
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {namedTables.length > 0 && (
        <div className="mt-2 p-2.5 bg-[var(--theme-surface-muted)] rounded-lg text-center text-xs sm:text-sm">
          {en
            ? `${namedTables.length} tables · ${guests.length - unassigned.length} seated · ${unassigned.length} unassigned`
            : `${namedTables.length} bàn · ${guests.length - unassigned.length} đã xếp · ${unassigned.length} chưa xếp`}
        </div>
      )}
    </div>
  );
}

/** Visual card for a single table */
function TableCard({
  table,
  isExpanded,
  onToggle,
  onUnassign,
  lang,
}: {
  table: TableInfo;
  isExpanded: boolean;
  onToggle: () => void;
  onUnassign: (guestId: number) => void;
  lang: string;
}) {
  const en = lang === "en";
  return (
    <div
      className="border rounded-xl p-3 transition-colors"
      style={{
        borderColor: "var(--theme-border)",
        backgroundColor: "var(--theme-surface)",
      }}
    >
      {/* Table header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[var(--theme-primary)]" />
          <span className="font-semibold text-sm">{table.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--theme-primary-light)] text-[var(--theme-primary)] font-medium">
            {table.guests.length}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded: guest list */}
      {isExpanded && (
        <div className="mt-2 space-y-1 border-t pt-2" style={{ borderColor: "var(--theme-border)" }}>
          {table.guests.map((guest) => (
            <div
              key={guest.id}
              className="flex items-center justify-between text-xs py-1 px-1 rounded hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-muted-foreground">
                  {guest.side === "groom" ? "💍" : guest.side === "bride" ? "💐" : "👥"}
                </span>
                <span className="truncate">{guest.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUnassign(guest.id);
                }}
                className="shrink-0 text-muted-foreground hover:text-red-500 transition-colors p-0.5"
                title={en ? "Unassign" : "Bỏ xếp"}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {table.guests.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-1">
              {en ? "Empty table" : "Bàn trống"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** Unassigned guest row with table assignment dropdown */
function UnassignedGuestRow({
  guest,
  tables,
  onAssign,
  lang,
}: {
  guest: Guest;
  tables: string[];
  onAssign: (guestId: number, tableName: string) => void;
  lang: string;
}) {
  const en = lang === "en";
  return (
    <div
      key={guest.id}
      className="flex items-center gap-2 p-1.5 rounded-lg text-sm hover:bg-muted transition-colors"
      style={{ backgroundColor: "var(--theme-surface)" }}
    >
      <span className="truncate flex-1 text-xs">{guest.name}</span>
      {tables.length > 0 && (
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) onAssign(guest.id, e.target.value);
          }}
          className="text-xs border rounded px-1.5 py-1 bg-background shrink-0"
          aria-label={en ? "Assign to table" : "Xếp vào bàn"}
        >
          <option value="">
            {en ? "→ Assign" : "→ Xếp bàn"}
          </option>
          {tables.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
