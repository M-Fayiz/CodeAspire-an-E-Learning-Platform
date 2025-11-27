import ManagementLayout from "@/components/layout/ManagementLayout";
import { BookPlus } from "lucide-react";

import CourseCreateLayout from "@/features/mentor/course/courseCreation/courseForm";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCourseFormContext } from "@/context/courseForm.context";
import courseService from "@/service/mentor/course.service";
  
// import CourseFormProvider from "@/context/courseForm.context";

const CourseCreation = () => {
  const [searchParams] = useSearchParams();
  const { courseId,setFormData ,resetForm} = useCourseFormContext();
  const editId = searchParams.get('edit');

  console.log('. > > > ',editId)
 
    useEffect(() => {
      if(editId){
        (async()=>{
          const CourseData=await courseService.getCourseFormData(editId as string)
          
          if(CourseData){
            setFormData(CourseData )
           
          }
        })()
      }else{
        resetForm()
      }
  }, [editId,courseId]);
  return (
    <>
      <ManagementLayout
        title="Create  Course "
        description=" Create your new Course Here"
        icon={<BookPlus className="h-10 w-10 text-gray-700" />}
      >
        <CourseCreateLayout />
      </ManagementLayout>
    </>
  );
};

export default CourseCreation;
