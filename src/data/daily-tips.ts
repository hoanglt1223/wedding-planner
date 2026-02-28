export interface DailyTip {
  id: number;
  icon: string;
  text: string;
  category: "planning" | "budget" | "guests" | "tradition" | "general";
}

export const DAILY_TIPS: DailyTip[] = [
  { id: 1, icon: "📋", text: "Kiểm tra danh sách khách ít nhất 2 lần trước khi in thiệp", category: "guests" },
  { id: 2, icon: "💰", text: "Đặt cọc trước cho nhà hàng ít nhất 3 tháng", category: "budget" },
  { id: 3, icon: "📸", text: "Chụp ảnh cưới vào buổi chiều để có ánh sáng đẹp nhất", category: "general" },
  { id: 4, icon: "🎵", text: "Thử micro và âm thanh trước ngày cưới ít nhất 1 tuần", category: "planning" },
  { id: 5, icon: "👗", text: "Thử áo dài trước 2 tuần để kịp sửa nếu cần", category: "planning" },
  { id: 6, icon: "💐", text: "Chọn hoa cưới theo mùa để có giá tốt nhất", category: "budget" },
  { id: 7, icon: "🎁", text: "Chuẩn bị lễ vật theo phong tục vùng miền", category: "tradition" },
  { id: 8, icon: "📍", text: "Khảo sát địa điểm cưới vào cùng khung giờ tổ chức", category: "planning" },
  { id: 9, icon: "🍽️", text: "Thử menu tiệc cưới trước ít nhất 1 tháng", category: "planning" },
  { id: 10, icon: "💌", text: "Gửi thiệp mời trước ngày cưới 3-4 tuần", category: "guests" },
  { id: 11, icon: "🚗", text: "Đặt xe hoa và xe đưa đón trước 2 tháng", category: "planning" },
  { id: 12, icon: "📝", text: "Lập danh sách bài hát cho MC trước 2 tuần", category: "general" },
  { id: 13, icon: "🏛️", text: "Kiểm tra giấy tờ đăng ký kết hôn trước 1 tháng", category: "planning" },
  { id: 14, icon: "👥", text: "Phân công người đón khách, người ghi sổ", category: "guests" },
  { id: 15, icon: "🎀", text: "Chuẩn bị quà tặng cho khách dự tiệc", category: "tradition" },
  { id: 16, icon: "⏰", text: "Lên lịch trình chi tiết cho ngày cưới", category: "planning" },
  { id: 17, icon: "💍", text: "Kiểm tra nhẫn cưới trước ngày trọng đại", category: "general" },
  { id: 18, icon: "🎆", text: "Thuê pháo hoa nên xin phép địa phương trước", category: "planning" },
  { id: 19, icon: "🧧", text: "Chuẩn bị phong bì lì xì cho gia đình hai bên", category: "tradition" },
  { id: 20, icon: "🍰", text: "Đặt bánh cưới trước 3 tuần, thử vị trước", category: "budget" },
  { id: 21, icon: "💄", text: "Thử makeup cô dâu trước 1 tuần", category: "planning" },
  { id: 22, icon: "🏠", text: "Trang trí nhà trước ngày đám hỏi 1-2 ngày", category: "tradition" },
  { id: 23, icon: "📱", text: "Gửi thông tin bàn ngồi cho khách qua tin nhắn", category: "guests" },
  { id: 24, icon: "🎤", text: "Chuẩn bị lời phát biểu cho hai bên gia đình", category: "tradition" },
  { id: 25, icon: "🌸", text: "Cổng hoa nên dựng trước 1 ngày để kịp chỉnh", category: "planning" },
  { id: 26, icon: "🧳", text: "Chuẩn bị hành lý tuần trăng mật trước 1 tuần", category: "general" },
  { id: 27, icon: "🎉", text: "Tổ chức tiệc nhỏ cảm ơn sau đám cưới 1 tuần", category: "general" },
  { id: 28, icon: "📊", text: "Tổng kết chi phí sau đám cưới để rút kinh nghiệm", category: "budget" },
  { id: 29, icon: "💝", text: "Viết thiệp cảm ơn gửi khách sau 1-2 tuần", category: "guests" },
  { id: 30, icon: "🔑", text: "Giữ bản sao hợp đồng nhà hàng và wedding planner", category: "budget" },
];
