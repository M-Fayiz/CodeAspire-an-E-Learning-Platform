
import ManagementLayout from "@/components/layout/ManagementLayout"
import CourseBasicInfoForm from "@/components/Mentor/course-form/courseForm"
import {useForm,FormProvider, type SubmitHandler} from 'react-hook-form'

import { BookPlus } from "lucide-react" 
import type { ICourseData } from "@/types/courses.types"
const CourseCreation=()=>{
    const methods = useForm<ICourseData>({
    defaultValues: formData,
    });

    const onSubmitForm: SubmitHandler<ICourseData> = (data) => {
        console.log('dattaattaa',data);
    };

    const saveDraft=()=>{
        const draftData=methods.getValues()
    }

    return (
        <>
        <FormProvider {...methods}>
            <ManagementLayout 
                title="Create  Course "
                description=" Create your new Course Here"
                icon={<BookPlus className="h-10 w-10 text-gray-700"/>}
            >
                <form onSubmit={methods.handleSubmit(onSubmitForm)} >
                    
                    <CourseBasicInfoForm/>
                </form>
            
            </ManagementLayout>
        </FormProvider>
        </>
    )
}

export default CourseCreation