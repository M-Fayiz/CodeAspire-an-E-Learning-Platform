import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type {
  ICourseProgess,
  IEnrolledCoursedetailsDTO,
  IEnrolledListDto,
} from "@/types/DTOS/enrollements.dto";
import { sharedService } from "../shared.service";
import { throwAxiosError } from "@/utility/throwErrot";
import type { ChartFilter } from "@/types/enrollent.types";
import type { IMentorDhasboardDTO } from "@/types/DTOS/mentorDashboard.dto";

export const EnrolledService = {
  getEnrolledCourse: async (learnerId: string): Promise<IEnrolledListDto[]> => {
    try {
      const response = await axiosInstance.get(
        API.ENROLLEMENT.GET_ENROLLED_COURSE(learnerId),
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
      console.log("enrolled ", response.data);
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
  ): Promise<ICourseProgess> => {
    try {
      const response = await axiosInstance.put(
        API.ENROLLEMENT.UPDATE_PROGRESS(enrolledId),
        { lectureId },
      );
      console.log(response.data);
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
  getDashboardData: async (courseId: string, mentorId: string) => {
    try {
      const response = await axiosInstance.get(
        API.ENROLLEMENT.GET_COURSE_DASHBOARD(courseId, mentorId),
      );
      return response.data.dashboardData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  FilterGraph: async (
    courseId: string,
    filter: ChartFilter,
    startData?: Date,
    endDate?: Date,
  ) => {
    console.log(" filter ", filter);
    try {
      const response = await axiosInstance.get(
        API.ENROLLEMENT.GET_FILTERED_GRAPH(courseId),
        {
          params: {
            filter,
            startData,
            endDate,
          },
        },
      );

      return response.data.chartData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getMentorDashboardData: async (
    mentorId: string,
  ): Promise<IMentorDhasboardDTO> => {
    try {
      const response = await axiosInstance.get(
        API.ENROLLEMENT.GET_MENTOR_DASH_DATA(mentorId),
      );
      return response.data.dashboardData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};
