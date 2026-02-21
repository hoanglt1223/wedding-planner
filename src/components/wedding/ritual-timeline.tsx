interface RitualTimelineProps {
  steps: string[];
}

export function RitualTimeline({ steps }: RitualTimelineProps) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm mb-2">
      <h2 className="text-sm font-bold text-red-800 mb-2">🎎 Trình Tự</h2>
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-2.5 top-1 bottom-1 w-px bg-red-200" />
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="relative flex items-start gap-2">
              {/* Circle marker */}
              <div className="absolute -left-6 flex items-center justify-center w-5 h-5 rounded-full bg-red-700 text-white text-[0.6rem] font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="ml-0.5">
                <div className="text-[0.68rem] font-semibold text-amber-700 mb-0.5">
                  Bước {i + 1}
                </div>
                <div className="text-xs text-gray-700">{step}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
