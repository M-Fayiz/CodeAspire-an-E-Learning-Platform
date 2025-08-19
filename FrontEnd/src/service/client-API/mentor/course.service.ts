import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type {
  CourseForm,
  ICourseData,
  ICourseDTO,
  ILecture,
  ISession,
} from "@/types/courses.types";
import type { AxiosError } from "axios";
import { sharedService } from "../shared.service";
import { S3BucketUtil } from "@/utility/S3Bucket.util";

const courseService = {
  createCourse: async (courseData: ICourseData): Promise<ICourseData> => {
    try {
      console.log(courseData);
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
  fetchCourses: async (): Promise<ICourseData[] | null> => {
    try {
      const response = await axiosInstance.get(API.COURSE.FETCH_COURSES);

      return response.data.courseListData;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
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
      const response = await axiosInstance.get(API.COURSE.GET_COURSE(courseId));
      return response.data.course;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
    }
  },
  getMentorDraftedCourse: async (userId: string): Promise<CourseForm[]> => {
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
  updateBaseInformation:async(courseId:string,courseData:ICourseData):Promise<CourseForm>=>{
    try {
      console.log('ronaldo',API.COURSE.UPDATE_BASE_COURSE_INFO(courseId))
      if(courseData.thumbnail instanceof File){
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
      const response=await axiosInstance.put(API.COURSE.UPDATE_BASE_COURSE_INFO(courseId),{courseData})
      return response.data.updatedData
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something Went wrong Please try again";
      throw new Error(errorMessage);
    }
  }
};

export default courseService;
