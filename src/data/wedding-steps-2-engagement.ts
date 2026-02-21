import type { WeddingStep } from "@/types/wedding";

export const STEP_ENGAGEMENT: WeddingStep = {
  id: "engagement",
  tab: "🏠 Dạm Ngõ",
  title: "Bước 2: Lễ Dạm Ngõ",
  formalName: "Lễ Dạm Ngõ (Lễ Chạm Ngõ / Lễ Giáp Lời)",
  icon: "🏠",
  description: "Nghi lễ chính thức đầu tiên — nhà trai đến nhà gái xin phép tìm hiểu và hỏi cưới.",
  meaning: "Dạm ngõ mang nghĩa 'chạm ngõ' — lần đầu nhà trai bước chân qua cổng nhà gái với tư cách sui gia. Đây là nghi lễ chính thức đầu tiên trong hôn nhân Việt Nam, đánh dấu sự công nhận mối quan hệ giữa hai gia đình. Từ sau dạm ngõ, đôi trẻ được coi là đã 'có nơi có chốn'.",
  notes: [
    "Miền Bắc: gọi 'Chạm ngõ' — lễ vật đơn giản (trầu cau, trà, rượu)",
    "Miền Trung: gọi 'Giáp lời' hoặc 'Đi nói' — tương tự miền Bắc",
    "Miền Nam: gọi 'Dạm ngõ' — có thể kèm khay trái cây, bánh ngọt",
    "Lễ vật chỉ mang tính tượng trưng, không cần quá nhiều",
    "Bàn bạc: thống nhất ngày hỏi, ngày cưới, lễ vật đám hỏi, số mâm quả",
    "Không mặc cả gay gắt — tinh thần hòa thuận là quan trọng nhất",
    "Ghi chép lại mọi thỏa thuận để tránh hiểu lầm sau này",
  ],
  timeline: "2-3 tháng trước hỏi",
  aiHint: "Chi tiết lễ dạm ngõ theo vùng miền, lễ vật cần chuẩn bị, nghi thức, những điều nên tránh.",
  ceremonies: [
    {
      name: "🏠 Lễ Dạm Ngõ",
      required: 1,
      description: "Hai bên gặp chính thức, bàn cưới xin.",
      checklist: [
        { text: "Xem ngày lành", cost: 200000, categoryKey: "other" },
        { text: "Lễ vật: trầu cau, trà, rượu, bánh, trái cây", cost: 1500000, categoryKey: "ceremonial-gifts" },
        { text: "1-3 khay/mâm", cost: 300000, categoryKey: "ceremonial-gifts" },
        { text: "Trang phục lịch sự", cost: 1000000, categoryKey: "clothes" },
        { text: "Nhà gái trang trí", cost: 500000, categoryKey: "decor" },
        { text: "Trà nước tiếp khách", cost: 300000, categoryKey: "food" },
      ],
      gifts: [
        { name: "Cau trầu", quantity: "1 buồng", cost: 200000 },
        { name: "Trà", quantity: "1-2 hộp", cost: 200000 },
        { name: "Rượu", quantity: "2 chai", cost: 300000 },
        { name: "Bánh", quantity: "1-2 hộp", cost: 300000 },
        { name: "Trái cây", quantity: "Ngũ quả", cost: 200000 },
      ],
      people: [
        { name: "Bố mẹ 2 bên", role: "Đại diện", avatar: "👫" },
        { name: "Cô dâu & Chú rể", role: "", avatar: "💑" },
        { name: "Ông bà", role: "Trưởng bối", avatar: "👴" },
      ],
      ritualSteps: [
        "Nhà trai đến đúng giờ",
        "Giới thiệu, trao lễ",
        "Bàn bạc chi tiết",
        "Thắp hương gia tiên",
        "Cơm thân mật",
      ],
      tips: ["Không mặc cả gay gắt", "Ghi chép thỏa thuận"],
    },
  ],
};
