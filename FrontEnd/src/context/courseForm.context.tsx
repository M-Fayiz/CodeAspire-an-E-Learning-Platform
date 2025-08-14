import { createContext, useContext, useState, type ReactNode } from "react";
import { courseFormSchema } from "@/schema/courseForm.schema";
import type { CourseForm, ILecture, ISession } from "@/types/courses.types";
import courseService from "@/service/client-API/mentor/course.service";
import { useAuth } from "./auth.context";
import { toastService } from "@/config/Toast.config";

interface FomrContextProps {
  formData: CourseForm;
  updateBaseField: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  addSession: (sessionData: ISession[]) => void;
  OnSubmit: (e: React.FormEvent) => void;
  setField?: (name: string, value: string) => void;
  zodError:{[key:string]:string}
  courseId:string
}
const CourseFormCourseContext = createContext<FomrContextProps | undefined>(
  undefined,
);

const CourseFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<CourseForm>({
    id: "",
    title: "",
    categoryId: "",
    language: "",
    level: "Beginner",
    price: "",
    mentorsId: "",
    subCategoryId: "",
    description: "",
    sessions: [
    ],
    thumbnail: "",
  });
  const [zodError,setErrors]=useState<{[key:string]:string}>({})
  const [courseId,setCourseId]=useState('')
  const {user}=useAuth()

  const updateBaseField = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, type, value } = e.target;
    setFormData((prv) => ({
      ...prv,
      [name]:
        type == "file" ? (e.target as HTMLInputElement).files?.[0] : value,
    }));
  };
  const setField = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const addSession = (sessionData: ISession[]) => {
    setFormData((prv) => ({
      ...prv,
      sessions: sessionData,
    }));
  };
  const addLecture=(sessionId:string,lecture:ILecture)=>{

  }
  const OnSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors:Record<string,string>={}
    try {
        const courseData=courseFormSchema.safeParse(formData)
       
        if(!courseData.success){

            courseData.error.issues.forEach(err=>{
                const fieldName=err.path.join('.')
                fieldErrors[fieldName]=err.message
            })
            setErrors(fieldErrors)
          return
        }
        console.log('🚝🚝',courseData.data)
        const savedCourseData=await courseService.createCourse({...courseData.data,mentorsId:user!.id})
        if(savedCourseData._id){
          console.log('courseId',savedCourseData._id)
          setCourseId(savedCourseData._id)
        }
    } catch (error) {
        if(error instanceof Error){
          toastService.error(error.message)
        }
    }
};
console.log(formData);
  return (
    <CourseFormCourseContext.Provider
      value={{ formData, updateBaseField, addSession, OnSubmit, setField,zodError,courseId }}
    >
      {children}
    </CourseFormCourseContext.Provider>
  );
};

export default CourseFormProvider;

export const useCourseFormContext = () => {
  const context = useContext(CourseFormCourseContext);
  if (!context) {
    throw new Error(
      "useCourseFormContext must be used inside a CourseFormProvider",
    );
  }
  return context;
};
