type Lang = "vi" | "en";

export const TRANSLATIONS: Record<string, Record<Lang, string>> = {
  // Nav labels
  "💒 Kế Hoạch": { vi: "💒 Kế Hoạch", en: "💒 Planning" },
  "🔮 Tử Vi": { vi: "🔮 Tử Vi", en: "🔮 Fortune" },
  "🖼️ Thiệp": { vi: "🖼️ Thiệp", en: "🖼️ Cards" },
  "🤖 AI": { vi: "🤖 AI", en: "🤖 AI" },
  "📖 Sổ Tay": { vi: "📖 Sổ Tay", en: "📖 Handbook" },
  "💡 Ý Tưởng": { vi: "💡 Ý Tưởng", en: "💡 Ideas" },

  // Onboarding
  "Kế Hoạch Đám Cưới": { vi: "Kế Hoạch Đám Cưới", en: "Wedding Planner" },
  "Nhập thông tin cơ bản để bắt đầu lên kế hoạch 💒": { vi: "Nhập thông tin cơ bản để bắt đầu lên kế hoạch 💒", en: "Enter basic info to start planning 💒" },
  "Tên cô dâu": { vi: "Tên cô dâu", en: "Bride's name" },
  "Tên chú rể": { vi: "Tên chú rể", en: "Groom's name" },
  "Họ nhà gái": { vi: "Họ nhà gái", en: "Bride's family name" },
  "Họ nhà trai": { vi: "Họ nhà trai", en: "Groom's family name" },
  "Ngày cưới (tùy chọn)": { vi: "Ngày cưới (tùy chọn)", en: "Wedding date (optional)" },
  "Ngày đám hỏi": { vi: "Ngày đám hỏi", en: "Betrothal date" },
  "Ngày dạm ngõ": { vi: "Ngày dạm ngõ", en: "Engagement date" },
  "Tiếp Tục →": { vi: "Tiếp Tục →", en: "Continue →" },
  "Bắt Đầu Lên Kế Hoạch! 🎉": { vi: "Bắt Đầu Lên Kế Hoạch! 🎉", en: "Start Planning! 🎉" },
  "Xem thử với dữ liệu mẫu →": { vi: "Xem thử với dữ liệu mẫu →", en: "Try with sample data →" },
  "Nghi Lễ Cưới 8 Bước": { vi: "Nghi Lễ Cưới 8 Bước", en: "8-Step Wedding Ceremony" },
  "← Quay Lại": { vi: "← Quay Lại", en: "← Go Back" },

  // Budget panel
  "💰 Ngân Sách": { vi: "💰 Ngân Sách", en: "💰 Budget" },
  "Thiết lập ngân sách cưới": { vi: "Thiết lập ngân sách cưới", en: "Set wedding budget" },
  "Chọn mức ngân sách:": { vi: "Chọn mức ngân sách:", en: "Choose budget level:" },
  "Hoặc nhập tùy chỉnh:": { vi: "Hoặc nhập tùy chỉnh:", en: "Or enter custom:" },
  "Tổng:": { vi: "Tổng:", en: "Total:" },
  "Còn:": { vi: "Còn:", en: "Remaining:" },
  "Đã chi:": { vi: "Đã chi:", en: "Spent:" },
  "Dự toán": { vi: "Dự toán", en: "Estimate" },
  "Thực chi": { vi: "Thực chi", en: "Actual" },
  "Nhập số tiền đã chi...": { vi: "Nhập số tiền đã chi...", en: "Enter amount spent..." },

  // Guest panel
  "👥 Khách Mời": { vi: "👥 Khách Mời", en: "👥 Guests" },
  "Trai:": { vi: "Trai:", en: "Groom:" },
  "Gái:": { vi: "Gái:", en: "Bride:" },
  "Họ tên": { vi: "Họ tên", en: "Full name" },
  "SĐT": { vi: "SĐT", en: "Phone" },
  "📋 Danh sách": { vi: "📋 Danh sách", en: "📋 List" },
  "🪑 Sơ đồ bàn": { vi: "🪑 Sơ đồ bàn", en: "🪑 Seating" },
  "Thêm": { vi: "Thêm", en: "Add" },
  "Xóa tất cả?": { vi: "Xóa tất cả?", en: "Delete all?" },
  "Xóa": { vi: "Xóa", en: "Delete" },
  "Xóa dữ liệu": { vi: "Xóa dữ liệu", en: "Reset data" },
  "Xác nhận xóa?": { vi: "Xác nhận xóa?", en: "Confirm reset?" },
  "Tổng khách:": { vi: "Tổng khách:", en: "Total guests:" },
  "Nhập CSV": { vi: "Nhập CSV", en: "Import CSV" },
  "Xuất CSV": { vi: "Xuất CSV", en: "Export CSV" },
  "Chưa có khách mời": { vi: "Chưa có khách mời", en: "No guests yet" },
  "bàn/nhóm": { vi: "bàn/nhóm", en: "table/group" },
  "khách": { vi: "khách", en: "guests" },
  "❓ Chưa xếp bàn": { vi: "❓ Chưa xếp bàn", en: "❓ Not assigned" },
  "người": { vi: "người", en: "people" },

  // AI panel
  "🤖 AI Hỗ Trợ": { vi: "🤖 AI Hỗ Trợ", en: "🤖 AI Assistant" },
  "⚡ Gợi Ý Nhanh": { vi: "⚡ Gợi Ý Nhanh", en: "⚡ Quick Suggestions" },
  "✍️ Hỏi Tùy Chỉnh": { vi: "✍️ Hỏi Tùy Chỉnh", en: "✍️ Custom Question" },
  "Nhập câu hỏi...": { vi: "Nhập câu hỏi...", en: "Type your question..." },
  "🚀 Gửi": { vi: "🚀 Gửi", en: "🚀 Send" },
  "⏳ Đang xử lý...": { vi: "⏳ Đang xử lý...", en: "⏳ Processing..." },
  "❌ Đã xảy ra lỗi": { vi: "❌ Đã xảy ra lỗi", en: "❌ An error occurred" },

  // Print / Handbook
  "SỔ TAY ĐÁM CƯỚI": { vi: "SỔ TAY ĐÁM CƯỚI", en: "WEDDING HANDBOOK" },
  "Sổ Tay In": { vi: "Sổ Tay In", en: "Print Handbook" },
  "In Sổ Tay": { vi: "In Sổ Tay", en: "Print Handbook" },
  "Ý nghĩa": { vi: "Ý nghĩa", en: "Meaning" },
  "BẮT BUỘC": { vi: "BẮT BUỘC", en: "REQUIRED" },
  "TÙY CHỌN": { vi: "TÙY CHỌN", en: "OPTIONAL" },
  "tùy chọn": { vi: "tùy chọn", en: "optional" },
  "Lưu ý quan trọng": { vi: "Lưu ý quan trọng", en: "Important notes" },
  "📋 Checklist": { vi: "📋 Checklist", en: "📋 Checklist" },
  "⏰ Giờ bắt đầu:": { vi: "⏰ Giờ bắt đầu:", en: "⏰ Start time:" },

  // Astrology page
  "🔮 Tử Vi Khoa Học": { vi: "🔮 Tử Vi Khoa Học", en: "🔮 Vietnamese Astrology" },
  "Khám phá tử vi đôi bạn theo phong thủy Việt Nam": { vi: "Khám phá tử vi đôi bạn theo phong thủy Việt Nam", en: "Explore your couple's astrology based on Vietnamese feng shui" },
  "💑 Hợp Tuổi": { vi: "💑 Hợp Tuổi", en: "💑 Compatibility" },
  "🐲 Con Giáp": { vi: "🐲 Con Giáp", en: "🐲 Zodiac" },
  "🔥 Ngũ Hành": { vi: "🔥 Ngũ Hành", en: "🔥 Elements" },
  "📅 Tử Vi 2026": { vi: "📅 Tử Vi 2026", en: "📅 Fortune 2026" },
  "🤖 AI Tử Vi": { vi: "🤖 AI Tử Vi", en: "🤖 AI Reading" },

  // Event timeline
  "🎬 Lịch Trình Sự Kiện": { vi: "🎬 Lịch Trình Sự Kiện", en: "🎬 Event Timeline" },
  "Đã qua": { vi: "Đã qua", en: "Passed" },
  "Hôm nay!": { vi: "Hôm nay!", en: "Today!" },
  "ngày nữa": { vi: "ngày nữa", en: "days left" },

  // Landing
  "Hoàn Hảo": { vi: "Hoàn Hảo", en: "Perfectly" },
  "Miễn phí 100%": { vi: "Miễn phí 100%", en: "100% Free" },
  "Bắt Đầu Ngay →": { vi: "Bắt Đầu Ngay →", en: "Get Started →" },
  "Bắt Đầu Lên Kế Hoạch": { vi: "Bắt Đầu Lên Kế Hoạch", en: "Start Planning" },

  // Cards
  "🖼️ Background & 💌 Thiệp Mời": { vi: "🖼️ Background & 💌 Thiệp Mời", en: "🖼️ Background & 💌 Invitations" },
  "📱 RSVP": { vi: "📱 RSVP", en: "📱 RSVP" },
  "Chúc mừng! 🎊": { vi: "Chúc mừng! 🎊", en: "Congratulations! 🎊" },

  // Vendor panel
  "🗺️ Danh Sách Vendor": { vi: "🗺️ Danh Sách Vendor", en: "🗺️ Vendor List" },
  "Tên vendor": { vi: "Tên vendor", en: "Vendor name" },
  "Địa chỉ": { vi: "Địa chỉ", en: "Address" },
  "Ghi chú": { vi: "Ghi chú", en: "Note" },

  // Notes panel
  "📝 Ghi Chú Chung": { vi: "📝 Ghi Chú Chung", en: "📝 General Notes" },
  "Ghi chú cho ngày cưới...": { vi: "Ghi chú cho ngày cưới...", en: "Notes for the wedding day..." },

  // Ideas panel
  "💡 Tính Năng & Ý Tưởng": { vi: "💡 Tính Năng & Ý Tưởng", en: "💡 Features & Ideas" },
  "📜 Lưu Trữ Dữ Liệu": { vi: "📜 Lưu Trữ Dữ Liệu", en: "📜 Data Storage" },
  "Đã hoàn thành": { vi: "Đã hoàn thành", en: "Completed" },
  "Sắp tới": { vi: "Sắp tới", en: "Upcoming" },
  "Tương lai": { vi: "Tương lai", en: "Future" },

  // Shared preview
  "Link Đã Hết Hạn": { vi: "Link Đã Hết Hạn", en: "Link Expired" },
  "Đang tải...": { vi: "Đang tải...", en: "Loading..." },

  // Header countdown
  "Chúc mừng đám cưới! 🎊": { vi: "Chúc mừng đám cưới! 🎊", en: "Happy wedding day! 🎊" },

  // Step panel
  "🤖 Hỏi AI": { vi: "🤖 Hỏi AI", en: "🤖 Ask AI" },
  "📝 Lưu ý quan trọng": { vi: "📝 Lưu ý quan trọng", en: "📝 Important notes" },

  // Stats grid
  "Bước": { vi: "Bước", en: "Steps" },
  "Xong": { vi: "Xong", en: "Done" },
  "Tiến độ": { vi: "Tiến độ", en: "Progress" },

  // Tab navigation - extra tabs
  "💰 Chi Phí": { vi: "💰 Chi Phí", en: "💰 Budget" },
  "📝 Ghi Chú": { vi: "📝 Ghi Chú", en: "📝 Notes" },
  "🗺️ Vendor": { vi: "🗺️ Vendor", en: "🗺️ Vendors" },

  // Guest panel extras
  "Nhóm/Bàn": { vi: "Nhóm/Bàn", en: "Table/Group" },
  "🔍 Tìm kiếm...": { vi: "🔍 Tìm kiếm...", en: "🔍 Search..." },

  // Vendor categories
  "🏛️ Nhà hàng": { vi: "🏛️ Nhà hàng", en: "🏛️ Restaurant" },
  "📸 Ảnh/Video": { vi: "📸 Ảnh/Video", en: "📸 Photo/Video" },
  "🌸 Trang trí": { vi: "🌸 Trang trí", en: "🌸 Decoration" },
  "💄 Makeup": { vi: "💄 Makeup", en: "💄 Makeup" },
  "🎵 MC/Nhạc": { vi: "🎵 MC/Nhạc", en: "🎵 MC/Music" },
  "🚗 Xe": { vi: "🚗 Xe", en: "🚗 Transport" },
  "💐 Hoa": { vi: "💐 Hoa", en: "💐 Flowers" },
  "👗 Trang phục": { vi: "👗 Trang phục", en: "👗 Attire" },
  "📦 Khác": { vi: "📦 Khác", en: "📦 Other" },

  // Print/Handbook extras
  "Lịch trình chi tiết:": { vi: "Lịch trình chi tiết:", en: "Detailed schedule:" },
  "Giờ": { vi: "Giờ", en: "Time" },
  "Hoạt động": { vi: "Hoạt động", en: "Activity" },
  "Phụ trách": { vi: "Phụ trách", en: "Person" },
  "Lễ vật:": { vi: "Lễ vật:", en: "Offerings:" },
  "🎁 Lễ Vật": { vi: "🎁 Lễ Vật", en: "🎁 Offerings" },
  "Tên": { vi: "Tên", en: "Name" },
  "SL": { vi: "SL", en: "Qty" },
  "Giá": { vi: "Giá", en: "Price" },
  "Ngày cưới:": { vi: "Ngày cưới:", en: "Wedding date:" },
  "ký tự": { vi: "ký tự", en: "characters" },

  // Event names
  "Dạm Ngõ": { vi: "Dạm Ngõ", en: "First Meeting" },
  "Đám Hỏi": { vi: "Đám Hỏi", en: "Betrothal" },
  "Ngày Cưới": { vi: "Ngày Cưới", en: "Wedding Day" },
  "Tiệc Cưới": { vi: "Tiệc Cưới", en: "Wedding Reception" },

  // Astrology tabs
  "✨ Cá Nhân": { vi: "✨ Cá Nhân", en: "✨ Personal" },
  "📅 Năm Cưới": { vi: "📅 Năm Cưới", en: "📅 Wedding Year" },
  "🔍 Tuổi Hợp": { vi: "🔍 Tuổi Hợp", en: "🔍 Compatible" },
  "🧭 Phong Thủy": { vi: "🧭 Phong Thủy", en: "🧭 Feng Shui" },

  // Print extras
  "Tên chính thức:": { vi: "Tên chính thức:", en: "Formal name:" },
  "bước": { vi: "bước", en: "steps" },

  // Birth input form
  "Ngày sinh Cô dâu": { vi: "Ngày sinh Cô dâu", en: "Bride's birth date" },
  "Ngày sinh Chú rể": { vi: "Ngày sinh Chú rể", en: "Groom's birth date" },
  "Giờ sinh Cô dâu": { vi: "Giờ sinh Cô dâu", en: "Bride's birth hour" },
  "Giờ sinh Chú rể": { vi: "Giờ sinh Chú rể", en: "Groom's birth hour" },
  "Không biết": { vi: "Không biết", en: "Unknown" },
  "Đổi giới tính (nếu cần)": { vi: "Đổi giới tính (nếu cần)", en: "Change gender (if needed)" },
  "Ẩn giới tính": { vi: "Ẩn giới tính", en: "Hide gender" },
  "Giới tính Cô dâu": { vi: "Giới tính Cô dâu", en: "Bride's gender" },
  "Giới tính Chú rể": { vi: "Giới tính Chú rể", en: "Groom's gender" },
  "Nữ": { vi: "Nữ", en: "Female" },
  "Nam": { vi: "Nam", en: "Male" },

  // Shared preview
  "Tạo Kế Hoạch Của Bạn": { vi: "Tạo Kế Hoạch Của Bạn", en: "Create Your Plan" },
  "💍 Tạo Kế Hoạch Đám Cưới": { vi: "💍 Tạo Kế Hoạch Đám Cưới", en: "💍 Create Wedding Plan" },

  // Region
  "Vùng miền": { vi: "Vùng miền", en: "Region" },
  "Miền Bắc": { vi: "Miền Bắc", en: "Northern" },
  "Miền Trung": { vi: "Miền Trung", en: "Central" },
  "Miền Nam": { vi: "Miền Nam", en: "Southern" },

  // Content expansion
  "Ý nghĩa văn hóa": { vi: "Ý nghĩa văn hóa", en: "Cultural significance" },
  "Mẹo hay": { vi: "Mẹo hay", en: "Helpful tips" },
  "Sai lầm thường gặp": { vi: "Sai lầm thường gặp", en: "Common mistakes" },
  "Lễ vật truyền thống": { vi: "Lễ vật truyền thống", en: "Traditional items" },
  "Đã chuẩn bị": { vi: "Đã chuẩn bị", en: "Prepared" },
  "Nơi mua": { vi: "Nơi mua", en: "Where to buy" },
  "Mục đích": { vi: "Mục đích", en: "Purpose" },
  "Bắt buộc": { vi: "Bắt buộc", en: "Required" },
  "Không bắt buộc": { vi: "Không bắt buộc", en: "Optional" },
  "Vai trò gia đình": { vi: "Vai trò gia đình", en: "Family roles" },
  "Nghi thức & Lễ phép": { vi: "Nghi thức & Lễ phép", en: "Etiquette & Protocol" },
  "Trách nhiệm": { vi: "Trách nhiệm", en: "Responsibilities" },
  "📅 Ngày Tốt": { vi: "📅 Ngày Tốt", en: "📅 Good Dates" },
  "Hoàng Đạo": { vi: "Hoàng Đạo", en: "Auspicious" },
  "Hắc Đạo": { vi: "Hắc Đạo", en: "Inauspicious" },
  "Tam Nương": { vi: "Tam Nương", en: "Tam Nuong" },
  "Nguyệt Kỵ": { vi: "Nguyệt Kỵ", en: "Monthly taboo" },
  "Ngày tốt": { vi: "Ngày tốt", en: "Good day" },
  "Ngày xấu": { vi: "Ngày xấu", en: "Bad day" },
  "Bình thường": { vi: "Bình thường", en: "Neutral" },
  "Tương Sinh": { vi: "Tương Sinh", en: "Compatible" },
  "Tương Khắc": { vi: "Tương Khắc", en: "Conflicting" },
  "Ngũ Hành": { vi: "Ngũ Hành", en: "Five Elements" },
  "Âm lịch": { vi: "Âm lịch", en: "Lunar date" },
  "Dương lịch": { vi: "Dương lịch", en: "Solar date" },
  "Xem chi tiết": { vi: "Xem chi tiết", en: "View details" },

  // Misc
  "Lưu": { vi: "Lưu", en: "Save" },
  "Hủy": { vi: "Hủy", en: "Cancel" },
  "Đóng": { vi: "Đóng", en: "Close" },
  "Sao chép": { vi: "Sao chép", en: "Copy" },
  "Đã sao chép!": { vi: "Đã sao chép!", en: "Copied!" },
  "Chia sẻ": { vi: "Chia sẻ", en: "Share" },
  "Tải xuống": { vi: "Tải xuống", en: "Download" },

  // RSVP Guest Page
  "Xác nhận tham dự": { vi: "Xác nhận tham dự", en: "Confirm Attendance" },
  "Tham dự": { vi: "Tham dự", en: "Will Attend" },
  "Từ chối": { vi: "Từ chối", en: "Decline" },
  "Số khách đi cùng": { vi: "Số khách đi cùng", en: "Plus Ones" },
  "Chế độ ăn đặc biệt": { vi: "Chế độ ăn đặc biệt", en: "Dietary Requirements" },
  "Lời nhắn": { vi: "Lời nhắn", en: "Message" },
  "Gửi RSVP": { vi: "Gửi RSVP", en: "Submit RSVP" },
  "Đang gửi...": { vi: "Đang gửi...", en: "Submitting..." },
  "Cảm ơn bạn!": { vi: "Cảm ơn bạn!", en: "Thank You!" },
  "Chúng tôi đã nhận phản hồi của bạn": { vi: "Chúng tôi đã nhận phản hồi của bạn", en: "We've received your response" },
  "Không tìm thấy lời mời": { vi: "Không tìm thấy lời mời", en: "Invitation not found" },
  "Link không hợp lệ hoặc đã hết hạn": { vi: "Link không hợp lệ hoặc đã hết hạn", en: "Invalid or expired link" },
  "Bạn đã phản hồi rồi": { vi: "Bạn đã phản hồi rồi", en: "You've already responded" },
  "Địa điểm": { vi: "Địa điểm", en: "Venue" },
  "Thời gian": { vi: "Thời gian", en: "Date & Time" },
  "Xem bản đồ": { vi: "Xem bản đồ", en: "View Map" },
  "Câu chuyện của chúng tôi": { vi: "Câu chuyện của chúng tôi", en: "Our Story" },
  "Lời mời dành cho": { vi: "Lời mời dành cho", en: "Invitation for" },

  // RSVP Dashboard
  "📬 RSVP": { vi: "📬 RSVP", en: "📬 RSVP" },
  "Cài đặt RSVP": { vi: "Cài đặt RSVP", en: "RSVP Settings" },
  "Lời chào": { vi: "Lời chào", en: "Welcome Message" },
  "Địa điểm tiệc": { vi: "Địa điểm tiệc", en: "Venue" },
  "Link bản đồ": { vi: "Link bản đồ", en: "Map Link" },
  "Câu chuyện đôi mình": { vi: "Câu chuyện đôi mình", en: "Our Story" },
  "Tạo link RSVP": { vi: "Tạo link RSVP", en: "Generate RSVP Links" },
  "khách chưa có link": { vi: "khách chưa có link", en: "guests without links" },
  "Đã nhận": { vi: "Đã nhận", en: "Accepted" },
  "Từ chối tham dự": { vi: "Từ chối tham dự", en: "Declined" },
  "Chờ phản hồi": { vi: "Chờ phản hồi", en: "Pending" },
  "Sao chép link": { vi: "Sao chép link", en: "Copy Link" },
  "Sao chép tất cả": { vi: "Sao chép tất cả", en: "Copy All Links" },
  "Mã QR": { vi: "Mã QR", en: "QR Code" },
  "Tạo link cho": { vi: "Tạo link cho", en: "Generate links for" },
};
