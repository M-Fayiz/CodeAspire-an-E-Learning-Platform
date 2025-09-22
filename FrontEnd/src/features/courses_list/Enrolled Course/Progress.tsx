import React from 'react';
import { Check, Circle } from 'lucide-react';
import type { ICourseProgess } from '@/types/DTOS/enrollements.dto';



interface CurriculumProgressProps {
 progress:ICourseProgess
}

const CurriculumProgress: React.FC<CurriculumProgressProps> = ({ 
  progress
}) => {

  const totalChapters = modules.reduce((acc, module) => acc + module.chapters.length, 0);
  const completedChapters = modules.reduce((acc, module) => 
    acc + module.chapters.filter(chapter => chapter.completed).length, 0
  );

  const progressPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
     
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500 font-medium">
          {completedChapters}/{totalChapters}
        </span>
      </div>

    
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{progressPercentage}% Complete</p>
      </div>

      
      <div className="space-y-1">
        {modules.map((module, moduleIndex) => (
          <div key={module.id}>
           
            <div className="flex items-center py-2">
              <div className="flex-shrink-0 mr-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">
                    M{moduleIndex + 1}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-800">{module.title}</h3>
            </div>

          
            {module.chapters.map((chapter, chapterIndex) => (
              <div key={chapter.id} className="flex items-center py-3 ml-4 border-l-2 border-gray-100">
                <div className="flex-shrink-0 mr-3 -ml-1">
                  {chapter.completed ? (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                      <Circle className="w-3 h-3 text-gray-300" fill="currentColor" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${
                    chapter.completed 
                      ? 'text-gray-900 font-medium' 
                      : 'text-gray-500'
                  }`}>
                    {chapter.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

     
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
          Continue Learning
        </button>
      </div>
    </div>
  );
};

export default CurriculumProgress

