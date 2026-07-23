import { useState, useMemo } from "react";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MenuItem } from "@/types/wedding";

interface GuestMealAssignment {
  guestId: number;
  guestName: string;
  dietary: string;
  assignedMenuId: number | null;
  side: string;
  tableGroup: string;
}

interface CatererReport {
  menuItem: string;
  dietaryType: string;
  count: number;
  notes: string[];
}

export function GuestMealAssignmentPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const lang = (state.lang === "en" ? "en" : "vi") as "vi" | "en";

  const [view, setView] = useState<"assign" | "report">("assign");

  const guests = state.guests || [];
  const menuItems = state.menuItems || [];

  // Get or create meal assignments from state
  const mealAssignments = useMemo(() => {
    const assignments = state.guestMealAssignments || {};
    return guests.map(guest => ({
      guestId: guest.id,
      guestName: guest.name,
      dietary: guest.dietary || "",
      assignedMenuId: assignments[guest.id] || null,
      side: guest.side,
      tableGroup: guest.tableGroup || ""
    }));
  }, [guests, state.guestMealAssignments]);

  // Group menu items by course type
  const menuByCourse = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    menuItems.forEach(item => {
      if (!grouped[item.courseType]) {
        grouped[item.courseType] = [];
      }
      grouped[item.courseType].push(item);
    });
    return grouped;
  }, [menuItems]);

  // Filter guests by side
  const guestsBySide = useMemo(() => {
    const brideSide = mealAssignments.filter(g => g.side === "bride" || g.side === "nữ");
    const groomSide = mealAssignments.filter(g => g.side === "groom" || g.side === "nam");
    const both = mealAssignments.filter(g => !g.side || g.side === "both" || g.side === "cả hai");
    return { brideSide, groomSide, both };
  }, [mealAssignments]);

  // Generate caterer report
  const catererReport = useMemo(() => {
    const report: Record<string, CatererReport> = {};

    mealAssignments.forEach(assignment => {
      if (assignment.assignedMenuId !== null) {
        const menuItem = menuItems.find(m => m.id === assignment.assignedMenuId);
        if (menuItem) {
          const key = `${menuItem.id}-${menuItem.dietary.join("-")}`;
          if (!report[key]) {
            report[key] = {
              menuItem: menuItem.name,
              dietaryType: menuItem.dietary[0] || "regular",
              count: 0,
              notes: []
            };
          }
          report[key].count++;
          if (assignment.dietary && !report[key].notes.includes(assignment.dietary)) {
            report[key].notes.push(assignment.dietary);
          }
        }
      }
    });

    return Object.values(report).sort((a, b) => b.count - a.count);
  }, [mealAssignments, menuItems]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalGuests = guests.length;
    const assignedCount = mealAssignments.filter(g => g.assignedMenuId !== null).length;
    const dietaryGuests = mealAssignments.filter(g => g.dietary).length;
    const completionRate = totalGuests > 0 ? Math.round((assignedCount / totalGuests) * 100) : 0;

    return {
      totalGuests,
      assignedCount,
      dietaryGuests,
      completionRate,
      remainingCount: totalGuests - assignedCount
    };
  }, [guests.length, mealAssignments]);

  function handleAssignMeal(guestId: number, menuId: number | null) {
    const current = state.guestMealAssignments || {};
    const updated = { ...current };

    if (menuId === null) {
      delete updated[guestId];
    } else {
      updated[guestId] = menuId;
    }

    store.setGuestMealAssignments(updated);
  }

  function handleBulkAssign(courseType: string, dietaryCheck?: string) {
    const availableItems = menuItems.filter(item =>
      item.courseType === courseType &&
      (!dietaryCheck || item.dietary.some(d => d.toLowerCase().includes(dietaryCheck.toLowerCase())))
    );

    if (availableItems.length === 0) return;

    const preferredItem = availableItems[0];
    const current = state.guestMealAssignments || {};
    const updated = { ...current };

    mealAssignments.filter(g => g.assignedMenuId === null).forEach(guest => {
      if (!dietaryCheck || guest.dietary.toLowerCase().includes(dietaryCheck.toLowerCase()) || guest.dietary === "") {
        updated[guest.guestId] = preferredItem.id;
      }
    });

    store.setGuestMealAssignments(updated);
  }

  function handleClearAll() {
    store.setGuestMealAssignments({});
  }

  function handleExportReport() {
    const reportText: string[] = [];
    reportText.push("=== " + (lang === "en" ? "Wedding Meal Report" : "Báo Cáo Tiệc Cưới") + " ===");
    reportText.push((lang === "en" ? "Generated" : "Ngày tạo") + ": " + new Date().toLocaleString());
    reportText.push("");
    reportText.push((lang === "en" ? "Total Guests" : "Tổng số khách") + ": " + stats.totalGuests);
    reportText.push((lang === "en" ? "Assigned Meals" : "Đã phân công") + ": " + stats.assignedCount);
    reportText.push("");
    reportText.push("--- " + (lang === "en" ? "Meal Summary" : "Tổng Cơm") + " ---");
    reportText.push("");

    catererReport.forEach(item => {
      reportText.push(item.menuItem + ": " + item.count + " " + (lang === "en" ? "portions" : "phần"));
      if (item.notes.length > 0) {
        reportText.push("  " + (lang === "en" ? "Dietary notes" : "Ghi chú ăn kiêng") + ": " + item.notes.join(", "));
      }
    });

    alert(reportText.join("\n"));
  }

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {lang === "en" ? "Guest Meal Assignment" : "Phân Công Cơm Cho Khách"}
          </h2>
          <p className="text-muted-foreground">
            {lang === "en" ? "Assign meals to guests based on dietary preferences" : "Phân loại cơm dựa trên dietary restriction của khách"}
          </p>
        </div>
      </div>

      <Tabs value={view} onValueChange={(v: string) => setView(v as "assign" | "report")}>
        <TabsList>
          <TabsTrigger value="assign">
            {lang === "en" ? "Assign Meals" : "Phân Công"}
          </TabsTrigger>
          <TabsTrigger value="report">
            {lang === "en" ? "Caterer Report" : "Báo Cáo Cho Đầu Bếp"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assign" className="space-y-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">{lang === "en" ? "Total Guests" : "Tổng khách"}</div>
              <div className="text-2xl font-bold">{stats.totalGuests}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">{lang === "en" ? "Assigned" : "Đã phân"}</div>
              <div className="text-2xl font-bold">{stats.assignedCount}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">{lang === "en" ? "Dietary" : "Dietary"}</div>
              <div className="text-2xl font-bold">{stats.dietaryGuests}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">{lang === "en" ? "Progress" : "Tiến độ"}</div>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
            </Card>
          </div>

          {/* Bulk Actions */}
          <Card className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAssign("appetizer")}
              >
                {lang === "en" ? "Assign Appetizers to All" : "Phân Khai Vị Cho Tất Cả"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAssign("main", "chay")}
              >
                {lang === "en" ? "Assign Vegetarian Mains" : "Phân Món Chay"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
              >
                {lang === "en" ? "Clear All Assignments" : "Xóa Tất Cả"}
              </Button>
            </div>
          </Card>

          {/* Guest List by Side */}
          <div className="space-y-4">
            {/* Bride's Side */}
            {guestsBySide.brideSide.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">
                  {lang === "en" ? "Bride's Side" : "Họ Nhà Nữ"} ({guestsBySide.brideSide.length})
                </h3>
                <GuestAssignmentList
                  guests={guestsBySide.brideSide}
                  menuByCourse={menuByCourse}
                  onAssign={handleAssignMeal}
                  lang={lang}
                />
              </Card>
            )}

            {/* Groom's Side */}
            {guestsBySide.groomSide.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">
                  {lang === "en" ? "Groom's Side" : "Họ Nhà Nam"} ({guestsBySide.groomSide.length})
                </h3>
                <GuestAssignmentList
                  guests={guestsBySide.groomSide}
                  menuByCourse={menuByCourse}
                  onAssign={handleAssignMeal}
                  lang={lang}
                />
              </Card>
            )}

            {/* Both/Unspecified */}
            {guestsBySide.both.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">
                  {lang === "en" ? "Other Guests" : "Khách Khác"} ({guestsBySide.both.length})
                </h3>
                <GuestAssignmentList
                  guests={guestsBySide.both}
                  menuByCourse={menuByCourse}
                  onAssign={handleAssignMeal}
                  lang={lang}
                />
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {lang === "en" ? "Caterer Report" : "Báo Cáo Cho Đầu Bếp"}
              </h3>
              <Button size="sm" onClick={handleExportReport}>
                {lang === "en" ? "Export Report" : "Xuất Báo Cáo"}
              </Button>
            </div>

            <div className="space-y-2">
              {catererReport.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  {lang === "en" ? "No meal assignments yet" : "Chưa có phân công cơm nào"}
                </p>
              ) : (
                catererReport.map(item => (
                  <div key={item.menuItem} className="flex items-center justify-between p-2 border-b">
                    <div>
                      <div className="font-medium">{item.menuItem}</div>
                      {item.notes.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {item.notes.join(", ")}
                        </div>
                      )}
                    </div>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))
              )}
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">{lang === "en" ? "Total Meals" : "Tổng cơm"}: </span>
                {stats.assignedCount}
              </div>
              <div>
                <span className="font-semibold">{lang === "en" ? "Unassigned" : "Chưa phân"}: </span>
                {stats.remainingCount}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface GuestAssignmentListProps {
  guests: GuestMealAssignment[];
  menuByCourse: Record<string, MenuItem[]>;
  onAssign: (guestId: number, menuId: number | null) => void;
  lang: "vi" | "en";
}

