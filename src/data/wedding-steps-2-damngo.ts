import type { WeddingStep } from "@/types/wedding";

export const STEP_DAM_NGO: WeddingStep = {
  id: "damngo",
  tab: "🏠 Dạm Ngõ",
  title: "Bước 2: Lễ Dạm Ngõ",
  icon: "🏠",
  desc: "Nhà trai đến nhà gái xin phép.",
  tm: "2-3 tháng trước hỏi",
  aiHint: "Chi tiết lễ dạm ngõ theo vùng miền, lễ vật cần chuẩn bị, nghi thức, những điều nên tránh.",
  cers: [
    {
      nm: "🏠 Lễ Dạm Ngõ",
      req: 1,
      desc: "Hai bên gặp chính thức, bàn cưới xin.",
      cl: [
        { t: "Xem ngày lành", c: 200000, k: "other" },
        { t: "Lễ vật: trầu cau, trà, rượu, bánh, trái cây", c: 1500000, k: "levat" },
        { t: "1-3 khay/mâm", c: 300000, k: "levat" },
        { t: "Trang phục lịch sự", c: 1000000, k: "clothes" },
        { t: "Nhà gái trang trí", c: 500000, k: "decor" },
        { t: "Trà nước tiếp khách", c: 300000, k: "food" },
      ],
      lv: [
        { n: "Cau trầu", q: "1 buồng", c: 200000 },
        { n: "Trà", q: "1-2 hộp", c: 200000 },
        { n: "Rượu", q: "2 chai", c: 300000 },
        { n: "Bánh", q: "1-2 hộp", c: 300000 },
        { n: "Trái cây", q: "Ngũ quả", c: 200000 },
      ],
      pp: [
        { n: "Bố mẹ 2 bên", r: "Đại diện", a: "👫" },
        { n: "Cô dâu & Chú rể", r: "", a: "💑" },
        { n: "Ông bà", r: "Trưởng bối", a: "👴" },
      ],
      ri: [
        "Nhà trai đến đúng giờ",
        "Giới thiệu, trao lễ",
        "Bàn bạc chi tiết",
        "Thắp hương gia tiên",
        "Cơm thân mật",
      ],
      tp: ["Không mặc cả gay gắt", "Ghi chép thỏa thuận"],
    },
  ],
};
