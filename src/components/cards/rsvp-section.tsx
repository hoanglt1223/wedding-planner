import { useState } from "react";
import type { CoupleInfo } from "@/types/wedding";

interface RsvpSectionProps {
  info: CoupleInfo;
}

export function RsvpSection({ info }: RsvpSectionProps) {
  const [copied, setCopied] = useState(false);

  const fmDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "...";

  const rsvpText = `💒 THIỆP MỜI ĐÁM CƯỚI 💒

${info.groomFamilyName} & ${info.brideFamilyName} trân trọng kính mời bạn đến dự lễ cưới của:

💑 ${info.groom} & ${info.bride}

📅 Ngày cưới: ${fmDate(info.date)}
${info.betrothalDate ? `📅 Đám hỏi: ${fmDate(info.betrothalDate)}` : ""}
${info.engagementDate ? `📅 Dạm ngõ: ${fmDate(info.engagementDate)}` : ""}

Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi! 🎉

Xin vui lòng xác nhận tham dự. Xin cảm ơn! 🙏`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rsvpText.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = rsvpText.trim();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h2 className="mb-2 text-base font-bold">📱 RSVP — Gửi cho khách</h2>
      <p className="mb-3 text-xs text-muted-foreground">
        Copy tin nhắn bên dưới gửi qua Zalo, SMS, Messenger để mời khách
      </p>
      <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm whitespace-pre-line text-gray-700 leading-relaxed">
        {rsvpText.trim()}
      </div>
      <button
        onClick={handleCopy}
        className={`mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
          copied ? "bg-green-500" : "bg-blue-600 hover:bg-blue-500"
        }`}
      >
        {copied ? "✅ Đã copy!" : "📋 Copy tin nhắn"}
      </button>
    </div>
  );
}
