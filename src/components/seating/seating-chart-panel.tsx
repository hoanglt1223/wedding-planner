import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Guest, SeatingTable } from "@/types/wedding";
import { t } from "@/lib/i18n";
import { TableCardGenerator } from "./table-card-generator";
import { SmartSeatingModal } from "./smart-seating-modal";
import type { AppTheme } from "@/data/themes";

const TABLE_COLORS = [
  "#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6",
  "#1abc9c", "#e67e22", "#34495e", "#e91e63", "#00bcd4",
  "#8bc34a", "#ff5722",
];

function getTableColor(index: number): string {
  return TABLE_COLORS[index % TABLE_COLORS.length];
}

interface SeatingChartPanelProps {
  tables: SeatingTable[];
  guests: Guest[];
  onAddTable: (table: Omit<SeatingTable, "id" | "guestIds">) => void;
  onUpdateTable: (id: number, updates: Partial<Omit<SeatingTable, "id">>) => void;
  onRemoveTable: (id: number) => void;
  onAssignGuest: (guestId: number, tableId: number) => void;
  onUnassignGuest: (guestId: number) => void;
  lang?: string;
  theme?: AppTheme;
}

export function SeatingChartPanel({
  tables,
  guests,
  onAddTable,
  onUpdateTable,
  onRemoveTable,
  onAssignGuest,
  onUnassignGuest,
  lang = "vi",
  theme,
}: SeatingChartPanelProps) {
  const en = lang === "en";
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [searchGuest, setSearchGuest] = useState("");
  const [showSmartSeating, setShowSmartSeating] = useState(false);

  // Add form state
  const [newName, setNewName] = useState("");
  const [newCapacity, setNewCapacity] = useState("10");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState("10");

  // Assigned guest IDs
  const assignedGuestIds = useMemo(() => {
    const set = new Set<number>();
    tables.forEach((t) => t.guestIds.forEach((id) => set.add(id)));
    return set;
  }, [tables]);

  // Unassigned guests
  const unassignedGuests = useMemo(
    () => guests.filter((g) => !assignedGuestIds.has(g.id)),
    [guests, assignedGuestIds]
  );

  // Filtered unassigned guests by search
  const filteredUnassigned = useMemo(() => {
    if (!searchGuest.trim()) return unassignedGuests;
    const q = searchGuest.toLowerCase();
    return unassignedGuests.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.side.toLowerCase().includes(q) ||
        g.tableGroup.toLowerCase().includes(q)
    );
  }, [unassignedGuests, searchGuest]);

  // Guest lookup map
  const guestMap = useMemo(() => {
    const map = new Map<number, Guest>();
    guests.forEach((g) => map.set(g.id, g));
    return map;
  }, [guests]);

  function handleAdd() {
    if (!newName.trim()) return;
    onAddTable({
      name: newName.trim(),
      capacity: parseInt(newCapacity, 10) || 10,
    });
    setNewName("");
    setNewCapacity("10");
    setShowAddForm(false);
  }

  function startEdit(table: SeatingTable) {
    setEditingId(table.id);
    setEditName(table.name);
    setEditCapacity(String(table.capacity));
  }

  function handleSaveEdit(id: number) {
    if (!editName.trim()) return;
    onUpdateTable(id, {
      name: editName.trim(),
      capacity: parseInt(editCapacity, 10) || 10,
    });
    setEditingId(null);
  }

  function handleAssignGuest(guestId: number) {
    if (selectedTableId === null) return;
    onAssignGuest(guestId, selectedTableId);
  }

  // Smart seating assignment algorithm
  const handleSmartAssign = useCallback(() => {
    // Clear all existing assignments first
    tables.forEach((table) => {
      table.guestIds.forEach((guestId) => {
        onUnassignGuest(guestId);
      });
    });

    // Get unassigned guests
    const unassignedGuests = guests.filter((g) =>
      !tables.some((t) => t.guestIds.includes(g.id))
    );

    // Group guests by their group field (family/friends categories)
    const groupedGuests = new Map<string, Guest[]>();
    unassignedGuests.forEach((guest) => {
      const group = guest.group || "other";
      if (!groupedGuests.has(group)) {
        groupedGuests.set(group, []);
      }
      groupedGuests.get(group)!.push(guest);
    });

    // Sort groups by size (largest first) to optimize table usage
    const sortedGroups = Array.from(groupedGuests.entries()).sort(
      ([, a], [, b]) => b.length - a.length
    );

    // Assign groups to tables, keeping similar groups together
    let currentTableIndex = 0;
    sortedGroups.forEach(([group, groupGuests]) => {
      let guestIndex = 0;

      while (guestIndex < groupGuests.length && currentTableIndex < tables.length) {
        const table = tables[currentTableIndex];
        const availableSeats = table.capacity - table.guestIds.length;

        if (availableSeats > 0) {
          // Assign as many guests from this group as possible
          const toAssign = Math.min(availableSeats, groupGuests.length - guestIndex);
          for (let i = 0; i < toAssign; i++) {
            onAssignGuest(groupGuests[guestIndex + i].id, table.id);
          }
          guestIndex += toAssign;
        }

        // Move to next table if current one is full
        if (table.guestIds.length >= table.capacity) {
          currentTableIndex++;
        }
      }
    });

    setShowSmartSeating(false);
  }, [guests, tables, onAssignGuest, onUnassignGuest]);

  // Stats
  const totalSeats = tables.reduce((s, t) => s + t.capacity, 0);
  const totalAssigned = assignedGuestIds.size;
  const totalGuests = guests.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-base">{t("🪑 Sơ Đồ Chỗ Ngồi", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {en
              ? `${tables.length} tables · ${totalAssigned}/${totalGuests} guests assigned`
              : `${tables.length} bàn · ${totalAssigned}/${totalGuests} khách đã xếp`}
          </p>
        </div>
        <div className="flex gap-2">
          {tables.length > 0 && unassignedGuests.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3"
              onClick={() => setShowSmartSeating(true)}
            >
              🤖 {t("Xếp thông minh", lang)}
            </Button>
          )}
          <Button
            size="sm"
            className="h-8 px-3"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setNewName("");
              setNewCapacity("10");
            }}
          >
            + {t("Thêm bàn", lang)}
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      {tables.length > 0 && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-sm font-bold" style={{ color: "var(--theme-primary)" }}>
              {tables.length}
            </p>
            <p className="text-xs text-muted-foreground">{t("Bàn", lang)}</p>
          </div>
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-sm font-bold text-amber-600">{totalSeats}</p>
            <p className="text-xs text-muted-foreground">{t("Chỗ ngồi", lang)}</p>
          </div>
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-sm font-bold text-emerald-600">
              {totalAssigned}/{totalGuests}
            </p>
            <p className="text-xs text-muted-foreground">{t("Đã xếp", lang)}</p>
          </div>
        </div>
      )}

      {/* Table card generator */}
      {theme && (
        <TableCardGenerator
          tables={tables}
          guests={guests}
          lang={(lang === "en" ? "en" : "vi") as "vi" | "en"}
          themeColors={{
            primary: theme.primary,
            accent: theme.accent,
            surface: theme.surface,
            themeBorder: theme.themeBorder,
          }}
        />
      )}

      {/* Add table form */}
      {showAddForm && (
        <div className="rounded-lg bg-[var(--theme-surface-muted)] border border-[var(--theme-border)] p-3 space-y-2">
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input
              className="flex-[2] h-8 text-sm"
              placeholder={t("Tên bàn", lang) + " *"}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={en ? "Capacity" : "Sức chứa"}
              type="text"
              inputMode="numeric"
              value={newCapacity}
              onChange={(e) => setNewCapacity(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground"
            >
              {t("Hủy", lang)}
            </button>
            <Button size="sm" className="h-8 px-3" onClick={handleAdd}>
              {t("Thêm bàn", lang)}
            </Button>
          </div>
        </div>
      )}

      {/* Tables grid */}
      {tables.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tables.map((table, idx) => {
            const isEditing = editingId === table.id;
            const isSelected = selectedTableId === table.id;
            const tableGuests = table.guestIds
              .map((id) => guestMap.get(id))
              .filter(Boolean) as Guest[];
            const isFull = table.guestIds.length >= table.capacity;
            const color = getTableColor(idx);

            if (isEditing) {
              return (
                <div
                  key={table.id}
                  className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 space-y-2"
                >
                  <Input
                    className="h-8 text-sm"
                    placeholder={t("Tên bàn", lang)}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <Input
                    className="h-8 text-sm"
                    placeholder={en ? "Capacity" : "Sức chứa"}
                    type="text"
                    inputMode="numeric"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value.replace(/\D/g, ""))}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground"
                    >
                      {t("Hủy", lang)}
                    </button>
                    <Button size="sm" className="h-8 px-3" onClick={() => handleSaveEdit(table.id)}>
                      {t("Lưu", lang)}
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={table.id}
                className={`rounded-xl border-2 bg-[var(--theme-surface)] p-3 space-y-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-[var(--theme-primary)] shadow-md"
                    : "border-[var(--theme-border)] hover:border-[var(--theme-primary)]/50"
                }`}
                onClick={() => setSelectedTableId(isSelected ? null : table.id)}
              >
                {/* Table header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: color }}
                    >
                      {table.guestIds.length}/{table.capacity}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{table.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {isFull
                          ? en ? "Full" : "Đầy"
                          : en
                            ? `${table.capacity - table.guestIds.length} seats left`
                            : `Còn ${table.capacity - table.guestIds.length} chỗ`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => startEdit(table)}
                      className="text-xs text-muted-foreground hover:text-foreground p-1"
                      title={t("Sửa", lang)}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            en
                              ? `Delete "${table.name}"? Guests will be unassigned.`
                              : `Xóa "${table.name}"? Khách sẽ bị bỏ xếp.`
                          )
                        ) {
                          onRemoveTable(table.id);
                          if (selectedTableId === table.id) setSelectedTableId(null);
                        }
                      }}
                      className="text-xs text-red-400 hover:text-red-600 p-1"
                      title="✕"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Assigned guests */}
                {tableGuests.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {tableGuests.map((g) => (
                      <span
                        key={g.id}
                        className="inline-flex items-center gap-1 text-xs bg-[var(--theme-surface-muted)] rounded-full px-2 py-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="truncate max-w-[100px]">{g.name}</span>
                        <button
                          onClick={() => onUnassignGuest(g.id)}
                          className="text-muted-foreground hover:text-red-500 shrink-0"
                          title={en ? "Remove from table" : "Bỏ khỏi bàn"}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    {en ? "No guests assigned yet" : "Chưa có khách nào"}
                  </p>
                )}

                {/* Capacity bar */}
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (table.guestIds.length / table.capacity) * 100)}%`,
                      backgroundColor: isFull ? "#ef4444" : color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center py-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
            <span className="text-3xl">🪑</span>
          </div>
          <h3 className="text-base font-semibold mb-1">{t("Tạo bàn đầu tiên", lang)}</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {en
              ? "Add tables and assign guests to organize your reception seating."
              : "Thêm bàn và xếp khách để sắp xếp chỗ ngồi tiệc cưới."}
          </p>
        </div>
      )}

      {/* Unassigned guests section */}
      {tables.length > 0 && unassignedGuests.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {t("👥 Chưa xếp chỗ", lang)} ({unassignedGuests.length})
            </h3>
            {selectedTableId !== null && (
              <span className="text-xs text-[var(--theme-primary)]">
                {en ? "Click guest to assign →" : "Chọn khách để xếp →"}
              </span>
            )}
          </div>

          {/* Search */}
          <Input
            type="search"
            value={searchGuest}
            onChange={(e) => setSearchGuest(e.target.value)}
            placeholder={t("🔍 Tìm khách...", lang)}
            className="h-8 text-sm"
          />

          {/* Target table indicator */}
          {selectedTableId !== null && (
            <div className="flex items-center gap-2 text-xs bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] rounded-lg px-3 py-1.5">
              <span>🎯</span>
              <span>
                {en ? "Assigning to:" : "Xếp vào bàn:"}{" "}
                <strong>{tables.find((t) => t.id === selectedTableId)?.name}</strong>
              </span>
              <button
                onClick={() => setSelectedTableId(null)}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
          )}

          {/* Guest list */}
          <div className="flex flex-wrap gap-1.5">
            {filteredUnassigned.map((g) => (
              <button
                key={g.id}
                onClick={() => handleAssignGuest(g.id)}
                disabled={selectedTableId === null}
                className={`inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1 border transition-colors ${
                  selectedTableId !== null
                    ? "border-[var(--theme-primary)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-white cursor-pointer"
                    : "border-[var(--theme-border)] text-muted-foreground cursor-default"
                }`}
              >
                <span className="truncate max-w-[120px]">{g.name}</span>
                {g.side && (
                  <span className="text-[10px] opacity-60">
                    {g.side === "bride" ? "♀" : g.side === "groom" ? "♂" : ""}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All guests assigned */}
      {tables.length > 0 && unassignedGuests.length === 0 && guests.length > 0 && (
        <div className="flex items-center gap-2 justify-center py-4 text-sm text-emerald-600">
          <span>✅</span>
          <span>{en ? "All guests have been assigned seats!" : "Tất cả khách đã được xếp chỗ!"}</span>
        </div>
      )}

      {/* Smart seating modal */}
      <SmartSeatingModal
        isOpen={showSmartSeating}
        onClose={() => setShowSmartSeating(false)}
        onConfirm={handleSmartAssign}
        tables={tables}
        guests={guests}
        lang={lang}
      />
    </div>
  );
}
