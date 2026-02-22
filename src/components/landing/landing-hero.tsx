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
      <a
        href="#/app"
        className="inline-flex items-center justify-center h-12 px-8 text-lg font-semibold text-white rounded-full shadow-lg transition-colors animate-pulse"
        style={{ backgroundColor: BRAND.accent }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = BRAND.primaryDark)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = BRAND.accent)}
      >
        Bắt Đầu Ngay →
      </a>
      <p className="mt-4 text-xs text-[#8a7060]">
        Thay thế Excel & sổ tay bằng ứng dụng thông minh
      </p>
    </section>
  );
}
