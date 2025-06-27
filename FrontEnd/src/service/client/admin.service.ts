import type { AxiosError } from "axios";
import { adminInstance } from "../../axios/createInstance";
import { API } from "../../constants/apiConstant";
import type { IUserType } from "../../types/profile.type";

export const adminService={
    fetchAllUsers:async():Promise<IUserType[]>=>{
        try {
            const response=await adminInstance.get(API.ADMIN.FETCH_ALL_USERS)
          return response?.data.allUsers
        } catch (error) {
            const err=error as AxiosError<{error:string}>
            const errorMessage=err.response?.data.error
            throw new Error(errorMessage)
        }
    },
    blockUser:async(id:string):Promise<{isActive:boolean,id:string}>=>{
        try {
            const response=await adminInstance.delete(API.ADMIN.BLOCK_USER(id))
          return response.data
        } catch (error) {
            const err=error as AxiosError<{error:string}>
            const errorMessage=err.response?.data.error
            throw new Error(errorMessage)
        }
    }
}

export default adminInstance
