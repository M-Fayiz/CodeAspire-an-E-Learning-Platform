import {
  Activity,
  BookCopy,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAuth } from "../../../context/auth.context";
import { Spinner } from "../../templates/Spinner";
import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import { adminService } from "@/service/admin/admin.service";
import type { IAdminDashboardDTO } from "@/types/DTOS/adminDashboard.type";

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [dashData, setDashData] = useState<IAdminDashboardDTO | null>(null);
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/auth/login" replace />;
  useEffect(() => {
    (async () => {
      const data = await adminService.getDashboardCardsdata();
      setDashData(data);
    })();
  }, []);

  const getDashboardContent = () => {
    switch (user.role) {
      case "admin":
        return {
          title: "Admin Dashboard",
          stats: [
            {
              label: "Total Learners",
              value: dashData?.totalLearners,
              icon: Users,
            },
            {
              label: "Total Mentors",
              value: dashData?.totalMentors,
              icon: BookCopy,
            },
            {
              label: "Total Revenue",
              value: dashData?.totalRevenue,
              icon: DollarSign,
            },
            {
              label: "Total Course",
              value: dashData?.totalCourses,
              icon: Activity,
            },
          ],
        };
      default:
        return { title: "Dashboard", stats: [] };
    }
  };

  const content = getDashboardContent();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {content.stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div
                className={`${stat.icon} w-12 h-12 rounded-lg flex items-center justify-center mr-4`}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-5">

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Performing Course
        </h3>
        <div className="space-y-4">
          {dashData?.topSelling.course.map((course, i) => (
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
                <span className="text-xs">{course.enrolledStudent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Performing Category
        </h3>
        <div className="space-y-4">
          {dashData?.topSelling.category.map((cat, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold  bg-gray-300`}
              >
                {cat.title.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{cat.title}</p>
                {/* <p className="text-xs text-gray-500">{course.time}</p> */}
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Users className="w-4 h-4" />
                <span className="text-xs">{cat.enrolledStudent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Sample activity item {item}
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
