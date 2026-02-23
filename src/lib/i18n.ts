import { TRANSLATIONS } from "./i18n-translations";

export function t(key: string, lang: string): string {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[(lang as "vi" | "en")] || entry.vi || key;
}

export function getLangLabel(lang: string): string {
  return lang === "en" ? "🌍 EN" : "🇻🇳 VI";
}
