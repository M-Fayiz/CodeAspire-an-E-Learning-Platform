import { useAuth } from "@/context/auth.context";
import DashBoardHeader from "@/features/mentor/course/CourseDashBoard/DashboardHeader";
import { ChartAreaInteractive } from "@/features/mentor/course/CourseDashBoard/TrendGraph";
import { EnrolledService } from "@/service/Learner/enrolledCourse.service";
import type { CourseDashboardDTO } from "@/types/DTOS/courseDashboard.dto.type";
import CourseComment from "@/features/courses_list/Details/Comment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { IReviewDTO } from "@/types/DTOS/review.dto.type";
import { ReviewService } from "@/service/review.service";
import {
  Eye,
  IndianRupee,
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCourseFormContext } from "@/context/courseForm.context";
import BackTo from "@/components/common/Prev-Page";
const CourseDashboard = () => {
  const [dashboardData, setDashboardData] = useState<CourseDashboardDTO | null>(
    null,
  );
  const { setCourseId, setIsDraftReady } = useCourseFormContext();
  const [comment, setComment] = useState<IReviewDTO[] | null>(null);
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const data = await EnrolledService.getDashboardData(
        id as string,
        user!.id,
      );
      if (data) {
        setDashboardData(data);
      }
      const commentData = await ReviewService.getCourseReviews(id as string);
      setComment(commentData);
    })();
  }, [id]);

  const content = {
    stats: [
      {
        label: "Total Learners",
        value: dashboardData?.enrolledStudents,
        icon: Users,
      },
      {
        label: "Total Revenue",
        value: dashboardData?.revenue.mentor,
        icon: IndianRupee,
      },
      {
        label: "Total Courses",
        value: Math.floor(dashboardData?.avgRating as number),
        icon: TrendingUp,
      },
    ],
  };

  const navigate = useNavigate();
  const create = () => {
    setCourseId(dashboardData!.course._id);
    setIsDraftReady(true);
    navigate(`/mentor/courses/create?edit=${dashboardData!.course._id}`);
  };
  return (
    <div className="flex flex-col gap-6 px-2 md:px-0">
      {/* ================= Header ================= */}
      <BackTo />
      <div className="flex items-center gap-3">
        <LayoutDashboard className="text-gray-700" />
        <h1 className="text-3xl font-bold text-gray-800">Course Dashboard</h1>
      </div>

      {/* ================= Course Info Card ================= */}
      {dashboardData && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {dashboardData.course.title}
                </h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {dashboardData.course.status}
                </span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={create}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <Eye className="w-4 h-4" />
                Preview & Edit
              </button>

              <select className="border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
                <option>Today</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 12 Months</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ================= Stats Cards ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border shadow-sm p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <stat.icon className="w-6 h-6 text-gray-700" />
            </div>

            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= Chart + Comments ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
          <ChartAreaInteractive courseId={id as string} />
        </div>

        {/* Comments */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3 border-b pb-2">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <h4 className="font-semibold text-gray-800">
              Comments on Your Course
            </h4>
          </div>

          <div className="flex-1 overflow-y-auto">
            {comment && <CourseComment comment={comment} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard;
