import { t } from "@/lib/i18n";

interface RsvpCoupleStoryProps {
  story: string;
  lang: string;
}

export function RsvpCoupleStory({ story, lang }: RsvpCoupleStoryProps) {
  if (!story) return null;

  return (
    <div className="rounded-xl border border-[#e8ddd0] bg-white/80 p-4 space-y-2">
      <h2 className="text-sm font-semibold text-[#2c1810] flex items-center gap-2">
        💕 {t("Câu chuyện của chúng tôi", lang)}
      </h2>
      <p className="text-sm text-[#5a4a3a] whitespace-pre-line">{story}</p>
    </div>
  );
}
