"use client";

import { useEffect, useState } from "react";
import { DollarSign, Users, Star } from "lucide-react";

import type { IMentorDhasboardDTO } from "@/types/DTOS/mentorDashboard.dto.type";
import { useAuth } from "@/context/auth.context";
import { EnrolledService } from "@/service/Learner/enrolledCourse.service";
import StatCard from "./DashboardCard";
import MentorDashboardSkeleton from "@/components/shared/Dashboard";
import { useNavigate } from "react-router";
import { FilterByDate } from "@/constants/filter.const";

import { RevenueDonutChart } from "@/components/ui/PieGraph";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { graphPrps } from "@/features/dashboard/Graph";
import RevenueChart from "@/features/dashboard/Graph";
// import { RevenueStackedChart } from "@/components/chart/StackedChart";

const EMPTY_CHART: graphPrps[] = [];

export default function MentorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(FilterByDate.MONTH);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [mentorDashData, setMentorDashData] =
    useState<IMentorDhasboardDTO | null>(null);

  const [slotRevenue, setSlotRevenue] = useState<graphPrps[]>(EMPTY_CHART);
  const [courseRevenue, setCourseRevenue] = useState<graphPrps[]>(EMPTY_CHART);

  useEffect(() => {
    if (!user) return;

    (async () => {
      setLoading(true);
      const data = await EnrolledService.getMentorDashboardData(
        selectedPeriod,
      );

      if (!data) {
        navigate("/course/create");
        return;
      }

      setMentorDashData(data);
      let total = data.revanue.reduce((acc, vl) => (acc += vl.value), 0);
      setTotalRevenue(total);
      setLoading(false);
    })();
  }, [user, selectedPeriod]);

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

  return (
    <>
      {loading && <MentorDashboardSkeleton />}

      <div className="min-h-screen bg-gray-50 sm:p-2">
        <div className="bg-black p-5 rounded-lg flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Mentor Dashboard</h1>
            <p className="text-white">Welcome back, {user!.name}!</p>
          </div>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border bg-white rounded-md px-3 py-2 text-black text-sm"
          >
            <option value={FilterByDate.Today}>Today</option>
            <option value={FilterByDate.WEEK}>Last 7 Days</option>
            <option value={FilterByDate.MONTH}>Last 30 Days</option>
            <option value={FilterByDate.YEAR}>Last 12 Months</option>
          </select>
        </div>

        <div className="max-w-7xl mx-auto mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              Icon={<DollarSign className="w-5 h-5 text-white" />}
              title="Total Revenue"
              value={totalRevenue || 0}
            />

            <StatCard
              Icon={<Star className="w-5 h-5 text-white" />}
              title="Average Rating"
              value={mentorDashData?.summary.avgRating || 0}
            />

            <StatCard
              Icon={<Users className="w-5 h-5 text-white" />}
              title="Total Students"
              value={mentorDashData?.summary.totalStudents || 0}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-center">
                Course Revenue
              </h2>
              <RevenueChart data={courseRevenue} label="Course Revenue" />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-center">
                Slot Revenue
              </h2>
              <RevenueChart data={slotRevenue} label="Slot Revenue" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Courses */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Top Performing Courses
              </h3>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead className="text-right">Enrolled</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {mentorDashData?.topCourse.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell className="text-right">
                        {item.enrolledStudent}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center justify-center">
              <RevenueDonutChart Options={mentorDashData?.revanue || []} />
            </div>
            {/* <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center justify-center"> */}
            {/* <RevenueStackedChart /> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
