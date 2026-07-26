/**
 * Honeymoon Planner
 * Main wrapper: header + tabbed sections (Overview, Packing, Tasks)
 */

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { honeymoonPackingItems } from "@/data/honeymoon-checklist";
import { HoneymoonOverview } from "./honeymoon-overview";
import { HoneymoonPackingList } from "./honeymoon-packing-list";
import { HoneymoonTasks } from "./honeymoon-tasks";
import { Plane, Luggage, ListChecks } from "lucide-react";
import type { HoneymoonState, HoneymoonTask } from "@/types/wedding";

interface HoneymoonPlannerProps {
  honeymoon: HoneymoonState;
  lang: "vi" | "en";
  onUpdate: (patch: Partial<HoneymoonState>) => void;
  onTogglePacking: (itemId: string) => void;
  onClearPacking: () => void;
  onAddTask: (task: Omit<HoneymoonTask, "id">) => void;
  onUpdateTask: (id: number, updates: Partial<HoneymoonTask>) => void;
  onRemoveTask: (id: number) => void;
}

export function HoneymoonPlanner({
  honeymoon,
  lang,
  onUpdate,
  onTogglePacking,
  onClearPacking,
  onAddTask,
  onUpdateTask,
  onRemoveTask,
}: HoneymoonPlannerProps) {
  const en = lang === "en";
  const packingTotal = honeymoonPackingItems.length;
  const packingCheckedCount = Object.values(honeymoon.packingChecked || {}).filter(Boolean).length;
  const tasksTotal = (honeymoon.tasks || []).length;
  const tasksDoneCount = (honeymoon.tasks || []).filter((t) => t.status === "done").length;

  return (
    <div className="space-y-4 py-2">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Plane className="w-6 h-6 text-sky-500" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-pink-600 bg-clip-text text-transparent">
            {en ? "Honeymoon Planner" : "Kế Hoạch Tuần Trăng Mật"}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {en
            ? "Plan your perfect post-wedding getaway"
            : "Lên kế hoạch cho chuyến đi trăng mật hoàn hảo"}
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="gap-1.5">
            <Plane className="w-4 h-4" />
            <span className="hidden sm:inline">{en ? "Overview" : "Tổng quan"}</span>
          </TabsTrigger>
          <TabsTrigger value="packing" className="gap-1.5">
            <Luggage className="w-4 h-4" />
            <span className="hidden sm:inline">{en ? "Packing" : "Đồ đạc"}</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-1.5">
            <ListChecks className="w-4 h-4" />
            <span className="hidden sm:inline">{en ? "Tasks" : "Công việc"}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <HoneymoonOverview
            honeymoon={honeymoon}
            lang={lang}
            packingCheckedCount={packingCheckedCount}
            packingTotal={packingTotal}
            tasksDoneCount={tasksDoneCount}
            tasksTotal={tasksTotal}
            onUpdate={onUpdate}
          />
        </TabsContent>

        <TabsContent value="packing" className="mt-4">
          <HoneymoonPackingList
            checkedItems={honeymoon.packingChecked || {}}
            lang={lang}
            onToggle={onTogglePacking}
            onClear={onClearPacking}
          />
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <HoneymoonTasks
            tasks={honeymoon.tasks || []}
            lang={lang}
            onAdd={onAddTask}
            onUpdate={onUpdateTask}
            onRemove={onRemoveTask}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
