/**
 * Wedding Day Emergency Kit Panel
 * Interactive checklist for emergency items preparation
 */

import { useState } from "react";
import { emergencyKitItems, categoryInfo, priorityInfo } from "@/data/emergency-kit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Package, AlertCircle } from "lucide-react";
import { Select } from "@/components/ui/select";

interface EmergencyKitPanelProps {
  checkedItems: Record<string, boolean>;
  onToggleItem: (itemId: string) => void;
  onClearChecklist: () => void;
  lang?: string;
}

export function EmergencyKitPanel({ checkedItems, onToggleItem, onClearChecklist, lang = "vi" }: EmergencyKitPanelProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const filteredItems = emergencyKitItems.filter(item => {
    const categoryMatch = filterCategory === "all" || item.category === filterCategory;
    const priorityMatch = filterPriority === "all" || item.priority === filterPriority;
    return categoryMatch && priorityMatch;
  });

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = emergencyKitItems.length;
  const progressPercent = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const essentialChecked = emergencyKitItems
    .filter(item => item.priority === "essential")
    .filter(item => checkedItems[item.id]).length;

  const essentialTotal = emergencyKitItems.filter(item => item.priority === "essential").length;

  const handleReset = () => {
    if (confirm(lang === "vi" ? "Bạn có chắc muốn xóa hết checklist?" : "Are you sure you want to clear the checklist?")) {
      onClearChecklist();
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {lang === "vi" ? "Bộ Đồ Khẩn Cấp Ngày Cưới" : "Wedding Day Emergency Kit"}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {lang === "vi" ? "Chuẩn bị cho mọi tình huống khẩn cấp" : "Prepare for any emergency situation"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{checkedCount}/{totalCount}</div>
              <div className="text-xs text-muted-foreground">
                {lang === "vi" ? "đã chuẩn bị" : "prepared"}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={progressPercent} className="h-2" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-muted-foreground">
                  {lang === "vi" ? "Bắt buộc:" : "Essential:"} {essentialChecked}/{essentialTotal}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {progressPercent === 100 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : progressPercent >= 50 ? (
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-muted-foreground">
                  {progressPercent === 100
                    ? (lang === "vi" ? "Đã sẵn sàng!" : "Ready!")
                    : `${progressPercent.toFixed(0)}% ${lang === "vi" ? "hoàn thành" : "complete"}`
                  }
                </span>
              </div>
            </div>

            {progressPercent < 100 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">
                    {lang === "vi" ? "Lời khuyên:" : "Tip:"}
                  </span>
                </div>
                <p className="text-amber-700 mt-1 text-xs">
                  {lang === "vi"
                    ? "Ưu tiên chuẩn bị các mục 'Bắt buộc' trước, sau đó thêm 'Khuyên dùng' theo nhu cầu."
                    : "Prioritize 'Essential' items first, then add 'Recommended' items as needed."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full sm:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">{lang === "vi" ? "Tất cả danh mục" : "All Categories"}</option>
          {Object.entries(categoryInfo).map(([key, info]) => (
            <option key={key} value={key}>
              {info.icon} {lang === "vi" ? info.name : info.nameEn}
            </option>
          ))}
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="w-full sm:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">{lang === "vi" ? "Tất cả mức độ" : "All Priorities"}</option>
          {Object.entries(priorityInfo).map(([key, info]) => (
            <option key={key} value={key}>
              {info.icon} {lang === "vi" ? info.name : info.nameEn}
            </option>
          ))}
        </select>

        <Button variant="outline" size="icon" onClick={handleReset} title={lang === "vi" ? "Xóa hết" : "Clear all"}>
          <Package className="h-4 w-4" />
        </Button>
      </div>

      {/* Items Grid by Category */}
      <div className="space-y-6">
        {Object.entries(categoryInfo).map(([categoryKey, categoryInfo]) => {
          const categoryItems = filteredItems.filter(item => item.category === categoryKey);
          if (categoryItems.length === 0) return null;

          const categoryCheckedCount = categoryItems.filter(item => checkedItems[item.id]).length;

          return (
            <div key={categoryKey}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{categoryInfo.icon}</span>
                <h3 className="text-lg font-semibold">
                  {lang === "vi" ? categoryInfo.name : categoryInfo.nameEn}
                </h3>
                <Badge variant="secondary" className="ml-auto">
                  {categoryCheckedCount}/{categoryItems.length}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryItems.map(item => {
                  const priority = getPriorityInfo(item.priority);
                  const isChecked = checkedItems[item.id];

                  return (
                    <Card
                      key={item.id}
                      className={`transition-all cursor-pointer hover:shadow-md ${isChecked ? 'border-green-200 bg-green-50/50' : ''}`}
                      onClick={() => onToggleItem(item.id)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isChecked}
                            onChange={() => onToggleItem(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-medium ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                                {lang === "vi" ? item.name : item.nameEn}
                              </span>
                              <Badge className={`text-xs ${priority.color}`}>
                                {priority.icon} {lang === "vi" ? priority.name : priority.nameEn}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {lang === "vi" ? item.description : item.descriptionEn}
                            </p>
                            {item.quantity && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {lang === "vi" ? "Số lượng:" : "Quantity:"} {item.quantity}
                              </div>
                            )}
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

      {/* Info Card */}
      <Card className="bg-muted">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">
              {lang === "vi" ? "💡 Mẹo chuẩn bị bộ đồ khẩn cấp:" : "💡 Emergency Kit Preparation Tips:"}
            </p>
            <ul className="space-y-1 text-xs">
              <li>• {lang === "vi"
                ? "Chia nhỏ bộ đồ: một cho đội dâu, một cho đội rể"
                : "Split the kit: one for bride's team, one for groom's team"}</li>
              <li>• {lang === "vi"
                ? "Để trong hộp nhỏ dễ mang theo"
                : "Pack in a small, portable container"}</li>
              <li>• {lang === "vi"
                ? "Kiểm tra trước 1 tuần và bổ sung thiếu"
                : "Check 1 week before and replenish missing items"}</li>
              <li>• {lang === "vi"
                ? "Giao cho người đáng tin cậy mang theo"
                : "Assign a trusted person to carry it"}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
