export interface IdeaLink {
  page: string;
  tab?: number;
  hint: string;
}

export interface IdeaItemExt {
  icon: string;
  title: string;
  description: string;
  status: "done" | "planned" | "future";
  link?: IdeaLink;
}

export const IDEAS: IdeaItemExt[] = [
  {
    icon: "🗓️",
    title: "Countdown timer",
    description: "Đếm ngược đến ngày cưới, hiển thị trên header.",
    status: "done",
    link: { page: "planning", hint: "Header" },
  },
  {
    icon: "📊",
    title: "Dashboard chi phí thực tế",
    description: "Theo dõi chi phí thực vs dự toán, nhập từng khoản đã chi, biểu đồ so sánh.",
    status: "done",
    link: { page: "planning", tab: 7, hint: "Chi Phí" },
  },
  {
    icon: "📜",
    title: "Lưu trữ vĩnh viễn",
    description: "Export toàn bộ data ra JSON, import lại khi cần.",
    status: "done",
    link: { page: "ideas", hint: "Trang này" },
  },
  {
    icon: "🔗",
    title: "QR Code thiệp online",
    description: "Tạo QR code cho mỗi thiệp, khách quét để xem bản đồ, RSVP, album ảnh cưới.",
    status: "done",
    link: { page: "cards", hint: "Thiệp" },
  },
  {
    icon: "📱",
    title: "RSVP trực tuyến",
    description: "Gửi link cho khách xác nhận tham dự, tự đếm số bàn cần đặt.",
    status: "done",
    link: { page: "cards", hint: "Thiệp" },
  },
  {
    icon: "📋",
    title: "Sơ đồ bàn tiệc",
    description: "Kéo thả khách vào từng bàn, in sơ đồ chỗ ngồi.",
    status: "done",
    link: { page: "planning", tab: 8, hint: "Khách Mời" },
  },
  {
    icon: "🎨",
    title: "Theme màu tuỳ chỉnh",
    description: "Cho phép chọn bảng màu chủ đạo: pastel, đỏ truyền thống, xanh navy, hồng blush...",
    status: "done",
    link: { page: "planning", hint: "Footer" },
  },
  {
    icon: "📸",
    title: "Gallery ảnh cưới",
    description: "Upload & quản lý ảnh pre-wedding, ảnh ngày cưới.",
    status: "done",
    link: { page: "cards", hint: "Thiệp" },
  },
  {
    icon: "🔔",
    title: "Nhắc nhở tự động",
    description: "Gửi thông báo trước deadline: book vendor, gửi thiệp, thử váy...",
    status: "done",
    link: { page: "planning", hint: "Header" },
  },
  {
    icon: "💬",
    title: "Chat giữa cô dâu & chú rể",
    description: "Ghi chú, giao việc, cập nhật tiến độ cho nhau.",
    status: "done",
    link: { page: "planning", tab: 9, hint: "Ghi Chú" },
  },
  {
    icon: "🌍",
    title: "Multi-language",
    description: "Hỗ trợ tiếng Anh cho khách nước ngoài / Việt kiều.",
    status: "done",
    link: { page: "planning", hint: "Footer" },
  },
  {
    icon: "🎬",
    title: "Video timeline",
    description: "Tạo video slideshow tự động từ ảnh cưới + nhạc nền.",
    status: "done",
    link: { page: "handbook", hint: "Sổ Tay" },
  },
  {
    icon: "👗",
    title: "Mood board trang phục",
    description: "Pin ảnh váy cưới, vest, phụ kiện yêu thích để so sánh.",
    status: "future",
  },
  {
    icon: "🗺️",
    title: "Bản đồ vendor",
    description: "Map hiển thị nhà hàng, studio, tiệm hoa gần bạn.",
    status: "future",
  },
];
