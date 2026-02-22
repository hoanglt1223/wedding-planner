// Vietnamese Zodiac (Con Giáp) personality profiles
// Order matches EARTHLY_BRANCHES in astrology.ts: Tý(0)…Hợi(11)

export interface ZodiacProfile {
  branch: string;
  animal: string;
  emoji: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  marriageDisposition: string;
  luckyNumbers: number[];
  luckyColors: string[];
  luckyDirections: string[];
  compatibleSigns: string[];
  careers: string[];
}

export const ZODIAC_PROFILES: ZodiacProfile[] = [
  {
    branch: "Tý", animal: "Chuột", emoji: "🐀",
    traits: ["Thông minh", "Nhạy bén", "Linh hoạt", "Tiết kiệm"],
    strengths: ["Khả năng thích ứng cao", "Tư duy nhanh nhạy", "Quản lý tài chính giỏi"],
    weaknesses: ["Hay tính toán", "Thiếu quyết đoán khi áp lực"],
    marriageDisposition: "Thực dụng trong tình yêu, chọn bạn đời cẩn thận. Trung thành và đáng tin khi mối quan hệ đã ổn định.",
    luckyNumbers: [2, 3],
    luckyColors: ["Xanh lá", "Vàng"],
    luckyDirections: ["Bắc", "Đông Nam"],
    compatibleSigns: ["Thìn", "Thân", "Sửu"],
    careers: ["Kinh doanh", "Tài chính", "Công nghệ thông tin"],
  },
  {
    branch: "Sửu", animal: "Trâu", emoji: "🐂",
    traits: ["Chăm chỉ", "Kiên nhẫn", "Trách nhiệm", "Bảo thủ"],
    strengths: ["Đáng tin cậy", "Kiên trì bền bỉ", "Có trách nhiệm cao"],
    weaknesses: ["Bảo thủ, khó thay đổi", "Chậm thích nghi với cái mới"],
    marriageDisposition: "Bạn đời đáng tin, xem gia đình là ưu tiên hàng đầu. Chậm yêu nhưng khi đã yêu thì bền vững, trung thành.",
    luckyNumbers: [1, 4],
    luckyColors: ["Xanh lá", "Đỏ", "Tím"],
    luckyDirections: ["Nam", "Đông"],
    compatibleSigns: ["Tý", "Tỵ", "Dậu"],
    careers: ["Nông nghiệp", "Y tế", "Bất động sản", "Kế toán"],
  },
  {
    branch: "Dần", animal: "Hổ", emoji: "🐅",
    traits: ["Dũng cảm", "Nhiệt huyết", "Độc lập", "Bốc đồng"],
    strengths: ["Lãnh đạo tự nhiên", "Dũng cảm trước thử thách", "Nhiệt tình hết mình"],
    weaknesses: ["Bốc đồng, thiếu kiên nhẫn", "Khó chấp nhận thua cuộc"],
    marriageDisposition: "Lãng mạn mãnh liệt, cần bạn đời đủ mạnh mẽ và tôn trọng sự tự do. Hôn nhân cần cân bằng giữa tình yêu và không gian cá nhân.",
    luckyNumbers: [1, 3, 4],
    luckyColors: ["Xanh lam", "Xám", "Cam"],
    luckyDirections: ["Bắc", "Tây"],
    compatibleSigns: ["Ngọ", "Tuất", "Mão"],
    careers: ["Quân sự", "Thể thao", "Luật pháp", "Kinh doanh"],
  },
  {
    branch: "Mão", animal: "Mèo", emoji: "🐇",
    traits: ["Dịu dàng", "Khéo léo", "Thận trọng", "Nhạy cảm"],
    strengths: ["Tinh tế trong giao tiếp", "Giỏi ngoại giao", "Nhẹ nhàng, dễ mến"],
    weaknesses: ["Tránh né xung đột", "Đôi khi thiếu quyết đoán"],
    marriageDisposition: "Coi trọng sự hòa hợp trong gia đình, luôn tránh xung đột. Tạo nên gia đạo ấm áp, yên bình và đầy tình thương.",
    luckyNumbers: [3, 4, 9],
    luckyColors: ["Đỏ", "Hồng", "Tím"],
    luckyDirections: ["Đông", "Nam"],
    compatibleSigns: ["Mùi", "Hợi", "Dần"],
    careers: ["Nghệ thuật", "Ngoại giao", "Thời trang", "Tư vấn"],
  },
  {
    branch: "Thìn", animal: "Rồng", emoji: "🐉",
    traits: ["Tự tin", "Tham vọng", "Lãnh đạo", "Kiêu ngạo"],
    strengths: ["Khí chất lãnh đạo thiên bẩm", "Tự tin và quyết đoán", "Tư duy chiến lược"],
    weaknesses: ["Kiêu ngạo, khó tiếp cận", "Đặt tiêu chuẩn quá cao cho người khác"],
    marriageDisposition: "Kén chọn, khó chinh phục. Khi đã yêu thì hết lòng, nhưng luôn cần được tôn trọng và ngưỡng mộ trong hôn nhân.",
    luckyNumbers: [1, 6, 7],
    luckyColors: ["Vàng", "Bạc"],
    luckyDirections: ["Tây", "Tây Bắc"],
    compatibleSigns: ["Tý", "Thân", "Dậu"],
    careers: ["Lãnh đạo doanh nghiệp", "Nghệ thuật", "Chính trị", "Tâm linh"],
  },
  {
    branch: "Tỵ", animal: "Rắn", emoji: "🐍",
    traits: ["Trực giác tốt", "Bí ẩn", "Khôn ngoan", "Ghen tuông"],
    strengths: ["Trực giác sắc bén", "Tư duy sâu sắc", "Kiên định với mục tiêu"],
    weaknesses: ["Hay ghen tuông và chiếm hữu", "Khó buông bỏ"],
    marriageDisposition: "Tình cảm sâu sắc và chiếm hữu. Hôn nhân bền chặt khi hai bên xây dựng được lòng tin, tránh ghen tuông thái quá.",
    luckyNumbers: [2, 8, 9],
    luckyColors: ["Đỏ", "Vàng", "Đen"],
    luckyDirections: ["Nam", "Đông"],
    compatibleSigns: ["Sửu", "Dậu", "Thân"],
    careers: ["Nghiên cứu", "Triết học", "Tài chính", "Y học"],
  },
  {
    branch: "Ngọ", animal: "Ngựa", emoji: "🐴",
    traits: ["Nhiệt tình", "Tự do", "Lạc quan", "Thiếu kiên nhẫn"],
    strengths: ["Năng động, nhiệt huyết", "Lạc quan và truyền cảm hứng", "Giao tiếp xuất sắc"],
    weaknesses: ["Thiếu kiên nhẫn", "Khó duy trì cam kết lâu dài"],
    marriageDisposition: "Hấp dẫn và đào hoa, cần không gian tự do trong tình yêu. Hôn nhân muộn thường bền vững hơn, khi đã sẵn sàng định cư.",
    luckyNumbers: [2, 3, 7],
    luckyColors: ["Tím", "Xanh lá"],
    luckyDirections: ["Nam", "Đông"],
    compatibleSigns: ["Dần", "Tuất", "Mùi"],
    careers: ["Giáo dục", "Chính trị", "Kinh doanh", "Du lịch"],
  },
  {
    branch: "Mùi", animal: "Dê", emoji: "🐐",
    traits: ["Sáng tạo", "Nhân hậu", "Nhạy cảm", "Hay lo lắng"],
    strengths: ["Trái tim nhân hậu", "Sáng tạo và nghệ thuật", "Quan tâm đến người khác"],
    weaknesses: ["Hay lo lắng, thiếu tự tin", "Phụ thuộc vào sự chấp thuận"],
    marriageDisposition: "Cần được bảo vệ và yêu thương. Tình cảm sâu đậm, xem gia đình là nền tảng vững chắc của cuộc sống.",
    luckyNumbers: [2, 7],
    luckyColors: ["Xanh lá", "Đỏ", "Tím"],
    luckyDirections: ["Đông", "Nam"],
    compatibleSigns: ["Mão", "Hợi", "Ngọ"],
    careers: ["Nghệ thuật", "Nông nghiệp", "Chăm sóc sức khỏe", "Giáo dục"],
  },
  {
    branch: "Thân", animal: "Khỉ", emoji: "🐒",
    traits: ["Thông minh", "Hài hước", "Linh hoạt", "Thiếu nhất quán"],
    strengths: ["Trí tuệ nhanh nhạy", "Khả năng giải quyết vấn đề", "Hài hước duyên dáng"],
    weaknesses: ["Thiếu nhất quán", "Dễ chán, cần kích thích liên tục"],
    marriageDisposition: "Lãng mạn và vui vẻ trong tình yêu. Cần bạn đời kiên nhẫn, biết cách giữ không khí hôn nhân luôn tươi mới và thú vị.",
    luckyNumbers: [4, 9],
    luckyColors: ["Trắng", "Xanh lam", "Vàng"],
    luckyDirections: ["Tây Bắc", "Tây"],
    compatibleSigns: ["Tý", "Thìn", "Tỵ"],
    careers: ["Kỹ thuật", "Truyền thông", "Tài chính", "Nghiên cứu"],
  },
  {
    branch: "Dậu", animal: "Gà", emoji: "🐓",
    traits: ["Cẩn thận", "Cầu toàn", "Thực tế", "Thẳng thắn"],
    strengths: ["Cẩn thận tỉ mỉ", "Thực tế và hiệu quả", "Tổ chức tốt"],
    weaknesses: ["Cầu toàn thái quá", "Hay phê phán bản thân và người khác"],
    marriageDisposition: "Chu đáo với bạn đời và gia đình. Đòi hỏi cao về sự hoàn hảo; hôn nhân ổn định khi biết chấp nhận sự không hoàn hảo.",
    luckyNumbers: [5, 7, 8],
    luckyColors: ["Vàng", "Nâu", "Vàng kim"],
    luckyDirections: ["Tây", "Tây Nam"],
    compatibleSigns: ["Sửu", "Tỵ", "Thìn"],
    careers: ["Y tế", "Kế toán", "Nghiên cứu", "Hành chính"],
  },
  {
    branch: "Tuất", animal: "Chó", emoji: "🐕",
    traits: ["Trung thành", "Chính trực", "Quan tâm", "Lo âu"],
    strengths: ["Trung thành tuyệt đối", "Chính trực, công bằng", "Quan tâm chân thành"],
    weaknesses: ["Hay lo lắng thái quá", "Đôi khi quá nghiêm túc"],
    marriageDisposition: "Người bạn đời lý tưởng nhất, tận tụy và trung thành. Xây dựng gia đình vững chắc, cần được trân trọng đúng mức.",
    luckyNumbers: [3, 4, 9],
    luckyColors: ["Đỏ", "Xanh lá", "Tím"],
    luckyDirections: ["Đông", "Nam"],
    compatibleSigns: ["Dần", "Ngọ", "Mão"],
    careers: ["Từ thiện", "Giáo dục", "Luật pháp", "Dịch vụ công"],
  },
  {
    branch: "Hợi", animal: "Lợn", emoji: "🐖",
    traits: ["Rộng lượng", "Lạc quan", "Thành thật", "Ngây thơ"],
    strengths: ["Rộng lượng và bao dung", "Thành thật, đáng tin", "Luôn lạc quan"],
    weaknesses: ["Ngây thơ, dễ bị lợi dụng", "Hay chi tiêu quá tay"],
    marriageDisposition: "Yêu nồng nhiệt và chân thành, dễ bị tổn thương. Tạo nên gia đạo ấm áp, thích cuộc sống bình yên và ổn định.",
    luckyNumbers: [2, 5, 8],
    luckyColors: ["Vàng", "Xám", "Nâu"],
    luckyDirections: ["Đông Bắc", "Tây Bắc"],
    compatibleSigns: ["Mão", "Mùi", "Dần"],
    careers: ["Giải trí", "Nông nghiệp", "Y tế", "Ẩm thực"],
  },
];

/** Get zodiac profile by Earthly Branch index (0=Tý, 1=Sửu, …, 11=Hợi) */
export function getZodiacProfile(branchIndex: number): ZodiacProfile {
  return ZODIAC_PROFILES[branchIndex % 12];
}
