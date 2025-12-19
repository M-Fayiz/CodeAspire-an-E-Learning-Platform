import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Course {
  title: string;
  status: "Purchased" | "In Progress" | "Completed";
}

const dummyCourses: Course[] = [
  { title: "MERN Stack Mastery", status: "Completed" },
  { title: "System Design Basics", status: "In Progress" },
  { title: "Data Structures in JS", status: "Purchased" },
];

const statusColor = {
  Purchased: "bg-gray-200 text-gray-800",
  "In Progress": "bg-gray-900 text-white",
  Completed: "bg-green-600 text-white",
};

const CourseStatusList = () => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Course Progress
        </h3>

        <div className="space-y-3">
          {dummyCourses.map((course, index) => (
            <div key={index} className="flex items-center justify-between">
              <p className="text-gray-700">{course.title}</p>
              <Badge className={statusColor[course.status]}>
                {course.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseStatusList;
