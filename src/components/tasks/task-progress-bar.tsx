interface TaskProgressBarProps {
  assigneeName: string;
  done: number;
  total: number;
}

export function TaskProgressBar({ assigneeName, done, total }: TaskProgressBarProps) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done === total;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-gray-700 truncate max-w-[120px]">{assigneeName}</span>
        <span className={allDone ? "text-green-600 font-semibold" : "text-gray-500"}>
          {done}/{total}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${allDone ? "bg-green-500" : "bg-blue-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
