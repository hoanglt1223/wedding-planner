import { useState, useEffect, useCallback } from "react";
import type { TaskData } from "@/lib/task-api";
import { fetchAssigneeTasks, updateTaskStatus } from "@/lib/task-api";
import { TaskAssigneeView } from "@/components/tasks/task-assignee-view";

interface Props {
  token: string;
}

export default function TaskLandingPage({ token }: Props) {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [assigneeName, setAssigneeName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchAssigneeTasks(token);
      setTasks(result.tasks);
      setAssigneeName(result.assigneeName);
    } catch {
      setError("Không tìm thấy danh sách công việc. Link không hợp lệ hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { void load(); }, [load]);

  async function handleStatusChange(taskId: string, status: string) {
    setStatusError("");
    try {
      await updateTaskStatus(token, taskId, status);
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status, completedAt: status === "done" ? new Date().toISOString() : null } : t));
    } catch {
      setStatusError("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">📋 Công Việc Của Tôi</h1>
          <p className="text-xs text-gray-400 mt-1">Danh sách công việc được giao</p>
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-400">
            <div className="animate-spin text-3xl mb-3">⏳</div>
            <p className="text-sm">Đang tải...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-4xl mb-3">❌</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {statusError && (
              <p className="text-xs text-red-500 mb-3 text-center">{statusError}</p>
            )}
            <TaskAssigneeView
              tasks={tasks}
              token={token}
              assigneeName={assigneeName}
              onStatusChange={handleStatusChange}
            />
          </>
        )}

        <p className="text-center text-xs text-gray-300 mt-8">
          💍 Wedding Planner
        </p>
      </div>
    </div>
  );
}
