import { useMemo } from "react";
import type { IUserType } from "../../../types/profile.type";
import { GraduationCap, Users } from "lucide-react";

export const StatsCards: React.FC<{ users: IUserType[]}> = ({ users }) => {
  const stats = useMemo(() => {
    const mentors = users.filter(u => u.role === 'mentor');
    const learners = users.filter(u => u.role === 'learner');
    const activeUsers = users.filter(u => u.isActive === true);
    
    return {
      totalUsers: users.length,
      mentors: mentors.length,
      learners: learners.length,
      activeUsers: activeUsers.length
    };
  }, [users]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
          <Users className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Mentors</p>
            <p className="text-2xl font-bold text-blue-600">{stats.mentors}</p>
          </div>
          <GraduationCap className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Learners</p>
            <p className="text-2xl font-bold text-purple-600">{stats.learners}</p>
          </div>
          <Users className="h-8 w-8 text-purple-600" />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Users</p>
            <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
          </div>
          <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
            <div className="h-2 w-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};