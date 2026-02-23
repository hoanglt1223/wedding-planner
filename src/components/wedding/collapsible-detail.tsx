import { useState } from "react";
import type { ReactNode } from "react";

interface CollapsibleDetailProps {
  title: string;
  icon: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleDetail({ title, icon, children, defaultOpen = false }: CollapsibleDetailProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-[var(--theme-border)] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-1.5 px-3 py-2 bg-[var(--theme-surface)] hover:bg-[var(--theme-hover,rgba(0,0,0,0.04))] transition-colors text-left"
      >
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-semibold text-gray-700 flex-1">{title}</span>
        <span
          className="text-gray-400 text-xs transition-transform duration-200"
          style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="px-3 py-2 bg-white border-t border-[var(--theme-border)]">
          {children}
        </div>
      )}
    </div>
  );
}
