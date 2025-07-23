
import { categoryInstance } from "@/axios/createInstance"
import { API } from "@/constants/apiConstant"
import type { ICategory,ITree } from "@/types/category.types"
import type { AxiosError } from "axios"

const categoryService={
    createCategory:async(title:string,parentId:string):Promise<ICategory>=>{
        try {
            const response=await categoryInstance.post(API.CATEGORY.CREATE_CATEGORY,{
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
    listCategory:async():Promise<ITree[]>=>{
        try {
            const response=await categoryInstance.get(API.CATEGORY.LIST_CATEGORIES)
          
            return response.data.categories
        } catch (error) {
            const err=error as AxiosError<{error:string}>
            const errorMessage=err.response?.data.error
            throw new Error(errorMessage)
        }
    }
}

export default categoryService