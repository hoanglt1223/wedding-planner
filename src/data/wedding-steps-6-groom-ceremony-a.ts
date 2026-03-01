import type { Ceremony, PrayerItem } from "@/types/wedding";

// ===== Văn khấn trong LỄ TÂN HÔN (gia tiên nhà trai) =====
const GROOM_PRAYERS: PrayerItem[] = [
  {
    emoji: "🕯️",
    title: "Văn khấn gia tiên nhà trai — Lễ tân hôn",
    occasion: "Lễ tân hôn — khi cô dâu về đến nhà trai, trước tiệc cưới",
    type: "prayer",
    note: "Bố hoặc ông chú rể khấn. Đôi trẻ thắp nhang, lạy 3 lạy. Từ đây cô dâu chính thức trở thành thành viên gia đình nhà trai. Phải diễn ra TRƯỚC tiệc — không gian yên tĩnh, trang nghiêm.",
    text: `Nam mô A Di Đà Phật (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ, chư vị Tôn thần.
Con kính lạy ngài Bản cảnh Thành hoàng, ngài Bản xứ Thổ địa, ngài Bản gia Táo quân.
Con kính lạy Cao tằng Tổ khảo, Cao tằng Tổ tỷ, Tiên linh nội ngoại họ [HỌ NHÀ TRAI].

Hôm nay ngày ... tháng ... năm ... (âm lịch),
Tại [ĐỊA CHỈ NHÀ TRAI],

Con là [TÊN BA CHÚ RỂ], ngụ tại [ĐỊA CHỈ].
Nay con trai chúng con là [TÊN CHÚ RỂ], sinh năm ..., đã thành hôn cùng [TÊN CÔ DÂU], con ông/bà [TÊN BA MẸ CÔ DÂU].

Chúng con thành tâm kính cáo, xin Tiên tổ chứng giám, phù hộ cho hai cháu:
— Vợ chồng hòa thuận, kính trên nhường dưới
— Sớm sinh quý tử, gia đình hưng thịnh
— Hai nhà thông gia an khang, hạnh phúc

Nam mô A Di Đà Phật (3 lần)`,
  },
  {
    emoji: "🏠",
    title: "Văn khấn nhập trạch — Cô dâu về nhà chồng",
    occasion: "Lễ tân hôn — khoảnh khắc cô dâu bước vào nhà chồng",
    type: "prayer",
    note: "Mẹ chồng hoặc người lớn trong nhà đọc khi cô dâu bước qua cửa. Một số vùng có tục bước qua bếp than (miền Trung) hoặc chậu lửa nhỏ. Ngắn gọn, ấm áp.",
    text: `Nam mô A Di Đà Phật (3 lần)

Con kính lạy Thổ Công, Táo Quân và chư vị thần linh cai quản ngôi nhà này.
Con kính lạy Tiên tổ nội ngoại họ [HỌ NHÀ TRAI].

Hôm nay con dâu mới [TÊN CÔ DÂU] chính thức bước vào nhà, trở thành thành viên của gia đình họ [HỌ NHÀ TRAI].

Xin Thổ Công, thần linh chứng giám và phù hộ cho con dâu mới:
— Sớm thích nghi, hòa thuận với gia đình
— Vợ chồng đồng lòng, gia đạo hưng vượng
— Mọi người khỏe mạnh, bình an

Nam mô A Di Đà Phật (3 lần)`,
  },
];

