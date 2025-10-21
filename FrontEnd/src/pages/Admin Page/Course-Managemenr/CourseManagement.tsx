import ManagementLayout from "@/components/layout/ManagementLayout";
import PaginationRounded from "@/components/ui/Pagination";

import SearchBar from "@/components/ui/searchBar";
import useDebounce from "@/hooks/useDebounce";
import courseService from "@/service/mentor/course.service";
import type { IFormCourseDTO } from "@/types/DTOS/courses.types";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  Target,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

export interface QueryProps {
  page: number;
  limit: number;
  search: string;
}
function CourseManagement() {
  const [courses, setCourse] = useState<IFormCourseDTO[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const SearchQuery = searchParams.get("search") || "";
  let debounced = useDebounce(SearchQuery, 500);
  useEffect(() => {
    (async () => {
      const data = await courseService.getAdminCourList();

      if (data) {
        setCourse(data);
        // setTotalPage()
      }
    })();
  }, []);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      page: "1",
      search: e.target.value,
    });
  };

  const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
    setSearchParams({
      page: String(page),
      search: SearchQuery,
    });
  };

  return (
    <ManagementLayout
      title="Course Management"
      description="Review and Manage Courses"
    >
      <SearchBar
        placeHolder="Courses"
        name="title"
        onChange={onSearchChange}
        searchQuery={SearchQuery}
      />
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
                      {/* {getStatusBadge(course.status)}
                          {getLevelBadge(course.level)} */}
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {course.mentorsId.name}
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

                {/* {course.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction('approve', course.id)}
                          disabled={processingIds.has(course.id)}
                          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction('reject', course.id)}
                          disabled={processingIds.has(course.id)}
                          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )} */}

                {/* {course.status === 'approved' && (
                      <button
                        onClick={() => handleAction('verify', course.id)}
                        disabled={processingIds.has(course.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Verify
                      </button>
                    )} */}
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
      {/* {courses.length > 0 && (
            <PaginationRounded
              currentPage={currentPage}
              totalPages={totalPage}
              onPageChange={handlePageChange}
            />
          )} */}
    </ManagementLayout>
  );
}

export default CourseManagement;
