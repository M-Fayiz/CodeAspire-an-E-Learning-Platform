import { useState } from 'react';
import BasicCourseInformation from './BasicIformation';
import CourseCurriculum from './Carriculum/CourseCurriculum';
import { ClipboardPen ,Layers,CloudUpload} from 'lucide-react';

export default function CourseBasicInfoForm() {
 
  const [activeTab, setActiveTab] = useState('basic');


  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-sm border ">
      
      <div className="flex border-b border-gray-200">
        <button
         type='button'
          onClick={() => setActiveTab('basic')}
          className={`flex items-center gap-1.5 px-4 py-4 text-sm font-medium border-b-2 ${
            activeTab === 'basic'
              ? 'border-blue-500 text-gray-900 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ClipboardPen className='text-gray-500 w-5 h-5'/>
          Basic Information
        </button>
        <button
        type='button'
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-1.5 px-6 py-4 text-sm font-medium border-b-2 ${
            activeTab === 'curriculum'
              ? 'border-blue-500 text-gray-900 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layers className='text-gray-500 w-4 h-4'/>
          Curriculum
        </button>
        <button
        type='button'
          onClick={() => setActiveTab('publish')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
            activeTab === 'publish'
              ? 'border-blue-500 text-gray-900 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <CloudUpload className='text-gray-500 w-5 h-5'/>
          Publish Course
        </button>
      </div>
       
      {activeTab=='basic'?(
        <BasicCourseInformation/>
      ):(
        <CourseCurriculum/>
      )}
      
    </div>
  );
}