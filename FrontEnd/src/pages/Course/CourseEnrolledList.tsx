import ManagementLayout from "@/components/layout/ManagementLayout";
import CourseCardSkeleton from "@/components/ui/cartSkelton";
import PaginationRounded from "@/components/ui/Pagination";
import { useAuth } from "@/context/auth.context";
import EnrolledCourseCart from "@/features/courses_list/Enrolled Course/enrolledCart";
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
  const [totalPage,setTotalPage]=useState(1)
    const { search, page, setSearch, setPage } =
    useSearchPagination()
    const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 200);
    useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
  if (!user?.id) return;

  (async () => {
    const data = await EnrolledService.getEnrolledCourse(user.id);

    if (data) {
      const uniqueCourses = Array.from(
        new Map(
          data.map((c: any) => [c.course._id, c])
        ).values()
      );

      setEnrolledCourses(uniqueCourses);
      setTotalPage(uniqueCourses.length);
    }
  })();
}, [user?.id, page]);


  const handlePage=(_e:React.ChangeEvent<unknown>,value:number)=>{
    
    setPage(value)
  }
  const filteredCourses = useMemo(() => {
    return enrolledCourse.filter((course) =>
      course.course.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search,enrolledCourse]);
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
        onChange={(e)=>setSearchInput(e.target.value)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((_, ind) => (
              <CourseCardSkeleton key={ind} />
            ))}
            <p>Please purchase a course and start your tech journey here</p>
          </div>
        )}
        <PaginationRounded currentPage={page} onPageChange={handlePage} totalPages={totalPage}/>
      </ManagementLayout>
    </>
  );
};

export default CourseEnrolledList;
