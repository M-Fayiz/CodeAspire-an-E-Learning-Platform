import type { IFormCourse, IFormCourseDTO } from "@/types/DTOS/courses.dto.types";
import { Users } from "lucide-react";

interface HeroSectionProps {
  courses: IFormCourseDTO;
}

function HeroSection({ courses }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-r from-blue-100 via-blue-50 to-purple-50 px-6 py-2 ">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 max-w-2xl">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {courses.category.title}
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {courses.title}
          </h1>

          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            {courses.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-6">
            {/* <div className="flex items-center gap-2">
              <div className="flex items-center">{renderStars(rating)}</div>
              <span className="font-semibold text-gray-900">{rating}</span>
              <span className="text-gray-600">
                ({totalRatings.toLocaleString()} ratings)
              </span>
            </div> */}

            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              {/* <span>{totalStudents.toLocaleString()} students</span> */}
            </div>
          </div>

          {/* Course Meta */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-6">
            <div>
              <span className="font-medium text-gray-900">Level:</span>
              <div>{courses.level}</div>
            </div>
            {/* <div> */}
            {/* <span className="font-medium text-gray-900">Duration:</span> */}
            {/* <div>{totalDuration}</div> */}
            {/* </div> */}
            <div>
              <span className="font-medium text-gray-900">sessions:</span>
              <div>{courses.sessions.length}</div>
            </div>
            <div>
              <span className="font-medium text-gray-900">Language:</span>
              <div>{courses.language}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              {/* <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-10 h-10 rounded-full object-cover"
                /> */}
              <div>
                <div className="font-medium text-gray-900">
                  {/* {courses.mentorsId.name} */}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* {price !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${price}
                  </span>
                  {originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ${originalPrice}
                    </span>
                    {}
                  )} */}
            {/* </div> */}

            {/* <button
                onClick={onEnroll}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Enroll Now
              </button> */}
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={courses.thumbnail}
              alt={courses.thumbnail}
              className="w-80 h-64 object-cover rounded-2xl shadow-xl"
            />
            {/* {!isEnrolled && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 shadow-lg transition-all">
                  <Play className="w-8 h-8 text-blue-600 ml-1" />
                </button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
