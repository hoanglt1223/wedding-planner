import type { WeddingStep } from "@/types/wedding";

export const STEP_BRIDE_CEREMONY: WeddingStep = {
  id: "bride-ceremony",
  tab: "🏡 Nhà Gái",
  title: "Bước 4: Tiệc Nhà Gái",
  formalName: "Tiệc Cưới Nhà Gái (Tiệc Đãi Họ Nhà Gái)",
  icon: "🏡",
  description: "Tiệc do nhà gái tổ chức — đãi họ hàng phía cô dâu, cũng là dịp cô dâu tạ ơn cha mẹ trước khi về nhà chồng.",
  meaning: "Tiệc nhà gái mang ý nghĩa đặc biệt trong văn hóa Việt Nam: đây là lần cuối cô dâu với tư cách 'con gái nhà' chiêu đãi họ hàng, bạn bè. Bao gồm lễ gia tiên — cô dâu thắp hương tổ tiên nhà mình, xin phép và tạ ơn cha mẹ đã sinh thành, dưỡng dục. Khoảnh khắc cô dâu khóc tạ ơn mẹ luôn là giây phút xúc động nhất.",
  notes: [
    "Nhiều gia đình hiện nay gộp tiệc nhà gái và nhà trai cùng ngày/nhà hàng",
    "Nếu riêng: tiệc nhà gái thường 1-2 ngày trước tiệc nhà trai",
    "Lễ gia tiên phải diễn ra TRƯỚC tiệc — nghiêm trang, thành kính",
    "Trang phục cô dâu: áo dài truyền thống cho lễ gia tiên, váy cưới cho tiệc",
    "Kiểm tra âm thanh, ánh sáng, ban nhạc trước 2 giờ",
    "Chuẩn bị phong bì cảm ơn cho bàn VIP (bố mẹ, ông bà, sui gia)",
  ],
  timeline: "1-2 ngày trước hoặc cùng ngày",
  aiHint: "Gợi ý trang trí tiệc cưới nhà gái đẹp, tiết kiệm. Menu tiệc phù hợp.",
  ceremonies: [
    {
      name: "🏡 Tiệc Nhà Gái",
      required: 1,
      description: "Tiệc chính phía cô dâu.",
      checklist: [
        { text: "Nhà hàng/rạp", cost: 15000000, categoryKey: "venue" },
        { text: "Thiệp mời", cost: 1500000, categoryKey: "other" },
        { text: "Menu tiệc", cost: 20000000, categoryKey: "food" },
        { text: "MC + nhạc", cost: 7000000, categoryKey: "mc" },
        { text: "Trang trí", cost: 5000000, categoryKey: "decor" },
        { text: "Ảnh & video", cost: 8000000, categoryKey: "photo" },
        { text: "Váy/áo dài + makeup", cost: 8000000, categoryKey: "clothes" },
      ],
      people: [
        { name: "Bố mẹ cô dâu", role: "Chủ tiệc", avatar: "👫" },
        { name: "MC", role: "", avatar: "🎤" },
      ],
      ritualSteps: [
        "Trang điểm sớm",
        "Đón khách",
        "MC khai tiệc",
        "Cắt bánh, nâng ly",
        "Đi bàn cảm ơn",
      ],
      tips: ["Kiểm tra âm thanh trước 2h"],
    },
    {
      name: "🙏 Gia Tiên Nhà Gái",
      required: 1,
      description: "Thắp hương tổ tiên nhà gái.",
      checklist: [
        { text: "Bàn thờ: hoa, nhang, nến", cost: 300000, categoryKey: "decor" },
        { text: "Mâm cúng", cost: 500000, categoryKey: "food" },
      ],
      people: [{ name: "Cô dâu & chú rể", role: "Thắp hương", avatar: "💑" }],
      ritualSteps: ["Bày mâm cúng", "Bố mẹ khấn", "Lạy 3 lạy"],
      tips: ["Trước tiệc, nghiêm trang"],
    },
  ],
};
