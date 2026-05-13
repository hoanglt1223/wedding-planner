import { useEffect, useCallback } from "react";
import { t } from "@/lib/i18n";
import { getElementEmoji } from "@/lib/lunar-calendar";
import type { FullDateInfo } from "@/lib/lunar-calendar";

interface LunarDateDetailProps {
  info: FullDateInfo | null;
  lang: string;
  onClose: () => void;
}

function Row({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <div className="flex items-start gap-2 py-1.5 border-b border-gray-100 last:border-0">
      {icon && <span className="text-sm shrink-0 mt-0.5">{icon}</span>}
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground leading-tight">{label}</p>
        <p className="text-sm leading-snug">{value}</p>
      </div>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {text}
    </span>
  );
}

export function LunarDateDetail({ info, lang, onClose }: LunarDateDetailProps) {
  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (!info) return;
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [info, handleEsc]);

  if (!info) return null;

  const en = lang === "en";
  const { solar, lunar, can_chi, elements, stars_12, constructions_12, gods_12, mansions_28, nayin, day_type, conflicting_ages, directions, god_directions, solar_term, auspicious_hours } = info;

  const isGood = day_type.good;
  const dayTypeLabel = day_type.type;
  const dayTypeColor = isGood
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";

  const starColor = stars_12.status === "good"
    ? "bg-emerald-100 text-emerald-700"
    : stars_12.status === "bad"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-600";

  const godColor = gods_12.status === "good"
    ? "bg-blue-100 text-blue-700"
    : "bg-orange-100 text-orange-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl px-5 pt-5 pb-3 border-b">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-bold">
                {solar.day}/{solar.month}/{solar.year}
                <span className="text-sm font-normal text-muted-foreground ml-2">{solar.dayOfWeek}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {en ? "Lunar" : "Âm lịch"}: {lunar.day}/{lunar.month}{lunar.leap ? "*" : ""} ({lunar.monthName})
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none" aria-label={t("Đóng", lang)}>
              ×
            </button>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge text={dayTypeLabel} color={dayTypeColor} />
            <Badge text={`⭐ ${stars_12.name}`} color={starColor} />
            <Badge text={gods_12.name} color={godColor} />
            {solar_term && <Badge text={`🌿 ${solar_term}`} color="bg-teal-100 text-teal-700" />}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-3 space-y-1">
          {/* Can Chi */}
          <Row icon="📅" label={en ? "Day Can Chi" : "Can Chi ngày"} value={can_chi.day} />
          <Row icon="📆" label={en ? "Month Can Chi" : "Can Chi tháng"} value={can_chi.month} />
          <Row icon="🗓️" label={en ? "Year Can Chi" : "Can Chi năm"} value={can_chi.year} />

          {/* Elements */}
          <Row
            icon={getElementEmoji(elements.year.element)}
            label={en ? "Year Element (Nạp Âm)" : "Ngũ Hành năm (Nạp Âm)"}
            value={`${elements.year.can_chi} — ${elements.year.name} (${elements.year.element})`}
          />

          {/* Nayin */}
          <Row
            icon="🎵"
            label={en ? "Nayin (Nạp Âm day)" : "Nạp Âm ngày"}
            value={`${nayin.name} (${nayin.element})`}
          />

          {/* 12 Stars */}
          <Row
            icon="⭐"
            label={en ? "12 Stars (Trực)" : "Sao 12 (Trực)"}
            value={`${stars_12.name} — ${stars_12.description}`}
          />

          {/* 12 Gods */}
          <Row
            icon="🛡️"
            label={en ? "12 Gods (Thần)" : "Thần 12"}
            value={`${gods_12.name} — ${gods_12.description}`}
          />

          {/* 12 Constructions */}
          <Row
            icon="🏗️"
            label={en ? "12 Constructions (Kiến Trừ)" : "Kiến Trừ 12"}
            value={constructions_12.name}
          />
          {constructions_12.good_for.length > 0 && (
            <div className="pl-7 text-xs text-green-700">
              ✓ {en ? "Good for" : "Nên"}: {constructions_12.good_for.join(", ")}
            </div>
          )}
          {constructions_12.bad_for.length > 0 && (
            <div className="pl-7 text-xs text-red-600">
              ✗ {en ? "Avoid" : "Tránh"}: {constructions_12.bad_for.join(", ")}
            </div>
          )}

          {/* 28 Mansions */}
          <Row
            icon="✨"
            label={en ? "28 Mansions (Nhị Thập Bát Tú)" : "Nhị Thập Bát Tú"}
            value={`${mansions_28.name} (${mansions_28.animal}, ${mansions_28.element}) — ${mansions_28.good ? (en ? "Auspicious" : "Tốt") : (en ? "Inauspicious" : "Xấu")}`}
          />

          {/* Day type details */}
          <Row
            icon={isGood ? "☀️" : "🌑"}
            label={en ? "Day Quality" : "Chất lượng ngày"}
            value={`${day_type.star} — ${day_type.desc}`}
          />

          {/* Auspicious hours */}
          <Row icon="⏰" label={en ? "Auspicious Hours" : "Giờ Hoàng Đạo"} value={auspicious_hours} />

          {/* God directions */}
          <Row
            icon="🧭"
            label={en ? "God Directions" : "Hướng Thần"}
            value={`${en ? "Joy" : "Hỷ Thần"}: ${god_directions.joy_god} · ${en ? "Wealth" : "Tài Thần"}: ${god_directions.wealth_god} · ${en ? "Fortune" : "Phúc Thần"}: ${god_directions.fortune_god}`}
          />

          {/* Directions */}
          {directions.good.length > 0 && (
            <Row icon="👍" label={en ? "Good Directions" : "Hướng tốt"} value={directions.good.join(", ")} />
          )}
          {directions.bad.length > 0 && (
            <Row icon="👎" label={en ? "Bad Directions" : "Hướng xấu"} value={directions.bad.join(", ")} />
          )}

          {/* Conflicting ages */}
          <Row
            icon="⚠️"
            label={en ? "Conflicting Direction" : "Xung tuổi"}
            value={`${conflicting_ages.day_chi} (${conflicting_ages.day_animal}) ↔ ${conflicting_ages.conflict_chi} (${conflicting_ages.conflict_animal})`}
          />
          {conflicting_ages.conflicting_ages.length > 0 && (
            <div className="pl-7 text-xs text-orange-600">
              {conflicting_ages.conflicting_ages.map(a =>
                `${a.can_chi} (${a.animal}, ${en ? "age" : "tuổi"} ${a.age})`
              ).join("; ")}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-2">
          <button onClick={onClose} className="w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition">
            {t("Đóng", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
