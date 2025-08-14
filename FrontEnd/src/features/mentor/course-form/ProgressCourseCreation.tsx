import { useAuth } from "@/context/auth.context";
import { useEffect, useState } from "react";
import courseService from "@/service/client-API/mentor/course.service";
import type { ICourseDTO } from "@/types/courses.types";

export default function DraftTable() {
  const [draftCourse, setDraftCourse] = useState<ICourseDTO[]>([]);
  const { user } = useAuth();
  console.log("user from context", user);
  useEffect(() => {
    async function getDraftedCourse() {
      const data = await courseService.getMentorDraftedCourse(user!.id);
      if (data) {
        setDraftCourse(data);
      }
    }
    getDraftedCourse();
  }, []);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {draftCourse &&
          draftCourse.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 cursor-pointer"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {course.title}
              </h2>
              <p className="text-sm text-gray-600">
                {course.description || "No description available"}
              </p>
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
