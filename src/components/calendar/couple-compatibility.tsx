import { t } from "@/lib/i18n";
import { getElement, getCompatibility, getElementEmoji, getElementNameEn } from "@/data/auspicious";

interface CoupleCompatibilityProps {
  brideBirthYear: number | null;
  groomBirthYear: number | null;
  lang: string;
}

export function CoupleCompatibility({ brideBirthYear, groomBirthYear, lang }: CoupleCompatibilityProps) {
  if (!brideBirthYear || !groomBirthYear) return null;

  const brideEl = getElement(brideBirthYear);
  const groomEl = getElement(groomBirthYear);
  const compat = getCompatibility(brideEl, groomEl, lang);

  const isEN = lang === "en";
  const relLabel = compat.relationship === "tuong-sinh"
    ? t("Tương Sinh", lang)
    : compat.relationship === "tuong-khac"
    ? t("Tương Khắc", lang)
    : t("Bình thường", lang);

  const borderColor = compat.favorable ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50";
  const relColor = compat.favorable ? "text-green-700" : "text-red-700";

  return (
    <div className={`rounded-xl border p-4 mt-4 ${borderColor}`}>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {t("Ngũ Hành", lang)} — {lang === "vi" ? "Tương Hợp Đôi Uyên" : "Couple Compatibility"}
      </h3>

      <div className="flex items-center justify-around mb-3">
        {/* Bride element */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">{getElementEmoji(brideEl)}</span>
          <span className="text-xs font-medium text-gray-700">
            {lang === "vi" ? "Cô dâu" : "Bride"}
          </span>
          <span className="text-sm font-semibold">
            {isEN ? getElementNameEn(brideEl) : brideEl}
          </span>
          <span className="text-xs text-gray-400">({brideBirthYear})</span>
        </div>

        {/* Relationship symbol */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl">{compat.favorable ? "♡" : "⚡"}</span>
          <span className={`text-xs font-semibold ${relColor}`}>{relLabel}</span>
        </div>

        {/* Groom element */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">{getElementEmoji(groomEl)}</span>
          <span className="text-xs font-medium text-gray-700">
            {lang === "vi" ? "Chú rể" : "Groom"}
          </span>
          <span className="text-sm font-semibold">
            {isEN ? getElementNameEn(groomEl) : groomEl}
          </span>
          <span className="text-xs text-gray-400">({groomBirthYear})</span>
        </div>
      </div>

      <p className="text-xs text-center text-gray-600 italic">{compat.description}</p>
    </div>
  );
}