// Core ceremonies for Step 6: Cưới Trai (groom-specific, not shared)
export const GROOM_CEREMONIES_A: Ceremony[] = [
  {
    name: "🙏 Gia Tiên Nhà Trai",
    required: 1,
    description: "Cô dâu chính thức lạy tổ tiên nhà chồng — từ đây cô dâu trở thành thành viên của gia đình nhà trai. Nghi lễ thiêng liêng, trang trọng, phải diễn ra TRƯỚC tiệc.",
    steps: [
      { text: "Bàn thờ sạch sẽ, trang nghiêm: hoa tươi, nhang, nến", cost: 300000, categoryKey: "decor", checkable: true },
      { text: "Mâm cúng: xôi, gà, trái cây, rượu, trà", cost: 700000, categoryKey: "food", checkable: true },
      { text: "Ảnh gia tiên (nếu có) đặt ngay ngắn", cost: 0, categoryKey: "other", checkable: true },
      { text: "Văn khấn gia tiên nhà trai (ba chú rể / trưởng tộc đọc)", cost: 0, categoryKey: "other", checkable: true, detail: "\"Nam mô A Di Đà Phật (3 lần). Con kính lạy chư vị Tôn thần, Cao tằng Tổ khảo, Tổ tỷ, Tiên linh nội ngoại họ [HỌ NHÀ TRAI]. Hôm nay ngày... tháng... năm..., con là [TÊN BA CHÚ RỂ], ngụ tại [ĐỊA CHỈ]. Nay con trai chúng con là [TÊN CHÚ RỂ] đã thành hôn cùng [TÊN CÔ DÂU], con ông/bà [TÊN BA MẸ CÔ DÂU]. Chúng con thành tâm kính cáo, xin Tiên tổ chứng giám, phù hộ cho hai cháu sống hạnh phúc, hòa thuận, gia đình an khang thịnh vượng. Nam mô A Di Đà Phật (3 lần).\"" },
      { text: "Trà ngon để rót mời bố mẹ, ông bà", cost: 100000, categoryKey: "food", checkable: true },
      { text: "Lì xì/phong bì cho cô dâu chú rể", cost: 500000, categoryKey: "other", checkable: true, time: "09:40", responsible: "Bố mẹ chú rể" },
      { text: "Nhà trai chuẩn bị bàn thờ, mâm cúng", time: "08:30", responsible: "Mẹ chồng" },
      { text: "Đoàn rước dâu về đến nhà trai", time: "09:00", responsible: "Chú rể" },
      { text: "Mẹ chồng đón cô dâu ở cửa nhà — trao quà chào đón (vòng vàng)", time: "09:05", responsible: "Mẹ chồng" },
      { text: "Cô dâu bước vào nhà bằng chân PHẢI", time: "09:10", responsible: "Cô dâu", note: "Phong tục may mắn" },
      { text: "Dẫn cô dâu chú rể đến trước bàn thờ", time: "09:15", responsible: "Bố mẹ chú rể" },
      { text: "Bố/ông thắp nhang, khấn vái trình tổ tiên", time: "09:20", responsible: "Bố chú rể" },
      { text: "Cô dâu chú rể lạy 3 lạy trước bàn thờ", time: "09:25", responsible: "Cô dâu & chú rể" },
      { text: "Cô dâu rót trà mời bố mẹ chồng, ông bà", time: "09:30", responsible: "Cô dâu" },
      { text: "Chụp ảnh gia đình trước bàn thờ", time: "09:50", responsible: "Nhiếp ảnh" },
    ],
    prayers: GROOM_PRAYERS,
    people: [
      { name: "Cô dâu & chú rể", role: "Thắp hương, lạy tổ tiên", avatar: "💑" },
      { name: "Bố mẹ chú rể", role: "Hướng dẫn nghi lễ, khấn vái", avatar: "👫" },
      { name: "Ông bà (nếu có)", role: "Chúc phúc", avatar: "👴" },
    ],
  },
  {
    name: "🎊 Tiệc Chính",
    required: 1,
    description: "Tiệc cưới linh đình nhất — đón khách hai họ, trao nhẫn, cắt bánh, games, first dance. Đây là sự kiện lớn nhất, cần chuẩn bị kỹ lưỡng nhất.",
    steps: [
      { text: "Đặt nhà hàng (xác nhận bàn + dự phòng 10%)", cost: 25000000, categoryKey: "venue", checkable: true },
      { text: "In & gửi thiệp mời (trước 2-3 tuần)", cost: 2000000, categoryKey: "other", checkable: true },
      { text: "Menu tiệc 8-10 món + rượu bia nước ngọt", cost: 30000000, categoryKey: "food", checkable: true },
      { text: "MC chuyên nghiệp + ban nhạc/DJ + âm thanh ánh sáng", cost: 11000000, categoryKey: "mc", checkable: true },
      { text: "Trang trí: sân khấu, backdrop, cổng hoa, bàn gallery", cost: 8000000, categoryKey: "decor", checkable: true },
      { text: "Ảnh + video trọn gói (pre-wedding + ngày cưới)", cost: 10000000, categoryKey: "photo", checkable: true },
      { text: "Váy cưới soirée + váy after party", cost: 8000000, categoryKey: "clothes", checkable: true },
      { text: "Vest chú rể (may đo hoặc thuê)", cost: 3000000, categoryKey: "clothes", checkable: true },
      { text: "Makeup & hair stylist CẢ NGÀY", cost: 5000000, categoryKey: "makeup", checkable: true },
      { text: "Nhẫn cưới cặp — kiểm tra lần cuối!", cost: 5000000, categoryKey: "ring", checkable: true },
      { text: "Quà cho khách (kẹo, socola, thiệp cảm ơn)", cost: 3000000, categoryKey: "other", checkable: true },
      { text: "Bánh cưới nhiều tầng (đặt trước 1 tuần)", cost: 3000000, categoryKey: "food", checkable: true },
      { text: "Phòng tân hôn: hoa, nến, ga giường đỏ mới", cost: 2000000, categoryKey: "other", checkable: true },
      { text: "Kịch bản MC chi tiết từng phút + bản backup", cost: 0, categoryKey: "other", checkable: true },
      { text: "Sơ đồ bàn: VIP gần sân khấu, bạn bè phía sau", cost: 0, categoryKey: "other", checkable: true },
      { text: "Kit cấp cứu ngày cưới (đồ dự phòng)", cost: 100000, categoryKey: "other", checkable: true, detail: "Gồm: kim ghim, băng dính 2 mặt, thuốc nhức đầu, thuốc dạ dày, dầu gió, khăn giấy, nước uống, kẹo ngậm, son touch-up, bàn chải nhỏ, kim chỉ, keo dán, pin mic dự phòng." },
      { text: "Kiểm tra trang trí, âm thanh, ánh sáng, backdrop", time: "07:00", responsible: "Wedding planner" },
      { text: "Cô dâu thay váy cưới, touch-up makeup", time: "08:00", responsible: "Cô dâu + MUA" },
      { text: "Lễ tân sẵn sàng, bắt đầu đón khách", time: "08:30", responsible: "Lễ tân" },
      { text: "Khách vào đông, MC kiểm tra mic, nhạc", time: "09:00", responsible: "MC + kỹ thuật" },
      { text: "MC khai tiệc — chào mừng, giới thiệu gia đình", time: "09:30", responsible: "MC" },
      { text: "Bố mẹ chú rể phát biểu", time: "09:40", responsible: "Bố mẹ chú rể" },
      { text: "Cô dâu chú rể lên sân khấu, trao nhẫn cưới", time: "09:50", responsible: "Cô dâu & chú rể", note: "Khoảnh khắc thiêng liêng nhất" },
      { text: "Cắt bánh cưới, nâng ly champagne", time: "10:00", responsible: "Cô dâu & chú rể" },
      { text: "Khai tiệc — phục vụ món ăn", time: "10:10", responsible: "Nhà hàng" },
      { text: "Đi bàn chúc rượu, cảm ơn từng bàn", time: "10:30", responsible: "Cô dâu & chú rể", note: "Mỗi bàn 2-3 phút" },
      { text: "Chương trình văn nghệ, games vui nhộn", time: "11:15", responsible: "MC + ban nhạc" },
      { text: "First dance — khiêu vũ mở màn", time: "11:30", responsible: "Cô dâu & chú rể" },
      { text: "Thư cảm ơn bố mẹ (nếu có)", time: "11:40", responsible: "Cô dâu & chú rể", note: "Khoảnh khắc cảm động nhất" },
      { text: "Tung hoa cưới cho các cô gái", time: "11:50", responsible: "Cô dâu" },
      { text: "Tiễn khách, cảm ơn, trao quà", time: "12:00", responsible: "Cô dâu & chú rể" },
      { text: "Thu dọn, kiểm tra phong bì, quà", time: "12:30", responsible: "Gia đình + lễ tân" },
    ],
    people: [
      { name: "Bố mẹ chú rể", role: "Chủ tiệc, phát biểu", avatar: "👫" },
      { name: "MC", role: "Điều phối từng phút", avatar: "🎤" },
      { name: "Nhiếp ảnh & quay phim", role: "Ghi hình trọn buổi", avatar: "📷" },
      { name: "Phù dâu & phù rể", role: "Hỗ trợ cô dâu chú rể", avatar: "👫" },
      { name: "Lễ tân", role: "Đón khách, ghi phong bì", avatar: "📋" },
      { name: "Ban nhạc / DJ", role: "Âm nhạc suốt tiệc", avatar: "🎵" },
      { name: "Wedding planner", role: "Điều phối (nếu thuê)", avatar: "📝" },
    ],
  },
];
