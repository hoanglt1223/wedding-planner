import type { TaskData } from "@/lib/task-api";
import { t } from "@/lib/i18n";

interface TaskCardProps {
  task: TaskData;
  isCouple?: boolean;
  onEdit?: (task: TaskData) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: string) => void;
  lang?: string;
}

const STATUS_NEXT: Record<string, string> = { pending: "in_progress", in_progress: "done", done: "pending" };
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};
const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ làm",
  in_progress: "Đang làm",
  done: "Hoàn thành",
};

function isOverdue(dueDate: string | null, status: string): boolean {
  if (!dueDate || status === "done") return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export function TaskCard({ task, isCouple = false, onEdit, onDelete, onStatusChange, lang = "vi" }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className={`bg-white border rounded-lg p-3 space-y-2 ${overdue ? "border-red-300" : "border-gray-200"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{task.title}</p>
          {task.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{task.description}</p>
          )}
        </div>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[task.status] ?? STATUS_COLORS.pending}`}>
          {t(STATUS_LABELS[task.status] ?? "Chờ làm", lang)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        {task.assigneeName && (
          <span>👤 {task.assigneeName}</span>
        )}
        {task.dueDate && (
          <span className={overdue ? "text-red-600 font-medium" : ""}>
            📅 {task.dueDate}{overdue ? " ⚠️" : ""}
          </span>
        )}
        {task.category && (
          <span className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">
            {task.category}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {onStatusChange && (
          <button
            type="button"
            onClick={() => onStatusChange(task.id, STATUS_NEXT[task.status] ?? "pending")}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded font-medium"
          >
            → {t(STATUS_LABELS[STATUS_NEXT[task.status] ?? "pending"] ?? "Chờ làm", lang)}
          </button>
        )}
        {isCouple && onEdit && (
          <button type="button" onClick={() => onEdit(task)} className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded">
            ✏️
          </button>
        )}
        {isCouple && onDelete && (
          <button type="button" onClick={() => onDelete(task.id)} className="text-xs px-2 py-1 text-red-500 hover:bg-red-50 rounded">
            {t("Xóa", lang)}
          </button>
        )}
      </div>
    </div>
  );
}
