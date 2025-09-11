import type { IEnrolledListDto } from "@/types/DTOS/enrollements.dto";
import { MoreVertical, Play } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

interface EnrolledCourseProps {
  course: IEnrolledListDto;
}
const EnrolledCourseCart: React.FC<EnrolledCourseProps> = ({ course }) => {
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  
  const {sessionCount ,lectureCount}=useMemo(()=>{
    let sessionCount=0
  let lectureCount=0
 
    for(let session of course.course.sessions){
    sessionCount++
    lectureCount+=session.lectures.length
  }
  return {sessionCount,lectureCount}
    
  },[course])
  return (
    <>
      <div
        key={course._id}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
        onMouseEnter={() => setHoveredCourse(course?._id as string)}
        onMouseLeave={() => setHoveredCourse(null)}
      >
        <div className="relative">
          <img
            src={course.course.thumbnail as string}
            alt={course.course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {hoveredCourse === course._id && (
            <div className="absolute inset-0 bg-black opacity-40 flex items-center justify-center transition-opacity duration-300">
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
                <Play className="w-5 h-5" />
                Continue Learning
              </button>
            </div>
          )}

          <button className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              {course.course.category.title}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.course.level)}`}
            >
              {course.course.level}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.course.title}
          </h3>

          {/* Instructor */}
          {/* <div className="flex items-center gap-3 mb-4">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-600">{course.instructor}</span>
              </div> */}

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {course.completedPercentage}% Complete
              </span>
              <span className="text-xs text-gray-500">
                {sessionCount}/{lectureCount} lessons
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.completedPercentage}%` }}
              />
            </div>
          </div>

          {/* Rating and Stats */}
          {/* <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(course.rating)}
                  <span className="text-sm font-medium text-gray-700 ml-1">
                    {course.rating}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({course.totalRatings.toLocaleString()})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{course.duration}</span>
                </div>
              </div> */}

          {/* Last Accessed */}
          {/* <div className="text-xs text-gray-500 mb-4">
                Last accessed {course.lastAccessed}
              </div> */}

          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Play className="w-4 h-4" />
            Continue Course
          </button>
        </div>
      </div>
    </>
  );
};
export default EnrolledCourseCart;
