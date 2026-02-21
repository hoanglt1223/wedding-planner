import { useState } from "react";
import { THEMES } from "@/data/themes";

interface ThemePickerProps {
  activeTheme: string;
  onSelectTheme: (id: string) => void;
}

export function ThemePicker({ activeTheme, onSelectTheme }: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const currentTheme = THEMES.find((t) => t.id === activeTheme);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-muted text-sm hover:bg-muted/80 transition-colors"
      >
        <span
          className="w-3 h-3 rounded-full border border-border shrink-0"
          style={{ background: currentTheme?.primary ?? "#b91c1c" }}
        />
        <span>Giao diện</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full mb-2 right-0 z-50 w-48 rounded-xl bg-white shadow-lg border border-gray-200 p-2 space-y-1">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTheme(t.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-left transition-colors ${
                  t.id === activeTheme
                    ? "bg-gray-100 font-bold"
                    : "hover:bg-gray-50"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0 border border-gray-200"
                  style={{ background: t.primary }}
                />
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
