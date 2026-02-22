// Vietnamese yearly astrology forecasts for 2026 (Năm Bính Ngọ — Year of the Horse)
// Order matches EARTHLY_BRANCHES in astrology.ts: Tý(0)…Hợi(11)

export interface YearlyForecast {
  branch: string;
  animal: string;
  year: number;
  overview: string;
  love: { rating: number; description: string };
  career: { rating: number; description: string };
  wealth: { rating: number; description: string };
  health: { rating: number; description: string };
}

export const FORECAST_YEAR = 2026;

export const YEARLY_FORECASTS: YearlyForecast[] = [
  {
    branch: "Tý", animal: "Chuột", year: 2026,
    overview: "Năm Bính Ngọ 2026 mang đến nhiều thay đổi lớn cho tuổi Tý. Ngọ xung Tý nên cần linh hoạt ứng biến, tránh đầu tư mạo hiểm và giữ vững bình tĩnh.",
    love: { rating: 3, description: "Tình duyên ổn định nhưng thiếu bất ngờ. Cặp đôi cần chủ động tạo kỷ niệm và lắng nghe nhau hơn." },
    career: { rating: 4, description: "Sự nghiệp khởi sắc từ nửa cuối năm, có quý nhân phù trợ. Cơ hội thăng tiến hoặc chuyển hướng tích cực." },
    wealth: { rating: 3, description: "Tài chính ổn định, nên tránh cho vay lớn. Thu nhập phụ có thể vượt thu nhập chính." },
    health: { rating: 3, description: "Chú ý đường tiêu hóa và giấc ngủ. Tập thể dục đều đặn để duy trì năng lượng." },
  },
  {
    branch: "Sửu", animal: "Trâu", year: 2026,
    overview: "Tuổi Sửu bước vào năm Bính Ngọ với nền tảng vững chắc. Sự kiên nhẫn và chăm chỉ được đền đáp, đặc biệt trong nửa đầu năm.",
    love: { rating: 4, description: "Tình cảm bền vững và ấm áp. Người độc thân có cơ hội gặp người phù hợp qua môi trường công việc." },
    career: { rating: 4, description: "Công việc ổn định, được đánh giá cao về năng lực. Không nên thay đổi lớn trong năm này." },
    wealth: { rating: 4, description: "Tài lộc khá tốt, phù hợp tích lũy và đầu tư dài hạn. Tránh chi tiêu bốc đồng cuối năm." },
    health: { rating: 3, description: "Đề phòng các vấn đề về xương khớp và hệ tiêu hóa. Nên nghỉ ngơi đủ giấc." },
  },
  {
    branch: "Dần", animal: "Hổ", year: 2026,
    overview: "Năm Bính Ngọ rất thuận lợi cho tuổi Dần — Dần, Ngọ, Tuất tam hợp đem lại vận khí mạnh mẽ. Đây là thời điểm vàng để tiến lên.",
    love: { rating: 5, description: "Tình duyên rực rỡ nhất trong nhiều năm. Người độc thân dễ gặp nhân duyên, cặp đôi thêm gắn kết." },
    career: { rating: 5, description: "Đỉnh cao sự nghiệp năm nay. Cơ hội thăng chức, khởi nghiệp hoặc mở rộng kinh doanh rất thuận." },
    wealth: { rating: 4, description: "Tài vận tốt, nhiều nguồn thu nhập. Có thể đầu tư hợp lý nhưng không nên tham lam quá." },
    health: { rating: 4, description: "Sức khỏe dồi dào nhờ tam hợp. Duy trì lối sống lành mạnh để giữ vững phong độ." },
  },
  {
    branch: "Mão", animal: "Mèo", year: 2026,
    overview: "Tuổi Mão trải qua năm Bính Ngọ bình ổn, không có nhiều biến động lớn. Đây là thời gian tốt để củng cố các mối quan hệ và tích lũy.",
    love: { rating: 3, description: "Tình cảm cần được chăm chút kỹ lưỡng. Tránh hiểu lầm do thiếu giao tiếp thẳng thắn." },
    career: { rating: 3, description: "Công việc ổn định nhưng ít đột phá. Hãy trau dồi kỹ năng để sẵn sàng cho cơ hội tiếp theo." },
    wealth: { rating: 3, description: "Thu nhập ổn định, nên tiết kiệm nhiều hơn chi tiêu. Tránh các khoản đầu tư chưa rõ ràng." },
    health: { rating: 4, description: "Sức khỏe tốt nếu duy trì lịch sinh hoạt đều đặn. Chú ý sức khỏe tinh thần, tránh stress." },
  },
  {
    branch: "Thìn", animal: "Rồng", year: 2026,
    overview: "Năm Bính Ngọ là giai đoạn chuyển tiếp sau năm Ất Tỵ với nhiều kết quả thu hoạch. Tuổi Thìn cần kiên nhẫn và tập trung vào dài hạn.",
    love: { rating: 4, description: "Tình duyên tiến triển tốt, phù hợp để nâng tầm mối quan hệ. Người cầu hôn năm này có nhiều điều tốt lành." },
    career: { rating: 3, description: "Sự nghiệp ổn, tránh xung đột với cấp trên. Làm việc nhóm hiệu quả hơn hành động đơn độc." },
    wealth: { rating: 4, description: "Tài lộc từ nhiều hướng, đặc biệt từ hợp tác kinh doanh. Quản lý chi tiêu hợp lý." },
    health: { rating: 3, description: "Chú ý sức khỏe tiêu hóa và huyết áp. Giảm căng thẳng bằng hoạt động thư giãn." },
  },
  {
    branch: "Tỵ", animal: "Rắn", year: 2026,
    overview: "Sau năm bản mệnh Ất Tỵ, tuổi Tỵ bước sang Bính Ngọ với năng lượng mới. Thời điểm tốt để thực hiện các kế hoạch đã ấp ủ.",
    love: { rating: 4, description: "Tình cảm ổn định và sâu sắc hơn. Giai đoạn tốt để cầu hôn hoặc kết hôn với người đã tìm hiểu lâu." },
    career: { rating: 4, description: "Tư duy sắc bén giúp giải quyết các thách thức công việc. Cơ hội hợp tác với đối tác mới." },
    wealth: { rating: 3, description: "Tài chính dần cải thiện sau năm bản mệnh. Nên đầu tư thận trọng, tránh rủi ro cao." },
    health: { rating: 4, description: "Sức khỏe phục hồi và ổn định. Duy trì chế độ ăn uống lành mạnh và ngủ đủ giấc." },
  },
  {
    branch: "Ngọ", animal: "Ngựa", year: 2026,
    overview: "Năm Bính Ngọ là năm bản mệnh của tuổi Ngọ. Thái Tuế chiếu mệnh đem lại cả cơ hội và thử thách — cần thận trọng và không tự mãn.",
    love: { rating: 3, description: "Tình duyên biến động nhiều trong năm bản mệnh. Hôn nhân cần thêm sự kiên nhẫn và thấu hiểu lẫn nhau." },
    career: { rating: 3, description: "Công việc có nhiều biến động. Nên duy trì ổn định, không thay đổi lớn và tránh xung đột." },
    wealth: { rating: 2, description: "Tài chính không thuận — năm bản mệnh thường dễ hao tiền. Kiểm soát chi tiêu chặt chẽ." },
    health: { rating: 3, description: "Đề phòng tai nạn nhỏ và sức khỏe tim mạch. Nên làm lễ cúng Thái Tuế đầu năm để hóa giải." },
  },
  {
    branch: "Mùi", animal: "Dê", year: 2026,
    overview: "Tuổi Mùi có năm Bính Ngọ khá thuận lợi về tình cảm và gia đình. Hãy tận dụng năng lượng ổn định này để xây dựng nền tảng vững chắc.",
    love: { rating: 5, description: "Năm rất tốt về tình duyên và hôn nhân. Cặp đôi gắn kết bền chặt, người độc thân dễ tìm được người ý hợp." },
    career: { rating: 3, description: "Công việc ổn định, không nên mạo hiểm đổi hướng lớn. Tập trung hoàn thiện kỹ năng hiện tại." },
    wealth: { rating: 3, description: "Tài lộc bình thường, tránh đầu tư mạo hiểm. Thu nhập ổn định là điểm sáng." },
    health: { rating: 4, description: "Sức khỏe tốt, tinh thần vui vẻ. Duy trì lối sống lành mạnh và cân bằng cảm xúc." },
  },
  {
    branch: "Thân", animal: "Khỉ", year: 2026,
    overview: "Năm Bính Ngọ mang lại nhiều cơ hội bất ngờ cho tuổi Thân. Trí tuệ linh hoạt sẽ là vũ khí chính để vượt qua thách thức và nắm bắt thời cơ.",
    love: { rating: 3, description: "Tình cảm cần đầu tư thêm thời gian và sự chân thành. Tránh lơ là bạn đời vì bận rộn công việc." },
    career: { rating: 4, description: "Nhiều ý tưởng sáng tạo được đón nhận tích cực. Cơ hội hợp tác quốc tế hoặc mở rộng mạng lưới." },
    wealth: { rating: 4, description: "Tài lộc tốt, đặc biệt từ các dự án đa dạng. Nên đa dạng hóa thu nhập thay vì phụ thuộc một nguồn." },
    health: { rating: 3, description: "Dễ căng thẳng vì nhiều việc cùng lúc. Cần nghỉ ngơi đủ và không bỏ bữa." },
  },
  {
    branch: "Dậu", animal: "Gà", year: 2026,
    overview: "Tuổi Dậu trải qua năm Bính Ngọ với sự cân bằng và ổn định. Công sức bỏ ra lâu nay bắt đầu mang lại kết quả thực chất.",
    love: { rating: 4, description: "Tình cảm ổn định và lãng mạn hơn. Đây là thời điểm tốt để tiến tới hôn nhân hoặc kỷ niệm đặc biệt." },
    career: { rating: 4, description: "Sự chăm chỉ được ghi nhận. Cơ hội thăng tiến hoặc nhận dự án quan trọng trong năm." },
    wealth: { rating: 3, description: "Thu nhập tốt nhưng chi tiêu cũng tăng. Lập kế hoạch tài chính chi tiết sẽ giúp tích lũy hiệu quả." },
    health: { rating: 3, description: "Chú ý sức khỏe hô hấp và tiêu hóa. Không nên bỏ qua các triệu chứng nhỏ." },
  },
  {
    branch: "Tuất", animal: "Chó", year: 2026,
    overview: "Năm Bính Ngọ rất thuận cho tuổi Tuất nhờ Dần, Ngọ, Tuất tam hợp. Đây là một trong những năm tốt nhất để phát triển toàn diện.",
    love: { rating: 5, description: "Tình duyên nở rộ nhờ tam hợp. Người độc thân dễ gặp nhân duyên đẹp, cặp đôi thêm hạnh phúc bền chặt." },
    career: { rating: 5, description: "Sự nghiệp vượt bậc, được tin tưởng và giao trọng trách. Thời điểm lý tưởng để khởi nghiệp hoặc đổi hướng lớn." },
    wealth: { rating: 4, description: "Tài lộc dồi dào từ nhiều nguồn. Đầu tư hợp lý sẽ sinh lời tốt trong năm này." },
    health: { rating: 4, description: "Sức khỏe tổng thể tốt. Duy trì thói quen tập luyện để tận dụng năng lượng tích cực của năm." },
  },
  {
    branch: "Hợi", animal: "Lợn", year: 2026,
    overview: "Tuổi Hợi bước vào năm Bính Ngọ với tâm thế tích cực. Sự rộng lượng và chân thành giúp thu hút nhiều cơ hội và mối quan hệ tốt đẹp.",
    love: { rating: 4, description: "Tình cảm nồng ấm và chân thành. Phù hợp để đưa ra quyết định lớn trong tình yêu và hôn nhân." },
    career: { rating: 3, description: "Công việc ổn định, hãy tập trung hoàn thiện hơn là tìm kiếm thay đổi lớn. Quan hệ đồng nghiệp tốt." },
    wealth: { rating: 3, description: "Tài chính bình ổn, tránh chi tiêu lãng phí. Cơ hội thu nhập thêm từ các hoạt động phụ." },
    health: { rating: 4, description: "Sức khỏe khá tốt. Chú ý cân bằng ăn uống và vận động để duy trì thể trạng tốt suốt năm." },
  },
];

/** Get yearly forecast by Earthly Branch index (0=Tý, 1=Sửu, …, 11=Hợi) */
export function getYearlyForecast(branchIndex: number): YearlyForecast {
  return YEARLY_FORECASTS[branchIndex % 12];
}
