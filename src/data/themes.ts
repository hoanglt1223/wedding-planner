export interface AppTheme {
  id: string;
  name: string;
  primary: string;      // main color (replaces red-700)
  primaryDark: string;   // darker variant (replaces #8b1a2b)
  primaryLight: string;  // light bg variant (replaces red-50)
  accent: string;        // accent/highlight color
}

export const THEMES: AppTheme[] = [
  {
    id: "red",
    name: "🔴 Đỏ Truyền Thống",
    primary: "#b91c1c",
    primaryDark: "#8b1a2b",
    primaryLight: "#fef2f2",
    accent: "#c0392b",
  },
  {
    id: "pink",
    name: "🌸 Hồng Blush",
    primary: "#db2777",
    primaryDark: "#9d174d",
    primaryLight: "#fdf2f8",
    accent: "#ec4899",
  },
  {
    id: "navy",
    name: "🔵 Xanh Navy",
    primary: "#1e40af",
    primaryDark: "#1e3a5f",
    primaryLight: "#eff6ff",
    accent: "#3b82f6",
  },
  {
    id: "sage",
    name: "🌿 Xanh Sage",
    primary: "#15803d",
    primaryDark: "#14532d",
    primaryLight: "#f0fdf4",
    accent: "#22c55e",
  },
  {
    id: "purple",
    name: "💜 Tím Lavender",
    primary: "#7e22ce",
    primaryDark: "#581c87",
    primaryLight: "#faf5ff",
    accent: "#a855f7",
  },
  {
    id: "gold",
    name: "✨ Vàng Sang Trọng",
    primary: "#a16207",
    primaryDark: "#713f12",
    primaryLight: "#fefce8",
    accent: "#eab308",
  },
];

export const DEFAULT_THEME_ID = "red";
