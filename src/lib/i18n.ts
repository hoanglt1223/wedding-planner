type Lang = "vi" | "en";

const TRANSLATIONS: Record<string, Record<Lang, string>> = {
  "💒 Kế Hoạch": { vi: "💒 Kế Hoạch", en: "💒 Planning" },
  "🔮 Tử Vi": { vi: "🔮 Tử Vi", en: "🔮 Fortune" },
  "🖼️ Thiệp": { vi: "🖼️ Thiệp", en: "🖼️ Cards" },
  "🤖 AI": { vi: "🤖 AI", en: "🤖 AI" },
  "📖 Sổ Tay": { vi: "📖 Sổ Tay", en: "📖 Handbook" },
  "💡 Ý Tưởng": { vi: "💡 Ý Tưởng", en: "💡 Ideas" },
};

export function t(key: string, lang: string): string {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[(lang as Lang)] || entry.vi || key;
}

export function getLangLabel(lang: string): string {
  return lang === "en" ? "🌍 EN" : "🇻🇳 VI";
}
