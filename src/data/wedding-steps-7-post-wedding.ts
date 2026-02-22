import type { WeddingStep } from "@/types/wedding";

export const STEP_POST_WEDDING: WeddingStep = {
  id: "post-wedding",
  tab: "🎉 Sau Cưới",
  title: "Bước 7: Sau Cưới",
  formalName: "Lễ Lại Mặt & Các Việc Sau Cưới",
  icon: "🎉",
  description: "Hoàn tất hành trình — lễ lại mặt tạ ơn nhà gái, chỉnh đốn giấy tờ, và bắt đầu cuộc sống mới.",
  meaning: "Sau đám cưới, cặp đôi vẫn còn nhiều việc quan trọng cần hoàn thành. Lễ Lại Mặt (Lễ Phản Bái) là phong tục đặc trưng miền Tây/Nam Bộ — 3 ngày sau cưới, cô dâu chú rể về thăm nhà gái với lễ vật (cặp vịt trống + rượu), thể hiện lòng biết ơn của chú rể với gia đình vợ. Ngoài ra còn các công việc hành chính: đăng ký kết hôn, gửi thiệp cảm ơn, nhận album ảnh cưới, tổng kết thu chi. Đây là giai đoạn chuyển tiếp từ 'đám cưới' sang 'cuộc sống hôn nhân'.",
  notes: [
    "Lễ Lại Mặt thường diễn ra 3 ngày sau cưới — không nên trì hoãn quá lâu",
    "Cặp vịt trống (miền Tây) tượng trưng cho hạnh phúc đôi lứa — phải là vịt trống",
    "Đăng ký kết hôn tại UBND phường/xã: cần CMND/CCCD gốc + giấy xác nhận tình trạng hôn nhân",
    "Album ảnh cưới thường nhận sau 1-3 tháng — kiểm tra kỹ trước khi duyệt in",
    "Tổng kết thu chi ngay sau cưới khi còn nhớ — phân loại rõ tiền mừng theo hai bên",
    "Nếu không theo phong tục vịt: trái cây, bánh, rượu là đủ",
    "Chú rể nên tỏ thái độ hiếu thảo, gần gũi với gia đình vợ",
    "Lại Mặt là dịp quan trọng để củng cố mối quan hệ thông gia",
    "Nên gửi cảm ơn trong vòng 1 tuần sau cưới — sớm hơn càng tốt",
    "Review album kỹ trước khi duyệt in — khó sửa sau khi in",
    "Book trăng mật sớm 2-3 tháng trước — đặc biệt nếu cưới dịp lễ, tết",
    "Honeymoon package tại resort thường có giá tốt + quà tặng",
    "Nghỉ ngơi ít nhất 2-3 ngày sau cưới trước khi đi trăng mật — cưới rất mệt!",
  ],
  timeline: "3 ngày - 1 tháng sau cưới",
  aiHint: "Gợi ý lịch trình sau cưới, thủ tục đăng ký kết hôn, lễ lại mặt, trăng mật.",
  ceremonies: [
    {
      name: "🏠 Lễ Lại Mặt (Lễ Phản Bái)",
      required: 1,
      description: "3 ngày sau cưới, cô dâu chú rể về thăm nhà gái — thể hiện lòng biết ơn của chú rể với gia đình vợ. Đây là phong tục đặc trưng miền Tây/Nam Bộ, rất được coi trọng.",
      steps: [
        // Checklist items (checkable: true) — FIRST
        { text: "Chuẩn bị lễ vật: cặp vịt trống (miền Tây)", cost: 300000, categoryKey: "ceremonial-gifts", checkable: true },
        { text: "Rượu biếu (1-2 chai)", cost: 300000, categoryKey: "ceremonial-gifts", checkable: true },
        { text: "Trái cây, bánh biếu ba mẹ vợ", cost: 200000, categoryKey: "ceremonial-gifts", checkable: true },
        { text: "Ba mẹ chú rể có thể đi cùng (nên có)", cost: 0, categoryKey: "other", checkable: true },
        { text: "Phong bì lì xì cho cháu nhỏ nhà gái", cost: 200000, categoryKey: "other", checkable: true },
        { text: "Ăn cơm cùng gia đình nhà gái", cost: 0, categoryKey: "food", checkable: true },
        { text: "Chụp ảnh gia đình — kỷ niệm lần đầu về thăm với tư cách con rể", cost: 0, categoryKey: "photo", checkable: true },
        { text: "Thời điểm: 3 ngày sau cưới (không nên trì hoãn)", cost: 0, categoryKey: "other", checkable: true },
        // Ritual steps (non-checkable) — AFTER checklist
        { text: "Chuẩn bị lễ vật: cặp vịt trống + rượu + trái cây", time: "08:00", responsible: "Chú rể" },
        { text: "Cô dâu chú rể (+ ba mẹ chồng nếu có) đến nhà gái", time: "09:00", responsible: "Cô dâu & chú rể" },
        { text: "Chào hỏi ba mẹ, họ hàng nhà gái", time: "09:10", responsible: "Cô dâu & chú rể" },
        { text: "Trao lễ vật — thể hiện lòng biết ơn", time: "09:15", responsible: "Chú rể" },
        { text: "Ăn cơm cùng gia đình nhà gái", time: "10:00", responsible: "Cả nhà" },
        { text: "Trò chuyện thân mật, chụp ảnh gia đình", time: "11:00", responsible: "Cô dâu & chú rể" },
      ],
      people: [
        { name: "Cô dâu & chú rể", role: "Về thăm nhà gái", avatar: "💑" },
        { name: "Ba mẹ chú rể", role: "Đi cùng (nếu có)", avatar: "👫" },
        { name: "Ba mẹ cô dâu", role: "Đón tiếp", avatar: "👫" },
      ],
    },
    {
      name: "📋 Việc Sau Cưới",
      required: 1,
      description: "Các công việc hành chính và sắp xếp sau đám cưới — từ cảm ơn khách mời đến đăng ký kết hôn chính thức.",
      steps: [
        // Checklist items (checkable: true) — FIRST
        { text: "Gửi thiệp/tin nhắn cảm ơn khách mời", cost: 500000, categoryKey: "other", checkable: true },
        { text: "Nhận + duyệt album ảnh cưới (1-3 tháng sau)", cost: 0, categoryKey: "photo", checkable: true },
        { text: "Nhận + duyệt video cưới (1-2 tháng sau)", cost: 0, categoryKey: "photo", checkable: true },
        { text: "Đăng ký kết hôn tại UBND phường/xã", cost: 0, categoryKey: "other", checkable: true },
        { text: "Tổng kết thu chi, tiền mừng — phân loại 2 bên", cost: 0, categoryKey: "other", checkable: true },
        { text: "Trả váy cưới, vest (nếu thuê)", cost: 0, categoryKey: "clothes", checkable: true },
        { text: "Viết thiệp cảm ơn vendor (photographer, MC, makeup…)", cost: 0, categoryKey: "other", checkable: true },
        { text: "Cập nhật giấy tờ: đổi tên (nếu cần), sổ hộ khẩu", cost: 0, categoryKey: "other", checkable: true },
        // Ritual steps (non-checkable) — AFTER checklist
        { text: "Tuần 1: Gửi cảm ơn khách mời + tổng kết tiền mừng", responsible: "Cô dâu & chú rể" },
        { text: "Tuần 1-2: Trả đồ thuê (váy, vest, phụ kiện)", responsible: "Cô dâu & chú rể" },
        { text: "Tuần 2-4: Đăng ký kết hôn tại UBND", responsible: "Cô dâu & chú rể" },
        { text: "Tháng 1-3: Nhận album ảnh + video, duyệt chỉnh sửa", responsible: "Cô dâu & chú rể" },
        { text: "Liên tục: Viết cảm ơn vendor + review dịch vụ", responsible: "Cô dâu & chú rể" },
      ],
      people: [
        { name: "Cô dâu & chú rể", role: "Hoàn tất giấy tờ", avatar: "💑" },
      ],
    },
    {
      name: "✈️ Trăng Mật",
      required: 0,
      description: "Chuyến du lịch đầu tiên của vợ chồng mới cưới — thời gian riêng tư, lãng mạn sau chuỗi ngày bận rộn cưới xin.",
      steps: [
        // Checklist items (checkable: true) — FIRST
        { text: "Chọn điểm đến (biển, núi, nước ngoài…)", cost: 15000000, categoryKey: "other", checkable: true },
        { text: "Book vé máy bay/tàu xe (sớm = rẻ)", cost: 5000000, categoryKey: "transport", checkable: true },
        { text: "Book khách sạn/resort (ưu tiên honeymoon package)", cost: 8000000, categoryKey: "venue", checkable: true },
        { text: "Lên lịch trình tham quan, ăn uống", cost: 0, categoryKey: "other", checkable: true },
        { text: "Chuẩn bị giấy tờ: hộ chiếu, visa (nếu đi nước ngoài)", cost: 1000000, categoryKey: "other", checkable: true },
        // Ritual steps (non-checkable) — AFTER checklist
        { text: "Lên kế hoạch + book sớm (2-3 tháng trước cưới)", responsible: "Cô dâu & chú rể" },
        { text: "Chuẩn bị giấy tờ, hành lý", responsible: "Cô dâu & chú rể" },
        { text: "Khởi hành sau cưới 1-2 tuần (nghỉ ngơi sau đám cưới)", responsible: "Cô dâu & chú rể" },
        { text: "Tận hưởng thời gian riêng tư, lãng mạn", responsible: "Cô dâu & chú rể" },
        { text: "Chụp nhiều ảnh — kỷ niệm chuyến đi đầu tiên của vợ chồng", responsible: "Cô dâu & chú rể" },
      ],
      people: [
        { name: "Cô dâu & chú rể", role: "Tận hưởng! 🎉", avatar: "💑" },
      ],
    },
  ],
};
