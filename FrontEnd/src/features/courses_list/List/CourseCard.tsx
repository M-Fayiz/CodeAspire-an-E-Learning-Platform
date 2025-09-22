import type { ICourseData } from "@/types/DTOS/courses.types";

interface CourseCardProps {
  course: ICourseData;
}
const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={course.thumbnail as string}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* <div className="absolute top-3 right-3">
          <button 
            onClick={onFavoriteToggle}
            className={`p-2 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600'} hover:scale-110 transition-all`}
          >
            <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div> */}
        <div className="absolute bottom-3 left-3">
          {course.isEnrolled && (
            <span className="bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs font-medium">
              {/* {course.category} */}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        {/* <p className="text-sm text-gray-600 mb-3">{course.mentorsId}</p> */}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {/* <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium ml-1">{rating}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Users className="w-4 h-4" />
              <span className="text-sm ml-1">{students.toLocaleString()}</span>
            </div> */}
          </div>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {course.level}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-orange-600">
              ₹{course.price}
            </span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
