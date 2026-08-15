import { Card } from "@/components/ui/card";
import { VendorRatingStars } from "./vendor-rating-stars";
import type { VendorReview } from "@/types/wedding";

interface VendorReviewSummaryProps {
  reviews: VendorReview[];
  vendorName: string;
  lang?: string;
}

export function VendorReviewSummary({
  reviews,
  vendorName,
  lang = "vi"
}: VendorReviewSummaryProps) {
  const en = lang === "en";

  if (reviews.length === 0) {
    return (
      <Card className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          {en ? "No reviews yet" : "Chưa có đánh giá"}
        </p>
      </Card>
    );
  }

  const avgOverall = reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length;
  const avgQuality = reviews.reduce((sum, r) => sum + r.ratings.quality, 0) / reviews.length;
  const avgProfessionalism = reviews.reduce((sum, r) => sum + r.ratings.professionalism, 0) / reviews.length;
  const avgValue = reviews.reduce((sum, r) => sum + r.ratings.value, 0) / reviews.length;
  const avgCommunication = reviews.reduce((sum, r) => sum + r.ratings.communication, 0) / reviews.length;

  const ratings = [
    { label: en ? "Overall" : "Tổng quan", value: avgOverall },
    { label: en ? "Quality" : "Chất lượng", value: avgQuality },
    { label: en ? "Professionalism" : "Chuyên nghiệp", value: avgProfessionalism },
    { label: en ? "Value" : "Đáng giá", value: avgValue },
    { label: en ? "Communication" : "Giao tiếp", value: avgCommunication }
  ];

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">{vendorName}</h4>
          <span className="text-xs text-muted-foreground">
            {reviews.length} {en ? "review" + (reviews.length !== 1 ? "s" : "") : "đánh giá"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <VendorRatingStars value={Math.round(avgOverall)} readonly size="md" />
          <span className="font-medium">{avgOverall.toFixed(1)}</span>
        </div>

        <div className="space-y-1.5 pt-1">
          {ratings.slice(1).map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{label}</span>
              <div className="flex items-center gap-1">
                <span className="font-medium w-8 text-right">{value.toFixed(1)}</span>
                <VendorRatingStars value={Math.round(value)} readonly size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
