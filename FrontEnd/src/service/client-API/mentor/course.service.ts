import { axiosInstance } from "@/axios/createInstance"
import { API } from "@/constants/api.constant"
import type { ICourseData, ICourseDTO, ISession } from "@/types/courses.types"
import type { AxiosError } from "axios"
import { sharedService } from "../shared.service"
import { S3BucketUtil } from "@/utility/S3Bucket.util"





const  courseService={
    createCourse:async(courseData:Partial<ICourseData>):Promise<ICourseData>=>{
        try {
            if(courseData.thumbnail){
                const uploadAndFileUrl=await sharedService.getS3BucketUploadUrl(courseData.thumbnail as File)
                 await S3BucketUtil.uploadToS3(uploadAndFileUrl.uploadURL,courseData.thumbnail as File)
                if(uploadAndFileUrl&&uploadAndFileUrl.fileURL){
                    courseData.thumbnail=uploadAndFileUrl.fileURL as string
                }
            }
            const response=await axiosInstance.post(API.COURSE.CREATE_COURSE,{courseData})
            return response.data.createdCourseData
            
        } catch (error) {
            const err=error as AxiosError<{error:string}> 
            const errorMessage=err.response?.data?.error  || 'Something Went wrong Please try again'
            throw new Error(errorMessage)
        }
    },
    fetchCourses:async():Promise<ICourseData[]|null>=>{
        try {
            const response=await axiosInstance.get(API.COURSE.FETCH_COURSES)
            
            return response.data.courseListData
        } catch (error) {
            const err=error as AxiosError<{error:string}> 
            const errorMessage=err.response?.data?.error  || 'Something Went wrong Please try again'
            throw new Error(errorMessage)
        }
    },
    addSessions:async(courseId:string,sessios:Partial<ISession>):Promise<ICourseData>=>{
        try {
            const response=await axiosInstance.put(API.COURSE.ADD_OR_UPDATE_SESSION(courseId,'sessions'),{
                ...sessios
            })
            return response.data.updatedCourseData
        } catch (error) {
            const err=error as AxiosError<{error:string}> 
            const errorMessage=err.response?.data?.error  || 'Something Went wrong Please try again'
            throw new Error(errorMessage)
        }
    },
        // getCourse:async(courseId:string):Promise<ICourseDTO[]|null>=>{
        //     try {
        //         if(!courseId) return null
        //         const response=await axiosInstance.get(API.COURSE.GET_COURSE(courseId))
        //         return response.data.course
        //     } catch (error) {
        //         const err=error as AxiosError<{error:string}> 
        //         const errorMessage=err.response?.data?.error  || 'Something Went wrong Please try again'
        //         throw new Error(errorMessage)
        //     }
        // },
    getMentorDraftedCourse:async(userId:string):Promise<ICourseDTO[]>=>{
        
        try {
            const response=await axiosInstance.get(API.COURSE.GET_MENTOR_DRAFTED_COURSE,{
                params: { mentorId: userId  },
            })
            console.log(userId,'reawsf',response.data)
            return response.data.draftCoursList
        } catch (error) {
            const err=error as AxiosError<{error:string}> 
            const errorMessage=err.response?.data?.error  || 'Something Went wrong Please try again'
            throw new Error(errorMessage)
        }
    }

}

export default courseService