import ManagementLayout from "@/components/layout/ManagementLayout";
import PaginationRounded from "@/components/ui/Pagination";
import useDebounce from "@/hooks/useDebounce";
import { useSearchPagination } from "@/hooks/useSearchQuery";
import courseService from "@/service/mentor/course.service";
import type { IFormCourseDTO } from "@/types/DTOS/courses.dto.types";
import { BookOpen, Calendar, Eye, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export interface QueryProps {
  page: number;
  limit: number;
  search: string;
}
function CourseManagement() {
  const [courses, setCourse] = useState<IFormCourseDTO[]>([]);
   const { search, page, setSearch, setPage } = useSearchPagination()
   const [searchInput, setSearchInput] = useState(search);
    const [totalPage, setTotalPage] = useState(1);
     const debouncedSearch = useDebounce(searchInput, 200);
        useEffect(() => {
        setSearch(debouncedSearch);
      }, [debouncedSearch]);
    
  useEffect(() => {
    (async () => {
      const data = await courseService.getAdminCourList(search,page);

      if (data) {
        setCourse(data);
        setTotalPage(1);
      }
    })();
  }, [search,page]);



  const handlePageChange = (_e: React.ChangeEvent<unknown>, page: number) => {
      setPage(page)
  };

  return (
    <ManagementLayout
      title="Course Management"
      description="Review and Manage Courses"
    >
       <div className="relative mb-6 bg-white p-3 rounded-lg shadow-sm">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search users"
        className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-300 rounded-md
        focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
      />
    </div>
      {courses.length > 0 ? (
        courses.map((course) => (
          <div
            key={course._id}
            className="p-4 bg-[#ffffff] mb-2 rounded-sm shadow-sm hover:bg-grey-50 transition-colors"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <img src={course.thumbnail} width={200} alt="" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {course.mentorId.name}
                        </span>
                        {/* <span className="text-xs text-gray-500">({course.mentor.rating}★)</span> */}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {new Date(course.updated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        ₹ {course.price}
                      </span>
                      {/* <span>{course.duration}h duration</span> */}
                      <span>{course.sessions.length} sessioms</span>
                      <span className="text-blue-600">
                        {course.category.title}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* {course.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {tag}
                            </span>
                          ))} */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                <Link
                  to={`/admin/courses/${course._id}`}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>

          
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No courses found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      )}
      {courses.length > 0 && (
        <PaginationRounded
          currentPage={page}
          totalPages={totalPage}
          onPageChange={handlePageChange}
        />
      )}
    </ManagementLayout>
  );
}

export default CourseManagement;
