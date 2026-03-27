import type { ScoredDate } from "@/data/auspicious";
import { getHoangDaoHours } from "@/data/auspicious";
import { getDayChiIndex } from "@/data/auspicious/lunar-service";
import { getCelestialName } from "@/data/auspicious/hoang-dao";

interface WeddingDateDetailProps {
  date: ScoredDate;
  lang?: string;
}

export function WeddingDateDetail({ date, lang = "vi" }: WeddingDateDetailProps) {
  const en = lang === "en";
  const { solar, lunar, canChi, isHoangDao, isTamNuong, isNguyetKy, score, personalWarnings } = date;
  const dayChiIdx = getDayChiIndex(solar.day, solar.month, solar.year);
  const celestialName = getCelestialName(lunar.month, dayChiIdx);
  const hours = getHoangDaoHours(dayChiIdx);

  return (
    <div className="space-y-3">
      {/* Header + score */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-bold">
            {en ? `${solar.day}/${solar.month}/${solar.year}` : `Ngày ${solar.day}/${solar.month}/${solar.year}`}
          </h4>
          <ScoreBadge score={score} lang={lang} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-muted rounded-lg p-2">
            <div className="text-muted-foreground">{en ? "Lunar" : "Âm lịch"}</div>
            <div className="font-medium">{lunar.day}/{lunar.month}{lunar.leap ? " (nhuận)" : ""}</div>
          </div>
          <div className="bg-muted rounded-lg p-2">
            <div className="text-muted-foreground">{en ? "Can Chi" : "Can Chi"}</div>
            <div className="font-medium">{canChi}</div>
          </div>
        </div>
      </div>

      {/* Day status */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3 space-y-2">
        <h4 className="text-sm font-bold">{en ? "Day Quality" : "Chất lượng ngày"}</h4>
        {isHoangDao && !isTamNuong && !isNguyetKy && (
          <StatusBadge emoji="✅" color="bg-green-50 border-green-200 text-green-700"
            text={en ? `Hoang Dao — ${celestialName}` : `Hoàng Đạo — ${celestialName}`} />
        )}
        {!isHoangDao && !isTamNuong && !isNguyetKy && (
          <StatusBadge emoji="⚪" color="bg-gray-50 border-gray-200 text-gray-600"
            text={en ? "Hac Dao Day" : "Ngày Hắc Đạo"} />
        )}
        {isTamNuong && (
          <StatusBadge emoji="🚫" color="bg-red-50 border-red-200 text-red-700"
            text={en ? "Tam Nuong — Avoid weddings" : "Tam Nương — Kiêng cưới hỏi"} />
        )}
        {isNguyetKy && (
          <StatusBadge emoji="⚠️" color="bg-amber-50 border-amber-200 text-amber-700"
            text={en ? "Nguyet Ky — Avoid new undertakings" : "Nguyệt Kỵ — Kiêng khởi sự"} />
        )}
        {personalWarnings.map((w, i) => (
          <StatusBadge key={i} emoji="⚠️" color="bg-amber-50 border-amber-200 text-amber-700" text={w} />
        ))}
      </div>

      {/* Auspicious hours */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3">
        <h4 className="text-sm font-bold mb-2">{en ? "Auspicious Hours" : "Giờ Hoàng Đạo"}</h4>
        <div className="grid grid-cols-3 gap-1.5">
          {hours.filter((h) => h.chiIndex >= 2 && h.chiIndex <= 10).map((h) => (
            <div
              key={h.chiIndex}
              className={`rounded-lg p-1.5 text-center text-[11px] border ${
                h.isHoangDao
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-gray-50 border-gray-100 text-gray-500"
              }`}
            >
              <div className="font-medium">{h.chiName} ({h.timeRange})</div>
              <div className="text-[9px]">{h.celestialName}</div>
              {h.suitableForWedding && <div className="text-[9px] font-bold text-green-600 mt-0.5">
                {en ? "Wedding OK" : "Cưới hỏi tốt"}
              </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreBadge({ score, lang }: { score: number; lang: string }) {
  const en = lang === "en";
  const label = score >= 75 ? (en ? "Excellent" : "Rất tốt")
    : score >= 60 ? (en ? "Good" : "Tốt")
    : score >= 40 ? (en ? "Average" : "Bình thường")
    : (en ? "Not ideal" : "Không lý tưởng");
  const color = score >= 75 ? "bg-green-500 text-white"
    : score >= 60 ? "bg-green-200 text-green-900"
    : score >= 40 ? "bg-gray-200 text-gray-700"
    : "bg-red-200 text-red-900";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{score} — {label}</span>;
}

function StatusBadge({ emoji, color, text }: { emoji: string; color: string; text: string }) {
  return (
    <div className={`rounded-lg border p-2 text-xs ${color}`}>
      {emoji} {text}
    </div>
  );
}
