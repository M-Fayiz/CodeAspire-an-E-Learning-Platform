import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, Users, Star } from "lucide-react";
import type { IMentorDhasboardDTO } from "@/types/DTOS/mentorDashboard.dto";
import { useAuth } from "@/context/auth.context";
import { EnrolledService } from "@/service/Learner/enrolledCourse.service";
import StatCard from "./mentor dashboard/DashboardCard";
import MentorDashboardSkeleton from "@/components/shared/Dashboard";
import { useNavigate } from "react-router";

const MentorDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 12 Month");
  const [mentorDashData, setMentorDashData] =
    useState<IMentorDhasboardDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await EnrolledService.getMentorDashboardData(user!.id);

      if (data) {
        setMentorDashData(data);
        setLoading(false);
      } else {
        navigate("/course/create");
      }
    })();
  }, [user]);

  return (
    <>
      {loading && <MentorDashboardSkeleton />}
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              Icon={<DollarSign className="w-5 h-5 text-white" />}
              title="Total Revenue"
              value={
                mentorDashData?.revanue
                  ? (mentorDashData?.revanue as number)
                  : 0
              }
              bgColor="bg-gradient-to-br from-orange-400 to-orange-600"
            />
            <StatCard
              Icon={<Star className="w-5 h-5 text-white" />}
              title="Average Rating"
              value={
                mentorDashData?.summary.avgRating
                  ? (mentorDashData?.summary.avgRating as number)
                  : 0
              }
              bgColor="bg-gradient-to-br from-orange-400 to-orange-600"
            />
            <StatCard
              Icon={<Users className="w-5 h-5 text-white" />}
              title="Total Student"
              value={
                mentorDashData?.summary.totalStudents
                  ? (mentorDashData?.summary.totalStudents as number)
                  : 0
              }
              bgColor="bg-gradient-to-br from-gray-700 to-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-700 rounded"></div>
                      <span className="text-gray-600">Course Visit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span className="text-gray-600">Course Sale</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-600 rounded"></div>
                      <span className="text-gray-600">Revenue</span>
                    </div>
                  </div>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>Last 12 Month</option>
                    <option>Last 6 Month</option>
                    <option>Last 3 Month</option>
                  </select>
                </div>
              </div>

              {/* <div className="relative h-64">
              <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">
                {revenueData.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                      <div 
                        className="w-full bg-orange-600 rounded-t"
                        style={{ height: `${(data.revenue / maxValue) * 100}%` }}
                      ></div>
                      <div 
                        className="w-full bg-orange-500"
                        style={{ height: `${(data.courseSale / maxValue) * 100}%` }}
                      ></div>
                      <div 
                        className="w-full bg-gray-700 rounded-b"
                        style={{ height: `${(data.courseVisit / maxValue) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
            </div> */}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Performing Course
                </h3>
                <div className="space-y-4">
                  {mentorDashData?.topCourse.map((course, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold  bg-gray-300`}
                      >
                        {course.title.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {course.title}
                        </p>
                        {/* <p className="text-xs text-gray-500">{course.time}</p> */}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Users className="w-4 h-4" />
                        <span className="text-xs">
                          {course.enrolledStudent}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Earnings */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Earnings
                  </h3>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Today Earning</p>
                    <p className="text-xl font-bold text-gray-900">$15,010</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pending</p>
                    <p className="text-xl font-bold text-orange-500">$58</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">In Review</p>
                    <p className="text-xl font-bold text-gray-900">$70</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-medium text-sm transition-colors">
                    Available
                    <br />
                    $167
                  </button>
                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium text-sm transition-colors">
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorDashboard;
