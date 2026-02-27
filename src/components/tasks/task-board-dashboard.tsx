import { useState, useEffect, useCallback } from "react";
import type { WeddingState } from "@/types/wedding";
import type { WeddingStore } from "@/hooks/use-wedding-store";
import type { TaskData } from "@/lib/task-api";
import { fetchTasks, createTask, updateTask, deleteTask } from "@/lib/task-api";
import { TaskListView } from "./task-list-view";
import { TaskForm } from "./task-form";
import { TaskAssigneeLinks } from "./task-assignee-links";
import { TaskProgressBar } from "./task-progress-bar";
import { t } from "@/lib/i18n";

interface Props {
  state: WeddingState;
  store: WeddingStore;
  userId?: string;
}

export default function TaskBoardDashboard({ state, store, userId }: Props) {
  const lang = state.lang;
  const categories = state.taskBoardSettings?.categories ?? [];
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [groupBy, setGroupBy] = useState<"status" | "assignee">("status");
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<TaskData | null>(null);
  const [showLinks, setShowLinks] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await fetchTasks(userId);
      setTasks(data);
    } catch { setError("Không tải được danh sách"); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { void load(); }, [load]);

  async function handleSave(data: Partial<TaskData>) {
    if (!userId) return;
    try {
      if (editTask) {
        await updateTask(userId, editTask.id, data);
        // Update categories if new one added
        if (data.category && !categories.includes(data.category)) {
          store.setTaskBoardSettings({ categories: [...categories, data.category] });
        }
      } else {
        await createTask(userId, data);
        if (data.category && !categories.includes(data.category)) {
          store.setTaskBoardSettings({ categories: [...categories, data.category] });
        }
      }
      setShowForm(false);
      setEditTask(null);
      await load();
    } catch { setError("Lưu thất bại"); }
  }

  async function handleDelete(taskId: string) {
    if (!userId || !confirm("Xóa công việc này?")) return;
    try { await deleteTask(userId, taskId); await load(); }
    catch { setError("Xóa thất bại"); }
  }

  async function handleStatusChange(taskId: string, status: string) {
    if (!userId) return;
    try {
      await updateTask(userId, taskId, { status });
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status } : t));
    } catch { setError("Cập nhật thất bại"); }
  }

  // Per-assignee progress
  const assigneeProgress = [...new Set(tasks.map((t) => t.assigneeName).filter(Boolean) as string[])]
    .map((name) => {
      const mine = tasks.filter((t) => t.assigneeName === name);
      return { name, done: mine.filter((t) => t.status === "done").length, total: mine.length };
    });

  const totalDone = tasks.filter((t) => t.status === "done").length;

  if (!userId) return <div className="p-4 text-sm text-gray-500">Vui lòng đăng nhập để dùng bảng công việc.</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">{t("Bảng công việc", lang)}</h2>
          <p className="text-xs text-gray-500">{totalDone}/{tasks.length} hoàn thành</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowLinks(!showLinks)}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
            🔗 {t("Tạo link cho thành viên", lang)}
          </button>
          <button type="button" onClick={() => { setEditTask(null); setShowForm(true); }}
            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + {t("Thêm công việc", lang)}
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {showLinks && <TaskAssigneeLinks tasks={tasks} lang={lang} />}

      {assigneeProgress.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
          {assigneeProgress.map((ap) => (
            <TaskProgressBar key={ap.name} assigneeName={ap.name} done={ap.done} total={ap.total} />
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {(["status", "assignee"] as const).map((g) => (
          <button key={g} type="button" onClick={() => setGroupBy(g)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium ${groupBy === g ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            {g === "status" ? "Theo trạng thái" : "Theo người"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-sm text-gray-400 py-8">{t("Đang tải...", lang)}</p>
      ) : (
        <TaskListView tasks={tasks} groupBy={groupBy} onEdit={(task) => { setEditTask(task); setShowForm(true); }}
          onDelete={handleDelete} onStatusChange={handleStatusChange} lang={lang} />
      )}

      {showForm && (
        <TaskForm
          initial={editTask ?? {}}
          categories={categories}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTask(null); }}
          lang={lang}
        />
      )}
    </div>
  );
}
