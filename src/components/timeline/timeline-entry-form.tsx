import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { t } from "@/lib/i18n";
import type { TimelineEntry } from "@/types/wedding";

const CATEGORIES: { value: TimelineEntry["category"]; labelVi: string; labelEn: string }[] = [
  { value: "ceremony", labelVi: "Nghi lễ", labelEn: "Ceremony" },
  { value: "reception", labelVi: "Tiệc", labelEn: "Reception" },
  { value: "prep", labelVi: "Chuẩn bị", labelEn: "Preparation" },
  { value: "other", labelVi: "Khác", labelEn: "Other" },
];

type EntryDraft = Omit<TimelineEntry, "id">;

function toEntryDraft(entry: TimelineEntry | null): EntryDraft {
  if (!entry) {
    return { time: "08:00", title: "", location: "", responsible: "", notes: "", category: "ceremony" };
  }
  return {
    time: entry.time,
    title: entry.title,
    location: entry.location,
    responsible: entry.responsible,
    notes: entry.notes,
    category: entry.category,
  };
}

interface TimelineEntryFormProps {
  lang: string;
  editing: TimelineEntry | null;
  onSave: (data: EntryDraft) => void;
  onClose: () => void;
}

export function TimelineEntryForm({ lang, editing, onSave, onClose }: TimelineEntryFormProps) {
  // Initialize once from editing prop — form is always mounted fresh (showForm gate)
  const [form, setForm] = useState<EntryDraft>(() => toEntryDraft(editing));

  const set = (field: keyof EntryDraft, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  const isEdit = editing !== null;
  const title = isEdit
    ? (lang === "en" ? "Edit Entry" : "Chỉnh sửa mục")
    : (lang === "en" ? "Add Entry" : "Thêm mục lịch trình");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-sm p-5 flex flex-col gap-4">
        <h3 className="font-semibold text-base">{title}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-28 shrink-0">
              <Label className="text-xs">{lang === "en" ? "Time" : "Giờ"}</Label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                required
                className="text-sm"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-xs">{lang === "en" ? "Category" : "Loại"}</Label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="border border-border rounded-md px-2 py-1.5 text-sm bg-background"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {lang === "en" ? c.labelEn : c.labelVi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs">{lang === "en" ? "Title" : "Tên mục"} *</Label>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              placeholder={lang === "en" ? "Entry title..." : "Tên hoạt động..."}
              className="text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs">{lang === "en" ? "Location" : "Địa điểm"}</Label>
            <Input
              value={form.location ?? ""}
              onChange={(e) => set("location", e.target.value)}
              placeholder={lang === "en" ? "Location..." : "Địa điểm..."}
              className="text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs">{lang === "en" ? "Responsible" : "Phụ trách"}</Label>
            <Input
              value={form.responsible ?? ""}
              onChange={(e) => set("responsible", e.target.value)}
              placeholder={lang === "en" ? "Person responsible..." : "Người phụ trách..."}
              className="text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs">{lang === "en" ? "Notes" : "Ghi chú"}</Label>
            <Textarea
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              placeholder={lang === "en" ? "Notes..." : "Ghi chú..."}
              className="text-sm resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              {t("Hủy", lang)}
            </Button>
            <Button type="submit" size="sm">
              {t("Lưu", lang)}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
