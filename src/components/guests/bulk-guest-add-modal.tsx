import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import guestGroups from "@/data/guest-groups";

interface BulkGuestAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (guests: Array<{ name: string; phone?: string; side: "trai" | "gai"; group?: string; tableGroup?: string }>) => void;
  lang?: string;
}

export function BulkGuestAddModal({ isOpen, onClose, onAdd, lang = "vi" }: BulkGuestAddModalProps) {
  const [names, setNames] = useState("");
  const [defaultSide, setDefaultSide] = useState<"trai" | "gai">("trai");
  const [defaultGroup, setDefaultGroup] = useState("");
  const [defaultTable, setDefaultTable] = useState("");

  if (!isOpen) return null;

  const parsedNames = names
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const handleAdd = () => {
    if (parsedNames.length === 0) return;

    const guests = parsedNames.map((name) => ({
      name,
      phone: "",
      side: defaultSide,
      group: defaultGroup || undefined,
      tableGroup: defaultTable,
    }));

    onAdd(guests);
    setNames("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">
            {lang === "en" ? "Add Multiple Guests" : "Thêm Khách Nhiều"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "en"
              ? "Enter one name per line. You can edit details later."
              : "Nhập một tên trên mỗi dòng. Có thể chỉnh sửa thông tin sau."}
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Textarea for names */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {lang === "en" ? "Guest Names (one per line)" : "Tên Khách (mỗi dòng một tên)"}
            </label>
            <textarea
              className="w-full min-h-[200px] p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={lang === "en"
                ? "Nguyễn Văn A\nTrần Thị B\nLê Văn C"
                : "Nguyễn Văn A\nTrần Thị B\nLê Văn C"}
              value={names}
              onChange={(e) => setNames(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "en" ? `Detected: ${parsedNames.length} names` : `Đã phát hiện: ${parsedNames.length} tên`}
            </p>
          </div>

          {/* Default settings */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">
                {lang === "en" ? "Default Side" : "Bên Mặc Định"}
              </label>
              <select
                className="w-full p-2 border rounded-lg text-sm"
                value={defaultSide}
                onChange={(e) => setDefaultSide(e.target.value as "trai" | "gai")}
              >
                <option value="trai">{lang === "en" ? "Groom" : "Trai"}</option>
                <option value="gai">{lang === "en" ? "Bride" : "Gái"}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {lang === "en" ? "Default Group (optional)" : "Nhóm Mặc Định (tùy chọn)"}
              </label>
              <select
                className="w-full p-2 border rounded-lg text-sm"
                value={defaultGroup}
                onChange={(e) => setDefaultGroup(e.target.value)}
              >
                <option value="">{lang === "en" ? "👥 No Group" : "👥 Không nhóm"}</option>
                {guestGroups.map((g) => (
                  <option key={g.key} value={g.key}>
                    {g.icon} {lang === "en" ? g.labelEn : g.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">
                {lang === "en" ? "Default Table (optional)" : "Bàn Mặc Định (tùy chọn)"}
              </label>
              <Input
                placeholder={lang === "en" ? "e.g., Bàn 1" : "Ví dụ: Bàn 1"}
                value={defaultTable}
                onChange={(e) => setDefaultTable(e.target.value)}
              />
            </div>
          </div>

          {/* Preview */}
          {parsedNames.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium mb-2">
                {lang === "en" ? "Preview:" : "Xem trước:"}
              </p>
              <div className="max-h-40 overflow-y-auto text-xs space-y-1">
                {parsedNames.map((name, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 text-center text-muted-foreground">{idx + 1}.</span>
                    <span>{name}</span>
                    <span className="text-muted-foreground">
                      ({defaultSide === "trai" ? (lang === "en" ? "Groom" : "Trai") : (lang === "en" ? "Bride" : "Gái")})
                    </span>
                    {defaultGroup && (
                      <span className="text-muted-foreground">
                        - {guestGroups.find((g) => g.key === defaultGroup)?.[lang === "en" ? "labelEn" : "label"]}
                      </span>
                    )}
                    {defaultTable && (
                      <span className="text-muted-foreground">- {defaultTable}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            {lang === "en" ? "Cancel" : "Hủy"}
          </Button>
          <Button onClick={handleAdd} disabled={parsedNames.length === 0}>
            {lang === "en" ? `Add ${parsedNames.length} Guest${parsedNames.length > 1 ? "s" : ""}` : `Thêm ${parsedNames.length} Khách`}
          </Button>
        </div>
      </div>
    </div>
  );
}
