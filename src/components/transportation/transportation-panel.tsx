import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Guest, TransportationGroup, TransportType } from "@/types/wedding";
import { t } from "@/lib/i18n";

const TRANSPORT_TYPES: { value: TransportType; labelVi: string; labelEn: string; icon: string }[] = [
  { value: "shuttle", labelVi: "Xe trung chuyển", labelEn: "Shuttle", icon: "🚐" },
  { value: "bus", labelVi: "Xe buýt", labelEn: "Bus", icon: "🚌" },
  { value: "car", labelVi: "Xe hơi", labelEn: "Car", icon: "🚗" },
  { value: "van", labelVi: "Xe van", labelEn: "Van", icon: "🚐" },
  { value: "other", labelVi: "Khác", labelEn: "Other", icon: "🚗" },
];

function getTransportIcon(type: TransportType): string {
  return TRANSPORT_TYPES.find((t) => t.value === type)?.icon || "🚗";
}

function getTransportLabel(type: TransportType, lang: string): string {
  const tt = TRANSPORT_TYPES.find((t) => t.value === type);
  return lang === "en" ? tt?.labelEn || type : tt?.labelVi || type;
}

interface TransportationPanelProps {
  groups: TransportationGroup[];
  guests: Guest[];
  onAddGroup: (group: Omit<TransportationGroup, "id" | "guestIds">) => void;
  onUpdateGroup: (id: number, updates: Partial<Omit<TransportationGroup, "id">>) => void;
  onRemoveGroup: (id: number) => void;
  onAssignGuest: (guestId: number, groupId: number) => void;
  onUnassignGuest: (guestId: number) => void;
  lang?: string;
}

