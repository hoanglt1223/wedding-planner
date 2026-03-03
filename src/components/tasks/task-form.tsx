import { useState } from "react";
import type { TaskData } from "@/lib/task-api";
import { t } from "@/lib/i18n";
import { DateInput } from "@/components/ui/date-input";

interface TaskFormProps {
  initial?: Partial<TaskData>;
  categories: string[];
  onSave: (data: Partial<TaskData>) => void;
  onCancel: () => void;
  lang?: string;
}

export function TaskForm({ initial = {}, categories, onSave, onCancel, lang = "vi" }: TaskFormProps) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [assigneeName, setAssigneeName] = useState(initial.assigneeName ?? "");
  const [dueDate, setDueDate] = useState(initial.dueDate ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [status, setStatus] = useState(initial.status ?? "pending");
  const [newCat, setNewCat] = useState("");
  const [allCats, setAllCats] = useState<string[]>(categories);
  const [error, setError] = useState("");

  function handleAddCat() {
    const c = newCat.trim();
    if (c && !allCats.includes(c)) setAllCats((prev) => [...prev, c]);
    if (c) setCategory(c);
    setNewCat("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Tiêu đề không được để trống"); return; }
    onSave({ title: title.trim(), description: description.trim() || undefined, assigneeName: assigneeName.trim() || undefined, dueDate: dueDate || undefined, category: category || undefined, status });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onCancel}>
      <div className="bg-white rounded-xl p-5 max-w-sm w-full mx-4 space-y-3" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-semibold">{initial.id ? "Sửa công việc" : t("Thêm công việc", lang)}</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Tiêu đề *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Tiêu đề công việc..." />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              placeholder="Mô tả chi tiết..." />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-600">{t("Người phụ trách", lang)}</label>
              <input value={assigneeName} onChange={(e) => setAssigneeName(e.target.value)} maxLength={100}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Tên..." />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">{t("Hạn chót", lang)}</label>
              <DateInput value={dueDate} onChange={setDueDate}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-600">{t("Danh mục", lang)}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option value="">— Chọn —</option>
                {allCats.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Trạng thái</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option value="pending">{t("Chờ làm", lang)}</option>
                <option value="in_progress">{t("Đang làm", lang)}</option>
                <option value="done">{t("Hoàn thành", lang)}</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <input value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCat())}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="+ Danh mục mới..." />
            <button type="button" onClick={handleAddCat} className="text-xs px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200">Thêm</button>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex-1 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {t("Lưu", lang)}
            </button>
            <button type="button" onClick={onCancel} className="flex-1 py-2 text-sm font-medium bg-gray-100 rounded-lg hover:bg-gray-200">
              {t("Hủy", lang)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
