import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type {
  CourseForm,
  ICourseData,
  ICourseDTO,
  IFormCourseDTO,
  ILecture,
  ISearchQuery,
  ISession,
} from "@/types/courses.types";
import type { AxiosError } from "axios";
import { sharedService } from "../shared.service";
import { S3BucketUtil } from "@/utility/S3Bucket.util";

const courseService = {
  createCourse: async (courseData: ICourseData): Promise<ICourseData> => {
    try {
      if (courseData.thumbnail) {
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
      const response = await axiosInstance.post(API.COURSE.CREATE_COURSE, {
        courseData,
      });
      return response.data.createdCourseData;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
    }
  },
  fetchCourses: async (
    params: ISearchQuery,
    learnerId?:string
  ): Promise<{ updated: ICourseData[] | null; totalDocument: number }> => {
    try {
      const response = await axiosInstance.get(API.COURSE.FETCH_COURSES, {
        params: {
    ...params,    
    learnerId,   
  }
      });

      if (!response) return { updated: null, totalDocument: 0 };

      const updated = await Promise.all(
        response.data.courseData?.map(async (cours: IFormCourseDTO) => {
          cours.thumbnail = await S3BucketUtil.getPreSignedURL(
            cours.thumbnail as string,
          );
          return cours;
        }) ?? [],
      );

      return { updated, totalDocument: response.data.totalDocument };
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something went wrong. Please try again.";
      throw new Error(errorMessage);
    }
  },

  addSessions: async (
    courseId: string,
    session: Partial<ISession>,
  ): Promise<ICourseData> => {
    try {
      const response = await axiosInstance.put(
        API.COURSE.ADD_SESSION(courseId),
        { session },
      );
      return response.data.addedSessionData;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
    }
  },
  addLecture: async (
    courseId: string,
    sessionId: string,
    lecture: ILecture,
  ): Promise<ICourseDTO> => {
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
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
    }
  },
  getCourse: async (courseId: string): Promise<ICourseDTO[] | null> => {
    try {
      if (!courseId) return null;
      console.log(courseId, "this is the course id");
      const response = await axiosInstance.get(API.COURSE.GET_COURSE(courseId));
      return response.data.course;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
    }
  },
  getMentorCourse: async (userId: string): Promise<IFormCourseDTO[]> => {
    try {
      const response = await axiosInstance.get(
        API.COURSE.GET_MENTOR_DRAFTED_COURSE,
        {
          params: { mentorId: userId },
        },
      );
      console.log(userId, "reawsf", response.data);
      return response.data.draftCoursList;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
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
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
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
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
    }
  },
  getAdminCourList: async (): Promise<IFormCourseDTO[]> => {
    try {
      const response = await axiosInstance.get(API.COURSE.ADMIN_COURSE_LIST);
      await Promise.all(
        response.data.coursList.map(async (course: IFormCourseDTO) => {
          course.thumbnail = await sharedService.getPreSignedDownloadURL(
            course.thumbnail,
          );
        }),
      );

      return response.data.coursList;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
    }
  },
  getCourseDetails: async (courseId: string): Promise<IFormCourseDTO> => {
    try {
      const response = await axiosInstance.get(
        API.COURSE.COURSE_DETAILS(courseId),
      );

      response.data.course.thumbnail =
        await sharedService.getPreSignedDownloadURL(
          response.data.course.thumbnail,
        );

      for (const session of response.data.course.sessions) {
        for (const lecture of session.lectures) {
          lecture.lectureContent = await sharedService.getPreSignedDownloadURL(
            lecture.lectureContent,
          );
        }
      }
      return response.data.course;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
    }
  },

  approveCourse: async (
    coursId: string,
  ): Promise<
    "inProgress" | "draft" | "published" | "approved" | "rejected"
  > => {
    try {
      const response = await axiosInstance.patch(
        API.COURSE.APPROVE_CURSE(coursId),
      );
      return response.data.status;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
    }
  },
  rejectCourse: async (
    coursId: string,
    feedBack: string,
    mentorEmail: string,
  ): Promise<
    "inProgress" | "draft" | "published" | "approved" | "rejected"
  > => {
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
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
    }
  },
  publishCourse: async (coursId: string) => {
    try {
      const response = await axiosInstance.patch(
        API.COURSE.PUBLISH_COURSE(coursId),
      );
      return response.data.status;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
    }
  },
};

export default courseService;
