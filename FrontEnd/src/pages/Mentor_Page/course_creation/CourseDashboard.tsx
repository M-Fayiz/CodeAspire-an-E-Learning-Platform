import { useAuth } from "@/context/auth.context";
import DashBoardHeader from "@/features/mentor/course/CourseDashBoard/DashboardHeader";
import { ChartAreaInteractive } from "@/features/mentor/course/CourseDashBoard/TrendGraph";
import { EnrolledService } from "@/service/Learner/enrolledCourse.service";
import type { CourseDashboardDTO } from "@/types/DTOS/courseDashboard.dto.type";
import CourseComment from "@/features/courses_list/Details/Comment";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { IReviewDTO } from "@/types/DTOS/review.dto.type";
import { ReviewService } from "@/service/review.service";
import { MessageSquare } from "lucide-react";
const CourseDashboard = () => {
  const [dashboardData, setDashboardData] = useState<CourseDashboardDTO | null>(
    null,
  );
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

  return (
    <>
      {dashboardData && <DashBoardHeader courseData={dashboardData} />}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ChartAreaInteractive courseId={id as string} />
        </div>

        <div className="col-span-1 bg-white rounded-2xl shadow p-4 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <h4 className="text-base font-semibold text-gray-800">
              Comments on Your Course
            </h4>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {comment && <CourseComment comment={comment} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDashboard;
