import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VendorRatingStars } from "./vendor-rating-stars";
import type { VendorReview } from "@/types/wedding";

interface VendorReviewFormProps {
  vendorId?: number;
  vendorName?: string;
  initialReview?: VendorReview;
  vendors?: Array<{ id: number; name: string }>;
  onSave: (review: Omit<VendorReview, "id" | "createdAt">) => void;
  onCancel: () => void;
  lang?: string;
}

export function VendorReviewForm({
  vendorId,
  vendorName,
  initialReview,
  vendors,
  onSave,
  onCancel,
  lang = "vi"
}: VendorReviewFormProps) {
  const en = lang === "en";

  const [selectedVendorId, setSelectedVendorId] = useState(initialReview?.vendorId || vendorId || 0);
  const [selectedVendorName, setSelectedVendorName] = useState(initialReview?.vendorName || vendorName || "");
  const [overallRating, setOverallRating] = useState(initialReview?.overallRating || 0);
  const [quality, setQuality] = useState(initialReview?.ratings.quality || 0);
  const [professionalism, setProfessionalism] = useState(initialReview?.ratings.professionalism || 0);
  const [value, setValue] = useState(initialReview?.ratings.value || 0);
  const [communication, setCommunication] = useState(initialReview?.ratings.communication || 0);
  const [notes, setNotes] = useState(initialReview?.notes || "");
  const [reviewDate, setReviewDate] = useState(
    initialReview?.reviewDate || new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (overallRating === 0) return;

    const finalVendorId = selectedVendorId || vendorId || 0;
    const finalVendorName = selectedVendorName || vendorName || "";

    if (!finalVendorId) {
      alert(en ? "Please select a vendor" : "Vui lòng chọn nhà cung cấp");
      return;
    }

    onSave({
      vendorId: finalVendorId,
      vendorName: finalVendorName,
      overallRating,
      ratings: {
        quality: quality || overallRating,
        professionalism: professionalism || overallRating,
        value: value || overallRating,
        communication: communication || overallRating
      },
      notes,
      reviewDate
    });
  };

  const isComplete = overallRating > 0 && quality > 0 && professionalism > 0 && value > 0 && communication > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-background">
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">
          {initialReview ? (en ? "Edit Review" : "Chỉnh sửa đánh giá") : (en ? "Add Review" : "Thêm đánh giá")}
        </h3>

        {/* Vendor Selection (only when adding new review) */}
        {!initialReview && vendors && vendors.length > 0 && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              {en ? "Select Vendor" : "Chọn Nhà Cung Cấp"} *
            </label>
            <select
              value={selectedVendorId}
              onChange={(e) => {
                const vendor = vendors.find(v => v.id === Number(e.target.value));
                setSelectedVendorId(Number(e.target.value));
                setSelectedVendorName(vendor?.name || "");
              }}
              className="w-full border rounded px-3 py-2 text-sm bg-background"
              required
            >
              <option value="">{en ? "Choose a vendor..." : "Chọn nhà cung cấp..."}</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="text-sm font-medium">{selectedVendorName || vendorName}</div>

        {/* Overall Rating */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            {en ? "Overall Rating" : "Đánh giá tổng quan"} *
          </label>
          <VendorRatingStars
            value={overallRating}
            onChange={setOverallRating}
            size="lg"
          />
        </div>

        {/* Detailed Ratings */}
        <div className="space-y-2 pt-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              {en ? "Service Quality" : "Chất lượng dịch vụ"} *
            </label>
            <VendorRatingStars
              value={quality}
              onChange={setQuality}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              {en ? "Professionalism" : "Sự chuyên nghiệp"} *
            </label>
            <VendorRatingStars
              value={professionalism}
              onChange={setProfessionalism}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              {en ? "Value for Money" : "Đáng giá tiền"} *
            </label>
            <VendorRatingStars
              value={value}
              onChange={setValue}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              {en ? "Communication" : "Giao tiếp"} *
            </label>
            <VendorRatingStars
              value={communication}
              onChange={setCommunication}
            />
          </div>
        </div>

        {/* Review Date */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            {en ? "Review Date" : "Ngày đánh giá"}
          </label>
          <Input
            type="date"
            value={reviewDate}
            onChange={(e) => setReviewDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            {en ? "Notes" : "Ghi chú"}
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={en ? "Share your experience..." : "Chia sẻ trải nghiệm của bạn..."}
            rows={3}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={!isComplete}
          className="flex-1"
        >
          {en ? "Save Review" : "Lưu đánh giá"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {en ? "Cancel" : "Hủy"}
        </Button>
      </div>
    </form>
  );
}
