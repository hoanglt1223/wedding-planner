import type { BackgroundStyle, WeddingState } from "@/types/wedding";

export const BACKGROUNDS: BackgroundStyle[] = [
  {
    background: "linear-gradient(135deg,#2c1810 0%,#5a3e2b 100%)",
    textColor: "#f0d78c",
    accentColor: "#d4a843",
    fontFamily: "'Playfair Display',serif",
  },
  {
    background: "linear-gradient(135deg,#fdf6f0 0%,#f5e6d3 100%)",
    textColor: "#2c1810",
    accentColor: "#c0392b",
    fontFamily: "'Cormorant Garamond',serif",
  },
  {
    background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",
    textColor: "#f0d78c",
    accentColor: "#d4a843",
    fontFamily: "'Playfair Display',serif",
  },
  {
    background: "linear-gradient(135deg,#f5e6d3 0%,#fce4ec 100%)",
    textColor: "#880e4f",
    accentColor: "#c2185b",
    fontFamily: "'Cormorant Garamond',serif",
  },
  {
    background: "linear-gradient(135deg,#e8eaf6 0%,#c5cae9 100%)",
    textColor: "#1a237e",
    accentColor: "#3f51b5",
    fontFamily: "'Playfair Display',serif",
  },
  {
    background: "linear-gradient(135deg,#fff8e1 0%,#ffecb3 100%)",
    textColor: "#5d4037",
    accentColor: "#d4a843",
    fontFamily: "'Cormorant Garamond',serif",
  },
  {
    background: "linear-gradient(135deg,#efebe9 0%,#d7ccc8 100%)",
    textColor: "#3e2723",
    accentColor: "#8d6e63",
    fontFamily: "'Playfair Display',serif",
  },
  {
    background: "linear-gradient(135deg,#e0f2f1 0%,#b2dfdb 100%)",
    textColor: "#004d40",
    accentColor: "#00897b",
    fontFamily: "'Cormorant Garamond',serif",
  },
  {
    background: "linear-gradient(135deg,#fce4ec 0%,#f8bbd0 100%)",
    textColor: "#880e4f",
    accentColor: "#e91e63",
    fontFamily: "'Great Vibes',cursive",
  },
  {
    background: "linear-gradient(135deg,#263238 0%,#37474f 100%)",
    textColor: "#eceff1",
    accentColor: "#b0bec5",
    fontFamily: "'Playfair Display',serif",
  },
];

export const EXTRA_TABS = [
  "💰 Chi Phí",
  "👥 Khách Mời",
  "📝 Ghi Chú",
  "🗺️ Vendor",
] as const;

export const DEFAULT_STATE: WeddingState = {
  page: "planning",
  tab: 0,
  subTabs: {},
  checkedItems: {},
  budget: 200_000_000,
  budgetOverrides: {},
  expenses: {},
  themeId: "red",
  apiKey: "",
  aiResponse: "",
  info: {
    bride: "Nguyễn Thị A",
    groom: "Trần Văn B",
    brideFamilyName: "Họ Nguyễn",
    groomFamilyName: "Họ Trần",
    date: "2025-12-20",
    engagementDate: "2025-10-15",
    betrothalDate: "2025-11-15",
    brideBirthYear: "",
    groomBirthYear: "",
  },
  guests: [],
  guestIdCounter: 0,
  notes: "",
  vendors: [],
  vendorIdCounter: 0,
  photos: [],
  photoIdCounter: 0,
  lang: "vi",
  partyTime: "noon",
  stepStartTimes: {},
};
