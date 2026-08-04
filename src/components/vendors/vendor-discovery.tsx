import { useState } from "react";
import {
  VENDOR_DISCOVERY_CATEGORIES,
  getBudgetRangeText,
  type VendorDiscoveryCategory,
} from "@/data/vendor-discovery";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import type { Vendor } from "@/types/wedding";

type VendorDiscoveryTab = "categories" | "tips" | "checklist";

export function VendorDiscovery({
  onAddVendor,
  lang,
}: {
  onAddVendor: (vendor: Omit<Vendor, "id">) => void;
  lang: "vi" | "en";
}) {
  const store = useWeddingStoreContext();
  const { state } = store;
  const [selectedCategory, setSelectedCategory] = useState<VendorDiscoveryCategory | null>(
    VENDOR_DISCOVERY_CATEGORIES[0] || null
  );
  const [activeTab, setActiveTab] = useState<VendorDiscoveryTab>("categories");
  const [showAddForm, setShowAddForm] = useState(false);

  if (!selectedCategory) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {lang === "vi" ? "Không có dữ liệu" : "No data available"}
      </div>
    );
  }

  const category = selectedCategory;
  const region = state.region || "north";

  function handleQuickAdd() {
    setShowAddForm(true);
  }

  function handleAddFromDiscovery() {
    const newVendor: Omit<Vendor, "id"> = {
      category: category.nameVi,
      name: "",
      phone: "",
      address: "",
      note: "",
      status: "new",
      budget: category.budgetRange.low,
      deposit: 0,
      quotes: [],
    };
    onAddVendor(newVendor);
    setShowAddForm(false);
  }

  return (
    <div className="space-y-4 py-2">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-3 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "categories"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "vi" ? "Danh mục" : "Categories"}
        </button>
        <button
          onClick={() => setActiveTab("tips")}
          className={`px-3 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "tips"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "vi" ? "Mẹo" : "Tips"}
        </button>
        <button
          onClick={() => setActiveTab("checklist")}
          className={`px-3 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "checklist"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "vi" ? "Checklist" : "Checklist"}
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          {/* Category Selector */}
          <div>
            <h3 className="text-sm font-medium mb-2">
              {lang === "vi" ? "Chọn danh mục nhà cung cấp" : "Select vendor category"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {VENDOR_DISCOVERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    selectedCategory?.id === cat.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-xs font-medium">
                    {lang === "vi" ? cat.nameVi : cat.nameEn}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Details */}
          {selectedCategory && (
            <div className="border rounded-lg p-4 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-lg font-semibold">
                      {lang === "vi" ? category.nameVi : category.nameEn}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {lang === "vi" ? category.descriptionVi : category.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Budget Range */}
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {lang === "vi" ? "Ngân sách tham khảo" : "Budget Range"}
                </div>
                <div className="text-sm font-semibold">
                  {getBudgetRangeText(category.budgetRange, lang)}
                </div>
              </div>

              {/* Regional Notes */}
              {category.regionalNotes && region && category.regionalNotes[region] && (
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {lang === "vi"
                      ? `Lưu ý khu vực ${region === "north" ? "Miền Bắc" : region === "central" ? "Miền Trung" : "Miền Nam"}`
                      : `Note for ${region === "north" ? "Northern" : region === "central" ? "Central" : "Southern"} region`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {category.regionalNotes[region]}
                  </div>
                </div>
              )}

              {/* Quick Add Button */}
              <button
                onClick={handleQuickAdd}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {lang === "vi" ? "+ Thêm nhanh vào danh sách nhà cung cấp" : "+ Quick add to vendors"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tips Tab */}
      {activeTab === "tips" && selectedCategory && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-4">
            {/* Tips Section */}
            <div>
              <h4 className="text-sm font-semibold mb-2">
                {lang === "vi" ? "💡 Mẹo chọn nhà cung cấp" : "💡 Tips for choosing vendors"}
              </h4>
              <ul className="space-y-2">
                {(lang === "vi" ? category.tips.vi : category.tips.en).map((tip, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flags Section */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold mb-2 text-destructive">
                {lang === "vi" ? "⚠️ Dấu hiệu cần tránh" : "⚠️ Red flags to avoid"}
              </h4>
              <ul className="space-y-2">
                {(lang === "vi" ? category.redFlags.vi : category.redFlags.en).map((flag, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-2">
                    <span className="text-destructive mt-0.5">✗</span>
                    <span className="text-muted-foreground">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === "checklist" && selectedCategory && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-4">
            {/* Essential Questions */}
            <div>
              <h4 className="text-sm font-semibold mb-2">
                {lang === "vi" ? "❓ Câu hỏi quan trọng" : "❓ Essential questions to ask"}
              </h4>
              <div className="space-y-2">
                {(lang === "vi" ? category.essentialQuestions.vi : category.essentialQuestions.en).map(
                  (question, idx) => (
                    <div
                      key={idx}
                      className="text-xs p-2 bg-muted rounded flex items-start gap-2"
                    >
                      <span className="text-primary font-medium">{idx + 1}.</span>
                      <span>{question}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* General Checklist */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold mb-2">
                {lang === "vi" ? "📋 Checklist trước khi đặt" : "📋 Pre-booking checklist"}
              </h4>
              <ul className="space-y-2">
                <li className="text-xs flex items-start gap-2">
                  <input type="checkbox" className="mt-0.5" />
                  <span>{lang === "vi" ? "Đã xem portfolio/demo thực tế" : "Reviewed real portfolio/demo"}</span>
                </li>
                <li className="text-xs flex items-start gap-2">
                  <input type="checkbox" className="mt-0.5" />
                  <span>{lang === "vi" ? "Đã thử/trải nghiệm dịch vụ" : "Tried/experienced service"}</span>
                </li>
                <li className="text-xs flex items-start gap-2">
                  <input type="checkbox" className="mt-0.5" />
                  <span>{lang === "vi" ? "Đã so sánh với 2-3 nhà cung cấp khác" : "Compared with 2-3 other vendors"}</span>
                </li>
                <li className="text-xs flex items-start gap-2">
                  <input type="checkbox" className="mt-0.5" />
                  <span>{lang === "vi" ? "Đã đọc kỹ hợp đồng" : "Read contract carefully"}</span>
                </li>
                <li className="text-xs flex items-start gap-2">
                  <input type="checkbox" className="mt-0.5" />
                  <span>{lang === "vi" ? "Hiểu rõ chính sách hủy/hoàn tiền" : "Understand cancellation/refund policy"}</span>
                </li>
                <li className="text-xs flex items-start gap-2">
                  <input type="checkbox" className="mt-0.5" />
                  <span>{lang === "vi" ? "Đã đặt cọc giữ ngày" : "Paid deposit to secure date"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-4 max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold">
              {lang === "vi" ? "Thêm nhà cung cấp" : "Add vendor"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lang === "vi"
                ? `Bạn đang thêm một nhà cung cấp mới cho danh mục: ${category.nameVi}`
                : `Adding a new vendor for category: ${category.nameEn}`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
              >
                {lang === "vi" ? "Hủy" : "Cancel"}
              </button>
              <button
                onClick={handleAddFromDiscovery}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                {lang === "vi" ? "Thêm" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
