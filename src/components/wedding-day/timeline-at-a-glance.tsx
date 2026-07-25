/**
 * Timeline at a Glance
 * Simplified view of wedding day schedule
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import type { ItineraryItem } from "@/data/wedding-itinerary";

interface TimelineAtAGlanceProps {
  itineraryItems: ItineraryItem[];
  lang: string;
}

export function TimelineAtAGlance({ itineraryItems, lang }: TimelineAtAGlanceProps) {
  const title = lang === "en" ? "Wedding Day Schedule" : "Lịch Trình Ngày Cưới";
  const noTimelineText = lang === "en"
    ? "No schedule set yet"
    : "Chưa đặt lịch trình";

  if (!itineraryItems || itineraryItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{noTimelineText}</p>
        </CardContent>
      </Card>
    );
  }

  // Sort items by time
  const sortedItems = [...itineraryItems].sort((a, b) => {
    const timeA = parseInt(a.startTime.replace(":", ""));
    const timeB = parseInt(b.startTime.replace(":", ""));
    return timeA - timeB;
  });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ceremony":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "reception":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "prep":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, { vi: string; en: string }> = {
      ceremony: { vi: "Lễ cưới", en: "Ceremony" },
      reception: { vi: "Tiệc", en: "Reception" },
      prep: { vi: "Chuẩn bị", en: "Prep" },
      other: { vi: "Khác", en: "Other" },
    };
    return lang === "en" ? labels[category]?.en || category : labels[category]?.vi || category;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-20 text-center">
                  <div className="text-lg font-bold">{formatTime(item.startTime)}</div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">
                    {lang === "en" ? item.activityEn : item.activity}
                  </h4>
                  <Badge className={`text-xs ${getCategoryColor(item.category || "other")}`}>
                    {getCategoryLabel(item.category || "other")}
                  </Badge>
                </div>

                {item.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">
                      {lang === "en" ? (item.locationEn || item.location) : item.location}
                    </span>
                  </div>
                )}

                {(item.notes || item.notesEn) && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {lang === "en" ? (item.notesEn || item.notes) : item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
