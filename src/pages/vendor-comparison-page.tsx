import { useState } from "react";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { t } from "@/lib/i18n";
import { VendorReviewSummary } from "@/components/vendor-reviews/vendor-review-summary";
import type { Vendor } from "@/types/wedding";

export function VendorComparisonPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const lang = state.lang;
  const vendors = state.vendors || [];
  const vendorReviews = state.vendorReviews || [];

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Get unique categories
  const categories = Array.from(
    new Set(vendors.map((v) => v.category || "Chưa phân loại"))
  );

  // Filter vendors by category
  const filteredVendors =
    selectedCategory === "all"
      ? vendors
      : vendors.filter((v) => v.category === selectedCategory);

  // Get selected vendors
  const comparisonVendors = filteredVendors.filter((v) =>
    selectedIds.has(v.id)
  );

  function toggleSelection(id: number) {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else if (newSelected.size < 4) {
      // Max 4 vendors for comparison
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function formatCurrency(amount?: number | null): string {
    if (amount == null) return "-";
    return new Intl.NumberFormat(lang === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Get best price and rating from quotes
  function getVendorPrice(vendor: Vendor): number | null {
    if (!vendor.quotes || vendor.quotes.length === 0) return null;
    return Math.min(...vendor.quotes.map((q) => q.price));
  }

  function getVendorRating(vendor: Vendor): number | null {
    if (!vendor.quotes || vendor.quotes.length === 0) return null;
    // Return the highest rating from quotes
    return Math.max(...vendor.quotes.map((q) => q.rating));
  }

  function getVendorServices(vendor: Vendor): string[] {
    if (!vendor.quotes || vendor.quotes.length === 0) return [];
    // Combine all inclusions from quotes
    const allInclusions = vendor.quotes.flatMap((q) =>
      q.inclusions.split("\n").filter((s) => s.trim())
    );
    return [...new Set(allInclusions)]; // Remove duplicates
  }

  return (
    <div className="p-3 space-y-4">
      {/* Header */}
      <div>
        <h2 className="font-semibold text-base">
          🔍 {t("So sánh Nhà Cung Cấp", lang)}
        </h2>
        <p className="text-xs text-muted-foreground">
          {t(
            "So sánh chi tiết các nhà cung cấp để đưa ra quyết định tốt nhất",
            lang
          )}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 text-xs rounded transition-colors ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          {lang === "vi" ? "Tất cả" : "All"}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedIds(new Set()); // Clear selection when changing category
            }}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selection Info */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-2 bg-muted rounded">
          <span className="text-xs">
            {lang === "vi"
              ? `Đã chọn ${selectedIds.size}/4 nhà cung cấp`
              : `${selectedIds.size}/4 vendors selected`}
          </span>
          <button
            onClick={clearSelection}
            className="text-xs text-destructive hover:underline"
          >
            {lang === "vi" ? "Bỏ chọn" : "Clear"}
          </button>
        </div>
      )}

      {/* Vendor Selection List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">
          {lang === "vi" ? "Chọn nhà cung cấp để so sánh" : "Select vendors to compare"}
        </h3>
        {filteredVendors.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            {lang === "vi"
              ? "Không có nhà cung cấp nào"
              : "No vendors found"}
          </p>
        ) : (
          <div className="space-y-2">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  selectedIds.has(vendor.id)
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => toggleSelection(vendor.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(vendor.id)}
                        onChange={() => toggleSelection(vendor.id)}
                        className="pointer-events-none"
                      />
                      <div className="font-medium text-sm">{vendor.name}</div>
                      {vendor.category && (
                        <span className="text-xs px-2 py-0.5 bg-muted rounded">
                          {vendor.category}
                        </span>
                      )}
                    </div>
                    {vendor.phone && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {vendor.phone}
                      </div>
                    )}
                  </div>
                  {vendor.budget && (
                    <div className="text-sm font-semibold">
                      {formatCurrency(vendor.budget)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comparison View */}
      {comparisonVendors.length >= 2 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">
            {lang === "vi" ? "Bảng so sánh" : "Comparison Table"}
          </h3>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {comparisonVendors.map((vendor) => {
              const price = getVendorPrice(vendor);
              const rating = getVendorRating(vendor);
              const services = getVendorServices(vendor);

              return (
                <div
                  key={vendor.id}
                  className="border rounded-lg p-3 space-y-3 bg-card"
                >
                  {/* Vendor Header */}
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{vendor.name}</div>
                    {vendor.category && (
                      <div className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded w-fit">
                        {vendor.category}
                      </div>
                    )}
                  </div>

                  {/* Contact */}
                  {vendor.phone && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        {lang === "vi" ? "Liên hệ" : "Contact"}
                      </div>
                      <div className="text-xs">{vendor.phone}</div>
                    </div>
                  )}

                  {/* Address */}
                  {vendor.address && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        {lang === "vi" ? "Địa chỉ" : "Address"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {vendor.address}
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground">
                      {lang === "vi" ? "Giá tốt nhất" : "Best Price"}
                    </div>
                    <div className="text-sm font-semibold">
                      {formatCurrency(price || vendor.budget)}
                    </div>
                  </div>

                  {/* Rating */}
                  {rating && rating > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        {lang === "vi" ? "Đánh giá" : "Rating"}
                      </div>
                      <div className="text-xs">
                        {rating}/5 ⭐
                      </div>
                    </div>
                  )}

                  {/* Vendor Reviews */}
                  <VendorReviewSummary
                    reviews={vendorReviews.filter(r => r.vendorId === vendor.id)}
                    vendorName={vendor.name}
                    lang={lang === "en" ? "en" : "vi"}
                  />

                  {/* Services */}
                  {services.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        {lang === "vi" ? "Dịch vụ" : "Services"}
                      </div>
                      <ul className="text-xs space-y-0.5">
                        {services.slice(0, 4).map((service, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-primary">•</span>
                            <span className="line-clamp-1">{service}</span>
                          </li>
                        ))}
                        {services.length > 4 && (
                          <li className="text-xs text-muted-foreground">
                            +{services.length - 4} {lang === "vi" ? "thêm" : "more"}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Note */}
                  {vendor.note && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        {lang === "vi" ? "Ghi chú" : "Notes"}
                      </div>
                      <div className="text-xs text-muted-foreground italic line-clamp-2">
                        {vendor.note}
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground">
                      {lang === "vi" ? "Trạng thái" : "Status"}
                    </div>
                    <div className="text-xs px-2 py-0.5 bg-muted rounded w-fit">
                      {vendor.status}
                    </div>
                  </div>

                  {/* Actions */}
                  {vendor.phone && (
                    <a
                      href={`tel:${vendor.phone}`}
                      className="block text-center text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
                    >
                      {lang === "vi" ? "Gọi ngay" : "Call Now"}
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Summary */}
          <div className="p-3 bg-muted rounded space-y-2">
            <h4 className="text-sm font-medium">
              {lang === "vi" ? "Tóm tắt nhanh" : "Quick Summary"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="font-medium text-muted-foreground">
                  {lang === "vi" ? "Giá thấp nhất: " : "Lowest: "}
                </span>
                {formatCurrency(
                  Math.min(
                    ...comparisonVendors.map((v) => getVendorPrice(v) || v.budget || Infinity)
                  )
                )}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  {lang === "vi" ? "Giá cao nhất: " : "Highest: "}
                </span>
                {formatCurrency(
                  Math.max(
                    ...comparisonVendors.map((v) => getVendorPrice(v) || v.budget || 0)
                  )
                )}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  {lang === "vi" ? "Đánh giá cao nhất: " : "Top rated: "}
                </span>
                {Math.max(
                  ...comparisonVendors.map((v) => getVendorRating(v) || 0)
                )}
                /5 ⭐
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
