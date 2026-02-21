import type { WeddingStep } from "@/types/wedding";

export const STEP_PROPOSAL: WeddingStep = {
  id: "proposal",
  tab: "💍 Cầu Hôn",
  title: "Bước 1: Cầu Hôn",
  formalName: "Lễ Cầu Hôn (Proposal)",
  icon: "💍",
  description: "Khoảnh khắc lãng mạn nhất — chú rể chính thức ngỏ lời xin kết hôn.",
  meaning: "Lễ cầu hôn là nghi thức riêng tư và lãng mạn nhất giữa hai người — đánh dấu cam kết chính thức trước khi thông báo gia đình. Truyền thống Việt Nam xưa không có lễ cầu hôn riêng (gia đình sắp xếp tất cả), nhưng ngày nay đã trở thành xu hướng phổ biến — kết hợp nét lãng mạn phương Tây với tình yêu Việt Nam hiện đại. Khoảnh khắc quỳ gối, mở hộp nhẫn — câu trả lời 'Đồng ý!' — là khởi đầu cho hành trình cưới hỏi.",
  notes: [
    "Lời cầu hôn: CHÂN THÀNH hơn dài — nói từ trái tim, không cần kịch bản hoàn hảo",
    "Luôn có plan B phòng thời tiết xấu hoặc sự cố bất ngờ",
    "Nhẫn cầu hôn ≠ nhẫn cưới — có thể đơn giản hơn, ngân sách vừa phải",
    "Tìm hiểu BÍ MẬT size nhẫn cô dâu — nhờ bạn thân hoặc đo lén khi ngủ",
    "Nên bí mật nhưng có người hỗ trợ (bạn thân, nhiếp ảnh chụp lén)",
    "Quay video/chụp ảnh khoảnh khắc — sẽ là kỷ niệm VÔ GIÁ cả đời",
    "Chọn nơi có ý nghĩa với cả hai: nơi hẹn hò đầu tiên, nơi quen nhau",
    "Có người thích riêng tư (chỉ 2 người), có người thích hoành tráng (trước bạn bè) — tùy cô dâu",
  ],
  timeline: "3-6 tháng trước",
  aiHint: "Gợi ý 10 ý tưởng cầu hôn lãng mạn, độc đáo tại Việt Nam. Kèm chi phí ước tính, checklist chuẩn bị.",
  ceremonies: [
    {
      name: "💍 Lễ Cầu Hôn",
      required: 1,
      description: "Chàng trai ngỏ lời.",
      checklist: [
        { text: "Mua nhẫn cầu hôn", cost: 15000000, categoryKey: "ring" },
        { text: "Lên kế hoạch địa điểm", cost: 2000000, categoryKey: "venue" },
        { text: "Hoa tươi 99 bông", cost: 500000, categoryKey: "flower" },
        { text: "Nhiếp ảnh chụp lén", cost: 3000000, categoryKey: "photo" },
        { text: "Viết lời cầu hôn", cost: 0, categoryKey: "other" },
        { text: "Trang trí: nến, bóng bay, led", cost: 500000, categoryKey: "decor" },
        { text: "Nhạc nền / live violin", cost: 500000, categoryKey: "music" },
      ],
      people: [
        { name: "Chú rể", role: "Cầu hôn", avatar: "🤵" },
        { name: "Cô dâu", role: "", avatar: "👰" },
        { name: "Bạn thân", role: "Hỗ trợ", avatar: "📹" },
      ],
      ritualSteps: [
        "Dẫn cô dâu đến",
        "Quỳ gối, mở nhẫn",
        "Nói lời cầu hôn",
        "Đeo nhẫn",
        "Ăn mừng 🎉",
      ],
      tips: ["Lời cầu hôn: chân thành hơn dài", "Luôn có plan B"],
    },
  ],
};
