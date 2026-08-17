/**
 * Share Link Dialog
 * Dialog for sharing wedding schedule link
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Mail, MessageCircle } from "lucide-react";
import type { ScheduleShareSettings } from "@/types/wedding-schedule-share";

interface ShareLinkDialogProps {
  shareUrl: string;
  settings: ScheduleShareSettings;
  onClose: () => void;
  lang: "vi" | "en";
}

export function ShareLinkDialog({ shareUrl, settings, onClose, lang }: ShareLinkDialogProps) {
  const [copied, setCopied] = useState(false);

  const t = (vi: string, en: string) => lang === "vi" ? vi : en;

  // Copy URL to clipboard
  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Generate WhatsApp message
  function getWhatsAppMessage() {
    const message = settings.customMessage ||
      (lang === "vi"
        ? `Chào mừng đến với đám cưới của chúng tôi! Đây là lịch trình ngày cưới: ${shareUrl}`
        : `Welcome to our wedding! Here's our wedding day schedule: ${shareUrl}`
      );
    return encodeURIComponent(message);
  }

  // Generate email subject and body
  function getEmailContent() {
    const subject = lang === "vi"
      ? "Lịch trình ngày cưới"
      : "Wedding Day Schedule";

    const body = settings.customMessage ||
      (lang === "vi"
        ? `Chào bạn,\n\nĐây là link xem lịch trình ngày cưới của chúng tôi:\n${shareUrl}\n\nRất mong được gặp bạn tại đám cưới!`
        : `Hi there,\n\nHere's the link to view our wedding day schedule:\n${shareUrl}\n\nWe look forward to seeing you at our wedding!`
      );

    return { subject, body };
  }

  const { subject, body } = getEmailContent();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-background max-w-md w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">
            {t("Chia sẻ lịch trình", "Share Schedule")}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Share URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("Link chia sẻ", "Share Link")}
          </label>
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="text-sm"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              size="sm"
              onClick={handleCopy}
              className="min-w-[60px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  {t("Đã sao chép", "Copied")}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  {t("Sao chép", "Copy")}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Share Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("Chia sẻ nhanh", "Quick Share")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${getWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>

            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              {t("Email", "Email")}
            </a>
          </div>
        </div>

        {/* Message Template */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("Thông điệp mẫu", "Message Template")}
          </label>
          <Textarea
            value={body}
            readOnly
            rows={6}
            className="text-sm"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(body);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                {t("Đã sao chép", "Copied")}
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                {t("Sao chép thông điệp", "Copy message")}
              </>
            )}
          </Button>
        </div>

        {/* Security Notice */}
        {settings.password && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 text-sm">
            <p className="text-yellow-800 dark:text-yellow-200">
              🔒 {t(
                "Link này được bảo vệ bằng mật khẩu",
                "This link is password-protected"
              )}
            </p>
          </div>
        )}

        {/* Close Button */}
        <Button onClick={onClose} className="w-full">
          {t("Đóng", "Close")}
        </Button>
      </Card>
    </div>
  );
}