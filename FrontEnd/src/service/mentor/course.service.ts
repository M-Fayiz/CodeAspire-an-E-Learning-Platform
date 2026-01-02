import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type {
  CourseForm,
  CourseStatus,
  ICourseDetailsPageDTO,
  ICourseDTO,
  IFormCourseDTO,
  ILecture,
  ISearchQuery,
  ISession,
  SlotCourseDTO,
} from "@/types/DTOS/courses.dto.types";
import { sharedService } from "../shared.service";
import { S3BucketUtil } from "@/utility/S3Bucket.util";
import { throwAxiosError } from "@/utility/throwErrot";
import type { ICourseData } from "@/types/courseForm.type";
import type { IReviewDTO } from "@/types/DTOS/review.dto.type";

const courseService = {
  createCourse: async (courseData: ICourseData): Promise<CourseForm> => {
    try {
      if (courseData.thumbnail) {
        const uploadAndFileUrl = await sharedService.getS3BucketUploadUrl(
          courseData.thumbnail as File,
        );
        await sharedService.uploadToS3(
          uploadAndFileUrl.uploadURL,
          courseData.thumbnail as File,
        );
        if (uploadAndFileUrl && uploadAndFileUrl.fileURL) {
          courseData.thumbnail = uploadAndFileUrl.fileURL as string;
        }
      }
      const response = await axiosInstance.post(API.COURSE.CREATE_COURSE, {
        courseData,
      });
      return response.data.createdCourseData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  fetchCourses: async (
    params: ISearchQuery,
    learnerId?: string,
  ): Promise<{ updated: ICourseData[] | null; totalDocument: number }> => {
    try {
      const response = await axiosInstance.get(API.COURSE.FETCH_COURSES, {
        params: {
          ...params,
          learnerId,
        },
      });

      if (!response) return { updated: null, totalDocument: 0 };

      const updated = await Promise.all(
        response.data.courseData?.map(async (cours: IFormCourseDTO) => {
          cours.thumbnail = await sharedService.getPreSignedDownloadURL(
            cours.thumbnail as string,
          );
          return cours;
        }) ?? [],
      );

      return { updated, totalDocument: response.data.totalDocument };
    } catch (error) {
      throwAxiosError(error);
    }
  },

  addSessions: async (
    courseId: string,
    session: Partial<ISession>,
  ): Promise<ICourseData> => {
    console.log(courseId, "- -  --", courseId);
    try {
      const response = await axiosInstance.put(
        API.COURSE.ADD_SESSION(courseId),
        { session },
      );

      return response.data.addedSessionData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  addLecture: async (
    courseId: string,
    sessionId: string,
    lecture: ILecture,
  ): Promise<ICourseDTO> => {
    console.log("ss :", sessionId);
    console.log("CI :", courseId);
    try {
      if (!courseId || !sessionId) {
        throw new Error(
          "Course ID and Session ID are required to add a lecture",
        );
      }

      if (lecture.lectureContent) {
        const uploadAndFileURLS = await sharedService.getS3BucketUploadUrl(
          lecture.lectureContent as File,
        );
        if (uploadAndFileURLS) {
          await sharedService.uploadToS3(
            uploadAndFileURLS.uploadURL,
            lecture.lectureContent as File,
          );
          lecture.lectureContent = uploadAndFileURLS.fileURL;
        }
      }

      const response = await axiosInstance.put(
        API.COURSE.ADD_LECTURE(courseId, sessionId),
        { lecture },
      );

      return response.data.addedLectureData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getCourse: async (courseId: string): Promise<ICourseDTO[] | null> => {
    try {
      if (!courseId) return null;

      const response = await axiosInstance.get(API.COURSE.GET_COURSE(courseId));
      return response.data.course;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getMentorCourse: async (
    search: string,
    page: string,
    userId: string,
  ): Promise<{ courseData: IFormCourseDTO[]; totalPage: number }> => {
    try {
      const response = await axiosInstance.get(
        API.COURSE.GET_MENTOR_DRAFTED_COURSE,
        {
          params: { mentorId: userId, search, page },
        },
      );

      return response.data;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  editLecture: async (
    courseId: string,
    sessionId: string,
    lectureId: string,
    lecture: ILecture,
  ): Promise<CourseForm> => {
    try {
      if (lecture.lectureContent instanceof File) {
        const uploadAndFileURLS = await sharedService.getS3BucketUploadUrl(
          lecture.lectureContent as File,
        );
        if (uploadAndFileURLS) {
          await sharedService.uploadToS3(
            uploadAndFileURLS.uploadURL,
            lecture.lectureContent as File,
          );
          lecture.lectureContent = uploadAndFileURLS.fileURL;
        }
      }
      const response = await axiosInstance.put(
        API.COURSE.EDIT_LECTURE(courseId, sessionId, lectureId),
        { lecture },
      );
      return response.data.updatedData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  updateBaseInformation: async (
    courseId: string,
    courseData: ICourseData,
  ): Promise<CourseForm> => {
    try {
      if (courseData.thumbnail instanceof File) {
        const uploadAndFileUrl = await sharedService.getS3BucketUploadUrl(
          courseData.thumbnail as File,
        );
        await S3BucketUtil.uploadToS3(
          uploadAndFileUrl.uploadURL,
          courseData.thumbnail as File,
        );
        if (uploadAndFileUrl && uploadAndFileUrl.fileURL) {
          courseData.thumbnail = uploadAndFileUrl.fileURL as string;
        }
      }
      const response = await axiosInstance.put(
        API.COURSE.UPDATE_BASE_COURSE_INFO(courseId),
        { courseData },
      );
      return response.data.updatedData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getAdminCourList: async (
    search: string,
    page: number,
  ): Promise<IFormCourseDTO[]> => {
    try {
      const response = await axiosInstance.get(API.COURSE.ADMIN_COURSE_LIST, {
        params: { search, page },
      });
      await Promise.all(
        response.data.coursList.map(async (course: IFormCourseDTO) => {
          course.thumbnail = await sharedService.getPreSignedDownloadURL(
            course.thumbnail,
          );
        }),
      );

      return response.data.coursList;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getCourseDetails: async (
    courseId: string,
    learnerId: string,
  ): Promise<{
    courseDetails: ICourseDetailsPageDTO;
    enrolledId: string | null;
  }> => {
    try {
      const response = await axiosInstance.get(
        API.COURSE.COURSE_DETAILS(courseId),
        {
          params: { learnerId },
        },
      );

      const { courseDetails, enrolledId } = response.data;

      const resolvedCourseDetails = {
        ...courseDetails,
        thumbnail: await sharedService.getPreSignedDownloadURL(
          courseDetails.thumbnail,
        ),
        courseReviews: await Promise.all(
          courseDetails.courseReviews.map(async (review: IReviewDTO) => ({
            ...review,
            learner: {
              ...review.learner,
              profilePicture: review.learner.profilePicture
                ? await sharedService.getPreSignedDownloadURL(
                    review.learner.profilePicture,
                  )
                : review.learner.profilePicture,
            },
          })),
        ),
      };

      return { courseDetails: resolvedCourseDetails, enrolledId };
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getCourseDetaildForAdmin: async (
    courseId: string,
  ): Promise<IFormCourseDTO> => {
    try {
      const response = await axiosInstance.get(
        API.COURSE.COURSE_DETAILS_ADMIN(courseId),
      );
      const { courseDetails } = response.data;

      courseDetails.thumbnail = await sharedService.getPreSignedDownloadURL(
        courseDetails.thumbnail,
      );

      for (const session of courseDetails.sessions) {
        for (const lecture of session.lectures) {
          if (lecture.lectureContent) {
            lecture.lectureContent =
              await sharedService.getPreSignedDownloadURL(
                lecture.lectureContent,
              );
          }
        }
      }

      return courseDetails;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  approveCourse: async (coursId: string): Promise<CourseStatus> => {
    try {
      const response = await axiosInstance.patch(
        API.COURSE.APPROVE_CURSE(coursId),
      );
      return response.data.status;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  rejectCourse: async (
    coursId: string,
    feedBack: string,
    mentorEmail: string,
  ): Promise<CourseStatus> => {
    try {
      const response = await axiosInstance.patch(
        API.COURSE.REJECT_COURSE(coursId),
        {
          mentorEmail,
          feedBack,
        },
      );
      return response.data.status;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  publishCourse: async (coursId: string) => {
    try {
      const response = await axiosInstance.patch(
        API.COURSE.PUBLISH_COURSE(coursId),
      );
      return response.data.status;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  /**
   * Fetches a list of course titles and course IDs for use in the mentor slot creation form.
   * @param mentorId
   * @returns list of course ID and tile array of Object
   */
  listCourseOnSlot: async (mentorId: string): Promise<SlotCourseDTO[]> => {
    try {
      const response = await axiosInstance.get(
        API.COURSE.LIST_COURSE_FOR_SLOT(mentorId),
      );
      return response.data.courseList;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getCourseFormData: async (courseId: string): Promise<CourseForm> => {
    try {
      const response = await axiosInstance.get(
        API.COURSE.GET_COURSE_FORM_DATA(courseId),
      );
      return response.data.courseFormData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  // updateSession:async(courseId:string,sessionId:string)=>{
  //   try {
  //     // const response=await axiosInstance.put(API.COURSE.UPDATE_SESSION())
  //   } catch (error) {
  //     throwAxiosError(error)
  //   }
  // }
  removeSession: async (
    courseId: string,
    sessionId: string,
  ): Promise<CourseForm> => {
    try {
      const response = await axiosInstance.delete(
        API.COURSE.DELETE_SESSION(courseId, sessionId),
      );
      return response.data.removedSessionData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  removeLecture: async (
    courseId: string,
    sessionId: string,
    lectureId: string,
  ): Promise<CourseForm> => {
    try {
      const response = await axiosInstance.delete(
        API.COURSE.DELETE_LECTURE(courseId, sessionId, lectureId),
      );
      return response.data;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};

export default courseService;
