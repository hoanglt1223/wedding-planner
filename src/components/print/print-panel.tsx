import type { CoupleInfo, WeddingStep } from "@/types/wedding";

interface PrintPanelProps {
  info: CoupleInfo;
  steps: WeddingStep[];
}

export function PrintPanel({ info, steps }: PrintPanelProps) {
  return (
    <div className="p-4">
      {/* Print button - hidden when printing */}
      <div className="no-print mb-4 rounded-xl bg-white/5 p-4 shadow">
        <h2 className="mb-2 text-lg font-bold">📖 Sổ Tay In</h2>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
        >
          🖨️ In Sổ Tay
        </button>
      </div>

      {/* Handbook content */}
      <div className="space-y-3">
        {/* Header */}
        <div className="rounded-xl bg-white/5 p-4 text-center shadow">
          <h2 className="text-xl font-bold">💒 SỔ TAY ĐÁM CƯỚI</h2>
          <div className="mt-1 text-base font-bold text-purple-400">
            {info.groom} &amp; {info.bride}
          </div>
          <div className="text-sm text-muted-foreground">
            {info.gf} ♥ {info.bf}
          </div>
        </div>

        {/* Steps */}
        {steps.map((step) => (
          <div key={step.id} className="rounded-xl bg-white/5 p-4 shadow">
            <h2 className="mb-2 text-base font-bold">
              {step.icon} {step.title}
            </h2>
            {step.cers.map((cer, ci) => (
              <div key={ci} className="mb-3">
                <h3 className="text-sm font-semibold">
                  {cer.nm}{" "}
                  <span className="text-xs text-muted-foreground">
                    {cer.req ? "[BẮT BUỘC]" : "[TÙY CHỌN]"}
                  </span>
                </h3>
                {cer.cl?.length > 0 && (
                  <ul className="mt-1 list-inside list-disc space-y-0.5 pl-4 text-xs">
                    {cer.cl.map((item, ii) => (
                      <li key={ii}>
                        {item.t}
                        {item.c ? ` — ${item.c.toLocaleString("vi-VN")}đ` : ""}
                      </li>
                    ))}
                  </ul>
                )}
                {cer.ri?.length > 0 && (
                  <ol className="mt-1 list-inside list-decimal space-y-0.5 pl-4 text-xs">
                    {cer.ri.map((step, ri) => (
                      <li key={ri}>{step}</li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
