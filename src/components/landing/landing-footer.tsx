import { Link } from "@tanstack/react-router";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";

const BRAND = THEMES.find((t) => t.id === DEFAULT_THEME_ID) || THEMES[0];

export function LandingFooter() {
  return (
    <footer className="px-4 py-8 text-center border-t border-[#e8ddd0]">
      <Link
        to="/app/home"
        className="inline-flex items-center justify-center h-10 px-6 text-sm font-semibold text-white rounded-full transition-colors mb-4"
        style={{ backgroundColor: BRAND.accent }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = BRAND.primaryDark)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = BRAND.accent)}
      >
        Bắt Đầu Lên Kế Hoạch
      </Link>
      <p className="text-xs text-[#8a7060]">
        Made with ❤️ for Vietnamese couples · 2026
      </p>
    </footer>
  );
}
