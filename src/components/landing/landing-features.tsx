const FEATURES = [
  { icon: "📋", title: "Nghi Lễ 8 Bước", description: "Hướng dẫn từ cầu hôn đến lễ sau cưới theo phong tục Việt" },
  { icon: "💰", title: "Quản Lý Ngân Sách", description: "Theo dõi chi tiêu, phân bổ ngân sách theo 13 hạng mục" },
  { icon: "👥", title: "Danh Sách Khách Mời", description: "Quản lý khách, sơ đồ bàn, import/export CSV" },
  { icon: "🔮", title: "Tử Vi Hợp Tuổi", description: "Xem tuổi hợp, ngũ hành, chọn ngày lành tháng tốt" },
  { icon: "💌", title: "Thiệp Mời Online", description: "Tạo thiệp mời đẹp, gửi qua Zalo, thu RSVP tự động" },
  { icon: "🤖", title: "Trợ Lý AI", description: "Hỏi đáp về phong tục cưới, gợi ý MC, menu, quà tặng" },
];

export function LandingFeatures() {
  return (
    <section className="px-4 pb-12 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-center text-[#2c1810] mb-6">
        Tất Cả Trong Một Ứng Dụng
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-[#e8ddd0] bg-white/80 p-4 text-center"
          >
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="text-sm font-semibold text-[#2c1810] mb-1">{f.title}</h3>
            <p className="text-xs text-[#8a7060] leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
