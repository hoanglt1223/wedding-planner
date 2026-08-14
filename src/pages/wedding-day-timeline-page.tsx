/**
 * Wedding Day Timeline Dashboard
 * Real-time wedding day execution tool with live countdown, progress tracking,
 * and quick access to contacts and vendors
 */

import { useState, useEffect, useMemo } from "react";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  SkipForward,
  Phone,
  Navigation,
  Camera,
  Users,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
} from "lucide-react";
import type { TimelineEntry, WeddingContact, Vendor } from "@/types/wedding";

type TimelineStatus = "upcoming" | "active" | "completed" | "delayed" | "skipped";

interface WeddingDayTimelineEntry extends TimelineEntry {
  status: TimelineStatus;
  actualStartTime?: string;
  notes?: string;
  estimatedDelay?: number; // minutes
}

export function WeddingDayTimelinePage() {
  const { state } = useWeddingStoreContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeEntryId, setActiveEntryId] = useState<number | null>(null);
  const [timelineEntries, setTimelineEntries] = useState<WeddingDayTimelineEntry[]>([]);
  const [showContacts, setShowContacts] = useState(false);
  const [selectedPhotoShots, setSelectedPhotoShots] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(true);

  const lang = state.lang || "vi";
  const en = lang === "en";

  // Initialize timeline entries from planning timeline
  useEffect(() => {
    const initialized = (state.timelineEntries || []).map(entry => ({
      ...entry,
      status: "upcoming" as TimelineStatus,
      notes: "",
    }));
    setTimelineEntries(initialized);
  }, [state.timelineEntries]);

  // Update current time every minute when running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isRunning]);

  // Determine active timeline entry based on current time
  useEffect(() => {
    if (!timelineEntries.length || !isRunning) return;

    const now = currentTime;
    let activeId: number | null = null;

    // Find the most recent entry that should have started
    for (let i = timelineEntries.length - 1; i >= 0; i--) {
      const entry = timelineEntries[i];
      const [hours, minutes] = entry.time.split(":").map(Number);
      const entryTime = new Date(now);
      entryTime.setHours(hours, minutes, 0, 0);

      if (now >= entryTime) {
        activeId = entry.id;
        break;
      }
    }

    // If no active entry found and we haven't started, activate the first one
    if (activeId === null && timelineEntries.length > 0) {
      const firstEntry = timelineEntries[0];
      const [hours, minutes] = firstEntry.time.split(":").map(Number);
      const firstTime = new Date(now);
      firstTime.setHours(hours, minutes, 0, 0);

      // If first entry is within 30 minutes, consider it active
      if (now >= new Date(firstTime.getTime() - 30 * 60000)) {
        activeId = firstEntry.id;
      }
    }

    setActiveEntryId(activeId);
  }, [currentTime, timelineEntries, isRunning]);

  // Calculate countdown for an entry
  const getCountdown = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const targetTime = new Date(currentTime);
    targetTime.setHours(hours, minutes, 0, 0);

    const diff = targetTime.getTime() - currentTime.getTime();

    if (diff < 0) return { passed: true, minutes: 0 };

    return { passed: false, minutes: Math.floor(diff / 60000) };
  };

  // Calculate overall progress
  const progress = useMemo(() => {
    if (!timelineEntries.length) return 0;
    const completed = timelineEntries.filter(e => e.status === "completed" || e.status === "skipped").length;
    return Math.round((completed / timelineEntries.length) * 100);
  }, [timelineEntries]);

  // Get status icon and color
  const getStatusInfo = (status: TimelineStatus) => {
    switch (status) {
      case "completed":
        return { icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-50", label: en ? "Completed" : "Hoàn thành" };
      case "active":
        return { icon: Play, color: "text-blue-600", bgColor: "bg-blue-50", label: en ? "In Progress" : "Đang thực hiện" };
      case "delayed":
        return { icon: AlertCircle, color: "text-orange-600", bgColor: "bg-orange-50", label: en ? "Delayed" : "Trì hoãn" };
      case "skipped":
        return { icon: SkipForward, color: "text-gray-600", bgColor: "bg-gray-50", label: en ? "Skipped" : "Bỏ qua" };
      default:
        return { icon: Clock, color: "text-gray-500", bgColor: "bg-gray-50", label: en ? "Upcoming" : "Sắp tới" };
    }
  };

  // Update entry status
  const updateStatus = (id: number, status: TimelineStatus) => {
    setTimelineEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, status } : entry
      )
    );
  };

  // Update entry notes
  const updateNotes = (id: number, notes: string) => {
    setTimelineEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, notes } : entry
      )
    );
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  // Quick dial contact
  const quickDial = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  // Navigate to location
  const navigateTo = (address: string) => {
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, "_blank");
  };

  // Get relevant contacts for current entry
  const getRelevantContacts = () => {
    const allContacts = [
      ...(state.contacts || []).map(c => ({ ...c, type: "contact" as const })),
      ...(state.vendors || []).map(v => ({ ...v, type: "vendor" as const })),
    ];

    // Filter emergency/high priority contacts
    return allContacts.filter(c =>
      c.type === "contact" ? c.category === "venue" || c.category === "family"
      : c.status === "booked" || c.status === "confirmed"
    ).slice(0, 8);
  };

  const relevantContacts = useMemo(getRelevantContacts, [state.contacts, state.vendors]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-primary)]">
            {en ? "📅 Wedding Day Timeline" : "📅 Lịch Trình Ngày Cưới"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {en ? "Real-time wedding day coordination" : "Phối hợp thực-time ngày cưới"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? "" : "bg-orange-50 border-orange-300"}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? (en ? "Pause" : "Tạm dừng") : (en ? "Resume" : "Tiếp tục")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowContacts(!showContacts)}
          >
            <Users className="w-4 h-4 mr-2" />
            {en ? "Contacts" : "Danh bạ"}
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium">{en ? "Overall Progress" : "Tiến độ tổng thể"}</p>
            <p className="text-2xl font-bold">{progress}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{en ? "Current Time" : "Giờ hiện tại"}</p>
            <p className="text-lg font-semibold">{currentTime.toLocaleTimeString(lang === "vi" ? "vi-VN" : "en-US", { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>
        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      {/* Quick Contacts Panel */}
      {showContacts && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">{en ? "Quick Contacts" : "Liên hệ nhanh"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relevantContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-2 rounded border bg-[var(--theme-surface)]"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{contact.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {"phone" in contact ? contact.role : contact.category}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => quickDial(contact.phone)}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  {"address" in contact && contact.address && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigateTo(contact.address!)}
                    >
                      <Navigation className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Timeline Entries */}
      <div className="space-y-3">
        {timelineEntries.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{en ? "No timeline entries yet. Add them in the Planning section." : "Chưa có lịch trình. Thêm trong phần Lập kế hoạch."}</p>
          </Card>
        ) : (
          timelineEntries.map((entry, index) => {
            const isActive = entry.id === activeEntryId;
            const countdown = getCountdown(entry.time);
            const StatusInfo = getStatusInfo(entry.status);

            return (
              <Card
                key={entry.id}
                className={`p-4 transition-all ${
                  isActive ? "ring-2 ring-[var(--theme-primary)] shadow-lg" : ""
                } ${entry.status === "completed" || entry.status === "skipped" ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  {/* Time Column */}
                  <div className="text-center min-w-[60px]">
                    <p className="text-xl font-bold">{formatTime(entry.time)}</p>
                    {!countdown.passed && entry.status === "upcoming" && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {en ? "in" : "trong"} {countdown.minutes} {en ? "min" : "phút"}
                      </Badge>
                    )}
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">{entry.title}</h3>
                        {entry.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Navigation className="w-3 h-3" />
                            {entry.location}
                          </p>
                        )}
                        {entry.responsible && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {en ? "Responsible" : "Phối hợp"}: {entry.responsible}
                          </p>
                        )}
                      </div>
                      <Badge className={`${StatusInfo.color} ${StatusInfo.bgColor} border-0`}>
                        <StatusInfo.icon className="w-3 h-3 mr-1" />
                        {StatusInfo.label}
                      </Badge>
                    </div>

                    {/* Status Actions */}
                    <div className="flex flex-wrap gap-2">
                      {entry.status !== "completed" && entry.status !== "skipped" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(entry.id, "completed")}
                            className="text-xs"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {en ? "Complete" : "Hoàn thành"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(entry.id, "delayed")}
                            className="text-xs"
                          >
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {en ? "Delay" : "Trì hoãn"}
                          </Button>
                        </>
                      )}
                      {entry.status !== "skipped" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(entry.id, "skipped")}
                          className="text-xs"
                        >
                          <SkipForward className="w-3 h-3 mr-1" />
                          {en ? "Skip" : "Bỏ qua"}
                        </Button>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <Input
                        placeholder={en ? "Add notes..." : "Thêm ghi chú..."}
                        value={entry.notes || ""}
                        onChange={(e) => updateNotes(entry.id, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Photo Shot Quick Access */}
      {state.photoShots && state.photoShots.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Camera className="w-4 h-4" />
              {en ? "Photo Shot List" : "Danh sách chụp ảnh"}
            </h3>
            <Badge variant="outline">
              {selectedPhotoShots.length} / {state.photoShots.length} {en ? "done" : "xong"}
            </Badge>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {state.photoShots
              .filter(shot => shot.priority === "must-have")
              .slice(0, 5)
              .map(shot => (
                <div
                  key={shot.id}
                  className="flex items-start gap-2 p-2 rounded border bg-[var(--theme-surface)]"
                >
                  <input
                    type="checkbox"
                    checked={selectedPhotoShots.includes(shot.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPhotoShots([...selectedPhotoShots, shot.id]);
                      } else {
                        setSelectedPhotoShots(selectedPhotoShots.filter(id => id !== shot.id));
                      }
                    }}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{shot.title}</p>
                    <p className="text-xs text-muted-foreground">{shot.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
