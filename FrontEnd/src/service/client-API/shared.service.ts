import { AxiosError } from "axios";
import { axiosInstance } from "../../axios/createInstance";
import { API } from "@/constants/api.constant";

export const sharedService={
   getS3BucketUploadUrl:async(file:File):Promise<{uploadURL:string,fileURL:string}>=>{
    try {
        const response=await axiosInstance.get(API.SHARED.UPLOAD_PUT_PRESIGNED_URL,{
            params:{
                fileName:file.name,
                type:file.type
            }
        })
        return response.data
        
    } catch (error) {
        const err=error as  AxiosError <{error:string}>
        const errorMessage=err.response?.data.error
        throw new Error(errorMessage)
    }
   }
}


