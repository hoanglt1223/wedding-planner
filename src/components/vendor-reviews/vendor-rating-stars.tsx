import { cn } from "@/lib/utils";

interface VendorRatingStarsProps {
  value: number; // 1-5
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl"
};

export function VendorRatingStars({
  value,
  onChange,
  readonly = false,
  size = "md",
  className
}: VendorRatingStarsProps) {
  return (
    <div className={cn("flex gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star === value ? 0 : star)}
          className={cn(
            sizeClasses[size],
            "leading-none transition-transform",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          )}
          style={{ color: star <= value ? "#f59e0b" : "#d1d5db" }}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
