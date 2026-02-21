import type { ChecklistItem } from "@/types/wedding";
import { formatShort } from "@/lib/format";

interface ChecklistProps {
  items: ChecklistItem[];
  stepId: string;
  ceremonyIndex: number;
  checkedKeys: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export function Checklist({ items, stepId, ceremonyIndex, checkedKeys, onToggle }: ChecklistProps) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm mb-2">
      <h2 className="text-sm font-bold text-red-800 mb-2">✅ Checklist</h2>
      <ul className="space-y-1">
        {items.map((item, i) => {
          const key = `${stepId}_${ceremonyIndex}_${i}`;
          const checked = !!checkedKeys[key];
          return (
            <li
              key={key}
              onClick={() => onToggle(key)}
              className={`flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1.5 text-sm transition-colors ${
                checked
                  ? "bg-green-50 text-green-800 line-through opacity-70"
                  : "hover:bg-red-50 text-gray-700"
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-4 h-4 rounded border flex-shrink-0 transition-colors ${
                  checked
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-400"
                }`}
              >
                {checked && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="flex-1">{item.text}</span>
              {item.cost > 0 && (
                <span className="text-[0.65rem] font-semibold bg-amber-100 text-amber-700 rounded px-1.5 py-0.5 ml-1">
                  {formatShort(item.cost)}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
