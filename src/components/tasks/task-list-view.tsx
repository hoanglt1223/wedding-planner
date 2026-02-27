import type { TaskData } from "@/lib/task-api";
import { TaskCard } from "./task-card";
import { t } from "@/lib/i18n";

interface TaskListViewProps {
  tasks: TaskData[];
  groupBy: "status" | "assignee";
  onEdit: (task: TaskData) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: string) => void;
  lang?: string;
}

const STATUS_ORDER = ["pending", "in_progress", "done"];
const STATUS_LABELS: Record<string, string> = { pending: "Chờ làm", in_progress: "Đang làm", done: "Hoàn thành" };

function groupTasks(tasks: TaskData[], groupBy: "status" | "assignee"): [string, TaskData[]][] {
  const map = new Map<string, TaskData[]>();

  if (groupBy === "status") {
    for (const s of STATUS_ORDER) map.set(s, []);
    for (const t of tasks) {
      const key = t.status ?? "pending";
      map.get(key)?.push(t);
    }
  } else {
    for (const task of tasks) {
      const key = task.assigneeName ?? "—";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(task);
    }
  }

  return [...map.entries()].filter(([, items]) => items.length > 0);
}

export function TaskListView({ tasks, groupBy, onEdit, onDelete, onStatusChange, lang = "vi" }: TaskListViewProps) {
  if (tasks.length === 0) {
    return <p className="text-center text-sm text-gray-400 py-8">{t("Chưa có công việc", lang)}</p>;
  }

  const groups = groupTasks(tasks, groupBy);

  return (
    <div className="space-y-4">
      {groups.map(([key, items]) => (
        <div key={key}>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {groupBy === "status" ? t(STATUS_LABELS[key] ?? key, lang) : key}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2">{items.length}</span>
          </div>
          <div className="space-y-2">
            {items.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isCouple
                onEdit={onEdit}
                onDelete={onDelete}
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
