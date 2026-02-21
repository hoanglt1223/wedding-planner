import type { ChecklistItem } from "@/types/wedding";
import { ChecklistItemRow } from "./checklist-item-row";

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
          return (
            <ChecklistItemRow
              key={key}
              item={item}
              checkKey={key}
              checked={!!checkedKeys[key]}
              onToggle={onToggle}
            />
          );
        })}
      </ul>
    </div>
  );
}
