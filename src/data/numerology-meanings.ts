// Thần Số Học — Giải thích ý nghĩa từng con số trong từng vị trí

/** Mô tả vai trò của từng vị trí số */
export const NUMBER_POSITION_INFO: Record<string, { label: string; icon: string; desc: string }> = {
  lifePath: { label: "Số Chủ Đạo", icon: "🧭", desc: "Con đường đời, bài học lớn nhất bạn cần trải qua. Cho biết mục đích sống và hướng đi chính." },
  expression: { label: "Số Biểu Đạt", icon: "🎭", desc: "Tài năng bẩm sinh và cách bạn thể hiện ra bên ngoài. Phản ánh tiềm năng và khả năng tự nhiên." },
  soulUrge: { label: "Số Linh Hồn", icon: "💖", desc: "Khao khát sâu thẳm bên trong, động lực thật sự thúc đẩy bạn. Những gì trái tim bạn thực sự muốn." },
  personality: { label: "Số Nhân Cách", icon: "🪞", desc: "Hình ảnh bạn trình bày cho thế giới bên ngoài. Ấn tượng đầu tiên người khác nhận được từ bạn." },
  birthday: { label: "Số Ngày Sinh", icon: "🎂", desc: "Tài năng đặc biệt bạn mang theo từ lúc sinh ra. Món quà bổ sung cho Số Chủ Đạo." },
  personalYear: { label: "Năm Cá Nhân", icon: "📅", desc: "Năng lượng và chủ đề chính của năm nay. Cho biết cơ hội và thử thách sắp tới." },
  personalMonth: { label: "Tháng Cá Nhân", icon: "🗓️", desc: "Năng lượng cụ thể của tháng này. Hướng dẫn hành động ngắn hạn phù hợp." },
  maturity: { label: "Số Trưởng Thành", icon: "🌳", desc: "Mục tiêu cuối đời, bản thân bạn sẽ trở thành khi trưởng thành. Thường rõ nét sau tuổi 40-50." },
  challenge: { label: "Số Thử Thách", icon: "⚡", desc: "Bài học khó khăn cần vượt qua. Hiểu nó giúp bạn biến thử thách thành sức mạnh." },
};

/** Ý nghĩa cụ thể của từng con số (1-9, 11, 22, 33) theo vị trí */
export interface NumberMeaning {
  general: string;
  inLove: string;
  monthInfluence: string;
}

