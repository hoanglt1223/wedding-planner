/**
 * Wedding Schedule Share Landing Page
 * Public page for accessing shared wedding schedules
 * Accessed via: #/schedule/:token
 */

import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lock, Calendar, Clock, MapPin, Users, Phone, Mail, AlertCircle } from "lucide-react";
import { THEMES } from "@/data/themes";

interface ScheduleData {
  scheduleId: string;
  weddingDate: string;
  coupleNames: string;
  timeline: TimelineEntry[];
  contacts: ScheduleContact[];
  venues: ScheduleVenue[];
  notes?: string;
  lang: "vi" | "en";
  customMessage?: string;
  theme: "traditional-red" | "blush-pink" | "navy-blue" | "sage-green";
}

interface TimelineEntry {
  id: number;
  time: string;
  title: string;
  location?: string;
  responsible?: string;
  notes?: string;
  category: "ceremony" | "reception" | "prep" | "other";
}

interface ScheduleContact {
  role: string;
  name: string;
  phone: string;
  email?: string;
}

interface ScheduleVenue {
  name: string;
  address: string;
  time: string;
  coordinates?: string;
}

export function ScheduleShareLandingPage() {
  const params = useParams({ from: "/schedule/$token" });
  const token = params.token;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showContactInfo, setShowContactInfo] = useState(true);
  const [showVendorNotes, setShowVendorNotes] = useState(true);
  const [allowDownload, setAllowDownload] = useState(true);

  const lang = scheduleData?.lang || "vi";
  const t = (vi: string, en: string) => lang === "vi" ? vi : en;

  // Get theme
  const theme = THEMES.find(t => t.id === (scheduleData?.theme || "traditional-red")) || THEMES[0];

  // Fetch schedule data
  useEffect(() => {
    async function fetchSchedule() {
      try {
        setLoading(true);
        const response = await fetch(`/api/schedule/${token}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError(t("Không tìm thấy lịch trình", "Schedule not found"));
          } else if (response.status === 410) {
            setError(t("Lịch trình đã hết hạn", "Schedule has expired"));
          } else {
            setError(t("Lỗi khi tải lịch trình", "Error loading schedule"));
          }
          return;
        }

        const data = await response.json();

        if (data.requiresPassword) {
          setPasswordRequired(true);
          setShowContactInfo(data.showContactInfo ?? true);
          setShowVendorNotes(data.showVendorNotes ?? true);
          setAllowDownload(data.allowDownload ?? true);
        } else {
          setScheduleData(data);
        }
      } catch (err) {
        setError(t("Lỗi kết nối", "Connection error"));
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchSchedule();
    }
  }, [token]);

  // Handle password submission
  async function handleSubmitPassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");

    try {
      const response = await fetch(`/api/schedule/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        if (response.status === 401) {
          setPasswordError(t("Mật khẩu không đúng", "Incorrect password"));
        } else {
          setPasswordError(t("Lỗi khi xác thực", "Authentication error"));
        }
        return;
      }

      const data = await response.json();
      setScheduleData(data);
      setPasswordRequired(false);
    } catch (err) {
      setPasswordError(t("Lỗi kết nối", "Connection error"));
    }
  }

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <div className="animate-pulse text-muted-foreground">
            {t("Đang tải lịch trình...", "Loading schedule...")}
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-lg font-semibold mb-2">
            {t("Không thể tải lịch trình", "Cannot load schedule")}
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.href = "/#/"} variant="outline">
            {t("Về trang chủ", "Back to home")}
          </Button>
        </Card>
      </div>
    );
  }

  // Password required state
  if (passwordRequired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-6 w-full max-w-md">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-lg font-semibold mb-2">
              {t("Lịch trình được bảo vệ", "Protected Schedule")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("Nhập mật khẩu để xem lịch trình", "Enter password to view schedule")}
            </p>
          </div>

          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("Mật khẩu", "Password")}
                className="w-full"
              />
            </div>
            {passwordError && (
              <p className="text-sm text-destructive">{passwordError}</p>
            )}
            <Button type="submit" className="w-full">
              {t("Xem lịch trình", "View Schedule")}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Schedule data loaded
  if (!scheduleData) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-background p-4 md:p-8"
      style={{ fontFamily: theme.fontFamily }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Wedding Header */}
        <div className="text-center py-8 space-y-3">
          <div className="text-4xl mb-3">💒</div>
          <h1 className="text-3xl font-bold" style={{ color: `var(--${theme.colors?.primary || theme.primary})` }}>
            {scheduleData.coupleNames}
          </h1>
          <p className="text-xl text-muted-foreground">
            {formatDate(scheduleData.weddingDate)}
          </p>
          {scheduleData.customMessage && (
            <p className="text-base italic mt-4 max-w-lg mx-auto">
              {scheduleData.customMessage}
            </p>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <h2 className="font-semibold text-xl">
            🕐 {t("Lịch trình", "Timeline")}
          </h2>
          {scheduleData.timeline.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              {t("Chưa có lịch trình", "No timeline entries")}
            </Card>
          ) : (
            <div className="space-y-3">
              {scheduleData.timeline.map((entry) => (
                <div
                  key={entry.id}
                  className="border-l-4 pl-4 py-3 space-y-1 bg-card"
                  style={{ borderColor: `var(--${theme.colors?.primary || theme.primary})` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-sm min-w-[60px]">
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
                      {entry.responsible && showVendorNotes && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {entry.responsible}
                        </p>
                      )}
                      {entry.notes && showVendorNotes && (
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
        {showContactInfo && scheduleData.contacts.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-xl">
              📞 {t("Liên hệ", "Contacts")}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {scheduleData.contacts.map((contact, index) => (
                <Card key={index} className="p-4 space-y-2">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-muted-foreground">{contact.role}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      <a href={`tel:${contact.phone}`} className="hover:underline">
                        {contact.phone}
                      </a>
                    </div>
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

        {/* Notes */}
        {scheduleData.notes && (
          <Card className="p-4">
            <h3 className="font-semibold mb-2">{t("Ghi chú", "Notes")}</h3>
            <p className="text-sm text-muted-foreground">{scheduleData.notes}</p>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center py-6 text-sm text-muted-foreground border-t">
          <p>
            {t("Được tạo bởi", "Created with")} Wedding Planner
          </p>
          <Button
            onClick={() => window.location.href = "/#/"}
            variant="link"
            className="text-xs mt-2"
          >
            {t("Tạo lịch trình cho đám cưới của bạn", "Create your wedding schedule")}
          </Button>
        </div>
      </div>
    </div>
  );
}