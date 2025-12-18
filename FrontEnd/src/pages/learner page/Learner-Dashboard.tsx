import StatsCard from "@/features/learner-dahboard/StateCard"; 
import CourseStatusList from "@/features/learner-dahboard/CourseStatus";
import InterviewCharts from "@/features/learner-dahboard/InterviewChart"; 

const LearnerDashboard = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Learner Dashboard
        </h1>
        <p className="text-gray-500">
          Track your learning and interview performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Purchased Courses" value={6} />
        <StatsCard title="Completed Courses" value={3} />
        <StatsCard title="In Progress" value={2} />
        <StatsCard title="Certificates Earned" value={3} />
      </div>

      {/* Interview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Interviews Attended" value={12} />
        <StatsCard title="Cracked Interviews" value={8} />
        <StatsCard title="Failed Interviews" value={4} />
        <StatsCard title="Success Rate" value="66%" />
      </div>

      {/* Course List */}
      <CourseStatusList />

      {/* Charts */}
      <InterviewCharts />

    </div>
  );
};

export default LearnerDashboard;
