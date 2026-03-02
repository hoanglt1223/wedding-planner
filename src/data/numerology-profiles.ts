// Thần Số Học — Life Path profiles (1-9, 11, 22, 33)

export interface NumerologyNumberProfile {
  number: number;
  name: string;
  emoji: string;
  keywords: string[];
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  marriageDisposition: string;
  luckyNumbers: number[];
  luckyColors: string[];
  careers: string[];
  weddingAdvice: string;
}

export const NUMEROLOGY_PROFILES: NumerologyNumberProfile[] = [
  {
    number: 1, name: "Người Tiên Phong", emoji: "👑",
    keywords: ["Lãnh đạo", "Độc lập", "Sáng tạo"],
    traits: ["Quyết đoán", "Tham vọng", "Tự tin", "Năng động"],
    strengths: ["Khả năng lãnh đạo", "Sáng kiến", "Ý chí mạnh mẽ"],
    weaknesses: ["Bướng bỉnh", "Ích kỷ", "Thiếu kiên nhẫn"],
    marriageDisposition: "Cần đối tác tôn trọng sự độc lập, sẵn sàng chia sẻ quyền quyết định.",
    luckyNumbers: [1, 5, 7], luckyColors: ["Đỏ", "Vàng", "Cam"],
    careers: ["Doanh nhân", "Giám đốc", "Nhà phát minh"],
    weddingAdvice: "Chọn ngày cưới mang năng lượng số 1 hoặc 9 để khởi đầu mạnh mẽ.",
  },
  {
    number: 2, name: "Người Hòa Giải", emoji: "🤝",
    keywords: ["Hợp tác", "Nhạy cảm", "Hài hòa"],
    traits: ["Kiên nhẫn", "Ngoại giao", "Lắng nghe", "Tinh tế"],
    strengths: ["Hòa giải", "Trực giác tốt", "Đồng cảm sâu sắc"],
    weaknesses: ["Thiếu quyết đoán", "Nhạy cảm quá mức", "Phụ thuộc"],
    marriageDisposition: "Rất phù hợp hôn nhân, luôn đặt hạnh phúc đôi lứa lên đầu.",
    luckyNumbers: [2, 7, 8], luckyColors: ["Trắng", "Xanh dương", "Bạc"],
    careers: ["Nhà ngoại giao", "Tư vấn viên", "Nghệ sĩ"],
    weddingAdvice: "Ngày cưới mang số 2 hoặc 6 tạo nền tảng tình yêu bền vững.",
  },
  {
    number: 3, name: "Người Sáng Tạo", emoji: "🎨",
    keywords: ["Sáng tạo", "Lạc quan", "Giao tiếp"],
    traits: ["Vui vẻ", "Hài hước", "Biểu cảm", "Truyền cảm hứng"],
    strengths: ["Sáng tạo nghệ thuật", "Giao tiếp xuất sắc", "Lạc quan"],
    weaknesses: ["Hời hợt", "Thiếu tập trung", "Phung phí"],
    marriageDisposition: "Mang lại niềm vui và tiếng cười cho gia đình, cần đối tác ổn định.",
    luckyNumbers: [3, 6, 9], luckyColors: ["Vàng", "Tím", "Hồng"],
    careers: ["Nghệ sĩ", "Nhà văn", "MC", "Thiết kế"],
    weddingAdvice: "Đám cưới sáng tạo, nhiều màu sắc sẽ phản ánh bản chất số 3.",
  },
  {
    number: 4, name: "Người Xây Dựng", emoji: "🏗️",
    keywords: ["Ổn định", "Kỷ luật", "Thực tế"],
    traits: ["Chăm chỉ", "Đáng tin cậy", "Có tổ chức", "Kiên trì"],
    strengths: ["Xây dựng nền tảng", "Quản lý tốt", "Trung thành"],
    weaknesses: ["Cứng nhắc", "Bảo thủ", "Hay lo lắng"],
    marriageDisposition: "Đối tác trung thành và đáng tin cậy, xây dựng gia đình vững chắc.",
    luckyNumbers: [4, 8, 2], luckyColors: ["Xanh lá", "Nâu", "Xanh navy"],
    careers: ["Kỹ sư", "Kiến trúc sư", "Kế toán"],
    weddingAdvice: "Lên kế hoạch cưới chu đáo, chọn ngày mang số 4 hoặc 8 cho sự ổn định.",
  },
  {
    number: 5, name: "Người Tự Do", emoji: "🌍",
    keywords: ["Phiêu lưu", "Linh hoạt", "Tự do"],
    traits: ["Năng động", "Đa tài", "Tò mò", "Thích nghi nhanh"],
    strengths: ["Thích nghi", "Đa năng", "Lôi cuốn"],
    weaknesses: ["Bồn chồn", "Thiếu kiên nhẫn", "Hay thay đổi"],
    marriageDisposition: "Cần không gian tự do trong hôn nhân, tránh sự gò bó.",
    luckyNumbers: [5, 1, 3], luckyColors: ["Xanh ngọc", "Cam", "Đỏ"],
    careers: ["Du lịch", "Nhà báo", "Marketing", "Kinh doanh"],
    weddingAdvice: "Đám cưới ngoài trời hoặc destination wedding phù hợp năng lượng số 5.",
  },
  {
    number: 6, name: "Người Chăm Sóc", emoji: "💝",
    keywords: ["Gia đình", "Trách nhiệm", "Yêu thương"],
    traits: ["Chu đáo", "Bao dung", "Trách nhiệm", "Ấm áp"],
    strengths: ["Nuôi dưỡng", "Hài hòa gia đình", "Đẹp thẩm mỹ"],
    weaknesses: ["Hay lo lắng", "Kiểm soát", "Hy sinh quá mức"],
    marriageDisposition: "Số hôn nhân lý tưởng nhất, luôn đặt gia đình lên hàng đầu.",
    luckyNumbers: [6, 2, 9], luckyColors: ["Hồng", "Xanh pastel", "Trắng kem"],
    careers: ["Y tế", "Giáo dục", "Thiết kế nội thất"],
    weddingAdvice: "Ngày cưới mang số 6 là ngày hoàn hảo nhất cho tình yêu và gia đình.",
  },
  {
    number: 7, name: "Người Tìm Kiếm", emoji: "🔍",
    keywords: ["Trí tuệ", "Tâm linh", "Phân tích"],
    traits: ["Sâu sắc", "Trầm tư", "Hoài nghi", "Cầu toàn"],
    strengths: ["Phân tích", "Trực giác", "Chiều sâu tư duy"],
    weaknesses: ["Cô lập", "Khó gần", "Hay nghi ngờ"],
    marriageDisposition: "Cần thời gian riêng tư, tìm đối tác hiểu và tôn trọng không gian.",
    luckyNumbers: [7, 3, 5], luckyColors: ["Tím", "Xanh biển đậm", "Bạc"],
    careers: ["Nhà nghiên cứu", "Triết gia", "Lập trình viên"],
    weddingAdvice: "Đám cưới nhỏ, ấm cúng, tập trung vào ý nghĩa hơn hình thức.",
  },
  {
    number: 8, name: "Người Thành Đạt", emoji: "💎",
    keywords: ["Quyền lực", "Thành công", "Vật chất"],
    traits: ["Tham vọng", "Thực tế", "Quyết đoán", "Có tầm nhìn"],
    strengths: ["Kinh doanh", "Tổ chức", "Quản lý tài chính"],
    weaknesses: ["Tham công", "Vật chất", "Kiểm soát"],
    marriageDisposition: "Mang lại sự an toàn tài chính, cần cân bằng giữa công việc và gia đình.",
    luckyNumbers: [8, 4, 2], luckyColors: ["Vàng gold", "Đen", "Đỏ đậm"],
    careers: ["CEO", "Tài chính", "Bất động sản", "Luật sư"],
    weddingAdvice: "Đám cưới sang trọng, chọn ngày mang số 8 cho sự thịnh vượng.",
  },
  {
    number: 9, name: "Người Nhân Ái", emoji: "🌟",
    keywords: ["Nhân ái", "Vị tha", "Lý tưởng"],
    traits: ["Rộng lượng", "Từ bi", "Lãng mạn", "Trực giác mạnh"],
    strengths: ["Lòng nhân ái", "Tầm nhìn rộng", "Truyền cảm hứng"],
    weaknesses: ["Lý tưởng hóa", "Hay thất vọng", "Khó buông bỏ"],
    marriageDisposition: "Yêu say đắm và hết mình, cần đối tác chia sẻ lý tưởng sống.",
    luckyNumbers: [9, 3, 6], luckyColors: ["Đỏ", "Vàng đồng", "Trắng"],
    careers: ["Nhà hoạt động xã hội", "Bác sĩ", "Nghệ sĩ", "Giáo viên"],
    weddingAdvice: "Đám cưới ý nghĩa với hoạt động từ thiện, chọn ngày số 9 cho tình yêu lớn.",
  },
  {
    number: 11, name: "Người Trực Giác", emoji: "✨",
    keywords: ["Trực giác", "Tâm linh", "Truyền cảm hứng"],
    traits: ["Nhạy cảm cao", "Tầm nhìn xa", "Lý tưởng", "Sáng suốt"],
    strengths: ["Trực giác phi thường", "Truyền cảm hứng", "Nhạy bén tâm linh"],
    weaknesses: ["Căng thẳng", "Nhạy cảm quá mức", "Hay lo âu"],
    marriageDisposition: "Kết nối tâm hồn sâu sắc, cần đối tác thấu hiểu chiều sâu cảm xúc.",
    luckyNumbers: [11, 2, 7], luckyColors: ["Trắng", "Bạc", "Tím lavender"],
    careers: ["Nhà tâm lý", "Nghệ sĩ", "Cố vấn tâm linh"],
    weddingAdvice: "Chọn ngày cưới có ý nghĩa tâm linh đặc biệt với cả hai.",
  },
  {
    number: 22, name: "Người Kiến Tạo", emoji: "🌐",
    keywords: ["Kiến tạo", "Tầm nhìn lớn", "Thực hiện"],
    traits: ["Có tầm nhìn", "Thực tế", "Kỷ luật", "Quyền lực"],
    strengths: ["Biến tầm nhìn thành hiện thực", "Lãnh đạo", "Xây dựng di sản"],
    weaknesses: ["Áp lực lớn", "Cầu toàn", "Hay kiểm soát"],
    marriageDisposition: "Xây dựng gia đình như một dự án lớn, cần đối tác kiên nhẫn và hỗ trợ.",
    luckyNumbers: [22, 4, 8], luckyColors: ["Xanh ngọc lục", "Vàng gold", "Trắng"],
    careers: ["Kiến trúc sư", "CEO tập đoàn", "Chính trị gia"],
    weddingAdvice: "Lên kế hoạch đám cưới quy mô lớn, hoành tráng nhưng có tổ chức.",
  },
  {
    number: 33, name: "Người Dạy Dỗ", emoji: "🙏",
    keywords: ["Yêu thương vô điều kiện", "Chữa lành", "Phục vụ"],
    traits: ["Từ bi", "Tận tụy", "Chữa lành", "Hy sinh"],
    strengths: ["Tình yêu vô điều kiện", "Chữa lành", "Truyền cảm hứng"],
    weaknesses: ["Hy sinh quá mức", "Lý tưởng hóa", "Kiệt sức"],
    marriageDisposition: "Tình yêu thiêng liêng, dành trọn tâm huyết cho gia đình và cộng đồng.",
    luckyNumbers: [33, 6, 9], luckyColors: ["Hồng", "Tím", "Trắng"],
    careers: ["Nhà giáo dục", "Bác sĩ", "Nhà hoạt động nhân đạo"],
    weddingAdvice: "Đám cưới ấm áp, tập trung vào tình yêu và lòng biết ơn gia đình.",
  },
];

/** Lookup a profile by number. Falls back to reduced single digit. */
export function getNumerologyProfile(num: number): NumerologyNumberProfile {
  return (
    NUMEROLOGY_PROFILES.find((p) => p.number === num) ??
    NUMEROLOGY_PROFILES.find((p) => p.number === (num % 9 || 9)) ??
    NUMEROLOGY_PROFILES[0]
  );
}
