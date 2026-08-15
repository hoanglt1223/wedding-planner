import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VendorRatingStars } from "./vendor-rating-stars";
import type { VendorReview } from "@/types/wedding";

interface VendorReviewListProps {
  reviews: VendorReview[];
  onEdit: (review: VendorReview) => void;
  onDelete: (id: number) => void;
  lang?: string;
}

export function VendorReviewList({
  reviews,
  onEdit,
  onDelete,
  lang = "vi"
}: VendorReviewListProps) {
  const en = lang === "en";

  if (reviews.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <p className="text-sm">
          {en ? "No reviews yet. Add your first review!" : "Chưa có đánh giá nào. Thêm đánh giá đầu tiên của bạn!"}
        </p>
      </Card>
    );
  }

  const sortedReviews = [...reviews].sort((a, b) =>
    new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedReviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(review.reviewDate).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")}
                </span>
                <span className="font-medium">{review.overallRating}/5</span>
              </div>

              <VendorRatingStars value={review.overallRating} readonly size="sm" />

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {en ? "Quality:" : "Chất lượng:"}
                  </span>
                  <span className="font-medium">{review.ratings.quality}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {en ? "Professionalism:" : "Chuyên nghiệp:"}
                  </span>
                  <span className="font-medium">{review.ratings.professionalism}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {en ? "Value:" : "Đáng giá:"}
                  </span>
                  <span className="font-medium">{review.ratings.value}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {en ? "Communication:" : "Giao tiếp:"}
                  </span>
                  <span className="font-medium">{review.ratings.communication}/5</span>
                </div>
              </div>

              {review.notes && (
                <p className="text-sm text-muted-foreground mt-2 italic">
                  "{review.notes}"
                </p>
              )}
            </div>

            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEdit(review)}
                className="h-8 w-8 p-0"
              >
                ✏️
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm(en ? "Delete this review?" : "Xóa đánh giá này?")) {
                    onDelete(review.id);
                  }
                }}
                className="h-8 w-8 p-0"
              >
                🗑️
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
