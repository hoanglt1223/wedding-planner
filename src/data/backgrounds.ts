import type { BackgroundStyle, WeddingState } from "@/types/wedding";

export const BACKGROUNDS: BackgroundStyle[] = [
  {
    bg: "linear-gradient(135deg,#2c1810 0%,#5a3e2b 100%)",
    t: "#f0d78c",
    sub: "#d4a843",
    f: "'Playfair Display',serif",
  },
  {
    bg: "linear-gradient(135deg,#fdf6f0 0%,#f5e6d3 100%)",
    t: "#2c1810",
    sub: "#c0392b",
    f: "'Cormorant Garamond',serif",
  },
  {
    bg: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",
    t: "#f0d78c",
    sub: "#d4a843",
    f: "'Playfair Display',serif",
  },
  {
    bg: "linear-gradient(135deg,#f5e6d3 0%,#fce4ec 100%)",
    t: "#880e4f",
    sub: "#c2185b",
    f: "'Cormorant Garamond',serif",
  },
  {
    bg: "linear-gradient(135deg,#e8eaf6 0%,#c5cae9 100%)",
    t: "#1a237e",
    sub: "#3f51b5",
    f: "'Playfair Display',serif",
  },
  {
    bg: "linear-gradient(135deg,#fff8e1 0%,#ffecb3 100%)",
    t: "#5d4037",
    sub: "#d4a843",
    f: "'Cormorant Garamond',serif",
  },
  {
    bg: "linear-gradient(135deg,#efebe9 0%,#d7ccc8 100%)",
    t: "#3e2723",
    sub: "#8d6e63",
    f: "'Playfair Display',serif",
  },
  {
    bg: "linear-gradient(135deg,#e0f2f1 0%,#b2dfdb 100%)",
    t: "#004d40",
    sub: "#00897b",
    f: "'Cormorant Garamond',serif",
  },
  {
    bg: "linear-gradient(135deg,#fce4ec 0%,#f8bbd0 100%)",
    t: "#880e4f",
    sub: "#e91e63",
    f: "'Great Vibes',cursive",
  },
  {
    bg: "linear-gradient(135deg,#263238 0%,#37474f 100%)",
    t: "#eceff1",
    sub: "#b0bec5",
    f: "'Playfair Display',serif",
  },
];

export const EXTRA_TABS = [
  "💰 Chi Phí",
  "👥 Khách Mời",
] as const;

export const DEFAULT_STATE: WeddingState = {
  page: "kehoach",
  tab: 0,
  st: {},
  ck: {},
  bud: 200_000_000,
  bo: {},
  zk: "",
  ar: "",
  info: {
    bride: "Nguyễn Thị A",
    groom: "Trần Văn B",
    bf: "Họ Nguyễn",
    gf: "Họ Trần",
    date: "2025-12-20",
    dDN: "2025-10-15",
    dDH: "2025-11-15",
  },
  guests: [],
  gid: 0,
};
