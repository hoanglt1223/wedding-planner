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
      { text: "MC/người chứng hôn giới thiệu nghi thức Vow — giải thích ý nghĩa", responsible: "Người chứng hôn" },
      { text: "Nhạc nền acoustic nhẹ nhàng nổi lên — spotlight tập trung", responsible: "Kỹ thuật âm thanh" },
      { text: "Chú rể đọc lời thề nguyện trước — nhìn vào mắt cô dâu", responsible: "Chú rể" },
      { text: "Cô dâu đọc lời thề nguyện — chân thành, xúc động", responsible: "Cô dâu" },
      { text: "Trao nhẫn (nếu chưa trao ở nghi thức trước)", responsible: "Cô dâu & chú rể" },
      { text: "Nụ hôn đầu tiên với tư cách vợ chồng 💋", responsible: "Cô dâu & chú rể" },
      { text: "Khách mời vỗ tay, chúc phúc — giây phút thiêng liêng", responsible: "Khách mời" },
      { text: "Tung confetti / cánh hoa — kết thúc nghi thức", responsible: "Phù dâu & phù rể" },
    ],
    people: [
      { name: "Cô dâu", role: "Đọc lời thề nguyện", avatar: "👰" },
      { name: "Chú rể", role: "Đọc lời thề nguyện", avatar: "🤵" },
      { name: "Người chứng hôn", role: "Điều phối, dẫn dắt", avatar: "🎤" },
      { name: "Gia đình + bạn thân", role: "Chứng kiến, chúc phúc", avatar: "👥" },
    ],
    tips: [
      "Viết lời thề TỪ TRÁI TIM — chân thành quan trọng hơn hoàn hảo",
      "Thống nhất độ dài lời thề 2 người — tránh 1 người 5 phút, 1 người 30 giây",
      "Practice đọc nhiều lần trước — giọng chậm rãi, rõ ràng, không đọc nhanh",
      "Chuẩn bị khăn tay — CẢ HAI đều có thể khóc, đó là bình thường",
      "Nên tổ chức TRƯỚC tiệc hoặc ngoài trời lúc hoàng hôn — cảm xúc hơn",
      "Lễ Vow quy mô nhỏ (30-50 người) sẽ thân mật và cảm xúc hơn 300 người",
      "Có thể kết hợp ngay trên sân khấu tiệc nếu ngân sách hạn chế",
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
      { text: "MC giới thiệu — mời cô dâu chú rể ra sàn nhảy", responsible: "MC" },
      { text: "Ánh sáng dịu, spotlight tập trung — nhạc nổi lên", responsible: "Kỹ thuật âm thanh" },
      { text: "Cô dâu chú rể bước ra — bắt đầu khiêu vũ", responsible: "Cô dâu & chú rể" },
      { text: "Khiêu vũ 2-3 phút — đơn giản, ngọt ngào", responsible: "Cô dâu & chú rể" },
      { text: "Father-daughter dance / Mother-son dance (tùy chọn, rất cảm động)", responsible: "Bố mẹ hai bên" },
      { text: "Mời khách cùng ra sàn nhảy — bắt đầu phần sôi động", responsible: "MC" },
    ],
    people: [
      { name: "Cô dâu & chú rể", role: "Khiêu vũ", avatar: "💑" },
      { name: "Bố mẹ hai bên", role: "Father-daughter / Mother-son dance (tùy chọn)", avatar: "👫" },
    ],
    tips: [
      "KHÔNG cần phức tạp — đơn giản, chậm rãi, ôm nhau là đẹp nhất",
      "Nếu không tự tin nhảy: slow dance (ôm nhau lắc lư) hoàn toàn OK",
      "Father-daughter dance + Mother-son dance — khoảnh khắc cực kỳ cảm động",
      "DJ chuẩn bị sẵn nhạc sôi động sau first dance — kéo khách ra sàn",
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
      { text: "MC mời cô dâu chú rể lên sân khấu — giới thiệu phần cảm ơn", responsible: "MC" },
      { text: "Nhạc nền nhẹ nhàng — ánh sáng dịu, spotlight tập trung", responsible: "Kỹ thuật âm thanh" },
      { text: "Cô dâu đọc thư cho bố mẹ mình — kể kỷ niệm, bày tỏ lòng biết ơn", responsible: "Cô dâu" },
      { text: "Trao quà cho bố mẹ cô dâu — ôm, khóc 😢", responsible: "Cô dâu" },
      { text: "Chú rể đọc thư cho bố mẹ mình — cảm ơn sinh thành dưỡng dục", responsible: "Chú rể" },
      { text: "Trao quà cho bố mẹ chú rể — ôm, bày tỏ tình cảm", responsible: "Chú rể" },
      { text: "Bố mẹ hai bên chúc phúc — lời dặn dò cuối cùng", responsible: "Bố mẹ hai bên" },
      { text: "Cả sảnh xúc động — khoảnh khắc đẹp nhất tiệc cưới", responsible: "Cô dâu & chú rể" },
    ],
    people: [
      { name: "Cô dâu", role: "Đọc thư cho bố mẹ mình", avatar: "👰" },
      { name: "Chú rể", role: "Đọc thư cho bố mẹ mình", avatar: "🤵" },
      { name: "Bố mẹ cô dâu", role: "Nhận thư, nhận quà", avatar: "👫" },
      { name: "Bố mẹ chú rể", role: "Nhận thư, nhận quà", avatar: "👫" },
    ],
    tips: [
      "Viết từ trái tim — kể kỷ niệm CỤ THỂ với bố mẹ (cảm xúc hơn sáo rỗng)",
      "Độ dài vừa phải: 3-5 phút đọc — không quá dài, không quá ngắn",
      "Cảm ơn CẢ 2 BÊN bố mẹ — không quên bên nào",
      "Chuẩn bị khăn tay — CẢ SẢN sẽ khóc, không chỉ bố mẹ",
      "Nếu khóc không đọc được — chú rể/cô dâu đọc hộ, hoàn toàn bình thường",
    ],
  },
];