const MEANINGS: Record<number, NumberMeaning> = {
  1: {
    general: "Năng lượng khởi đầu, độc lập, lãnh đạo. Bạn có ý chí mạnh mẽ, thích tự quyết định và dẫn dắt. Số 1 mang tính tiên phong — luôn muốn đi đầu.",
    inLove: "Trong tình yêu, bạn cần đối tác tôn trọng sự tự do. Tránh kiểm soát quá mức. Khi cân bằng, bạn là người bạn đời đầy cảm hứng.",
    monthInfluence: "Tháng khởi đầu mới — hãy mạnh dạn bắt đầu dự án, đưa ra quyết định quan trọng. Năng lượng ủng hộ sáng kiến cá nhân.",
  },
  2: {
    general: "Năng lượng hợp tác, nhạy cảm, hài hòa. Bạn giỏi lắng nghe, đồng cảm và kết nối. Số 2 là cầu nối — mang mọi người lại gần nhau.",
    inLove: "Bạn đời lý tưởng, luôn đặt người khác lên trước. Cần cẩn thận không đánh mất bản thân vì muốn làm hài lòng đối phương.",
    monthInfluence: "Tháng kiên nhẫn và hợp tác — tránh vội vàng, tập trung vào mối quan hệ và làm việc nhóm. Kết quả đến từ sự chờ đợi.",
  },
  3: {
    general: "Năng lượng sáng tạo, giao tiếp, niềm vui. Bạn có khả năng biểu đạt tuyệt vời — qua lời nói, nghệ thuật hay biểu diễn. Số 3 mang ánh sáng.",
    inLove: "Mối quan hệ của bạn tràn đầy tiếng cười và lãng mạn. Cần tránh hời hợt — đào sâu cảm xúc để tình yêu bền vững.",
    monthInfluence: "Tháng sáng tạo và vui vẻ — thời điểm tốt để giao tiếp, thể hiện bản thân, tham gia hoạt động xã hội. Tránh phung phí.",
  },
  4: {
    general: "Năng lượng ổn định, kỷ luật, xây dựng. Bạn là nền tảng vững chắc — đáng tin cậy và có tổ chức. Số 4 xây dựng những gì lâu bền.",
    inLove: "Trung thành tuyệt đối, xây gia đình vững chắc. Cần tránh cứng nhắc — cho phép sự bất ngờ và lãng mạn trong mối quan hệ.",
    monthInfluence: "Tháng làm việc chăm chỉ — tập trung xây dựng nền tảng, lên kế hoạch, tổ chức lại cuộc sống. Kết quả đến từ kỷ luật.",
  },
  5: {
    general: "Năng lượng thay đổi, tự do, phiêu lưu. Bạn khao khát trải nghiệm mới — linh hoạt, đa tài và năng động. Số 5 không bao giờ nhàm chán.",
    inLove: "Cần không gian và sự tự do trong tình yêu. Mối quan hệ phải là cuộc phiêu lưu chung chứ không phải lồng giam.",
    monthInfluence: "Tháng thay đổi và bất ngờ — đón nhận cơ hội mới, du lịch, thay đổi thói quen. Tránh quá phiêu — giữ cân bằng.",
  },
  6: {
    general: "Năng lượng gia đình, trách nhiệm, yêu thương. Bạn sinh ra để chăm sóc — chu đáo, ấm áp và hy sinh. Số 6 là số hôn nhân lý tưởng nhất.",
    inLove: "Đối tác hoàn hảo, luôn đặt gia đình lên hàng đầu. Cần cẩn thận không kiểm soát hay hy sinh quá mức đến kiệt sức.",
    monthInfluence: "Tháng gia đình và tình yêu — thời điểm tốt cho hôn nhân, chăm sóc người thân, làm đẹp không gian sống. Cân bằng cho-nhận.",
  },
  7: {
    general: "Năng lượng trí tuệ, tâm linh, nội tâm. Bạn có chiều sâu tư duy đặc biệt — thích phân tích, nghiên cứu và tìm kiếm chân lý. Số 7 là triết gia.",
    inLove: "Cần thời gian riêng tư — đừng hiểu nhầm là lạnh lùng. Khi tìm được người hiểu mình, tình yêu rất sâu sắc.",
    monthInfluence: "Tháng suy ngẫm và học hỏi — lý tưởng cho nghiên cứu, phát triển bản thân, thiền định. Tránh cô lập quá mức.",
  },
  8: {
    general: "Năng lượng thành công, quyền lực, vật chất. Bạn có tầm nhìn kinh doanh và khả năng quản lý tài chính xuất sắc. Số 8 là vòng xoáy vô tận của cho và nhận.",
    inLove: "Mang lại an toàn tài chính cho gia đình. Thử thách lớn nhất: cân bằng giữa sự nghiệp và tình yêu.",
    monthInfluence: "Tháng sự nghiệp và tài chính — cơ hội thăng tiến, đầu tư, ra quyết định lớn. Cân bằng vật chất và tinh thần.",
  },
  9: {
    general: "Năng lượng nhân ái, vị tha, hoàn thành. Bạn có trái tim rộng lớn và tầm nhìn toàn cầu. Số 9 kết thúc chu kỳ — biến mất mát thành trí tuệ.",
    inLove: "Yêu hết mình và lý tưởng. Cần học buông bỏ kỳ vọng — chấp nhận đối phương là người thật, không phải người trong mơ.",
    monthInfluence: "Tháng hoàn thành và buông bỏ — kết thúc những gì đã cũ, cho đi, phục vụ. Chuẩn bị cho khởi đầu mới.",
  },
  11: {
    general: "Số bậc thầy — trực giác phi thường và khả năng truyền cảm hứng. Bạn có sứ mệnh đặc biệt — kết nối thế giới vật chất và tâm linh.",
    inLove: "Kết nối tâm hồn ở mức sâu nhất. Mối quan hệ của bạn có yếu tố tâm linh, nhưng cũng dễ căng thẳng do nhạy cảm quá mức.",
    monthInfluence: "Tháng trực giác mạnh — tin vào linh cảm, tìm kiếm ý nghĩa sâu xa. Cẩn thận với căng thẳng thần kinh.",
  },
  22: {
    general: "Số bậc thầy — kiến tạo vĩ đại. Bạn có khả năng biến tầm nhìn lớn thành hiện thực cụ thể. Số 22 kết hợp giấc mơ của 11 với nền tảng của 4.",
    inLove: "Xây dựng mối quan hệ có ý nghĩa lâu dài. Bạn cần đối tác kiên nhẫn, hiểu rằng bạn đang theo đuổi mục tiêu lớn.",
    monthInfluence: "Tháng hành động lớn — biến kế hoạch thành hiện thực, xây dựng nền tảng cho tương lai. Nghĩ lớn nhưng hành động cụ thể.",
  },
  33: {
    general: "Số bậc thầy — yêu thương vô điều kiện. Bạn có sứ mệnh chữa lành và phục vụ. Số 33 kết hợp sáng tạo của 3 với yêu thương của 6.",
    inLove: "Tình yêu thiêng liêng, vượt qua cái tôi. Bạn dành trọn tâm huyết cho gia đình nhưng cần nhớ chăm sóc bản thân.",
    monthInfluence: "Tháng phục vụ và chữa lành — cho đi tình yêu không điều kiện, kết nối cộng đồng. Tránh kiệt sức vì lo cho người khác.",
  },
};

