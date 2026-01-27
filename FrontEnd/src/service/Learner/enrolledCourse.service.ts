import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type {
  ICourseProgess,
  IEnrolledCoursedetailsDTO,
  IEnrolledListDto,
} from "@/types/DTOS/enrollements.dto.type";
import { sharedService } from "../shared.service";
import { throwAxiosError } from "@/utility/throwErrot";
import type { ChartFilter } from "@/types/enrollent.types";
import type { IMentorDhasboardDTO } from "@/types/DTOS/mentorDashboard.dto.type";
import type { learnerDashboardCardsDTO } from "@/types/DTOS/learnerDashboard.type";

export const EnrolledService = {
  getEnrolledCourse: async (): Promise<IEnrolledListDto[]> => {
    try {
      const response = await axiosInstance.get(
        API.ENROLLEMENT.GET_ENROLLED_COURSE,
      );

      const signedCourse = await Promise.all(
        response.data.enrolledCourseData?.map(
          async (enrolled: IEnrolledListDto) => {
            enrolled.course.thumbnail =
              await sharedService.getPreSignedDownloadURL(
                enrolled.course.thumbnail as string,
              );
            return enrolled;
          },
        ) ?? [],
      );
      return signedCourse;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getEnrolledCourseDetails: async (
    enrolledId: string,
  ): Promise<IEnrolledCoursedetailsDTO> => {
    try {
      const response = await axiosInstance.get(
        API.ENROLLEMENT.GET_ENROLLD_COURSE_DETAILS(enrolledId),
      );

      response.data.enrolledDetails.course.thumbnail =
        await sharedService.getPreSignedDownloadURL(
          response.data.enrolledDetails.course.thumbnail,
        );

      for (const session of response.data.enrolledDetails.course.sessions) {
        for (const lecture of session.lectures) {
          lecture.lectureContent = await sharedService.getPreSignedDownloadURL(
            lecture.lectureContent,
          );
        }
      }
      return response.data.enrolledDetails;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  updateProgress: async (
    enrolledId: string,
    lectureId: string,
    sessionId: string,
  ): Promise<ICourseProgess> => {
    try {
      const response = await axiosInstance.put(
        API.ENROLLEMENT.UPDATE_PROGRESS(enrolledId),
        { lectureId, sessionId },
      );

      return response.data.progressData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  addRating: async (enrolledId: string, value: number): Promise<number> => {
    try {
      const response = await axiosInstance.put(
        API.ENROLLEMENT.ADD_RATING(enrolledId),
        {
          value,
        },
      );

      return response.data.ratingResult;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getDashboardData: async (courseId: string) => {
    try {
      const response = await axiosInstance.get(
        API.ENROLLEMENT.GET_COURSE_DASHBOARD(courseId),
      );
      return response.data.dashboardData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  filterGraph: async (courseId: string, filter: ChartFilter) => {
    try {
      const response = await axiosInstance.get(
        API.ENROLLEMENT.GET_FILTERED_GRAPH(courseId),
        {
          params: {
            filter,
          },
        },
      );

      return response.data.chartData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getMentorDashboardData: async (
  
    filter: string,
  ): Promise<IMentorDhasboardDTO> => {
    try {
      const response = await axiosInstance.get(
        API.ENROLLEMENT.GET_MENTOR_DASH_DATA,
        {
          params: { filter },
        },
      );
      return response.data.dashboardData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  graphForRevenue: async (filter: string, mentorId?: string) => {
    try {
      const response = await axiosInstance.get(
        API.ENROLLEMENT.GET_REVANUE_GRAPH,
        {
          params: { filter, mentorId },
        },
      );

      return response.data;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  adminGraphRevanue: async (filter: string) => {
    try {
      const response = await axiosInstance.get(
        API.ENROLLEMENT.GET_ADMIN_REVANUE_GRAPH,
        {
          params: { filter },
        },
      );

      return response.data;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  learnerDashboardData: async (
   
  ): Promise<learnerDashboardCardsDTO> => {
    try {
      const response = await axiosInstance.get(
        API.LEARNER.LEARNER_DASHBOARD,
      );
      return response.data.dashboardData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};
