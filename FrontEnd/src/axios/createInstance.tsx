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
      
       return response
       },
        // Error
        async(error:AxiosError)=>{

            const status = error.response?.status;
            const url = error.config?.url;
            const errorMessage=(error.response?.data as any).error
             
            console.warn(`⚠️ Interceptor caught error STSTUS:❌ ${status} | ERROR MESSAGE :⭕ ${errorMessage} | on URL :🔗 ${url}`);

            const originalRequest=error.config as any

            if(error.response?.status==401 && !originalRequest._retry){

                originalRequest._retry=true
                const refreshed = await AuthService.refreshToken();

                if (refreshed) {
                    return instance(originalRequest);
                } else {
       
                    window.dispatchEvent(new Event("force-logout"));
                } 
            }
            return Promise.reject(error)
        }   
    )

   
    return instance
}

export const authInstance=createInstance()
export const userInstance=createInstance()
export const adminInstance=createInstance()