export function getNumberMeaning(num: number): NumberMeaning {
  return MEANINGS[num] ?? MEANINGS[num > 9 ? (num % 9 || 9) : num] ?? MEANINGS[1];
}

/** Ý nghĩa tháng cá nhân — chi tiết hơn monthInfluence */
export const MONTH_THEMES: Record<number, { theme: string; energy: string; love: string; career: string; advice: string; doList: string[]; dontList: string[] }> = {
  1: {
    theme: "Khởi Đầu Mới", energy: "Mạnh mẽ, quyết đoán, tiên phong",
    love: "Thời điểm tốt để bày tỏ tình cảm hoặc bắt đầu giai đoạn mới trong mối quan hệ.",
    career: "Bắt đầu dự án mới, đề xuất ý tưởng, thể hiện bản thân với cấp trên.",
    advice: "Hãy mạnh dạn — vũ trụ ủng hộ bước đi đầu tiên của bạn trong tháng này.",
    doList: ["Bắt đầu dự án mới", "Đưa ra quyết định quan trọng", "Thể hiện sáng kiến"],
    dontList: ["Chờ đợi quá lâu", "Phụ thuộc vào người khác", "Ngại thay đổi"],
  },
  2: {
    theme: "Hợp Tác & Kiên Nhẫn", energy: "Nhẹ nhàng, hài hòa, tiếp nhận",
    love: "Lắng nghe đối phương nhiều hơn. Sự thấu hiểu sẽ làm tình yêu sâu sắc hơn.",
    career: "Làm việc nhóm, xây dựng mối quan hệ đồng nghiệp, tránh tranh giành.",
    advice: "Kiên nhẫn là chìa khóa. Đừng ép kết quả — hãy để mọi thứ diễn ra tự nhiên.",
    doList: ["Hợp tác với người khác", "Lắng nghe trước khi nói", "Chăm sóc mối quan hệ"],
    dontList: ["Vội vàng ra quyết định", "Tranh giành quyền lợi", "Bỏ qua cảm xúc"],
  },
  3: {
    theme: "Sáng Tạo & Biểu Đạt", energy: "Vui vẻ, lạc quan, sáng tạo",
    love: "Tháng lãng mạn — hẹn hò, tặng quà, thể hiện tình yêu bằng lời nói và hành động.",
    career: "Thuyết trình, sáng tạo nội dung, networking. Sức hút cá nhân ở đỉnh cao.",
    advice: "Hãy thể hiện bản thân — viết, nói, vẽ, hát. Đừng giữ sáng tạo trong lòng.",
    doList: ["Tham gia hoạt động xã hội", "Thể hiện sáng tạo", "Giao tiếp cởi mở"],
    dontList: ["Nói quá nhiều không suy nghĩ", "Phung phí tiền bạc", "Bỏ dở giữa chừng"],
  },
  4: {
    theme: "Xây Dựng & Kỷ Luật", energy: "Ổn định, có tổ chức, nền tảng",
    love: "Củng cố mối quan hệ bằng hành động cụ thể — lên kế hoạch tương lai, bàn chuyện thực tế.",
    career: "Tập trung vào chi tiết, hoàn thành deadline, xây dựng hệ thống. Không phải lúc bay bổng.",
    advice: "Làm việc chăm chỉ sẽ được đền đáp. Đặt nền tảng hôm nay cho thành công ngày mai.",
    doList: ["Lên kế hoạch chi tiết", "Tổ chức lại không gian sống", "Hoàn thành công việc tồn đọng"],
    dontList: ["Lười biếng hay trì hoãn", "Bỏ qua chi tiết nhỏ", "Mạo hiểm không cần thiết"],
  },
  5: {
    theme: "Thay Đổi & Phiêu Lưu", energy: "Năng động, bất ngờ, tự do",
    love: "Thêm gia vị cho mối quan hệ — trải nghiệm mới, đi chơi, phá vỡ thói quen cũ.",
    career: "Cơ hội bất ngờ xuất hiện. Sẵn sàng thay đổi — chuyển việc, học kỹ năng mới.",
    advice: "Đón nhận thay đổi thay vì chống lại. Linh hoạt là siêu năng lực tháng này.",
    doList: ["Thử điều mới", "Du lịch", "Linh hoạt với kế hoạch"],
    dontList: ["Bám víu thói quen cũ", "Sợ thay đổi", "Buông thả quá mức"],
  },
  6: {
    theme: "Gia Đình & Yêu Thương", energy: "Ấm áp, trách nhiệm, chăm sóc",
    love: "Tháng tuyệt vời cho tình yêu — cầu hôn, kết hôn, hoặc đơn giản là yêu thương nhiều hơn.",
    career: "Tập trung chăm sóc team, mentoring, cải thiện môi trường làm việc.",
    advice: "Đặt gia đình và tình yêu lên hàng đầu. Cho đi yêu thương bạn sẽ nhận lại gấp bội.",
    doList: ["Chăm sóc gia đình", "Làm đẹp nhà cửa", "Thể hiện tình yêu"],
    dontList: ["Bỏ bê người thân", "Kiểm soát quá mức", "Hy sinh bản thân hoàn toàn"],
  },
  7: {
    theme: "Nội Tâm & Tâm Linh", energy: "Tĩnh lặng, sâu sắc, chiêm nghiệm",
    love: "Thời gian suy ngẫm về mối quan hệ — hiểu sâu hơn về bản thân và đối phương.",
    career: "Nghiên cứu, học hỏi, phân tích. Không phải lúc để networking hay bán hàng.",
    advice: "Dành thời gian cho bản thân — đọc sách, thiền, đi bộ trong tự nhiên. Trực giác sẽ dẫn đường.",
    doList: ["Thiền định, đọc sách", "Phát triển bản thân", "Lắng nghe trực giác"],
    dontList: ["Quyết định vội vàng", "Tiệc tùng quá nhiều", "Bỏ qua giấc mơ và linh cảm"],
  },
  8: {
    theme: "Thành Công & Sức Mạnh", energy: "Quyền lực, tài chính, thành tựu",
    love: "Mối quan hệ được hưởng lợi từ sự ổn định tài chính. Tránh để công việc lấn át tình yêu.",
    career: "Đỉnh cao sự nghiệp tháng — thăng tiến, đầu tư, ký hợp đồng lớn.",
    advice: "Nghĩ lớn và hành động quyết đoán. Nhưng nhớ — tiền bạc không mua được hạnh phúc.",
    doList: ["Ra quyết định tài chính", "Đàm phán thăng tiến", "Quản lý tài sản"],
    dontList: ["Tham lam quá mức", "Bỏ bê sức khỏe", "Kiêu ngạo hay áp đặt"],
  },
  9: {
    theme: "Hoàn Thành & Buông Bỏ", energy: "Kết thúc, nhân ái, giải phóng",
    love: "Buông bỏ những gì không còn phục vụ tình yêu. Tha thứ và giải phóng cảm xúc cũ.",
    career: "Hoàn tất dự án, đánh giá lại định hướng. Chuẩn bị cho chu kỳ mới.",
    advice: "Đây là tháng kết thúc chu kỳ. Hãy cho đi, tha thứ, dọn dẹp — chuẩn bị cho khởi đầu mới.",
    doList: ["Hoàn tất việc dang dở", "Cho đi đồ không dùng", "Tha thứ và buông bỏ"],
    dontList: ["Bắt đầu dự án hoàn toàn mới", "Bám víu quá khứ", "Trì hoãn kết thúc"],
  },
  11: {
    theme: "Trực Giác & Giác Ngộ", energy: "Tâm linh, truyền cảm hứng, nhạy bén",
    love: "Kết nối tâm hồn sâu sắc — nói chuyện về ước mơ, ý nghĩa cuộc sống, giá trị chung.",
    career: "Truyền cảm hứng cho người khác, mentoring, dự án có ý nghĩa.",
    advice: "Tin vào trực giác — linh cảm tháng này đặc biệt chính xác. Cẩn thận với lo âu.",
    doList: ["Thiền định và kết nối nội tâm", "Theo đuổi mục đích sống", "Chia sẻ tầm nhìn"],
    dontList: ["Phớt lờ trực giác", "Căng thẳng quá mức", "Đánh mất thực tế"],
  },
  22: {
    theme: "Kiến Tạo Vĩ Đại", energy: "Tầm nhìn lớn, xây dựng, di sản",
    love: "Xây dựng nền tảng lâu dài — bàn về nhà cửa, tài chính, kế hoạch gia đình.",
    career: "Biến tầm nhìn thành hiện thực — khởi nghiệp, mở rộng, xây dựng hệ thống.",
    advice: "Nghĩ lớn nhưng hành động từng bước. Bạn có năng lượng phi thường tháng này.",
    doList: ["Lên kế hoạch lớn", "Xây dựng hệ thống", "Hành động cụ thể"],
    dontList: ["Mơ mà không làm", "Bỏ qua chi tiết nhỏ", "Gánh quá nhiều một mình"],
  },
  33: {
    theme: "Yêu Thương Vô Điều Kiện", energy: "Chữa lành, phục vụ, thiêng liêng",
    love: "Tình yêu ở mức cao nhất — cho đi không cần nhận lại. Chữa lành vết thương cũ.",
    career: "Phục vụ cộng đồng, giảng dạy, chữa lành. Sứ mệnh quan trọng hơn tiền bạc.",
    advice: "Cho đi tình yêu vô điều kiện nhưng nhớ nạp lại năng lượng cho bản thân.",
    doList: ["Phục vụ và giúp đỡ", "Chữa lành mối quan hệ", "Thiện nguyện"],
    dontList: ["Kiệt sức vì lo cho người khác", "Quên chăm sóc bản thân", "Lý tưởng hóa mọi thứ"],
  },
};
