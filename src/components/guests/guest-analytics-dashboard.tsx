import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Guest } from "@/types/wedding";
import { Users, Utensils, Divide, Table, CheckCircle, XCircle, Clock } from "lucide-react";

interface GuestAnalyticsDashboardProps {
  guests: Guest[];
  lang: "vi" | "en";
}

interface DietaryStats {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

interface SideStats {
  side: "bride" | "groom" | "other" | undefined;
  count: number;
  percentage: number;
  color: string;
}

export function GuestAnalyticsDashboard({ guests, lang }: GuestAnalyticsDashboardProps) {
  const en = lang === "en";

  // Calculate RSVP statistics
  const totalGuests = guests.length;
  const guestsWithRsvp = guests.filter((g) => g.rsvpToken);
  const confirmedGuests = guests.filter((g) => g.rsvpToken && g.guestNotes?.includes("confirmed"));
  const declinedGuests = guests.filter((g) => g.rsvpToken && g.guestNotes?.includes("declined"));
  const pendingGuests = guestsWithRsvp.length - confirmedGuests.length - declinedGuests.length;

  // Dietary restrictions
  const dietaryStats: DietaryStats[] = [
    {
      type: en ? "Regular" : "Bình thường",
      count: guests.filter((g) => !g.dietary || g.dietary === "none").length,
      percentage: 0,
      color: "bg-gray-500",
    },
    {
      type: en ? "Vegetarian" : "Chay",
      count: guests.filter((g) => g.dietary === "vegetarian").length,
      percentage: 0,
      color: "bg-green-500",
    },
    {
      type: en ? "Vegan" : "Thuần chay",
      count: guests.filter((g) => g.dietary === "vegan").length,
      percentage: 0,
      color: "bg-emerald-600",
    },
    {
      type: en ? "Halal" : "Halal",
      count: guests.filter((g) => g.dietary === "halal").length,
      percentage: 0,
      color: "bg-teal-500",
    },
    {
      type: en ? "Gluten-free" : "Không gluten",
      count: guests.filter((g) => g.dietary === "gluten-free").length,
      percentage: 0,
      color: "bg-amber-500",
    },
    {
      type: en ? "Nut-free" : "Không hạt",
      count: guests.filter((g) => g.dietary === "nut-free").length,
      percentage: 0,
      color: "bg-orange-500",
    },
    {
      type: en ? "Low-sugar" : "Ít đường",
      count: guests.filter((g) => g.dietary === "low-sugar").length,
      percentage: 0,
      color: "bg-blue-500",
    },
  ];

  // Calculate percentages
  dietaryStats.forEach((stat) => {
    stat.percentage = totalGuests > 0 ? Math.round((stat.count / totalGuests) * 100) : 0;
  });

  // Side distribution
  const sideStats: SideStats[] = [
    {
      side: "bride",
      count: guests.filter((g) => g.side === "bride").length,
      percentage: 0,
      color: "text-pink-600",
    },
    {
      side: "groom",
      count: guests.filter((g) => g.side === "groom").length,
      percentage: 0,
      color: "text-blue-600",
    },
    {
      side: "other",
      count: guests.filter((g) => g.side === "other").length,
      percentage: 0,
      color: "text-gray-600",
    },
  ];

  // Calculate side percentages
  sideStats.forEach((stat) => {
    stat.percentage = totalGuests > 0 ? Math.round((stat.count / totalGuests) * 100) : 0;
  });

  // Plus ones
  const guestsWithPlusOnes = guests.filter((g) => g.plusOneName).length;
  const totalPlusOnes = guestsWithPlusOnes;
  const plusOnePercentage = totalGuests > 0 ? Math.round((totalPlusOnes / totalGuests) * 100) : 0;

  // Table groups
  const uniqueTables = new Set(guests.map((g) => g.tableGroup)).size;
  const guestsWithTables = guests.filter((g) => g.tableGroup).length;
  const tableAssignmentRate = totalGuests > 0 ? Math.round((guestsWithTables / totalGuests) * 100) : 0;

  // Phone numbers completion
  const guestsWithPhones = guests.filter((g) => g.phone).length;
  const phoneCompletionRate = totalGuests > 0 ? Math.round((guestsWithPhones / totalGuests) * 100) : 0;

  // RSVP rates
  const rsvpSentRate = totalGuests > 0 ? Math.round((guestsWithRsvp.length / totalGuests) * 100) : 0;
  const rsvpConfirmedRate = guestsWithRsvp.length > 0 ? Math.round((confirmedGuests.length / guestsWithRsvp.length) * 100) : 0;
  const rsvpDeclinedRate = guestsWithRsvp.length > 0 ? Math.round((declinedGuests.length / guestsWithRsvp.length) * 100) : 0;
  const rsvpPendingRate = guestsWithRsvp.length > 0 ? Math.round((pendingGuests / guestsWithRsvp.length) * 100) : 0;

  if (totalGuests === 0) {
    return (
      <Card className="bg-muted">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Users className="h-5 w-5" />
            <div className="text-sm">
              {en ? "Add guests to see analytics" : "Thêm khách mời để xem thống kê"}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          {en ? "Guest Analytics" : "Thống Khê Khách Mời"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {en ? "Data-driven insights for your wedding planning" : "Thông tin chi tiết giúp lên kế hoạch đám cưới"}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Guests */}
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-pink-700 dark:text-pink-300">{totalGuests}</div>
            <div className="text-xs text-muted-foreground">{en ? "Total Guests" : "Tổng Khách"}</div>
          </CardContent>
        </Card>

        {/* Confirmed */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{confirmedGuests.length}</div>
            <div className="text-xs text-muted-foreground">{en ? "Confirmed" : "Xác Nhận"}</div>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{pendingGuests}</div>
            <div className="text-xs text-muted-foreground">{en ? "Pending" : "Chờ Xác Nhận"}</div>
          </CardContent>
        </Card>

        {/* Declined */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">{declinedGuests.length}</div>
            <div className="text-xs text-muted-foreground">{en ? "Declined" : "Từ Chối"}</div>
          </CardContent>
        </Card>
      </div>

      {/* RSVP Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {en ? "RSVP Status" : "Tình Trạng RSVP"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-600">{rsvpConfirmedRate}%</div>
              <div className="text-xs text-muted-foreground">{en ? "Confirm Rate" : "Tỷ Lệ Xác Nhận"}</div>
              <Progress value={rsvpConfirmedRate} className="h-2 mt-2" />
            </div>
            <div>
              <div className="text-lg font-semibold text-amber-600">{rsvpPendingRate}%</div>
              <div className="text-xs text-muted-foreground">{en ? "Pending Rate" : "Tỷ Lệ Chờ"}</div>
              <Progress value={rsvpPendingRate} className="h-2 mt-2" />
            </div>
            <div>
              <div className="text-lg font-semibold text-red-600">{rsvpDeclinedRate}%</div>
              <div className="text-xs text-muted-foreground">{en ? "Decline Rate" : "Tỷ Lệ Từ Chối"}</div>
              <Progress value={rsvpDeclinedRate} className="h-2 mt-2" />
            </div>
          </div>

          {guestsWithRsvp.length < totalGuests && (
            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground">
                {en ? "RSVP invitations sent: " : "Đã gửi mời RSVP: "}
                <Badge variant="outline">{guestsWithRsvp.length}/{totalGuests}</Badge>
                <span className="ml-2">
                  ({en ? "Remaining: " : "Còn lại: "}{totalGuests - guestsWithRsvp.length})
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dietary Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            {en ? "Dietary Restrictions" : "Yêu Cầu Ăn Uống"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dietaryStats.filter((s) => s.count > 0).length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {en ? "No dietary restrictions recorded" : "Chưa có yêu cầu ăn uống nào"}
            </div>
          ) : (
            <div className="space-y-3">
              {dietaryStats
                .filter((s) => s.count > 0)
                .map((stat) => (
                  <div key={stat.type} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${stat.color}`} />
                        {stat.type}
                      </span>
                      <span className="font-medium">{stat.count} guests ({stat.percentage}%)</span>
                    </div>
                    <Progress value={stat.percentage} className="h-1.5" />
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Side Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Divide className="h-4 w-4" />
            {en ? "Side Distribution" : "Phân Bên Khách"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            {sideStats.map((stat) => (
              <div key={stat.side || "none"} className="space-y-1">
                <div className={`text-lg font-semibold ${stat.color}`}>
                  {stat.count}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.side === "bride"
                    ? en
                      ? "Bride"
                      : "Cô Dâu"
                    : stat.side === "groom"
                    ? en
                      ? "Groom"
                      : "Chú Rể"
                    : en
                    ? "Other"
                    : "Khác"}
                </div>
                <Badge variant="outline" className="text-xs">
                  {stat.percentage}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Plus Ones */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{en ? "Plus Ones" : "Người Đi Kèm"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{totalPlusOnes}</div>
            <div className="text-xs text-muted-foreground">
              {en ? "guests bringing +1" : "khách mời có người đi kèm"} ({plusOnePercentage}%)
            </div>
          </CardContent>
        </Card>

        {/* Table Assignments */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Table className="h-4 w-4" />
              {en ? "Table Assignments" : "Phân Bàn"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{uniqueTables}</div>
            <div className="text-xs text-muted-foreground">
              {en ? "tables assigned" : "bàn đã phân"} ({tableAssignmentRate}% {en ? "assigned" : "đã phân"})
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information Completeness */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{en ? "Guest List Completeness" : "Độ Hoàn Thiện Danh Sách"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{en ? "Phone Numbers" : "Số Điện Thoại"}</span>
                <span className="font-medium">{guestsWithPhones}/{totalGuests} ({phoneCompletionRate}%)</span>
              </div>
              <Progress value={phoneCompletionRate} className="h-2" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{en ? "RSVP Invitations Sent" : "Đã Gửi Mời RSVP"}</span>
                <span className="font-medium">{guestsWithRsvp.length}/{totalGuests} ({rsvpSentRate}%)</span>
              </div>
              <Progress value={rsvpSentRate} className="h-2" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{en ? "Table Assignments" : "Phân Bàn"}</span>
                <span className="font-medium">{guestsWithTables}/{totalGuests} ({tableAssignmentRate}%)</span>
              </div>
              <Progress value={tableAssignmentRate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-muted">
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">{en ? "💡 Insights:" : "💡 Gợi ý:"}</p>
            <ul className="space-y-1 text-xs pl-4">
              {rsvpSentRate < 80 && (
                <li>• {en ? "Send RSVP invitations to remaining guests" : "Gửi mời RSVP cho khách chưa nhận"}</li>
              )}
              {phoneCompletionRate < 90 && (
                <li>• {en ? "Collect phone numbers for better coordination" : "Thu thập số điện thoại để dễ dàng phối hợp"}</li>
              )}
              {tableAssignmentRate < 50 && totalGuests > 20 && (
                <li>• {en ? "Start assigning guests to tables for better venue planning" : "Bắt đầu phân khách vào bàn để lên kế hoạch địa điểm tốt hơn"}</li>
              )}
              {dietaryStats.filter((s) => s.count > 0 && s.type !== en ? "Regular" : "Bình thường").length > 0 && (
                <li>• {en ? "Inform caterer about dietary restrictions" : "Thông báo cho nhà cung cấp về các yêu cầu ăn uống"}</li>
              )}
              {confirmedGuests.length > 0 && (
                <li>• {en ? `Confirmed guests: ${confirmedGuests.length} (plan accordingly)` : `Khách xác nhận: ${confirmedGuests.length} (lên kế hoạch phù hợp)`}</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
