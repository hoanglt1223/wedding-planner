/**
 * Dietary Matching Component
 * Shows guests with dietary restrictions and compatible menu items
 */

import type { Guest, MenuItem, DietaryRestriction } from "@/types/wedding";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";

interface DietaryMatchingProps {
  guests: Guest[];
  menuItems: MenuItem[];
}

const DIETARY_LABELS: Record<DietaryRestriction, { label: string; labelEn: string; color: string }> = {
  vegetarian: { label: "Chay", labelEn: "Vegetarian", color: "bg-green-500" },
  vegan: { label: "Chay trường", labelEn: "Vegan", color: "bg-emerald-600" },
  halal: { label: "Halal", labelEn: "Halal", color: "bg-teal-500" },
  "gluten-free": { label: "Không gluten", labelEn: "Gluten-free", color: "bg-amber-500" },
  "nut-free": { label: "Không hạt", labelEn: "Nut-free", color: "bg-orange-500" },
  none: { label: "Bình thường", labelEn: "None", color: "bg-gray-500" },
};

export function DietaryMatching({ guests, menuItems }: DietaryMatchingProps) {
  // Parse dietary string to array of restrictions
  const parseGuestDietary = (dietaryStr?: string): DietaryRestriction[] => {
    if (!dietaryStr || dietaryStr.trim() === "") return ["none"];

    const restrictions: DietaryRestriction[] = [];
    const lower = dietaryStr.toLowerCase();

    if (lower.includes("chay trường") || lower.includes("vegan")) restrictions.push("vegan");
    else if (lower.includes("chay") || lower.includes("vegetarian")) restrictions.push("vegetarian");

    if (lower.includes("halal")) restrictions.push("halal");
    if (lower.includes("gluten") || lower.includes("tếo")) restrictions.push("gluten-free");
    if (lower.includes("hạt") || lower.includes("nut")) restrictions.push("nut-free");

    return restrictions.length > 0 ? restrictions : ["none"];
  };

  // Group guests by dietary restrictions
  const guestsByDietary = useMemo(() => {
    const groups: Record<string, { guests: Guest[]; restrictions: DietaryRestriction[] }> = {};

    guests.forEach((guest) => {
      if (!guest.dietary || guest.dietary.trim() === "") return;

      const restrictions = parseGuestDietary(guest.dietary);
      const key = restrictions.sort().join(",");

      if (!groups[key]) {
        groups[key] = { guests: [], restrictions };
      }
      groups[key].guests.push(guest);
    });

    return groups;
  }, [guests]);

  // Find compatible menu items for each dietary restriction
  const getCompatibleItems = (restrictions: DietaryRestriction[]): MenuItem[] => {
    if (restrictions.includes("none") || restrictions.length === 0) return menuItems;

    return menuItems.filter((item) => {
      // Item must have ALL the guest's restrictions
      return restrictions.every((restriction) =>
        item.dietary.includes(restriction) || item.dietary.includes("none")
      );
    });
  };

  const dietaryGroups = Object.entries(guestsByDietary);
  const hasGuestsWithDietary = dietaryGroups.length > 0;

  return (
    <div className="space-y-4">
      {!hasGuestsWithDietary ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>Không có khách có hạn chế ăn uống</p>
            <p className="text-xs">No guests with dietary restrictions</p>
          </CardContent>
        </Card>
      ) : (
        dietaryGroups.map(([key, { guests: groupGuests, restrictions }]) => {
          const compatibleItems = getCompatibleItems(restrictions);
          const hasConflict = compatibleItems.length === 0;

          return (
            <Card key={key} className={hasConflict ? "border-destructive" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Khách có hạn chế ({groupGuests.length})
                  </CardTitle>
                  <div className="flex gap-1">
                    {restrictions.map((r) => (
                      <Badge
                        key={r}
                        className={`text-white ${DIETARY_LABELS[r]?.color || "bg-gray-500"}`}
                      >
                        {DIETARY_LABELS[r]?.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Guest list */}
                <ScrollArea className="h-24 rounded border">
                  <div className="p-2 space-y-1">
                    {groupGuests.map((guest) => (
                      <div
                        key={guest.id}
                        className="text-xs flex items-center justify-between p-2 rounded hover:bg-muted"
                      >
                        <span className="font-medium">{guest.name}</span>
                        <span className="text-muted-foreground">
                          {guest.side === "bride" ? "Cô dâu" : "Chú rể"}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Compatible items */}
                <div>
                  <p className="text-xs font-medium mb-2">
                    Món ăn phù hợp ({compatibleItems.length}):
                  </p>
                  {hasConflict ? (
                    <div className="p-3 bg-destructive/10 rounded text-destructive text-sm">
                      ⚠️ Không có món nào phù hợp với các khách này
                    </div>
                  ) : (
                    <ScrollArea className="h-32 rounded border">
                      <div className="p-2 space-y-1">
                        {compatibleItems.map((item) => (
                          <div
                            key={item.id}
                            className="text-xs flex items-start gap-2 p-2 rounded hover:bg-muted"
                          >
                            <Checkbox checked={item.checked} disabled />
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-muted-foreground">
                                {item.courseType} • {item.costPerServing.toLocaleString()}đ
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {item.dietary
                                .filter((d) => d !== "none")
                                .map((d) => (
                                  <Badge
                                    key={d}
                                    variant="outline"
                                    className={`text-white text-[10px] ${DIETARY_LABELS[d]?.color}`}
                                  >
                                    {DIETARY_LABELS[d]?.label}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
