import { Link } from "@tanstack/react-router";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";

const BRAND = THEMES.find((t) => t.id === DEFAULT_THEME_ID) || THEMES[0];

export function LandingHero() {
  return (
    <section className="px-4 pt-16 pb-12 text-center">
      <div className="text-6xl mb-6">💍</div>
      <h1 className="text-3xl sm:text-4xl font-bold text-[#2c1810] mb-4 leading-tight">
        Kế Hoạch Đám Cưới
        <br />
        <span style={{ color: BRAND.accent }}>Hoàn Hảo</span>
      </h1>
      <p className="text-base sm:text-lg text-[#5a3e2e] mb-2 max-w-md mx-auto">
        Miễn phí 100% · Nghi lễ 8 bước · Ngân sách · Khách mời · Tử vi
      </p>
      <p className="text-sm text-[#8a7060] mb-8 max-w-sm mx-auto">
        Không cần đăng ký. Dữ liệu lưu trên điện thoại của bạn.
      </p>
      <Link
        to="/app/home"
        className="group relative inline-flex items-center justify-center h-14 px-10 text-lg font-bold text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.primaryDark})`,
          boxShadow: `0 8px 24px ${BRAND.accent}40`,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.accent})`;
          e.currentTarget.style.boxShadow = `0 12px 32px ${BRAND.accent}60`;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.primaryDark})`;
          e.currentTarget.style.boxShadow = `0 8px 24px ${BRAND.accent}40`;
        }}
      >
        <span className="relative z-10">Bắt Đầu Ngay →</span>
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ backgroundColor: BRAND.accent }}
        />
      </Link>
      <p className="mt-4 text-xs text-[#8a7060]">
        Thay thế Excel & sổ tay bằng ứng dụng thông minh
      </p>
    </section>
  );
}
