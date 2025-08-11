
import { axiosInstance } from "@/axios/createInstance"
import { API } from "@/constants/api.constant"
import type { ICategory,ICategoryEdit,ICategoryTree } from "@/types/category.types"
import type { AxiosError } from "axios"


const categoryService={
    createCategory:async(title:string,parentId:string):Promise<ICategory>=>{
        
        try {
            const response=await axiosInstance.post(API.CATEGORY.CREATE_CATEGORY,{
                title:title,
                parentId:parentId?parentId:null
            })
           return response.data
        } catch (error) {
            const err=error as AxiosError<{error:string}>
            const errorMessage=err.response?.data.error
            throw new Error(errorMessage)
        }
    },
    listCategory:async():Promise<ICategoryTree[]>=>{
        try {
            const response=await axiosInstance.get(API.CATEGORY.LIST_CATEGORIES)
            return response.data.categories
        } catch (error) {
            const err=error as AxiosError<{error:string}>
            const errorMessage=err.response?.data.error
            throw new Error(errorMessage)
        }
    },
    editCategory:async(id:string,editData:ICategoryEdit):Promise<ICategory|null>=>{
        
        try {
            const parentId=editData.parentId==='none'?null:editData.parentId
            const response=await axiosInstance.put(API.CATEGORY.EDIT_CATEGORY(id),{title:editData.title,parentId:parentId})
            return response.data.editedData
        } catch (error) {
            const err=error as AxiosError<{error:string}>
            const errorMessage=err.response?.data.error
            throw new Error(errorMessage)
        }
    }
}

export default categoryService