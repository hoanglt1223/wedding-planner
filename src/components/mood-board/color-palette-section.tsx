import { useState } from "react";
import { t } from "@/lib/i18n";
import type { ColorPalette } from "@/types/wedding";

interface ColorPaletteSectionProps {
  palettes: ColorPalette[];
  onAdd: (palette: Omit<ColorPalette, "id">) => void;
  onUpdate: (id: number, updates: Partial<ColorPalette>) => void;
  onRemove: (id: number) => void;
  lang?: string;
}

export function ColorPaletteSection({
  palettes,
  onAdd,
  onUpdate,
  onRemove,
  lang = "vi",
}: ColorPaletteSectionProps) {
  const en = lang === "en";
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ColorPalette | null>(null);
  const [name, setName] = useState("");
  const [colors, setColors] = useState<string[]>(["#c0392b", "#e74c3c", "#f5b7b1", "#fadbd8", "#f9ebea"]);
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    setEditing(null);
    setName("");
    setColors(["#c0392b", "#e74c3c", "#f5b7b1", "#fadbd8", "#f9ebea"]);
    setNotes("");
    setShowForm(true);
  };

  const handleEdit = (palette: ColorPalette) => {
    setEditing(palette);
    setName(palette.name);
    setColors([...palette.colors]);
    setNotes(palette.notes);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editing) {
      onUpdate(editing.id, { name: name.trim(), colors, notes: notes.trim() });
    } else {
      onAdd({ name: name.trim(), colors, notes: notes.trim() });
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const addColor = () => {
    if (colors.length < 8) {
      setColors([...colors, "#888888"]);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          🎨 {en ? "Color Palettes" : "Bảng Màu"}
        </h3>
        <button
          onClick={handleAdd}
          className="text-xs px-2 py-1 bg-[var(--theme-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          + {en ? "Add" : "Thêm"}
        </button>
      </div>

      {palettes.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          {en ? "Create color palettes for your wedding theme" : "Tạo bảng màu cho chủ đề đám cưới của bạn"}
        </p>
      ) : (
        <div className="space-y-2">
          {palettes.map((palette) => (
            <div
              key={palette.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--theme-surface-muted)] group"
            >
              <div className="flex gap-0.5 shrink-0">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{palette.name}</p>
                {palette.notes && (
                  <p className="text-xs text-muted-foreground truncate">{palette.notes}</p>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(palette)}
                  className="w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-[var(--theme-surface)]"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onRemove(palette.id)}
                  className="w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-[var(--theme-surface)]"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div
            className="bg-[var(--theme-surface)] rounded-xl shadow-xl max-w-sm w-full p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold">
                {editing ? (en ? "Edit Palette" : "Chỉnh sửa bảng màu") : (en ? "New Palette" : "Bảng màu mới")}
              </h4>
              <button onClick={() => setShowForm(false)} className="text-lg">✕</button>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">{en ? "Name" : "Tên"} *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={en ? "e.g., Romantic Pink" : "VD: Hồng lãng mạn"}
                className="w-full px-3 py-2 border border-[var(--theme-border)] rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">{en ? "Colors" : "Màu sắc"}</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color, i) => (
                  <div key={i} className="relative group/color">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(i, e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
                    />
                    {colors.length > 2 && (
                      <button
                        onClick={() => removeColor(i)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {colors.length < 8 && (
                  <button
                    onClick={addColor}
                    className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-lg text-gray-400 hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"
                  >
                    +
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">{en ? "Notes" : "Ghi chú"}</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={en ? "Where to use these colors" : "Sử dụng ở đâu"}
                className="w-full px-3 py-2 border border-[var(--theme-border)] rounded-lg text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-[var(--theme-border)] rounded-lg text-sm hover:bg-[var(--theme-surface-muted)]"
              >
                {t("Hủy", lang)}
              </button>
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="flex-1 px-4 py-2 bg-[var(--theme-primary)] text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
              >
                {editing ? t("Cập nhật", lang) : t("Thêm", lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
