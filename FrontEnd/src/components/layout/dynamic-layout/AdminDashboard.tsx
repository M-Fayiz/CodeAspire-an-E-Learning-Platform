"use client";

import { BookCopy, IndianRupee, Users } from "lucide-react";
import { useAuth } from "../../../context/auth.context";
import { Spinner } from "../../templates/Spinner";
import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import { adminService } from "@/service/admin/admin.service";
import { EnrolledService } from "@/service/Learner/enrolledCourse.service";
import { FilterByDate } from "@/constants/filter.const";
import type { IAdminDashboardDTO } from "@/types/DTOS/adminDashboard.type";
import type { graphPrps } from "@/features/dashboard/Graph";
import RevenueChart from "@/features/dashboard/Graph";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RevenueDonutChart } from "@/components/ui/PieGraph";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const { user, loading } = useAuth();

  const [dashData, setDashData] = useState<IAdminDashboardDTO | null>(null);
  const [slotRevenue, setSlotRevenue] = useState<graphPrps[]>([]);
  const [signedUser, setSignedUsers] = useState<graphPrps[]>([]);
  const [courseRevenue, setCourseRevenue] = useState<graphPrps[]>([]);
  const [totalRevanue, setTotalRevanue] = useState(0);
  const [selectedTab, setSelectedTab] = useState("slot");
  const [selectedPeriod, setSelectedPeriod] = useState(FilterByDate.MONTH);

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/auth/login" replace />;

  useEffect(() => {
    (async () => {
      const data = await adminService.getDashboardCardsdata(selectedPeriod);

      setDashData(data);
      let total = data.SourceOfRevenue.reduce(
        (acc, vl) => (acc += vl.value),
        0,
      );
      setTotalRevanue(total);
    })();
  }, [selectedPeriod]);

  useEffect(() => {
    (async () => {
      const graph = await EnrolledService.adminGraphRevanue(selectedPeriod);

      if (graph) {
        setSlotRevenue(graph.slotRevanue || []);
        setCourseRevenue(graph.courseRevanue || []);
        setSignedUsers(graph.signedUsers || []);
      }
    })();
  }, [selectedPeriod]);

  const content = {
    title: "Admin Dashboard",
    stats: [
      { label: "Total Learners", value: dashData?.totalLearners, icon: Users },
      { label: "Total Mentors", value: dashData?.totalMentors, icon: Users },
      {
        label: "Total Revenue",
        value: totalRevanue,
        icon: IndianRupee,
      },
      { label: "Total Courses", value: dashData?.totalCourses, icon: BookCopy },
    ],
  };

  return (
    <div className="space-y-8">
      <div className=" bg-black p-5 rounded-lg flex justify-between  ">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white">Welcome back, {user.name}!</p>
        </div>
        <div>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {content.stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex items-center"
          >
            <div className="w-12 h-12 rounded-xl bg-white-800 flex items-center justify-center mr-4">
              <stat.icon className="w-6 h-6 text-black" />
            </div>

            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Top Performing Courses</h3>

          <div className="space-y-4">
            {/* {dashData?.topSelling.course.map((course, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-100 p-2 rounded-sm">
                <div className="w-10 h-10 rounded-sm bg-gray-400 text-white flex items-center justify-center font-bold">
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
            ))} */}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dashData?.topSelling.course.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.enrolledStudent}</TableCell>
                    <TableCell>₹{1000}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-2 w-60 mb-4 bg-black text-white">
              <TabsTrigger value="slot">Slot Revenue</TabsTrigger>
              <TabsTrigger value="course">Course Revenue</TabsTrigger>
            </TabsList>

            <TabsContent value="slot">
              <RevenueChart data={slotRevenue} label="Slot Revenue" />
            </TabsContent>

            <TabsContent value="course">
              <RevenueChart data={courseRevenue} label="Course Revenue" />
            </TabsContent>
          </Tabs>
        </div>

        <RevenueDonutChart Options={dashData?.SourceOfRevenue || []} />

        <div className="bg-white grid-cols-3 rounded-lg p-6 shadow-sm border border-gray-100 lg:col-span-2 ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Users</h2>
          </div>
          <RevenueChart data={signedUser} label="User Range" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
