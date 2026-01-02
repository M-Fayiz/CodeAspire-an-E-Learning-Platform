import type { IReviewDTO } from "@/types/DTOS/review.dto.type";
import { User } from "lucide-react";

interface ReviewCardProps {
  review: IReviewDTO;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center gap-4 mb-3">
        {review.learner.profilePicture ? (
          <img
            src={review.learner.profilePicture}
            alt={review.learner.name}
            className="h-10 w-10 rounded-full object-cover border"
          />
        ) : (
          <User className="w-1/2 h-1/2 text-gray-400" />
        )}

        <div className="flex-1">
          <p className="font-medium text-gray-800">{review.learner.name}</p>
          <p className="text-xs text-gray-500">
            {new Date(review.createdAt as Date).toLocaleDateString()}
          </p>
        </div>

        {/* <StarRating rating={review.rating} /> */}
      </div>

      {review.comment && (
        <p className="text-gray-700 text-sm leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  );
};
