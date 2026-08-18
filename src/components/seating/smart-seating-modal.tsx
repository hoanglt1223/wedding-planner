import { useState } from "react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import type { Guest, SeatingTable } from "@/types/wedding";

interface SmartSeatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tables: SeatingTable[];
  guests: Guest[];
  lang?: string;
}

interface AssignmentPreview {
  tableName: string;
  guestCount: number;
  capacity: number;
  groups: string[];
}

export function SmartSeatingModal({
  isOpen,
  onClose,
  onConfirm,
  tables,
  guests,
  lang = "vi",
}: SmartSeatingModalProps) {
  const en = lang === "en";
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Generate preview of how guests will be assigned
  function generatePreview(): AssignmentPreview[] {
    const unassignedGuests = guests.filter(
      (g) => !tables.some((t) => t.guestIds.includes(g.id))
    );

    // Group guests by their group field
    const groupedGuests = new Map<string, Guest[]>();
    unassignedGuests.forEach((guest) => {
      const group = guest.group || "other";
      if (!groupedGuests.has(group)) {
        groupedGuests.set(group, []);
      }
      groupedGuests.get(group)!.push(guest);
    });

    // Assign groups to tables
    const previews: AssignmentPreview[] = tables.map((table) => ({
      tableName: table.name,
      guestCount: table.guestIds.length,
      capacity: table.capacity,
      groups: [],
    }));

    let tableIndex = 0;
    for (const [group, groupGuests] of groupedGuests.entries()) {
      if (tableIndex >= previews.length) break;

      const preview = previews[tableIndex];
      const spaceAvailable = preview.capacity - preview.guestCount;

      if (spaceAvailable > 0 && groupGuests.length > 0) {
        const toAssign = Math.min(spaceAvailable, groupGuests.length);
        preview.guestCount += toAssign;
        preview.groups.push(group);

        if (toAssign < groupGuests.length && tableIndex + 1 < previews.length) {
          tableIndex++;
        }
      }
    }

    return previews.filter((p) => p.groups.length > 0);
  }

  const preview = generatePreview();
  const totalUnassigned = guests.filter(
    (g) => !tables.some((t) => t.guestIds.includes(g.id))
  ).length;

  async function handleConfirm() {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onConfirm();
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--theme-surface)] rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {en ? "🤖 Smart Seating Assignment" : "🤖 Xếp Chỗ Ngồi Thông Minh"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {en
                ? "Automatically assign guests to tables based on groups and dietary needs"
                : "Tự động xếp khách vào bàn theo nhóm và chế độ ăn"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <span className="text-green-600 mt-0.5">✓</span>
              <p>{t("Nhóm theo gia đình/bạn bè", lang)}</p>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="text-green-600 mt-0.5">✓</span>
              <p>{t("Cân nhắc chế độ ăn", lang)}</p>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="text-green-600 mt-0.5">✓</span>
              <p>{t("Cân bằng sức chứa bàn", lang)}</p>
            </div>
          </div>

          {preview.length > 0 && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <p className="text-sm font-medium">
                {en ? "Preview:" : "Xem trước:"}
              </p>
              <div className="space-y-1.5 text-xs">
                {preview.map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{p.tableName}</span>
                    <span>
                      {p.guestCount}/{p.capacity} · {p.groups.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
              {totalUnassigned > preview.reduce((sum, p) => sum + (p.guestCount - (tables.find((t) => t.name === p.tableName)?.guestIds.length || 0)), 0) && (
                <p className="text-xs text-amber-600 mt-2">
                  ⚠️ {en ? "Some guests may not fit" : "Một số khách có thể không vừa"}
                </p>
              )}
            </div>
          )}

          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs text-amber-800">
              {t("Việc này sẽ ghi đè sắp xếp chỗ ngồi hiện tại", lang)}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
            >
              {en ? "Cancel" : "Hủy"}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isProcessing || tables.length === 0 || totalUnassigned === 0}
              className="flex-1"
            >
              {isProcessing
                ? en
                  ? "Assigning..."
                  : "Đang xếp..."
                : t("Xếp", lang)}
            </Button>
          </div>

          {tables.length === 0 && (
            <p className="text-xs text-center text-muted-foreground">
              {en ? "Create tables first" : "Tạo bàn trước"}
            </p>
          )}

          {totalUnassigned === 0 && tables.length > 0 && (
            <p className="text-xs text-center text-muted-foreground">
              {en ? "All guests already assigned" : "Đã xếp hết khách"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
