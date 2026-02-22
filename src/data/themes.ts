export interface AppTheme {
  id: string;
  name: string;
  primary: string;      // main color (replaces red-700)
  primaryDark: string;   // darker variant (replaces #8b1a2b)
  primaryLight: string;  // light bg variant (replaces red-50)
  accent: string;        // accent/highlight color
  // New tokens:
  primaryHSL: string;             // HSL string for shadcn --primary override
  primaryForegroundHSL: string;   // typically "0 0% 100%" (white)
  surface: string;                // card background hex
  surfaceMuted: string;           // nested section bg hex
  themeBorder: string;            // card border hex
  bg: string;                     // page background hex
  noteBg: string;                 // notes callout bg hex
  noteBorder: string;             // notes callout border hex
  noteText: string;               // notes callout text hex
}

export const THEMES: AppTheme[] = [
  {
    id: "red",
    name: "🔴 Đỏ Truyền Thống",
    primary: "#b91c1c",
    primaryDark: "#8b1a2b",
    primaryLight: "#fef2f2",
    accent: "#c0392b",
    primaryHSL: "0 72% 36%",
    primaryForegroundHSL: "0 0% 100%",
    surface: "#FFFBF5",
    surfaceMuted: "#FFF5EB",
    themeBorder: "#E8DDD0",
    bg: "#FDF8F3",
    noteBg: "#FEF2F2",
    noteBorder: "#FECACA",
    noteText: "#991B1B",
  },
  {
    id: "pink",
    name: "🌸 Hồng Blush",
    primary: "#db2777",
    primaryDark: "#9d174d",
    primaryLight: "#fdf2f8",
    accent: "#ec4899",
    primaryHSL: "330 81% 53%",
    primaryForegroundHSL: "0 0% 100%",
    surface: "#FFF9FA",
    surfaceMuted: "#FFF0F3",
    themeBorder: "#F0D8DC",
    bg: "#FEF5F7",
    noteBg: "#FDF2F8",
    noteBorder: "#FBCFE8",
    noteText: "#9D174D",
  },
  {
    id: "navy",
    name: "🔵 Xanh Navy",
    primary: "#1e40af",
    primaryDark: "#1e3a5f",
    primaryLight: "#eff6ff",
    accent: "#3b82f6",
    primaryHSL: "220 73% 40%",
    primaryForegroundHSL: "0 0% 100%",
    surface: "#F8FAFC",
    surfaceMuted: "#F1F5F9",
    themeBorder: "#D4D9E2",
    bg: "#F1F5F9",
    noteBg: "#EFF6FF",
    noteBorder: "#BFDBFE",
    noteText: "#1E3A8A",
  },
  {
    id: "sage",
    name: "🌿 Xanh Sage",
    primary: "#15803d",
    primaryDark: "#14532d",
    primaryLight: "#f0fdf4",
    accent: "#22c55e",
    primaryHSL: "142 64% 24%",
    primaryForegroundHSL: "0 0% 100%",
    surface: "#F8FAF8",
    surfaceMuted: "#F0FDF4",
    themeBorder: "#D0DDD0",
    bg: "#F2F7F2",
    noteBg: "#F0FDF4",
    noteBorder: "#BBF7D0",
    noteText: "#14532D",
  },
  {
    id: "purple",
    name: "💜 Tím Lavender",
    primary: "#7e22ce",
    primaryDark: "#581c87",
    primaryLight: "#faf5ff",
    accent: "#a855f7",
    primaryHSL: "271 76% 47%",
    primaryForegroundHSL: "0 0% 100%",
    surface: "#FAF8FC",
    surfaceMuted: "#F5F0FF",
    themeBorder: "#DDD4E8",
    bg: "#F5F2F9",
    noteBg: "#FAF5FF",
    noteBorder: "#E9D5FF",
    noteText: "#581C87",
  },
  {
    id: "gold",
    name: "✨ Vàng Sang Trọng",
    primary: "#a16207",
    primaryDark: "#713f12",
    primaryLight: "#fefce8",
    accent: "#eab308",
    primaryHSL: "38 90% 33%",
    primaryForegroundHSL: "0 0% 100%",
    surface: "#FFFDF5",
    surfaceMuted: "#FFF8E1",
    themeBorder: "#E8DFC8",
    bg: "#FBF8F0",
    noteBg: "#FEFCE8",
    noteBorder: "#FDE68A",
    noteText: "#854D0E",
  },
];

export const DEFAULT_THEME_ID = "red";
