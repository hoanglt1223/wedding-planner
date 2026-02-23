import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AiReadingCardProps {
  birthDate: string;
  birthHour: number | null;
  gender: string;
  currentYear: number;
  lang?: string;
}

export function AiReadingCard({ birthDate, birthHour, gender, currentYear, lang = "vi" }: AiReadingCardProps) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [cached, setCached] = useState(false);

  const hasFullData = Boolean(birthDate && birthHour !== null);
  const en = lang === "en";

  const fetchReading = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/astrology-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate, birthHour, gender, currentYear, lang }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(data.message || (en ? "You've reached today's limit. Please try again tomorrow." : "Bạn đã hết lượt xem hôm nay. Vui lòng thử lại ngày mai."));
        } else if (res.status === 503) {
          setError(en ? "AI feature is under maintenance. Please try again later." : "Tính năng AI đang bảo trì. Vui lòng thử lại sau.");
        } else {
          setError(en ? "Unable to generate analysis. Please try again." : "Không thể tạo phân tích. Vui lòng thử lại.");
        }
        return;
      }

      setText(data.text);
      setCached(data.cached ?? false);
    } catch {
      setError(en ? "Connection error. Please check your network and try again." : "Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 space-y-3">
      <h3 className="text-sm font-bold">{en ? "🔮 Detailed AI Analysis" : "🔮 Phân Tích Chi Tiết (AI)"}</h3>

      {!hasFullData && (
        <p className="text-xs text-muted-foreground">
          {en ? "Enter full birth date and birth hour to unlock detailed AI analysis." : "Nhập đầy đủ ngày sinh và giờ sinh để mở khóa phân tích chi tiết bằng AI."}
        </p>
      )}

      {!text && (
        <Button
          onClick={fetchReading}
          disabled={!hasFullData || loading}
          className="w-full"
          variant={hasFullData ? "default" : "outline"}
          aria-label={loading ? (en ? "Analyzing..." : "Đang phân tích tử vi") : (en ? "Get AI reading" : "Xếp chi tiết tử vi bằng AI")}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner />
              {en ? "Analyzing..." : "Đang phân tích tử vi..."}
            </span>
          ) : (
            en ? "🔮 Get Detailed Reading" : "🔮 Xếp Chi Tiết"
          )}
        </Button>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex items-start justify-between gap-2">
          <span>{error}</span>
          <button
            onClick={fetchReading}
            className="shrink-0 underline text-xs text-red-600 hover:text-red-800"
          >
            {en ? "Retry" : "Thử lại"}
          </button>
        </div>
      )}

      {text && (
        <div className="space-y-2">
          <div className="bg-[var(--theme-surface-muted,var(--theme-surface))] rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap border border-[var(--theme-border)]">
            {text}
          </div>
          {cached && (
            <p className="text-xs text-muted-foreground text-center">
              {en ? "📋 Result from cache" : "📋 Kết quả từ bộ nhớ đệm"}
            </p>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setText(""); setCached(false); setError(""); }}
            className="w-full text-xs"
          >
            {en ? "Get new reading" : "Xếp lại"}
          </Button>
        </div>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
