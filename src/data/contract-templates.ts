// Contract Template Library for Vietnamese Wedding Vendors
// Provides pre-written contract clauses and templates for different vendor categories

export interface ContractClause {
  id: string;
  titleVi: string;
  titleEn: string;
  contentVi: string;
  contentEn: string;
  category: string;
  required: boolean;
}

export interface ContractTemplate {
  id: string;
  category: string;
  categoryVi: string;
  categoryEn: string;
  descriptionVi: string;
  descriptionEn: string;
  clauses: ContractClause[];
  paymentTermsVi: string;
  paymentTermsEn: string;
  cancellationPolicyVi: string;
  cancellationPolicyEn: string;
  warrantyTermsVi?: string;
  warrantyTermsEn?: string;
}

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  // === VENUE CONTRACT ===
  {
    id: "venue-template",
    category: "venue",
    categoryVi: "Hệ thống tiệc cưới",
    categoryEn: "Wedding Venue",
    descriptionVi: "Mẫu hợp đồng thuê địa điểm tổ chức tiệc cưới với các điều khoản về dịch vụ, trang trí, âm thanh và chính sách hủy.",
    descriptionEn: "Wedding venue rental contract template with service, decoration, audio-visual, and cancellation terms.",
    clauses: [
      {
        id: "venue-service-hours",
        titleVi: "Thời gian sử dụng dịch vụ",
        titleEn: "Service Hours",
        contentVi: "Bên cho thuê đồng ý cung cấp địa điểm tổ chức tiệc trong thời gian từ [giờ bắt đầu] đến [giờ kết thúc] vào ngày [ngày tháng năm]. Bên thuê có thể đến sớm 2 tiếng để chuẩn bị.",
        contentEn: "The Venue Provider agrees to provide the venue for the time period from [start time] to [end time] on [date]. The Renter may arrive 2 hours early for preparation.",
        category: "venue",
        required: true
      },
      {
        id: "venue-decor-included",
        titleVi: "Dịch vụ trang trí cơ bản",
        titleEn: "Basic Decoration Services",
        contentVi: "Bên cho thuê cung cấp gói trang trí cơ bản bao gồm: bàn ghế, khăn bàn, hoa bàn tiệc, backdrop sân khấu đơn giản. Các vật liệu trang trí cao cấp sẽ được tính phí thêm.",
        contentEn: "The Venue Provider provides basic decoration package including: tables, chairs, tablecloths, table flowers, simple stage backdrop. Premium decoration materials will incur additional charges.",
        category: "venue",
        required: true
      },
      {
        id: "venue-capacity-guarantee",
        titleVi: "Cam kết sức chứa",
        titleEn: "Capacity Guarantee",
        contentVi: "Bên cho thuê cam kết địa điểm có sức chứa tối thiểu [số lượng] khách, phù hợp với số lượng khách mời đã đăng ký. Bên cho thuê không được phép giảm số lượng bàn hoặc sức chứa khi đã chốt hợp đồng.",
        contentEn: "The Venue Provider guarantees the venue has a minimum capacity of [number] guests, suitable for the registered guest count. The Provider cannot reduce table count or capacity after contract confirmation.",
        category: "venue",
        required: true
      },
      {
        id: "venue-av-equipment",
        titleVi: "Thiết bị âm thanh và máy chiếu",
        titleEn: "Audio-Visual Equipment",
        contentVi: "Bên cho thuê cung cấp: hệ thống âm thanh cơ bản, micro không dây, máy chiếu và màn hình. Bên thuê có thể mang thiết bị riêng nếu cần.",
        contentEn: "The Venue Provider provides: basic sound system, wireless microphone, projector and screen. The Renter may bring additional equipment if needed.",
        category: "venue",
        required: false
      },
      {
        id: "venue-food-tasting",
        titleVi: "Test đồ ăn (Food Tasting)",
        titleEn: "Food Tasting",
        contentVi: "Bên cho thuê cho phép bên thuê test thực đơn tối đa [số lần] lần trước ngày tiệc 2 tháng. Bên thuê có thể thay đổi tối đa 20% món ăn sau khi test.",
        contentEn: "The Venue Provider allows the Renter to taste the menu up to [number] times 2 months before the event. The Renter may change up to 20% of menu items after tasting.",
        category: "venue",
        required: false
      },
      {
        id: "venue-payment-schedule",
        titleVi: "Lịch thanh toán",
        titleEn: "Payment Schedule",
        contentVi: "- Đặt cọc: [số]% tổng giá trị khi ký hợp đồng\n- Thanh toán 50% còn lại: trước ngày tiệc 30 ngày\n- Thanh toán hết: vào ngày tổ chức tiệc\n- Giữ chỗ: phải thanh toán đủ 70% trước 30 ngày để giữ chỗ",
        contentEn: "- Deposit: [percentage]% of total value at contract signing\n- Pay 50% of remaining: 30 days before event\n- Final payment: on event day\n- Reservation: 70% must be paid 30 days prior to hold reservation",
        category: "venue",
        required: true
      },
      {
        id: "venue-cancellation-policy",
        titleVi: "Chính sách hủy hợp đồng",
        titleEn: "Cancellation Policy",
        contentVi: "- Hủy trước 60 ngày: hoàn lại 100% tiền đã trừ (trừ phí đặt cọc 20%)\n- Hủy trước 30 ngày: hoàn lại 50% số tiền đã trả\n- Hủy trước 15 ngày: hoàn lại 20% số tiền đã trả\n- Hủy trong vòng 15 ngày: không hoàn lại tiền",
        contentEn: "- Cancel 60+ days prior: 100% refund (minus 20% deposit fee)\n- Cancel 30+ days prior: 50% refund of paid amount\n- Cancel 15+ days prior: 20% refund of paid amount\n- Cancel within 15 days: no refund",
        category: "venue",
        required: true
      }
    ],
    paymentTermsVi: "Đặt cọc 50% khi ký hợp đồng, 30% trước 30 ngày, 20% vào ngày tổ chức tiệc",
    paymentTermsEn: "50% deposit at signing, 30% due 30 days prior, 20% on event day",
    cancellationPolicyVi: "Hủy trước 60 ngày: hoàn 80% | Trước 30 ngày: hoàn 50% | Trong 30 ngày: không hoàn",
    cancellationPolicyEn: "Cancel 60+ days: 80% refund | 30+ days: 50% refund | Within 30 days: no refund"
  },

  // === PHOTOGRAPHY CONTRACT ===
  {
    id: "photography-template",
    category: "photography",
    categoryVi: "Nhiếp ảnh gia",
    categoryEn: "Photography Service",
    descriptionVi: "Mẫu hợp đồng chụp ảnh cưới với các điều khoản về số giờ, file ảnh chỉnh sửa, album và quyền sử dụng.",
    descriptionEn: "Wedding photography contract with terms on hours, edited photos, albums, and usage rights.",
    clauses: [
      {
        id: "photo-service-hours",
        titleVi: "Thời gian chụp ảnh",
        titleEn: "Photography Hours",
        contentVi: "Nhiếp ảnh gia cam kết chụp ảnh trong [số] giờ liên tục từ [giờ bắt đầu]. Thời gian bao gồm: chụp tại nhà cô dâu, nhà chú rể, địa điểm tổ chức tiệc và các địa điểm khác theo yêu cầu.",
        contentEn: "Photographer commits to [number] consecutive hours of photography from [start time]. Time includes: bride's home, groom's home, venue, and other locations as requested.",
        category: "photography",
        required: true
      },
      {
        id: "photo-delivery-specs",
        titleVi: "Thông số và số lượng ảnh",
        titleEn: "Photo Specs and Quantity",
        contentVi: "- Số lượng ảnh gốc (RAW): tối thiểu [số] ảnh\n- Số lượng ảnh chỉnh sửa: [số] ảnh\n- Độ phân giải: tối thiểu 12MP\n- Định dạng: JPEG chất lượng cao + RAW gốc",
        contentEn: "- Original (RAW) photos: minimum [number] photos\n- Edited photos: [number] photos\n- Resolution: minimum 12MP\n- Format: High quality JPEG + original RAW",
        category: "photography",
        required: true
      },
      {
        id: "photo-turnaround-time",
        titleVi: "Thời gian giao ảnh",
        titleEn: "Turnaround Time",
        contentVi: "- Xem trước (preview): 5-7 ngày làm việc sau buổi chụp\n- Ảnh chỉnh sửa hoàn chỉnh: 30-45 ngày làm việc\n- Album/Photobook: 60-90 ngày làm việc",
        contentEn: "- Preview: 5-7 business days after shoot\n- Complete edited photos: 30-45 business days\n- Album/Photobook: 60-90 business days",
        category: "photography",
        required: true
      },
      {
        id: "photo-raw-files",
        titleVi: "Quyền lợi file RAW",
        titleEn: "RAW Files Rights",
        contentVi: "Bên thuê nhận toàn bộ file RAW gốc sau khi bên chụp ảnh đã chỉnh sửa xong bộ ảnh chính thức. File RAW có thể được dùng để chỉnh sửa thêm hoặc in ấn.",
        contentEn: "The Renter receives all original RAW files after the Photographer has completed editing the official set. RAW files may be used for additional editing or printing.",
        category: "photography",
        required: true
      },
      {
        id: "photo-album-included",
        titleVi: "Album và photobook",
        titleEn: "Album and Photobook",
        contentVi: "Gói bao gồm: [số] cuốn photobook [kích thước] trang, [số] ảnh table size, [số] ảnh mini. Material: giấy ảnh cao cấp, bìa da/gỗ.",
        contentEn: "Package includes: [number] photobooks [size] pages, [number] table size photos, [number] mini photos. Material: premium photo paper, leather/wood cover.",
        category: "photography",
        required: false
      },
      {
        id: "photo-usage-rights",
        titleVi: "Quyền sử dụng hình ảnh",
        titleEn: "Image Usage Rights",
        contentVi: "Bên chụp ảnh có quyền sử dụng ảnh làm portfolio, website, mạng xã hội. Bên thuê có quyền sử dụng ảnh cho mục đích cá nhân, thương mại (trừ bán lại file ảnh gốc).",
        contentEn: "Photographer has rights to use photos for portfolio, website, social media. Renter has rights to use photos for personal and commercial purposes (except reselling original files).",
        category: "photography",
        required: true
      },
      {
        id: "photo-drone-extra",
        titleVi: "Dịch vụ quay drone (nếu có)",
        titleEn: "Drone Service (if applicable)",
        contentVi: "Quay drone [số] phút tại [địa điểm]. Bên chụp ảnh chịu trách nhiệm xin phép bay drone tại địa điểm yêu cầu.",
        contentEn: "Drone filming [number] minutes at [location]. Photographer is responsible for obtaining drone flight permissions at requested location.",
        category: "photography",
        required: false
      }
    ],
    paymentTermsVi: "Đặt cọc 40% khi ký, 30% sau buổi chụp, 30% khi giao album",
    paymentTermsEn: "40% deposit at signing, 30% after shoot, 30% upon album delivery",
    cancellationPolicyVi: "Hủy trước 30 ngày: hoàn 70% | Trước 14 ngày: hoàn 30% | Trong 14 ngày: không hoàn",
    cancellationPolicyEn: "Cancel 30+ days: 70% refund | 14+ days: 30% refund | Within 14 days: no refund"
  },

  // === MAKEUP CONTRACT ===
  {
    id: "makeup-template",
    category: "makeup",
    categoryVi: "Trang điểm cô dâu",
    categoryEn: "Bridal Makeup",
    descriptionVi: "Mẫu hợp đồng makeup cô dâu với các điều khoản về test makeup, số lần makeup, sản phẩm và chính sách bảo hành.",
    descriptionEn: "Bridal makeup contract with terms on makeup trial, number of sessions, products, and warranty.",
    clauses: [
      {
        id: "makeup-trial-session",
        titleVi: "Buổi test makeup",
        titleEn: "Makeup Trial Session",
        contentVi: "Bên trang điểm cung cấp [số] buổi test makeup miễn phí hoặc tính phí [số tiền] cho mỗi buổi test. Test makeup nên diễn ra trước ngày cưới 2-4 tuần.",
        contentEn: "Makeup Artist provides [number] free trial sessions or charges [amount] per trial session. Makeup trial should occur 2-4 weeks before wedding day.",
        category: "makeup",
        required: true
      },
      {
        id: "makeup-day-schedule",
        titleVi: "Lịch trang trí ngày cưới",
        titleEn: "Wedding Day Schedule",
        contentVi: "- Makeup cô dâu: bắt đầu [giờ] tại [địa điểm]\n- Makeup mẹ cô dâu/chú rể: [giờ]\n- Makeup phù dâu/phụ nữ: [số người] x [giờ mỗi người\n- Thời gian makeup cô dâu: 60-90 phút\n- Thời gian makeup khác: 30-45 phút/người",
        contentEn: "- Bride makeup: start [time] at [location]\n- Mother makeup: [time]\n- Bridesmaid makeup: [number] people x [time] each\n- Bride makeup time: 60-90 minutes\n- Other makeup: 30-45 minutes/person",
        category: "makeup",
        required: true
      },
      {
        id: "makeup-products-brand",
        titleVi: "Sản phẩm và thương hiệu",
        titleEn: "Products and Brands",
        contentVi: "Sử dụng sản phẩm chính hãng: MAC, Dior, Chanel, Make Up For Ever, Bobbi Brown, hoặc tương đương. Cam kết không dùng sản phẩm kém chất lượng.",
        contentEn: "Uses genuine products: MAC, Dior, Chanel, Make Up For Ever, Bobbi Brown, or equivalent. Commits to not using low-quality products.",
        category: "makeup",
        required: true
      },
      {
        id: "makeup-touchup-kit",
        titleVi: "Bộ makeup touch-up",
        titleEn: "Touch-up Kit",
        contentVi: "Cung cấp bộ makeup touch-up cho cô dâu trong ngày cưới bao gồm: phấn phủ, son môi, kem nền, mascara. Hướng dẫn cách touch-up.",
        contentEn: "Provides touch-up makeup kit for bride on wedding day including: powder, lipstick, foundation, mascara. Includes touch-up instructions.",
        category: "makeup",
        required: true
      },
      {
        id: "makeup-travel-fee",
        titleVi: "Phí đi tỉnh (nếu có)",
        titleEn: "Travel Fee (if applicable)",
        contentVi: "Miễn phí di chuyển trong bán kính [số] km.超出 bán kính này tính phí: [số tiền]/km hoặc [số tiền] cho địa điểm cụ thể.",
        contentEn: "Free travel within [number] km radius. Beyond this radius charges: [amount]/km or [amount] for specific location.",
        category: "makeup",
        required: false
      },
      {
        id: "makeup-rework-policy",
        titleVi: "Chính sửa lại nếu không hài lòng",
        titleEn: "Rework Policy if Unsatisfied",
        contentVi: "Nếu không hài lòng với makeup, bride có yêu cầu sửa lại trong vòng 30 phút sau khi hoàn thành. Makeup artist sẽ chỉnh sửa theo yêu cầu.",
        contentEn: "If unsatisfied with makeup, bride may request rework within 30 minutes after completion. Makeup artist will adjust according to request.",
        category: "makeup",
        required: true
      }
    ],
    paymentTermsVi: "Đặt cọc 50% khi ký, thanh toán hết vào ngày cưới sau khi hoàn thành",
    paymentTermsEn: "50% deposit at signing, final payment on wedding day after completion",
    cancellationPolicyVi: "Hủy trước 14 ngày: hoàn 60% | Trước 7 ngày: hoàn 30% | Trong 7 ngày: không hoàn",
    cancellationPolicyEn: "Cancel 14+ days: 60% refund | 7+ days: 30% refund | Within 7 days: no refund",
    warrantyTermsVi: "Cam kết makeup giữ nguyên ít nhất 8 giờ trong điều kiện bình thường",
    warrantyTermsEn: "Guarantees makeup lasts at least 8 hours under normal conditions"
  },

  // === CATERING CONTRACT ===
  {
    id: "catering-template",
    category: "catering",
    categoryVi: "Dịch vụ đồ ăn tiệc",
    categoryEn: "Catering Service",
    descriptionVi: "Mẫu hợp đồng dịch vụ ăn uống với các điều khoản về thực đơn, food tasting, nhân viên phục vụ và setup.",
    descriptionEn: "Catering service contract with terms on menu, food tasting, service staff, and setup.",
    clauses: [
      {
        id: "catering-menu-confirm",
        titleVi: "Xác nhận thực đơn",
        titleEn: "Menu Confirmation",
        contentVi: "Thực đơn được chốt: [số] món khai vị, [số] món chính, [số] món tráng miệng. Tổng cộng [số] set menu cho [số lượng] khách. Thay đổi món trước [số] ngày.",
        contentEn: "Menu confirmed: [number] appetizers, [number] main courses, [number] desserts. Total [number] set menus for [number] guests. Changes allowed [number] days prior.",
        category: "catering",
        required: true
      },
      {
        id: "catering-food-tasting",
        titleVi: "Test đồ ăn",
        titleEn: "Food Tasting",
        contentVi: "Bên thuê được test [số] lần trước ngày tiệc. Test max [số người]. Nếu thay đổi món chính sau test, tính phí 10-20% giá trị món.",
        contentEn: "Renter may taste [number] times before event. Max [number] people per tasting. If main dishes change after tasting, 10-20% fee applies.",
        category: "catering",
        required: true
      },
      {
        id: "catering-special-diet",
        titleVi: "Hỗ trợ ăn chay/dị ứng",
        titleEn: "Vegetarian/Allergy Support",
        contentVi: "Miễn phí [số]% set menu chay cho người ăn chay. Hỗ trợ món ăn dị ứng nếu có thông báo trước [số] ngày.",
        contentEn: "Free [number]% vegetarian set menu for vegetarian guests. Supports allergy meals if notified [number] days prior.",
        category: "catering",
        required: true
      },
      {
        id: "catering-service-time",
        titleVi: "Thời gian phục vụ",
        titleEn: "Service Time",
        contentVi: "Nhân viên có mặt [số] tiếng trước giờ tiệc để setup. Phục vụ trong [số] tiếng tiệc. Dọn dẹp sau tiệc [số] tiếng.",
        contentEn: "Staff arrives [number] hours before event for setup. Serves for [number] hours. Cleanup after event [number] hours.",
        category: "catering",
        required: true
      },
      {
        id: "catering-staff-ratio",
        titleVi: "Tỷ lệ nhân viên phục vụ",
        titleEn: "Service Staff Ratio",
        contentVi: "Cung cấp [số] nhân viên phục vụ cho mỗi [số] khách. Bao gồm: captain, waiter, bartender. Mặc đồng phục chuyên nghiệp.",
        contentEn: "Provides [number] service staff per [number] guests. Includes: captain, waiter, bartender. Wears professional uniform.",
        category: "catering",
        required: true
      },
      {
        id: "catering-equipment-included",
        titleVi: "Thiết bị bao gồm",
        titleEn: "Included Equipment",
        contentVi: "Miễn phí: bàn, ghế, khăn bàn, bát đĩa, dao nĩa, ly. Thuê thêm: higher-end餐具, centerpiece, fountain.",
        contentEn: "Free: tables, chairs, tablecloths, plates, cutlery, glasses. Extra rent: premium dinnerware, centerpieces, fountain.",
        category: "catering",
        required: false
      },
      {
        id: "catering-cleanup-policy",
        titleVi: "Chính sách dọn dẹp",
        titleEn: "Cleanup Policy",
        contentVi: "Bên catering chịu trách nhiệm dọn dẹp khu vực ăn uống sau tiệc. Bên thuê chỉ việc dọn personal items.",
        contentEn: "Caterer responsible for cleaning dining area after event. Renter only removes personal items.",
        category: "catering",
        required: true
      }
    ],
    paymentTermsVi: "Đặt cọc 50% khi ký, 40% trước 14 ngày, 10% vào ngày tiệc",
    paymentTermsEn: "50% deposit at signing, 40% due 14 days prior, 10% on event day",
    cancellationPolicyVi: "Hủy trước 30 ngày: hoàn 70% | Trước 14 ngày: hoàn 40% | Trong 14 ngày: không hoàn",
    cancellationPolicyEn: "Cancel 30+ days: 70% refund | 14+ days: 40% refund | Within 14 days: no refund"
  },

  // === MC CONTRACT ===
  {
    id: "mc-template",
    category: "mc",
    categoryVi: "MC dẫn chương trình",
    categoryEn: "MC Service",
    descriptionVi: "Mẫu hợp đồng MC với các điều khoản về kịch bản, giờ dẫn, âm nhạc và yêu cầu đặc biệt.",
    descriptionEn: "MC contract with terms on script, hours, music, and special requirements.",
    clauses: [
      {
        id: "mc-service-hours",
        titleVi: "Thời gian dẫn chương trình",
        titleEn: "MC Service Hours",
        contentVi: "MC dẫn chương trình trong [số] tiếng tại [địa điểm]. Bao gồm: đón khách, khai mạc, games, cutting cake, closing. Có mặt [số] tiếng trước để chuẩn bị.",
        contentEn: "MC hosts for [number] hours at [location]. Includes: guest reception, opening, games, cake cutting, closing. Arrives [number] hours early for preparation.",
        category: "mc",
        required: true
      },
      {
        id: "mc-script-content",
        titleVi: "Kịch bản và nội dung",
        titleEn: "Script and Content",
        contentVi: "MC cung cấp kịch bản chi tiết trước [số] ngày để bride & groom review. Kịch bản bao gồm: intro, bride groom entry, games, thank you speech.",
        contentEn: "MC provides detailed script [number] days prior for bride & groom review. Script includes: intro, bride groom entry, games, thank you speech.",
        category: "mc",
        required: true
      },
      {
        id: "mc-program-flow",
        titleVi: "Flow chương trình",
        titleEn: "Program Flow",
        contentVi: "Chương trình đi theo flow: [1] Đón khách & Cocktails [2] Khai mạc & Entry [3] Games & Giải trí [4] Cutting Cake [5] Toast & Thank you [6] Closing.",
        contentEn: "Program follows flow: [1] Guest Reception & Cocktails [2] Opening & Entry [3] Games & Entertainment [4] Cake Cutting [5] Toast & Thank you [6] Closing.",
        category: "mc",
        required: true
      },
      {
        id: "mc-music-equipment",
        titleVi: "Âm nhạc và thiết bị",
        titleEn: "Music and Equipment",
        contentVi: "MC cung cấp: laptop, danh sách nhạc, micro. Venue cung cấp: sound system. MC có thể điều chỉnh theo request playlist.",
        contentEn: "MC provides: laptop, music list, microphones. Venue provides: sound system. MC can adjust according to playlist request.",
        category: "mc",
        required: false
      },
      {
        id: "mc-games-activities",
        titleVi: "Games và hoạt động",
        titleEn: "Games and Activities",
        contentVi: "MC tổ chức [số] games cho bride & groom và khách. Games phù hợp với văn hóa Việt: ghép đôi, giải đố, танцы. Có thể request loại games khác.",
        contentEn: "MC organizes [number] games for bride & groom and guests. Games suitable for Vietnamese culture: matching, quizzes, dancing. Can request other game types.",
        category: "mc",
        required: false
      },
      {
        id: "mc-attire",
        titleVi: "Trang phục MC",
        titleEn: "MC Attire",
        contentVi: "MC mặc vest hoặc áo dài theo yêu cầu. Nếu bride & groom có theme MC sẽ follow theme (color, style).",
        contentEn: "MC wears vest or ao dai as requested. If bride & groom have theme, MC will follow theme (color, style).",
        category: "mc",
        required: true
      },
      {
        id: "mc-contingency",
        titleVi: "Xử lý tình huống",
        titleEn: "Contingency Handling",
        contentVi: "MC có kinh nghiệm xử lý tình huống: delay bride/groom, technical issues, guest complaints. MC linh hoạt điều chỉnh program.",
        contentEn: "MC experienced in handling situations: bride/groom delay, technical issues, guest complaints. MC flexibly adjusts program.",
        category: "mc",
        required: true
      }
    ],
    paymentTermsVi: "Đặt cọc 50% khi ký, 50% vào ngày diễn ra sự kiện",
    paymentTermsEn: "50% deposit at signing, 50% on event day",
    cancellationPolicyVi: "Hủy trước 21 ngày: hoàn 60% | Trước 7 ngày: hoàn 30% | Trong 7 ngày: không hoàn",
    cancellationPolicyEn: "Cancel 21+ days: 60% refund | 7+ days: 30% refund | Within 7 days: no refund"
  },

  // === FLOWERS CONTRACT ===
  {
    id: "flowers-template",
    category: "flowers",
    categoryVi: "Hoa cưới",
    categoryEn: "Wedding Flowers",
    descriptionVi: "Mẫu hợp đồng trang trí hoa với các điều khoản về loại hoa, số lượng, thiết kế và setup.",
    descriptionEn: "Wedding flowers contract with terms on flower types, quantities, design, and setup.",
    clauses: [
      {
        id: "flowers-bridal-bouquet",
        titleVi: "Bó hoa cô dâu",
        titleEn: "Bridal Bouquet",
        contentVi: "Bó hoa cô dâu [kích thước] gồm [loại hoa chính] + [loại hoa phụ] + lá xanh. Design: [style: round, cascade, hand-tied]. Color theo bride dress.",
        contentEn: "Bride bouquet [size] includes [main flower] + [secondary flower] + greenery. Design: [style: round, cascade, hand-tied]. Color matches bride dress.",
        category: "flowers",
        required: true
      },
      {
        id: "flowers-boutonnieres",
        titleVi: "Hoa cài áo",
        titleEn: "Boutonnieres",
        contentVi: "Cung cấp [số] boutonnieres cho groom, best man, fathers, grandfathers. Style đơn giản hoặc theo theme.",
        contentEn: "Provides [number] boutonnieres for groom, best man, fathers, grandfathers. Simple style or theme-matching.",
        category: "flowers",
        required: true
      },
      {
        id: "flowers-corsages",
        titleVi: "Hoa cài wrist",
        titleEn: "Wrist Corsages",
        contentVi: "Cung cấp [số] wrist corsages cho mothers, grandmothers. Design柔和 nhẹ nhàng.",
        contentEn: "Provides [number] wrist corsages for mothers, grandmothers. Soft, gentle design.",
        category: "flowers",
        required: false
      },
      {
        id: "flowers-table-centerpieces",
        titleVi: "Hoa bàn tiệc",
        titleEn: "Table Centerpieces",
        contentVi: "[Số] bàn tiệc, mỗi bàn 1 centerpiece gồm [loại hoa] + [vase type]. Height: [low/medium/high] để không block conversation.",
        contentEn: "[Number] tables, each with 1 centerpiece including [flower type] + [vase type]. Height: [low/medium/high] to not block conversation.",
        category: "flowers",
        required: true
      },
      {
        id: "flowers-stage-backdrop",
        titleVi: "Hoa backdrop sân khấu",
        titleEn: "Stage Backdrop Flowers",
        contentVi: "Backdrop sân khấu [kích thước] với hoa tươi hoặc mix hoa + fabric. Style: [rustic, modern, traditional].",
        contentEn: "Stage backdrop [size] with fresh flowers or mix flowers + fabric. Style: [rustic, modern, traditional].",
        category: "flowers",
        required: false
      },
      {
        id: "flowers-gate-arch",
        titleVi: "Cổng hoa (arch)",
        titleEn: "Wedding Arch",
        contentVi: "Cổng hoa tại [địa điểm: entrance/ceremony] size [kích thước]. Full hoa hoặc hoa + greenery.",
        contentEn: "Wedding arch at [location: entrance/ceremony] size [size]. Full flowers or flowers + greenery.",
        category: "flowers",
        required: false
      },
      {
        id: "flowers-setup-removal",
        titleVi: "Thời gian setup và dọn",
        titleEn: "Setup and Removal Time",
        contentVi: "Setup bắt đầu [số] tiếng trước tiệc. Dọn hoa sau tiệc: bride & groom có thể giữ hoặc donate. Hoàn thành dọn trong [số] tiếng.",
        contentEn: "Setup starts [number] hours before event. Flower removal after event: bride & groom may keep or donate. Cleanup completes within [number] hours.",
        category: "flowers",
        required: true
      },
      {
        id: "flowers-freshness-guarantee",
        titleVi: "Cam kết độ tươi",
        titleEn: "Freshness Guarantee",
        contentVi: "Hoa được chuẩn bị trong vòng [số] tiếng trước tiệc để đảm bảo độ tươi. Nếu hoa wilt trong tiệc, sẽ được thay mới.",
        contentEn: "Flowers prepared within [number] hours before event to ensure freshness. If flowers wilt during event, will be replaced.",
        category: "flowers",
        required: true
      }
    ],
    paymentTermsVi: "Đặt cọc 60% khi ký, 40% vào ngày sự kiện",
    paymentTermsEn: "60% deposit at signing, 40% on event day",
    cancellationPolicyVi: "Hủy trước 14 ngày: hoàn 50% | Trước 7 ngày: hoàn 20% | Trong 7 ngày: không hoàn",
    cancellationPolicyEn: "Cancel 14+ days: 50% refund | 7+ days: 20% refund | Within 7 days: no refund"
  },

  // === TRANSPORTATION CONTRACT ===
  {
    id: "transportation-template",
    category: "transportation",
    categoryVi: "Dịch vụ xe cưới",
    categoryEn: "Wedding Transportation",
    descriptionVi: "Mẫu hợp đồng xe cưới với các điều khoản về loại xe, lộ trình, decor và giá.",
    descriptionEn: "Wedding transportation contract with terms on vehicle type, route, decoration, and pricing.",
    clauses: [
      {
        id: "transport-vehicle-type",
        titleVi: "Loại xe và số lượng",
        titleEn: "Vehicle Type and Quantity",
        contentVi: "Cung cấp [số] xe: [loại xe chính: Mercedes S-Class, BMW 7 Series, Rolls-Royce, etc.] + [số] xe khác cho gia đình. Tất cả xe trong condition tốt.",
        contentEn: "Provides [number] vehicles: [main vehicle type: Mercedes S-Class, BMW 7 Series, Rolls-Royce, etc.] + [number] other vehicles for family. All vehicles in good condition.",
        category: "transportation",
        required: true
      },
      {
        id: "transport-route-schedule",
        titleVi: "Lộ trình và lịch trình",
        titleEn: "Route and Schedule",
        contentVi: "Lộ trình: [Điểm A] → [Điểm B] → [Điểm C]. Thời gian pickup: [giờ]. Backup route nếu traffic jam.",
        contentEn: "Route: [Point A] → [Point B] → [Point C]. Pickup time: [time]. Backup route if traffic jam.",
        category: "transportation",
        required: true
      },
      {
        id: "transport-decoration",
        titleVi: "Trang trí xe",
        titleEn: "Car Decoration",
        contentVi: "Decor xe chính với ribbon, flowers, [optional: just married sign]. Style theo wedding theme. Decor removable, không damage xe.",
        contentEn: "Decorate main vehicle with ribbons, flowers, [optional: just married sign]. Style matches wedding theme. Decor removable, no vehicle damage.",
        category: "transportation",
        required: true
      },
      {
        id: "transport-driver-info",
        titleVi: "Thông tin tài xế",
        titleEn: "Driver Information",
        contentVi: "Tài xế: [Tên], [SĐT], kinh nghiệm [số] năm wedding car. Đúng giờ, chuyên nghiệp, biết lộ trình backup.",
        contentEn: "Driver: [Name], [Phone], [number] years wedding car experience. Punctual, professional, knows backup routes.",
        category: "transportation",
        required: true
      },
      {
        id: "transport-insurance",
        titleVi: "Bảo hiểm xe và hành khách",
        titleEn: "Vehicle and Passenger Insurance",
        contentVi: "Xe có bảo hiểm bắt buộc + bảo hiểm hành khách. Driver có license và training.",
        contentEn: "Vehicle has mandatory insurance + passenger insurance. Driver has license and training.",
        category: "transportation",
        required: true
      },
      {
        id: "transport-wait-time",
        titleVi: "Thời gian chờ",
        titleEn: "Waiting Time",
        contentVi: "Inclusive [số] tiếng chờ tại mỗi pickup point. Extra waiting tính [số tiền]/giờ. Max total waiting [số] tiếng.",
        contentEn: "Includes [number] hours waiting at each pickup point. Extra waiting charged at [amount]/hour. Max total waiting [number] hours.",
        category: "transportation",
        required: true
      },
      {
        id: "transport-cancellation-weather",
        titleVi: "Hủy do thời tiết",
        titleEn: "Weather Cancellation",
        contentVi: "Nếu weather condition严重 (mưa bão, bão lũ), có thể postpone hoặc cancel. Refund prorated cho unused portion.",
        contentEn: "If severe weather conditions (storms, floods), may postpone or cancel. Refund prorated for unused portion.",
        category: "transportation",
        required: true
      }
    ],
    paymentTermsVi: "Đặt cọc 50% khi ký, 50% vào ngày wedding",
    paymentTermsEn: "50% deposit at signing, 50% on wedding day",
    cancellationPolicyVi: "Hủy trước 7 ngày: hoàn 60% | Trong 7 ngày: hoàn 30% | Ngày wedding: không hoàn",
    cancellationPolicyEn: "Cancel 7+ days: 60% refund | Within 7 days: 30% refund | Wedding day: no refund"
  },

  // === WEDDING CAKE CONTRACT ===
  {
    id: "cake-template",
    category: "cake",
    categoryVi: "Bánh kem cưới",
    categoryEn: "Wedding Cake",
    descriptionVi: "Mẫu hợp đồng bánh cưới với các điều khoản về kích thước, hương vị, thiết kế và delivery.",
    descriptionEn: "Wedding cake contract with terms on size, flavor, design, and delivery.",
    clauses: [
      {
        id: "cake-specifications",
        titleVi: "Thông số bánh",
        titleEn: "Cake Specifications",
        contentVi: "Bánh [số tầng], total servings [số người]. Base size: [kích thước]. Height: [cm]. Flavor per tier: [list flavors]. Filling: [list fillings].",
        contentEn: "Cake [number] tiers, total servings [number people]. Base size: [size]. Height: [cm]. Flavor per tier: [list flavors]. Filling: [list fillings].",
        category: "cake",
        required: true
      },
      {
        id: "cake-design-theme",
        titleVi: "Thiết kế và theme",
        titleEn: "Design and Theme",
        contentVi: "Design style: [rustic, modern, traditional, floral, etc.]. Color theme: [màu]. Decorations: [fresh flowers, sugar flowers, fondant details, etc.]. Cake topper: [có/kông, loại].",
        contentEn: "Design style: [rustic, modern, traditional, floral, etc.]. Color theme: [color]. Decorations: [fresh flowers, sugar flowers, fondant details, etc.]. Cake topper: [yes/no, type].",
        category: "cake",
        required: true
      },
      {
        id: "cake-dietary-options",
        titleVi: "Tùy chọn diet",
        titleEn: "Dietary Options",
        contentVi: "Options available: [less sugar, egg-free, gluten-free, nut-free, vegan]. Phải request trước [số] ngày. Extra charge cho special dietary.",
        contentEn: "Options available: [less sugar, egg-free, gluten-free, nut-free, vegan]. Must request [number] days prior. Extra charge for special dietary.",
        category: "cake",
        required: false
      },
      {
        id: "cake-delivery-setup",
        titleVi: "Delivery và setup",
        titleEn: "Delivery and Setup",
        contentVi: "Free delivery within [số] km radius. Delivery time: [giờ] trước tiệc. Setup included: place on cake table, add topper, final touches.",
        contentEn: "Free delivery within [number] km radius. Delivery time: [time] before event. Setup included: place on cake table, add topper, final touches.",
        category: "cake",
        required: true
      },
      {
        id: "cake-freshness-storage",
        titleVi: "Độ tươi và bảo quản",
        titleEn: "Freshness and Storage",
        contentVi: "Bánh được làm trong [số] tiếng trước delivery. Bánh cream giữ tươi tốt nhất ở room temperature 2-3 days hoặc fridge 5-7 days.",
        contentEn: "Cake made within [number] hours before delivery. Cream cake best kept at room temperature 2-3 days or fridge 5-7 days.",
        category: "cake",
        required: true
      },
      {
        id: "cake-topper-stand",
        titleVi: "Cake topper và stand",
        titleEn: "Cake Topper and Stand",
        contentVi: "Cake topper: [brick cao cấp hoặc Bride & Groom figurine]. Cake stand: [included/extra rental] - loại [glass, acrylic, wooden].",
        contentEn: "Cake topper: [premium brick or Bride & Groom figurine]. Cake stand: [included/extra rental] - type [glass, acrylic, wooden].",
        category: "cake",
        required: false
      },
      {
        id: "cake-leftovers-policy",
        titleVi: "Chính sách phần còn lại",
        titleEn: "Leftovers Policy",
        contentVi: "Bánh còn lại sau tiệc bride & groom có thể mang về. Không refund cho portion không ăn hết.",
        contentEn: "Remaining cake after event bride & groom may take home. No refund for uneaten portions.",
        category: "cake",
        required: true
      }
    ],
    paymentTermsVi: "Đặt cọc 50% khi ký, 50% vào ngày delivery",
    paymentTermsEn: "50% deposit at signing, 50% on delivery day",
    cancellationPolicyVi: "Hủy trước 14 ngày: hoàn 50% | Trước 7 ngày: hoàn 20% | Trong 7 ngày: không hoàn",
    cancellationPolicyEn: "Cancel 14+ days: 50% refund | 7+ days: 20% refund | Within 7 days: no refund"
  }
];

export function getContractTemplate(category: string): ContractTemplate | undefined {
  return CONTRACT_TEMPLATES.find(t => t.category === category);
}

export function getContractTemplateById(id: string): ContractTemplate | undefined {
  return CONTRACT_TEMPLATES.find(t => t.id === id);
}

export function getAllContractCategories(): Array<{ category: string; categoryVi: string; categoryEn: string }> {
  return CONTRACT_TEMPLATES.map(t => ({
    category: t.category,
    categoryVi: t.categoryVi,
    categoryEn: t.categoryEn
  }));
}
