import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/format";

interface RsvpHeroProps {
  bride: string;
  groom: string;
  date: string;
  welcomeMessage: string;
  primaryLight: string;
  lang: string;
}

export function RsvpHero({ bride, groom, date, welcomeMessage, primaryLight, lang }: RsvpHeroProps) {
  const locale = getLocale(lang);
  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div
      className="text-center py-10 px-6 rounded-b-3xl"
      style={{ background: `linear-gradient(to bottom, ${primaryLight}, white)` }}
    >
      <div className="text-5xl mb-4">💒</div>
      <h1 className="text-2xl font-bold text-[#2c1810] mb-1">
        {bride || (lang === "en" ? "Bride" : "Cô dâu")} & {groom || (lang === "en" ? "Groom" : "Chú rể")}
      </h1>
      {formattedDate && (
        <p className="text-sm text-[#8a7060] mt-2">{t("Thời gian", lang)}: {formattedDate}</p>
      )}
      {welcomeMessage && (
        <p className="text-sm text-[#5a4a3a] mt-3 max-w-sm mx-auto italic">{welcomeMessage}</p>
      )}
    </div>
  );
}
