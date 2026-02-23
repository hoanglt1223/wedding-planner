interface BarItem {
  label: string;
  value: number;
  color?: string;
}

interface AdminBarChartProps {
  data: BarItem[];
  title?: string;
}

export function AdminBarChart({ data, title }: AdminBarChartProps) {
  if (!data.length) {
    return (
      <div>
        {title && <p className="text-sm font-medium text-foreground mb-3">{title}</p>}
        <p className="text-xs text-muted-foreground">No data</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div>
      {title && <p className="text-sm font-medium text-foreground mb-3">{title}</p>}
      <div className="space-y-2">
        {data.map((item) => {
          const pct = Math.round((item.value / maxValue) * 100);
          const color = item.color ?? "bg-rose-400";
          return (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-20 text-xs text-muted-foreground truncate shrink-0 text-right">
                {item.label}
              </span>
              <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-xs font-medium text-foreground text-right shrink-0">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
