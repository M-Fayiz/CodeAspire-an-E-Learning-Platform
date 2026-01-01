import StatsCard from "@/features/learner-dahboard/StateCard";

import { useEffect, useState } from "react";
import type { ILearnerStreask, learnerDashboardCardsDTO } from "@/types/DTOS/learnerDashboard.type";
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
      const dashData = await EnrolledService.learnerDashboardData(user!.id);
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
    <ManagementLayout title=" Learner Dashboard" description="Track your learning and interview performance">

  <div className="space-y-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

    

      {/* <LearningCalendar
        streakData={learnerDashboardData.learnerStreak as ILearnerStreask}
        activeDates={learnerDashboardData.activeDays}
      /> */}


   
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div className="bg-white rounded-md p-4 sm:p-6 h-full">
    <RevenueDonutChart Options={circleChart} />
  </div>
  <div className="bg-white rounded-md p-4 sm:p-6 h-full">
    <h2>Inprogress Courses</h2>
      {learnerDashboardData.inProgress.length>0?
     learnerDashboardData.inProgress.map((course) => (
      <Link  to={`/learner/enrolled-courses/${course.enrolledId}`} key={course.enrolledId}>
          <InProgressCourseCard
           
            course={course}
          />
      </Link>
        )):(
           <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 text-center">
        <p className="text-gray-500 text-sm sm:text-base">
          You don’t have any course in progress right now.
        </p>
      </div>
        )}
  </div>
</div>

  </div>
    </ManagementLayout>
);

};

export default LearnerDashboard;
