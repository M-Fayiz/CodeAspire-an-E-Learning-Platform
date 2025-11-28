"use client";

import { useEffect, useState } from "react";
import { DollarSign, Users, Star } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { IMentorDhasboardDTO } from "@/types/DTOS/mentorDashboard.dto.type";
import { useAuth } from "@/context/auth.context";
import { EnrolledService } from "@/service/Learner/enrolledCourse.service";
import StatCard from "./DashboardCard";
import MentorDashboardSkeleton from "@/components/shared/Dashboard";
import { useNavigate } from "react-router";
import { FilterByDate } from "@/constants/filter.const";
import RevenueChart, { type RevenuePoint } from "@/features/dashboard/graph";
import { RevenueDonutChart } from "@/components/ui/PieGraph";

const EMPTY_CHART: RevenuePoint[] = [];

export default function MentorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(FilterByDate.MONTH);
  const [selectedTab, setSelectedTab] = useState("slot");
  const [totalRevenue,setTotalRevenue]=useState(0)
  const [mentorDashData, setMentorDashData] =
    useState<IMentorDhasboardDTO | null>(null);

  const [slotRevenue, setSlotRevenue] = useState<RevenuePoint[]>(EMPTY_CHART);
  const [courseRevenue, setCourseRevenue] =
    useState<RevenuePoint[]>(EMPTY_CHART);

  useEffect(() => {
    if (!user) return;

    (async () => {
      setLoading(true);
      const data = await EnrolledService.getMentorDashboardData(user!.id);

      if (!data) {
        navigate("/course/create");
        return;
      }

      setMentorDashData(data);
      let total=data.revanue.reduce((acc,vl)=>acc+=vl.value,0)
      setTotalRevenue(total)
      setLoading(false);
    })();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const graph = await EnrolledService.graphForRevenue(
        selectedPeriod,
        user.id,
      );

      if (graph) {
        setSlotRevenue(graph.slotRevanue || EMPTY_CHART);
        setCourseRevenue(graph.courseRevanue || EMPTY_CHART);
      }
    })();
  }, [selectedPeriod, user]);

  const currentGraph = selectedTab === "slot" ? slotRevenue : courseRevenue;

  return (
    <>
      {loading && <MentorDashboardSkeleton />}

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              Icon={<DollarSign className="w-5 h-5 text-white" />}
              title="Total Revenue"
              value={totalRevenue || 0}
              bgColor="bg-gradient-to-br from-orange-400 to-orange-600"
            />

            <StatCard
              Icon={<Star className="w-5 h-5 text-white" />}
              title="Average Rating"
              value={mentorDashData?.summary.avgRating || 0}
              bgColor="bg-gradient-to-br from-orange-400 to-orange-600"
            />

            <StatCard
              Icon={<Users className="w-5 h-5 text-white" />}
              title="Total Students"
              value={mentorDashData?.summary.totalStudents || 0}
              bgColor="bg-gradient-to-br from-gray-700 to-gray-900"
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Revenue Overview</h2>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={FilterByDate.Today}>Today</SelectItem>
                  <SelectItem value={FilterByDate.WEEK}>Last 7 Days</SelectItem>
                  <SelectItem value={FilterByDate.MONTH}>
                    Last 30 Days
                  </SelectItem>
                  <SelectItem value={FilterByDate.YEAR}>
                    Last 12 Months
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-[240px] mb-4">
                <TabsTrigger value="slot">Slot Revenue</TabsTrigger>
                <TabsTrigger value="course">Course Revenue</TabsTrigger>
              </TabsList>

              <TabsContent value="slot">
                <RevenueChart data={slotRevenue} />
              </TabsContent>

              <TabsContent value="course">
                <RevenueChart data={courseRevenue} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex gap-5">

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">
              Top Performing Courses
            </h3>

            <div className="space-y-4">
              {mentorDashData?.topCourse.map((course, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold bg-gray-400">
                    {course.title.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">{course.title}</p>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">{course.enrolledStudent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
           <RevenueDonutChart Options={mentorDashData?.revanue||[] }/>
          </div>
        </div>
      </div>
    </>
  );
}
