import type { TaskData } from "@/lib/task-api";
import { TaskCard } from "./task-card";
import { t } from "@/lib/i18n";

interface TaskAssigneeViewProps {
  tasks: TaskData[];
  token: string;
  assigneeName: string;
  onStatusChange: (taskId: string, status: string) => void;
  lang?: string;
}

export function TaskAssigneeView({ tasks, assigneeName, onStatusChange, lang = "vi" }: TaskAssigneeViewProps) {
  const pending = tasks.filter((t) => t.status === "pending");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const done = tasks.filter((t) => t.status === "done");

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-sm">{t("Chưa có công việc", lang)}</p>
      </div>
    );
  }

  const groups: [string, TaskData[]][] = [
    ["Đang làm", inProgress],
    ["Chờ làm", pending],
    ["Hoàn thành", done],
  ].filter(([, items]) => (items as TaskData[]).length > 0) as [string, TaskData[]][];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-xl p-4 text-center">
        <p className="text-xs text-blue-500 font-medium">{t("Người phụ trách", lang)}</p>
        <p className="text-lg font-bold text-blue-800 mt-1">{assigneeName}</p>
        <p className="text-xs text-blue-500 mt-1">
          {done.length}/{tasks.length} {t("Hoàn thành", lang).toLowerCase()}
        </p>
        <div className="mt-2 h-2 bg-blue-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${tasks.length > 0 ? Math.round((done.length / tasks.length) * 100) : 0}%` }}
          />
        </div>
      </div>

      {groups.map(([label, items]) => (
        <div key={label}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {t(label, lang)} ({items.length})
          </h3>
          <div className="space-y-2">
            {items.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isCouple={false}
                onStatusChange={onStatusChange}
                lang={lang}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
