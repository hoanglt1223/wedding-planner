import type { Ceremony } from "@/types/wedding";

// Ceremonies 5-8 for Step 6: Cưới Trai
export const GROOM_CEREMONIES_B: Ceremony[] = [
  {
    name: "📜 Lễ Vow (Thề Nguyện)",
    required: 0,
    description: "Cô dâu chú rể trao nhau lời thề nguyện thiêng liêng — xu hướng đám cưới hiện đại kết hợp nét lãng mạn phương Tây với tình yêu Việt Nam. Có thể theo 5 phong cách: lãng mạn, hài hước, chân thành, truyền thống, hoặc hiện đại.",
    steps: [
      // Checklist items (checkable: true) — FIRST
      { text: "Viết lời thề nguyện (mỗi người 1-2 phút đọc)", cost: 0, categoryKey: "other", checkable: true },
      { text: "Viết nháp trước 2 tuần — practice đọc trước gương", cost: 0, categoryKey: "other", checkable: true },
      { text: "Sổ/giấy đẹp ghi lời thề (handwritten = cảm xúc hơn)", cost: 100000, categoryKey: "other", checkable: true },
      { text: "Bản in backup phòng quên — người nhắc lời đứng cạnh", cost: 0, categoryKey: "other", checkable: true },
      { text: "Người chứng hôn (MC hoặc bạn thân thân thiết)", cost: 0, categoryKey: "other", checkable: true },
      { text: "Setup: cổng hoa, nến, ánh sáng nhẹ, không gian riêng", cost: 3000000, categoryKey: "decor", checkable: true },
      { text: "Nhạc nền acoustic/piano — nhẹ nhàng, không át tiếng đọc", cost: 1000000, categoryKey: "music", checkable: true },
      { text: "Khăn tay cho khách và cô dâu (giây phút sẽ rất xúc động)", cost: 200000, categoryKey: "other", checkable: true },
      { text: "Mic riêng cho mỗi người — đảm bảo khách nghe rõ", cost: 0, categoryKey: "other", checkable: true },
      { text: "Nhiếp ảnh/quay phim close-up biểu cảm", cost: 0, categoryKey: "photo", checkable: true },
      // Ritual steps (non-checkable) — AFTER checklist
      { text: "MC/người chứng hôn giới thiệu nghi thức Vow — giải thích ý nghĩa", time: "09:40", responsible: "Người chứng hôn" },
      { text: "Nhạc nền acoustic nhẹ nhàng nổi lên — spotlight tập trung", time: "09:41", responsible: "Kỹ thuật âm thanh" },
      { text: "Chú rể đọc lời thề nguyện trước — nhìn vào mắt cô dâu", time: "09:42", responsible: "Chú rể" },
      { text: "Cô dâu đọc lời thề nguyện — chân thành, xúc động", time: "09:44", responsible: "Cô dâu" },
      { text: "Trao nhẫn (nếu chưa trao ở nghi thức trước)", time: "09:46", responsible: "Cô dâu & chú rể" },
      { text: "Nụ hôn đầu tiên với tư cách vợ chồng 💋", time: "09:47", responsible: "Cô dâu & chú rể" },
      { text: "Khách mời vỗ tay, chúc phúc — giây phút thiêng liêng", time: "09:48", responsible: "Khách mời" },
      { text: "Tung confetti / cánh hoa — kết thúc nghi thức", time: "09:50", responsible: "Phù dâu & phù rể" },
    ],
    people: [
      { name: "Cô dâu", role: "Đọc lời thề nguyện", avatar: "👰" },
      { name: "Chú rể", role: "Đọc lời thề nguyện", avatar: "🤵" },
      { name: "Người chứng hôn", role: "Điều phối, dẫn dắt", avatar: "🎤" },
      { name: "Gia đình + bạn thân", role: "Chứng kiến, chúc phúc", avatar: "👥" },
    ],
  },
  {
    name: "🎵 First Dance",
    required: 0,
    description: "Điệu nhảy đầu tiên với tư cách vợ chồng — khoảnh khắc lãng mạn nhất tiệc cưới. Không cần phức tạp, chỉ cần ngọt ngào và chân thành.",
    steps: [
      // Checklist items (checkable: true) — FIRST
      { text: "Chọn bài nhạc cả 2 đều thích — ý nghĩa với câu chuyện tình yêu", cost: 0, categoryKey: "other", checkable: true },
      { text: "Tập dance trước 2-4 tuần (có thể thuê dance coach)", cost: 1000000, categoryKey: "other", checkable: true },
      { text: "Sân khấu/sàn nhảy đủ rộng + spotlight đẹp", cost: 0, categoryKey: "decor", checkable: true },
      { text: "Chuẩn bị giày thoải mái — đặc biệt cô dâu", cost: 0, categoryKey: "clothes", checkable: true },
      { text: "Thử sàn nhảy trước — kiểm tra trơn, cứng, mềm", cost: 0, categoryKey: "other", checkable: true },
      // Ritual steps (non-checkable) — AFTER checklist
      { text: "MC giới thiệu — mời cô dâu chú rể ra sàn nhảy", time: "11:30", responsible: "MC" },
      { text: "Ánh sáng dịu, spotlight tập trung — nhạc nổi lên", time: "11:31", responsible: "Kỹ thuật âm thanh" },
      { text: "Cô dâu chú rể bước ra — bắt đầu khiêu vũ", time: "11:32", responsible: "Cô dâu & chú rể" },
      { text: "Khiêu vũ 2-3 phút — đơn giản, ngọt ngào", time: "11:33", responsible: "Cô dâu & chú rể" },
      { text: "Father-daughter dance / Mother-son dance (tùy chọn, rất cảm động)", time: "11:36", responsible: "Bố mẹ hai bên" },
      { text: "Mời khách cùng ra sàn nhảy — bắt đầu phần sôi động", time: "11:40", responsible: "MC" },
    ],
    people: [
      { name: "Cô dâu & chú rể", role: "Khiêu vũ", avatar: "💑" },
      { name: "Bố mẹ hai bên", role: "Father-daughter / Mother-son dance (tùy chọn)", avatar: "👫" },
    ],
  },
  {
    name: "✉️ Thư Cảm Ơn Bố Mẹ",
    required: 0,
    description: "Cô dâu chú rể đọc thư cảm ơn chân thành gửi bố mẹ hai bên — kể lại kỷ niệm, bày tỏ lòng biết ơn. Đây thường là khoảnh khắc CẢM ĐỘNG NHẤT trong toàn bộ tiệc cưới.",
    steps: [
      // Checklist items (checkable: true) — FIRST
      { text: "Viết thư tay cho bố mẹ mình (chân thành, từ trái tim)", cost: 0, categoryKey: "other", checkable: true },
      { text: "Viết nháp trước 2 tuần — practice đọc cho trôi chảy", cost: 0, categoryKey: "other", checkable: true },
      { text: "Bản in backup phòng quên/khóc không đọc được", cost: 0, categoryKey: "other", checkable: true },
      { text: "Quà tặng kèm: hoa, khung ảnh, album gia đình", cost: 500000, categoryKey: "other", checkable: true },
      { text: "Khăn tay cho cô dâu, chú rể, bố mẹ, khách VIP", cost: 100000, categoryKey: "other", checkable: true },
      { text: "Mic riêng — đảm bảo cả sảnh nghe rõ", cost: 0, categoryKey: "other", checkable: true },
      // Ritual steps (non-checkable) — AFTER checklist
      { text: "MC mời cô dâu chú rể lên sân khấu — giới thiệu phần cảm ơn", time: "11:40", responsible: "MC" },
      { text: "Nhạc nền nhẹ nhàng — ánh sáng dịu, spotlight tập trung", time: "11:41", responsible: "Kỹ thuật âm thanh" },
      { text: "Cô dâu đọc thư cho bố mẹ mình — kể kỷ niệm, bày tỏ lòng biết ơn", time: "11:42", responsible: "Cô dâu" },
      { text: "Trao quà cho bố mẹ cô dâu — ôm, khóc 😢", time: "11:45", responsible: "Cô dâu" },
      { text: "Chú rể đọc thư cho bố mẹ mình — cảm ơn sinh thành dưỡng dục", time: "11:47", responsible: "Chú rể" },
      { text: "Trao quà cho bố mẹ chú rể — ôm, bày tỏ tình cảm", time: "11:50", responsible: "Chú rể" },
      { text: "Bố mẹ hai bên chúc phúc — lời dặn dò cuối cùng", time: "11:52", responsible: "Bố mẹ hai bên" },
      { text: "Cả sảnh xúc động — khoảnh khắc đẹp nhất tiệc cưới", time: "11:55", responsible: "Cô dâu & chú rể" },
    ],
    people: [
      { name: "Cô dâu", role: "Đọc thư cho bố mẹ mình", avatar: "👰" },
      { name: "Chú rể", role: "Đọc thư cho bố mẹ mình", avatar: "🤵" },
      { name: "Bố mẹ cô dâu", role: "Nhận thư, nhận quà", avatar: "👫" },
      { name: "Bố mẹ chú rể", role: "Nhận thư, nhận quà", avatar: "👫" },
    ],
  },
];
