import { useState } from 'react';
import BasicCourseInformation from './BasicIformation';

import { ClipboardPen ,Layers,CloudUpload} from 'lucide-react';
import CourseCurriculum from './CourseCurriculum';
import DraftTable from './ProgressCourseCreation';
import Taps from '@/components/common/Taps';



export default function CourseCreateLayout () {
 
  const [activeTab, setActiveTab] = useState('basic');
  const [tap,setTaps]=useState(false)
  const handleActiveTap=(tap:string)=>{
    setActiveTab(tap)
  }
  const [savedCourseId,setSavedCourseId]=useState('')

  const handleSavedCourseId=(id:string)=>{
    setSavedCourseId(id)
    setActiveTab('curriculum')
  }

  
   

  return (
    <div className="w-full bg-white rounded-sm border ">
      <div className="overflow-x-auto">
        <div className="flex border-b border-gray-200 w-full overflow-x-auto scrollbar-hide snap-x">
          
          <Taps
            label='Basic Information'
            icon={<ClipboardPen className="text-gray-500 w-4 h-4 hidden md:block" />}
            Click={handleActiveTap}
            tap='basic'
            activeTap={activeTab}
          />
          <Taps
            label='Curriculum'
            icon={<Layers className="text-gray-500 w-4 h-4 hidden md:block" />}
            Click={handleActiveTap}
            tap='curriculum'
            activeTap={activeTab}
          />
          <Taps
            label='Publish Course'
            icon={<CloudUpload className="text-gray-500 w-4 h-4 hidden md:block" />}
            Click={handleActiveTap}
            tap='publish'
            activeTap={activeTab}
          />
          
        </div>
      </div>
      {activeTab === 'basic' ? (
        <BasicCourseInformation courseId={handleSavedCourseId} handleTap={handleActiveTap} />
      ) : activeTab === 'curriculum' ?(
        <CourseCurriculum courseId={savedCourseId}/>
      ): activeTab=='draft'?(
         <DraftTable/>
      ):(
       <p>nothing</p>
      )}
    </div>

  );
}