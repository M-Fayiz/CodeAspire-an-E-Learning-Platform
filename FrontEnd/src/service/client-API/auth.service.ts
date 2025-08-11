import type {  AxiosError } from "axios";
import { axiosInstance } from "../../axios/createInstance";
import type{ IDecodedUserType, ILogin, ISignUp } from "../../types/auth.types";
import { API } from "../../constants/api.constant";
import type { UserRole } from "../../types/auth.types";


export const  AuthService={
  signUp:async(data:ISignUp):Promise<{status:number,message:string,email:string}> =>{
    try {
            
     const response=await axiosInstance.post(API.Auth.SIGNUP_URL,data)
     return response.data
    } catch (error:unknown) {
      const err=error as AxiosError<{error:string}> 
      const errorMessage=err.response?.data?.error ||'Registration Failed, Please try again '
           
      throw new Error(errorMessage)
         
    }
  }
  ,verifyEmail:async(email:string|null,token:string|null):Promise<{status:number,message:string}>=>{
    try {
      console.log('verify email auth service')
      const response=await axiosInstance.post(API.Auth.VERIFY_EMAIL_URL,{token,email})
      console.log('verify email ',response.data)
      return response.data.message
            
    } catch (error) {
      const err=error as AxiosError<{error:string}>
      const errorMessage=err.response?.data.error||'Failed, something went wrong please try again'
      throw new Error(errorMessage)
    }
  },
  authME:async():Promise<IDecodedUserType>=>{
    console.log('auth me load..')
    try {
      const response=await axiosInstance.post(API.Auth.AUTH_URL,{},{withCredentials:true})
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
      const response=await axiosInstance.get(API.Auth.REFRESH_TOKEN_URL,{withCredentials: true})
      return response?.data.user
    } catch (error) {
      const err=error as AxiosError<{error:string}>
      const errorMessage=err.response?.data.error
      throw new Error(errorMessage)
    }
  },
  login:async(data:ILogin):Promise<{status:number,message:string, id: string, email: string, role: string}>=>{
    try {
      const response=await axiosInstance.post(API.Auth.LOGIN_URL,data)
          
      return response?.data

    } catch (error) {
      const err=error as AxiosError<{error:string}>
      const errorMessage=err.response?.data?.error||'Something went wrong '
      // const statusCode=err.response?.status||500
      
      
      throw new Error(errorMessage)
    }
  },
  logOut:async()=>{
    try {
    const response=await axiosInstance.post(API.Auth.LOGOUT_URL,{},{withCredentials:true})
             
      if(response.status==200) return true
    } catch (error) {
      const err=error as AxiosError<{error:string}>
      const errorMessage=err.response?.data.error
      throw new Error(errorMessage)
    }
  },
    googleAuth:async(role:UserRole):Promise<void>=>{
      try {
        window.location.href=`${import.meta.env.VITE_BASE_URL}/auth/google?role:${role}`
        
      } catch (error) {
        const err=error as AxiosError<{error:string}>
        const errorMessage=err.response?.data.error
        throw new Error(errorMessage)
      }
    },
    forgotPassword:async(email:string):Promise<{status:number,message:string,email:string}>=>{
      try {
        const response=await axiosInstance.post(API.Auth.FORGOT_PASSWORD_URL,{email})
        return response.data?.email
      } catch (error) {
        const err=error as AxiosError<{error:string}>
        const errorMessage=err.response?.data.error
        throw new Error(errorMessage)
      }

    },
    resetPassword:async(email:string,token:string,password:string):Promise<{status:number,message:string,email:string}>=>{
       try {
        const response=await axiosInstance.patch(API.Auth.RESET_PASSWORD_URL,{email,token,password})
        return response?.data
       } catch (error) {
        const err=error as AxiosError<{error:string}>
        const errorMessage=err.response?.data.error
        throw new Error(errorMessage)
       }
    }


}