import type { WeddingStep, PrayerItem } from "@/types/wedding";
import type { RegionalContent } from "@/data/regions";

// ===== CHỈ các văn khấn & lời phát biểu THỰC SỰ diễn ra trong LỄ DẠM NGÕ =====
// Ăn hỏi → Step 3, Rước dâu → Step 5, Tân hôn → Step 6, Lại mặt → Step 7
const ENGAGEMENT_PRAYERS: PrayerItem[] = [
  {
    emoji: "🗣️",
    title: "Lời nhà trai ngỏ ý xin phép tìm hiểu",
    occasion: "Lễ dạm ngõ — sau khi hai bên ngồi vào bàn",
    type: "speech",
    note: "Bố chú rể hoặc ông/chú đại diện. Dạm ngõ đơn giản, thân mật hơn ăn hỏi — không cần MC khai mạc, không trình lễ vật long trọng. Chỉ cần chân thành, gọn gàng 2-3 phút.",
    text: `Kính thưa ông bà và gia đình nhà gái,

Hôm nay gia đình chúng tôi — họ [HỌ NHÀ TRAI] — xin phép được đến quý gia đình để thưa chuyện.

Con trai chúng tôi là [TÊN CHÚ RỂ] và con gái quý gia đình là [TÊN CÔ DÂU] đã tìm hiểu nhau được [THỜI GIAN]. Hai cháu tâm đầu ý hợp và mong muốn tiến tới hôn nhân.

Gia đình chúng tôi xin mang chút lễ vật tượng trưng đến trình ông bà, kính xin phép cho hai cháu chính thức tìm hiểu và hai gia đình cùng bàn bạc chuyện cưới hỏi.

Rất mong ông bà và gia đình chấp thuận.`,
  },
  {
    emoji: "🗣️",
    title: "Lời nhà gái đáp lời đồng ý",
    occasion: "Lễ dạm ngõ — sau lời nhà trai",
    type: "speech",
    note: "Bố cô dâu hoặc ông/chú đại diện. Ngắn gọn, ấm áp, đồng ý cho hai cháu tiến tới — chưa nói đến lễ vật, mâm quả (đó là việc bàn bạc sau).",
    text: `Kính thưa ông bà và gia đình nhà trai,

Gia đình chúng tôi rất vui và hân hạnh được đón tiếp quý gia đình.

Chúng tôi đã biết chuyện tình cảm của hai cháu [TÊN CÔ DÂU] và [TÊN CHÚ RỂ], và rất mừng thấy hai cháu hạnh phúc bên nhau.

Gia đình chúng tôi đồng ý cho hai cháu chính thức tìm hiểu. Xin nhận lễ vật tượng trưng của quý gia đình, và mong hai nhà cùng bàn bạc các bước tiếp theo.

Kính chúc hai gia đình sức khỏe, hạnh phúc.`,
  },
  {
    emoji: "🕯️",
    title: "Văn khấn gia tiên — Lễ dạm ngõ",
    occasion: "Lễ dạm ngõ — sau khi hai bên đồng ý, thắp hương báo gia tiên",
    type: "prayer",
    note: "Không phải lễ dạm ngõ nào cũng thắp hương — tùy gia đình. Nếu có, bố/mẹ nhà gái khấn ngắn gọn trước bàn thờ, đôi trẻ thắp hương vái 2 lạy. Đơn giản hơn nhiều so với văn khấn lễ ăn hỏi.",
    text: `Nam mô A Di Đà Phật (3 lần)

Con kính lạy Tổ Tiên nội ngoại họ [HỌ NHÀ GÁI].

Hôm nay ngày ... tháng ... năm ... (âm lịch),
Gia đình họ [HỌ NHÀ TRAI] đến nhà xin phép cho con trai [TÊN CHÚ RỂ] được tìm hiểu con gái chúng con là [TÊN CÔ DÂU].

Hai gia đình đã đồng ý, xin kính báo ông bà Tổ Tiên chứng giám, phù hộ cho hai cháu thuận duyên, hai nhà hòa thuận.

Nam mô A Di Đà Phật (3 lần)`,
  },
];

