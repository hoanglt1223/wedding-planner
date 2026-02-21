import type { WeddingStep } from "@/types/wedding";

export const STEP_MEETING: WeddingStep = {
  id: "meeting",
  tab: "☕ Gặp Mặt",
  title: "Bước 0: Gặp Mặt Hai Gia Đình",
  formalName: "Lễ Giáp Mặt / Buổi Ra Mắt",
  icon: "☕",
  description: "Buổi gặp không chính thức đầu tiên — hai nhà làm quen, tìm hiểu hoàn cảnh gia đình.",
  meaning: "Đây là bước mở đầu quan trọng trong hôn nhân Việt Nam. Hai gia đình gặp nhau lần đầu để làm quen, thăm dò ý kiến về việc cưới hỏi. Dù không phải nghi lễ chính thức, đây là nền tảng xây dựng mối quan hệ sui gia — quyết định cả không khí và sự thuận lợi cho các bước tiếp theo.",
  notes: [
    "Không bàn chi tiết tiền bạc, lễ vật — chỉ làm quen thân mật",
    "Nên chọn địa điểm trung lập: nhà hàng, quán café thanh lịch",
    "Thành phần: bố mẹ hai bên + cô dâu chú rể, tối đa thêm 1-2 người thân",
    "Trang phục lịch sự nhưng không cần quá trang trọng",
    "Quan trọng nhất: để lại ấn tượng tốt — đúng giờ, lịch sự, cởi mở",
  ],
  timeline: "4-6 tháng trước",
  aiHint: "Gợi ý cách tổ chức buổi gặp mặt hai gia đình lần đầu, nên nói gì, tránh gì, địa điểm phù hợp, quà mang theo.",
  ceremonies: [
    {
      name: "☕ Gặp Mặt Thân Mật",
      required: 1,
      description: "Hai gia đình gặp lần đầu, không nghi lễ.",
      checklist: [
        { text: "Chọn thời gian phù hợp cả hai", cost: 0, categoryKey: "other" },
        { text: "Chọn địa điểm (nhà hàng/café/nhà)", cost: 500000, categoryKey: "venue" },
        { text: "Quà nhỏ (trái cây, bánh)", cost: 300000, categoryKey: "ceremonial-gifts" },
        { text: "Đặt bàn/chuẩn bị tiếp khách", cost: 1000000, categoryKey: "food" },
      ],
      people: [
        { name: "Bố mẹ 2 bên", role: "", avatar: "👫" },
        { name: "Cô dâu & Chú rể", role: "Cầu nối", avatar: "💑" },
      ],
      ritualSteps: [
        "Giới thiệu hai bên",
        "Trò chuyện thân mật",
        "Trao đổi sơ bộ ý định",
        "Kết thúc vui vẻ — KHÔNG chốt gì",
      ],
      tips: ["Mục đích: làm quen", "Không bàn tiền bạc sâu"],
    },
    {
      name: "📝 Bàn Bạc Nội Bộ",
      required: 1,
      description: "2 bạn tổng hợp, lên kế hoạch.",
      checklist: [
        { text: "Tổng hợp ý kiến bố mẹ", cost: 0, categoryKey: "other" },
        { text: "Thống nhất budget & timeline", cost: 0, categoryKey: "other" },
        { text: "Liên hệ thầy xem ngày", cost: 500000, categoryKey: "other" },
      ],
      people: [{ name: "Cô dâu & Chú rể", role: "", avatar: "💑" }],
      ritualSteps: ["List mong muốn", "So sánh phong tục", "Lập ngân sách", "Phân công"],
      tips: ["Bước CỰC KỲ quan trọng", "Ghi chép tất cả"],
    },
  ],
};
