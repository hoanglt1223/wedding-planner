import { t } from "@/lib/i18n";
import type { GiftEntry, Guest } from "@/types/wedding";
import { GiftEntryRow } from "./gift-entry-row";

type FilterKey = "all" | "cash" | "gift" | "notThanked";

interface Props {
  gifts: GiftEntry[];
  /** Reserved for future guest-linking feature */
  guests?: Guest[];
  search: string;
  filter: FilterKey;
  onFilterChange: (f: FilterKey) => void;
  onEdit: (gift: GiftEntry) => void;
  onDelete: (id: number) => void;
  onToggleThankYou: (id: number) => void;
  lang: string;
}

const FILTERS: { key: FilterKey; label: (lang: string) => string }[] = [
  { key: "all", label: (l) => (l === "en" ? "All" : "Tất cả") },
  { key: "cash", label: (l) => t("Tiền mặt", l) },
  { key: "gift", label: (l) => t("Quà tặng", l) },
  { key: "notThanked", label: (l) => t("Chưa cảm ơn", l) },
];

function applyFilter(gifts: GiftEntry[], search: string, filter: FilterKey): GiftEntry[] {
  let result = gifts;
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter((g) => g.guestName.toLowerCase().includes(q));
  }
  if (filter === "cash") result = result.filter((g) => g.type === "cash");
  else if (filter === "gift") result = result.filter((g) => g.type === "gift");
  else if (filter === "notThanked") result = result.filter((g) => !g.thankYouSent);
  return result;
}

export function GiftEntryList({
  gifts, search, filter,
  onFilterChange, onEdit, onDelete, onToggleThankYou, lang,
}: Props) {
  const filtered = applyFilter(gifts, search, filter);

  return (
    <div>
      <div className="flex gap-1 mb-2 flex-wrap">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              filter === key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted border-border"
            }`}
          >
            {label(lang)}
          </button>
        ))}
      </div>

      <div className="rounded-lg border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">
            {lang === "en" ? "No gift entries" : "Chưa có phong bì nào"}
          </div>
        ) : (
          filtered.map((gift) => (
            <GiftEntryRow
              key={gift.id}
              gift={gift}
              lang={lang}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleThankYou={onToggleThankYou}
            />
          ))
        )}
      </div>
    </div>
  );
}
