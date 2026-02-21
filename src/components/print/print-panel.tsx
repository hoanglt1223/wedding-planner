import type { CoupleInfo, WeddingStep } from "@/types/wedding";
import { EventTimeline } from "./event-timeline";

interface PrintPanelProps {
  info: CoupleInfo;
  steps: WeddingStep[];
}

export function PrintPanel({ info, steps }: PrintPanelProps) {
  const totalItems = steps.reduce(
    (sum, s) => sum + s.ceremonies.reduce((cs, c) => cs + c.checklist.length, 0),
    0,
  );

  return (
    <div className="p-3 sm:p-4">
      {/* Print button - hidden when printing */}
      <div className="no-print mb-4 rounded-xl bg-white p-4 shadow">
        <h2 className="mb-1 text-lg font-bold">📖 Sổ Tay In</h2>
        <p className="mb-3 text-xs text-gray-500">
          {steps.length} bước · {totalItems} checklist items — in ra để tick tay
        </p>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
        >
          🖨️ In Sổ Tay
        </button>
      </div>

      {/* Handbook content - print-friendly */}
      <div className="space-y-3 print-clean">
        {/* Header */}
        <div className="rounded-xl bg-white p-4 text-center shadow print-clean">
          <h2 className="text-lg sm:text-xl font-bold">💒 SỔ TAY ĐÁM CƯỚI</h2>
          <div className="mt-1 text-base font-bold text-red-700">
            {info.groom} &amp; {info.bride}
          </div>
          <div className="text-sm text-gray-500">
            {info.groomFamilyName} ♥ {info.brideFamilyName}
          </div>
          {info.date && (
            <div className="mt-1 text-xs text-gray-400">
              Ngày cưới: {new Date(info.date).toLocaleDateString("vi-VN")}
            </div>
          )}
        </div>

        <EventTimeline info={info} />

        {/* Steps with checklists */}
        {steps.map((step) => (
          <div key={step.id} className="rounded-xl bg-white p-3 sm:p-4 shadow print-clean">
            <h2 className="mb-1 text-sm sm:text-base font-bold border-b border-gray-200 pb-1">
              {step.icon} {step.title}
            </h2>
            {step.formalName && (
              <div className="text-[0.65rem] text-gray-400 italic mb-1.5">
                Tên chính thức: {step.formalName}
              </div>
            )}
            {step.meaning && (
              <div className="mb-2 rounded border border-amber-200 bg-amber-50 p-2">
                <div className="text-[0.65rem] font-semibold text-amber-800 mb-0.5">📖 Ý nghĩa</div>
                <p className="text-[0.65rem] text-amber-700 leading-relaxed">{step.meaning}</p>
              </div>
            )}
            {step.notes && step.notes.length > 0 && (
              <div className="mb-2 rounded border border-blue-200 bg-blue-50 p-2">
                <div className="text-[0.65rem] font-semibold text-blue-800 mb-0.5">📝 Lưu ý quan trọng</div>
                {step.notes.map((note, ni) => (
                  <div key={ni} className="text-[0.65rem] text-blue-700 leading-relaxed">• {note}</div>
                ))}
              </div>
            )}

            {step.ceremonies.map((cer, ci) => (
              <div key={ci} className="mb-4 last:mb-0">
                <h3 className="text-xs sm:text-sm font-semibold mb-1.5 flex items-center gap-1.5 flex-wrap">
                  <span>{cer.name}</span>
                  <span className={`text-[0.65rem] px-1.5 py-0.5 rounded ${
                    cer.required
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {cer.required ? "BẮT BUỘC" : "TÙY CHỌN"}
                  </span>
                </h3>

                {/* Printable checklist with checkbox squares */}
                {cer.checklist?.length > 0 && (
                  <div className="space-y-1 ml-1">
                    {cer.checklist.map((item, ii) => (
                      <div key={ii} className="text-xs">
                        <div className="flex items-start gap-2">
                          <span className="inline-block w-3.5 h-3.5 border-2 border-gray-400 rounded-sm flex-shrink-0 mt-0.5 print:border-gray-600" />
                          <span className="flex-1">
                            {item.text}
                            {item.cost > 0 && (
                              <span className="ml-1 text-gray-400">
                                ({item.cost.toLocaleString("vi-VN")}đ)
                              </span>
                            )}
                          </span>
                        </div>
                        {item.detail && (
                          <div className="ml-6 text-[0.6rem] text-gray-500 leading-relaxed mt-0.5">
                            {item.detail}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Ritual steps */}
                {cer.ritualSteps?.length > 0 && (
                  <div className="mt-2 ml-1">
                    <div className="text-[0.65rem] font-semibold text-gray-500 mb-1 uppercase">
                      Trình tự:
                    </div>
                    <ol className="space-y-0.5 pl-4 text-xs list-decimal list-inside">
                      {cer.ritualSteps.map((ritualStep, ri) => (
                        <li key={ri} className="text-gray-700">{ritualStep}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Gifts/offerings */}
                {cer.gifts && cer.gifts.length > 0 && (
                  <div className="mt-2 ml-1">
                    <div className="text-[0.65rem] font-semibold text-gray-500 mb-1 uppercase">
                      Lễ vật:
                    </div>
                    <div className="space-y-0.5">
                      {cer.gifts.map((gift, gi) => (
                        <div key={gi} className="flex items-start gap-2 text-xs">
                          <span className="inline-block w-3.5 h-3.5 border-2 border-gray-400 rounded-sm flex-shrink-0 mt-0.5 print:border-gray-600" />
                          <span className="flex-1">
                            {gift.name}
                            {gift.quantity && <span className="text-gray-400"> x{gift.quantity}</span>}
                            {gift.cost > 0 && (
                              <span className="ml-1 text-gray-400">
                                ({gift.cost.toLocaleString("vi-VN")}đ)
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline detail */}
                {cer.timelineDetail && cer.timelineDetail.length > 0 && (
                  <div className="mt-2 ml-1">
                    <div className="text-[0.65rem] font-semibold text-gray-500 mb-1 uppercase">
                      🕐 Lịch trình chi tiết:
                    </div>
                    <table className="w-full text-[0.65rem]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-0.5 pr-2 text-gray-500 font-semibold w-10">Giờ</th>
                          <th className="text-left py-0.5 pr-2 text-gray-500 font-semibold">Hoạt động</th>
                          <th className="text-left py-0.5 text-gray-500 font-semibold w-16">Phụ trách</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cer.timelineDetail.map((entry, ti) => (
                          <tr key={ti} className="border-b border-gray-50">
                            <td className="py-0.5 pr-2 font-mono font-semibold text-red-700 align-top whitespace-nowrap">{entry.time}</td>
                            <td className="py-0.5 pr-2 text-gray-700 align-top">
                              {entry.activity}
                              {entry.note && <span className="text-gray-400 ml-1">({entry.note})</span>}
                            </td>
                            <td className="py-0.5 text-gray-500 align-top">{entry.responsible}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tips */}
                {cer.tips?.length > 0 && (
                  <div className="mt-2 ml-1 text-xs text-gray-500 italic">
                    {cer.tips.map((tip, ti) => (
                      <div key={ti}>💡 {tip}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Footer note */}
        <div className="text-center text-xs text-gray-400 pt-2 print-clean">
          Vietnamese Wedding Planner — In ngày{" "}
          {new Date().toLocaleDateString("vi-VN")}
        </div>
      </div>
    </div>
  );
}
