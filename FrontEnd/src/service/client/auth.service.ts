import type {  AxiosError } from "axios";
import { authInstance } from "../../axios/createInstance";
import type{ ILogin, ISignUp } from "../../types/auth.types";
import { API } from "../../constants/apiConstant";
import { HttpError } from "../../utility/error.util";
import type { UserRole } from "../../types/auth.types";


export const  AuthService={
     signUp:async(data:ISignUp):Promise<{status:number,message:string,email:string}> =>{
          try {
            
            const response=await authInstance.post(API.Auth.SIGNUP_URL,data)
            
            return response.data
          } catch (error:unknown) {
            const err=error as AxiosError<{error:string}> 
            console.log('error',err)
            const errorMessage=err.response?.data?.error ||'Registration Failed, Please try again '
           
            throw new Error(errorMessage)
         
          }
     }
     ,verifyEmail:async(email:string|null,token:string|null):Promise<{status:number,message:string}>=>{
          try {
            console.log('verify email auth service')
            const response=await authInstance.post(API.Auth.VERIFY_EMAIL_URL,{token,email})
            console.log('verify email ',response)
            return response.data.message
            
          } catch (error) {
            const err=error as AxiosError<{error:string}>
            const errorMessage=err.response?.data.error||'Failed, something went wrong please try again'
            throw new Error(errorMessage)
          }
     },
     authME:async():Promise<{id : string,
      email : string,
      role : UserRole}>=>{
        console.log('auth me load..')
      try {
        const response=await authInstance.post(API.Auth.AUTH_URL,{withCredentials:true})
        return response.data?.user
            
      } catch (error) {
          const err=error as AxiosError<{error:string}>
          const errorMessage=err.response?.data?.error || 'Something Went wrong Please try again'
          throw new Error(errorMessage)
      }
     },

    //  axios interseptor
    refreshToken:async():Promise<{ id: string, email: string, role: string } | null>=>{
      try {
        const response=await authInstance.post(API.Auth.REFRESH_TOKEN_URL)
        return response?.data.user
      } catch (error) {
        const err=error as AxiosError<{error:string}>
        const errorMessage=err.response?.data.error
        throw new Error(errorMessage)
      }
    },
    login:async(data:ILogin):Promise<{status:number,message:string, id: string, email: string, role: string}>=>{
        try {
          const response=await authInstance.post(API.Auth.LOGIN_URL,data)
          
          return response?.data

        } catch (error) {
          const err=error as AxiosError<{error:string}>
          const errorMessage=err.response?.data?.error||'Something went wrong '
          const statusCode=err.response?.status||500
          console.log('error ',errorMessage)
          console.log('status',statusCode)
          throw new HttpError(statusCode,errorMessage)
        }
    },
    logOut:async()=>{
      try {
        const response=await authInstance.post(API.Auth.LOGOUT_URL)
              
             if(response.status==200) return true
      } catch (error) {
         const err=error as AxiosError<{error:string}>
        const errorMessage=err.response?.data.error
        throw new Error(errorMessage)
      }
    }


}