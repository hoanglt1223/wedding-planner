export interface TaskData {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  assigneeName: string | null;
  assigneeToken: string | null;
  dueDate: string | null;
  category: string | null;
  status: string;
  createdAt: string;
  completedAt: string | null;
}

async function apiFetch(url: string, options?: RequestInit): Promise<unknown> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchTasks(userId: string): Promise<TaskData[]> {
  const data = await apiFetch(`/api/tasks?userId=${encodeURIComponent(userId)}`) as { tasks: TaskData[] };
  return data.tasks;
}

export async function fetchAssigneeTasks(token: string): Promise<{ tasks: TaskData[]; assigneeName: string }> {
  const data = await apiFetch(`/api/tasks?token=${encodeURIComponent(token)}`) as { tasks: TaskData[]; assigneeName: string };
  return { tasks: data.tasks, assigneeName: data.assigneeName };
}

export async function createTask(userId: string, task: Partial<TaskData>): Promise<TaskData> {
  const data = await apiFetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...task }),
  }) as { task: TaskData };
  return data.task;
}

export async function updateTask(userId: string, taskId: string, updates: Partial<TaskData>): Promise<void> {
  await apiFetch("/api/tasks?action=update", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, taskId, ...updates }),
  });
}

export async function updateTaskStatus(token: string, taskId: string, status: string): Promise<void> {
  await apiFetch("/api/tasks?action=status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, taskId, status }),
  });
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  await apiFetch("/api/tasks", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, taskId }),
  });
}
