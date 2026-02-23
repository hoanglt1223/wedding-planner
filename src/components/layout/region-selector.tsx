import { REGIONS, type Region } from "@/data/regions";

interface RegionSelectorProps {
  region: Region;
  onRegionChange: (region: Region) => void;
  lang?: string;
}

export function RegionSelector({
  region,
  onRegionChange,
  lang = "vi",
}: RegionSelectorProps) {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {REGIONS.map((r) => {
        const active = r.id === region;
        const label = lang === "en" ? r.labelEn : r.label;
        return (
          <button
            key={r.id}
            onClick={() => onRegionChange(r.id)}
            title={label}
            className={`h-7 px-1.5 rounded-full text-2xs font-medium transition-all ${
              active
                ? "bg-[var(--theme-primary-light)] text-[var(--theme-primary)] ring-1 ring-[var(--theme-primary)]/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {r.emoji}
          </button>
        );
      })}
    </div>
  );
}
