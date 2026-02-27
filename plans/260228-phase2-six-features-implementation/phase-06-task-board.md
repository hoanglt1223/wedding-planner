---
phase: "06"
title: "Collaborative Task Board"
status: complete
priority: P2
effort: 3-4 days
completed: 2026-02-28
---

# Phase 06: Collaborative Task Board

## Context Links
- [plan.md](./plan.md)
- [phase-01-foundation.md](./phase-01-foundation.md)
- [researcher-02 report](../260227-phase2-features-brainstorm/research/researcher-02-taskboard-website-countdown.md)
- [RSVP pattern](../../api/rsvp.ts) — token-based access reference

## Parallelization Info
- **Group:** Parallel (02-07)
- **Dependencies:** Phase 01 (DB schema `wedding_tasks`, routes, task board settings, i18n)
- **Can run with:** Phases 02, 03, 04, 05, 07
- **No file conflicts** — creates files in `src/components/tasks/`, `src/pages/`, `api/tasks/`

## Overview
Family task delegation system. Couple creates tasks and assigns to family members. Each assignee gets a unique token-based link to view and complete their tasks. Couple sees full board with progress tracking. Reuses RSVP nanoid token pattern for frictionless access.

## Key Insights
- DB-backed (not localStorage): tasks need to be accessible by multiple users
- Token pattern: each assignee gets unique nanoid token (reuse RSVP pattern)
- Simple 3-state workflow: pending -> in_progress -> done
- List view preferred (kanban is overkill for family task management)
- No real-time updates in MVP — poll on page load
- Categories: user-defined (e.g., "Trang tri", "Le vat", "Hau can")
- Couple view: grouped by assignee or status
- Family view: filtered to assignee's tasks only

## Requirements

### Functional
- **Couple dashboard** (within app):
  - CRUD for tasks: title, description, assignee, due date, category, status
  - View all tasks grouped by assignee or status
  - Generate unique links per assignee (nanoid tokens)
  - Progress overview: X/Y tasks completed per assignee
  - QR code for each assignee link
- **Family member page** (`#/tasks/:token`):
  - View assigned tasks
  - Update task status (pending -> in_progress -> done)
  - No auth required; token-based access
- **API endpoints**:
  - `GET /api/tasks?userId=X` — fetch all tasks for couple
  - `POST /api/tasks` — create task
  - `PATCH /api/tasks` — update task (status, details)
  - `DELETE /api/tasks` — delete task
  - `GET /api/tasks?token=X` — fetch tasks for assignee
  - `PATCH /api/tasks/status` — assignee updates status

### Non-Functional
- Rate limiting: 30 req/min per userId/token
- Max 200 tasks per wedding
- All files < 200 lines

## Architecture

```
Couple view: within App (page-router or cards panel)
  └── TaskBoardDashboard (src/components/tasks/task-board-dashboard.tsx)
        ├── task-list-view.tsx         — grouped task list
        ├── task-card.tsx              — single task display
        ├── task-form.tsx              — create/edit modal
        ├── task-assignee-links.tsx    — generate/manage assignee tokens
        └── task-progress-bar.tsx      — per-assignee progress

Family view: #/tasks/:token
  └── TaskLandingPage (src/pages/task-landing-page.tsx)
        └── task-assignee-view.tsx     — filtered task list for assignee

API:
  └── api/tasks.ts                    — single handler routing by method/action
```

## Related Code Files (Full Paths)

**Reads (does NOT edit):**
- `D:\Projects\wedding-planner\src\types\wedding.ts` — `TaskBoardSettings`, `WeddingState`
- `D:\Projects\wedding-planner\src\hooks\use-wedding-store.ts` — `setTaskBoardSettings()`
- `D:\Projects\wedding-planner\src\db\schema.ts` — `weddingTasks` table
- `D:\Projects\wedding-planner\src\db\index.ts` — `createDb()`
- `D:\Projects\wedding-planner\src\lib\redis.ts` — `createRedis()`
- `D:\Projects\wedding-planner\src\lib\i18n.ts` — `t()`
- `D:\Projects\wedding-planner\api\rsvp.ts` — reference for token pattern

