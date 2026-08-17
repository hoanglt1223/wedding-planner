/**
 * Wedding Schedule Share Panel
 * Interface for configuring and sharing wedding day timeline
 */

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { ShareLinkDialog } from "./share-link-dialog";
import { SchedulePreview } from "./schedule-preview";
import type { ScheduleShareSettings } from "@/types/wedding-schedule-share";
import { Share2, Download, Eye, Lock, Calendar, Clock, Users, FileText } from "lucide-react";

interface ScheduleSharePanelProps {
  lang: "vi" | "en";
}

export function ScheduleSharePanel({ lang }: ScheduleSharePanelProps) {
  const store = useWeddingStoreContext();
  const { state } = store;

  const [settings, setSettings] = useState<ScheduleShareSettings>(() =>
    state.scheduleShareSettings || {
      enabled: false,
      shareToken: generateShareToken(),
      showContactInfo: true,
      showVendorNotes: true,
      allowDownload: true,
      lastUpdated: new Date().toISOString()
    }
  );

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const t = (vi: string, en: string) => lang === "vi" ? vi : en;

  // Generate a random share token
  function generateShareToken(): string {
    return Math.random().toString(36).substring(2, 10) +
           Math.random().toString(36).substring(2, 10);
  }

  // Regenerate share token
  function handleRegenerateToken() {
    const newToken = generateShareToken();
    const updated = { ...settings, shareToken: newToken, lastUpdated: new Date().toISOString() };
    setSettings(updated);
    saveSettings(updated);
  }

  // Save settings to store
  function saveSettings(newSettings: ScheduleShareSettings) {
    setSettings(newSettings);
    store.updateScheduleShareSettings(newSettings);
  }

  // Toggle settings
  function toggleSetting(key: keyof ScheduleShareSettings) {
    const updated = {
      ...settings,
      [key]: !settings[key],
      lastUpdated: new Date().toISOString()
    };
    saveSettings(updated);
  }

  // Update text field
  function updateTextField(key: keyof ScheduleShareSettings, value: string) {
    const updated = { ...settings, [key]: value, lastUpdated: new Date().toISOString() };
    saveSettings(updated);
  }

  // Get share URL
  const shareUrl = useMemo(() => {
    if (!settings.enabled) return "";
    const baseUrl = window.location.origin;
    return `${baseUrl}/#/schedule/${settings.shareToken}`;
  }, [settings.enabled, settings.shareToken]);

  // Count timeline entries
  const timelineCount = (state.timeline || []).length;

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4 p-2">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-semibold text-lg">
            📅 {t("Lịch Trình Cưới", "Wedding Schedule")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("Chia sẻ lịch trình với nhà cung cấp và người thân", "Share timeline with vendors and family")}
          </p>
        </div>
        <div className="flex gap-2">
          {settings.enabled && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                {t("Xem trước", "Preview")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowShareDialog(true)}
                className="text-xs"
              >
                <Share2 className="w-3 h-3 mr-1" />
                {t("Chia sẻ", "Share")}
              </Button>
            </>
          )}
          <Button
            size="sm"
            onClick={() => toggleSetting("enabled")}
            className="text-xs"
            variant={settings.enabled ? "destructive" : "default"}
          >
            {settings.enabled ? t("Tắt", "Disable") : `+ ${t("Bật chia sẻ", "Enable Share")}`}
          </Button>
        </div>
      </div>

      {!settings.enabled ? (
        <Card className="p-6 text-center text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            {t(
              "Bật chia sẻ lịch trình để tạo link gửi cho nhà cung cấp và người thân",
              "Enable schedule sharing to create links for vendors and family"
            )}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Status Overview */}
          <Card className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{formatDate(state.info.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{timelineCount} {t("hoạt động", "activities")}</span>
              </div>
              {settings.shareToken && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {settings.shareToken}
                  </Badge>
                </div>
              )}
              {settings.password && (
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {t("Được bảo vệ", "Protected")}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-4 space-y-4">
            <h3 className="font-semibold text-sm">
              {t("Cài đặt chia sẻ", "Share Settings")}
            </h3>

            {/* Custom Message */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t("Thông điệp tùy chỉnh", "Custom Message")}
              </label>
              <Textarea
                value={settings.customMessage || ""}
                onChange={(e) => updateTextField("customMessage", e.target.value)}
                placeholder={t(
                  "Lịch trình ngày cưới của chúng tôi...",
                  "Our wedding day schedule..."
                )}
                rows={2}
                className="text-sm"
              />
            </div>

            {/* Password Protection */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t("Mật khẩu (tùy chọn)", "Password (optional)")}
              </label>
              <Input
                type="text"
                value={settings.password || ""}
                onChange={(e) => updateTextField("password", e.target.value)}
                placeholder={t("Để trống nếu không cần mật khẩu", "Leave empty for no password")}
                className="text-sm"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t("Ngày hết hạn (tùy chọn)", "Expiry Date (optional)")}
              </label>
              <Input
                type="date"
                value={settings.expiryDate || ""}
                onChange={(e) => updateTextField("expiryDate", e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Toggle Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showContactInfo}
                  onChange={() => toggleSetting("showContactInfo")}
                  className="rounded"
                />
                <Users className="w-4 h-4" />
                {t("Hiển thị thông tin liên hệ", "Show contact information")}
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showVendorNotes}
                  onChange={() => toggleSetting("showVendorNotes")}
                  className="rounded"
                />
                <FileText className="w-4 h-4" />
                {t("Hiển thị ghi chú nhà cung cấp", "Show vendor notes")}
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowDownload}
                  onChange={() => toggleSetting("allowDownload")}
                  className="rounded"
                />
                <Download className="w-4 h-4" />
                {t("Cho phép tải xuống PDF", "Allow PDF download")}
              </label>
            </div>

            {/* Token Management */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                {t("Mã chia sẻ:", "Share token:")}
              </span>
              <Badge variant="outline">{settings.shareToken}</Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRegenerateToken}
                className="text-xs"
              >
                {t("Tạo mã mới", "Regenerate")}
              </Button>
            </div>
          </Card>

          {/* Share URL */}
          {shareUrl && (
            <Card className="p-4">
              <h3 className="font-semibold text-sm mb-2">
                {t("Link chia sẻ", "Share Link")}
              </h3>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="text-xs"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                  }}
                  className="text-xs"
                >
                  {t("Sao chép", "Copy")}
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Share Dialog */}
      {showShareDialog && (
        <ShareLinkDialog
          shareUrl={shareUrl}
          settings={settings}
          onClose={() => setShowShareDialog(false)}
          lang={lang}
        />
      )}

      {/* Preview */}
      {showPreview && (
        <SchedulePreview
          state={state}
          settings={settings}
          onClose={() => setShowPreview(false)}
          lang={lang}
        />
      )}
    </div>
  );
}