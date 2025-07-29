import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/Inputs';
import categoryService from '@/service/client-API/admin/category.service';
import type { ICategoryTree } from '@/types/category.types';
import Combobox from '@/components/ui/SelectWithSearch';
import { COURSE_LEVEL } from '@/constants/courseInputs.constant';
import { COURSE_LANGUAGE } from '@/constants/courseInputs.constant';
import courseService from '@/service/client-API/mentor/course.service';
import type { ICourseData } from '@/types/courses.types';
import { useAuth } from '@/context/auth.context'; 
import ImageUploadPreview from '@/components/ui/ImageFile';
import { useCourseForm } from '@/context/courseForm.context';
import { useFormContext ,Controller} from 'react-hook-form';
import BasicCourseInformation from './BasicIformation';


export default function CourseBasicInfoForm() {

  const {register,formState:{errors}}=useFormContext()

 
  const {user}=useAuth()
  const [categories,setCategories]=useState<ICategoryTree[]>([])
  const [subCategory,setSubCategory]=useState<ICategoryTree[]>([])

  useEffect(()=>{
    const fetchCategories=async()=>{
      const result=await categoryService.listCategory()
      if(result){
        setCategories(result)
      }
    }
    fetchCategories()
  },[])
  
  const [activeTab, setActiveTab] = useState('basic');


  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-sm border ">
      
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 ${
            activeTab === 'basic'
              ? 'border-blue-500 text-gray-900 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="mr-1">📝</span>
          Basic Information
        </button>
        <button
          onClick={() => setActiveTab('advance')}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
            activeTab === 'advance'
              ? 'border-blue-500 text-gray-900 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="mr-2">📊</span>
          Advance Information
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
            activeTab === 'curriculum'
              ? 'border-blue-500 text-gray-900 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="mr-2">📚</span>
          Curriculum
        </button>
        <button
          onClick={() => setActiveTab('publish')}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
            activeTab === 'publish'
              ? 'border-blue-500 text-gray-900 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="mr-2">🚀</span>
          Publish Course
        </button>
      </div>
       
    
      <BasicCourseInformation/>
    </div>
  );
}