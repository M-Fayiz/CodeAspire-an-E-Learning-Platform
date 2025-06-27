import type { AxiosError } from "axios";
import { userInstance } from "../../axios/createInstance";
import { API } from "../../constants/apiConstant";
import type{ IUserType } from "../../types/profile.type";



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
         console.log('error message from change',errorMessage)
         throw new Error (errorMessage)
      }
   }

}

export default UserService