import StatsCard from "@/features/learner-dahboard/StateCard";
import CourseStatusList from "@/features/learner-dahboard/CourseStatus";

import { useEffect, useState } from "react";
import type { learnerDashboardCardsDTO } from "@/types/DTOS/learnerDashboard.type";
import { useAuth } from "@/context/auth.context";
import { EnrolledService } from "@/service/Learner/enrolledCourse.service";
import LearnerDashboardSkeleton from "@/components/skelton/LearnerDashboard";
import { RevenueDonutChart, type PieChartProps } from "@/components/ui/PieGraph";

export type IInterviewType = "Cracked" | "Failed";

const LearnerDashboard = () => {
  const {user}=useAuth()
  const [learnerDashboardData,setLearnerDashboardData]=useState<learnerDashboardCardsDTO|null>(null)
  const [circleChart,setCircleChart]=useState<PieChartProps<IInterviewType>[]>([])
  useEffect(()=>{
    (async()=>{
      const dashData=await EnrolledService.learnerDashboardData(user!.id)
      if(dashData){
        setLearnerDashboardData(dashData)
        setCircleChart([{name:'Cracked',value:dashData.slotData.totalCracked},{name:'Failed',value:dashData.slotData.totalFailed}])
      }
    })()
  },[user])

  if(!learnerDashboardData){
    return <LearnerDashboardSkeleton/>
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-grey-500 p-4">
        <h1 className="text-2xl font-bold text-gray-900">Learner Dashboard</h1>
        <p className="text-gray-500">
          Track your learning and interview performance
        </p>
      </div>

     
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Purchased Courses" value={learnerDashboardData?.courseData.courseCount as number} />
        <StatsCard title="Completed Courses" value={learnerDashboardData?.courseData.completedCourse as number} />
        <StatsCard title="In Progress" value={learnerDashboardData?.courseData.inProgressCourse as number} />
        <StatsCard title="Certificates Earned" value={learnerDashboardData?.TotalCertificate as number} />
      </div>

    
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Interviews Attended" value={learnerDashboardData?.slotData.totalSession as number} />
        <StatsCard title="Cracked Interviews" value={learnerDashboardData?.slotData.totalCracked as number} />
        <StatsCard title="Failed Interviews" value={learnerDashboardData?.slotData.totalFailed as number} />
        {/* <StatsCard title="Success Rate" value="66%" /> */}
      </div>

      
      <CourseStatusList />

      
      <RevenueDonutChart  Options={circleChart}  />
    </div>
  );
};

export default LearnerDashboard;
