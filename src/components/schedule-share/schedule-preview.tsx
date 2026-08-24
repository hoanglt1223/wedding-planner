/**
 * Schedule Preview
 * Mobile-friendly preview of shared wedding schedule
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, X, Phone, Mail, MapPin, Clock, Users } from "lucide-react";
import type { ScheduleShareSettings } from "@/types/wedding-schedule-share";
import type { WeddingState } from "@/types/wedding";
import { THEMES } from "@/data/themes";

interface SchedulePreviewProps {
  state: WeddingState;
  settings: ScheduleShareSettings;
  onClose: () => void;
  lang: "vi" | "en";
}

export function SchedulePreview({ state, settings, onClose, lang }: SchedulePreviewProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const t = (vi: string, en: string) => lang === "vi" ? vi : en;

  // Get current theme
  const theme = THEMES.find(t => t.id === (state.themeId || "traditional-red")) || THEMES[0];

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch {
      return dateString;
    }
  };

  // Format time
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0);
      return date.toLocaleTimeString(lang === "vi" ? "vi-VN" : "en-US", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      ceremony: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      reception: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      prep: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    };
    return colors[category] || colors.other;
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, { vi: string; en: string }> = {
      ceremony: { vi: "Lễ nghi", en: "Ceremony" },
      reception: { vi: "Tiệc", en: "Reception" },
      prep: { vi: "Chuẩn bị", en: "Preparation" },
      other: { vi: "Khác", en: "Other" }
    };
    return labels[category]?.[lang] || category;
  };

  // Handle print/download
  function handlePrint() {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  }

  const timeline = state.timelineEntries || [];
  const contacts = state.contacts || [];
  const coupleName = `${state.info.bride} & ${state.info.groom}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-background pb-4 border-b">
          <div>
            <h2 className="font-semibold text-lg">
              {t("Xem trước lịch trình", "Schedule Preview")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("Đây là cách người khác sẽ thấy lịch trình của bạn", "This is how others will see your schedule")}
            </p>
          </div>
          <div className="flex gap-2">
            {settings.allowDownload && (
              <Button
                size="sm"
                onClick={handlePrint}
                disabled={isPrinting}
                className="text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                {t("Tải xuống", "Download")}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              {t("Đóng", "Close")}
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div
          className="space-y-6"
          style={{
            fontFamily: theme.fontFamily,
            color: 'var(--foreground)'
          }}
        >
          {/* Wedding Header */}
          <div className="text-center py-6 space-y-2">
            <div className="text-3xl mb-2">💒</div>
            <h1 className="text-2xl font-bold" style={{ color: `var(--${theme.colors?.primary || theme.primary})` }}>
              {coupleName}
            </h1>
            <p className="text-lg text-muted-foreground">
              {formatDate(state.info.date)}
            </p>
            {settings.customMessage && (
              <p className="text-sm italic mt-4 max-w-md mx-auto">
                {settings.customMessage}
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">
              🕐 {t("Lịch trình", "Timeline")}
            </h2>
            {timeline.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                {t("Chưa có lịch trình nào", "No timeline entries yet")}
              </Card>
            ) : (
              <div className="space-y-3">
                {timeline.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="border-l-4 pl-4 py-2 space-y-1"
                    style={{ borderColor: `var(--${theme.colors?.primary || theme.primary})` }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-sm">
                        {formatTime(entry.time)}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{entry.title}</p>
                        {entry.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {entry.location}
                          </p>
                        )}
                        {entry.responsible && settings.showVendorNotes && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {entry.responsible}
                          </p>
                        )}
                        {entry.notes && settings.showVendorNotes && (
                          <p className="text-sm text-muted-foreground italic">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                      <Badge className={getCategoryColor(entry.category)}>
                        {getCategoryLabel(entry.category)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contacts */}
          {settings.showContactInfo && contacts.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">
                📞 {t("Liên hệ", "Contacts")}
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {contacts.map((contact, index) => (
                  <Card key={index} className="p-3 space-y-2">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">{contact.role}</div>
                    <div className="space-y-1 text-sm">
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <a href={`tel:${contact.phone}`} className="hover:underline">
                            {contact.phone}
                          </a>
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <a href={`mailto:${contact.email}`} className="hover:underline">
                            {contact.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center py-4 text-sm text-muted-foreground border-t">
            <p>
              {t("Được tạo bởi", "Created with")} Wedding Planner
            </p>
            {settings.password && (
              <p className="mt-2 text-xs">
                🔒 {t("Được bảo vệ bằng mật khẩu", "Password-protected")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}