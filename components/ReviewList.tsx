import type { Review } from "@/types";
import { StarRating } from "@/components/StarRating";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-onyx/50 dark:text-pearl/50">No reviews yet — be the first to share your thoughts.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-onyx/5 pb-6 last:border-0 dark:border-pearl/10">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-semibold">{review.author_name}</span>
            <span className="text-xs text-onyx/40 dark:text-pearl/40">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
          <StarRating rating={review.rating} size="sm" />
          {review.comment && <p className="mt-2 text-sm text-onyx/70 dark:text-pearl/70">{review.comment}</p>}
        </div>
      ))}
    </div>
  );
}
