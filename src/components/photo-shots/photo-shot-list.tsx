import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PhotoShot, PhotoShotCategory } from "@/types/wedding";
import { getCategoryLabel } from "@/data/photo-shots";
import { t } from "@/lib/i18n";

const CATEGORIES: PhotoShotCategory[] = ["prep", "first-look", "ceremony", "family", "portraits", "reception", "details", "exit"];

const PRIORITY_CONFIG = {
  "must-have": { labelVi: "Bắt Buộc", labelEn: "Must Have", color: "text-red-600 font-medium" },
  "nice-to-have": { labelVi: "Nên Có", labelEn: "Nice to Have", color: "text-blue-600" },
};

interface PhotoShotListProps {
  shots: PhotoShot[];
  onAdd: (shot: Omit<PhotoShot, "id">) => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, updates: Partial<PhotoShot>) => void;
  onGenerateTemplate: () => void;
  lang?: string;
}

export function PhotoShotList({ shots, onAdd, onRemove, onUpdate, onGenerateTemplate, lang = "vi" }: PhotoShotListProps) {
  const en = lang === "en";
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCat, setFilterCat] = useState<PhotoShotCategory | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "done">("all");

  const [cat, setCat] = useState<PhotoShotCategory>("prep");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<"must-have" | "nice-to-have">("must-have");
  const [shotBy, setShotBy] = useState("");
  const [notes, setNotes] = useState("");

  function resetAddForm() {
    setCat("prep"); setTitle(""); setDesc(""); setPriority("must-have"); setShotBy(""); setNotes("");
  }

  function handleAdd() {
    if (!title.trim()) return;
    const maxOrder = Math.max(0, ...shots.filter((s) => s.category === cat).map((s) => s.order));
    onAdd({
      title: title.trim(),
      category: cat,
      description: desc.trim(),
      priority,
      shotBy: shotBy.trim(),
      notes: notes.trim(),
      checked: false,
      order: maxOrder + 1,
    });
    resetAddForm();
    setShowAddForm(false);
  }

  function toggleChecked(id: number, checked: boolean) {
    onUpdate(id, { checked });
  }

  const filtered = shots.filter((s) => {
    if (filterCat && s.category !== filterCat) return false;
    if (filterStatus === "pending" && s.checked) return false;
    if (filterStatus === "done" && !s.checked) return false;
    return true;
  });

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catShots = filtered.filter((s) => s.category === cat).sort((a, b) => a.order - b.order);
    if (catShots.length > 0) acc[cat] = catShots;
    return acc;
  }, {} as Record<PhotoShotCategory, PhotoShot[]>);

  const completionRate = shots.length > 0 ? Math.round((shots.filter((s) => s.checked).length / shots.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-base">{t("📸 Danh Sách Chụp Hình", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {shots.length > 0
              ? `${completionRate}% ${en ? "complete" : "hoàn thành"} (${shots.filter((s) => s.checked).length}/${shots.length})`
              : en
              ? "No shots added yet"
              : "Chưa thêm ảnh nào"}
          </p>
        </div>
        <div className="flex gap-2">
          {shots.length === 0 && (
            <Button size="sm" variant="outline" onClick={onGenerateTemplate}>
              {t("📋 Tự Tạo Danh Sách", lang)}
            </Button>
          )}
          <Button size="sm" onClick={() => setShowAddForm(true)}>
            {t("+ Thêm", lang)}
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="border rounded-lg p-4 space-y-3 bg-card">
          <h3 className="font-medium text-sm">{en ? "Add New Shot" : "Thêm Ảnh Mới"}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">{en ? "Category" : "Danh mục"}</label>
              <select
                className="w-full border rounded px-2 py-1.5 text-sm"
                value={cat}
                onChange={(e) => setCat(e.target.value as PhotoShotCategory)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {getCategoryLabel(c, lang)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{en ? "Priority" : "Độ ưu tiên"}</label>
              <select
                className="w-full border rounded px-2 py-1.5 text-sm"
                value={priority}
                onChange={(e) => setPriority(e.target.value as "must-have" | "nice-to-have")}
              >
                <option value="must-have">{en ? "Must Have" : "Bắt buộc"}</option>
                <option value="nice-to-have">{en ? "Nice to Have" : "Nên có"}</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground">{en ? "Title" : "Tiêu đề"}</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={en ? "e.g., Bride portrait" : "vd: Chân dung cô dâu"}
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground">{en ? "Description" : "Mô tả"}</label>
              <Input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder={en ? "Details about this shot" : "Chi tiết về ảnh này"}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{en ? "Shot At" : "Chụp tại"}</label>
              <Input
                value={shotBy}
                onChange={(e) => setShotBy(e.target.value)}
                placeholder={en ? "Location" : "Địa điểm"}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{en ? "Notes" : "Ghi chú"}</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={en ? "Special instructions" : "Hướng dẫn riêng"}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
              {en ? "Cancel" : "Hủy"}
            </Button>
            <Button size="sm" onClick={handleAdd}>
              {en ? "Add" : "Thêm"}
            </Button>
          </div>
        </div>
      )}

      {shots.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filterCat === null ? "default" : "outline"}
            onClick={() => setFilterCat(null)}
          >
            {en ? "All" : "Tất cả"}
          </Button>
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={filterCat === c ? "default" : "outline"}
              onClick={() => setFilterCat(c)}
            >
              {getCategoryLabel(c, lang)}
            </Button>
          ))}
        </div>
      )}

      {shots.length > 0 && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
          >
            {en ? "All" : "Tất cả"}
          </Button>
          <Button
            size="sm"
            variant={filterStatus === "pending" ? "default" : "outline"}
            onClick={() => setFilterStatus("pending")}
          >
            {en ? "Pending" : "Còn lại"}
          </Button>
          <Button
            size="sm"
            variant={filterStatus === "done" ? "default" : "outline"}
            onClick={() => setFilterStatus("done")}
          >
            {en ? "Done" : "Đã xong"}
          </Button>
        </div>
      )}

      {Object.entries(grouped).length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {en ? "No shots match your filters" : "Không có ảnh nào phù hợp bộ lọc"}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([cat, catShots]) => (
            <div key={cat} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <span>{getCategoryLabel(cat as PhotoShotCategory, lang)}</span>
                <span className="text-xs">({catShots.filter((s) => s.checked).length}/{catShots.length})</span>
              </h3>
              <div className="space-y-1">
                {catShots.map((shot) => (
                  <div
                    key={shot.id}
                    className={`flex items-start gap-3 p-2 rounded border hover:bg-accent/50 transition-colors ${
                      shot.checked ? "bg-muted/30" : ""
                    }`}
                  >
                    <div
                      onClick={() => toggleChecked(shot.id, !shot.checked)}
                      className="mt-0.5 w-5 h-5 rounded border border-primary flex items-center justify-center cursor-pointer hover:bg-primary/10"
                    >
                      {shot.checked && <div className="w-3 h-3 bg-primary rounded-sm" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-medium text-sm ${shot.checked ? "line-through text-muted-foreground" : ""}`}>
                          {shot.title}
                        </span>
                        <span className={`text-xs ${PRIORITY_CONFIG[shot.priority].color}`}>
                          {en ? PRIORITY_CONFIG[shot.priority].labelEn : PRIORITY_CONFIG[shot.priority].labelVi}
                        </span>
                      </div>
                      {shot.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{shot.description}</p>
                      )}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                        {shot.shotBy && <span>📍 {shot.shotBy}</span>}
                        {shot.notes && <span>📝 {shot.notes}</span>}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemove(shot.id)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
