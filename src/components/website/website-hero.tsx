import { useEffect, useState } from "react";

interface Props {
  bride: string;
  groom: string;
  date: string;
  customMessage?: string;
  heroImage?: string;
  primaryLight: string;
  primary: string;
  lang: string;
}

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;
  const diff = Math.ceil((target.getTime() - Date.now()) / 86_400_000);
  return diff;
}

function formatDate(dateStr: string, lang: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export function WebsiteHero({ bride, groom, date, customMessage, heroImage, primaryLight, primary, lang }: Props) {
  const [days, setDays] = useState<number | null>(null);
  const safeHeroImage = heroImage && /^https?:\/\//i.test(heroImage) ? heroImage : null;

  useEffect(() => {
    setDays(daysUntil(date));
  }, [date]);

  return (
    <div
      className="relative min-h-64 flex flex-col items-center justify-center text-center px-6 py-16"
      style={{ background: safeHeroImage ? undefined : `linear-gradient(to bottom, ${primaryLight}, white)` }}
    >
      {safeHeroImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${CSS.escape(safeHeroImage)})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div className={`relative z-10 ${safeHeroImage ? "text-white" : ""}`}>
        <p className="text-sm font-medium tracking-widest uppercase mb-2 opacity-75">
          {lang === "en" ? "Wedding of" : "Đám Cưới"}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-1" style={{ color: heroImage ? "white" : primary }}>
          {groom}
        </h1>
        <p className="text-2xl my-1 opacity-60">&amp;</p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: heroImage ? "white" : primary }}>
          {bride}
        </h1>
        {date && (
          <p className="text-base font-medium opacity-80 mb-3">{formatDate(date, lang)}</p>
        )}
        {days !== null && days > 0 && (
          <div className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: primary, color: "white" }}>
            {days} {lang === "en" ? "days to go" : "ngày nữa"}
          </div>
        )}
        {days !== null && days <= 0 && (
          <div className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: primary, color: "white" }}>
            {lang === "en" ? "Married!" : "Đã kết hôn!"}
          </div>
        )}
        {customMessage && (
          <p className="text-base italic opacity-80 max-w-md mx-auto">{customMessage}</p>
        )}
      </div>
    </div>
  );
}
