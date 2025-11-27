import { useCourseFormContext } from "@/context/courseForm.context";
import type { CourseDashboardDTO } from "@/types/DTOS/courseDashboard.dto.type";

import { Eye, Star, TrendingUp, Users } from "lucide-react";
import type React from "react";

import { useNavigate } from "react-router";
interface courseDashboardProps {
  courseData: CourseDashboardDTO;
}
const DashBoardHeader: React.FC<courseDashboardProps> = ({ courseData }) => {
  const { setCourseId } = useCourseFormContext();

  const navigate = useNavigate();
  const create = () => {
    setCourseId(courseData.course._id);
    navigate(`/mentor/courses/create?edit=${courseData.course._id}`);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {courseData.course.title}
              </h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {courseData.course.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              {/* Last updated {courseData.lastUpdated} */}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-semibold text-gray-900">
                  {courseData.enrolledStudents}
                </span>
                <span>total students</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900">
                  {courseData.avgRating}
                </span>
                {/* <span>({courseData.totalReviews} reviews)</span> */}
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold text-gray-900">
                  ${courseData.revenue.mentor}
                </span>
                <span>revenue</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={create}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview Course & edit Course
            </button>
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Edit3 className="w-4 h-4" />
              Edit Course
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardHeader;
