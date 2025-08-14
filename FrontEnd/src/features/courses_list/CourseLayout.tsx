import { useLoaderData } from "react-router";
import CourseCard from "./CourseCard";
import type { ICourseListDTO } from "@/types/courses.types";
import SearchHeader from "./CourseSearchBar";
import FilterSidebar from "./CourseFilter";

function CourseLayout() {
  const courses = useLoaderData() as ICourseListDTO[];
  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <SearchHeader />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* <div className="lg:col-span-1"> */}
            {/* <FilterSidebar /> */}
            {/* </div> */}

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseLayout;
