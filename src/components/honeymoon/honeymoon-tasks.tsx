/**
 * Honeymoon Tasks
 * CRUD list for honeymoon prep (bookings, documents, activities)
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Plus, Trash2, CheckCircle2, Circle, Clock } from "lucide-react";
import type { HoneymoonTask, HoneymoonTaskCategory, HoneymoonTaskStatus } from "@/types/wedding";

interface HoneymoonTasksProps {
  tasks: HoneymoonTask[];
  lang: "vi" | "en";
  onAdd: (task: Omit<HoneymoonTask, "id">) => void;
  onUpdate: (id: number, updates: Partial<HoneymoonTask>) => void;
  onRemove: (id: number) => void;
}

const CATEGORY_META: Record<HoneymoonTaskCategory, { label: string; labelEn: string; icon: string; color: string }> = {
  booking: { label: "Đặt chỗ", labelEn: "Booking", icon: "🏨", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  document: { label: "Giấy tờ", labelEn: "Document", icon: "📄", color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
  prep: { label: "Chuẩn bị", labelEn: "Prep", icon: "🧳", color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
  activity: { label: "Hoạt động", labelEn: "Activity", icon: "🎟️", color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
  other: { label: "Khác", labelEn: "Other", icon: "📌", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

const STATUS_META: Record<HoneymoonTaskStatus, { label: string; labelEn: string }> = {
  todo: { label: "Cần làm", labelEn: "To do" },
  "in-progress": { label: "Đang làm", labelEn: "In progress" },
  done: { label: "Xong", labelEn: "Done" },
};

export function HoneymoonTasks({ tasks, lang, onAdd, onUpdate, onRemove }: HoneymoonTasksProps) {
  const en = lang === "en";
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<HoneymoonTaskCategory>("booking");
  const [dueDate, setDueDate] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      category,
      status: "todo",
      dueDate: dueDate || undefined,
    });
    setTitle("");
    setDueDate("");
    setCategory("booking");
  };

  const cycleStatus = (task: HoneymoonTask) => {
    const next: HoneymoonTaskStatus =
      task.status === "todo" ? "in-progress" : task.status === "in-progress" ? "done" : "todo";
    onUpdate(task.id, { status: next });
  };

  const sorted = [...tasks].sort((a, b) => {
    const order: Record<HoneymoonTaskStatus, number> = { todo: 0, "in-progress": 1, done: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
  });

  return (
    <div className="space-y-4">
      {/* Add form */}
      <Card>
        <CardContent className="pt-5 space-y-3">
          <div className="flex gap-2">
            <Input
              value={title}
              placeholder={en ? "Add a honeymoon task…" : "Thêm công việc tuần trăng mật…"}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button size="icon" onClick={handleAdd} title={en ? "Add" : "Thêm"}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as HoneymoonTaskCategory)}
              className="w-[150px]"
            >
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.icon} {en ? meta.labelEn : meta.label}
                </option>
              ))}
            </Select>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-[170px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Task list */}
      {sorted.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            {en ? "No tasks yet. Add your first one above." : "Chưa có công việc. Thêm công việc đầu tiên ở trên."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sorted.map((task) => {
            const cat = CATEGORY_META[task.category];
            const isDone = task.status === "done";
            const isInProgress = task.status === "in-progress";
            return (
              <Card key={task.id} className={isDone ? "opacity-60" : ""}>
                <CardContent className="pt-3 pb-3 flex items-center gap-3">
                  <button onClick={() => cycleStatus(task)} className="shrink-0 mt-0.5" title={STATUS_META[task.status][en ? "labelEn" : "label"]}>
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : isInProgress ? (
                      <Clock className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-medium text-sm ${isDone ? "line-through" : ""}`}>{task.title}</span>
                      <Badge variant="secondary" className={`text-xs ${cat.color}`}>
                        {cat.icon} {en ? cat.labelEn : cat.label}
                      </Badge>
                      {task.dueDate && (
                        <Badge variant="outline" className="text-xs">
                          📅 {task.dueDate}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemove(task.id)}
                    title={en ? "Delete" : "Xóa"}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
