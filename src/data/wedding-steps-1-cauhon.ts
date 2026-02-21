import type { WeddingStep } from "@/types/wedding";

export const STEP_CAU_HON: WeddingStep = {
  id: "cauhon",
  tab: "💍 Cầu Hôn",
  title: "Bước 1: Cầu Hôn",
  icon: "💍",
  desc: "Khoảnh khắc lãng mạn nhất.",
  tm: "3-6 tháng trước",
  aiHint: "Gợi ý 10 ý tưởng cầu hôn lãng mạn, độc đáo tại Việt Nam. Kèm chi phí ước tính, checklist chuẩn bị.",
  cers: [
    {
      nm: "💍 Lễ Cầu Hôn",
      req: 1,
      desc: "Chàng trai ngỏ lời.",
      cl: [
        { t: "Mua nhẫn cầu hôn", c: 15000000, k: "ring" },
        { t: "Lên kế hoạch địa điểm", c: 2000000, k: "venue" },
        { t: "Hoa tươi 99 bông", c: 500000, k: "flower" },
        { t: "Nhiếp ảnh chụp lén", c: 3000000, k: "photo" },
        { t: "Viết lời cầu hôn", c: 0, k: "other" },
        { t: "Trang trí: nến, bóng bay, led", c: 500000, k: "decor" },
        { t: "Nhạc nền / live violin", c: 500000, k: "music" },
      ],
      pp: [
        { n: "Chú rể", r: "Cầu hôn", a: "🤵" },
        { n: "Cô dâu", r: "", a: "👰" },
        { n: "Bạn thân", r: "Hỗ trợ", a: "📹" },
      ],
      ri: [
        "Dẫn cô dâu đến",
        "Quỳ gối, mở nhẫn",
        "Nói lời cầu hôn",
        "Đeo nhẫn",
        "Ăn mừng 🎉",
      ],
      tp: ["Lời cầu hôn: chân thành hơn dài", "Luôn có plan B"],
    },
  ],
};
