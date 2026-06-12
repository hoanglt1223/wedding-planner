import { useState } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";
import type { CoupleInfo, RsvpSettings } from "@/types/wedding";

interface ShareWeddingDetailsProps {
  info: CoupleInfo;
  rsvpSettings: RsvpSettings;
  lang: string;
}

function formatDate(dateStr: string, lang: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildMessage(info: CoupleInfo, rsvpSettings: RsvpSettings, lang: string): string {
  const en = lang === "en";
  const bride = info.bride || (en ? "Bride" : "Cô dâu");
  const groom = info.groom || (en ? "Groom" : "Chú rể");
  const date = formatDate(info.date, lang);
  const venue = rsvpSettings.venue || "";
  const address = rsvpSettings.venueAddress || "";

  const lines: string[] = [];

  if (en) {
    lines.push(`💍 Wedding Invitation`);
    lines.push("");
    lines.push(`${bride} & ${groom}`);
    if (date) lines.push(`📅 ${date}`);
    if (venue) lines.push(`📍 ${venue}`);
    if (address) lines.push(`   ${address}`);
    lines.push("");
    lines.push(`We warmly invite you to celebrate our special day!`);
    if (rsvpSettings.welcomeMessage) {
      lines.push("");
      lines.push(rsvpSettings.welcomeMessage);
    }
  } else {
    lines.push(`💍 Thiệp Mời Cưới`);
    lines.push("");
    lines.push(`${bride} & ${groom}`);
    if (date) lines.push(`📅 ${date}`);
    if (venue) lines.push(`📍 ${venue}`);
    if (address) lines.push(`   ${address}`);
    lines.push("");
    lines.push(`Trân trọng kính mời bạn đến chung vui trong ngày trọng đại của chúng tôi!`);
    if (rsvpSettings.welcomeMessage) {
      lines.push("");
      lines.push(rsvpSettings.welcomeMessage);
    }
  }

  return lines.join("\n");
}

export function ShareWeddingDetails({ info, rsvpSettings, lang }: ShareWeddingDetailsProps) {
  const [copied, setCopied] = useState(false);
  const en = lang === "en";

  const message = buildMessage(info, rsvpSettings, lang);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = message;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--theme-surface)",
        borderColor: "var(--theme-border)",
      }}
    >
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">📤</span>
          <h3 className="text-sm font-semibold" style={{ color: "var(--theme-primary)" }}>
            {en ? "Share Wedding Details" : "Chia Sẻ Thông Tin Cưới"}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          {en
            ? "Copy or share your wedding details with guests"
            : "Sao chép hoặc gửi thông tin cưới cho khách mời"}
        </p>
      </div>

      {/* Message preview */}
      <div className="px-4 pb-3">
        <div className="rounded-lg bg-muted/50 border border-dashed border-gray-300 p-3 text-xs whitespace-pre-wrap leading-relaxed max-h-[180px] overflow-y-auto">
          {message}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors"
          style={{
            backgroundColor: "var(--theme-primary)",
            color: "white",
          }}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              {en ? "Copied!" : "Đã sao chép!"}
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              {en ? "Copy" : "Sao chép"}
            </>
          )}
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          WhatsApp
        </button>
      </div>
    </div>
  );
}
