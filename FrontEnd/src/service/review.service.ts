import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type { IReviewDTO } from "@/types/DTOS/review.dto.type";
import { throwAxiosError } from "@/utility/throwErrot";
import { sharedService } from "./shared.service";

export const ReviewService = {
  createReview: async (
    userId: string,
    courseId: string,
    comment: string,
  ): Promise<IReviewDTO> => {
    try {
      const response = await axiosInstance.post(API.REVIEW.ADD_REVIEW, {
        learnerId: userId,
        courseId,
        comment,
      });
      if (response.data.ceratedReview.learner.profilePicture) {
        const presignedUrl = await sharedService.getPreSignedDownloadURL(
          response.data.ceratedReview.learner.profilePicture,
        );
        response.data.ceratedReview.learner.profilePicture = presignedUrl;
      }

      return response.data.ceratedReview;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getCourseReviews: async (courseId: string): Promise<IReviewDTO[]> => {
    try {
      const response = await axiosInstance.get(
        API.REVIEW.GET_REVIEWS(courseId),
      );

      for (let review of response.data.courseReview) {
        if (review.learner.profilePicture) {
          review.learner.profilePicture =
            await sharedService.getPreSignedDownloadURL(
              review.learner.profilePicture,
            );
        }
      }
      return response.data.courseReview;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};
