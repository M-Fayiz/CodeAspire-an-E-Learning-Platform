import ManagementLayout from "@/components/layout/ManagementLayout";
import CourseCardSkeleton from "@/components/ui/cartSkelton";
import PaginationRounded from "@/components/ui/Pagination";
import { useAuth } from "@/context/auth.context";
import EnrolledCourseCart from "@/features/courses_list/Enrolled Course/EnrolledCart";
import useDebounce from "@/hooks/useDebounce";
import { useSearchPagination } from "@/hooks/useSearchQuery";
import { EnrolledService } from "@/service/Learner/enrolledCourse.service";
import type { IEnrolledListDto } from "@/types/DTOS/enrollements.dto.type";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CourseEnrolledList = () => {
  const { user } = useAuth();
  const [enrolledCourse, setEnrolledCourses] = useState<IEnrolledListDto[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading,setLoading]=useState(false)
  const { search, page, setSearch, setPage } = useSearchPagination();
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 200);
  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      setLoading(true)
      const data = await EnrolledService.getEnrolledCourse(user.id);

      if (data) {
        setEnrolledCourses(data);
        setTotalPage(data.length);
        setLoading(false)
      }
    })();
  }, [user?.id, page]);

  const handlePage = (_e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enrolledCourse.filter((course) =>
      course.course.title.toLowerCase().includes(q),
    );
  }, [search, enrolledCourse]);
  if(loading){
    return(
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((_, ind) => (
              <CourseCardSkeleton key={ind} />
            ))}
      </div>
    )
  }
  return (
    <>
      <ManagementLayout
        description="Boost your progress"
        title="Enrolled Course"
      >
        <div className="mb-3 bg-white p-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="search course"
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-sm 
        focus:outline-none focus:ring-2 focus:ring-black 
        focus:border-transparent transition"
          />
        </div>
        {enrolledCourse && enrolledCourse.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, ind) => (
              <Link key={course._id} to={`${course._id}`}>
                <EnrolledCourseCart key={ind} course={course} />
              </Link>
            ))}
          </div>
        ) : (
          
          <div className="flex flex-col items-center justify-center gap-6 text-center py-12">
            <p className="text-lg text-gray-600 max-w-md">
              Purchase a course and start your tech journey with structured learning and expert guidance.
            </p>

            <Link
              to="/courses"
              className="group inline-flex items-center justify-center px-10 py-4 rounded-full 
                        border-2 border-gray-300 text-base font-semibold text-gray-800
                        hover:border-[#FF7A00] hover:text-[#FF7A00]
                        hover:shadow-md transition-all duration-300"
            >
              Explore Courses
            </Link>
          </div>

        )}
        <PaginationRounded
          currentPage={page}
          onPageChange={handlePage}
          totalPages={totalPage}
        />
      </ManagementLayout>
    </>
  );
};

export default CourseEnrolledList;
