import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Vendor, VendorQuote } from "@/types/wedding";

function formatVnd(n: number): string {
  if (n === 0) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}tr`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

function parseVnd(s: string): number {
  return parseInt(s.replace(/\D/g, ""), 10) || 0;
}

function StarRating({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star === value ? 0 : star)}
          className={`text-lg leading-none ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}`}
          style={{ color: star <= value ? "#f59e0b" : "#d1d5db" }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

interface VendorQuoteComparisonProps {
  vendors: Vendor[];
  onAddQuote: (vendorId: number, quote: Omit<VendorQuote, "id" | "vendorId" | "createdAt">) => void;
  onRemoveQuote: (vendorId: number, quoteId: number) => void;
  lang?: string;
}

export function VendorQuoteComparison({ vendors, onAddQuote, onRemoveQuote, lang = "vi" }: VendorQuoteComparisonProps) {
  const en = lang === "en";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addingToVendor, setAddingToVendor] = useState<number | null>(null);

  // Quote form state
  const [pkgName, setPkgName] = useState("");
  const [price, setPrice] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");

  function resetForm() {
    setPkgName(""); setPrice(""); setInclusions(""); setExclusions("");
    setValidUntil(""); setRating(0); setNotes("");
  }

  function handleAddQuote(vendorId: number) {
    if (!price.trim()) return;
    onAddQuote(vendorId, {
      price: parseVnd(price),
      packageName: pkgName.trim(),
      inclusions: inclusions.trim(),
      exclusions: exclusions.trim(),
      validUntil,
      rating,
      notes: notes.trim(),
    });
    resetForm();
    setAddingToVendor(null);
  }

  // Get categories that have vendors with quotes
  const categoriesWithQuotes = [...new Set(
    vendors.filter((v) => v.quotes && v.quotes.length > 0).map((v) => v.category)
  )];

  // All used categories
  const allCategories = [...new Set(vendors.map((v) => v.category))];

  // Vendors in selected category
  const categoryVendors = selectedCategory
    ? vendors.filter((v) => v.category === selectedCategory)
    : [];

  // Get all quotes across vendors in selected category, sorted by price
  const allQuotes = categoryVendors.flatMap((v) =>
    (v.quotes || []).map((q) => ({ ...q, vendorName: v.name, vendorId: v.id }))
  ).sort((a, b) => a.price - b.price);

  const cheapestPrice = allQuotes.length > 0 ? allQuotes[0].price : 0;
  const highestRated = allQuotes.length > 0
    ? allQuotes.reduce((best, q) => q.rating > best.rating ? q : best, allQuotes[0])
    : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-base">
          {en ? "📊 Quote Comparison" : "📊 So Sánh Báo Giá"}
        </h3>
        <p className="text-xs text-muted-foreground">
          {en
            ? "Compare vendor quotes side-by-side to find the best deal"
            : "So sánh báo giá các vendor để tìm lựa chọn tốt nhất"}
        </p>
      </div>

      {/* Category selector */}
      {allCategories.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
              selectedCategory === null
                ? "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)]"
                : "border-[var(--theme-border)] text-muted-foreground hover:border-[var(--theme-primary)]"
            }`}
          >
            {t("Tất cả", lang)}
          </button>
          {allCategories.map((c) => {
            const hasQuotes = categoriesWithQuotes.includes(c);
            return (
              <button
                key={c}
                onClick={() => setSelectedCategory(selectedCategory === c ? null : c)}
                className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
                  selectedCategory === c
                    ? "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)]"
                    : "border-[var(--theme-border)] text-muted-foreground hover:border-[var(--theme-primary)]"
                }`}
              >
                {c}
                {hasQuotes && <span className="ml-1 text-[10px]">✓</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Comparison summary */}
      {selectedCategory && allQuotes.length >= 2 && (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-green-50 border border-green-200 p-2.5">
            <p className="text-[10px] text-green-600 font-medium">
              {en ? "💰 Best Price" : "💰 Giá Tốt Nhất"}
            </p>
            <p className="text-sm font-bold text-green-700">{formatVnd(cheapestPrice)}</p>
            <p className="text-xs text-green-600 truncate">{allQuotes[0].vendorName}</p>
          </div>
          {highestRated && highestRated.rating > 0 && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5">
              <p className="text-[10px] text-amber-600 font-medium">
                {en ? "⭐ Highest Rated" : "⭐ Đánh Giá Cao Nhất"}
              </p>
              <p className="text-sm font-bold text-amber-700">
                {"★".repeat(highestRated.rating)} ({highestRated.rating}/5)
              </p>
              <p className="text-xs text-amber-600 truncate">{highestRated.vendorName}</p>
            </div>
          )}
        </div>
      )}

      {/* Vendor quotes list */}
      {selectedCategory ? (
        categoryVendors.length > 0 ? (
          <div className="space-y-3">
            {categoryVendors.map((vendor) => {
              const quotes = vendor.quotes || [];
              const isAdding = addingToVendor === vendor.id;

              return (
                <div
                  key={vendor.id}
                  className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 space-y-2"
                >
                  {/* Vendor header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{vendor.name}</span>
                      {vendor.phone && (
                        <span className="text-xs text-muted-foreground">📞 {vendor.phone}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        setAddingToVendor(isAdding ? null : vendor.id);
                        resetForm();
                      }}
                    >
                      {isAdding ? "✕" : `+ ${en ? "Quote" : "Báo giá"}`}
                    </Button>
                  </div>

                  {/* Add quote form */}
                  {isAdding && (
                    <div className="rounded-lg bg-[var(--theme-surface-muted)] border border-[var(--theme-border)] p-3 space-y-2">
                      <Input
                        className="h-8 text-sm"
                        placeholder={en ? "Package name (e.g. 'Premium Package')" : "Tên gói (vd: 'Gói Cao Cấp')"}
                        value={pkgName}
                        onChange={(e) => setPkgName(e.target.value)}
                      />
                      <Input
                        className="h-8 text-sm"
                        placeholder={t("Giá báo", lang)}
                        type="text"
                        inputMode="numeric"
                        value={price}
                        onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
                      />
                      <textarea
                        className="w-full border rounded-lg p-2 text-sm bg-background resize-none"
                        rows={2}
                        placeholder={en ? "What's included..." : "Bao gồm những gì..."}
                        value={inclusions}
                        onChange={(e) => setInclusions(e.target.value)}
                      />
                      <textarea
                        className="w-full border rounded-lg p-2 text-sm bg-background resize-none"
                        rows={2}
                        placeholder={en ? "What's NOT included..." : "Không bao gồm..."}
                        value={exclusions}
                        onChange={(e) => setExclusions(e.target.value)}
                      />
                      <div className="flex gap-2 flex-wrap">
                        <div className="flex-1 min-w-[140px]">
                          <label className="text-[10px] text-muted-foreground block mb-0.5">
                            {en ? "Valid until" : "Có hiệu lực đến"}
                          </label>
                          <Input
                            className="h-8 text-sm"
                            type="date"
                            value={validUntil}
                            onChange={(e) => setValidUntil(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground block mb-0.5">
                            {en ? "Your rating" : "Đánh giá"}
                          </label>
                          <StarRating value={rating} onChange={setRating} />
                        </div>
                      </div>
                      <Input
                        className="h-8 text-sm"
                        placeholder={t("Ghi chú", lang)}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => { setAddingToVendor(null); resetForm(); }}
                          className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground"
                        >
                          {t("Hủy", lang)}
                        </button>
                        <Button
                          size="sm"
                          className="h-8 px-3"
                          onClick={() => handleAddQuote(vendor.id)}
                          disabled={!price.trim()}
                        >
                          {en ? "Save Quote" : "Lưu Báo Giá"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Existing quotes */}
                  {quotes.length > 0 ? (
                    <div className="space-y-2">
                      {quotes.map((q) => {
                        const isCheapest = q.price === cheapestPrice && allQuotes.length >= 2;
                        return (
                          <div
                            key={q.id}
                            className={`rounded-lg border p-2.5 space-y-1.5 ${
                              isCheapest
                                ? "border-green-300 bg-green-50"
                                : "border-[var(--theme-border)] bg-[var(--theme-surface-muted)]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-semibold">
                                    {q.packageName || (en ? "Quote" : "Báo giá")}
                                  </span>
                                  {isCheapest && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-200 text-green-700 font-medium">
                                      {en ? "Best price" : "Giá tốt nhất"}
                                    </span>
                                  )}
                                </div>
                                <p className="text-base font-bold" style={{ color: "var(--theme-primary)" }}>
                                  {formatVnd(q.price)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {q.rating > 0 && (
                                  <span className="text-xs text-amber-600">
                                    {"★".repeat(q.rating)}
                                  </span>
                                )}
                                <button
                                  onClick={() => onRemoveQuote(vendor.id, q.id)}
                                  className="text-xs text-red-400 hover:text-red-600 p-0.5"
                                  title="✕"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                            {q.inclusions && (
                              <p className="text-xs text-green-700">
                                ✓ {q.inclusions}
                              </p>
                            )}
                            {q.exclusions && (
                              <p className="text-xs text-red-500">
                                ✗ {q.exclusions}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                              {q.validUntil && (
                                <span>
                                  ⏰ {en ? "Valid until" : "Hiệu lực đến"} {q.validUntil}
                                </span>
                              )}
                              {q.notes && <span>📝 {q.notes}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    !isAdding && (
                      <p className="text-xs text-muted-foreground text-center py-3">
                        {en
                          ? "No quotes yet. Add one to start comparing."
                          : "Chưa có báo giá. Thêm để bắt đầu so sánh."}
                      </p>
                    )
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              {en
                ? "No vendors in this category yet"
                : "Chưa có vendor trong danh mục này"}
            </p>
          </div>
        )
      ) : (
        /* No category selected — show overview */
        <div className="space-y-3">
          {categoriesWithQuotes.length > 0 ? (
            categoriesWithQuotes.map((cat) => {
              const catVendors = vendors.filter((v) => v.category === cat);
              const catQuotes = catVendors.flatMap((v) => v.quotes || []);
              const minPrice = Math.min(...catQuotes.map((q) => q.price));
              const maxPrice = Math.max(...catQuotes.map((q) => q.price));

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="w-full text-left rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 hover:border-[var(--theme-primary)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold">{cat}</span>
                      <p className="text-xs text-muted-foreground">
                        {catQuotes.length} {en ? "quotes from" : "báo giá từ"} {catVendors.length} {en ? "vendors" : "vendor"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {formatVnd(minPrice)} — {formatVnd(maxPrice)}
                      </p>
                      <p className="text-xs text-[var(--theme-primary)]">
                        {en ? "Compare →" : "So sánh →"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-sm font-semibold mb-1">
                {en ? "No quotes yet" : "Chưa có báo giá"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                {en
                  ? "Select a vendor category above and add quotes to compare prices and packages"
                  : "Chọn danh mục vendor ở trên và thêm báo giá để so sánh giá và gói dịch vụ"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function t(key: string, lang: string): string {
  const translations: Record<string, Record<string, string>> = {
    "Tất cả": { vi: "Tất cả", en: "All" },
    "Giá báo": { vi: "Giá báo", en: "Quoted price" },
    "Ghi chú": { vi: "Ghi chú", en: "Notes" },
  };
  return translations[key]?.[lang] ?? key;
}
