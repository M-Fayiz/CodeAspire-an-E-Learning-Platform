import { courseInstance } from "@/axios/createInstance"
import { API } from "@/constants/api.constant"
import type { ICourseData } from "@/types/courses.types"
import type { AxiosError } from "axios"




const  courseService={
    createCourse:async(courseData:ICourseData)=>{
        try {
            const response=await courseInstance.post(API.COURSE.CREATE_COURSE,{courseData})
            
        } catch (error) {
            const err=error as AxiosError<{error:string}> 
            const errorMessage=err.response?.data?.error  || 'Something Went wrong Please try again'
            throw new Error(errorMessage)
        }
    }
}

export default courseService