import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type { IEnrolledListDto } from "@/types/DTOS/enrollements.dto";
import type { AxiosError } from "axios";


export const EnrolledService={
    getEnrolledCourse:async(learnerId:string):Promise<IEnrolledListDto[]>=>{
        try {
            const response=await axiosInstance.get(API.ENROLLEMENT.GET_ENROLLED_COURSE(learnerId))
            return response.data.enrolledCourseData
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
                  const errorMessage =
                    err.response?.data?.error || "Registration Failed, Please try again ";
            
                  throw new Error(errorMessage);
        }
    }
}