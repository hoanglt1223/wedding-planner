/**
 * Honeymoon Packing List
 * Categorized, toggleable checklist of honeymoon essentials
 */

import { useState } from "react";
import {
  honeymoonPackingItems,
  honeymoonCategoryInfo,
  honeymoonPriorityInfo,
} from "@/data/honeymoon-checklist";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Luggage, RotateCcw } from "lucide-react";

interface HoneymoonPackingListProps {
  checkedItems: Record<string, boolean>;
  lang: "vi" | "en";
  onToggle: (itemId: string) => void;
  onClear: () => void;
}

export function HoneymoonPackingList({
  checkedItems,
  lang,
  onToggle,
  onClear,
}: HoneymoonPackingListProps) {
  const en = lang === "en";
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filtered = honeymoonPackingItems.filter(
    (item) => filterCategory === "all" || item.category === filterCategory,
  );

  const totalCount = honeymoonPackingItems.length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPct = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const getPriority = (priority: string) =>
    honeymoonPriorityInfo[priority as keyof typeof honeymoonPriorityInfo] || honeymoonPriorityInfo.optional;

  const handleClear = () => {
    if (checkedCount === 0) return;
    if (confirm(en ? "Reset packing list?" : "Đặt lại danh sách đóng gói?")) onClear();
  };

  return (
    <div className="space-y-4">
      <Card className="border-2">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Luggage className="w-5 h-5 text-pink-500" />
              <span className="font-semibold">{en ? "Packing List" : "Danh Sách Đóng Gói"}</span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{checkedCount}/{totalCount}</div>
            </div>
          </div>
          <Progress value={progressPct} className="h-2" />
        </CardContent>
      </Card>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filterCategory === "all" ? "default" : "outline"}
          onClick={() => setFilterCategory("all")}
        >
          {en ? "All" : "Tất cả"}
        </Button>
        {Object.entries(honeymoonCategoryInfo).map(([key, info]) => (
          <Button
            key={key}
            size="sm"
            variant={filterCategory === key ? "default" : "outline"}
            onClick={() => setFilterCategory(key)}
          >
            {info.icon} {en ? info.nameEn : info.name}
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={handleClear} title={en ? "Reset" : "Đặt lại"}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Items grouped by category */}
      {Object.entries(honeymoonCategoryInfo)
        .filter(([categoryKey]) => filtered.some((item) => item.category === categoryKey))
        .map(([categoryKey, catInfo]) => {
          const items = filtered.filter((item) => item.category === categoryKey);
          const catChecked = items.filter((item) => checkedItems[item.id]).length;
          return (
            <div key={categoryKey}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{catInfo.icon}</span>
                <h3 className="font-semibold">{en ? catInfo.nameEn : catInfo.name}</h3>
                <Badge variant="secondary" className="ml-auto">{catChecked}/{items.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {items.map((item) => {
                  const priority = getPriority(item.priority);
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <Card
                      key={item.id}
                      className={`transition-all cursor-pointer hover:shadow-md ${isChecked ? "border-green-200 bg-green-50/50 dark:bg-green-950/20" : ""}`}
                      onClick={() => onToggle(item.id)}
                    >
                      <CardContent className="pt-3 pb-3">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isChecked}
                            onChange={() => onToggle(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-medium text-sm ${isChecked ? "line-through text-muted-foreground" : ""}`}>
                                {en ? item.nameEn : item.name}
                              </span>
                              <Badge variant="outline" className={`text-xs ${priority.color}`}>
                                {priority.icon} {en ? priority.nameEn : priority.name}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {en ? item.descriptionEn : item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