**CREATES (exclusive):**
- `D:\Projects\wedding-planner\src\pages\task-landing-page.tsx`
- `D:\Projects\wedding-planner\src\components\tasks\task-board-dashboard.tsx`
- `D:\Projects\wedding-planner\src\components\tasks\task-list-view.tsx`
- `D:\Projects\wedding-planner\src\components\tasks\task-card.tsx`
- `D:\Projects\wedding-planner\src\components\tasks\task-form.tsx`
- `D:\Projects\wedding-planner\src\components\tasks\task-assignee-links.tsx`
- `D:\Projects\wedding-planner\src\components\tasks\task-assignee-view.tsx`
- `D:\Projects\wedding-planner\src\components\tasks\task-progress-bar.tsx`
- `D:\Projects\wedding-planner\src\lib\task-api.ts`
- `D:\Projects\wedding-planner\api\tasks.ts`

## File Ownership (EXCLUSIVE)

| File | Action |
|------|--------|
| `src/pages/task-landing-page.tsx` | CREATE — default export, lazy-loaded from main.tsx |
| `src/components/tasks/task-board-dashboard.tsx` | CREATE |
| `src/components/tasks/task-list-view.tsx` | CREATE |
| `src/components/tasks/task-card.tsx` | CREATE |
| `src/components/tasks/task-form.tsx` | CREATE |
| `src/components/tasks/task-assignee-links.tsx` | CREATE |
| `src/components/tasks/task-assignee-view.tsx` | CREATE |
| `src/components/tasks/task-progress-bar.tsx` | CREATE |
| `src/lib/task-api.ts` | CREATE — client API helpers |
| `api/tasks.ts` | CREATE — serverless handler |

## Implementation Steps

### 1. Create `api/tasks.ts`

Serverless handler with method routing:
```typescript
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS, rate limiting

  // GET ?userId=X — couple fetches all tasks
  //   SELECT * FROM wedding_tasks WHERE user_id = X ORDER BY created_at
  //   Return { tasks: [] }

  // GET ?token=X — family member fetches their tasks
  //   SELECT * FROM wedding_tasks WHERE assignee_token = X
  //   Return { tasks: [], assigneeName }

  // POST — create task
  //   Body: { userId, title, description, assigneeName, dueDate, category }
  //   Generate assigneeToken via nanoid(12) if assigneeName provided
  //   INSERT INTO wedding_tasks
  //   Return { task }

  // PATCH ?action=update — couple updates task
  //   Body: { userId, taskId, title?, description?, assigneeName?, dueDate?, category?, status? }
  //   Validate userId matches task.userId
  //   UPDATE wedding_tasks

  // PATCH ?action=status — assignee updates status
  //   Body: { token, taskId, status }
  //   Validate token matches task.assigneeToken
  //   UPDATE status + completedAt if status="done"

  // DELETE — couple deletes task
  //   Body: { userId, taskId }
  //   Validate userId matches task.userId
  //   DELETE FROM wedding_tasks
}
```
Max ~180 lines. Split into `api/tasks/create.ts`, `api/tasks/update.ts` etc. if needed.

### 2. Create `src/lib/task-api.ts`

Client API helpers:
```typescript
export interface TaskData { id: string; title: string; description: string; assigneeName: string; assigneeToken: string; dueDate: string; category: string; status: string; createdAt: string; completedAt: string | null; }

export async function fetchTasks(userId: string): Promise<TaskData[]>;
export async function fetchAssigneeTasks(token: string): Promise<{ tasks: TaskData[]; assigneeName: string }>;
export async function createTask(userId: string, task: Partial<TaskData>): Promise<TaskData>;
export async function updateTask(userId: string, taskId: string, updates: Partial<TaskData>): Promise<void>;
export async function updateTaskStatus(token: string, taskId: string, status: string): Promise<void>;
export async function deleteTask(userId: string, taskId: string): Promise<void>;
```
Max ~80 lines.

### 3. Create `src/components/tasks/task-board-dashboard.tsx`

Couple's main dashboard:
- Fetch tasks on mount via `fetchTasks(userId)`
- Tabs: "By Status" / "By Assignee"
- "Add Task" button
- "Generate Links" button
- Task count summary
- Max ~100 lines

### 4. Create `src/components/tasks/task-list-view.tsx`

Grouped task list:
- Props: `{ tasks, groupBy: "status" | "assignee", onEdit, onDelete, onStatusChange, lang }`
- Group headers with count
- Maps tasks to `TaskCard`
- Max ~80 lines

### 5. Create `src/components/tasks/task-card.tsx`

Single task display:
- Title, description snippet, assignee, due date, category badge, status badge
- Status color: pending=gray, in_progress=blue, done=green
- Overdue indicator (due date < today && status != done)
- Edit/Delete buttons (couple view only)
- Status toggle (both views)
- Max ~80 lines