export function TransportationPanel({
  groups,
  guests,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup,
  onAssignGuest,
  onUnassignGuest,
  lang = "vi",
}: TransportationPanelProps) {
  const en = lang === "en";
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [searchGuest, setSearchGuest] = useState("");

  // Add form state
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<TransportType>("shuttle");
  const [newDriverName, setNewDriverName] = useState("");
  const [newDriverPhone, setNewDriverPhone] = useState("");
  const [newVehicleInfo, setNewVehicleInfo] = useState("");
  const [newPickupLocation, setNewPickupLocation] = useState("");
  const [newPickupTime, setNewPickupTime] = useState("");
  const [newDropoffLocation, setNewDropoffLocation] = useState("");
  const [newDropoffTime, setNewDropoffTime] = useState("");
  const [newCapacity, setNewCapacity] = useState("16");
  const [newNotes, setNewNotes] = useState("");
  const [newDate, setNewDate] = useState("");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<TransportType>("shuttle");
  const [editDriverName, setEditDriverName] = useState("");
  const [editDriverPhone, setEditDriverPhone] = useState("");
  const [editVehicleInfo, setEditVehicleInfo] = useState("");
  const [editPickupLocation, setEditPickupLocation] = useState("");
  const [editPickupTime, setEditPickupTime] = useState("");
  const [editDropoffLocation, setEditDropoffLocation] = useState("");
  const [editDropoffTime, setEditDropoffTime] = useState("");
  const [editCapacity, setEditCapacity] = useState("16");
  const [editNotes, setEditNotes] = useState("");
  const [editDate, setEditDate] = useState("");

  // Assigned guest IDs across all groups
  const assignedGuestIds = useMemo(() => {
    const set = new Set<number>();
    groups.forEach((g) => g.guestIds.forEach((id) => set.add(id)));
    return set;
  }, [groups]);

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

  function resetAddForm() {
    setNewName("");
    setNewType("shuttle");
    setNewDriverName("");
    setNewDriverPhone("");
    setNewVehicleInfo("");
    setNewPickupLocation("");
    setNewPickupTime("");
    setNewDropoffLocation("");
    setNewDropoffTime("");
    setNewCapacity("16");
    setNewNotes("");
    setNewDate("");
  }

  function handleAdd() {
    if (!newName.trim()) return;
    onAddGroup({
      name: newName.trim(),
      transportType: newType,
      driverName: newDriverName.trim(),
      driverPhone: newDriverPhone.trim(),
      vehicleInfo: newVehicleInfo.trim(),
      pickupLocation: newPickupLocation.trim(),
      pickupTime: newPickupTime,
      dropoffLocation: newDropoffLocation.trim(),
      dropoffTime: newDropoffTime,
      capacity: parseInt(newCapacity, 10) || 16,
      notes: newNotes.trim(),
      date: newDate,
    });
    resetAddForm();
    setShowAddForm(false);
  }

  function startEdit(group: TransportationGroup) {
    setEditingId(group.id);
    setEditName(group.name);
    setEditType(group.transportType);
    setEditDriverName(group.driverName);
    setEditDriverPhone(group.driverPhone);
    setEditVehicleInfo(group.vehicleInfo);
    setEditPickupLocation(group.pickupLocation);
    setEditPickupTime(group.pickupTime);
    setEditDropoffLocation(group.dropoffLocation);
    setEditDropoffTime(group.dropoffTime);
    setEditCapacity(String(group.capacity));
    setEditNotes(group.notes);
    setEditDate(group.date);
  }

  function handleSaveEdit(id: number) {
    if (!editName.trim()) return;
    onUpdateGroup(id, {
      name: editName.trim(),
      transportType: editType,
      driverName: editDriverName.trim(),
      driverPhone: editDriverPhone.trim(),
      vehicleInfo: editVehicleInfo.trim(),
      pickupLocation: editPickupLocation.trim(),
      pickupTime: editPickupTime,
      dropoffLocation: editDropoffLocation.trim(),
      dropoffTime: editDropoffTime,
      capacity: parseInt(editCapacity, 10) || 16,
      notes: editNotes.trim(),
      date: editDate,
    });
    setEditingId(null);
  }

  function handleAssignGuest(guestId: number) {
    if (selectedGroupId === null) return;
    onAssignGuest(guestId, selectedGroupId);
  }

  // Stats
  const totalCapacity = groups.reduce((s, g) => s + g.capacity, 0);
  const totalAssigned = assignedGuestIds.size;
  const totalGuests = guests.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-base">{t("🚐 Vận Chuyển Khách", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {en
              ? `${groups.length} transport groups · ${totalAssigned}/${totalGuests} guests assigned`
              : `${groups.length} nhóm xe · ${totalAssigned}/${totalGuests} khách đã xếp`}
          </p>
        </div>
        <Button
          size="sm"
          className="h-8 px-3"
          onClick={() => {
            setShowAddForm(!showAddForm);
            resetAddForm();
          }}
        >
          + {t("Thêm nhóm xe", lang)}
        </Button>
      </div>

      {/* Summary cards */}
      {groups.length > 0 && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-sm font-bold" style={{ color: "var(--theme-primary)" }}>
              {groups.length}
            </p>
            <p className="text-xs text-muted-foreground">{t("Nhóm xe", lang)}</p>
          </div>
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-sm font-bold text-amber-600">{totalCapacity}</p>
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

      {/* Add group form */}
      {showAddForm && (
        <div className="rounded-lg bg-[var(--theme-surface-muted)] border border-[var(--theme-border)] p-3 space-y-2">
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input
              className="flex-[2] h-8 text-sm"
              placeholder={t("Tên nhóm xe", lang) + " *"}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <select
              className="flex-1 h-8 text-sm border border-gray-300 rounded px-2 bg-background"
              value={newType}
              onChange={(e) => setNewType(e.target.value as TransportType)}
            >
              {TRANSPORT_TYPES.map((tt) => (
                <option key={tt.value} value={tt.value}>
                  {tt.icon} {lang === "en" ? tt.labelEn : tt.labelVi}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={t("Tài xế", lang)}
              value={newDriverName}
              onChange={(e) => setNewDriverName(e.target.value)}
            />
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={t("SĐT tài xế", lang)}
              value={newDriverPhone}
              onChange={(e) => setNewDriverPhone(e.target.value)}
            />
          </div>
          <Input
            className="h-8 text-sm"
            placeholder={lang === "en" ? "Vehicle info (e.g. 16-seat white van)" : "Thông tin xe (vd: xe 16 chỗ màu trắng)"}
            value={newVehicleInfo}
            onChange={(e) => setNewVehicleInfo(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={t("Điểm đón", lang)}
              value={newPickupLocation}
              onChange={(e) => setNewPickupLocation(e.target.value)}
            />
            <Input
              className="w-24 h-8 text-sm"
              placeholder={t("Giờ đón", lang)}
              type="time"
              value={newPickupTime}
              onChange={(e) => setNewPickupTime(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={t("Điểm trả", lang)}
              value={newDropoffLocation}
              onChange={(e) => setNewDropoffLocation(e.target.value)}
            />
            <Input
              className="w-24 h-8 text-sm"
              placeholder={t("Giờ trả", lang)}
              type="time"
              value={newDropoffTime}
              onChange={(e) => setNewDropoffTime(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={en ? "Capacity" : "Sức chứa"}
              type="text"
              inputMode="numeric"
              value={newCapacity}
              onChange={(e) => setNewCapacity(e.target.value.replace(/\D/g, ""))}
            />
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={t("Ngày", lang)}
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
          <Input
            className="h-8 text-sm"
            placeholder={t("Ghi chú", lang)}
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground"
            >
              {t("Hủy", lang)}
            </button>
            <Button size="sm" className="h-8 px-3" onClick={handleAdd}>
              {t("Thêm nhóm xe", lang)}
            </Button>
          </div>
        </div>
      )}

      {/* Groups grid */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {groups.map((group) => {
            const isEditing = editingId === group.id;
            const isSelected = selectedGroupId === group.id;
            const groupGuests = group.guestIds
              .map((id) => guestMap.get(id))
              .filter(Boolean) as Guest[];
            const isFull = group.guestIds.length >= group.capacity;
            const icon = getTransportIcon(group.transportType);

            if (isEditing) {
              return (
                <div
                  key={group.id}
                  className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 space-y-2"
                >
                  <Input
                    className="h-8 text-sm"
                    placeholder={t("Tên nhóm xe", lang)}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <select
                    className="w-full h-8 text-sm border border-gray-300 rounded px-2 bg-background"
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as TransportType)}
                  >
                    {TRANSPORT_TYPES.map((tt) => (
                      <option key={tt.value} value={tt.value}>
                        {tt.icon} {lang === "en" ? tt.labelEn : tt.labelVi}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-col sm:flex-row gap-1.5">
                    <Input
                      className="flex-1 h-8 text-sm"
                      placeholder={t("Tài xế", lang)}
                      value={editDriverName}
                      onChange={(e) => setEditDriverName(e.target.value)}
                    />
                    <Input
                      className="flex-1 h-8 text-sm"
                      placeholder={t("SĐT tài xế", lang)}
                      value={editDriverPhone}
                      onChange={(e) => setEditDriverPhone(e.target.value)}
                    />
                  </div>
                  <Input
                    className="h-8 text-sm"
                    placeholder={lang === "en" ? "Vehicle info" : "Thông tin xe"}
                    value={editVehicleInfo}
                    onChange={(e) => setEditVehicleInfo(e.target.value)}
                  />
                  <div className="flex flex-col sm:flex-row gap-1.5">
                    <Input
                      className="flex-1 h-8 text-sm"
                      placeholder={t("Điểm đón", lang)}
                      value={editPickupLocation}
                      onChange={(e) => setEditPickupLocation(e.target.value)}
                    />
                    <Input
                      className="w-24 h-8 text-sm"
                      placeholder={t("Giờ đón", lang)}
                      type="time"
                      value={editPickupTime}
                      onChange={(e) => setEditPickupTime(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1.5">
                    <Input
                      className="flex-1 h-8 text-sm"
                      placeholder={t("Điểm trả", lang)}
                      value={editDropoffLocation}
                      onChange={(e) => setEditDropoffLocation(e.target.value)}
                    />
                    <Input
                      className="w-24 h-8 text-sm"
                      placeholder={t("Giờ trả", lang)}
                      type="time"
                      value={editDropoffTime}
                      onChange={(e) => setEditDropoffTime(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1.5">
                    <Input
                      className="flex-1 h-8 text-sm"
                      placeholder={en ? "Capacity" : "Sức chứa"}
                      type="text"
                      inputMode="numeric"
                      value={editCapacity}
                      onChange={(e) => setEditCapacity(e.target.value.replace(/\D/g, ""))}
                    />
                    <Input
                      className="flex-1 h-8 text-sm"
                      placeholder={t("Ngày", lang)}
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                  </div>
                  <Input
                    className="h-8 text-sm"
                    placeholder={t("Ghi chú", lang)}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground"
                    >
                      {t("Hủy", lang)}
                    </button>
                    <Button size="sm" className="h-8 px-3" onClick={() => handleSaveEdit(group.id)}>
                      {t("Lưu", lang)}
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={group.id}
                className={`rounded-xl border-2 bg-[var(--theme-surface)] p-3 space-y-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-[var(--theme-primary)] shadow-md"
                    : "border-[var(--theme-border)] hover:border-[var(--theme-primary)]/50"
                }`}
                onClick={() => setSelectedGroupId(isSelected ? null : group.id)}
              >
                {/* Group header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">{icon}</div>
                    <div>
                      <p className="font-semibold text-sm">{group.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {getTransportLabel(group.transportType, lang)}
                        {group.driverName && ` · ${group.driverName}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => startEdit(group)}
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
                              ? `Delete "${group.name}"? Guests will be unassigned.`
                              : `Xóa "${group.name}"? Khách sẽ bị bỏ xếp.`
                          )
                        ) {
                          onRemoveGroup(group.id);
                          if (selectedGroupId === group.id) setSelectedGroupId(null);
                        }
                      }}
                      className="text-xs text-red-400 hover:text-red-600 p-1"
                      title="✕"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Route info */}
                {(group.pickupLocation || group.dropoffLocation) && (
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    {group.pickupLocation && (
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span>{group.pickupLocation}</span>
                        {group.pickupTime && <span className="ml-auto">{group.pickupTime}</span>}
                      </div>
                    )}
                    {group.dropoffLocation && (
                      <div className="flex items-center gap-1">
                        <span>🏁</span>
                        <span>{group.dropoffLocation}</span>
                        {group.dropoffTime && <span className="ml-auto">{group.dropoffTime}</span>}
                      </div>
                    )}
                  </div>
                )}

                {/* Assigned guests */}
                {groupGuests.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {groupGuests.map((g) => (
                      <span
                        key={g.id}
                        className="inline-flex items-center gap-1 text-xs bg-[var(--theme-surface-muted)] rounded-full px-2 py-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="truncate max-w-[100px]">{g.name}</span>
                        <button
                          onClick={() => onUnassignGuest(g.id)}
                          className="text-muted-foreground hover:text-red-500 shrink-0"
                          title={en ? "Remove from group" : "Bỏ khỏi nhóm"}
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
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (group.guestIds.length / group.capacity) * 100)}%`,
                        backgroundColor: isFull ? "#ef4444" : "var(--theme-primary)",
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {group.guestIds.length}/{group.capacity}
                  </span>
                </div>

                {/* Notes */}
                {group.notes && (
                  <p className="text-xs text-muted-foreground italic">{group.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center py-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
            <span className="text-3xl">🚐</span>
          </div>
          <h3 className="text-base font-semibold mb-1">{t("Tạo nhóm vận chuyển đầu tiên", lang)}</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {en
              ? "Add transport groups to organize guest transportation between venues."
              : "Thêm nhóm xe để sắp xếp vận chuyển khách giữa các địa điểm."}
          </p>
        </div>
      )}

      {/* Unassigned guests section */}
      {groups.length > 0 && unassignedGuests.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {t("👥 Chưa xếp xe", lang)} ({unassignedGuests.length})
            </h3>
            {selectedGroupId !== null && (
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

          {/* Target group indicator */}
          {selectedGroupId !== null && (
            <div className="flex items-center gap-2 text-xs bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] rounded-lg px-3 py-1.5">
              <span>🎯</span>
              <span>
                {en ? "Assigning to:" : "Xếp vào nhóm:"}{" "}
                <strong>{groups.find((g) => g.id === selectedGroupId)?.name}</strong>
              </span>
              <button
                onClick={() => setSelectedGroupId(null)}
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
                disabled={selectedGroupId === null}
                className={`inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1 border transition-colors ${
                  selectedGroupId !== null
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
      {groups.length > 0 && unassignedGuests.length === 0 && guests.length > 0 && (
        <div className="flex items-center gap-2 justify-center py-4 text-sm text-emerald-600">
          <span>✅</span>
          <span>{en ? "All guests have been assigned transport!" : "Tất cả khách đã được xếp xe!"}</span>
        </div>
      )}
    </div>
  );
}
