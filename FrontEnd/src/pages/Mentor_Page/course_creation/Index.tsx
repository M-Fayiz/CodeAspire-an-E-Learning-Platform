
import ManagementLayout from "@/components/layout/ManagementLayout"
import {useForm,FormProvider, type SubmitHandler} from 'react-hook-form'
import { BookPlus } from "lucide-react" 
import type { ICourseData } from "@/types/courses.types"
import courseService from "@/service/client-API/mentor/course.service"
import CourseForm from "@/components/Mentor/course-form/courseForm"

const CourseCreation=()=>{
    const methods = useForm<ICourseData>({
        defaultValues:{
            title: '',
            description: '',
            thumbnail: '',
            categoryId: '',
            subCategoryId:'',
            language:'',
            level: 'Beginner',
            price:0,
            mentorsId: '',
            isActive: false,
            isDraft: true,
            sessions:[
                {
                title:'',
                order:1,
                lectures:[
                    {
                    title:'',
                    lectureType:'video',
                    lecture:''
                    }
                ],
                review:false
                }
            ]
  
        }
    });

    const onSubmitForm: SubmitHandler<ICourseData> = (data) => {
        console.log('dattaattaa',data);
    };

    const saveDraft=async()=>{
        const draftData=methods.getValues()
        
        if(draftData.thumbnail instanceof FileList &&draftData.thumbnail.length>0){
            draftData.thumbnail=draftData.thumbnail[0]
        }
        const result=await courseService.createCourse(draftData)
      
       
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

                    
                    <CourseForm/>
                   
                </form>
            
            </ManagementLayout>
        </FormProvider>
        </>
    )
}

export default CourseCreation