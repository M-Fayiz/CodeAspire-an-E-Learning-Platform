import type { AxiosError } from "axios";
import { adminInstance } from "../../axios/createInstance";
import { API } from "../../constants/apiConstant";
import type { IUserType } from "../../types/profile.type";
import { searchFromParser } from "../../utility/parser.util";
import type { SearchQuery } from "../../types/parser.types";
interface fetchedUsers{
    users:IUserType[]
    totalPage:number
}


export const adminService={
    fetchAllUsers:async(page:number,searchQuery:SearchQuery):Promise<fetchedUsers>=>{
             const queryData=searchFromParser(searchQuery)
        try {
            const response=await adminInstance.get(API.ADMIN.FETCH_ALL_USERS,{
                params:{page,...queryData}
            })
            console.log(response?.data);
            
          return response?.data
        } catch (error) {
            const err=error as AxiosError<{error:string}>
            const errorMessage=err.response?.data.error
            throw new Error(errorMessage)
        }
    },
    blockUser:async(id:string):Promise<{isActive:boolean,id:string}>=>{
        try {  
            const response=await adminInstance.delete(API.ADMIN.BLOCK_USER(id))
          console.log(response.data.result);
          
          return response.data.result
        } catch (error) {
            const err=error as AxiosError<{error:string}>
            const errorMessage=err.response?.data.error
            throw new Error(errorMessage)
        }
    },
    userProfile:async(id:string):Promise<IUserType>=>{
        try {
            const response=await adminInstance.get(API.ADMIN.USER_PROFILE(id),{
                params:{id}
            })
       
           
            
            return response.data.userData
        } catch (error) {
            const err=error as AxiosError<{error:string}>
            const errorMessage=err.response?.data.error
            throw new Error(errorMessage)
        }
    }
}

export default adminInstance
