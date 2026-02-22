interface PartyTimeToggleProps {
  value: "noon" | "afternoon";
  onChange: (v: "noon" | "afternoon") => void;
}

export function PartyTimeToggle({ value, onChange }: PartyTimeToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden text-xs">
      <button
        onClick={() => onChange("noon")}
        className={`px-2.5 py-1 font-medium transition-colors ${
          value === "noon"
            ? "bg-primary text-primary-foreground"
            : "bg-[var(--theme-surface)] text-gray-600 hover:bg-[var(--theme-surface-muted)]"
        }`}
      >
        🌞 Trưa (11h)
      </button>
      <button
        onClick={() => onChange("afternoon")}
        className={`px-2.5 py-1 font-medium transition-colors ${
          value === "afternoon"
            ? "bg-primary text-primary-foreground"
            : "bg-[var(--theme-surface)] text-gray-600 hover:bg-[var(--theme-surface-muted)]"
        }`}
      >
        🌇 Chiều (17h)
      </button>
    </div>
  );
}
