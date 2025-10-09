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

const DashboardContent = () => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/auth/login" replace />;

  const getDashboardContent = () => {
    switch (user.role) {
      case "admin":
        return {
          title: "Admin Dashboard",
          stats: [
            { label: "Total Users", value: "1,234", icon: Users },
            { label: "Active Courses", value: "89", icon: BookCopy },
            { label: "Revenue", value: "$45,123", icon: DollarSign },
            { label: "System Health", value: "99.9%", icon: Activity },
          ],
        };
      case "learner":
        return {
          title: "My Learning Dashboard",
          stats: [
            { label: "Courses Enrolled", value: "8", color: "bg-blue-500" },
            { label: "Completed", value: "5", color: "bg-green-500" },
            { label: "Hours Learned", value: "127", color: "bg-purple-500" },
            { label: "Certificates", value: "3", color: "bg-orange-500" },
          ],
        };
      case "mentor":
        return {
          title: "Mentor Dashboard",
          stats: [
            { label: "Total Students", value: "156", icon: Users },
            { label: "Courses", value: "12", icon: BookCopy },
            // { label: "Rating", value: "4.8", icon: UserStar },
            // { label: "Earnings", value: "$3,456", icon: DollerSign },
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
        <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
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
export default DashboardContent;
