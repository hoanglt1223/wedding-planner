/**
 * Engagement Timeline Component
 * Shows ceremony sequence and timing
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface TimelineEvent {
  id: string;
  time: string;
  titleVi: string;
  titleEn: string;
  notes: string;
}

interface EngagementTimelineProps {
  events: TimelineEvent[];
  engagementDate: string;
  lang: "vi" | "en";
}

export function EngagementTimeline({ events, engagementDate, lang }: EngagementTimelineProps) {
  const en = lang === "en";

  const formatEventDate = (time: string) => {
    if (!engagementDate) return time;
    try {
      const [hours, minutes] = time.split(":");
      const eventDate = new Date(engagementDate);
      eventDate.setHours(parseInt(hours), parseInt(minutes));
      return format(eventDate, "HH:mm");
    } catch {
      return time;
    }
  };

  const hasDate = !!engagementDate;

  return (
    <div className="space-y-4">
      {!hasDate && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">
                {en ? "Engagement date not set" : "Chưa đặt ngày đính hôn"}
              </p>
              <p className="text-sm text-amber-700">
                {en ? "Set the engagement date to see specific times" : "Đặt ngày đính hôn để xem thời gian cụ thể"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {en ? "Ceremony Timeline" : "Lịch trình lễ đính hôn"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {index < events.length - 1 && (
                  <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-[var(--theme-border)]" />
                )}

                <div className="flex gap-3">
                  {/* Time indicator */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[var(--theme-primary)] flex items-center justify-center text-white font-semibold">
                      {formatEventDate(event.time)}
                    </div>
                  </div>

                  {/* Event content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold">
                          {en ? event.titleEn : event.titleVi}
                        </p>
                        {event.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.notes}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {hasDate ? (
                          <>
                            {en ? "Scheduled" : "Đã lên lịch"}
                          </>
                        ) : (
                          <>
                            {en ? "Template" : "Mẫu"}
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Location hint */}
                    {index === 0 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {en ? "Bride's home" : "Nhà cô dâu"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-[var(--theme-surface)] rounded-lg border border-[var(--theme-border)] p-4">
        <p className="text-sm text-muted-foreground">
          💡 <strong className="text-foreground">{en ? "Tip:" : "Mẹo:"}</strong>{" "}
          {en
            ? "This timeline follows traditional Vietnamese engagement ceremony sequence. Adjust timing based on your family's preferences."
            : "Lịch trình này tuân theo trình tự lễ đính hôn truyền thống Việt Nam. Điều chỉnh thời gian dựa trên sở thích của gia đình."}
        </p>
      </div>
    </div>
  );
}