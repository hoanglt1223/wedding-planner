// Vendor discovery recommendations and tips for Vietnamese weddings
// Budget ranges are in VND and represent typical market rates

export interface VendorDiscoveryCategory {
  id: string;
  icon: string;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  descriptionEn: string;
  budgetRange: {
    low: number;
    high: number;
  };
  essentialQuestions: {
    vi: string[];
    en: string[];
  };
  redFlags: {
    vi: string[];
    en: string[];
  };
  tips: {
    vi: string[];
    en: string[];
  };
  regionalNotes?: {
    north?: string;
    central?: string;
    south?: string;
  };
}

export const VENDOR_DISCOVERY_CATEGORIES: VendorDiscoveryCategory[] = [
  {
    id: "photography",
    icon: "📷",
    nameVi: "Nhiếp ảnh gia",
    nameEn: "Photographer",
    descriptionVi: "Chụp ảnh cưới, ảnh phóng sự, ảnh trang trí",
    descriptionEn: "Wedding photography, candid shots, formal portraits",
    budgetRange: { low: 5000000, high: 25000000 },
    essentialQuestions: {
      vi: [
        "Bạn đã bao nhiêu năm kinh nghiệm chụp ảnh cưới?",
        "Gói chụp bao nhiêu giờ? Có thêm giờ không?",
        "Bạn có trợ lý không? Có nhiêu摄影师 cùng lúc?",
        "File gốc bao giờ giao? Quy cách file ảnh?",
        "Có bao phủ hậu kỳ (retouch) không? Bao nhiêu ảnh?",
      ],
      en: [
        "How many years of wedding photography experience do you have?",
        "How many hours of coverage? Can I add extra hours?",
        "Do you have assistants? How many photographers shoot simultaneously?",
        "When do I receive raw files? What's the file format?",
        "Is post-processing (retouching) included? How many edited photos?",
      ],
    },
    redFlags: {
      vi: [
        "Không xem được album ảnh full trước khi đặt",
        "Giá quá thấp so với thị trường (có thể rởm)",
        "Không có hợp đồng rõ ràng",
        "Cam kết quá nhiều nhưng không văn bản",
        "Không cho phép thay thế摄影师 nếu ốm",
      ],
      en: [
        "Can't see full wedding albums before booking",
        "Price too good to be true (may be unreliable)",
        "No clear contract provided",
        "Too many promises but nothing in writing",
        "No backup photographer if they get sick",
      ],
    },
    tips: {
      vi: [
        "Xem ít nhất 3 album đầy đủ (không chỉ ảnh chọn)",
        "Kiểm tra phong cách chỉnh sửa màu sắc",
        "Hỏi về chính sách thời tiết xấu",
        "Yêu cầu danh sách shots quan trọng",
        "Book sớm - tốt photographer đặt trước 6-12 tháng",
      ],
      en: [
        "Review at least 3 complete albums (not just highlight shots)",
        "Check editing style and color grading preferences",
        "Ask about bad weather policies",
        "Request a must-have shot list",
        "Book early - top photographers book 6-12 months ahead",
      ],
    },
    regionalNotes: {
      north: "Ở Hà Nội và các tỉnh phía Bắc, giá thường cao hơn 15-20%. Nhiều studio nổi tiếng ở Cầu Giấy, Tây Hồ.",
      central: "Huế và Đà Nẵng có nhiều photographer giỏi với phong cách nghệ thuật, giá phải chăng hơn Hà Nội.",
      south: "TP.HCM thị trường sôi động nhất, nhiều lựa chọn phong cách từ hiện đại đến cổ điển.",
    },
  },
  {
    id: "makeup",
    icon: "💄",
    nameVi: "Trang điểm",
    nameEn: "Makeup Artist",
    descriptionVi: "Makeup cô dâu, mẹ cô dâu, bridesmaids",
    descriptionEn: "Bridal makeup, mother of bride, bridesmaids",
    budgetRange: { low: 2000000, high: 8000000 },
    essentialQuestions: {
      vi: [
        "Sử dụng loại mỹ phẩm gì? Thương hiệu nào?",
        "Makeup bao nhiêu looks? Có trial không?",
        "Có gói makeup cho người nhà không?",
        "Có đi kèm trang phục không?",
        "Chính sách nếu không hợp phong cách?",
      ],
      en: [
        "What makeup brands do you use?",
        "How many makeup looks included? Is trial included?",
        "Do you offer family makeup packages?",
        "Do you provide outfit accessories?",
        "What if I don't like the makeup style?",
      ],
    },
    redFlags: {
      vi: [
        "Không cho trial makeup (rất quan trọng)",
        "Sử dụng mỹ phẩm không rõ nguồn gốc",
        "Không có portfolio ảnh thật",
        "Cam kết makeup waterproof nhưng không test",
        "Giá quá rẻ - dùng makeup kém chất lượng",
      ],
      en: [
        "No makeup trial offered (very important)",
        "Using unknown/low-quality makeup brands",
        "No real photo portfolio",
        "Promises waterproof but no demonstration",
        "Price too cheap - likely low-quality makeup",
      ],
    },
    tips: {
      vi: [
        "Bắt buộc thử makeup trước ngày cưới",
        "Mang ảnh makeup style mong muốn",
        "Test makeup waterproof (mồ hôi, nước mắt)",
        "Hỏi về chính sách sửa makeup trong ngày",
        "Book makeup artist riêng cho mẹ và bridesmaids",
      ],
      en: [
        "Mandatory trial before wedding day",
        "Bring photos of desired makeup style",
        "Test waterproof (sweat, tears proof)",
        "Ask about touch-up policy during the day",
        "Book separate MUA for mother and bridesmaids",
      ],
    },
    regionalNotes: {
      north: "Hà Nội có nhiều makeup artist nổi tiếng, giá trial từ 500k-1tr. Phong cách thường thiên về natural nhẹ nhàng.",
      central: "Huế, Đà Nẵng giá phải chăng hơn, nhiều MUA trẻ năng động.",
      south: "TP.HCM phong cách đa dạng từ nude Hàn Quốc đến glam style đậm chất thính.",
    },
  },
  {
    id: "venue",
    icon: "🏛️",
    nameVi: "Địa điểm tổ chức",
    nameEn: "Wedding Venue",
    descriptionVi: "Nhà hàng, trung tâm tiệc, resort, homestay",
    descriptionEn: "Restaurants, banquet halls, resorts, homestays",
    budgetRange: { low: 10000000, high: 100000000 },
    essentialQuestions: {
      vi: [
        "Giá tiệc tính theo bàn hay theo người?",
        "Có menu món ăn Việt/Korean/International?",
        "Có chiết khấu nếu đặt nhiều bàn không?",
        "Bao gồm âm thanh, ánh sáng, máy lạnh không?",
        "Chính sách đặt cọc và hoàn tiền?",
      ],
      en: [
        "Pricing per table or per person?",
        "Do you have Vietnamese/Korean/International menus?",
        "Discount for large bookings?",
        "Is sound system, lighting, AC included?",
        "Deposit and cancellation policy?",
      ],
    },
    redFlags: {
      vi: [
        "Không cho xem menu chi tiết",
        "Không có hợp đồng đặt tiệc rõ ràng",
        "Ẩn phí phụ thu (phục vụ, âm thanh, etc)",
        "Cam kết không gian nhưng không cam kết bàn",
        "Không có giải pháp dự phòng thời tiết xấu",
      ],
      en: [
        "Won't show detailed menu",
        "No clear banquet contract",
        "Hidden fees (service, sound system, etc)",
        "Promises venue but not guaranteed table count",
        "No backup plan for bad weather",
      ],
    },
    tips: {
      vi: [
        "Thử đồ ăn tại nhà hàng trước khi đặt",
        "Kiểm tra sức chứa và không gian park xe",
        "Hỏi về decorator có sẵn hay phải thuê ngoài",
        "Địa điểm outdoor cần có plan B trời mưa",
        "Book cuối tuần - tốt venue đặt trước 8-12 tháng",
      ],
      en: [
        "Taste the food before booking",
        "Check capacity and parking availability",
        "Ask if decorator is in-house or external",
        "Outdoor venues need rain backup plan",
        "Book weekends - top venues book 8-12 months ahead",
      ],
    },
    regionalNotes: {
      north: "Hà Nội nhiều lựa chọn từ 3-5 sao. Nhà hàng khu vực Cầu Giấy, Tây Hồ giá cao hơn ngoại ô.",
      central: "Huế nổi tiếng với tiệc garden phong cách cổ. Đà Nẵng có nhiều resort biển view đẹp.",
      south: "TP.HCM đa dạng nhất: nhà hàng Chinatown, rooftop, garden. Bình Dương, Đồng Nai giá tốt hơn.",
    },
  },
  {
    id: "mc",
    icon: "🎤",
    nameVi: "MC dẫn chương trình",
    nameEn: "MC/Host",
    descriptionVi: "MC dẫn chương trình, điều phối sân khấu",
    descriptionEn: "Wedding MC, stage host, program coordinator",
    budgetRange: { low: 2000000, high: 10000000 },
    essentialQuestions: {
      vi: [
        "Bạn MC bao nhiêu đám cưới rồi?",
        "Chương trình bao gồm những phần nào?",
        "Có điều phối games/minigames không?",
        "Phong cách dẫn: hài hước hay trang trọng?",
        "Có MC backup nếu ốm không?",
      ],
      en: [
        "How many weddings have you MC'd?",
        "What's included in the program?",
        "Do you coordinate games/minigames?",
        "Style: humorous or formal?",
        "Is there a backup MC if you're sick?",
      ],
    },
    redFlags: {
      vi: [
        "Không xem được video MC trực tiếp",
        "Chỉ có video đã edit (thể hiện không rõ)",
        "Không có kịch bản chi tiết chương trình",
        "Cam kết quá nhiều nhưng không hợp đồng",
        "Giá quá rẻ so với thị trường",
      ],
      en: [
        "Can't see live MC videos",
        "Only edited videos (doesn't show real performance)",
        "No detailed program script",
        "Too many promises but no contract",
        "Price too cheap compared to market",
      ],
    },
    tips: {
      vi: [
        "Xem video live MC (không video edit)",
        "Trả tiền cọc để giữ ngày - MC hot đặt sớm",
        "Hỏi về trang phục, micro, thiết bị",
        "Chia sẻ timeline chương trình trước",
        "MC giỏi biết điều phối, không chỉ nói",
      ],
      en: [
        "Watch live MC videos (not edited)",
        "Pay deposit to secure date - hot MCs book early",
        "Ask about outfit, microphone, equipment",
        "Share program timeline beforehand",
        "Good MC coordinates, not just speaks",
      ],
    },
  },
  {
    id: "decor",
    icon: "🎨",
    nameVi: "Trang trí tiệc cưới",
    nameEn: "Wedding Decorator",
    descriptionVi: "Decor sân khấu, cổ chào, bàn gallery, backdrop",
    descriptionEn: "Stage decor, welcome arch, gallery tables, backdrop",
    budgetRange: { low: 5000000, high: 30000000 },
    essentialQuestions: {
      vi: [
        "Gói decor bao gồm những items gì?",
        "Bạn setup hay tôi phải setup?",
        "Có bao gồm dọn dẹp sau tiệc không?",
        "Decor bao lâu trước khi tiệc bắt đầu?",
        "Có gói decor theo phong cách tôi muốn không?",
      ],
      en: [
        "What decor items are included?",
        "Do you set up or do I set up?",
        "Is cleanup after the event included?",
        "How long before the event do you set up?",
        "Can you customize to my preferred style?",
      ],
    },
    redFlags: {
      vi: [
        "Không có portfolio ảnh thật",
        "Không nói rõ thời gian setup/dismantle",
        "Giá không bao gồm setup/dismantle",
        "Decor mẫu khác hoàn toàn với thực tế",
        "Không cam kết hoàn tiền nếu hủy",
      ],
      en: [
        "No real photo portfolio",
        "No clear setup/dismantle time stated",
        "Price doesn't include setup/dismantle",
        "Sample decor looks completely different from reality",
        "No refund commitment if cancelled",
      ],
    },
    tips: {
      vi: [
        "Xem album ảnh thật (không phải render)",
        "Kiểm tra đồ decor - mới hay cũ",
        "Hỏi về chính sách hủy/complaint",
        "Yêu cầu danh sách chi tiết items",
        "Site visit tại địa điểm tiệc trước",
      ],
      en: [
        "Review real photo albums (not renders)",
        "Check decor condition - new or used",
        "Ask about cancellation/complaint policy",
        "Request detailed item list",
        "Site visit at venue beforehand",
      ],
    },
  },
  {
    id: "flower",
    icon: "💐",
    nameVi: "Hoa cưới",
    nameEn: "Florist",
    descriptionVi: "Hoa cô dâu, hoa chú rể, hoa cài áo, hoa bàn",
    descriptionEn: "Bridal bouquet, groom boutonniere, corsages, table flowers",
    budgetRange: { low: 2000000, high: 10000000 },
    essentialQuestions: {
      vi: [
        "Sử dụng hoa tươi hay hoa giả?",
        "Bouquet bao gồm bao nhiêu bông? Loài hoa gì?",
        "Hoa bàn: bao nhiêu bàn? Mỗi bàn bao nhiêu?",
        "Có gói combo tiết kiệm không?",
        "Hoa có thể giữ được bao lâu?",
      ],
      en: [
        "Fresh flowers or artificial?",
        "How many flowers in bouquet? What types?",
        "Table flowers: how many tables? How many each?",
        "Is there a budget combo package?",
        "How long do flowers stay fresh?",
      ],
    },
    redFlags: {
      vi: [
        "Không cam kết loại hoa cụ thể",
        "Giá quá rẻ - dùng hoa kém chất lượng",
        "Không có portfolio ảnh thật",
        "Không nói rõ chính sách nếu hoa hư",
        "Không có cam kết thời gian giao hoa",
      ],
      en: [
        "No commitment on specific flower types",
        "Price too cheap - low-quality flowers",
        "No real photo portfolio",
        "No clear policy if flowers wilt",
        "No delivery time commitment",
      ],
    },
    tips: {
      vi: [
        "Chọn hoa theo mùa - giá tốt hơn",
        "Hoa tươi cần giao gần giờ tiệc nhất",
        "Mang mẫu hoa if possible",
        "Book trước - florist hot đặt sớm",
        "Hỏi về bảo quản hoa trong ngày",
      ],
      en: [
        "Choose seasonal flowers - better price",
        "Fresh flowers should arrive close to event time",
        "Bring flower sample if possible",
        "Book early - hot florists book early",
        "Ask about flower preservation during the day",
      ],
    },
  },
  {
    id: "video",
    icon: "🎬",
    nameVi: "Quay dựng video",
    nameEn: "Videographer",
    descriptionVi: "Quay phóng sự video cưới, highlight reel",
    descriptionEn: "Wedding videography, highlight reel, full ceremony",
    budgetRange: { low: 5000000, high: 25000000 },
    essentialQuestions: {
      vi: [
        "Video full ceremony hay highlight reel?",
        "Bao nhiêu cameraman quay?",
        "Giao video bao lâu sau đám cưới?",
        "Quy cách file video? Có music không?",
        "Có drone footage không?",
      ],
      en: [
        "Full ceremony or highlight reel?",
        "How many cameramen shoot?",
        "How long after wedding do I receive video?",
        "Video file format? Is music included?",
        "Is drone footage included?",
      ],
    },
    redFlags: {
      vi: [
        "Không xem được video sample",
        "Thời gian giao quá lâu (hơn 3 tháng)",
        "Không có cam kết về file gốc",
        "Giá quá rẻ - quality kém",
        "Không có hợp đồng rõ ràng",
      ],
      en: [
        "Can't see video samples",
        "Delivery too long (over 3 months)",
        "No commitment on raw files",
        "Price too cheap - poor quality",
        "No clear contract",
      ],
    },
    tips: {
      vi: [
        "Xem sample video full không phải highlight",
        "Hỏi về music licensing (copyright)",
        "Yêu cầu timeline phân cảnh",
        "Discuss style: cinematic vs documentary",
        "Book early - videographer hot đặt 6-12 tháng",
      ],
      en: [
        "Watch full video samples not just highlights",
        "Ask about music licensing (copyright)",
        "Request shot timeline",
        "Discuss style: cinematic vs documentary",
        "Book early - hot videographers book 6-12 months",
      ],
    },
  },
  {
    id: "attire",
    icon: "👗",
    nameVi: "Trang phục cô dâu chú rể",
    nameEn: "Bridal Attire",
    descriptionVi: "Váy cưới, vest cô dâu chú rể, trang phục traditional",
    descriptionEn: "Wedding dress, groom suit, traditional attire",
    budgetRange: { low: 5000000, high: 30000000 },
    essentialQuestions: {
      vi: [
        "Thuê hay mua? Giá bao nhiêu?",
        "Có bao gồm alteration không?",
        "Có bao nhiêu set vest/váy?",
        "Chính sách nếu trang phục không vừa?",
        "Có bao gồm giày, phụ kiện không?",
      ],
      en: [
        "Rent or buy? What's the price?",
        "Are alterations included?",
        "How many dress/suit sets included?",
        "Policy if outfit doesn't fit?",
        "Are shoes and accessories included?",
      ],
    },
    redFlags: {
      vi: [
        "Không cho thử đồ trước khi thuê",
        "Không cam kết size khi thuê",
        "Đồ cũ nhưng không nói rõ",
        "Phí alteration quá cao",
        "Không có chính sách bảo quản",
      ],
      en: [
        "Can't try on before renting",
        "No size commitment when renting",
        "Used clothes but not clearly stated",
        "Alteration fee too high",
        "No care policy provided",
      ],
    },
    tips: {
      vi: [
        "Bắt buộc thử đồ trước khi thuê",
        "Check đồ trước khi nhận - có hư hỏng không",
        "Hỏi về chính sách dirty/clean fee",
        "Yêu cầu timeline giao đồ",
        "Backup plan nếu size thay đổi",
      ],
      en: [
        "Mandatory try-on before renting",
        "Check clothes upon receipt for damage",
        "Ask about dirty/clean fee policy",
        "Request delivery timeline",
        "Backup plan if size changes",
      ],
    },
  },
  {
    id: "cake",
    icon: "🎂",
    nameVi: "Bánh cưới",
    nameEn: "Wedding Cake",
    descriptionVi: "Bánh cưới tầng, bánh cắt ngọt, cupcakes",
    descriptionEn: "Wedding tier cake, cutting cake, cupcakes",
    budgetRange: { low: 1000000, high: 8000000 },
    essentialQuestions: {
      vi: [
        "Bánh mấy tầng? Bao nhiêu serving?",
        "Flavor có thể chọn không?",
        "Bao gồm setup stand không?",
        "Có bao gồm cutter serving không?",
        "Bánh có thể delivery không?",
      ],
      en: [
        "How many tiers? How many servings?",
        "Can I choose flavors?",
        "Is stand setup included?",
        "Are cutter and serving included?",
        "Can cake be delivered?",
      ],
    },
    redFlags: {
      vi: [
        "Không có sample để thử flavor",
        "Không cam kết thời gian delivery",
        "Giá quá rẻ - quality kém",
        "Không có chính sách nếu bánh hư",
        "Setup stand không included (hidden fee)",
      ],
      en: [
        "No sample to try flavors",
        "No delivery time commitment",
        "Price too cheap - poor quality",
        "No policy if cake is damaged",
        "Stand setup not included (hidden fee)",
      ],
    },
    tips: {
      vi: [
        "Thử flavor trước khi đặt",
        "Yêu cầu delivery gần giờ tiệc nhất",
        "Chọn flavor universal (vanilla, chocolate)",
        "Check stand rental fee",
        "Hỏi về bảo quản bánh",
      ],
      en: [
        "Taste flavors before ordering",
        "Request delivery close to event time",
        "Choose universal flavors (vanilla, chocolate)",
        "Check stand rental fee",
        "Ask about cake preservation",
      ],
    },
  },
];

export function getVendorDiscoveryCategory(id: string): VendorDiscoveryCategory | undefined {
  return VENDOR_DISCOVERY_CATEGORIES.find((cat) => cat.id === id);
}

export function getBudgetRangeText(range: { low: number; high: number }, lang: "vi" | "en"): string {
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (lang === "vi") {
    return `${formatVND(range.low)} - ${formatVND(range.high)}`;
  } else {
    return `${formatVND(range.low)} - ${formatVND(range.high)}`;
  }
}
