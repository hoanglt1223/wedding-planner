import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { ChecklistItem } from "@/types/wedding";
import { formatShort } from "@/lib/format";

interface ChecklistItemRowProps {
  item: ChecklistItem;
  checkKey: string;
  checked: boolean;
  onToggle: (key: string) => void;
}

export function ChecklistItemRow({ item, checkKey, checked, onToggle }: ChecklistItemRowProps) {
  const [open, setOpen] = useState(false);
  const hasDetail = !!item.detail;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <li className={`rounded-lg px-2 py-1.5 text-sm transition-colors ${
        checked ? "bg-green-50 text-green-800 line-through opacity-70" : "hover:bg-red-50 text-gray-700"
      }`}>
        <div className="flex items-center gap-2">
          {/* Checkbox */}
          <span
            onClick={(e) => { e.stopPropagation(); onToggle(checkKey); }}
            className={`inline-flex items-center justify-center w-4 h-4 rounded border flex-shrink-0 cursor-pointer transition-colors ${
              checked ? "bg-green-500 border-green-500 text-white" : "border-gray-400"
            }`}
          >
            {checked && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>

          {/* Text — clickable to toggle check if no detail, or just text */}
          <span
            className="flex-1 cursor-pointer"
            onClick={() => hasDetail ? setOpen(!open) : onToggle(checkKey)}
          >
            {item.text}
          </span>

          {item.cost > 0 && (
            <span className="text-[0.65rem] font-semibold bg-amber-100 text-amber-700 rounded px-1.5 py-0.5 ml-1">
              {formatShort(item.cost)}
            </span>
          )}

          {/* Expand trigger */}
          {hasDetail && (
            <CollapsibleTrigger asChild>
              <button className="p-0.5 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
            </CollapsibleTrigger>
          )}
        </div>

        {/* Expanded detail */}
        {hasDetail && (
          <CollapsibleContent>
            <div className="mt-1.5 ml-6 text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg px-2.5 py-2 border border-gray-100">
              {item.detail}
            </div>
          </CollapsibleContent>
        )}
      </li>
    </Collapsible>
  );
}
