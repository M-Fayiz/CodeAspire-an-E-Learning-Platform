import StatsCard from "@/features/learner-dahboard/StateCard";

import { useEffect, useState } from "react";
import type {
  ILearnerStreask,
  learnerDashboardCardsDTO,
} from "@/types/DTOS/learnerDashboard.type";
import { useAuth } from "@/context/auth.context";
import { EnrolledService } from "@/service/Learner/enrolledCourse.service";

import {
  RevenueDonutChart,
  type PieChartProps,
} from "@/components/ui/PieGraph";
import LearnerDashboardSkeleton from "@/components/skelton/LearnerDashboardSkelton";
import LearningCalendar from "@/features/learner-dahboard/StreakStatus";
import InProgressCourseCard from "@/features/learner-dahboard/InprogressCourse";
import ManagementLayout from "@/components/layout/ManagementLayout";
import { Link } from "react-router";
import { LayoutDashboard } from "lucide-react";

export type IInterviewType = "Cracked" | "Failed";

const LearnerDashboard = () => {
  const { user } = useAuth();
  const [learnerDashboardData, setLearnerDashboardData] =
    useState<learnerDashboardCardsDTO | null>(null);
  const [circleChart, setCircleChart] = useState<
    PieChartProps<IInterviewType>[]
  >([]);
  useEffect(() => {
    (async () => {
      const dashData = await EnrolledService.learnerDashboardData();
      if (dashData) {
        setLearnerDashboardData(dashData);
        setCircleChart([
          { name: "Cracked", value: dashData.slotData.totalCracked },
          { name: "Failed", value: dashData.slotData.totalFailed },
        ]);
      }
    })();
  }, [user]);

  if (!learnerDashboardData) {
    return <LearnerDashboardSkeleton />;
  }
  return (
    <ManagementLayout
      title=" Learner Dashboard"
      description="Track your learning and interview performance"
      icon={<LayoutDashboard size={32}/>}
    >
      <div className="space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard
            title="Purchased Courses"
            value={learnerDashboardData?.courseData.courseCount as number}
          />
          <StatsCard
            title="Completed Courses"
            value={learnerDashboardData?.courseData.completedCourse as number}
          />
          <StatsCard
            title="In Progress"
            value={learnerDashboardData?.courseData.inProgressCourse as number}
          />
          <StatsCard
            title="Certificates Earned"
            value={learnerDashboardData?.TotalCertificate as number}
          />
          <StatsCard
            title="Interviews Attended"
            value={learnerDashboardData?.slotData.totalSession as number}
          />
          <StatsCard
            title="Cracked Interviews"
            value={learnerDashboardData?.slotData.totalCracked as number}
          />
          <StatsCard
            title="Failed Interviews"
            value={learnerDashboardData?.slotData.totalFailed as number}
          />
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

        <LearningCalendar
          streakData={learnerDashboardData.learnerStreak as ILearnerStreask}
          activeDates={learnerDashboardData.activeDays}
        />
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-md p-4 sm:p-6 h-full">
            <RevenueDonutChart Options={circleChart} />
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 h-full flex flex-col">
  {/* Section Heading */}
  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
    In Progress Courses
  </h2>

  {/* Content */}
  <div className="space-y-4 flex-1">
    {learnerDashboardData.inProgress.length > 0 ? (
      learnerDashboardData.inProgress.map((course) => (
        <Link
          to={`/learner/enrolled-courses/${course.enrolledId}`}
          key={course.enrolledId}
          className="block"
        >
          <InProgressCourseCard course={course} />
        </Link>
      ))
    ) : (
      <div className="flex items-center justify-center flex-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6">
        <p className="text-gray-500 text-sm sm:text-base">
          You don’t have any courses in progress yet.
        </p>
      </div>
    )}
  </div>
</div>

        </div>
      </div>
    </ManagementLayout>
  );
};

export default LearnerDashboard;
