import { useState } from "react";
import { t } from "@/lib/i18n";
import type { SeatingTable, WeddingState } from "@/types/wedding";
import type { WeddingStore } from "@/hooks/use-wedding-store";

interface SeatingChartPanelProps {
  state: WeddingState;
  store: WeddingStore;
}

export function SeatingChartPanel({ state, store }: SeatingChartPanelProps) {
  const lang = state.lang;
  const en = lang === "en";
  const tables = state.seatingTables ?? [];
  const guests = state.guests ?? [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [tableName, setTableName] = useState("");
  const [tableCapacity, setTableCapacity] = useState(8);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState(8);
  const [assigningTableId, setAssigningTableId] = useState<number | null>(null);

  // All guest IDs assigned to any table
  const assignedIds = new Set(tables.flatMap((t) => t.guestIds));
  const unassigned = guests.filter((g) => !assignedIds.has(g.id));

  function handleAddTable() {
    if (!tableName.trim()) return;
    store.addSeatingTable({ name: tableName.trim(), capacity: tableCapacity });
    setTableName("");
    setTableCapacity(8);
    setShowAddForm(false);
  }

  function handleStartEdit(table: SeatingTable) {
    setEditingId(table.id);
    setEditName(table.name);
    setEditCapacity(table.capacity);
  }

  function handleSaveEdit(id: number) {
    if (!editName.trim()) return;
    store.updateSeatingTable(id, { name: editName.trim(), capacity: editCapacity });
    setEditingId(null);
  }

  function handleDeleteTable(id: number) {
    const msg = en ? "Delete this table? Guests will be unassigned." : "Xóa bàn này? Khách sẽ được bỏ phân bổ.";
    if (window.confirm(msg)) {
      store.removeSeatingTable(id);
    }
  }

  function handleAssignGuest(guestId: number) {
    if (assigningTableId === null) return;
    const table = tables.find((t) => t.id === assigningTableId);
    if (!table) return;
    if (table.guestIds.length >= table.capacity) {
      alert(en ? "Table is full!" : "Bàn đã đầy!");
      return;
    }
    store.assignGuestToTable(guestId, assigningTableId);
    setAssigningTableId(null);
  }

  function handleUnassignGuest(guestId: number) {
    store.unassignGuest(guestId);
  }

  function getGuestName(id: number): string {
    return guests.find((g) => g.id === id)?.name ?? `#${id}`;
  }

  function getGuestInitials(name: string): string {
    return name
      .split(" ")
      .slice(-2)
      .map((w) => w.charAt(0).toUpperCase())
      .join("");
  }

  // Stats
  const totalSeated = tables.reduce((sum, t) => sum + t.guestIds.length, 0);
  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);

  return (
    <div className="space-y-4">
      {/* Header + stats */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-base">{t("🪑 Sơ Đồ Chỗ Ngồi", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {en
              ? `${tables.length} tables · ${totalSeated}/${guests.length} seated`
              : `${tables.length} bàn · ${totalSeated}/${guests.length} khách đã xếp`}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
        >
          + {t("Thêm bàn", lang)}
        </button>
      </div>

      {/* Add table form */}
      {showAddForm && (
        <div className="rounded-lg bg-[var(--theme-surface-muted)] border border-[var(--theme-border)] p-3 space-y-2">
          <div className="flex gap-2">
            <input
              className="flex-1 h-8 text-sm border border-gray-300 rounded px-2 bg-background"
              placeholder={en ? "Table name (e.g. Table 1)" : "Tên bàn (VD: Bàn 1)"}
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTable()}
            />
            <input
              type="number"
              min={1}
              max={20}
              className="w-20 h-8 text-sm border border-gray-300 rounded px-2 bg-background"
              value={tableCapacity}
              onChange={(e) => setTableCapacity(Math.max(1, Math.min(20, Number(e.target.value))))}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAddForm(false)} className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground">
              {t("Hủy", lang)}
            </button>
            <button onClick={handleAddTable} className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90">
              {t("Tạo bàn", lang)}
            </button>
          </div>
        </div>
      )}

      {/* Assign guest picker (shown when assigning) */}
      {assigningTableId !== null && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 space-y-2">
          <p className="text-sm font-medium text-blue-800">
            {en ? "Select a guest to seat:" : "Chọn khách để xếp chỗ:"}
          </p>
          {unassigned.length === 0 ? (
            <p className="text-xs text-blue-600">{en ? "All guests are seated!" : "Tất cả khách đã được xếp chỗ!"}</p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-1">
              {unassigned.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleAssignGuest(g.id)}
                  className="w-full text-left text-sm px-3 py-1.5 rounded hover:bg-blue-100 transition-colors flex items-center gap-2"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {getGuestInitials(g.name)}
                  </span>
                  <span className="truncate">{g.name}</span>
                  {g.side && (
                    <span className="text-xs text-blue-500 ml-auto shrink-0">
                      {g.side === "groom" ? (en ? "Groom" : "Nhà trai") : g.side === "bride" ? (en ? "Bride" : "Nhà gái") : g.side}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setAssigningTableId(null)} className="text-xs text-blue-600 hover:underline">
            {t("Hủy", lang)}
          </button>
        </div>
      )}

      {/* Tables grid */}
      {tables.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tables.map((table) => {
            const isEditing = editingId === table.id;
            const isFull = table.guestIds.length >= table.capacity;
            const pct = table.capacity > 0 ? Math.round((table.guestIds.length / table.capacity) * 100) : 0;

            return (
              <div
                key={table.id}
                className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 space-y-2"
              >
                {/* Table header */}
                <div className="flex items-center justify-between">
                  {isEditing ? (
                    <div className="flex gap-1.5 flex-1">
                      <input
                        className="flex-1 h-7 text-sm border border-gray-300 rounded px-2 bg-background"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(table.id)}
                      />
                      <input
                        type="number"
                        min={1}
                        max={20}
                        className="w-16 h-7 text-sm border border-gray-300 rounded px-2 bg-background"
                        value={editCapacity}
                        onChange={(e) => setEditCapacity(Math.max(1, Math.min(20, Number(e.target.value))))}
                      />
                      <button onClick={() => handleSaveEdit(table.id)} className="text-xs px-2 bg-green-500 text-white rounded hover:opacity-80">✓</button>
                      <button onClick={() => setEditingId(null)} className="text-xs px-2 text-muted-foreground hover:text-foreground">✕</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🪑</span>
                        <div>
                          <h3 className="font-semibold text-sm">{table.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {table.guestIds.length}/{table.capacity} {en ? "seated" : "khách"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleStartEdit(table)} className="text-xs text-muted-foreground hover:text-foreground p-1">✏️</button>
                        <button onClick={() => handleDeleteTable(table.id)} className="text-xs text-red-400 hover:text-red-600 p-1">✕</button>
                      </div>
                    </>
                  )}
                </div>

                {/* Capacity bar */}
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: isFull ? "#22c55e" : "var(--theme-primary)",
                    }}
                  />
                </div>

                {/* Seated guests */}
                {table.guestIds.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {table.guestIds.map((gid) => {
                      const name = getGuestName(gid);
                      return (
                        <span
                          key={gid}
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface-muted)] group"
                        >
                          <span className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0"
                            style={{ backgroundColor: "var(--theme-primary-light)", color: "var(--theme-primary)" }}
                          >
                            {getGuestInitials(name)}
                          </span>
                          <span className="truncate max-w-[100px]">{name}</span>
                          <button
                            onClick={() => handleUnassignGuest(gid)}
                            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
                            title={en ? "Remove from table" : "Bỏ khỏi bàn"}
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    {en ? "No guests assigned" : "Chưa có khách"}
                  </p>
                )}

                {/* Assign button */}
                {!isFull && (
                  <button
                    onClick={() => setAssigningTableId(table.id)}
                    className="w-full text-xs py-1.5 rounded border border-dashed border-[var(--theme-border)] text-muted-foreground hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] transition-colors"
                  >
                    + {en ? "Add guest" : "Thêm khách"}
                  </button>
                )}
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
          <h3 className="text-base font-semibold mb-1">
            {en ? "Create your first table" : "Tạo bàn đầu tiên"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {en
              ? "Set up tables and assign guests for your reception seating arrangement."
              : "Tạo bàn và xếp khách cho sơ đồ chỗ ngồi tiệc cưới."}
          </p>
        </div>
      )}

      {/* Unassigned guests summary */}
      {tables.length > 0 && unassigned.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm font-medium text-amber-800 mb-1">
            ⚠️ {en ? `${unassigned.length} guests not seated` : `${unassigned.length} khách chưa xếp chỗ`}
          </p>
          <div className="flex flex-wrap gap-1">
            {unassigned.slice(0, 10).map((g) => (
              <span key={g.id} className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                {g.name}
              </span>
            ))}
            {unassigned.length > 10 && (
              <span className="text-xs text-amber-600">+{unassigned.length - 10}</span>
            )}
          </div>
        </div>
      )}

      {/* Stats footer */}
      {tables.length > 0 && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-lg font-bold" style={{ color: "var(--theme-primary)" }}>{tables.length}</p>
            <p className="text-xs text-muted-foreground">{en ? "Tables" : "Bàn"}</p>
          </div>
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-lg font-bold" style={{ color: "var(--theme-primary)" }}>{totalSeated}</p>
            <p className="text-xs text-muted-foreground">{en ? "Seated" : "Đã xếp"}</p>
          </div>
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-lg font-bold" style={{ color: "var(--theme-primary)" }}>{totalCapacity - totalSeated}</p>
            <p className="text-xs text-muted-foreground">{en ? "Empty seats" : "Chỗ trống"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
