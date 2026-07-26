/**
 * Honeymoon Overview
 * Editable trip details (destination, dates, budget) + countdown + progress summary
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { formatMoney, getCurrencySymbol } from "@/lib/format";
import { Plane, CalendarHeart, Wallet, MapPin, Sparkles } from "lucide-react";
import type { HoneymoonState } from "@/types/wedding";

interface HoneymoonOverviewProps {
  honeymoon: HoneymoonState;
  lang: "vi" | "en";
  packingCheckedCount: number;
  packingTotal: number;
  tasksDoneCount: number;
  tasksTotal: number;
  onUpdate: (patch: Partial<HoneymoonState>) => void;
}

function daysBetween(target: string): number | null {
  if (!target) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(target + "T00:00:00");
  if (isNaN(targetDate.getTime())) return null;
  const diff = Math.round((targetDate.getTime() - today.getTime()) / 86_400_000);
  return diff;
}

export function HoneymoonOverview({
  honeymoon,
  lang,
  packingCheckedCount,
  packingTotal,
  tasksDoneCount,
  tasksTotal,
  onUpdate,
}: HoneymoonOverviewProps) {
  const en = lang === "en";
  const daysToGo = daysBetween(honeymoon.startDate);
  const tripLength = (() => {
    if (!honeymoon.startDate || !honeymoon.endDate) return null;
    const d = daysBetween(honeymoon.endDate);
    if (d === null) return null;
    const start = new Date(honeymoon.startDate + "T00:00:00");
    const end = new Date(honeymoon.endDate + "T00:00:00");
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    return Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  })();

  const packingPct = packingTotal > 0 ? (packingCheckedCount / packingTotal) * 100 : 0;
  const tasksPct = tasksTotal > 0 ? (tasksDoneCount / tasksTotal) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Countdown hero */}
      <Card className="border-2 bg-gradient-to-br from-sky-50 to-pink-50 dark:from-sky-950 dark:to-pink-950">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                <Plane className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{en ? "Next getaway" : "Chuyến đi tới"}</p>
                <p className="text-lg font-bold">
                  {honeymoon.destination
                    ? honeymoon.destination
                    : en ? "Set your destination" : "Chọn điểm đến của bạn"}
                </p>
              </div>
            </div>
            <div className="text-center">
              {daysToGo === null ? (
                <span className="text-sm text-muted-foreground">{en ? "Add a start date" : "Thêm ngày đi"}</span>
              ) : daysToGo > 0 ? (
                <>
                  <div className="text-4xl font-extrabold text-pink-600">{daysToGo}</div>
                  <div className="text-xs text-muted-foreground">{en ? "days to go" : "ngày nữa"}</div>
                </>
              ) : daysToGo === 0 ? (
                <div className="text-xl font-bold text-pink-600 flex items-center gap-1">
                  <Sparkles className="w-5 h-5" /> {en ? "It's today!" : "Hôm nay rồi!"}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">{en ? "Bon voyage!" : "Chúc chuyến đi vui vẻ!"}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip details form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-pink-500" />
            {en ? "Trip Details" : "Chi tiết chuyến đi"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="hm-dest">{en ? "Destination" : "Điểm đến"}</Label>
            <Input
              id="hm-dest"
              value={honeymoon.destination}
              placeholder={en ? "e.g. Bali, Maldives, Da Lat" : "VD: Bali, Maldives, Đà Lạt"}
              onChange={(e) => onUpdate({ destination: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hm-start" className="flex items-center gap-1.5">
              <CalendarHeart className="w-4 h-4" /> {en ? "Start date" : "Ngày đi"}
            </Label>
            <Input
              id="hm-start"
              type="date"
              value={honeymoon.startDate}
              onChange={(e) => onUpdate({ startDate: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hm-end" className="flex items-center gap-1.5">
              <CalendarHeart className="w-4 h-4" /> {en ? "End date" : "Ngày về"}
            </Label>
            <Input
              id="hm-end"
              type="date"
              value={honeymoon.endDate}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="hm-budget" className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4" /> {en ? "Budget" : "Ngân sách"}
            </Label>
            <Input
              id="hm-budget"
              type="number"
              min={0}
              step={100000}
              value={honeymoon.budget || ""}
              placeholder={en ? "Planned budget" : "Ngân sách dự kiến"}
              onChange={(e) => onUpdate({ budget: Number(e.target.value) || 0 })}
            />
            {honeymoon.budget > 0 && (
              <p className="text-xs text-muted-foreground">
                {formatMoney(honeymoon.budget, lang)}{getCurrencySymbol(lang)}
                {tripLength ? ` · ${formatMoney(Math.round(honeymoon.budget / tripLength), lang)}${getCurrencySymbol(lang)} ${en ? "/ day" : "/ ngày"}` : ""}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{en ? "Packing progress" : "Tiến độ đóng gói"}</span>
              <span className="text-muted-foreground">{packingCheckedCount}/{packingTotal}</span>
            </div>
            <Progress value={packingPct} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{en ? "Tasks done" : "Công việc xong"}</span>
              <span className="text-muted-foreground">{tasksDoneCount}/{tasksTotal}</span>
            </div>
            <Progress value={tasksPct} className="h-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
