/**
 * Important Dates List Component
 * CRUD interface for managing important dates
 */

import { useState } from "react";
import { Plus, Pencil, Trash2, Calendar, Heart, Gift } from "lucide-react";
import type { ImportantDate } from "@/types/wedding";

interface ImportantDatesListProps {
  dates: ImportantDate[];
  lang: "vi" | "en";
  onAdd: (date: Omit<ImportantDate, "id">) => void;
  onUpdate: (id: number, date: Partial<ImportantDate>) => void;
  onRemove: (id: number) => void;
}

type DateType = ImportantDate["type"];

export function ImportantDatesList({
  dates,
  lang,
  onAdd,
  onUpdate,
  onRemove,
}: ImportantDatesListProps) {
  const en = lang === "en";
  const [editing, setEditing] = useState<ImportantDate | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Sort dates by date
  const sortedDates = [...dates].sort((a, b) => a.date.localeCompare(b.date));

  function handleAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function handleEdit(date: ImportantDate) {
    setEditing(date);
    setShowForm(true);
  }

  function handleClose() {
    setShowForm(false);
    setEditing(null);
  }

  function handleSave(data: Omit<ImportantDate, "id">) {
    if (editing) {
      onUpdate(editing.id, data);
    } else {
      onAdd(data);
    }
    handleClose();
  }

  function handleDelete(id: number) {
    if (en) {
      if (window.confirm("Delete this date?")) {
        onRemove(id);
      }
    } else {
      if (window.confirm("Xóa ngày này?")) {
        onRemove(id);
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {en ? "Important Dates" : "Ngày Quan Trọng"}
        </h3>
        <button
          onClick={handleAdd}
          className="text-xs px-3 py-1.5 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          {en ? "Add Date" : "Thêm Ngày"}
        </button>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{en ? "No dates added yet" : "Chưa thêm ngày nào"}</p>
          <p className="text-xs mt-1">
            {en ? "Click 'Add Date' to track your important milestones" : "Nhấn 'Thêm Ngày' để theo dõi mốc quan trọng"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedDates.map((date) => (
            <div
              key={date.id}
              className="bg-white dark:bg-gray-800 border rounded-lg p-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-sm">{date.title}</div>
                    <div className="flex items-center gap-1">
                      {date.type === "milestone" && <Heart className="w-3 h-3 text-red-500" />}
                      {date.type === "anniversary" && <Gift className="w-3 h-3 text-purple-500" />}
                      {date.recurring && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                          {en ? "Yearly" : "Hàng năm"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(date.date).toLocaleDateString(
                      lang === "en" ? "en-US" : "vi-VN",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </div>

                  {date.notes && (
                    <div className="text-xs text-muted-foreground mt-1 italic">
                      "{date.notes}"
                    </div>
                  )}

                  {date.reminderDays && date.reminderDays > 0 && (
                    <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      {en
                        ? `Reminder: ${date.reminderDays} days before`
                        : `Nhắc nhở: ${date.reminderDays} ngày trước`}
                    </div>
                  )}
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(date)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title={en ? "Edit" : "Sửa"}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(date.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    title={en ? "Delete" : "Xóa"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <DateForm
          initial={editing}
          lang={lang}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

interface DateFormProps {
  initial: ImportantDate | null;
  lang: "vi" | "en";
  onSave: (date: Omit<ImportantDate, "id">) => void;
  onClose: () => void;
}

function DateForm({ initial, lang, onSave, onClose }: DateFormProps) {
  const en = lang === "en";
  const isEdit = initial !== null;

  const [title, setTitle] = useState(initial?.title || "");
  const [date, setDate] = useState(initial?.date || "");
  const [type, setType] = useState<DateType>(initial?.type || "custom");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [recurring, setRecurring] = useState(initial?.recurring ?? true);
  const [reminderDays, setReminderDays] = useState(initial?.reminderDays?.toString() || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !date) {
      alert(en ? "Please fill in required fields" : "Vui lòng điền các trường bắt buộc");
      return;
    }

    onSave({
      title: title.trim(),
      date,
      type,
      notes: notes.trim() || undefined,
      recurring,
      reminderDays: reminderDays ? parseInt(reminderDays) : undefined,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="font-semibold mb-4">
          {isEdit ? (en ? "Edit Date" : "Sửa Ngày") : (en ? "Add Date" : "Thêm Ngày")}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              {en ? "Title" : "Tiêu đề"} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={en ? "e.g., First Date, Engagement Day" : "vd: Hẹn hò đầu, Ngày đính hôn"}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {en ? "Date" : "Ngày"} *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {en ? "Type" : "Loại"}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DateType)}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
            >
              <option value="milestone">{en ? "Milestone" : "Mốc quan trọng"}</option>
              <option value="anniversary">{en ? "Anniversary" : "Kỷ niệm"}</option>
              <option value="custom">{en ? "Custom" : "Tùy chỉnh"}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {en ? "Notes (optional)" : "Ghi chú (tùy chọn)"}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={en ? "Special memories or details..." : "Kỷ niệm hoặc chi tiết đặc biệt..."}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background resize-none"
              rows={2}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recurring"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="recurring" className="text-sm">
              {en ? "Repeats annually" : "Lặp lại hàng năm"}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {en ? "Reminder (days before)" : "Nhắc nhở (ngày trước)"}
            </label>
            <input
              type="number"
              min="0"
              max="365"
              value={reminderDays}
              onChange={(e) => setReminderDays(e.target.value)}
              placeholder={en ? "e.g., 7" : "vd: 7"}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors text-sm"
            >
              {isEdit ? (en ? "Update" : "Cập nhật") : (en ? "Add" : "Thêm")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              {en ? "Cancel" : "Hủy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}