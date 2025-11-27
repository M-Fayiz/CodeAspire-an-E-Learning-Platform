// DraftCourses.tsx
import ManagementLayout from "@/components/layout/ManagementLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth.context";
import courseService from "@/service/mentor/course.service";
import type { IFormCourseDTO } from "@/types/DTOS/courses.dto.types";
import { Link, useSearchParams } from "react-router-dom";
import MyCourseCard from "@/features/mentor/course/MentorCours";
import { Spinner } from "@/components/templates/Spinner";

import { PlusCircle } from "lucide-react";
import PaginationRounded from "@/components/ui/Pagination";
import SearchHeader from "@/features/courses_list/List/CourseSearchBar";
import useDebounce from "@/hooks/useDebounce";

function MYCourses() {
  const [courses, setCourses] = useState<IFormCourseDTO[] | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPage, setTotalPage] = useState(1);
  const searchQuery = useDebounce(searchParams.get("search"), 500) || "";
  const currentPage = searchParams.get("page");

  useEffect(() => {
    async function fetchDraftedCourse() {
      setLoading(true);

      const data = await courseService.getMentorCourse(
        searchQuery,
        currentPage as string,
        user!.id,
      );
      setCourses(data.courseData || []);
      if (data.totalPage > 1) {
        setTotalPage(data.totalPage);
      }
      setLoading(false);
    }
    fetchDraftedCourse();
  }, [user, searchParams]);

  const handleEditCourse = (data: IFormCourseDTO) => {
    // const mappedCourse = CourseFormDTO(data);
    // setFormData({ ...mappedCourse });
    // console.log('_id form course',data._id)
  };
  const handleSearch = (query: string) => {
    setSearchParams((prv) => {
      prv.set("search", query);
      prv.set("page", "1");
      return prv;
    });
  };

  const handlePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(value));
      return prev;
    });
  };
  return (
    <ManagementLayout title="My Course List" description="Manage your courses">
      <div className="flex items-center justify-between p-6 gap-4">
        <Link
          to={"/mentor/courses/create"}
          className="flex items-center bg-gray-200 gap-2 px-6 py-3 rounded-sm shadow-md text-black transition-transform hover:scale-105"
        >
          <PlusCircle className="w-5 h-5" />
          Create Course
        </Link>

        {/* Search */}
        <div className="flex-1">
          <SearchHeader
            placeholder="Search Courses..."
            handleSearch={handleSearch}
          />
        </div>
      </div>

      {loading ? (
        <Spinner fullScreen variant="theme" />
      ) : courses && courses.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <Link to={`/mentor/courses/dashboard/${course._id}`}>
              <MyCourseCard
                course={course}
                key={course._id}
                onEdit={() => handleEditCourse(course)}
              />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No drafted courses found. Start creating one!
        </p>
      )}
      {courses && courses.length > 0 && (
        <div className="flex justify-center">
          <PaginationRounded
            currentPage={Number(currentPage)}
            totalPages={totalPage}
            onPageChange={handlePage}
          />
        </div>
      )}
    </ManagementLayout>
  );
}

export default MYCourses;
