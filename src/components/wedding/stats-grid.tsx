import { formatShort } from "@/lib/format";

interface StatsGridProps {
  totalSteps: number;
  done: number;
  total: number;
  budget: number;
  progressPct: number;
}

export function StatsGrid({ totalSteps, done, total, budget, progressPct }: StatsGridProps) {
  const stats = [
    { value: String(totalSteps), label: "Bước" },
    { value: `${done}/${total}`, label: "Xong" },
    { value: formatShort(budget), label: "Budget" },
    { value: `${progressPct}%`, label: "Tiến độ" },
  ];

  return (
    <div className="grid grid-cols-4 gap-1.5 mb-2.5 max-sm:grid-cols-2">
      {stats.map((s) => (
        <div key={s.label} className="bg-[var(--theme-surface)] rounded-xl p-3 shadow-sm border border-[var(--theme-border)] text-center py-2.5 px-1">
          <div className="text-lg font-extrabold text-primary">{s.value}</div>
          <div className="text-2xs text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
