import React, { useEffect, useState } from "react";
import { ReviewService } from "@/service/review.service";
import type { IReviewDTO } from "@/types/DTOS/review.dto.type";
import {  AxiosError } from "axios";
import { toast } from "sonner";
import { Spinner } from "@/components/templates/Spinner";
import StarRating from "../Enrolled Course/StarRating";
import { EnrolledService } from "@/service/Learner/enrolledCourse.service";


interface CommentProps {
  userId: string;
  courseId: string;
  enrolledId:string;
  starRating:number
}
const CommentsSection: React.FC<CommentProps> = ({ userId, courseId,enrolledId,starRating }) => {
  const [review, setReview] = useState<IReviewDTO[] | null>(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [rating, setRating]=useState(starRating)

  useEffect(() => {
    (async () => {
      const data = await ReviewService.getCourseReviews(courseId);
  
      if (data) {
        setReview(data);
      }
    })();
  }, []);

  async function submitCommit(e: React.FormEvent) {
    e.preventDefault();
    if (newComment.trim() == "") return;

    try {
      setLoading(true);
      const data = await ReviewService.createReview(
        userId,
        courseId,
        newComment,
      );

      setReview((prev) => (prev ? [...prev, data] : [data]));
      setNewComment("");
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    }
  }

  const handleRating = async(value: number) => {
   try {
    const data = await EnrolledService.addRating(enrolledId,value)
    if(data){
      setRating(data)
    }
   } catch (error) {
    if(error instanceof AxiosError){
      toast.error(error.message)
    }
   }
    
  };
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Comment Input */}
      <div className="mb-8">
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add comment..."
            className="w-full p-4 min-h-[100px] text-gray-700 placeholder-gray-400 resize-none focus:outline-none"
          />

          {/* Formatting Toolbar */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between">
            <button
              type="submit"
              onClick={submitCommit}
              className={`bg-orange-500 hover:bg-orange-600 flex gap-2 text-white px-6 py-2 rounded-lg font-medium transition-colors ${loading ? "disabled:" : ""}`}
            >
              {loading && <Spinner size="small" variant="white" />}
              Submit
            </button>
            <div>
              <StarRating starRating={rating} onRate={handleRating}/>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Header */}
      {/* <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-900">Comments</h3>
          <span className="bg-orange-500 text-white text-sm font-medium px-2 py-1 rounded-full">
            25
          </span>
        </div>
        
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium">
          {sortBy}
          <ChevronDown size={16} />
        </button>
      </div> */}

      {/* Comments List */}
      <div className="space-y-6 max-h-[400px] overflow-y-auto">
        {review?.length &&
          review.map((data) => (
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

                  {/* <span className="text-gray-500 text-sm">{data.timestamp}</span> */}
                </div>

                <p className="text-gray-700 mb-3 leading-relaxed">
                  {data.comment}
                </p>

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
  );
};

export default CommentsSection;
