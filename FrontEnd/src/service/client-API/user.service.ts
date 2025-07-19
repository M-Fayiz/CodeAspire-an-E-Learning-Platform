import type { AxiosError } from "axios";
import { userInstance } from "../../axios/createInstance";
import { API } from "../../constants/apiConstant";
import type{ IUserType } from "../../types/profile.type";
import type { IMentorProps } from "../../types/mentor.types";
import { S3BucketUtil } from "../../utility/S3Bucket.util";

const UserService={
   fetchProfile:async(email:string):Promise<IUserType>=>{
     try {
      
        const response=await userInstance.get(API.USER.FETCH_USER_PROFILE,{params:{email}})
        return response.data.userData
     } catch (error) {
       
         const err=error as AxiosError <{error:string}>
         const errorMessage=err.response?.data.error
         throw new Error (errorMessage)
     }
   },
   changePassword:async(id:string,currentPassword:string,newPassword:string):Promise<{status:number,message:string}>=>{
      try {
         const response=await userInstance.patch(API.USER.CHANGE_PASSWORD(id),{currentPassword,newPassword})
         return response.data
      } catch (error) {
         const err=error as AxiosError <{error:string}>
         const errorMessage=err.response?.data.error
         throw new Error (errorMessage)
      }
   },
   uploadImageIntoS3:async(uploadURL:string,fileURL:string,file:File,userId:string)=>{
         try {
           await S3BucketUtil.uploadToS3(uploadURL,file)
           const response= await userInstance.put(API.USER.UPDATE_PROFILE_PICTURE(userId),{imageURL:fileURL})
           return await S3BucketUtil.getPreSignedURL(response.data.imgURL)
         } catch (error) {
           const err=error as  AxiosError <{error:string}>
           const errorMessage=err.response?.data.error
           throw new Error(errorMessage)
         }
   },
   updateMentorInformation:async(mentorId:string,mentorData:IMentorProps)=>{
      try {
         if(mentorData.resume){
            const result=await S3BucketUtil.putPreSignedURL(mentorData.resume)
            await S3BucketUtil.uploadToS3(result.uploadURL,result.fileURL)
            mentorData.resume=result.fileURL
            const response=await userInstance.put(API.USER.UPDATE_MENTOR_PROFILE(mentorId),{...mentorData,isRequested:true})
            console.log(response.data)
            return response.data
         }
      } catch (error) {
         const err=error as  AxiosError <{error:string}>
         const errorMessage=err.response?.data.error
         throw new Error(errorMessage)
      }
   }


}

export default UserService