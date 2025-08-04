import { courseInstance } from "@/axios/createInstance"
import { API } from "@/constants/api.constant"
import type { ICourseData } from "@/types/courses.types"
import type { AxiosError } from "axios"
import { sharedService } from "../shared.service"
import { file } from "zod"




const  courseService={
    createCourse:async(courseData:Partial<ICourseData>)=>{
        try {
            if(courseData.thumbnail){
                const uploadAndFileUrl=await sharedService.getS3BucketUploadUrl(courseData.thumbnail as File)
                if(uploadAndFileUrl&&uploadAndFileUrl.fileURL){
                    courseData.thumbnail=uploadAndFileUrl.fileURL as string
                }
            }
            const response=await courseInstance.post(API.COURSE.CREATE_COURSE,{courseData})
            return response.data.createdCourseData
            
        } catch (error) {
            const err=error as AxiosError<{error:string}> 
            const errorMessage=err.response?.data?.error  || 'Something Went wrong Please try again'
            throw new Error(errorMessage)
        }
    }
}

export default courseService