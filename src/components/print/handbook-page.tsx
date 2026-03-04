import type { WeddingStep } from "@/types/wedding";
import { t } from "@/lib/i18n";
import { getLocale, getCurrencySymbol } from "@/lib/format";

interface HandbookPageProps {
  step: WeddingStep;
  chapterNum: number;
  pageNum: number;
  lang: string;
}

export function HandbookPage({ step, chapterNum, pageNum, lang }: HandbookPageProps) {
  const locale = getLocale(lang);
  const cur = getCurrencySymbol(lang);
  const fmCost = (n: number) => `${n.toLocaleString(locale)}${cur}`;

  return (
    <div
      data-book-page
      className="book-page bg-white relative rounded-xl shadow-md overflow-hidden"
      style={{ minHeight: "min(90vh, 1100px)" }}
    >
      {/* Decorative border */}
      <div className="absolute inset-3 border border-gray-200 rounded pointer-events-none" />

      <div className="px-8 py-6 sm:px-12 sm:py-10">
        {/* Chapter header */}
        <div className="text-center mb-6 pb-4 border-b-2 border-gray-200">
          <div className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-1">
            {lang === "en" ? `Chapter ${chapterNum}` : `Chương ${chapterNum}`}
          </div>
          <div className="text-3xl mb-2">{step.icon}</div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif">{step.title}</h2>
          {step.optional && (
            <span className="inline-block mt-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {lang === "en" ? "Optional" : "Tùy chọn"}
            </span>
          )}
          {step.formalName && (
            <div className="text-sm text-gray-400 italic mt-1">{step.formalName}</div>
          )}
        </div>

        {/* Meaning callout */}
        {step.meaning && (
          <div className="mb-5 mx-2 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r">
            <div className="text-xs font-bold text-amber-800 mb-1">{t("Ý nghĩa", lang)}</div>
            <p className="text-sm text-amber-700 leading-relaxed italic">{step.meaning}</p>
          </div>
        )}

        {/* Ceremonies */}
        {step.ceremonies.map((cer, ci) => {
          const checkable = cer.steps.filter((s) => s.checkable);
          const sequence = cer.steps.filter((s) => !s.checkable);
          const hasTimed = sequence.some((s) => s.time);

          return (
            <div key={ci} className="mb-5 last:mb-0">
              <h3 className="text-sm sm:text-base font-bold mb-2 flex items-center gap-2 flex-wrap">
                <span>{cer.name}</span>
                <span
                  className={`text-2xs px-1.5 py-0.5 rounded ${
                    cer.required
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {cer.required ? t("BẮT BUỘC", lang) : t("TÙY CHỌN", lang)}
                </span>
              </h3>

              {/* Checklist items */}
              {checkable.length > 0 && (
                <div className="space-y-1.5 ml-1 mb-3">
                  {checkable.map((item, ii) => (
                    <div key={ii} className="text-sm">
                      <div className="flex items-start gap-2.5">
                        <span className="inline-block w-4 h-4 border-2 border-gray-400 rounded-sm shrink-0 mt-0.5 print:border-gray-600" />
                        <span className="flex-1">
                          {item.text}
                          {item.cost != null && item.cost > 0 && (
                            <span className="ml-1 text-gray-400">({fmCost(item.cost)})</span>
                          )}
                        </span>
                      </div>
                      {item.detail && (
                        <div className="ml-7 text-xs text-gray-500 leading-relaxed mt-0.5">
                          {item.detail}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Timed schedule table */}
              {sequence.length > 0 && (
                <div className="mt-2 ml-1 mb-3">
                  <div className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                    {t("Lịch trình chi tiết:", lang)}
                  </div>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-1 pr-2 text-gray-500 font-semibold w-12">
                          {hasTimed ? t("Giờ", lang) : t("Bước", lang)}
                        </th>
                        <th className="text-left py-1 pr-2 text-gray-500 font-semibold">
                          {t("Hoạt động", lang)}
                        </th>
                        <th className="text-left py-1 text-gray-500 font-semibold w-20">
                          {t("Phụ trách", lang)}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sequence.map((s, ti) => (
                        <tr key={ti} className="border-b border-gray-100">
                          <td className="py-1 pr-2 font-mono font-semibold text-primary align-top whitespace-nowrap">
                            {hasTimed ? s.time || "" : ti + 1}
                          </td>
                          <td className="py-1 pr-2 text-gray-700 align-top">
                            {s.text}
                            {s.note && <span className="text-gray-400 ml-1">({s.note})</span>}
                          </td>
                          <td className="py-1 text-gray-500 align-top">{s.responsible || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Gifts */}
              {cer.gifts && cer.gifts.length > 0 && (
                <div className="mt-2 ml-1 mb-3">
                  <div className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                    {t("Lễ vật:", lang)}
                  </div>
                  <div className="space-y-1">
                    {cer.gifts.map((gift, gi) => (
                      <div key={gi} className="flex items-start gap-2.5 text-sm">
                        <span className="inline-block w-4 h-4 border-2 border-gray-400 rounded-sm shrink-0 mt-0.5 print:border-gray-600" />
                        <span className="flex-1">
                          {gift.name}
                          {gift.quantity && <span className="text-gray-400"> x{gift.quantity}</span>}
                          {gift.cost > 0 && (
                            <span className="ml-1 text-gray-400">({fmCost(gift.cost)})</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Step notes */}
        {step.notes && step.notes.length > 0 && (
          <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-3">
            <div className="text-xs font-bold text-blue-800 mb-1">{t("Lưu ý quan trọng", lang)}</div>
            {step.notes.map((note, ni) => (
              <div key={ni} className="text-xs text-blue-700 leading-relaxed">
                • {note}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-300">
        {pageNum}
      </div>
    </div>
  );
}