function GuestAssignmentList({ guests, menuByCourse, onAssign, lang }: GuestAssignmentListProps) {
  return (
    <div className="space-y-3">
      {guests.map(guest => (
        <Card key={guest.guestId} className="p-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="font-medium">{guest.guestName}</div>
              <div className="text-sm text-muted-foreground space-x-2">
                {guest.tableGroup && (
                  <span>{lang === "en" ? "Table" : "Bàn"} {guest.tableGroup}</span>
                )}
                {guest.dietary && (
                  <Badge variant="outline" className="text-xs">
                    {guest.dietary}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`meal-${guest.guestId}`}
                    id={`none-${guest.guestId}`}
                    checked={guest.assignedMenuId === null}
                    onChange={() => onAssign(guest.guestId, null)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor={`none-${guest.guestId}`} className="text-sm cursor-pointer">
                    {lang === "en" ? "None" : "Không"}
                  </Label>
                </div>

                {Object.entries(menuByCourse).map(([course, items]) => (
                  <div key={course} className="ml-4">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      {course}
                    </div>
                    {items.map(item => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`meal-${guest.guestId}`}
                          id={`item-${item.id}-${guest.guestId}`}
                          checked={guest.assignedMenuId === item.id}
                          onChange={() => onAssign(guest.guestId, item.id)}
                          className="w-4 h-4"
                        />
                        <Label
                          htmlFor={`item-${item.id}-${guest.guestId}`}
                          className="text-sm cursor-pointer"
                        >
                          {item.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
