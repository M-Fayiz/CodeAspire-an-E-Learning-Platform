import React from 'react';

const CourseCardSkeleton = () => {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
     
      <div className="bg-gray-200 h-32 relative">
        {/* <div className="absolute top-4 left-4 w-3 h-3 bg-gray-300 rounded-full"></div> */}
        <div className="absolute bottom-2 left-6 w-20 h-6 bg-gray-300 rounded-sm"></div>
      </div>

     
      <div className="p-6">
       
        <div className="h-6 bg-gray-300 rounded mb-4 w-20"></div>
        
        
        <div className="flex justify-end mb-4">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>

        
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-300 rounded w-16"></div>
          <div className="h-10 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;