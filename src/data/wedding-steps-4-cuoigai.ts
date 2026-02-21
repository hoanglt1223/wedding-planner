import type { WeddingStep } from "@/types/wedding";

export const STEP_CUOI_GAI: WeddingStep = {
  id: "cuoigai",
  tab: "🏡 Nhà Gái",
  title: "Bước 4: Tiệc Nhà Gái",
  icon: "🏡",
  desc: "Tiệc phía cô dâu.",
  tm: "1-2 ngày trước hoặc cùng ngày",
  aiHint: "Gợi ý trang trí tiệc cưới nhà gái đẹp, tiết kiệm. Menu tiệc phù hợp.",
  cers: [
    {
      nm: "🏡 Tiệc Nhà Gái",
      req: 1,
      desc: "Tiệc chính phía cô dâu.",
      cl: [
        { t: "Nhà hàng/rạp", c: 15000000, k: "venue" },
        { t: "Thiệp mời", c: 1500000, k: "other" },
        { t: "Menu tiệc", c: 20000000, k: "food" },
        { t: "MC + nhạc", c: 7000000, k: "mc" },
        { t: "Trang trí", c: 5000000, k: "decor" },
        { t: "Ảnh & video", c: 8000000, k: "photo" },
        { t: "Váy/áo dài + makeup", c: 8000000, k: "clothes" },
      ],
      pp: [
        { n: "Bố mẹ cô dâu", r: "Chủ tiệc", a: "👫" },
        { n: "MC", r: "", a: "🎤" },
      ],
      ri: [
        "Trang điểm sớm",
        "Đón khách",
        "MC khai tiệc",
        "Cắt bánh, nâng ly",
        "Đi bàn cảm ơn",
      ],
      tp: ["Kiểm tra âm thanh trước 2h"],
    },
    {
      nm: "🙏 Gia Tiên Nhà Gái",
      req: 1,
      desc: "Thắp hương tổ tiên nhà gái.",
      cl: [
        { t: "Bàn thờ: hoa, nhang, nến", c: 300000, k: "decor" },
        { t: "Mâm cúng", c: 500000, k: "food" },
      ],
      pp: [{ n: "Cô dâu & chú rể", r: "Thắp hương", a: "💑" }],
      ri: ["Bày mâm cúng", "Bố mẹ khấn", "Lạy 3 lạy"],
      tp: ["Trước tiệc, nghiêm trang"],
    },
  ],
};
