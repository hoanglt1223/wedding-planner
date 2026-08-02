import { Card, CardContent } from "@/components/ui/card";
import type { Guest } from "@/types/wedding";
import { guestGroups } from "@/data/guest-groups";

interface GroupStatisticsProps {
  guests: Guest[];
  lang?: string;
}

export function GroupStatistics({ guests, lang = "vi" }: GroupStatisticsProps) {
  const en = lang === "en";

  // Calculate statistics for each group
  const groupStats = guestGroups.map((group) => {
    const groupGuests = guests.filter((g) => g.group === group.key);
    const brideSide = groupGuests.filter((g) => g.side === "gai").length;
    const groomSide = groupGuests.filter((g) => g.side === "trai").length;
    const withPlusOne = groupGuests.filter((g) => g.plusOneName).length;

    return {
      ...group,
      total: groupGuests.length,
      brideSide,
      groomSide,
      withPlusOne,
    };
  }).filter((stat) => stat.total > 0); // Only show groups with guests

  // Calculate totals
  const totalGuests = guests.length;
  const totalWithGroup = guests.filter((g) => g.group).length;
  const totalWithoutGroup = guests.length - totalWithGroup;

  if (guests.length === 0) {
    return (
      <Card className="border-[var(--theme-border)]">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground text-center">
            {en ? "No guests yet" : "Chưa có khách mời"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[var(--theme-border)]">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">
          {en ? "📊 Guest Statistics by Group" : "📊 Thống Kế Khách Theo Nhóm"}
        </h3>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-muted/50 rounded p-2 text-center">
            <div className="text-2xs text-muted-foreground">
              {en ? "With Group" : "Có Nhóm"}
            </div>
            <div className="text-lg font-bold text-[var(--theme-primary)]">
              {totalWithGroup}
            </div>
          </div>
          <div className="bg-muted/50 rounded p-2 text-center">
            <div className="text-2xs text-muted-foreground">
              {en ? "No Group" : "Chưa Phân Loại"}
            </div>
            <div className="text-lg font-bold text-gray-400">
              {totalWithoutGroup}
            </div>
          </div>
        </div>

        {/* Group breakdown */}
        <div className="space-y-2">
          {groupStats.map((stat) => (
            <div
              key={stat.key}
              className="flex items-center gap-2 p-2 rounded-lg border border-[var(--theme-border)] hover:bg-muted/30 transition-colors"
            >
              {/* Group icon and name */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                style={{
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>

              {/* Group details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium truncate">
                    {en ? stat.labelEn : stat.label}
                  </span>
                  <span className="text-xs font-bold text-[var(--theme-primary)]">
                    {stat.total}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-2xs text-muted-foreground">
                  <span>
                    {en ? "Bride" : "Gái"}: {stat.brideSide}
                  </span>
                  <span>•</span>
                  <span>
                    {en ? "Groom" : "Trai"}: {stat.groomSide}
                  </span>
                  {stat.withPlusOne > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-purple-600">
                        +1: {stat.withPlusOne}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden flex-shrink-0">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${totalGuests > 0 ? (stat.total / totalGuests) * 100 : 0}%`,
                    backgroundColor: stat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {totalWithoutGroup > 0 && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground text-center">
            {en
              ? `${totalWithoutGroup} guests without group assignment`
              : `${totalWithoutGroup} khách chưa được phân loại`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
