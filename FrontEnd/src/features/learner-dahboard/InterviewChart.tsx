import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const interviewResultData = [
  { name: "Cracked", value: 65 },
  { name: "Failed", value: 35 },
];

const interviewStats = [
  { name: "Attended", value: 12 },
  { name: "Cracked", value: 8 },
  { name: "Failed", value: 4 },
];

const COLORS = ["#111827", "#D1D5DB"]; // black & gray

const InterviewCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Circle Graph */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-4">Interview Success Rate</h3>

          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={interviewResultData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {interviewResultData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Graph */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-4">Interview Summary</h3>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={interviewStats}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" fill="#111827" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewCharts;