export const STEP_ENGAGEMENT: WeddingStep = {
  id: "engagement",
  tab: "🏠 Dạm Ngõ",
  title: "Bước 2: Lễ Dạm Ngõ",
  formalName: "Lễ Dạm Ngõ (Lễ Chạm Ngõ / Lễ Giáp Lời)",
  icon: "🏠",
  description: "Nghi lễ chính thức đầu tiên — nhà trai đến nhà gái xin phép tìm hiểu và hỏi cưới.",
  meaning: "Dạm ngõ mang nghĩa 'chạm ngõ' — lần đầu nhà trai bước chân qua cổng nhà gái với tư cách sui gia. Đây là nghi lễ chính thức đầu tiên trong hôn nhân Việt Nam, đánh dấu sự công nhận mối quan hệ giữa hai gia đình. Buổi lễ tuy đơn giản nhưng mang ý nghĩa sâu sắc: hai nhà chính thức 'mở cổng' đón nhận nhau, xây dựng nền tảng cho mối quan hệ sui gia lâu dài. Từ sau dạm ngõ, đôi trẻ được coi là đã 'có nơi có chốn' — cam kết trước cộng đồng rằng đôi bên đã đồng ý tiến tới hôn nhân.",
  notes: [
    "Chọn ngày lành tháng tốt — xem lịch âm, tránh ngày Tam Nương, Nguyệt Kỵ",
    "Thành phần: bố mẹ hai bên + cô dâu chú rể + ông bà (nếu có). Tối đa 5-7 người mỗi bên",
    "Trang phục: lịch sự, chỉnh tề — áo dài truyền thống hoặc vest/đầm thanh lịch",
    "Nhà gái dọn dẹp bàn thờ, chuẩn bị trà nước tiếp khách chu đáo",
    "Cô dâu chú rể nên thống nhất trước với bố mẹ về mong muốn, ngân sách — tránh bất ngờ tại buổi lễ",
    "Miền Bắc: gọi 'Chạm ngõ' — lễ vật đơn giản (trầu cau, trà, rượu), nghi thức trang trọng",
    "Miền Trung: gọi 'Giáp lời' hoặc 'Đi nói' — tương tự miền Bắc, có thể kèm rượu vùng",
    "Miền Nam: gọi 'Dạm ngõ' — có thể kèm khay trái cây, bánh ngọt, không khí thoải mái hơn",
    "Lễ vật chỉ mang tính tượng trưng — không cần quá nhiều, quá đắt. Thành ý quan trọng hơn giá trị",
    "Bàn bạc nội dung quan trọng: thống nhất ngày hỏi, ngày cưới, số mâm quả, lễ vật đám hỏi, tiền nạp tài",
    "Không mặc cả gay gắt — tinh thần hòa thuận là quan trọng nhất, đây là lần đầu làm sui gia",
    "Ghi chép lại MỌI thỏa thuận để tránh hiểu lầm sau này — ai chịu gì, bao nhiêu, khi nào",
    "Nếu chưa thống nhất được — hẹn buổi bàn tiếp, không ép",
  ],
  timeline: "2-3 tháng trước hỏi",
  aiHint: "Chi tiết lễ dạm ngõ theo vùng miền, lễ vật cần chuẩn bị, nghi thức, những điều nên tránh.",
  ceremonies: [
    {
      name: "🏠 Lễ Dạm Ngõ",
      required: 1,
      description: "Hai bên gia đình gặp mặt chính thức lần đầu, nhà trai mang lễ vật tượng trưng đến nhà gái để xin phép bàn chuyện cưới hỏi.",
      regionalNotes: {
        default: [],
        north: ["Miền Bắc: gọi 'Chạm ngõ' — nghi thức trang trọng hơn, yêu cầu đủ trầu cau + rượu + chè", "Đoàn nhà trai thường ít người, đi gọn nhẹ"],
        south: ["Miền Nam: không khí thoải mái hơn, có thể kèm khay trái cây và bánh ngọt", "Một số gia đình miền Nam gộp dạm ngõ với ăn hỏi nếu hai nhà ở xa nhau"],
        central: ["Miền Trung: gọi 'Giáp lời' hoặc 'Đi nói' — phong cách Huế ảnh hưởng cung đình, trang trọng và chuẩn mực"],
      } as RegionalContent<string[]>,
      steps: [
        { text: "Xem ngày lành tháng tốt (lịch âm)", cost: 200000, categoryKey: "other", checkable: true },
        { text: "Lễ vật: trầu cau, trà, rượu, bánh, trái cây", cost: 1500000, categoryKey: "ceremonial-gifts", checkable: true },
        { text: "1-3 khay/mâm (phủ khăn đỏ hoặc giấy đỏ)", cost: 300000, categoryKey: "ceremonial-gifts", checkable: true },
        { text: "Trang phục lịch sự: áo dài hoặc vest/đầm", cost: 1000000, categoryKey: "clothes", checkable: true },
        { text: "Nhà gái trang trí, dọn dẹp bàn thờ", cost: 500000, categoryKey: "decor", checkable: true },
        { text: "Trà nước, bánh ngọt tiếp khách", cost: 300000, categoryKey: "food", checkable: true },
        { text: "Sổ ghi chép thỏa thuận", cost: 0, categoryKey: "other", checkable: true },
        { text: "Nhà trai đến ĐÚNG GIỜ đã hẹn — không sớm quá, không trễ", time: "09:00", responsible: "Đại diện nhà trai" },
        { text: "Chào hỏi, giới thiệu thành phần hai bên gia đình", time: "09:10", responsible: "Hai họ" },
        { text: "Nhà trai trao lễ vật tượng trưng cho nhà gái", time: "09:20", responsible: "Đại diện nhà trai" },
        { text: "Nhà gái nhận lễ, mời ngồi, rót trà", time: "09:25", responsible: "Gia đình nhà gái" },
        { text: "Bàn bạc: ngày hỏi, ngày cưới, số mâm quả, lễ vật, tiền nạp tài", time: "09:30", responsible: "Hai họ" },
        { text: "Thống nhất phong tục: theo miền nào, tục lệ gì cần giữ", time: "10:00", responsible: "Hai họ" },
        { text: "Thắp hương gia tiên nhà gái (nếu bàn thờ sẵn)", time: "10:15", responsible: "Gia đình nhà gái" },
        { text: "Cơm thân mật, nâng ly chúc mừng", time: "10:30", responsible: "Gia đình nhà gái" },
        { text: "Tổng kết, xác nhận lại các thỏa thuận trước khi ra về", time: "11:30", responsible: "Hai họ" },
      ],
      discussions: [
        { emoji: "📅", question: "Ngày ăn hỏi và ngày cưới dự kiến?", detail: "Thống nhất khung thời gian tổ chức lễ ăn hỏi và lễ cưới. Cần xem tuổi cô dâu chú rể, xem ngày lành tháng tốt, tránh tháng 7 âm lịch.", tips: ["Nên chọn 2-3 ngày dự phòng để linh hoạt đặt dịch vụ", "Lễ ăn hỏi thường trước cưới 1-3 tháng (Bắc) hoặc 2-4 tuần (Nam)", "Tham khảo thầy xem ngày hoặc lịch vạn niên"] },
        { emoji: "🕐", question: "Giờ đón dâu, giờ nhập trạch, giờ bái gia tiên?", detail: "Thống nhất các mốc giờ quan trọng: giờ đoàn nhà trai xuất phát, giờ đến nhà gái, giờ rước dâu về nhà trai, giờ làm lễ gia tiên.", tips: ["Giờ đón dâu và giờ nhập trạch là 2 giờ quan trọng nhất", "Tính ngược: giờ nhập trạch → trừ di chuyển → ra giờ rước dâu", "Giờ đẹp thường: 6h, 8h, 10h sáng (số chẵn)", "Dự phòng thêm 15-30 phút cho tắc đường"] },
        { emoji: "🎁", question: "Số mâm quả lễ ăn hỏi? Gồm những gì?", detail: "Thống nhất số mâm quả (thường số lẻ: 5, 7, 9, 11 mâm). Bàn cụ thể từng mâm gồm gì, số lượng, yêu cầu trình bày.", tips: ["Miền Bắc: 5-7 tráp (trầu cau, rượu, chè, bánh cốm, hoa quả, bánh phu thê...)", "Miền Nam: 5-11 tráp, thường có thêm heo quay, xôi gấc", "Miền Trung: tương tự Bắc, có thể kèm đặc sản vùng", "Nhà gái nên nói rõ yêu cầu, nhà trai không nên mặc cả"] },
        { emoji: "🎊", question: "Trang trí mâm quả: khăn phủ, hoa, cách sắp xếp?", detail: "Mâm quả cần được trang trí đẹp mắt. Bàn: dùng khăn đỏ hay giấy kiếng? Có cắm hoa tươi không? Ai sắp xếp, trang trí? Thuê dịch vụ hay tự làm?", tips: ["Khăn phủ đỏ/vàng là phổ biến nhất — có thể thuê hoặc mua", "Hoa tươi (hồng, cúc) cắm trên mỗi tráp tạo điểm nhấn", "Dịch vụ trang trí mâm quả: 500k-2tr tùy số lượng và độ cầu kỳ", "Tự trang trí: tiết kiệm nhưng cần người có kinh nghiệm, làm trước 1 ngày"] },
        { emoji: "🐷", question: "Heo quay nguyên con: bên nào lo, mấy con?", detail: "Nhiều đám cưới Việt (đặc biệt miền Nam) yêu cầu heo quay nguyên con. Cần bàn: mấy con, bên nào đặt, chi phí ai chịu.", tips: ["Miền Nam: rất phổ biến, 1-2 con heo quay trong mâm quả", "Miền Bắc/Trung: ít phổ biến, có thể thay bằng lợn sữa hoặc bỏ", "Chi phí: 3-7 triệu/con tùy size", "Heo quay sau lễ: chia cho hai họ hay nhà gái giữ? — bàn trước"] },
        { emoji: "🎀", question: "Chia lễ vật sau lễ ăn hỏi thế nào (lại quả)?", detail: "Sau khi nhà gái nhận mâm quả, phong tục yêu cầu 'chia lễ' — lấy ra một phần trả lại nhà trai (gọi là 'lại quả'). Bàn: chia bao nhiêu, chia gì, cách trình bày.", tips: ["Nguyên tắc: chia đôi hoặc lấy ra 1 phần nhỏ trả lại (không trả hết, không giữ hết)", "Trầu cau: chia lẻ (1, 3, 5 quả) để 'giữ lộc'", "Bánh, trà, rượu: mở ra chia, mỗi bên giữ một phần", "Tiền nạp tài: một số nhà gái trả lại 1 phần trong phong bì lại quả", "Chia xong: sắp vào khay/túi đỏ — KHÔNG bao giờ trả khay rỗng"] },
        { emoji: "🧧", question: "Phong bì lì xì cho đội bê tráp?", detail: "Đội bê tráp (nhà trai) và đội đón tráp (nhà gái) cần được lì xì. Bàn: mỗi người bao nhiêu, ai chuẩn bị phong bì, ai phát.", tips: ["Nhà gái lì xì cho đội bê tráp nhà trai (khi nhận tráp)", "Nhà trai lì xì cho đội đón tráp nhà gái (tùy vùng)", "Mức phổ biến: 100k-500k/người tùy điều kiện", "Chuẩn bị phong bì đỏ sẵn — đừng để đến lúc phát mới tìm"] },
        { emoji: "💰", question: "Tiền nạp tài (tiền đen) bao nhiêu?", detail: "Tiền nạp tài là khoản tiền nhà trai gửi nhà gái theo phong tục, mang ý nghĩa tượng trưng cho sự trân trọng công ơn sinh thành.", tips: ["Miền Bắc: thường bỏ qua hoặc tượng trưng (vài triệu)", "Miền Nam: phổ biến hơn, vài triệu đến vài chục triệu tùy gia đình", "Miền Trung: linh hoạt, tùy thỏa thuận hai nhà", "Nên bàn thẳng thắn — hai nhà làm sui chứ không mua bán", "Một số nhà gái trả lại toàn bộ hoặc một phần"] },
        { emoji: "💍", question: "Trang sức cưới: nhẫn cưới, vàng cho cô dâu?", detail: "Ai mua nhẫn cưới? Nhà trai tặng vàng cho cô dâu bao nhiêu? Nhà gái có tặng lại cho chú rể không? Trao vào lúc nào?", tips: ["Nhẫn cưới: thường đôi trẻ tự chọn hoặc nhà trai lo", "Vàng tặng cô dâu: tùy điều kiện, không so sánh", "Một số nhà gái tặng vàng/quà cho chú rể — nên bàn trước", "Vàng là tài sản cô dâu — nhà trai KHÔNG nên đòi lại", "Thời điểm trao: thường trong lễ ăn hỏi hoặc rước dâu"] },
        { emoji: "🏛️", question: "Theo phong tục vùng nào? Giữ nghi lễ gì?", detail: "Nếu hai nhà khác vùng miền, cần thống nhất theo phong tục nào. Nghi lễ nào bắt buộc, nghi lễ nào linh hoạt hoặc bỏ.", tips: ["Nếu cùng vùng: theo phong tục địa phương", "Nếu khác vùng: thường theo phong tục nhà gái", "Liệt kê rõ: lễ nào bắt buộc, tùy chọn, bỏ", "Gia đình có theo đạo thì cần bàn thêm nghi lễ tôn giáo"] },
        { emoji: "⛪", question: "Khác tôn giáo/tín ngưỡng: xử lý thế nào?", detail: "Nếu hai gia đình theo tôn giáo khác nhau, cần bàn rõ nghi lễ tôn giáo, bàn thờ, thờ cúng.", tips: ["Công giáo: có thể cần hôn phối nhà thờ, học giáo lý", "Phật giáo: có thể thêm lễ hằng thuận tại chùa", "Bàn thờ gia tiên: nhà Công giáo thường không có — cần thống nhất nghi thức thay thế", "Tôn trọng, không ép đối phương bỏ đạo hay theo đạo"] },
        {
          emoji: "🗣️",
          question: "Ai đại diện nhà trai phát biểu xin phép? Nói gì?",
          detail: "Trong lễ ăn hỏi, đại diện nhà trai (thường là bố chú rể hoặc ông/chú lớn tuổi) sẽ phát biểu xin phép nhà gái cho đôi trẻ tiến tới hôn nhân. Cần bàn: ai nói, nội dung gì.",
          tips: [
            "Người phát biểu: bố chú rể, hoặc ông/chú đại diện nếu bố không có mặt",
            "Nội dung: giới thiệu gia đình → bày tỏ mong muốn → xin phép → trình lễ vật",
            "Giọng nói: chân thành, rõ ràng, không cần quá dài (3-5 phút)",
            "Nên viết sẵn ra giấy và tập nói trước 1-2 lần",
          ],
        },
        {
          emoji: "🗣️",
          question: "Ai đại diện nhà gái đáp lời? Nội dung thế nào?",
          detail: "Sau khi nhà trai phát biểu, đại diện nhà gái (thường là bố cô dâu hoặc ông/chú) đáp lời — đồng ý hoặc nêu điều kiện. Cần bàn: ai đáp, nói gì.",
          tips: [
            "Người đáp: bố cô dâu, hoặc ông/chú đại diện",
            "Nội dung: cảm ơn → đồng ý → nêu thỏa thuận (nếu có) → chúc phúc",
            "Không cần quá dài — chân thành là được",
            "Nên chuẩn bị trước, tránh lúng túng",
          ],
        },
        {
          emoji: "🕯️",
          question: "Nghi thức thắp hương, lạy bàn thờ gia tiên?",
          detail: "Lễ gia tiên là phần quan trọng nhất — cô dâu chú rể thắp hương, lạy trước bàn thờ tổ tiên. Cần bàn: ai hướng dẫn, lạy mấy lạy, ai khấn.",
          tips: [
            "Thông thường: đôi trẻ thắp hương → lạy 2 hoặc 4 lạy → bố mẹ chứng kiến",
            "Miền Bắc: thường lạy 4 lạy (2 vái + 2 lạy), trang trọng",
            "Miền Nam: linh hoạt hơn, 2 lạy hoặc theo hướng dẫn ông bà",
            "Nếu nhà Công giáo không có bàn thờ: thay bằng nghi thức cầu nguyện",
            "Chuẩn bị sẵn: nhang, nến, hoa tươi, mâm ngũ quả trên bàn thờ",
            "Nên tập trước 1-2 lần để đôi trẻ không lúng túng",
          ],
        },
        {
          emoji: "👰",
          question: "Nghi thức trao dâu diễn ra thế nào?",
          detail: "Lễ trao dâu là lúc nhà gái chính thức giao con gái cho nhà trai. Ai phát biểu? Nói gì? Ai dắt cô dâu ra?",
          tips: [
            "Thường: bố cô dâu phát biểu → dắt con gái trao cho chú rể",
            "Bố mẹ không có mặt: người lớn nhất trong họ thay thế",
            "Lời phát biểu: ngắn gọn, chân thành (3-5 phút)",
            "Chú rể nên cúi đầu nhận, nói lời cảm ơn bố mẹ vợ",
            "Đây là khoảnh khắc xúc động nhất — nên có người quay phim sẵn",
          ],
        },
        {
          emoji: "🙏",
          question: "Chú rể đáp lời nhận dâu: nói gì?",
          detail: "Sau khi bố cô dâu trao dâu, chú rể (hoặc đại diện nhà trai) nên đáp lời — thể hiện sự trân trọng và cam kết.",
          tips: [
            "Chú rể nên tự nói — chân thành hơn là nhờ người khác",
            "Nội dung: cảm ơn bố mẹ vợ → hứa yêu thương → hứa hiếu thảo hai bên",
            "Ngắn gọn, không cần quá hoa mỹ — thật lòng là đủ",
            "Nếu chú rể quá hồi hộp: viết sẵn vài dòng cầm theo",
          ],
        },
        {
          emoji: "🕯️",
          question: "Văn khấn gia tiên nhà trai khi rước dâu về?",
          detail: "Khi cô dâu về đến nhà trai, đôi trẻ thắp hương bàn thờ gia tiên nhà trai — trình diện tổ tiên, xin phù hộ. Ai khấn? Nội dung khấn gì?",
          tips: [
            "Thường do bố/mẹ chú rể hoặc ông bà khấn",
            "Đôi trẻ thắp hương, lạy 2-4 lạy",
            "Nên khấn trước khi vào tiệc cưới",
            "Chuẩn bị sẵn bàn thờ: hoa, quả, nhang, nến, mâm cúng nhỏ",
          ],
        },
        { emoji: "🏮", question: "Trang trí nhà gái ngày ăn hỏi?", detail: "Nhà gái cần trang trí để đón nhà trai. Bàn: cổng hoa, phông bạt, bàn thờ, bàn tiếp khách, có thuê dịch vụ trang trí không?", tips: ["Cổng hoa: 2-5 triệu tùy size và loại hoa", "Phông bạt tiếp khách: thuê hoặc tự dựng, 1-3 triệu", "Bàn thờ gia tiên: dọn dẹp sạch sẽ, hoa tươi, quả mới", "Bàn trà tiếp khách: chén trà, bánh ngọt, nước suối", "Trang trí tối thiểu: băng-rôn, hoa, đèn — không cần quá cầu kỳ"] },
        { emoji: "🏮", question: "Trang trí nhà trai ngày rước dâu về?", detail: "Nhà trai cũng cần trang trí để đón cô dâu về. Bàn: cổng hoa, phông bạt, phòng tân hôn, bàn thờ.", tips: ["Cổng hoa nhà trai: nên có, không cần to bằng nhà gái", "Phòng tân hôn: dọn dẹp, trang trí đơn giản (hoa, nến, ga giường mới)", "Bàn thờ gia tiên: chuẩn bị sẵn hoa, quả, nhang, nến cho lễ gia tiên", "Bàn tiếp khách, trà nước cho đoàn nhà gái đi theo cô dâu (nếu có)"] },
        { emoji: "🚗", question: "Đám rước dâu: xe cộ, lộ trình, đoàn rước?", detail: "Hai nhà cần bàn phương tiện đón dâu, số lượng xe, lộ trình đi và về, ai đi trong đoàn rước.", tips: ["Số xe thường số chẵn (4, 6, 8 xe)", "Xe hoa nên đặt sớm nếu cưới mùa cao điểm", "Lộ trình: tránh nghĩa trang, nhà thờ/chùa khác tôn giáo (tùy vùng)", "Đoàn rước: bố mẹ chú rể, cô chú đại diện, phù rể — số người lẻ (về thành chẵn có cô dâu)", "Tính thời gian di chuyển + ùn tắc để đến đúng giờ đẹp"] },
        { emoji: "🎎", question: "Đội bê tráp & phù dâu phù rể: bao nhiêu người?", detail: "Số người bê tráp = số mâm quả. Phù dâu phù rể nên bao nhiêu? Ai chọn? Yêu cầu gì?", tips: ["Bê tráp: nam (nhà trai bê sang) + nữ (nhà gái đón) — số lượng bằng nhau", "Truyền thống: bê tráp phải chưa kết hôn (ngày nay linh hoạt hơn)", "Phù dâu: 2-6 người, bạn thân cô dâu", "Phù rể: số lượng tương đương phù dâu", "Bàn trước: ai lo trang phục cho đội bê tráp, phù dâu phù rể?"] },
        { emoji: "👗", question: "Trang phục cho nghi lễ: cô dâu chú rể, hai họ, bê tráp?", detail: "Thống nhất trang phục cho các nghi lễ (ăn hỏi + rước dâu + lễ gia tiên). Áo dài truyền thống hay vest/đầm? Màu sắc đồng bộ?", tips: ["Cô dâu: áo dài đỏ/hồng cho lễ, váy trắng cho tiệc", "Chú rể: áo dài nam hoặc vest — đồng bộ với cô dâu", "Bố mẹ hai bên: nên cùng tông màu", "Đội bê tráp + phù dâu: đồng phục áo dài cùng màu", "Budget trang phục tính từ đầu — thuê hay may riêng"] },
        { emoji: "🍵", question: "Nghi thức rót trà mời hai họ?", detail: "Trong lễ ăn hỏi hoặc lễ cưới, cô dâu chú rể rót trà mời bố mẹ, ông bà, cô chú hai bên — thể hiện lòng kính trọng. Bàn: có làm lễ rót trà không, mời ai, thứ tự.", tips: ["Thứ tự: ông bà → bố mẹ → cô chú lớn → cô chú nhỏ", "Rót trà cho bố mẹ: quỳ xuống hoặc cúi người (tùy vùng)", "Sau khi rót trà: bố mẹ/ông bà thường lì xì hoặc tặng vàng cho đôi trẻ", "Trà: nên dùng trà ngon, pha sẵn trong bộ ấm chén đẹp", "Phổ biến ở miền Bắc và Trung, miền Nam linh hoạt hơn"] },
        {
          emoji: "🔄",
          question: "Lễ lại mặt (về nhà gái sau cưới 3 ngày)?",
          detail: "Sau cưới 3 ngày (hoặc 1 ngày tùy vùng), đôi trẻ về thăm nhà gái mang lễ vật. Cần thống nhất ngày, mang gì, ai đi cùng.",
          tips: [
            "Miền Bắc: thường sau 3 ngày, mang gà, xôi, trái cây",
            "Miền Nam: có thể ngay hôm sau hoặc 3 ngày sau",
            "Chú rể nên đi cùng, thể hiện sự tôn trọng",
            "Lễ vật: gà luộc, xôi, trái cây, rượu — tùy vùng",
          ],
        },
        { emoji: "⚠️", question: "Gia đình có hoàn cảnh đặc biệt cần lưu ý?", detail: "Bố mẹ ly hôn, gia đình có tang, người thân bệnh nặng... ảnh hưởng đến nghi lễ. Nên bàn trước để xử lý tinh tế.", tips: ["Bố mẹ ly hôn: ai đại diện trong lễ? Cả hai có mặt không?", "Gia đình có tang: theo tục không cưới trong tang — nhưng linh hoạt tùy mức độ", "Người thân bệnh nặng: sắp xếp vai trò thay thế trong nghi lễ", "Nói thẳng còn hơn giấu — đối phương sẽ thông cảm nếu biết trước"] },
        { emoji: "👴", question: "Có cần mời thêm trưởng họ, trưởng tộc?", detail: "Một số dòng họ có trưởng họ/trưởng tộc — cần hỏi ý kiến hoặc mời tham dự lễ. Nếu không mời có thể gây mất lòng.", tips: ["Hỏi bố mẹ: dòng họ mình có trưởng họ đang hoạt động không?", "Nếu có: nên mời dự lễ ăn hỏi hoặc ít nhất báo tin", "Trưởng họ có thể được mời phát biểu hoặc chứng kiến lễ", "Đám cưới là dịp cả họ vui — mời rộng tốt hơn mời thiếu"] },
      ],
      prayers: ENGAGEMENT_PRAYERS,
      gifts: [
        { name: "Cau trầu", quantity: "1 buồng cau + trầu", cost: 200000 },
        { name: "Trà", quantity: "1-2 hộp trà ngon", cost: 200000 },
        { name: "Rượu", quantity: "2 chai (vang/ngoại)", cost: 300000 },
        { name: "Bánh", quantity: "1-2 hộp (phu thê/cốm)", cost: 300000 },
        { name: "Trái cây", quantity: "Ngũ quả tươi", cost: 200000 },
        { name: "Bánh ngọt (miền Nam)", quantity: "1 hộp", cost: 200000 },
      ],
      people: [
        { name: "Bố mẹ 2 bên", role: "Đại diện gia đình", avatar: "👫" },
        { name: "Cô dâu & Chú rể", role: "Cầu nối hai gia đình", avatar: "💑" },
        { name: "Ông bà (nếu có)", role: "Trưởng bối", avatar: "👴" },
        { name: "Cô/chú đại diện", role: "Chứng kiến", avatar: "👥" },
      ],
    },
  ],
};
