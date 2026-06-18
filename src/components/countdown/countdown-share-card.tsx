import { useState } from "react";
import { useCountdown } from "./use-countdown";
import type { CoupleInfo } from "@/types/wedding";

interface CountdownShareCardProps {
  info: CoupleInfo;
  lang: string;
}

function formatDate(dateStr: string, lang: string): string {
  if (!dateStr) return lang === "en" ? "Date TBD" : "Chưa chọn ngày";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return lang === "en" ? "Date TBD" : "Chưa chọn ngày";

  const months =
    lang === "en"
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      : ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}

export function CountdownShareCard({ info, lang }: CountdownShareCardProps) {
  const { days, status } = useCountdown(info.date);
  const [copied, setCopied] = useState(false);
  const en = lang === "en";

  const brideName = info.bride || (en ? "Bride" : "Cô dâu");
  const groomName = info.groom || (en ? "Groom" : "Chú rể");

  async function handleShare() {
    const shareText = en
      ? `${groomName} & ${brideName} are getting married! ${days > 0 ? `${days} days to go!` : "Today is the day!"} 🎉💒\n📅 ${formatDate(info.date, lang)}`
      : `${groomName} & ${brideName} sắp cưới! ${days > 0 ? `Còn ${days} ngày nữa!` : "Hôm nay là ngày cưới!"} 🎉💒\n📅 ${formatDate(info.date, lang)}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: en ? "Wedding Countdown" : "Đếm ngược đám cưới", text: shareText });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (status === "no-date") return null;

  const isToday = status === "today";
  const isPast = status === "past";

  return (
    <div className="space-y-2">
      <div
        className="relative overflow-hidden rounded-2xl border p-5 text-center space-y-3"
        style={{
          background: `linear-gradient(135deg, var(--theme-primary-light), var(--theme-surface))`,
          borderColor: "var(--theme-border)",
        }}
      >
        {/* Decorative hearts */}
        <div className="absolute top-2 left-3 text-lg opacity-20" style={{ color: "var(--theme-primary)" }}>♥</div>
        <div className="absolute top-4 right-4 text-sm opacity-15" style={{ color: "var(--theme-primary)" }}>♥</div>
        <div className="absolute bottom-3 left-5 text-xs opacity-10" style={{ color: "var(--theme-primary)" }}>♥</div>
        <div className="absolute bottom-2 right-6 text-lg opacity-20" style={{ color: "var(--theme-primary)" }}>♥</div>

        {/* Couple names */}
        <div>
          <p className="text-lg font-bold" style={{ color: "var(--theme-primary)" }}>
            {groomName}
          </p>
          <p className="text-2xl font-light" style={{ color: "var(--theme-accent)" }}>
            &amp;
          </p>
          <p className="text-lg font-bold" style={{ color: "var(--theme-primary)" }}>
            {brideName}
          </p>
        </div>

        {/* Date */}
        <p className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--theme-primary-dark)" }}>
          {formatDate(info.date, lang)}
        </p>

        {/* Countdown number */}
        {isToday ? (
          <div className="space-y-1">
            <span className="text-4xl block">💒</span>
            <p className="text-lg font-bold" style={{ color: "var(--theme-primary)" }}>
              {en ? "Today!" : "Hôm nay!"}
            </p>
          </div>
        ) : isPast ? (
          <p className="text-sm font-medium" style={{ color: "var(--theme-primary-dark)" }}>
            {en ? "Just Married!" : "Đã cưới!"}
          </p>
        ) : (
          <div className="space-y-1">
            <p
              className="text-5xl font-bold tracking-tight"
              style={{ color: "var(--theme-primary)" }}
            >
              {days}
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--theme-primary-dark)" }}>
              {en ? "days to go" : "ngày nữa"}
            </p>
          </div>
        )}

        {/* Subtitle */}
        <p className="text-2xs opacity-60" style={{ color: "var(--theme-primary-dark)" }}>
          {en ? "Save the Date" : "Giữ ngày nhé"}
        </p>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="w-full py-2 text-xs font-medium rounded-lg border transition-colors hover:opacity-80"
        style={{
          borderColor: "var(--theme-border)",
          color: "var(--theme-primary)",
          backgroundColor: "var(--theme-surface)",
        }}
      >
        {copied
          ? (en ? "✓ Copied!" : "✓ Đã sao chép!")
          : (en ? "📤 Share Countdown" : "📤 Chia sẻ đếm ngược")}
      </button>
    </div>
  );
}
