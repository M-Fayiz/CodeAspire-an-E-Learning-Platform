import type { CourseForm, ISession } from "@/types/courses.types";


import {  createContext, useContext, useState, type ReactNode } from "react";

interface FomrContextProps{
    formData:CourseForm
    upateBaseField:(e:{target:{name:string,value:string}})=>void
    addSession:(sessionData:ISession)=>void
}
const CourseFormCourseContext=createContext<FomrContextProps|null>(null)

const CourseFormProvider=({children}:{children:ReactNode})=>{
    const [formData,setFormData]=useState<CourseForm>({
        title:'',
        categoryId:'',
        language:'',
        level:'Beginner',
        price:'',
        mentorsId:'',
        subCategoryId:'',
        description:'',
        sessions:[{
            lectures:[{

                title:'',
                lectureType:'video',
                lecture:''
            }
            ],
            title:''
        }],
        thumbnail:'',
    })

    const upateBaseField=(e:{target:{name:string,value:string}})=>{
        const {name,value}=e.target
        setFormData(prv=>({...prv,[name]:value}))
    }
    const addSession=(sessionData:ISession)=>{
        setFormData(prv=>({...prv,sessions:[...(prv.sessions??[]),sessionData]}))
    }
    
    return(
        <CourseFormCourseContext.Provider value={{formData,upateBaseField,addSession}}>
            {children}
        </CourseFormCourseContext.Provider>
    )
}

export default CourseFormProvider

export const useCourseFormContext=()=>{
    const context=useContext(CourseFormCourseContext)
    return context
}