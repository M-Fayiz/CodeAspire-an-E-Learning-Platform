import type { IReviewDTO } from "@/types/DTOS/review.dto.type";
import type React from "react";

interface CommentProps {
  comment: IReviewDTO[];
}

const CourseComment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-6 max-h-[400px] overflow-y-auto">
          {comment?.length &&
            comment.map((data) => (
              <div key={data._id} className="flex gap-3">
                <div className="flex-shrink-0">
                  <img
                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg"
                    src={data.learner.profilePicture}
                    alt=""
                  />
                </div>

                {/* data Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {data.learner.name}
                    </span>
                  </div>

                  <p className="text-gray-700  leading-relaxed">
                    {data.comment}
                  </p>
                  <span className="text-gray-500 text-sm">
                    {data.createdAt
                      ? new Date(data.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </span>

                  {/* data Actions */}
                  <div className="flex items-center gap-4">
                    {/* <button className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors">
                  <ThumbsUp size={16} />
                  <span className="text-sm font-medium">{data.upvotes}</span>
                </button> */}

                    {/* <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <MessageCircle size={16} />
                  <span className="text-sm font-medium">Reply</span>
                </button>
                
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal size={16} />
                </button> */}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default CourseComment;
