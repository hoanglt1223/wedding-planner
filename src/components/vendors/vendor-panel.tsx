import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Vendor } from "@/types/wedding";

const CATEGORIES = [
  "🏛️ Nhà hàng",
  "📸 Ảnh/Video",
  "🌸 Trang trí",
  "💄 Makeup",
  "🎵 MC/Nhạc",
  "🚗 Xe",
  "💐 Hoa",
  "👗 Trang phục",
  "📦 Khác",
];

interface VendorPanelProps {
  vendors: Vendor[];
  onAddVendor: (vendor: Omit<Vendor, "id">) => void;
  onRemoveVendor: (id: number) => void;
}

export function VendorPanel({ vendors, onAddVendor, onRemoveVendor }: VendorPanelProps) {
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [note, setNote] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    onAddVendor({ category: cat, name: name.trim(), phone: phone.trim(), address: addr.trim(), note: note.trim() });
    setName("");
    setPhone("");
    setAddr("");
    setNote("");
  };

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4">
      <div className="pb-2">
        <h2 className="text-base font-semibold">🗺️ Danh Sách Vendor</h2>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-gray-500">
          Lưu thông tin nhà cung cấp: nhà hàng, studio, trang trí, MC...
        </p>

        {/* Add form */}
        <div className="space-y-1.5 rounded-lg bg-[var(--theme-surface-muted)] p-3">
          <select
            className="w-full h-8 text-sm border border-gray-300 rounded px-2"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input
              className="flex-[2] h-8 text-sm"
              placeholder="Tên vendor"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="flex-1 h-8 text-sm"
              placeholder="SĐT"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Input
            className="h-8 text-sm"
            placeholder="Địa chỉ"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input
              className="flex-1 h-8 text-sm"
              placeholder="Ghi chú (giá, gói...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button size="sm" className="h-8 px-3 shrink-0" onClick={handleAdd}>+</Button>
          </div>
        </div>

        {/* Vendor list */}
        {vendors.length > 0 && (
          <div className="space-y-1.5">
            {vendors.map((v) => (
              <div key={v.id} className="flex items-start gap-2 rounded-lg border border-[var(--theme-border)] p-2.5 text-sm">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5">{v.category}</span>
                    <span className="font-semibold truncate">{v.name}</span>
                  </div>
                  {v.phone && <div className="text-xs text-gray-500 mt-0.5">📞 {v.phone}</div>}
                  {v.address && <div className="text-xs text-gray-500">📍 {v.address}</div>}
                  {v.note && <div className="text-xs text-gray-400 italic mt-0.5">{v.note}</div>}
                </div>
                <span
                  className="cursor-pointer text-red-500 hover:text-red-700 font-bold text-xs"
                  onClick={() => onRemoveVendor(v.id)}
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
        )}

        {vendors.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <span className="text-3xl">🗺️</span>
            </div>
            <h3 className="text-base font-semibold mb-1">Thêm nhà cung cấp đầu tiên</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Lưu thông tin nhà hàng, studio, trang trí để so sánh và liên hệ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