### 6. Create `src/components/tasks/task-form.tsx`

Create/Edit task modal:
- Fields: title, description (textarea), assignee name, due date (date picker), category (select from taskBoardSettings.categories), status (select)
- Category management: add custom categories inline
- Validation: title required
- Max ~120 lines

### 7. Create `src/components/tasks/task-assignee-links.tsx`

Assignee link management:
- List unique assignees from tasks with their tokens
- For each: display name, task count, copy link button, QR code button
- Generate new link for un-tokened assignees
- Uses existing `qrcode` library (same as RSVP)
- Max ~80 lines

### 8. Create `src/components/tasks/task-assignee-view.tsx`

Family member's filtered view:
- Shows only tasks for this assignee
- Can change status: pending -> in_progress -> done
- Read-only for other fields
- Shows due dates with overdue highlighting
- Max ~80 lines

### 9. Create `src/pages/task-landing-page.tsx`

Guest-facing task page (default export, lazy-loaded):
```typescript
export default function TaskLandingPage({ token }: { token: string }) {
  // Fetch tasks by token
  // Show loading/error states
  // Render TaskAssigneeView
  // Apply theme from wedding data (optional - use neutral theme)
}
```
Max ~80 lines.

### 10. Create `src/components/tasks/task-progress-bar.tsx`

Per-assignee progress indicator:
- Shows: X/Y tasks done
- Visual progress bar
- Color: green when all done
- Max ~40 lines

## Todo List

- [x] Create `api/tasks.ts` with all CRUD operations
- [x] Create `src/lib/task-api.ts` with client helpers
- [x] Create `src/pages/task-landing-page.tsx` (default export)
- [x] Create `src/components/tasks/task-board-dashboard.tsx`
- [x] Create `src/components/tasks/task-list-view.tsx`
- [x] Create `src/components/tasks/task-card.tsx`
- [x] Create `src/components/tasks/task-form.tsx`
- [x] Create `src/components/tasks/task-assignee-links.tsx`
- [x] Create `src/components/tasks/task-assignee-view.tsx`
- [x] Create `src/components/tasks/task-progress-bar.tsx`
- [x] Test: couple can create/edit/delete tasks
- [x] Test: assignee can view and update task status
- [x] Test: token-based access works
- [x] Test: grouping by status and assignee works
- [x] Test: rate limiting works
- [x] Build check passes

## Success Criteria

- Couple can CRUD tasks from dashboard
- Each assignee gets unique token link
- Family member can view assigned tasks via `#/tasks/:token`
- Family member can update task status (pending -> in_progress -> done)
- Task board shows progress per assignee
- QR codes generate correctly for assignee links
- Rate limiting prevents abuse
- Max 200 tasks per wedding enforced
- All files < 200 lines

## Conflict Prevention

- Only creates files in `src/components/tasks/`, `src/pages/`, `src/lib/`, `api/`
- Route in main.tsx already added by Phase 01
- DB table already created by Phase 01
- No shared file edits

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Token collision | Very Low | nanoid(12) has ~10^21 possible values |
| Concurrent status updates | Low | Last-write-wins acceptable for MVP |
| Task board within app — where to put it? | Medium | Add as page nav item or within "ideas"/"cards" panel. Decision: add to PAGES array or use page-router switch. See integration note below. |
| API too large for single file | Medium | Split into separate files under `api/tasks/` if > 200 lines |

### Integration Note
The task board dashboard needs a way to be accessed by the couple. Options:
1. **New top-level page** — add to PAGES in page-definitions.ts and page-router.tsx (requires Phase 01 edit)
2. **Sub-tab of planning page** — add another EXTRA_TAB
3. **Within cards panel** — next to RSVP settings

**Recommendation:** Add as EXTRA_TAB in planning page (Phase 01 already handles this) OR as a new case in page-router. For simplicity, we can have Phase 01 add a "tasks" page entry and page-router case that renders `<TaskBoardDashboard>`.

**Resolution:** Phase 01 should add `{ id: "tasks", label: "📋 Công Việc" }` to PAGES and a `case "tasks"` in page-router.tsx. This allows the task board to be a top-level page accessible from the main nav.

## Security Considerations
- Token-based access: assignee tokens are unique per user
- userId validation: couple operations verify userId matches task owner
- Rate limiting: 30 req/min per userId/token
- Input sanitization: title and description trimmed and length-limited (200/1000 chars)
- No SQL injection: Drizzle ORM parameterizes all queries
- Status validation: only accept "pending", "in_progress", "done"
