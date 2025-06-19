import axios, { AxiosError} from "axios";
import type { AxiosInstance } from "axios";
import { AuthService } from "../service/client/auth.service";

const createInstance = ():AxiosInstance=>{
    const instance=axios.create({
        baseURL:import.meta.env.VITE_BASE_URL,
        withCredentials:true
    })

    instance.interceptors.response.use(
        // Success
       (response)=>{
        console.log('✅ interceptor',response)
       return response
       },
        // Error
        async(error:AxiosError)=>{
            const originalRequest=error.config as any

            if(error.response?.status==401 && !originalRequest._retry){
                originalRequest._retry=true

                try {
                    await AuthService.refreshToken()
                    return instance.request(originalRequest)
                } catch (refreshError) {
                    await AuthService.logOut()
                    
                    return Promise.reject(refreshError)
                }
            }
            return Promise.reject(error)
        }   
    )

   
    return instance
}

export const authInstance=createInstance()
