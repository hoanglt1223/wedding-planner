import type { WeddingStep } from "@/types/wedding";

export const STEP_GAP_MAT: WeddingStep = {
  id: "gap",
  tab: "☕ Gặp Mặt",
  title: "Bước 0: Gặp Mặt Hai Gia Đình",
  icon: "☕",
  desc: "Buổi gặp không chính thức — hai nhà làm quen.",
  tm: "4-6 tháng trước",
  aiHint: "Gợi ý cách tổ chức buổi gặp mặt hai gia đình lần đầu, nên nói gì, tránh gì, địa điểm phù hợp, quà mang theo.",
  cers: [
    {
      nm: "☕ Gặp Mặt Thân Mật",
      req: 1,
      desc: "Hai gia đình gặp lần đầu, không nghi lễ.",
      cl: [
        { t: "Chọn thời gian phù hợp cả hai", c: 0, k: "other" },
        { t: "Chọn địa điểm (nhà hàng/café/nhà)", c: 500000, k: "venue" },
        { t: "Quà nhỏ (trái cây, bánh)", c: 300000, k: "levat" },
        { t: "Đặt bàn/chuẩn bị tiếp khách", c: 1000000, k: "food" },
      ],
      pp: [
        { n: "Bố mẹ 2 bên", r: "", a: "👫" },
        { n: "Cô dâu & Chú rể", r: "Cầu nối", a: "💑" },
      ],
      ri: [
        "Giới thiệu hai bên",
        "Trò chuyện thân mật",
        "Trao đổi sơ bộ ý định",
        "Kết thúc vui vẻ — KHÔNG chốt gì",
      ],
      tp: ["Mục đích: làm quen", "Không bàn tiền bạc sâu"],
    },
    {
      nm: "📝 Bàn Bạc Nội Bộ",
      req: 1,
      desc: "2 bạn tổng hợp, lên kế hoạch.",
      cl: [
        { t: "Tổng hợp ý kiến bố mẹ", c: 0, k: "other" },
        { t: "Thống nhất budget & timeline", c: 0, k: "other" },
        { t: "Liên hệ thầy xem ngày", c: 500000, k: "other" },
      ],
      pp: [{ n: "Cô dâu & Chú rể", r: "", a: "💑" }],
      ri: ["List mong muốn", "So sánh phong tục", "Lập ngân sách", "Phân công"],
      tp: ["Bước CỰC KỲ quan trọng", "Ghi chép tất cả"],
    },
  ],
};
