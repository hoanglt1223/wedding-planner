import type { WeddingStep } from "@/types/wedding";

export const STEP_MEETING: WeddingStep = {
  id: "meeting",
  tab: "☕ Gặp Mặt",
  title: "Bước 0: Gặp Mặt Hai Gia Đình",
  formalName: "Lễ Giáp Mặt / Buổi Ra Mắt",
  icon: "☕",
  description: "Buổi gặp không chính thức đầu tiên — hai nhà làm quen, tìm hiểu hoàn cảnh gia đình.",
  meaning: "Đây là bước mở đầu quan trọng trong hôn nhân Việt Nam — tuy không phải nghi lễ chính thức nhưng quyết định toàn bộ không khí cưới hỏi sau này. Hai gia đình gặp nhau lần đầu để làm quen, tìm hiểu hoàn cảnh, thăm dò ý kiến về việc cưới hỏi. Ấn tượng đầu tiên rất quan trọng: nếu hai nhà hòa thuận từ đầu, mọi bước sau sẽ thuận lợi. Cô dâu chú rể đóng vai 'cầu nối' — giúp hai bên hiểu nhau, tạo thiện cảm.",
  notes: [
    "KHÔNG bàn chi tiết tiền bạc, lễ vật — chỉ làm quen thân mật, trao đổi sơ bộ",
    "Nên chọn địa điểm trung lập: nhà hàng yên tĩnh, quán café thanh lịch, hoặc nhà một bên",
    "Thành phần: bố mẹ hai bên + cô dâu chú rể. Tối đa thêm 1-2 người thân (ông bà, anh chị em)",
    "Trang phục lịch sự nhưng không cần quá trang trọng — tạo không khí thoải mái",
    "Quan trọng nhất: để lại ấn tượng tốt — đúng giờ, lịch sự, cởi mở, lắng nghe",
    "Cô dâu chú rể nên giới thiệu sơ về gia đình đối phương cho bố mẹ mình TRƯỚC buổi gặp",
    "Nếu gặp tại nhà hàng: chọn nơi yên tĩnh, dễ nói chuyện — tránh quán ồn ào",
    "Sau buổi gặp: cô dâu chú rể tổng hợp ý kiến hai bên, bàn bạc bước tiếp theo",
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
